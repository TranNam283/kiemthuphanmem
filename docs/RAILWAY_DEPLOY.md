# HƯỚNG DẪN DEPLOY DỰ ÁN LÊN RAILWAY (DEMO)

Tài liệu này hướng dẫn deploy dự án eCommerce (React + Node + MySQL) lên Railway để phục vụ demo và kiểm thử hệ thống/E2E.

## 1. Chuẩn bị

- Có tài khoản Railway.
- Repo đã push lên GitHub.

Khuyến nghị:

- Deploy theo kiểu **2 services** (Backend + Frontend) và **1 database** (MySQL plugin).
- Đảm bảo bạn có công cụ import MySQL trên máy (MySQL Workbench/DBeaver hoặc CLI `mysql`).

### 1.1 Cài công cụ import MySQL (Windows)

Nếu bạn chưa có công cụ nào, bạn có 2 lựa chọn GUI dễ nhất (khuyến nghị) và 1 lựa chọn CLI.

#### Lựa chọn A (khuyến nghị): DBeaver Community (GUI, dễ dùng)

1. Tải và cài DBeaver Community:

- Vào https://dbeaver.io/download/
- Tải bản **Windows Installer** và cài đặt theo Next → Next.

2. Tạo kết nối MySQL:

- Mở DBeaver → **Database** → **New Database Connection**
- Chọn **MySQL** → **Next**
- Nếu hiện popup yêu cầu driver: bấm **Download** để DBeaver tự tải MySQL driver.

3. Nhập thông tin kết nối từ Railway:

- Railway → MySQL service → tab **Connect** (hoặc **Data**) → copy các giá trị:
  - Host, Port, Database, User, Password
- Dán vào DBeaver → bấm **Test Connection** → OK.

4. Import file `ecom.sql`:

- Chuột phải vào connection/database → **SQL Editor** → **Open SQL Script** → chọn `ecom.sql`
- Bấm **Execute script** (hoặc Alt+X tùy máy).

Nếu file lớn và chạy lâu: cứ để chạy, DBeaver sẽ báo progress.

#### Lựa chọn B: MySQL Workbench (GUI, chính chủ Oracle)

1. Tải “MySQL Installer”:

- Vào https://dev.mysql.com/downloads/installer/
- Tải **MySQL Installer for Windows** (Community).

2. Cài Workbench:

- Mở MySQL Installer → chọn kiểu **Custom** (hoặc **Client Only** nếu có)
- Chọn **MySQL Workbench** (không bắt buộc cài MySQL Server local)
- Install.

3. Kết nối DB Railway:

- Mở Workbench → dấu **+** (New Connection)
- Nhập Hostname/Port/Username/Password (lấy từ Railway MySQL service)
- **Test Connection**.

4. Import `ecom.sql`:

- Vào **Server** → **Data Import** (hoặc mở file `.sql` trong Workbench và chạy)
- Chọn “Import from Self-Contained File” → trỏ tới `ecom.sql` → Start Import.

#### Lựa chọn C: Chỉ cần dòng lệnh `mysql` (CLI)

Nếu bạn muốn import bằng lệnh (nhanh, ít phụ thuộc GUI), cách dễ nhất là cài “MySQL Client tools” bằng MySQL Installer:

- Vào https://dev.mysql.com/downloads/installer/
- Trong MySQL Installer, chọn **Client Only** (hoặc Custom và chọn **MySQL Shell** / **MySQL Client**)

Kiểm tra sau khi cài:

- Mở PowerShell/cmd và chạy `mysql --version`

Sau đó bạn có thể dùng các lệnh import ở mục 4.

## 2. Tạo MySQL (Railway Plugin)

1. Tạo Project mới.
2. Add plugin **MySQL**.
3. Railway sẽ cung cấp các biến môi trường kết nối DB (host, port, user, password, database).

Gợi ý thao tác trong UI:

