# AGENTS.md

Hướng dẫn dành cho AI coding agent (GitHub Copilot, Claude, Cursor, Windsurf, Cline, v.v.) khi làm việc trong repo **futsal-planner**. File này áp dụng cho toàn bộ dự án.

## 1. Tổng quan dự án

FTSP (Futsal Tactics & Squad Planner) là web app **local-first**: React 19 + TypeScript + Vite 8 + Tailwind CSS 3, không có backend, toàn bộ dữ liệu lưu trong `localStorage`. Chi tiết tính năng, cấu trúc thư mục, routing, schema dữ liệu: xem [README.md](./README.md) — **không lặp lại nội dung đó ở đây, luôn đọc README trước khi bắt đầu**.

Để nắm nhanh dự án khi bắt đầu một phiên làm việc, đọc theo thứ tự:

1. [README.md](./README.md) – tính năng, cấu trúc, routing, các key `localStorage`.
2. [src/types/futsal.ts](./src/types/futsal.ts) – toàn bộ type/interface trung tâm (`Player`, `TacticalSquad`, `FormationSlot`...). Đây là "nguồn sự thật" cho domain model.
3. [src/services/storageService.ts](./src/services/storageService.ts) và [src/services/initialData.ts](./src/services/initialData.ts) – cách đọc/ghi dữ liệu và dữ liệu mặc định.
4. Component liên quan đến tác vụ (`src/components/*.tsx`) – chỉ đọc component cần sửa, tránh đọc toàn bộ thư mục nếu không cần.

## 2. Lệnh thường dùng

```bash
npm install       # cài dependency
npm run dev        # dev server (Vite, HMR) – http://localhost:5173
npm run build      # tsc -b && vite build -> dist/
npm run preview    # xem thử bản build
npm run lint       # oxlint (KHÔNG dùng eslint, dự án không cài eslint)
```

Sau mỗi thay đổi code, luôn chạy `npm run lint` và đảm bảo `npm run build` (tsc) không lỗi kiểu trước khi coi là hoàn thành — đây là bước tự kiểm tra bắt buộc, không hỏi người dùng có muốn chạy hay không.

## 3. Quy trình làm việc bắt buộc (không được bỏ qua)

1. **Phân tích trước khi code**: Đọc kỹ yêu cầu, khảo sát các file liên quan (dùng search/đọc file, không đoán). Nếu yêu cầu mơ hồ hoặc thiếu thông tin quan trọng, hỏi lại người dùng thay vì tự suy diễn.
2. **Viết plan ngắn gọn và chờ duyệt**: Với thay đổi có ảnh hưởng > 1 file hoặc thay đổi cấu trúc/behavior, trình bày kế hoạch (các bước, file sẽ sửa, rủi ro) trước khi sửa code, và chờ người dùng xác nhận. Chỉ tự tiến hành ngay không cần hỏi khi thay đổi nhỏ, cục bộ, rõ ràng (sửa lỗi hiển thị, đổi text, style nhỏ...).
3. **Không tự sinh ý tưởng/tính năng ngoài yêu cầu**: Chỉ implement đúng những gì được yêu cầu hoặc thực sự cần thiết để yêu cầu chạy đúng. Không thêm tính năng, refactor, hay "cải tiến" ngoài phạm vi.
4. **Không over-engineering**: Ưu tiên giải pháp đơn giản nhất phù hợp với quy mô dự án hiện tại (single-page app, không backend, không cần abstraction layer, state management library, hay design pattern phức tạp nếu component/props hiện tại đã đủ dùng).
5. **Đối chiếu nguồn chính thống khi không chắc chắn**: Với API của React 19, Vite 8, Tailwind CSS, TypeScript hoặc Web API (Drag & Drop, Fullscreen API, History API...), khi không chắc cú pháp/behavior, tra cứu tài liệu chính thức (react.dev, vite.dev, tailwindcss.com, typescriptlang.org, MDN) thay vì đoán hoặc dùng API đã lỗi thời/không tồn tại.
6. **Tự kiểm tra trước khi báo hoàn thành**: Chạy `npm run lint` và `npm run build`; đọc lại diff để đảm bảo không còn code chết, console.log dư thừa, import không dùng, hoặc lệch convention hiện có của file xung quanh.

## 4. Quy ước coding trong dự án (đã xác minh trong codebase)

### TypeScript

