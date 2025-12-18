# DOCS_PROVENANCE_REPORT

NOTE: This report is generated in-repo to support academic integrity. It compares test documentation and performance scripts against the reference repository and flags verbatim copying.

## Summary

- Files checked: 25
- COPIED_VERBATIM: 13
- HEAVY_SIMILARITY: 0
- OK_TO_ADAPT: 12
- BINARY_NO_PARSE: 0

## Method

- Binary extraction:
  - `.docx`: unzip then extract all `<w:t>` text nodes from `word/document.xml`.
  - `.xlsx`: unzip then extract shared string table from `xl/sharedStrings.xml`; structural check uses sheet names from `xl/workbook.xml`.
  - `.js`: read as UTF-8 text.
- Exact-match metrics (approximation, evidence-based):
  - `alignedTokenPct`: % of tokens that are identical at the same position after whitespace normalization.
  - `lineOverlapPct`: % of identical unique lines (set-overlap) after trimming; order is ignored.
- Similarity thresholding uses `similarityPct = max(alignedTokenPct, lineOverlapPct)` with the policy: >=80 COPIED_VERBATIM; 50-79 HEAVY_SIMILARITY; <50 OK_TO_ADAPT.

## File comparison table

| fullstack-file | ktpm-file | alignedTokenPct | lineOverlapPct | structural | verdict | action taken |
|---|---:|---:|---:|---|---|---|
| docs\tests\test case\TestCase_AccessControl.xlsx | docs\ref\test case\TestCase_AccessControl.xlsx | 100% | 100% | Present | COPIED_VERBATIM | rewrite_outline_created |
| docs\tests\test case\TestCase_AddressManagement.xlsx | docs\ref\test case\TestCase_AddressManagement.xlsx | 100% | 100% | Present | COPIED_VERBATIM | rewrite_outline_created |
| docs\tests\test case\TestCase_CartManagement.xlsx | docs\ref\test case\TestCase_CartManagement.xlsx | 100% | 100% | Present | COPIED_VERBATIM | rewrite_outline_created |
| docs\tests\test case\TestCase_OrderManagement.xlsx | docs\ref\test case\TestCase_OrderManagement.xlsx | 100% | 100% | Present | COPIED_VERBATIM | rewrite_outline_created |
| docs\tests\test case\TestCase_PaymentManagement.xlsx | docs\ref\test case\TestCase_PaymentManagement.xlsx | 100% | 100% | Present | COPIED_VERBATIM | rewrite_outline_created |
| docs\tests\test case\TestCase_ProductManagement.xlsx | docs\ref\test case\TestCase_ProductManagement.xlsx | 100% | 100% | Present | COPIED_VERBATIM | rewrite_outline_created |
| docs\tests\TestDesign\03_API_Test_Design_Template.xlsx | docs\ref\TestDesign\03_API_Test_Design_Template.xlsx | 100% | 100% | Present | COPIED_VERBATIM | rewrite_outline_created |
| docs\tests\TestDesign\03_Test Design Workflow.xlsx | docs\ref\TestDesign\03_Test Design Workflow.xlsx | 100% | 100% | Present | COPIED_VERBATIM | rewrite_outline_created |
| docs\tests\TestReviewChecklist\test case review checklist.xlsx | docs\ref\TestReviewChecklist\test case review checklist.xlsx | 100% | 100% | Present | COPIED_VERBATIM | rewrite_outline_created |
| docs\tests\test plan.docx | docs\ref\test plan.docx | 100% | 100% | Present | COPIED_VERBATIM | rewrite_outline_created |
| docs\tests\test report.xlsx | docs\ref\test report.xlsx | 100% | 100% | Present | COPIED_VERBATIM | rewrite_outline_created |
| docs\tests\Test_Scenario.xlsx | docs\ref\Test_Scenario.xlsx | 100% | 100% | Present | COPIED_VERBATIM | rewrite_outline_created |
| docs\tests\unit test.xlsx | docs\ref\unit test.xlsx | 100% | 100% | Present | COPIED_VERBATIM | rewrite_outline_created |
| performance\k6\load-test.js | performance\k6\load-test.js | 3.9% | 15.3% | Absent | OK_TO_ADAPT | has_provenance_note |
| performance\k6\stress-test.js | performance\k6\stress-test.js | 5% | 19.5% | Absent | OK_TO_ADAPT | has_provenance_note |
| (none) | docs\tests\test-cases.csv | N/A | N/A | N/A | OK_TO_ADAPT | none |
| (none) | docs\tests\traceability.csv | N/A | N/A | N/A | OK_TO_ADAPT | none |
| (none) | docs\CHUONG4_PHAN_4.3_WORD.md | N/A | N/A | N/A | OK_TO_ADAPT | none |
| (none) | docs\CHUONG4_PHAN_4.6_WORD.md | N/A | N/A | N/A | OK_TO_ADAPT | none |
| (none) | docs\ci-issue-sample.md | N/A | N/A | N/A | OK_TO_ADAPT | none |
| (none) | docs\CI_FAILURES.md | N/A | N/A | N/A | OK_TO_ADAPT | none |
| (none) | docs\NOTICE_ADAPTATION.md | N/A | N/A | N/A | OK_TO_ADAPT | none |
| (none) | docs\PHU_LUC_A_TEST_CASES.md | N/A | N/A | N/A | OK_TO_ADAPT | none |
| (none) | docs\RAILWAY_DEPLOY.md | N/A | N/A | N/A | OK_TO_ADAPT | none |
| (none) | docs\TESTING_REFACTOR_PLAN.md | N/A | N/A | N/A | OK_TO_ADAPT | none |

