# He Thong Quan Ly Cong Viec / Du An

Day la ung dung full-stack quan ly cong viec theo mo hinh ToDo / Project Task Management System.

Ung dung gom:

- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend: React, Context API, Axios, React Router, Tailwind CSS
- Xac thuc: JWT access token + refresh token
- Upload file: Multer cho task va comment
- Phan quyen: `admin` / `user`
- Soft delete cho user, project, task, comment
- 2 model moi: `Tag` va `ActivityLog`
- 2 tien ich moi: loc tim kiem nang cao va xuat CSV task

## 1. Cau truc thu muc

```text
backend/
├─ controllers/
├─ middlewares/
├─ models/
├─ routes/
├─ utils/
├─ uploads/
├─ app.js
├─ server.js
└─ package.json

frontend/
├─ src/
│  ├─ components/
│  ├─ hooks/
│  ├─ layouts/
│  ├─ pages/
│  ├─ services/
│  ├─ store/
│  ├─ utils/
│  ├─ App.jsx
│  ├─ index.css
│  └─ main.jsx
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
└─ vite.config.js

.env.example
package.json
README.md
```

## 2. Chuc nang chinh

### Backend

- Dang ky / dang nhap
- Lay thong tin nguoi dung hien tai
- Cap nhat ho so ca nhan
- Doi mat khau
- Quan ly user danh cho admin
- CRUD project
- CRUD task
- Gan task cho nhieu user
- Cap nhat trang thai `todo`, `in progress`, `done`
- Binh luan theo task
- Upload file khi tao task hoac comment
- Thong bao khi co task moi hoac comment moi
- Dashboard tong hop du lieu
- Quan ly tag
- Ghi nhat ky hoat dong
- Xuat danh sach task ra CSV
- Tim kiem va loc nang cao theo trang thai, tag, due date

### Frontend

- `LoginPage`
- `RegisterPage`
- `DashboardPage`
- `ProjectsPage`
- `ProjectDetailPage`
- `TaskDetailPage`
- `UsersPage` chi danh cho admin
- `NotificationsPage`
- `ProfilePage` (cap nhat ten, avatar URL, preview avatar, doi mat khau)
- Khu vuc filter nang cao, tag, activity log va export CSV trong ProjectDetailPage\r\n- Khu admin rieng voi dashboard thong ke, activity log, quick actions, task filters, trang Projects/Tasks/Users

## 3. Yeu cau moi truong

- Node.js 18+ hoac moi hon
- MongoDB dang chay local
- npm

Vi du MongoDB local:

```text
mongodb://127.0.0.1:27017/task_management_app
```

## 4. Cau hinh file `.env`

Tao file `.env` o thu muc goc bang cach copy tu [`.env.example`](/C:/Users/ADMIN/OneDrive/Documents/New%20project/.env.example):

```powershell
copy .env.example .env
```

Noi dung mau:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/task_management_app
JWT_ACCESS_SECRET=replace_with_access_secret
JWT_REFRESH_SECRET=replace_with_refresh_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
SEED_ON_START=true
VITE_API_URL=http://localhost:5000/api
```

Ghi chu:

- `PORT`: cong backend
- `MONGODB_URI`: chuoi ket noi MongoDB
- `JWT_ACCESS_SECRET`: secret cho access token
- `JWT_REFRESH_SECRET`: secret cho refresh token
- `FRONTEND_URL`: dia chi frontend de cau hinh CORS
- `SEED_ON_START=true`: tu tao du lieu mau khi database dang trong
- `VITE_API_URL`: dia chi API ma frontend goi toi

## 5. Cach cai dat

O thu muc goc [project](/C:/Users/ADMIN/OneDrive/Documents/New%20project):

```powershell
npm install
```

## 6. Cach chay

### Cach 1: Chay ca backend va frontend cung luc

O thu muc goc:

```powershell
npm start
```

### Cach 2: Chay rieng tung phan

Chay backend:

```powershell
cd "C:\Users\ADMIN\OneDrive\Documents\New project\backend"
npm start
```

Chay frontend:

```powershell
cd "C:\Users\ADMIN\OneDrive\Documents\New project\frontend"
npm start
```

## 7. Dia chi chay sau khi start

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- API base: `http://localhost:5000/api`

## 8. Tai khoan test

Neu database dang trong va trong file `.env` co:

```env
SEED_ON_START=true
```