- `strict` mode bật (xem [tsconfig.app.json](./tsconfig.app.json)): `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` đều `true`. Không để biến/tham số không dùng, không để switch thiếu break/return.
- Không dùng path alias (`@/...`) — toàn bộ import là **relative path**. Không tự thêm alias mới trừ khi được yêu cầu.
- Định nghĩa type/interface tập trung ở [src/types/futsal.ts](./src/types/futsal.ts); không định nghĩa lại type trùng lặp trong component.
- Tránh `any`; nếu bắt buộc dùng (ví dụ vendor-prefixed API như `webkitRequestFullscreen`), giới hạn phạm vi ép kiểu nhỏ nhất có thể.

### React

- Function component + `React.FC<Props>` với `interface XxxProps` khai báo tường minh, field optional dùng `?`.
- State cục bộ dùng `useState`; state dùng chung được nâng lên `App.tsx` và truyền xuống qua props (props drilling) — dự án **không dùng Context API, Redux, Zustand**. Không tự ý đưa thư viện quản lý state mới vào trừ khi được yêu cầu rõ.
- Đặt tên handler theo `handle{Action}` (`handleAssignPlayerToSlot`), hàm lấy dữ liệu theo `get{Data}` (`getPlayerTotalScore`).
- Dùng `useMemo`/`useRef` khi cần tối ưu hoặc giữ tham chiếu DOM/file input, không lạm dụng khi không cần thiết.
- Không thêm custom hook mới trừ khi logic thực sự cần tái sử dụng ở nhiều nơi (hiện dự án chưa có custom hook nào).

### Vite

- Không thêm plugin/cấu hình Vite mới nếu không có yêu cầu cụ thể; kiểm tra [vite.config.ts](./vite.config.ts) trước khi đổi build config.

### Design System & Token-First Architecture (Bắt buộc tuân thủ)

Toàn bộ project áp dụng kiến trúc **Design Token Tập trung (Single Source of Truth)**. Tuyệt đối không hard-code spacing, typography, hay mã màu rải rác trong từng component để đảm bảo tính bảo trì và mở rộng dễ dàng.

---

#### 1. Nguyên tắc cốt lõi (Core Principles)
- **Token-Driven:** Mọi giá trị về Màu sắc, Spacing, Typography, Radius, Shadow đều phải được ánh xạ từ CSS Variables trong [src/index.css](./src/index.css).
- **Trừu tượng hóa Component qua `@layer components`:** Các mẫu layout và UI lặp lại (Container, Card, Button, Input, Heading) bắt buộc dùng class ngữ nghĩa định nghĩa sẵn trong `index.css`. Khi cần chỉnh sửa UI toàn hệ thống, chỉ chỉnh sửa tại `index.css`.
- **Mobile-First & Responsive Token:** Giá trị biến CSS tự động co giãn theo Viewport (Mobile `< 768px`, Tablet `768px - 1023px`, Laptop/PC `>= 1024px`) ngay tại file CSS gốc.

---

#### 2. Hệ thống Semantic Tokens trong `src/index.css` (Quy ước)

Tại `src/index.css`, tất cả tokens được chuẩn hóa như sau:

/* --- Base & Mobile Default (< 768px) --- */
:root {
  /* Tactical Position Role Tokens */
  --color-role-gk: #16a34a;    /* Green */
  --color-role-fixo: #9333ea;  /* Purple */
  --color-role-ala: #0284c7;   /* Blue */
  --color-role-pivot: #ea580c; /* Orange */

  /* Spacing Tokens */
  --spacing-page-x: 1rem;       /* 16px */
  --spacing-section-y: 1.5rem;   /* 24px */
  --spacing-grid-gap: 0.75rem;   /* 12px */
  --spacing-card-p: 0.75rem;     /* 12px */

  /* Typography Scale */
  --font-size-h1: 1.5rem;       /* 24px */
  --font-size-h2: 1.25rem;      /* 20px */
  --font-size-h3: 1.125rem;     /* 18px */
  --font-size-body: 0.875rem;   /* 14px */
}

/* --- Tablet (md: 768px - 1023px) --- */
@media (min-width: 768px) {
  :root {
    --spacing-page-x: 1.5rem;   /* 24px */
    --spacing-section-y: 2rem;  /* 32px */
    --spacing-grid-gap: 1rem;   /* 16px */
    --spacing-card-p: 1rem;     /* 16px */

    --font-size-h1: 1.875rem;   /* 30px */
    --font-size-h2: 1.5rem;     /* 24px */
    --font-size-body: 1rem;     /* 16px */
  }
}

/* --- Laptop / PC (lg: >= 1024px) --- */
@media (min-width: 1024px) {
  :root {
    --spacing-page-x: 2rem;     /* 32px */
    --spacing-section-y: 3rem;  /* 48px */
    --spacing-grid-gap: 1.5rem; /* 24px */
    --spacing-card-p: 1.5rem;   /* 24px */

    --font-size-h1: 2.25rem;    /* 36px */
    --font-size-h2: 1.875rem;   /* 30px */
  }
}

