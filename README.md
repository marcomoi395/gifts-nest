## Chức năng cơ bản

- Xác thực 2 luồng đăng nhập:
  - User đăng nhập qua `POST /api/auth/login`
  - Admin đăng nhập qua `POST /api/admin/auth`
- Quản lý hồ sơ người dùng:
  - Lấy thông tin cá nhân `GET /api/user/me`
  - Cập nhật thông tin cá nhân `PUT /api/user/me`
- Quản lý danh sách quà:
  - User xem quà đang active `GET /api/gift`
  - Admin xem toàn bộ quà (active/inactive) `GET /api/admin/gift`
  - Admin tạo/cập nhật/xóa quà: `POST|PUT|DELETE /api/admin/gift`
- Hỗ trợ phân trang + sắp xếp cho danh sách quà (`page`, `limit`, `sortBy`, `sortOrder`)

## Cách chạy

### 1) Chuẩn bị môi trường

- Node.js 20+ (khuyến nghị dùng LTS)
- npm 10+

### 2) Clone mã nguồn và cài thư viện

```bash
git clone https://github.com/marcomoi395/gifts-nest
cd gifts-nest
npm install
```

### 3) Cấu hình biến môi trường

Tạo file `.env` từ `.env.example`:

```
JWT_SECRET=
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
PORT=
```

### 5) Chạy migration tạo schema

```bash
npm run migration:run
```

### 6) Chạy API

```bash
npm run start:dev
```

API chạy tại: `http://localhost:3000/api`

### 7) Build và chạy production mode

```bash
npm run build
npm run start:prod
```

## API chi tiết

### 1) Đăng nhập user

- **Method / URL**: `POST /api/auth/login`
- **Auth**: Không cần token
- **Body bắt buộc**:

```json
{
    "username": "user",
    "password": "abc123"
}
```

**Trường hợp có thể xảy ra**:

`200 OK`: Đăng nhập thành công, trả về `accessToken`, `refreshToken`

```json
{
    "statusCode": 200,
    "message": "Login successful",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhNDVmYy02ZDEzLTRlNTUtYTUzZi1hOTUxNDkyM2E5YWYiLCJ1c2VybmFtZSI6InVzZXIiLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MzgyODU0OCwiZXhwIjoxNzczODI5NDQ4fQ.6-o5DWD5qBCKHnSYIk6G08xT-RqkifLiXJOGOpeJgaU",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhNDVmYy02ZDEzLTRlNTUtYTUzZi1hOTUxNDkyM2E5YWYiLCJ1c2VybmFtZSI6InVzZXIiLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MzgyODU0OCwiZXhwIjoxNzc0NDMzMzQ4fQ.rrC2cFG8Fv6bnyauJ4c1wGbhPT6hMoP5tWe--zu-bLM"
    }
}
```

`400 Bad Request`: Thiếu `username/password`, sai kiểu dữ liệu, hoặc có field thừa

```json
{
    "message": ["username should not be empty", "username must be a string"],
    "error": "Bad Request",
    "statusCode": 400
}
```

`401 Unauthorized`: Sai tài khoản/mật khẩu

```json
{
    "message": "Invalid credentials",
    "error": "Unauthorized",
    "statusCode": 401
}
```

`500 Internal Server Error`: Lỗi hệ thống/DB/JWT ngoài dự kiến

---

### 2) Đăng nhập admin

- **Method / URL**: `POST /api/admin/auth`
- **Auth**: Không cần token
- **Body bắt buộc**:

```json
{
    "username": "user",
    "password": "abc123"
}
```

**Trường hợp có thể xảy ra**:
`200 OK`: Đăng nhập thành công với tài khoản admin, trả về token
`400 Bad Request`: Body không hợp lệ hoặc có field thừa
`401 Unauthorized`: Sai tài khoản/mật khẩu

```json
{
    "message": "Invalid credentials",
    "error": "Unauthorized",
    "statusCode": 401
}
```

hoặc user không có quyền admin

```json
{
    "message": "Invalid admin credentials",
    "error": "Unauthorized",
    "statusCode": 401
}
```

`500 Internal Server Error`: Lỗi hệ thống/DB/JWT ngoài dự kiến

---

### 3) Lấy thông tin profile hiện tại

