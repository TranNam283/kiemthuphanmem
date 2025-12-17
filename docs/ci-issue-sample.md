# CI Issue Sample (expected)

Mẫu nội dung issue mà workflow sẽ tự tạo khi CI fail (được build từ dữ liệu thật: workflow/job/run url/sha + log tail + (backend) jest json summary).

## Sample title

[CI FAIL] Frontend CI/CD - test - frontend tests failed

## Sample body (structure)

- Repository: `${owner}/${repo}`
- Workflow: `${workflow}`
- Job: `${job}`
- Commit: `${sha}`
- Run URL: `${runUrl}`
- Artifact: `ci-fail-logs-frontend-${run_id}` hoặc `ci-fail-logs-backend-${run_id}`
- Failing tests:
  - Frontend: parse heuristic từ dòng `Tests:` nếu có (nếu không thì UNKNOWN)
  - Backend: `ci-jest-unit.json` + `ci-jest-integration.json`
- Short logs: tail 100 lines từ file log đã capture
- Suggested owner(s): `triage-needed` vì CODEOWNERS KHÔNG TỒN TẠI

Ghi chú: repo hiện **KHÔNG TỒN TẠI** file CODEOWNERS và **KHÔNG TỒN TẠI** `.github/ISSUE_TEMPLATE/*` nên workflow tự tạo labels khi cần.