## Flagged excerpts (<= 40 words)

### COPIED_VERBATIM: docs\tests\test case\TestCase_AccessControl.xlsx <-> docs\ref\test case\TestCase_AccessControl.xlsx

```
Test Case ID Tiêu đề (Summary) Điều kiện tiên quyết (Pre-conditions) Các bước thực
```

### COPIED_VERBATIM: docs\tests\test case\TestCase_AddressManagement.xlsx <-> docs\ref\test case\TestCase_AddressManagement.xlsx

```
Test Case ID Tiêu đề (Summary) Điều kiện tiên quyết (Pre-conditions) Các bước thực
```

### COPIED_VERBATIM: docs\tests\test case\TestCase_CartManagement.xlsx <-> docs\ref\test case\TestCase_CartManagement.xlsx

```
Test Case ID Tiêu đề (Summary) Điều kiện tiên quyết (Pre-conditions) Các bước thực
```

### COPIED_VERBATIM: docs\tests\test case\TestCase_OrderManagement.xlsx <-> docs\ref\test case\TestCase_OrderManagement.xlsx

```
Test Case ID Tiêu đề (Summary) Điều kiện tiên quyết (Pre-conditions) Các bước thực
```

### COPIED_VERBATIM: docs\tests\test case\TestCase_PaymentManagement.xlsx <-> docs\ref\test case\TestCase_PaymentManagement.xlsx

```
Test Case ID Tiêu đề (Summary) Điều kiện tiên quyết (Pre-conditions) Các bước thực
```

### COPIED_VERBATIM: docs\tests\test case\TestCase_ProductManagement.xlsx <-> docs\ref\test case\TestCase_ProductManagement.xlsx

```
Test Case ID Tiêu đề (Summary) Điều kiện tiên quyết (Pre-conditions) Các bước thực
```

### COPIED_VERBATIM: docs\tests\TestDesign\03_API_Test_Design_Template.xlsx <-> docs\ref\TestDesign\03_API_Test_Design_Template.xlsx

```
Note API TEST DESIGN - ACCESS_CONTROL 🔹 Phạm vi Module: Access Control Công cụ
```

### COPIED_VERBATIM: docs\tests\TestDesign\03_Test Design Workflow.xlsx <-> docs\ref\TestDesign\03_Test Design Workflow.xlsx

```
Test case Id Action Role State Involved TCs Assign To Note WF_1 Pending Open
```

### COPIED_VERBATIM: docs\tests\TestReviewChecklist\test case review checklist.xlsx <-> docs\ref\TestReviewChecklist\test case review checklist.xlsx

```
Test Case Review Checklist.xls 1.0 No. Criteria Yes/No/NA A TEST OVERVIEW B TEST EFFECTIVENESS
```

### COPIED_VERBATIM: docs\tests\test plan.docx <-> docs\ref\test plan.docx

```
năm 2025 Mục lục 1. Giới thiệu 1 1.1. Mục đích 1 1.4. Danh
```

### COPIED_VERBATIM: docs\tests\test report.xlsx <-> docs\ref\test report.xlsx

```
Test Report Project Program / Division Build Version Author / Technical Owner Approval Status
```

### COPIED_VERBATIM: docs\tests\Test_Scenario.xlsx <-> docs\ref\Test_Scenario.xlsx

```
Scenario ID Module Description TS-AC-01 TS-AC-02 TS-AC-03 TS-AC-04 TS-AC-05 TS-AC-06 TS-AC-07 TS-AC-08 TS-AC-09 TS-AC-10
```

### COPIED_VERBATIM: docs\tests\unit test.xlsx <-> docs\ref\unit test.xlsx

```
Unit Test Project Program / Division Author / Technical Owner Approval Status [Draft /
```

