Param(
  [Parameter(Mandatory = $true)][string]$KtpmRoot,
  [Parameter(Mandatory = $true)][string]$RefRoot,
  [Parameter(Mandatory = $true)][string]$OutReportPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

trap {
  Write-Host "ERROR: $($_.Exception.Message)"
  if ($_.InvocationInfo -and $_.InvocationInfo.PositionMessage) {
    Write-Host $_.InvocationInfo.PositionMessage
  }
  exit 1
}

function New-TempDir {
  $base = Join-Path $env:TEMP ("docs-prov-" + [Guid]::NewGuid().ToString('N'))
  New-Item -ItemType Directory -Force -Path $base | Out-Null
  return $base
}

function Normalize-Text([string]$text) {
  if ($null -eq $text) { return "" }
  $t = $text -replace "`r`n", "`n"
  $t = $t -replace "`r", "`n"
  $t = $t -replace "[\t\f\v]+", " "
  $t = $t -replace "[ ]{2,}", " "
  # keep newlines for line metrics; trim each line later
  return $t
}

function Split-Lines([string]$text) {
  $norm = Normalize-Text $text
  $lines = $norm -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }
  return ,$lines
}

function Split-Tokens([string]$text) {
  $norm = (Normalize-Text $text) -replace "`n+", " "
  $tokens = $norm.Split([char[]]@(' '), [System.StringSplitOptions]::RemoveEmptyEntries)
  return ,$tokens
}

function Get-LineOverlapPct($aLines, $bLines) {
  # Set-based overlap (exact line text). This measures how many unique lines are identical across both.
  $aSet = [System.Collections.Generic.HashSet[string]]::new([string[]]$aLines)
  $bSet = [System.Collections.Generic.HashSet[string]]::new([string[]]$bLines)
  $intersect = 0
  foreach ($l in $aSet) { if ($bSet.Contains($l)) { $intersect++ } }
  $den = [Math]::Max($aSet.Count, $bSet.Count)
  if ($den -eq 0) { return 0.0 }
  return [Math]::Round(100.0 * ($intersect / $den), 1)
}

function Get-AlignedTokenMatchPct($aTokens, $bTokens) {
  $n = [Math]::Min($aTokens.Count, $bTokens.Count)
  if ($n -eq 0) { return 0.0 }
  $eq = 0
  for ($i = 0; $i -lt $n; $i++) {
    if ($aTokens[$i] -ceq $bTokens[$i]) { $eq++ }
  }
  return [Math]::Round(100.0 * ($eq / $n), 1)
}

function Get-FirstIdenticalSnippet([string[]]$aTokens, [string]$bText, [int]$window = 14) {
  if ($aTokens.Count -lt $window) { return $null }
  $bNorm = (Normalize-Text $bText) -replace "`n+", " "
  for ($i = 0; $i -le ($aTokens.Count - $window); $i++) {
    $snippet = ($aTokens[$i..($i + $window - 1)] -join ' ')
    if ($bNorm.Contains($snippet)) {
      return $snippet
    }
  }
  return $null
}

function Read-ZipEntryText([string]$zipPath, [string]$entryName) {
  Add-Type -AssemblyName System.IO.Compression.FileSystem | Out-Null
  $zip = $null
  try {
    $zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
    $entry = $zip.GetEntry($entryName)
    if ($null -eq $entry) { return @{ ok = $false; text = ''; reason = "missing $entryName" } }
    $stream = $entry.Open()
    $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8, $true)
    $text = $reader.ReadToEnd()
    $reader.Dispose()
    $stream.Dispose()
    return @{ ok = $true; text = $text; reason = '' }
  } catch {
    return @{ ok = $false; text = ''; reason = $_.Exception.Message }
  } finally {
    if ($zip) { $zip.Dispose() }
  }
}

function Detect-Headings([string[]]$lines) {
  $heads = New-Object System.Collections.Generic.List[string]
  foreach ($l in $lines) {
    if ($l -match '^(\d+(\.\d+)*[\)\.]?\s+).+' -or $l -match '^[A-Z0-9][A-Z0-9 \-]{6,}$' -or $l -match '.*:$') {
      $heads.Add($l)
    }
  }
  return ,$heads.ToArray()
}

