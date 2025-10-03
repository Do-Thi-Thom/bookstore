# Bookstore Management System API

Hệ thống quản lý nhà sách với 2 role: Admin và Customer (User).

## Công nghệ sử dụng

- **JDK 17**
- **Spring Boot 3.2.0**
- **Spring Security** với JWT authentication
- **Spring Data JPA**
- **MySQL**
- **Swagger UI** cho API documentation
- **Lombok**

## Cấu hình

### Database
Tạo database MySQL với tên `bookstore` và cập nhật thông tin kết nối trong `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/bookstore?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: root
    password: password
```

### JWT Secret
Cập nhật JWT secret trong `application.yml`:

```yaml
jwt:
  secret: rikiBookstoreSecretKey2024ForJWTTokenGeneration
  expiration: 86400000 # 24 hours
```

## Chạy ứng dụng

1. Clone repository
2. Cấu hình database
3. Chạy lệnh: `mvn spring-boot:run`
4. Truy cập Swagger UI: `http://localhost:8080/swagger-ui.html`

## Quy ước phân trang (Pagination)

- Tất cả API trả danh sách đều nhận tham số:
  - `pageIndex` (mặc định `0`)
  - `pageSize` (mặc định `10`)
- Response chuẩn hóa theo `PageResponse` trong field `data`:

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "items": [],
    "pageIndex": 0,
    "pageSize": 10,
    "totalItems": 0,
    "totalPages": 0
  }
}
```

## API Endpoints

### Authentication APIs
- `POST /api/auth/register` - Đăng ký user (Customer site)
- `POST /api/auth/register/admin` - Đăng ký admin (Admin site)
- `POST /api/auth/login` - Đăng nhập

### Admin APIs (Yêu cầu role ADMIN)

#### Quản lý sách
- `GET /api/admin/books` - Lấy danh sách sách (có phân trang `pageIndex`, `pageSize`) và thống kê (số sách sắp hết hàng, tổng giá trị kho)
- `GET /api/admin/books/{id}` - Lấy chi tiết sách
- `POST /api/admin/books` - Tạo sách mới (multipart/form-data với hình ảnh)
- `PUT /api/admin/books/{id}` - Cập nhật sách (multipart/form-data với hình ảnh)
- `DELETE /api/admin/books/{id}` - Xóa sách
- `GET /api/admin/books/low-stock` - Lấy sách tồn kho thấp (có `threshold`, trả list cơ bản)

**Lưu ý**: API tạo/cập nhật sách sử dụng `multipart/form-data` để upload hình ảnh bìa sách. Hình ảnh sẽ được lưu dưới dạng Base64 trong database.

**Response format cho GET /api/admin/books**:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "books": [],
    "pageIndex": 0,
    "pageSize": 10,
    "totalItems": 0,
    "totalPages": 0,
    "lowStockBooks": 0,
    "totalInventoryValue": 0.00
  }
}
```

#### Quản lý danh mục
- `GET /api/admin/categories` - Lấy danh sách danh mục (có phân trang)
- `GET /api/admin/categories/{id}` - Lấy chi tiết danh mục
- `POST /api/admin/categories` - Tạo danh mục mới
- `PUT /api/admin/categories/{id}` - Cập nhật danh mục
- `DELETE /api/admin/categories/{id}` - Xóa danh mục

#### Quản lý đơn hàng
- `GET /api/admin/orders` - Lấy danh sách đơn hàng (có phân trang)
- `GET /api/admin/orders/{id}` - Lấy chi tiết đơn hàng
- `GET /api/admin/orders/status/{status}` - Lấy đơn hàng theo trạng thái (có phân trang)
- `PUT /api/admin/orders/{id}/status` - Cập nhật trạng thái đơn hàng

#### Quản lý người dùng
- `GET /api/admin/users` - Lấy danh sách người dùng (có phân trang)
- `GET /api/admin/users/{id}` - Lấy chi tiết người dùng
- `PUT /api/admin/users/{id}/toggle-status` - Bật/tắt tài khoản
- `GET /api/admin/users/customers` - Lấy danh sách khách hàng (có phân trang)

### Customer APIs

#### Xem sách (Không cần authentication)
- `GET /api/customer/books` - Lấy danh sách sách (có phân trang)
- `GET /api/customer/books/{id}` - Lấy chi tiết sách
- `GET /api/customer/books/search` - Tìm kiếm sách theo `keyword` (có phân trang)
- `GET /api/customer/books/category/{categoryId}` - Lọc theo danh mục (có phân trang)
- `GET /api/customer/books/search/advanced` - Tìm kiếm nâng cao `categoryId`, `keyword` (có phân trang)

#### Xem danh mục (Không cần authentication)
- `GET /api/customer/categories` - Lấy danh mục (có phân trang)
- `GET /api/customer/categories/{id}` - Lấy chi tiết danh mục

#### Giỏ hàng (Yêu cầu authentication)
- `GET /api/customer/cart` - Lấy giỏ hàng
- `POST /api/customer/cart/add` - Thêm sách vào giỏ
- `PUT /api/customer/cart/update/{cartItemId}` - Cập nhật số lượng
- `DELETE /api/customer/cart/remove/{cartItemId}` - Xóa khỏi giỏ
- `DELETE /api/customer/cart/clear` - Xóa toàn bộ giỏ

#### Đơn hàng (Yêu cầu authentication)
- `GET /api/customer/orders` - Lịch sử đơn hàng (có phân trang)
- `GET /api/customer/orders/{id}` - Chi tiết đơn hàng
- `POST /api/customer/orders/create` - Tạo đơn hàng mới
- `GET /api/customer/orders/status/{orderNumber}` - Kiểm tra trạng thái đơn

## Authentication

Sử dụng JWT Bearer token trong header:
```
Authorization: Bearer <jwt_token>
```

## Trạng thái đơn hàng

- `PENDING` - Đang xử lý
- `PROCESSING` - Đang giao
- `COMPLETED` - Hoàn thành
- `CANCELLED` - Hủy

## Role System

- **USER**: Khách hàng, có thể xem sách, quản lý giỏ hàng, đặt hàng
- **ADMIN**: Quản trị viên, có thể quản lý sách, danh mục, đơn hàng, người dùng

## CORS Configuration

Hệ thống đã cấu hình CORS để cho phép tất cả origins (`*`) cho development.