thi he thong se tu tao du lieu mau:

- Admin:
  - Email: `admin@example.com`
  - Password: `Password123!`
- User:
  - Email: `user@example.com`
  - Password: `Password123!`

Ngoai ra he thong con tao:

- 1 project mau
- mot vai task mau
- 2 tag mau

## 9. Danh sach API chinh

### Auth

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/me
```

### User

```text
GET    /api/users/me
PATCH  /api/users/me
PATCH  /api/users/me/password
GET    /api/users
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
```

### Project

```text
GET    /api/projects
GET    /api/projects/:id
POST   /api/projects
PATCH  /api/projects/:id
DELETE /api/projects/:id
```

### Task

```text
GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
GET    /api/tasks/export/csv
```

### Comment

```text
GET    /api/comments/task/:taskId
POST   /api/comments
PATCH  /api/comments/:id
DELETE /api/comments/:id
```

### Notification

```text
GET    /api/notifications
PATCH  /api/notifications/read-all
PATCH  /api/notifications/:id/read
PATCH  /api/notifications/:id/unread
```

### Dashboard

```text
GET    /api/dashboard
```

### Tag

```text
GET    /api/tags
POST   /api/tags
```

### Activity

```text
GET    /api/activities
```

## 10. Upload file

- File task/comment duoc upload vao thu muc [backend/uploads](/C:/Users/ADMIN/OneDrive/Documents/New%20project/backend/uploads)
- API tra ve duong dan dang:

```text
/uploads/ten-file
```

- Frontend se ghep domain backend de mo file dinh kem

## 11. Phan quyen

### Admin

- Quan ly user
- Tao / sua / xoa project
- Tao tag moi
- Xem cac project ma he thong tra ve

### User

- Xem project ma minh la thanh vien
- Xem task thuoc project duoc phan quyen
- Comment vao task trong project co quyen truy cap
- Cap nhat ho so ca nhan
- Su dung bo loc nang cao va export CSV cho du lieu minh truy cap

## 12. Tinh nang admin dashboard moi\r\n\r\n- Route admin rieng: /admin, /admin/projects, /admin/tasks, /admin/users\r\n- Quick action trong header admin: tao project moi, tao task moi\r\n- Trang admin projects co nut xoa project ngay tren danh sach\r\n- Dashboard admin co 4 stat card: tong project, tong task, task hoan thanh hom nay, task qua han\r\n- Activity log component hien thi thay doi gan day\r\n- Card task admin hien thi status, priority, deadline, assigned user\r\n- Loc task nhe theo status va project ngay tren admin dashboard\r\n\r\n## 13. Tinh nang moi da them

### Model moi

- `Tag`: quan ly nhan cho task
- `ActivityLog`: luu lich su thao tac voi project, task, comment, tag

### Tien ich moi cho web

- Tim kiem va loc task nang cao theo tu khoa, status, tag, due date
- Xuat danh sach task cua project ra file CSV

## 14. Don dep ma nguon cu

Repository da duoc don lai de chi giu phan dang dung:

- Da bo bo backend cu o thu muc goc
- Da bo cac page, layout, component legacy khong con duoc route moi su dung
- README nay da viet lai theo dung phien ban hien tai

## 15. Ghi chu

- Neu backend bao `EADDRINUSE`, nghia la cong `5000` dang bi chiem
- Neu login khong vao duoc, hay kiem tra:
  - backend da chay chua
  - MongoDB da chay chua
  - file `.env` da ton tai chua
  - frontend da restart sau khi sua `.env` chua
- Frontend da duoc build kiem tra thanh cong trong qua trinh chinh sua

## 16. File quan trong

- Backend entry: [backend/server.js](/C:/Users/ADMIN/OneDrive/Documents/New%20project/backend/server.js)
- Backend app: [backend/app.js](/C:/Users/ADMIN/OneDrive/Documents/New%20project/backend/app.js)
- Frontend app: [frontend/src/App.jsx](/C:/Users/ADMIN/OneDrive/Documents/New%20project/frontend/src/App.jsx)
- Context store: [frontend/src/store/AppContext.jsx](/C:/Users/ADMIN/OneDrive/Documents/New%20project/frontend/src/store/AppContext.jsx)
- Bien moi truong mau: [`.env.example`](/C:/Users/ADMIN/OneDrive/Documents/New%20project/.env.example)