---

#### 3. Bộ Semantic Classes bắt buộc sử dụng trong JSX (`@layer components`)

Khi viết Component, **bắt buộc** tái sử dụng các class ngữ nghĩa này, **không tự viết chuỗi utility classes lặp lại thủ công**:

- **Page Layout Wrapper:** `.layout-page-container` (Tự động padding theo `--spacing-page-x`).
- **Section Khối:** `.layout-section` (Tự động margin/padding theo `--spacing-section-y`).
- **Card / Surface Khung:** `.card-surface` (Tự động padding `--spacing-card-p`, border-radius, background chuẩn).
- **Typography Classes:** `.text-h1`, `.text-h2`, `.text-h3`, `.text-body` (Tự động co giãn kích thước theo viewport).
- **Buttons / Badges:** `.btn-primary`, `.btn-outline`, `.badge-*`...

---

#### 4. Quy tắc CẤM & Kiểm soát chất lượng (Strict Negative Constraints)

- ❌ **CẤM Hard-code Arbitrary Values trong JSX:** Tuyệt đối không dùng `px-[...]`, `w-[...]`, `text-[...]`, `bg-[#...]`.
- ❌ **CẤM Tự ý gắn Spacing tùy tiện:** Không viết các class như `px-10`, `p-7`, `m-11` trong layout component. Mọi khoảng cách layout bắt buộc dùng semantic token hoặc class chuẩn.
- ❌ **CẤM Chèn trực tiếp mã màu:** Bắt buộc dùng CSS variable hoặc theme color token (`var(--color-role-*)`).
- ❌ **CẤM Viết đè Responsive cục bộ:** Không tự gán `px-4 md:px-6 lg:px-8` thủ công ở từng page/card; dùng đúng class `.layout-page-container` hoặc `.card-surface` để sau này có thể thay đổi toàn bộ hệ thống tại file CSS gốc duy nhất.

### Lint

- Dùng **oxlint** (`.oxlintrc.json`), không phải ESLint. Rule quan trọng: `react/rules-of-hooks: error`, `react/only-export-components: warn`. Không cài thêm eslint song song.

### Các điểm đặc thù cần biết trước khi sửa

- **Routing**: tự viết bằng History API (`window.history.pushState` + `popstate`) trong [src/App.tsx](./src/App.tsx), **không dùng react-router**. Không tự ý thêm react-router trừ khi được yêu cầu.
- **Persistence**: mọi đọc/ghi dữ liệu đi qua [src/services/storageService.ts](./src/services/storageService.ts) (try/catch, fallback về `INITIAL_DATA` khi lỗi, key có version hậu tố `_v1`). Không truy cập `localStorage` trực tiếp từ component.
- **Drag & Drop**: dùng HTML5 Drag and Drop API thuần (`dataTransfer.setData`/`getData`), không dùng react-dnd hay thư viện DnD khác.
- **Vietnamese text search**: dùng [src/utils/vietnamese.ts](./src/utils/vietnamese.ts) (`removeVietnameseTones`) để so khớp không dấu — tái sử dụng hàm này cho mọi tính năng tìm kiếm/lọc theo tên tiếng Việt mới, không viết lại logic normalize riêng.
- **Export CSV/PDF**: CSV cần thêm BOM `\uFEFF` để Excel đọc đúng tiếng Việt (xem [src/components/PlayerManagement.tsx](./src/components/PlayerManagement.tsx)); PDF export dùng `window.print()`, không dùng thư viện PDF ngoài.

## 5. Lưu ý bổ sung cho AI Agent

- Dự án **không có test tự động** (không có Jest/Vitest). Khi sửa logic quan trọng, tự kiểm tra thủ công bằng cách đọc lại luồng code hoặc gợi ý người dùng chạy `npm run dev` để kiểm tra bằng mắt; không tự bịa ra file test nếu không được yêu cầu.
- Đây là ứng dụng chạy hoàn toàn client-side, deploy qua GitHub Pages (`.github/workflows/deploy.yml`) — không giả định có server, API, database, hay biến môi trường bí mật.
- Khi đổi cấu trúc dữ liệu lưu trong `localStorage`, cân nhắc tăng version hậu tố key (`_v1` → `_v2`) và viết logic migrate/fallback, tránh làm mất dữ liệu người dùng hiện có.
- Giữ giao diện tiếng Việt nhất quán với phần còn lại của UI (label, thông báo lỗi, placeholder) khi thêm màn hình/tính năng mới.
- Không commit, push, hay tạo pull request thay người dùng trừ khi được yêu cầu rõ ràng.
