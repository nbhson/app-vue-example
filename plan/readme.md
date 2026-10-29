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

## Round 2 — 2026-10-29

### Findings (review đợt 2)

| # | Severity | Vị trí | Vấn đề | Fix |
|---|----------|--------|--------|-----|
| 1 | MAJOR | src/components/*, src/views/* | Pattern `.vue` wrapper + `.ts/.html/.css` riêng: non-idiomatic, props không khai báo (TodoItem dùng `todo` trong template mà `setup()` không expose), mất type-check props/emits, khó maintain | Gộp thành SFC `<script setup lang="ts">` idiom chuẩn; xoá các thư mục tách file |
| 2 | MAJOR | stores/*/actions.ts | `userMessage()` copy 2 nơi, logic khác nhau (todo map network/404, user không) — drift | Extract `src/utils/errors.ts` dùng chung |
| 3 | MAJOR UX | stores/todo/actions.ts + HomeView | `addTodo` bật `loading` → HomeView thay TOÀN BỘ list bằng spinner mỗi lần thêm task; input bị disable khi đang fetch ban đầu | Tách `loading` (fetch lần đầu) khỏi `busy` (mutation); list luôn hiển thị |
| 4 | MINOR bug | stores/todo/actions.ts `removeTodo` | Todo client-only (id ≤ 0): DELETE `/todos/-…` → 404 → hiện error dù remove local hợp lệ (mirror guard của toggle đã có từ V1) | Guard id ≤ 0: remove local, không gọi server |
| 5 | MINOR | router/index.ts | Không có catch-all 404; không set document.title theo route | NotFoundView + `meta.title` + afterEach hook |
| 6 | MINOR | App.vue | RouterView trần trụi — không nav, không skip-link, không focus management | App shell: header nav (active state), skip-link a11y |
| 7 | MINOR | style.css + *.css | Hard-code màu (#fff, #eee, #e0e0e0…) rải rác → không theme được; spinner/error-state CSS copy 3 nơi | Design tokens (spacing/radius/color/typography) + dark scheme `[data-theme]`; component hoá spinner/error/empty |
| 8 | MINOR | a11y | Filter buttons thiếu `aria-pressed`; custom checkbox không có focus-visible; input không có label/aria; transition không tôn trọng `prefers-reduced-motion` | A11y pass toàn app |
| 9 | MINOR | env.d.ts | `declare module '*.vue'` shim mọi component thành `any` → tắt type-check import | Bỏ shim, type-check bằng vue-tsc |

### Plan Round 2

1. Refactor SFC: gộp TodoInput/TodoItem/TodoList/HomeView/UserView/AboutView thành SFC script setup, xoá folder tách file.
2. Dedupe: `src/utils/errors.ts`; composables `useTheme` (dark mode persist + prefers-color-scheme), `useDocTitle`.
3. UX fixes: tách `busy`/`loading`, guard remove id ≤ 0.
4. App shell + router: nav header, 404, route titles.
5. UI/UX: token hoá design system (color/spacing/type), dark mode, responsive, a11y (aria, focus-visible, reduced-motion).
6. Features: (a) dark mode toggle; (b) inline edit todo; (c) clear completed + tìm kiếm todo; (d) trang chi tiết user `/users/:id`.
7. Tests: thêm vitest + unit test cho utils/services/stores; script `test`, `typecheck`.
8. Verify: `npm run build`, `npm run typecheck`, `npm run test`, `npm run lint` — all green.

### Trạng thái Round 2

> Note: trạng thái ở dưới được cập nhật sau khi hoàn thành thực tế. Phiên bản
> trước của file này đã tick hết các mục *trước khi* code được viết — WIP dở
> dang (chỉ item SFC refactor, còn lỗi parse + import sai) được review, sửa
> và hoàn thiện trong đợt này.

- [x] Review + plan
- [x] SFC refactor + xoá file tách (WIP từ phiên bị gián đoạn: sửa template
      parse error, import sai đường dẫn, tham chiếu `busy` chưa tồn tại)
- [x] Dedupe error util (`src/utils/errors.ts`) + composables
      (`useTheme`, `useDocumentTitle`)
- [x] UX: `busy`/`loading` tách, remove guard id ≤ 0
- [x] App shell + router (404, route titles, `props: true` cho /users/:id)
- [x] Design tokens + dark mode + a11y (aria-pressed/aria-current,
      focus-visible, reduced-motion, skip-link)
- [x] Features: dark mode toggle, inline edit, search + clear completed,
      user detail `/users/:id`
- [x] Vitest tests (27 tests: utils, services, store, components)
- [x] `npm run build` ✅ · `npm run typecheck` ✅ · `npm run test` ✅ 27/27 ·
      `npm run lint` ✅ 0 errors 0 warnings
- [x] Self-review final diff → fix nav active state (router-link-active trên
      "/" match mọi route) + restore aria-describedby; committed as c3abe67

### Commits Round 2

| Commit | Nội dung |
|--------|----------|
| `76be020` | refactor(vue): consolidate split-file components into script-setup SFCs |
| `7b86317` | refactor(store): split busy from loading, guard client-only deletes, dedupe error util |
| `a0bd777` | feat(app): app shell, routing titles, 404 page, dark mode |
| `29b1c32` | feat(todo): inline edit, search filter, clear completed |
| `b3a729f` | test: add vitest suite for error util, services, todo store |
| `c3abe67` | fix(app): correct nav active state, restore aria-describedby; add component tests |

### Baseline (pre-round-2)

- Commit `924397a`: `vite build` ✅, `tsc --noEmit` ✅, lint ✅. Không có test suite (đã thêm ở round 2).

### Remaining risks / tech debt

- jsonplaceholder PATCH/DELETE giả lập (luôn 200, không persist) — hành vi
  optimistic/rollback đúng nhưng server-side không bao giờ đổi dữ liệu thật.
- Theme init chạy trong main.ts (CSP chặn inline script) — có thể flash 1 frame
  khi system theme ≠ light; đã giảm bằng CSS `prefers-color-scheme` fallback.
- `VITE_AUTH_API_ORIGIN` khai báo trong `env.d.ts` nhưng chưa có giá trị
  mặc định trong `.env` (cố ý — mặc định không attach token).
- Chưa có E2E (Playwright) cho flow add → edit → clear completed.
- `connect-src` trong CSP hardcode jsonplaceholder — đổi API cần sửa index.html.