function Headings-StructuralSimilarity([string[]]$aLines, [string[]]$bLines) {
  $a = Detect-Headings $aLines
  $b = Detect-Headings $bLines
  if ($a.Count -eq 0 -and $b.Count -eq 0) { return 'Absent' }
  $aSet = [System.Collections.Generic.HashSet[string]]::new([string[]]$a)
  $bSet = [System.Collections.Generic.HashSet[string]]::new([string[]]$b)
  $inter = 0
  foreach ($h in $aSet) { if ($bSet.Contains($h)) { $inter++ } }
  $den = [Math]::Max($aSet.Count, $bSet.Count)
  if ($den -eq 0) { return 'Absent' }
  $ratio = $inter / $den
  return $(if ($ratio -ge 0.6) { 'Present' } else { 'Absent' })
}

function Extract-DocxText([string]$path) {
  try {
    $docXml = Read-ZipEntryText $path 'word/document.xml'
    if (-not $docXml.ok) { return @{ ok = $false; text = ''; reason = $docXml.reason } }
    [xml]$xml = $docXml.text
    $nodes = $xml.SelectNodes('//*[local-name()="t"]')
    $sb = New-Object System.Text.StringBuilder
    foreach ($n in $nodes) {
      $val = $n.InnerText
      if ($val) { [void]$sb.AppendLine($val) }
    }
    return @{ ok = $true; text = $sb.ToString(); reason = '' }
  } catch {
    return @{ ok = $false; text = ''; reason = $_.Exception.Message }
  }
}

function Extract-XlsxTextAndStructure([string]$path) {
  try {
    $workbookXml = Read-ZipEntryText $path 'xl/workbook.xml'
    $sharedStringsXml = Read-ZipEntryText $path 'xl/sharedStrings.xml'

    $sheetNames = @()
    if ($workbookXml.ok) {
      [xml]$wb = $workbookXml.text
      $sheets = $wb.SelectNodes('//*[local-name()="sheet"]')
      foreach ($s in $sheets) {
        $name = $s.GetAttribute('name')
        if ($name) { $sheetNames += $name }
      }
    }

    $shared = @()
    if ($sharedStringsXml.ok) {
      [xml]$ss = $sharedStringsXml.text
      $tis = $ss.SelectNodes('//*[local-name()="si"]')
      foreach ($si in $tis) {
        $tNodes = $si.SelectNodes('.//*[local-name()="t"]')
        $val = ($tNodes | ForEach-Object { $_.InnerText }) -join ''
        if ($val) { $shared += $val }
      }
    }

    if (-not $workbookXml.ok -and -not $sharedStringsXml.ok) {
      return @{ ok = $false; text = ''; sheetNames = @(); reason = "missing workbook.xml and sharedStrings.xml" }
    }

    # Extract a lightweight text corpus from the shared string table.
    $text = ($shared -join "`n")
    return @{ ok = $true; text = $text; sheetNames = $sheetNames; reason = '' }
  } catch {
    return @{ ok = $false; text = ''; sheetNames = @(); reason = $_.Exception.Message }
  }
}

function RelPath([string]$path, [string]$root) {
  if (-not $path) { return '(none)' }
  $p = $path
  $r = $root.TrimEnd('\\')
  $escaped = [Regex]::Escape($r)
  return ($p -ireplace "^$escaped[\\/]", '')
}

function Get-RewriteNeededMdPath([string]$refFile, [string]$ktpmRoot, [string]$refRoot) {
  $refDocsRoot = Join-Path $refRoot 'docs\tests'
  if (-not ($refFile.ToLowerInvariant().StartsWith($refDocsRoot.ToLowerInvariant()))) { return $null }
  $rel = $refFile.Substring($refDocsRoot.Length).TrimStart('\\')
  $dir = Split-Path $rel -Parent
  $stem = [System.IO.Path]::GetFileNameWithoutExtension($rel)
  $baseDir = Join-Path (Join-Path $ktpmRoot 'docs\adapted') $dir
  return Join-Path $baseDir ($stem + '_REWRITE_NEEDED.md')
}