**Method / URL**: `GET /api/user/me`
**Auth**: Bắt buộc JWT user/admin

**Trường hợp có thể xảy ra**:

- `200 OK`: Lấy profile thành công

```json
{
    "statusCode": 200,
    "message": "Fetched user profile successfully",
    "data": {
        "id": "67b0cc35-8074-4ac8-86a8-23b4a2da2463",
        "username": "admin",
        "role": "admin",
        "fullName": "Thanh Loi",
        "email": "loi@example.com",
        "phoneNumber": "0901234567",
        "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=Loi",
        "bio": "",
        "createdAt": "2026-03-18T06:16:44.598Z",
        "updatedAt": "2026-03-18T06:16:44.598Z"
    }
}
```

- `401 Unauthorized`: Thiếu token, token sai định dạng, token hết hạn/không hợp lệ

```json
{
    "message": "Unauthorized",
    "statusCode": 401
}
```

- `404 Not Found`: Token hợp lệ nhưng user không còn tồn tại trong DB

```json
{
    "message": "User not found",
    "error": "Not Found",
    "statusCode": 404
}
```

- `500 Internal Server Error`: Lỗi hệ thống/DB ngoài dự kiến

---

### 4) Cập nhật profile hiện tại

**Method / URL**: `PUT /api/user/me`
**Auth**: Bắt buộc JWT user/admin
**Body tùy chọn** (ít nhất 1 field để cập nhật):

```json
{
    "fullName": "Nguyễn Văn B",
    "email": "nguyenvana@example.com",
    "phoneNumber": "0901234567",
    "avatarUrl": "https://example.com/avatar.jpg",
    "bio": "Developer tại công ty XYZ"
}
```

**Trường hợp có thể xảy ra**:

- `200 OK`: Cập nhật thành công

```json
{
    "statusCode": 200,
    "message": "User profile updated successfully",
    "data": {
        "id": "5eba45fc-6d13-4e55-a53f-a9514923a9af",
        "username": "user",
        "role": "user",
        "fullName": "Nguyễn Văn B",
        "email": "nguyenvana@example.com",
        "phoneNumber": "0901234567",
        "avatarUrl": "https://example.com/avatar.jpg",
        "bio": "Developer tại công ty XYZ",
        "createdAt": "2026-03-18T06:16:44.598Z",
        "updatedAt": "2026-03-18T08:59:59.257Z"
    }
}
```

- `400 Bad Request`: Field sai kiểu/sai format/vượt giới hạn, hoặc có field thừa

```json
{
    "fullName": "Nguyễn Văn B",
    "email": "nguyenvana@example.com",
    "phoneNumber": "0901234567",
    "avatarUrl": "https://example.com/avatar.jpg",
    "bio": "Developer tại công ty XYZ",
    "abc": "123"
}
```

- `401 Unauthorized`: Thiếu hoặc sai token

```json
{
    "message": "Unauthorized",
    "statusCode": 401
}
```

- `409 Conflict`: Email mới đã được user khác sử dụng

```json
{
    "message": "Email already in use",
    "error": "Conflict",
    "statusCode": 409
}
```

- `500 Internal Server Error`: Lỗi hệ thống/DB ngoài dự kiến

---

### 5) Lấy danh sách quà (user)

**Method / URL**: `GET /api/gift`
**Auth**: Bắt buộc JWT user/admin
**Query tùy chọn**:

- `page`: số nguyên `>= 1` (mặc định `1`)
- `limit`: số nguyên `1..100` (mặc định `10`)
- `sortBy`: một trong `createdAt | name | points | stock | monetaryValue` (mặc định `createdAt`)
- `sortOrder`: `ASC | DESC` (mặc định `DESC`)

**Lưu ý nghiệp vụ**: route này chỉ trả các gift có `isActive = true`.

**Trường hợp có thể xảy ra**:

- `200 OK`: Trả về danh sách `items` + `meta` phân trang

