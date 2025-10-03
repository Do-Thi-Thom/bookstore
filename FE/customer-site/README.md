# 📚 BookStore - Customer Site

Một ứng dụng web bán sách trực tuyến được xây dựng bằng ReactJS và Vite, cung cấp trải nghiệm mua sắm tuyệt vời cho khách hàng.

## 🚀 Tính năng

### ✨ Tính năng chính
- **Trang chủ** - Hiển thị banner, danh mục sách và sách nổi bật
- **Tìm kiếm** - Tìm kiếm sách theo tên, tác giả
- **Danh mục** - Duyệt sách theo danh mục
- **Chi tiết sản phẩm** - Xem thông tin chi tiết sách
- **Giỏ hàng** - Quản lý sản phẩm trong giỏ hàng
- **Đặt hàng** - Quy trình checkout hoàn chỉnh
- **Tài khoản** - Đăng ký, đăng nhập, quản lý profile
- **Lịch sử đơn hàng** - Theo dõi trạng thái đơn hàng

### 🎨 Giao diện
- **Responsive Design** - Tối ưu cho mọi thiết bị
- **Modern UI** - Sử dụng Ant Design components
- **Smooth Animations** - Hiệu ứng mượt mà
- **Dark Footer** - Footer chuyên nghiệp với thông tin đầy đủ

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18** - UI Library
- **Vite** - Build tool nhanh
- **React Router DOM** - Client-side routing
- **Ant Design** - UI Component Library
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing

### State Management
- **React Context API** - Global state management
- **LocalStorage** - Data persistence

### Development Tools
- **Node.js v20.16.0** - JavaScript runtime
- **npm** - Package manager

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js >= 18.0.0
- npm >= 8.0.0

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd customer-site
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Chạy development server
```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

## 📁 Cấu trúc thư mục

```
src/
├── components/          # Reusable components
│   ├── Header.jsx      # Header component
│   └── Footer.jsx      # Footer component
├── contexts/           # React Context providers
│   ├── AuthContext.jsx # Authentication context
│   └── CartContext.jsx # Shopping cart context
├── layouts/            # Layout components
│   └── MainLayout.jsx  # Main layout wrapper
├── pages/              # Page components
│   ├── HomePage.jsx    # Homepage
│   ├── ProductDetailPage.jsx
│   ├── CartPage.jsx
│   ├── CheckoutPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── OrderHistoryPage.jsx
│   └── OrderDetailPage.jsx
├── services/           # API services & mock data
│   └── mockData.js     # Mock data for development
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
├── App.jsx             # Main App component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## 🎯 Các trang chính

### 🏠 Trang chủ (`/`)
- Banner carousel với hình ảnh đẹp
- Thanh tìm kiếm sách
- Danh mục sách với icons
- Sách nổi bật với rating và giá

### 📖 Chi tiết sản phẩm (`/product/:id`)
- Thông tin chi tiết sách
- Hình ảnh sản phẩm
- Đánh giá và bình luận
- Nút thêm vào giỏ hàng

### 🛒 Giỏ hàng (`/cart`)
- Danh sách sản phẩm đã chọn
- Cập nhật số lượng
- Xóa sản phẩm
- Tính tổng tiền

### 💳 Thanh toán (`/checkout`)
- Form thông tin giao hàng
- Chọn phương thức thanh toán
- Xác nhận đơn hàng

### 👤 Tài khoản
- **Đăng ký** (`/register`) - Tạo tài khoản mới
- **Đăng nhập** (`/login`) - Đăng nhập vào hệ thống
- **Lịch sử đơn hàng** (`/orders`) - Xem các đơn hàng đã đặt
- **Chi tiết đơn hàng** (`/orders/:id`) - Theo dõi trạng thái đơn hàng

## 🎨 Responsive Design

### Breakpoints
- **Mobile**: ≤ 768px
- **Tablet**: ≤ 1024px  
- **Desktop**: > 1024px

### Features
- **Mobile Menu** - Hamburger menu cho mobile
- **Responsive Grid** - Layout tự động điều chỉnh
- **Touch Friendly** - Tối ưu cho touch devices
- **Flexible Images** - Hình ảnh responsive

## 🔧 Scripts

```bash
# Development
npm run dev          # Chạy development server
npm run build        # Build cho production
npm run preview      # Preview build production
npm run lint         # Kiểm tra code style

# Testing (nếu có)
npm run test         # Chạy tests
npm run test:coverage # Test với coverage
```

## 🌐 Deployment

### Build cho production
```bash
npm run build
```

### Deploy lên Vercel/Netlify
1. Push code lên GitHub
2. Connect repository với Vercel/Netlify
3. Deploy tự động

## 📱 Tính năng nâng cao

### 🎯 Performance
- **Code Splitting** - Lazy loading components
- **Image Optimization** - Tối ưu hình ảnh
- **Caching** - LocalStorage caching
- **Bundle Optimization** - Vite build optimization

### 🔒 Security
- **Input Validation** - Validate form inputs
- **XSS Protection** - Sanitize user inputs
- **Secure Routing** - Protected routes

### 🎨 UX/UI
- **Loading States** - Skeleton loading
- **Error Handling** - User-friendly error messages
- **Success Feedback** - Toast notifications
- **Smooth Transitions** - Page transitions

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phát hành dưới MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 👥 Team

- **Frontend Developer** - ReactJS, Vite, Ant Design
- **UI/UX Designer** - Responsive design, User experience
- **Backend Integration** - API integration (future)

## 📞 Liên hệ

- **Email**: contact@bookstore.com
- **Website**: https://bookstore.com
- **Hotline**: 1900-xxxx

---

⭐ Nếu dự án này hữu ích, hãy cho chúng tôi một star!
