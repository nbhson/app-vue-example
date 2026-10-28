# Plan — app-vue-example

> Vue 3 + Vite + Pinia demo app (Todo + Users) gọi jsonplaceholder.

## Kết quả Review (audit đợt 1)

| # | Severity | Vị trí | Vấn đề | Fix |
|---|----------|--------|--------|-----|
| 1 | MAJOR | src/api/client.ts:14-16 | Token trong localStorage attach `Bearer` cho MỌI request kể cả third-party jsonplaceholder = leak credentials cho dịch vụ ngoài | Chỉ attach khi request trỏ đúng `VITE_AUTH_API_ORIGIN` (mặc định không attach); validate token shape |
| 2 | MAJOR | src/stores/todo/actions.ts:22-25 | `addTodo` bỏ id server, thay bằng `id: Date.now()` → toggle/remove PATCH/DELETE `/todos/<Date.now()>` (id không tồn tại) — client "thành công", server không bao giờ cập nhật | Giữ id server; fallback id âm (client-only) khi API không trả id; toggle guard id ≤ 0 |
| 3 | MAJOR | src/services/user.service.ts:6-8 | Raw axios response gán thẳng vào store, không validate — template deref `user.name.charAt(0)`, `user.company.name` nổ TypeError khi payload sai | `toModel` normalize mọi field + template dùng optional chaining |
| 4 | MAJOR | src/stores/todo/actions.ts:4-31 | Race: fetch in-flight gán đè `this.todos` làm mất todo vừa add (và ngược lại) | Generation counter — chỉ apply response khi vẫn là lần mới nhất |
| 5 | MINOR | src/services/todo.service.ts:28-33 | `_toModel(dto: any)` spread rác vào model, `text: undefined` vi phạm Todo type | Validate DTO: required fields + defaults |
| 6 | MINOR | src/api/client.ts:27 | `console.error` full response.data ở production | DEV log chi tiết; production chỉ log status/method/path |
| 7 | MINOR | src/stores/todo/actions.ts | Raw `err.message` (axios/network internals) đưa thẳng UI | Map message cố định; raw chỉ log DEV |
| 8 | MINOR | src/stores/todo/actions.ts:16 | `addTodo` không reset `this.error` — stale error treo sau thao tác thành công | Reset ở đầu action |
| 9 | MINOR | TodoInput.html/.ts | Todo text không bound độ dài → payload khổng lồ | `maxlength="200"` + slice trước khi gửi |
| 10 | MINOR | src/api/client.ts:4 | `VITE_API_BASE_URL` không validate — giá trị sai/độc redirect toàn bộ traffic | Validate URL hợp lệ + chỉ https/localhost |
| 11 | MINOR | index.html | Không có CSP | CSP meta: script-src 'self' (không unsafe-inline), connect-src allowlist jsonplaceholder |
| 12 | MINOR | src/stores/*/actions.ts | `this: any` tắt toàn bộ type check của Pinia store | Typed `this: TodoStoreLike/UserStoreLike` (extends State) |
| 13 | MINOR | AboutView.html:23 | Text ghi "Vuex 4" trong khi app dùng Pinia | Sửa thành Pinia |

## Trạng thái

- [x] Plan
- [x] Fix #1–#13
- [x] `tsc --noEmit` pass; `vite build` pass
- [x] Commit + self-review

## Review Log

### Vòng 1
- Self-review: (1) fallback id âm đi kèm guard trong `toggleTodo` (client-only todo không gọi server) và `removeTodo` — remove gọi DELETE `/todos/-...` sẽ fail 404 rồi filter local vẫn chạy; chấp nhận vì demo API luôn trả id. (2) CSP `connect-src` thêm `VITE_API_BASE_URL` khi override — hiện hardcode jsonplaceholder khớp default; nếu đổi API cần sửa CSP (ghi trong comment). Token regex chỉ chấp nhận JWT/opaque chars hợp lệ, chặn newline/CRLF injection vào header.