```json
{
    "statusCode": 200,
    "message": "Fetched gifts successfully",
    "data": {
        "items": [
            {
                "id": "8e3327e7-cba6-43df-b69f-0c3c6a175da1",
                "name": "Thẻ cào điện thoại 50k",
                "description": "Thẻ nạp tiền điện thoại mệnh giá 50.000 VNĐ, áp dụng cho tất cả nhà mạng.",
                "points": 500,
                "monetaryValue": "50000.00",
                "stock": 100,
                "isActive": true,
                "createdAt": "2026-03-18T09:34:08.505Z",
                "updatedAt": "2026-03-18T09:34:08.505Z"
            },
            {
                "id": "14f2ed0f-7979-4076-b3ba-6ee185ac68ed",
                "name": "Thẻ cào điện thoại 50k",
                "description": "Thẻ nạp tiền điện thoại mệnh giá 50.000 VNĐ, áp dụng cho tất cả nhà mạng.",
                "points": 500,
                "monetaryValue": "50000.00",
                "stock": 100,
                "isActive": true,
                "createdAt": "2026-03-18T08:43:32.129Z",
                "updatedAt": "2026-03-18T08:43:32.129Z"
            },
            {
                "id": "0aa2098a-7b5a-441b-a4b7-f3d0e3a4c38b",
                "name": "Lót chuột cỡ lớn (90x40)",
                "description": "Đủ chỗ cho cả phím lẫn chuột",
                "points": 1500,
                "monetaryValue": "150000.00",
                "stock": 50,
                "isActive": true,
                "createdAt": "2026-03-18T06:25:14.033Z",
                "updatedAt": "2026-03-18T06:25:14.033Z"
            }
        ],
        "meta": {
            "page": 1,
            "limit": 3,
            "total": 20,
            "totalPages": 7
        }
    }
}
```

- `401 Unauthorized`: Thiếu hoặc sai token

```json
{
    "message": "Unauthorized",
    "statusCode": 401
}
```

- `500 Internal Server Error`: Lỗi hệ thống/DB ngoài dự kiến

---

### 6) Lấy danh sách quà (admin)

**Method / URL**: `GET /api/admin/gift`
**Auth**: Bắt buộc JWT và role `admin`
**Query tùy chọn**: giống route `GET /api/gift`
**Lưu ý nghiệp vụ**: route này trả toàn bộ gift (cả active và inactive).

**Trường hợp có thể xảy ra**:

- `200 OK`: Trả về danh sách `items` + `meta` phân trang