function Has-ProvenanceHeader([string]$path) {
  try {
    $head = Get-Content -Path $path -TotalCount 40 -Encoding UTF8
    return ($head -join "`n") -match 'NOTE \(Provenance\)'
  } catch {
    return $false
  }
}

function Extract-PlainText([string]$path) {
  try {
    $txt = Get-Content -Raw -Encoding UTF8 $path
    return @{ ok = $true; text = $txt; reason = '' }
  } catch {
    return @{ ok = $false; text = ''; reason = $_.Exception.Message }
  }
}

function Verdict([double]$pct) {
  if ($pct -ge 80) { return 'COPIED_VERBATIM' }
  if ($pct -ge 50) { return 'HEAVY_SIMILARITY' }
  return 'OK_TO_ADAPT'
}

function Get-SimilarityPct([double]$alignedTokenPct, [double]$lineOverlapPct) {
  # Conservative: flag if either exact token alignment OR exact line overlap is high.
  return [Math]::Round([Math]::Max($alignedTokenPct, $lineOverlapPct), 1)
}

# 1) Collect candidates
$refDocs = Get-ChildItem -Path (Join-Path $RefRoot 'docs\tests') -Recurse -File -Include *.docx,*.doc,*.xlsx -ErrorAction SilentlyContinue
$refK6 = Get-ChildItem -Path (Join-Path $RefRoot 'performance\k6') -Recurse -File -Include *.js -ErrorAction SilentlyContinue

$ktpmRefDocs = Get-ChildItem -Path (Join-Path $KtpmRoot 'docs\ref') -Recurse -File -Include *.docx,*.doc,*.xlsx -ErrorAction SilentlyContinue
$ktpmDocsText = Get-ChildItem -Path (Join-Path $KtpmRoot 'docs') -Recurse -File -Include *.md,*.csv,*.xlsx -ErrorAction SilentlyContinue
$ktpmK6 = Get-ChildItem -Path (Join-Path $KtpmRoot 'performance\k6') -Recurse -File -Include *.js -ErrorAction SilentlyContinue

$comparisons = @()