- Vào Project → **New** → **Database** → **MySQL**.
- Chờ DB ở trạng thái **Running**.
- Mở service MySQL → tab **Variables** để xem các biến (thường có dạng `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, và/hoặc `MYSQL_URL`).

## 3. Deploy Backend (ecomAPI)

### 3.1 Tạo service backend

- Tạo service mới từ GitHub repo.
- Chọn **Root Directory** = `ecomAPI`.

Chi tiết:

- Project → **New** → **GitHub Repo** → chọn repo.
- Ở service backend → **Settings** → **Source** → đặt **Root Directory** thành `ecomAPI`.

### 3.2 Start command

Khuyến nghị chạy production:

- `npm run start:prod`

Lưu ý:

- Backend đã lắng nghe port theo `process.env.PORT` (Railway tự cấp biến `PORT`).
- Healthcheck dùng `GET /` trả về `hello`.

### 3.3 Environment variables (Backend)

Thiết lập (mapping từ MySQL plugin):

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

Gợi ý cách mapping trong Railway:

- Backend service → tab **Variables** → **New Variable**.
- Với từng biến `DB_*`, bạn có thể dùng kiểu “Reference” từ service MySQL (nếu UI hỗ trợ chọn biến từ service khác), hoặc copy giá trị từ MySQL Variables sang.

Ví dụ mapping (tùy Railway đang đặt tên biến MySQL):

- `DB_HOST` = `${MYSQLHOST}`
- `DB_PORT` = `${MYSQLPORT}`
- `DB_NAME` = `${MYSQLDATABASE}`
- `DB_USER` = `${MYSQLUSER}`
- `DB_PASSWORD` = `${MYSQLPASSWORD}`

Thiết lập thêm:

- `JWT_SECRET` (tự đặt)
- `URL_REACT` = URL frontend (sau khi deploy frontend)

Quan trọng:

- `URL_REACT` được backend dùng để tạo link verify email/forgot password và return/cancel URL của PayPal.
- Sau khi bạn có domain frontend trên Railway, quay lại cập nhật `URL_REACT`, rồi **Redeploy** backend.

Lưu ý:

- Railway tự cấp `PORT`. Backend cần lắng nghe theo `process.env.PORT` (nếu code hiện tại hard-code 8080, cần chỉnh lại).

## 4. Seed dữ liệu (ecom.sql)

Vì Railway MySQL plugin không tự import `ecom.sql`, cần seed thủ công:

Cách 1 (khuyến nghị): dùng client MySQL và chạy script

- Kết nối đến DB bằng host/user/password/port Railway cung cấp.
- Import `ecom.sql` vào database đã tạo.

Ví dụ import bằng CLI (Windows):

- Nếu dùng **PowerShell**:

  - `Get-Content .\ecom.sql | mysql --host <HOST> --port <PORT> --user <USER> --password=<PASSWORD> <DB_NAME>`

- Nếu dùng **cmd**:
  - `mysql -h <HOST> -P <PORT> -u <USER> -p<PASSWORD> <DB_NAME> < ecom.sql`

Gợi ý lấy thông tin kết nối:

- MySQL service → tab **Connect** (hoặc **Data**) → copy host/port/user/password/database.

Cách 2: dùng công cụ GUI (MySQL Workbench/DBeaver)

- Kết nối DB Railway.
- Chạy nội dung file `ecom.sql`.

Sau khi seed:

- Kiểm tra có bảng dữ liệu (ví dụ `users`, `products`, `orders`...) và có records.

## 5. Deploy Frontend (eCommerce_Reactjs)

### 5.1 Tạo service frontend

- Tạo service mới từ GitHub repo.
- Chọn **Root Directory** = `eCommerce_Reactjs`.

Chi tiết:

- Project → **New** → **GitHub Repo** → chọn lại cùng repo.
- Ở service frontend → **Settings** → **Source** → đặt **Root Directory** thành `eCommerce_Reactjs`.

### 5.2 Build + start

- Build: `npm run build`
- Start (serve static): `npm run start:prod`

Lưu ý quan trọng trên Railway:

- Service phải lắng nghe đúng port Railway cấp qua biến `PORT`.
- Script `start:prod` đã được cấu hình để lắng nghe `${PORT:-3000}` (PORT có thì dùng PORT, không có thì fallback 3000).

### 5.3 Environment variables (Frontend)

- `REACT_APP_BACKEND_URL` = URL backend (Railway domain của backend)

Lưu ý:

- React build dùng biến `REACT_APP_BACKEND_URL` tại thời điểm build. Cần set biến này trước khi build.

Vì vậy:

- Đặt `REACT_APP_BACKEND_URL` ngay từ đầu.
- Nếu bạn đặt biến sau khi đã build, hãy **Redeploy** frontend để build lại.

## 6. Post-deploy Smoke Test (tối thiểu)

1. Backend `GET /` trả về `hello`.
2. Login: `POST /api/login` nhận token.
3. Browse products: `GET /api/get-all-product-user` trả danh sách.
4. Add to cart: `POST /api/add-shopcart` (có token).

Gợi ý test nhanh DB env trên backend:

- `GET /api/debug-db` để xem backend đã “nhìn thấy” các biến `DB_*` chưa.

Thu thập minh chứng:

- Ảnh Postman/cURL.
- Logs Railway của backend.
- URL frontend + 1–2 ảnh luồng UI.

## 7. Troubleshooting

- **Backend không start do PORT**: kiểm tra backend có dùng `process.env.PORT` hay không.
- **MySQL access denied**: kiểm tra DB_USER/DB_PASSWORD/DB_NAME đúng theo plugin.
- **Timeout DB**: kiểm tra firewall/network, và backend có retry kết nối DB.
- **Frontend gọi sai backend**: kiểm tra `REACT_APP_BACKEND_URL` đã set trước build.

Các lỗi thường gặp trên Railway:

- **Deploy frontend OK nhưng không lên được (crash/restart loop)**: thường do app không listen đúng `PORT`.
- **Frontend chạy nhưng API bị 404/Network Error**: kiểm tra domain backend đúng, và backend đang Running; mở backend domain `/` để chắc chắn service sống.