```json
{
    "statusCode": 200,
    "message": "Fetched gifts successfully",
    "data": {
        "items": [
            {
                "id": "e42866ad-f7d9-4f07-b5fc-1c04c28762b0",
                "name": "Sticker \"I Love Arch Linux\"",
                "description": "Dán vào laptop cho nó ngầu",
                "points": 100,
                "monetaryValue": "10000.00",
                "stock": 200,
                "isActive": true,
                "createdAt": "2026-03-18T06:25:14.033Z",
                "updatedAt": "2026-03-18T06:25:14.033Z"
            },
            {
                "id": "8e3327e7-cba6-43df-b69f-0c3c6a175da1",
                "name": "Thẻ cào điện thoại 50k",
                "description": "Thẻ nạp tiền điện thoại mệnh giá 50.000 VNĐ, áp dụng cho tất cả nhà mạng.",
                "points": 500,
                "monetaryValue": "50000.00",
                "stock": 100,
                "isActive": true,
                "createdAt": "2026-03-18T09:34:08.505Z",
                "updatedAt": "2026-03-18T09:34:08.505Z"
            },
            {
                "id": "14f2ed0f-7979-4076-b3ba-6ee185ac68ed",
                "name": "Thẻ cào điện thoại 50k",
                "description": "Thẻ nạp tiền điện thoại mệnh giá 50.000 VNĐ, áp dụng cho tất cả nhà mạng.",
                "points": 500,
                "monetaryValue": "50000.00",
                "stock": 100,
                "isActive": true,
                "createdAt": "2026-03-18T08:43:32.129Z",
                "updatedAt": "2026-03-18T08:43:32.129Z"
            },
            {
                "id": "4d433ed6-5a43-491b-96e3-3ec01d6bdcf8",
                "name": "Cáp sạc Type-C bọc dù",
                "description": "Siêu bền, không lo đứt gãy",
                "points": 800,
                "monetaryValue": "80000.00",
                "stock": 100,
                "isActive": true,
                "createdAt": "2026-03-18T06:25:14.033Z",
                "updatedAt": "2026-03-18T06:25:14.033Z"
            },
            {
                "id": "9a60bb79-8f33-40ec-b888-7fef1b285337",
                "name": "Thẻ cào điện thoại 50k 2",
                "description": "Thẻ nạp tiền điện thoại mệnh giá 50.000 VNĐ, áp dụng cho tất cả nhà mạng.",
                "points": 500,
                "monetaryValue": "50000.00",
                "stock": 100,
                "isActive": false,
                "createdAt": "2026-03-18T08:43:52.241Z",
                "updatedAt": "2026-03-18T08:55:51.080Z"
            },
            {
                "id": "8aadbd3b-0ba6-41e2-a488-0b258ea5356a",
                "name": "Quạt cầm tay mini",
                "description": "Cứu cánh khi cúp điện ở phòng trọ",
                "points": 600,
                "monetaryValue": "60000.00",
                "stock": 60,
                "isActive": true,
                "createdAt": "2026-03-18T06:25:14.033Z",
                "updatedAt": "2026-03-18T06:25:14.033Z"
            },
            {
                "id": "0aa2098a-7b5a-441b-a4b7-f3d0e3a4c38b",
                "name": "Lót chuột cỡ lớn (90x40)",
                "description": "Đủ chỗ cho cả phím lẫn chuột",
                "points": 1500,
                "monetaryValue": "150000.00",
                "stock": 50,
                "isActive": true,
                "createdAt": "2026-03-18T06:25:14.033Z",
                "updatedAt": "2026-03-18T06:25:14.033Z"
            },
            {
                "id": "4859f187-a711-4cb7-bafd-757c9c6c1b7a",
                "name": "Voucher Phúc Long 50k",
                "description": "Giải nhiệt mùa hè",
                "points": 1000,
                "monetaryValue": "50000.00",
                "stock": 40,
                "isActive": true,
                "createdAt": "2026-03-18T06:25:14.033Z",
                "updatedAt": "2026-03-18T06:25:14.033Z"
            },
            {
                "id": "cbf9eeb9-1c76-4c17-8e3b-30d13c0ac653",
                "name": "Combo mì ly Modern (10 ly)",
                "description": "Lương thực dự trữ mùa deadline",
                "points": 1200,
                "monetaryValue": "120000.00",
                "stock": 30,
                "isActive": true,
                "createdAt": "2026-03-18T06:25:14.033Z",
                "updatedAt": "2026-03-18T06:25:14.033Z"
            },
            {
                "id": "9d746261-8350-456c-ae6a-9017b9ea9e6b",
                "name": "Áo thun \"Bug is Feature\"",
                "description": "Thời trang cho dân IT chính hiệu",
                "points": 2500,
                "monetaryValue": "250000.00",
                "stock": 25,
                "isActive": true,
                "createdAt": "2026-03-18T06:25:14.033Z",
                "updatedAt": "2026-03-18T06:25:14.033Z"
            }
        ],
        "meta": {
            "page": 1,
            "limit": 10,
            "total": 23,
            "totalPages": 3
        }
    }
}
```

- `401 Unauthorized`: Thiếu hoặc sai token

```json
{
    "message": "Unauthorized",
    "statusCode": 401
}
```

- `403 Forbidden`: Token hợp lệ nhưng role không phải `admin`

```json
{
    "message": "Insufficient role",
    "error": "Forbidden",
    "statusCode": 403
}
```

- `401 Unauthorized`: Thiếu hoặc sai token

```json
{
    "message": "Unauthorized",
    "statusCode": 401
}
```

- `500 Internal Server Error`: Lỗi hệ thống/DB ngoài dự kiến

---

### 7) Tạo quà (admin)

**Method / URL**: `POST /api/admin/gift`
**Auth**: Bắt buộc JWT và role `admin`
**Body bắt buộc/tùy chọn**:

```json
{
    "name": "Thẻ cào điện thoại 50k",
    "description": "Thẻ nạp tiền điện thoại mệnh giá 50.000 VNĐ, áp dụng cho tất cả nhà mạng.",
    "points": 500,
    "monetaryValue": 50000,
    "stock": 100,
    "isActive": true
}
```

- **Trường hợp có thể xảy ra**:
  - `201 Created`: Tạo gift thành công

