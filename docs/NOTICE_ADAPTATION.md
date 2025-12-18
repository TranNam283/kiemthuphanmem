# NOTICE_ADAPTATION

This repository contains some testing templates and performance-testing ideas that were initially brought in from a reference repository for learning/benchmarking.

## Source (reference repository)
- `fullstack-vitejs-books` (local path in this workspace: `D:\Projects\fullstack-vitejs-books`)
  - Test documentation/templates: `docs/tests/**`
  - k6 scripts: `performance/k6/**`

## What is stored where in this repo
- `docs/ref/**`
  - Purpose: **original copies** used only for provenance checking and similarity measurement.
  - Status: these files were detected as **COPIED_VERBATIM** against the reference repo.
  - Intended use: do **not** treat these as newly-authored work.

- `docs/adapted/**`
  - Purpose: **rewrite-needed outlines** (`*_REWRITE_NEEDED.md`) that describe how to produce new, original KTPM (e-commerce clothing) documents based on concepts only.
  - Status: outlines are safe to keep as they do not reproduce full templates; they guide the creation of new templates and test artifacts.

- `performance/k6/**`
  - Purpose: load/stress scripts for this project.
  - Provenance: scripts include a provenance note and target KTPM endpoints (clothing domain), not the book domain.

## Policy used in this repo
- If similarity is >= 80% (COPIED_VERBATIM): create only a `*_REWRITE_NEEDED.md` outline; do not keep the copied template as “final deliverable”.
- If similarity is 50-79% (HEAVY_SIMILARITY): rewrite further until the work is clearly original, then re-run the provenance scanner.
- If similarity is < 50% (OK_TO_ADAPT): adaptation is allowed, but keep attribution and ensure domain-specific changes.

## Evidence
See `docs/DOCS_PROVENANCE_REPORT.md` (generated) and `docs/DOCS_PROVENANCE_REPORT.json` (machine-readable).
