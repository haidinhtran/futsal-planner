# AGENTS.md

Hướng dẫn dành cho AI coding agent (GitHub Copilot, Claude, Cursor, Windsurf, Cline, v.v.) khi làm việc trong repo **futsal-planner**. File này áp dụng cho toàn bộ dự án.

## 1. Tổng quan dự án

FTSP (Futsal Tactics & Squad Planner) là web app **local-first**: React 19 + TypeScript + Vite 8 + Tailwind CSS 3, không có backend, toàn bộ dữ liệu lưu trong `localStorage`. Chi tiết tính năng, routing, schema dữ liệu: xem [README.md](./README.md) — **không lặp lại nội dung đó ở đây, luôn đọc README trước khi bắt đầu**.

Thứ tự đọc khi bắt đầu phiên làm việc:
1. [README.md](./README.md) – tính năng, routing, key `localStorage`.
2. [src/types/futsal.ts](./src/types/futsal.ts) – type/interface trung tâm domain model (`Player`, `TacticalSquad`...).
3. [src/services/storageService.ts](./src/services/storageService.ts) và [src/services/initialData.ts](./src/services/initialData.ts) – logic persistence và dữ liệu mặc định.
4. Component/Hook liên quan đến tác vụ cần sửa — chỉ đọc file trong phạm vi, tránh đọc toàn bộ thư mục nếu không cần thiết.

## 2. Lệnh thường dùng

```bash
npm install       # cài dependency
npm run dev        # dev server (Vite, HMR) – http://localhost:5173
npm run build      # tsc -b && vite build -> dist/
npm run preview    # xem thử bản build
npm run lint       # oxlint (KHÔNG dùng eslint, dự án không cài eslint)
```

Sau mỗi thay đổi code, luôn chạy `npm run lint` và `npm run build` (tsc) để đảm bảo không có lỗi cú pháp, lint, hoặc lỗi kiểu TypeScript trước khi coi là hoàn thành.

## 3. Quy trình làm việc bắt buộc

1. **Phân tích trước khi code**: Khảo sát đúng file, không suy diễn logic. Nếu yêu cầu mơ hồ, hỏi lại người dùng.
2. **Viết plan ngắn gọn và chờ duyệt**: Với thay đổi > 1 file hoặc ảnh hưởng kiến trúc/behavior, trình bày plan (các file tạo/sửa, logic thay đổi) và chờ duyệt.
3. **Không over-engineering & Không tự sinh tính năng**: Giữ giải pháp tinh gọn nhất, không thêm thư viện quản lý state (Redux/Zustand), không tự tạo routing phức tạp ngoài History API có sẵn.
4. **Tự kiểm tra trước khi hoàn thành**: Đảm bảo diff sạch (không console.log dư thừa, không unused imports/variables, không code chết).

## 4. Quy ước coding trong dự án

### TypeScript & Path Alias
- `strict` mode bật (`noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` đều `true`).
- **Bắt buộc dùng Path Alias (`@/`)** cho mọi import nội bộ từ `src/` (ví dụ: `@/types/futsal`, `@/components/common/Button`, `@/services/storageService`, `@/hooks/useSquadManager`). Không dùng relative path lồng nhau (`../../`).
- Định nghĩa type/interface tập trung tại `@/types/futsal.ts`; không định nghĩa lại type trùng lặp trong component.
- Tránh `any`; nếu bắt buộc dùng cho Web API đặc thù, giới hạn phạm vi ép kiểu nhỏ nhất có thể.