# 2) Compare ref docs/tests -> ktpm docs/ref (by relative path)
foreach ($f in $refDocs) {
  $rel = $f.FullName.Substring((Join-Path $RefRoot 'docs\tests').Length).TrimStart('\')
  $kt = Join-Path (Join-Path $KtpmRoot 'docs\ref') $rel

  $row = [ordered]@{
    refFile = $f.FullName
    ktpmFile = $(if (Test-Path $kt) { $kt } else { $null })
    fileType = $f.Extension.ToLowerInvariant()
    parse = $null
    lineOverlapPct = $null
    alignedTokenPct = $null
    similarityPct = $null
    structuralSimilarity = $null
    verdict = $null
    excerpt = $null
    action = $null
    notes = $null
  }

  if (-not (Test-Path $kt)) {
    $row.parse = 'NO_MATCH_IN_KTPM'
    $row.verdict = 'N/A'
    $row.action = 'flagged'
    $row.notes = 'No corresponding file found in ktpm/docs/ref by relative path.'
    $comparisons += [pscustomobject]$row
    continue
  }

  $a = $null
  $b = $null
  $aStruct = $null
  $bStruct = $null

  if ($row.fileType -eq '.docx') {
    $a = Extract-DocxText $f.FullName
    $b = Extract-DocxText $kt
    if (-not $a.ok -or -not $b.ok) {
      $row.parse = 'BINARY_NO_PARSE'
      $row.verdict = 'BINARY_NO_PARSE'
      $row.action = 'flagged'
      $row.notes = "DOCX parse failure. ref: $($a.reason); ktpm: $($b.reason)"
      $comparisons += [pscustomobject]$row
      continue
    }
    $aLines = Split-Lines $a.text
    $bLines = Split-Lines $b.text
    $aTok = Split-Tokens $a.text
    $bTok = Split-Tokens $b.text

    $row.parse = 'OK'
    $row.lineOverlapPct = Get-LineOverlapPct $aLines $bLines
    $row.alignedTokenPct = Get-AlignedTokenMatchPct $aTok $bTok
    $row.similarityPct = Get-SimilarityPct $row.alignedTokenPct $row.lineOverlapPct
    $row.structuralSimilarity = Headings-StructuralSimilarity $aLines $bLines
    $row.verdict = Verdict $row.similarityPct
    $row.excerpt = Get-FirstIdenticalSnippet $aTok $b.text

    if ($row.verdict -eq 'COPIED_VERBATIM') {
      $rewrite = Get-RewriteNeededMdPath $f.FullName $KtpmRoot $RefRoot
      $row.action = $(if ($rewrite -and (Test-Path $rewrite)) { 'rewrite_outline_created' } else { 'pending' })
    } else {
      $row.action = 'none'
    }

  } elseif ($row.fileType -eq '.xlsx') {
    $a = Extract-XlsxTextAndStructure $f.FullName
    $b = Extract-XlsxTextAndStructure $kt
    if (-not $a.ok -or -not $b.ok) {
      $row.parse = 'BINARY_NO_PARSE'
      $row.verdict = 'BINARY_NO_PARSE'
      $row.action = 'flagged'
      $row.notes = "XLSX parse failure. ref: $($a.reason); ktpm: $($b.reason)"
      $comparisons += [pscustomobject]$row
      continue
    }
    $aLines = Split-Lines $a.text
    $bLines = Split-Lines $b.text
    $aTok = Split-Tokens $a.text
    $bTok = Split-Tokens $b.text

    $row.parse = 'OK'
    $row.lineOverlapPct = Get-LineOverlapPct $aLines $bLines
    $row.alignedTokenPct = Get-AlignedTokenMatchPct $aTok $bTok
    $row.similarityPct = Get-SimilarityPct $row.alignedTokenPct $row.lineOverlapPct
    $row.structuralSimilarity = $(if (($a.sheetNames -join '|') -ceq ($b.sheetNames -join '|')) { 'Present' } else { 'Absent' })
    $row.verdict = Verdict $row.similarityPct
    $row.excerpt = Get-FirstIdenticalSnippet $aTok $b.text

    if ($row.verdict -eq 'COPIED_VERBATIM') {
      $rewrite = Get-RewriteNeededMdPath $f.FullName $KtpmRoot $RefRoot
      $row.action = $(if ($rewrite -and (Test-Path $rewrite)) { 'rewrite_outline_created' } else { 'pending' })
    } else {
      $row.action = 'none'
    }

  } else {
    $row.parse = 'UNSUPPORTED_BINARY'
    $row.verdict = 'BINARY_NO_PARSE'
    $row.action = 'flagged'
    $row.notes = 'Unsupported binary type for parsing.'
  }

  $comparisons += [pscustomobject]$row
}

# 3) Compare k6 scripts -> ktpm/performance/k6 (by filename)
foreach ($f in $refK6) {
  $kt = Join-Path (Join-Path $KtpmRoot 'performance\k6') $f.Name
  $row = [ordered]@{
    refFile = $f.FullName
    ktpmFile = $(if (Test-Path $kt) { $kt } else { $null })
    fileType = '.js'
    parse = $null
    lineOverlapPct = $null
    alignedTokenPct = $null
    similarityPct = $null
    structuralSimilarity = $null
    verdict = $null
    excerpt = $null
    action = $null
    notes = $null
  }

  if (-not (Test-Path $kt)) {
    $row.parse = 'NO_MATCH_IN_KTPM'
    $row.verdict = 'N/A'
    $row.action = 'flagged'
    $row.notes = 'No corresponding k6 file found in ktpm/performance/k6.'
    $comparisons += [pscustomobject]$row
    continue
  }

  $a = Extract-PlainText $f.FullName
  $b = Extract-PlainText $kt
  if (-not $a.ok -or -not $b.ok) {
    $row.parse = 'NO_PARSE'
    $row.verdict = 'BINARY_NO_PARSE'
    $row.action = 'flagged'
    $row.notes = "JS read failure. ref: $($a.reason); ktpm: $($b.reason)"
    $comparisons += [pscustomobject]$row
    continue
  }

  $aLines = Split-Lines $a.text
  $bLines = Split-Lines $b.text
  $aTok = Split-Tokens $a.text
  $bTok = Split-Tokens $b.text

  $row.parse = 'OK'
  $row.lineOverlapPct = Get-LineOverlapPct $aLines $bLines
  $row.alignedTokenPct = Get-AlignedTokenMatchPct $aTok $bTok
  $row.similarityPct = Get-SimilarityPct $row.alignedTokenPct $row.lineOverlapPct

  # structural similarity for JS: compare after removing string literals and numbers
  $aStructText = ($a.text -replace '"(?:\\.|[^"])*"', '""' -replace "'(?:\\.|[^'])*'", "''" -replace '\\b\\d+\\b', '0')
  $bStructText = ($b.text -replace '"(?:\\.|[^"])*"', '""' -replace "'(?:\\.|[^'])*'", "''" -replace '\\b\\d+\\b', '0')
  $aStructLines = Split-Lines $aStructText
  $bStructLines = Split-Lines $bStructText
  $structLinePct = Get-LineOverlapPct $aStructLines $bStructLines
  $row.structuralSimilarity = $(if ($structLinePct -ge 80) { 'Present' } else { 'Absent' })

  $row.verdict = Verdict $row.similarityPct
  $row.excerpt = Get-FirstIdenticalSnippet $aTok $b.text

  if ($row.verdict -in @('COPIED_VERBATIM','HEAVY_SIMILARITY')) {
    $row.action = $(if (Has-ProvenanceHeader $kt) { 'adapted_with_provenance_note' } else { 'pending' })
  } else {
    $row.action = $(if (Has-ProvenanceHeader $kt) { 'has_provenance_note' } else { 'none' })
  }

  $comparisons += [pscustomobject]$row
}

# 4) Add ktpm docs text/csv/xlsx that have no obvious ref pair (listed for completeness)
# Only include those that are NOT already under docs/ref.
foreach ($f in $ktpmDocsText) {
  if ($f.FullName -like (Join-Path $KtpmRoot 'docs\ref') + '*') { continue }
  if ($f.FullName -like (Join-Path $KtpmRoot 'docs\adapted') + '*') { continue }
  if ($f.FullName -like (Join-Path $KtpmRoot 'docs\reference-tests') + '*') { continue }
  if ($f.FullName -like (Join-Path $KtpmRoot 'docs\DOCS_PROVENANCE_REPORT.md')) { continue }

  $row = [ordered]@{
    refFile = $null
    ktpmFile = $f.FullName
    fileType = $f.Extension.ToLowerInvariant()
    parse = 'NO_REF_PAIR'
    lineOverlapPct = $null
    alignedTokenPct = $null
    similarityPct = $null
    structuralSimilarity = $null
    verdict = 'OK_TO_ADAPT'
    excerpt = $null
    action = 'none'
    notes = 'No matching source file in fullstack-vitejs-books/docs/tests selected by rules.'
  }
  $comparisons += [pscustomobject]$row
}

# 5) Write report markdown
$method = @(
  '## Method',
  '',
  '- Binary extraction:',
  '  - `.docx`: unzip then extract all `<w:t>` text nodes from `word/document.xml`.',
  '  - `.xlsx`: unzip then extract shared string table from `xl/sharedStrings.xml`; structural check uses sheet names from `xl/workbook.xml`.',
  '  - `.js`: read as UTF-8 text.',
  '- Exact-match metrics (approximation, evidence-based):',
  '  - `alignedTokenPct`: % of tokens that are identical at the same position after whitespace normalization.',
  '  - `lineOverlapPct`: % of identical unique lines (set-overlap) after trimming; order is ignored.',
  '- Similarity thresholding uses `similarityPct = max(alignedTokenPct, lineOverlapPct)` with the policy: >=80 COPIED_VERBATIM; 50-79 HEAVY_SIMILARITY; <50 OK_TO_ADAPT.',
  ''
) -join "`n"

$tableHeader = '| fullstack-file | ktpm-file | alignedTokenPct | lineOverlapPct | structural | verdict | action taken |'
$tableSep = '|---|---:|---:|---:|---|---|---|'

$rows = New-Object System.Collections.Generic.List[string]
foreach ($c in $comparisons) {
  $ref = $(if ($c.refFile) { RelPath $c.refFile $RefRoot } else { '(none)' })
  $kt = $(if ($c.ktpmFile) { RelPath $c.ktpmFile $KtpmRoot } else { '(none)' })
  $at = $(if ($null -ne $c.alignedTokenPct) { "$($c.alignedTokenPct)%" } else { 'N/A' })
  $lo = $(if ($null -ne $c.lineOverlapPct) { "$($c.lineOverlapPct)%" } else { 'N/A' })
  $struct = $(if ($c.structuralSimilarity) { $c.structuralSimilarity } else { 'N/A' })
  $ver = $(if ($c.verdict) { $c.verdict } else { 'N/A' })
  $act = $(if ($c.action) { $c.action } else { 'pending' })
  $rows.Add("| $ref | $kt | $at | $lo | $struct | $ver | $act |")
}

$flagged = $comparisons | Where-Object { $_.verdict -in @('COPIED_VERBATIM','HEAVY_SIMILARITY','BINARY_NO_PARSE') }

$summary = @(
  '## Summary',
  '',
  "- Files checked: $(@($comparisons).Count)",
  "- COPIED_VERBATIM: $(@($comparisons | Where-Object { $_.verdict -eq 'COPIED_VERBATIM' }).Count)",
  "- HEAVY_SIMILARITY: $(@($comparisons | Where-Object { $_.verdict -eq 'HEAVY_SIMILARITY' }).Count)",
  "- OK_TO_ADAPT: $(@($comparisons | Where-Object { $_.verdict -eq 'OK_TO_ADAPT' }).Count)",
  "- BINARY_NO_PARSE: $(@($comparisons | Where-Object { $_.verdict -eq 'BINARY_NO_PARSE' }).Count)",
  ''
) -join "`n"

$excerpts = New-Object System.Collections.Generic.List[string]
$excerpts.Add('## Flagged excerpts (<= 40 words)')
$excerpts.Add('')
foreach ($c in $flagged) {
  if ($c.verdict -eq 'BINARY_NO_PARSE') { continue }
  if (-not $c.excerpt) { continue }
  $words = ($c.excerpt -split '\s+')
  $short = ($words | Select-Object -First 40) -join ' '
  $ref = RelPath $c.refFile $RefRoot
  $kt = RelPath $c.ktpmFile $KtpmRoot
  $excerpts.Add("### $($c.verdict): $ref <-> $kt")
  $excerpts.Add('')
  $excerpts.Add('```')
  $excerpts.Add($short)
  $excerpts.Add('```')
  $excerpts.Add('')
}

$report = @(
  '# DOCS_PROVENANCE_REPORT',
  '',
  'NOTE: This report is generated in-repo to support academic integrity. It compares test documentation and performance scripts against the reference repository and flags verbatim copying.',
  '',
  $summary,
  $method,
  '## File comparison table',
  '',
  $tableHeader,
  $tableSep,
  ($rows -join "`n"),
  '',
  ($excerpts -join "`n")
) -join "`n"

New-Item -ItemType Directory -Force -Path (Split-Path $OutReportPath) | Out-Null
Set-Content -Path $OutReportPath -Value $report -Encoding UTF8

Write-Host "Wrote report: $OutReportPath"

# 6) Emit machine-readable JSON for follow-up actions
$OutJsonPath = [System.IO.Path]::ChangeExtension($OutReportPath, '.json')
$comparisons | ConvertTo-Json -Depth 6 | Set-Content -Path $OutJsonPath -Encoding UTF8
Write-Host "Wrote JSON: $OutJsonPath"
