# ⚽ FTSP – Futsal Tactics & Squad Planner

> **FTSP** là web app quản lý cầu thủ và thiết kế thế trận futsal, chạy hoàn toàn trên trình duyệt (local-first). Dữ liệu được lưu trữ trong `localStorage` – không cần máy chủ, không cần đăng nhập.

## ✨ Tính năng

### 📋 Quản lý cầu thủ (`/players`)

- Thêm, sửa, xóa cầu thủ với đầy đủ thông tin: số áo, tên, thể lực, tấn công, phòng thủ (thang 0–10), vị trí thi đấu (GK, FI, AL_L, AL_R, PI) và ghi chú.
- Tìm kiếm, lọc, sắp xếp cầu thủ.
- Xuất danh sách cầu thủ ra file **XLSX** hoặc **PDF**.

### 🧠 Thiết kế thế trận (`/plan`)

- Sân bóng futsal trực quan với 6 đội hình mặc định: `4-0`, `3-1`, `2-2`, `1-2-1`, `1-3`, `0-4` (Power Play).
- Kéo thả cầu thủ vào từng vị trí (chính thức + dự bị tối đa 5 người/vị trí).
- Đổi hướng tấn công, ghi chú thế trận, lưu đội hình.

### ✍️ Diễn giải chiến thuật (`/present`)

- Bảng vẽ (whiteboard) với đầy đủ công cụ: chọn, mũi tên, mũi tên đứt nét, đường cong, cầu thủ (chủ nhà/khách), khoanh tròn, chữ, bóng, xóa.
- Quản lý layer, lưu/nạp/xóa nhiều sơ đồ chiến thuật.

### 💾 Dữ liệu & Sao lưu

- Toàn bộ dữ liệu lưu cục bộ trong `localStorage` (cầu thủ, đội hình, sơ đồ).
- Xuất / nhập tệp sao lưu `.json` bao gồm cầu thủ, đội hình, ghi chú và các sơ đồ chiến thuật.
- Khôi phục dữ liệu về mặc định (12 cầu thủ, đội hình ban đầu và 2 sơ đồ mô phỏng).

## 🛠️ Công nghệ

|                |                                                                              |
| -------------- | ---------------------------------------------------------------------------- |
| **Framework**  | [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| **Build tool** | [Vite 8](https://vite.dev)                                                   |
| **Styling**    | [Tailwind CSS](https://tailwindcss.com)                                      |
| **Icons**      | [lucide-react](https://lucide.dev)                                           |
| **Lint**       | [oxlint](https://oxc.rs/docs/guide/usage/linter)                             |
| **Triển khai** | GitHub Pages (CI/CD qua GitHub Actions)                                      |

## 🚀 Bắt đầu nhanh

### Yêu cầu

- [Node.js](https://nodejs.org) ≥ 20
- npm (đi kèm Node.js)

### Cài đặt

```bash
# 1. Cài dependencies
npm install

# 2. Chạy môi trường phát triển (mặc định: http://localhost:5173)
npm run dev
```

### Các lệnh thường dùng

```bash
npm run dev      # Chạy dev server với HMR
npm run build    # Build production (tsc -b && vite build) -> thư mục dist/
npm run preview  # Xem trước bản build
npm run lint     # Kiểm tra code bằng oxlint
```

## 📁 Cấu trúc dự án

```
futsal-planner/
├── .github/workflows/   # GitHub Actions (deploy GitHub Pages)
├── public/              # Static assets (favicon, manifest, CNAME...)
├── src/
│   ├── components/      # UI components (Sidebar, TacticsBoard, FutsalPitch, ...)
│   ├── services/        # storageService (localStorage), initialData (dữ liệu mặc định)
│   ├── types/           # TypeScript types & constants (Player, TacticalSquad, ...)
│   ├── App.tsx          # Component gốc, routing bằng History API
│   └── main.tsx         # Entry point
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

### Routing (History API)

| Đường dẫn  | Trang                 |
| ---------- | --------------------- |
| `/plan`    | Thiết kế thế trận     |
| `/players` | Quản lý cầu thủ       |
| `/present` | Diễn giải chiến thuật |

## 🔄 Dữ liệu

Dữ liệu được lưu trong `localStorage` với các khóa:

| Khóa                         | Nội dung                     |
| ---------------------------- | ---------------------------- |
| `futsal_planner_players_v1`  | Danh sách cầu thủ            |
| `futsal_planner_squad_v1`    | Đội hình thế trận            |
| `futsal_planner_diagrams_v1` | Các sơ đồ chiến thuật đã lưu |

> ⚠️ Dữ liệu gắn liền với từng trình duyệt/thiết bị. Nên sử dụng tính năng **Xuất tệp sao lưu (.json)** thường xuyên để tránh mất dữ liệu.

Tệp sao lưu JSON sử dụng định dạng có version và bao gồm các trường `players`, `squad` và `diagrams`. Các file cũ không có trường `diagrams` vẫn có thể được nhập; khi đó danh sách sơ đồ được xem là rỗng.

## 🚢 Triển khai

Dự án được triển khai tự động lên **GitHub Pages** khi push lên nhánh `main` (xem `.github/workflows/deploy.yml`), có hỗ trợ SPA fallback (`/404.html`).

## 📄 Giấy phép

Dự án cá nhân – chưa có giấy phép cụ thể.
