# Coding Standards & Best Practices (Futsal Planner)

Bắt buộc tuân thủ nghiêm ngặt cho toàn bộ dự án Futsal Planner (FTSP):

## 1. CORE HOOKS & HẠ TẦNG REACT 19
- Dùng Hook `use()` thay cho `useContext()` khi lấy dữ liệu từ Context. Lợi thế: Có thể gọi `use()` linh hoạt bên trong điều kiện hoặc vòng lặp.
- Dùng `useActionState` cho xử lý Form Actions/Server Actions và quản lý trạng thái bất đồng bộ của form.
- Dùng `useOptimistic` để cập nhật UI tức thì trong khi chờ API/Action phản hồi.
- Dùng `useFormStatus` tại các component con (như Button submit) để truy cập trạng thái của `<form>` cha.
- KHÔNG dùng `forwardRef`. Trong React 19, `ref` được truyền trực tiếp như một prop thông thường (`function MyComponent({ ref, ...props })`).

## 2. CUSTOM HOOKS VÀ QUẢN LÝ STATE
- Gom toàn bộ logic nghiệp vụ (business logic) hoặc state phức tạp ra Custom Hooks riêng biệt (tiền tố `use...`).
- Hạn chế tối đa việc lạm dụng `useEffect` cho việc biến đổi dữ liệu (Derived State).
- Hạn chế tối đa `useMemo` và `useCallback` trừ khi thực sự xử lý các phép tính rất nặng, tận dụng cơ chế re-render tối ưu của React 19.

## 3. TAILWIND CSS V4 (CSS-FIRST CONFIGURATION)
- Sử dụng cấu hình chuẩn Tailwind v4 bằng CSS Native directives trong file CSS chính (vd: `@import "tailwindcss";`), KHÔNG phụ thuộc vào file `tailwind.config.js` kiểu cũ.
- Tùy biến Theme/Variables trực tiếp bằng `@theme` block trong CSS (ví dụ: `@theme { --font-display: ...; --color-primary: ...; }`).
- Tối ưu hóa class: Gom nhóm class trùng lặp bằng `cva` (class-variance-authority) hoặc helper `clsx`/`tailwind-merge` khi viết Reusable Components.
- Đảm bảo tính nhất quán của Design System bằng cách ưu tiên dùng CSS Variables hoặc Token theme thay vì hardcode giá trị tuỳ biến (ví dụ: ưu tiên `bg-primary` thay vì `bg-[#123456]`).

## 4. TYPESCRIPT 5.x STRICT STANDARDS
- Nghiêm cấm tuyệt đối việc sử dụng kiểu `any`. Sử dụng `unknown` nếu chưa xác định được kiểu và ép kiểu an toàn (Type Guarding).
- Luôn định nghĩa Type/Interface rõ ràng cho Props, State, API Payloads và Return values.
- Ưu tiên dùng `type` hoặc `interface` tường minh, tận dụng các Utility Types của TS (như `Pick`, `Omit`, `Partial`, `Readonly`) để tái sử dụng code sạch hơn.

## 5. BẤT ĐỒNG BỘ NÂNG CAO VÀ CẤU TRÚC CODE
- Kết hợp Hook `use()` với `<Suspense>` để unwrap Promise trực tiếp trong Component. Luôn bọc `<ErrorBoundary>` ở phạm vi thích hợp.
- Nguyên tắc Single Responsibility: Mỗi file/component chỉ làm một việc duy nhất. Nếu component vượt quá 150-200 dòng, bắt buộc phải tách nhỏ ra sub-components hoặc Custom Hooks.