```json
{
    "statusCode": 201,
    "message": "Gift created successfully",
    "data": {
        "id": "9a60bb79-8f33-40ec-b888-7fef1b285337",
        "name": "Thẻ cào điện thoại 50k 2",
        "description": "Thẻ nạp tiền điện thoại mệnh giá 50.000 VNĐ, áp dụng cho tất cả nhà mạng.",
        "points": 500,
        "monetaryValue": "50000.00",
        "stock": 100,
        "isActive": false,
        "createdAt": "2026-03-18T08:43:52.241Z",
        "updatedAt": "2026-03-18T08:55:51.080Z"
    }
}
```

- `400 Bad Request`: Body không hợp lệ hoặc có field thừa

```json
{
    "message": ["property abc should not exist"],
    "error": "Bad Request",
    "statusCode": 400
}
```

- `401 Unauthorized`: Thiếu hoặc sai token

```json
{
    "message": "Unauthorized",
    "statusCode": 401
}
```

- `403 Forbidden`: Token hợp lệ nhưng không phải admin

```json
{
    "message": "Insufficient role",
    "error": "Forbidden",
    "statusCode": 403
}
```

- `500 Internal Server Error`: Lỗi hệ thống/DB ngoài dự kiến

---

### 8) Cập nhật quà theo id (admin)

**Method / URL**: `PUT /api/admin/gift/:id`
**Auth**: Bắt buộc JWT và role `admin`
**Path param**:

- `id`: UUID hợp lệ
- **Body tùy chọn**: các field tương tự `POST /api/admin/gift`

- **Trường hợp có thể xảy ra**:
  - `200 OK`: Cập nhật gift thành công

```json
{
    "statusCode": 200,
    "message": "Gift updated successfully",
    "data": {
        "id": "e42866ad-f7d9-4f07-b5fc-1c04c28762b0",
        "name": "Thẻ cào điện thoại 50k 2",
        "description": "Thẻ nạp tiền điện thoại mệnh giá 50.000 VNĐ, áp dụng cho tất cả nhà mạng.",
        "points": 500,
        "monetaryValue": "50000.00",
        "stock": 100,
        "isActive": false,
        "createdAt": "2026-03-18T06:25:14.033Z",
        "updatedAt": "2026-03-18T10:36:13.115Z"
    }
}
```

- `400 Bad Request`: `id` không phải UUID, body không hợp lệ, hoặc có field thừa

```json
{
    "message": "Validation failed (uuid is expected)",
    "error": "Bad Request",
    "statusCode": 400
}
```

- `401 Unauthorized`: Thiếu hoặc sai token

```json
{
    "message": "Unauthorized",
    "statusCode": 401
}
```

- `403 Forbidden`: Token hợp lệ nhưng không phải admin

```json
{
    "message": "Insufficient role",
    "error": "Forbidden",
    "statusCode": 403
}
```

- `404 Not Found`: Không tìm thấy gift theo `id`

```json
{
    "message": "Gift not found",
    "error": "Not Found",
    "statusCode": 404
}
```

- `500 Internal Server Error`: Lỗi hệ thống/DB ngoài dự kiến

---

### 9) Xóa quà theo id (admin)

**Method / URL**: `DELETE /api/admin/gift/:id`
**Auth**: Bắt buộc JWT và role `admin`
**Path param**:
`id`: UUID hợp lệ

- **Trường hợp có thể xảy ra**:
  - `200 OK`: Xóa gift thành công

```json
{
    "statusCode": 200,
    "message": "Gift deleted successfully",
    "data": {
        "id": "e42866ad-f7d9-4f07-b5fc-1c04c28762b0"
    }
}
```

- `400 Bad Request`: `id` không phải UUID

```json
{
    "message": "Validation failed (uuid is expected)",
    "error": "Bad Request",
    "statusCode": 400
}
```

- `401 Unauthorized`: Thiếu hoặc sai token

```json
{
    "message": "Unauthorized",
    "statusCode": 401
}
```

- `403 Forbidden`: Token hợp lệ nhưng không phải admin

```json
{
    "message": "Insufficient role",
    "error": "Forbidden",
    "statusCode": 403
}
```

- `404 Not Found`: Không tìm thấy gift theo `id`

```json
{
    "message": "Gift not found",
    "error": "Not Found",
    "statusCode": 404
}
```

- `500 Internal Server Error`: Lỗi hệ thống/DB ngoài dự kiến