### Cấu trúc Component & Clean Code (Quy chuẩn Refactor)
- **Giới hạn kích thước file**: Mỗi file component **không vượt quá 120 dòng code**. Nếu quá ngưỡng, bắt buộc phân tách thành các sub-components hoặc trích xuất logic ra hooks/utils.
- **Single Responsibility**: Tách biệt rõ ràng Presentation (UI) và Business Logic. Các khối UI lặp lại hoặc đứng độc lập (Header, Action Bar, Item Card, Modal, Table Row) phải nằm ở file component riêng.
- **Tổ chức thư mục**:
  - `src/components/common/`: UI components dùng chung (Buttons, Modals, Badges, Tooltips).
  - `src/components/{feature}/`: Components phục vụ từng màn hình/tính năng cụ thể.
  - `src/hooks/`: Custom hooks đóng gói logic state hoặc thao tác nghiệp vụ phức tạp (`use{Feature}`).
  - `src/services/` & `src/utils/`: Chứa pure functions, helpers, export/import file và Data Access Layer.
- **Khai báo Component & Props**:
  - Function component + `React.FC<Props>` với `interface XxxProps` tường minh (dùng `?` cho optional fields).
  - Tên handler theo format `handle{Action}` (`handleAssignPlayerToSlot`), hàm tính toán dữ liệu dùng `get{Data}` hoặc `calculate{Data}`.

### State Management & Custom Hooks
- State cục bộ dùng `useState`; state liên component được nâng lên `App.tsx` và truyền qua props. Dự án **không dùng Context API, Redux, Zustand**.
- **Cho phép tạo Custom Hooks (`src/hooks/use*.ts`)**: Nhằm tách logic tính toán, xử lý danh sách, hoặc điều phối luồng dữ liệu ra khỏi JSX component, giữ component gọn nhẹ.
- Dùng `useMemo`/`useCallback`/`useRef` đúng mục đích tối ưu re-render hoặc giữ tham chiếu DOM, không lạm dụng tràn lan.

### LocalStorage & Data Layer
- **Tuyệt đối không gọi trực tiếp `localStorage` trong component**: Toàn bộ thao tác đọc, ghi, parse JSON, catch error và migrate version phải đi qua `@/services/storageService.ts`.

### Design System & Token-First Architecture (Bắt buộc)
Toàn bộ dự án tuân thủ Single Source of Truth từ `@/index.css`.
- **CSS Variables Semantic**: Dùng tokens cho Roles (`--color-role-*`), Spacing (`--spacing-*`), Typography (`--font-size-*`).
- **Semantic Component Classes (`@layer components`)**: Bắt buộc dùng `.layout-page-container`, `.layout-section`, `.card-surface`, `.text-h1`, `.text-h2`, `.text-h3`, `.text-body`, `.btn-primary`, `.btn-outline`...
- **Negative Constraints**:
  - ❌ CẤM hard-code giá trị tùy tiện (`px-[...]`, `w-[...]`, `bg-[#...]`).
  - ❌ CẤM tự ý gán spacing responsive thủ công rải rác (`px-4 md:px-6 lg:px-8`) ở từng page/card; bắt buộc dùng class semantic tương ứng.

### Lint & Công cụ
- Dùng **oxlint** (`.oxlintrc.json`). Rule: `react/rules-of-hooks: error`, `react/only-export-components: warn`. Không cài thêm ESLint.

### Các điểm đặc thù cần biết
- **Routing**: Tự điều hướng qua History API (`pushState` + `popstate`) trong `@/App.tsx`, không dùng `react-router`.
- **Drag & Drop**: Dùng HTML5 Drag and Drop API thuần (`dataTransfer.setData`/`getData`), không thêm thư viện ngoài.
- **Vietnamese Search**: Dùng `@/utils/vietnamese.ts` (`removeVietnameseTones`) để xử lý tìm kiếm không dấu.
- **Export Data**: CSV cần chèn BOM `\uFEFF` cho Excel; PDF dùng `window.print()`.

## 5. Lưu ý bổ sung cho AI Agent
- Dự án không có test tự động (không Jest/Vitest). Kiểm tra code bằng `npm run lint` và `npm run build`.
- Local-first app deploy GitHub Pages: không giả định có backend API, microservices hay server env vars.
- Luôn giữ giao diện tiếng Việt nhất quán với UI hiện tại.
- Không tự ý commit hay push code trừ khi có lệnh trực tiếp từ người dùng.