# CI_FAILURES (Fallback)

File này dùng làm **fallback** khi GitHub Actions **không thể tạo GitHub Issue** (thiếu quyền `issues:write`, labels bị chặn, hoặc policy của repo).

- Workflow sẽ cố tạo Issue + comment PR.
- Nếu thất bại, workflow sẽ **append** một entry mới vào file này trong runner workspace và cố tạo PR (action `peter-evans/create-pull-request`).
- Nếu ngay cả tạo PR cũng bị chặn, workflow vẫn upload artifact `ci-fail-logs-*` để giảng viên/nhóm có thể tải log về.

## Entries

(Chưa có entry)
