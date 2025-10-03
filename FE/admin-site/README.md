# Admin Site - Hệ thống quản lý sách

Một ứng dụng web quản lý sách được xây dựng với React, TypeScript, TailwindCSS và Ant Design.

## Tính năng

### Dashboard
- Tổng quan thống kê hệ thống
- Biểu đồ và số liệu quan trọng
- Thao tác nhanh đến các module chính

### Quản lý sách
- Thêm, sửa, xóa sách
- Quản lý thông tin: tên, tác giả, giá, mô tả, ảnh bìa, số lượng tồn
- Tìm kiếm và lọc sách
- Thống kê tồn kho

### Quản lý danh mục
- Thêm, sửa, xóa danh mục sách
- Liên kết sách với danh mục
- Quản lý mô tả danh mục

### Quản lý đơn hàng
- Xem danh sách đơn hàng
- Xem chi tiết đơn hàng
- Cập nhật trạng thái: "Chờ xử lý", "Đang xử lý", "Đang giao", "Hoàn thành", "Hủy"
- Thống kê doanh thu

### Quản lý người dùng
- Danh sách khách hàng và admin
- Khóa/mở tài khoản
- Xem thông tin chi tiết người dùng

## Công nghệ sử dụng

- **React 19** - Framework JavaScript
- **TypeScript** - Ngôn ngữ lập trình
- **Vite** - Build tool
- **TailwindCSS** - CSS framework
- **Ant Design** - UI component library
- **React Router** - Routing

## Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js version 20 trở lên
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
```

### Chạy ứng dụng
```bash
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:5173

### Build production
```bash
npm run build
```

## Cấu trúc dự án

```
src/
├── components/     # Các component tái sử dụng
├── layouts/        # Layout chính của ứng dụng
├── pages/          # Các trang của ứng dụng
├── types/          # TypeScript interfaces
├── utils/          # Utility functions
├── hooks/          # Custom React hooks
├── App.tsx         # Component chính
└── main.tsx        # Entry point
```

## Tính năng chính

### Responsive Design
- Giao diện responsive trên mọi thiết bị
- Sidebar có thể thu gọn
- Layout tối ưu cho desktop và mobile

### UI/UX
- Giao diện hiện đại và đẹp mắt
- Sử dụng Ant Design components
- TailwindCSS cho styling
- Animations và transitions mượt mà

### State Management
- React hooks cho state management
- Local state cho các component
- Mock data cho demo

### Routing
- React Router v7
- Nested routes
- Navigation tự động

## Tương lai

- [ ] Tích hợp backend API
- [ ] Authentication và Authorization
- [ ] Upload ảnh sản phẩm
- [ ] Export/Import dữ liệu
- [ ] Báo cáo và analytics
- [ ] Push notifications
- [ ] Dark mode

## Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## License

MIT License - xem file LICENSE để biết thêm chi tiết.
