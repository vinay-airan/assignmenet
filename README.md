# 🔩 Forge — Team Task Manager

A full-stack team task management application with role-based access control, Kanban board, and JWT authentication.

---

## 📁 Project Structure

```
forge/
├── backend/                   # Node.js + Express REST API
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Signup, login, getMe
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification
│   │   └── roleMiddleware.js  # RBAC enforcement
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   └── users.js
│   ├── .env.example
│   ├── package.json
│   ├── railway.json
│   └── server.js
│
└── frontend/                  # React (Vite) + Tailwind CSS
    ├── src/
    │   ├── api/
    │   │   ├── forgeClient.js     # Axios instance + JWT interceptor
    │   │   ├── authRequests.js    # Auth API calls
    │   │   └── workRequests.js    # Task/project API calls
    │   ├── hooks/
    │   │   ├── useSession.js      # Auth state (localStorage)
    │   │   └── useWorkItems.js    # Task fetching + grouping
    │   ├── ui/
    │   │   ├── Topbar.jsx
    │   │   ├── TaskItem.jsx
    │   │   ├── AddTaskPopup.jsx
    │   │   ├── StatsStrip.jsx
    │   │   └── GuardedRoute.jsx
    │   ├── views/
    │   │   ├── SigninView.jsx
    │   │   └── TaskBoard.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── vercel.json
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| HTTP Client | Axios (custom instance) |
| Routing | React Router v6 |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT + bcryptjs |
| Deploy (Backend) | Railway |
| Deploy (Frontend) | Vercel |

---

## ⚙️ Backend Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/forge
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 3. Start the server
```bash
npm run dev        # development (nodemon)
npm start          # production
```

Server runs at `http://localhost:5000`

---

## 🎨 Frontend Setup

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Start the dev server
```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## 🔐 Authentication

### Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@forge.dev",
  "password": "password123",
  "role": "admin"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "alice@forge.dev",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "664abc...",
    "name": "Alice",
    "email": "alice@forge.dev",
    "role": "admin"
  }
}
```

Use the token as `Authorization: Bearer <token>` on all protected routes.

---

## 🔒 Role-Based Access Control

| Feature | Admin | Member |
|---------|-------|--------|
| Create project | ✅ | ❌ 403 |
| Add members to project | ✅ | ❌ 403 |
| View all projects | ✅ | Own only |
| Create task | ✅ | ❌ 403 |
| Assign task to user | ✅ | ❌ 403 |
| View all tasks | ✅ | Own only |
| Update any task field | ✅ | Status only |
| Delete task | ✅ | ❌ 403 |
| List all users | ✅ | ❌ 403 |

---

## 📡 API Reference

### Projects

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `POST` | `/api/projects` | Admin | Create a project |
| `GET` | `/api/projects` | All | List projects (filtered by role) |
| `GET` | `/api/projects/:id` | All | Get single project |
| `PATCH` | `/api/projects/:id/members` | Admin | Add members |

### Tasks

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `POST` | `/api/tasks` | Admin | Create task |
| `GET` | `/api/tasks` | All | List tasks (filtered by role) |
| `GET` | `/api/tasks/stats` | All | Dashboard statistics |
| `GET` | `/api/tasks/:id` | All | Get single task |
| `PATCH` | `/api/tasks/:id` | All | Update task |
| `DELETE` | `/api/tasks/:id` | Admin | Delete task |

### Users

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` | `/api/users` | Admin | List all users |

---

## 🗃️ Data Models

### User
```js
{
  name:     String,          // required
  email:    String,          // required, unique
  password: String,          // bcrypt hashed, never returned
  role:     "admin"|"member" // default: "member"
}
```

### Project
```js
{
  name:        String,
  description: String,
  members:     [ObjectId],   // refs to User
  createdBy:   ObjectId      // ref to User
}
```

### Task
```js
{
  title:       String,
  description: String,
  projectId:   ObjectId,     // ref to Project
  assignedTo:  ObjectId,     // ref to User
  status:      "todo"|"in-progress"|"done",
  dueDate:     Date
}
```

---

## 🖥️ Frontend Pages

### `/login` — SigninView
- Email + password form
- Calls `POST /api/auth/login`
- Stores `forge_token` and `forge_user` in localStorage
- Redirects to `/board` on success
- Demo role quick-fill buttons

### `/board` — TaskBoard
- Protected route (redirects to `/login` if no token)
- Stats strip: Total / Ongoing / Completed / Overdue
- Kanban columns: **Pending** → **Ongoing** → **Completed**
- Admin: sees "New Task" button
- Member: sees only their assigned tasks

---

## 🚀 Deployment

### Backend → Railway

1. Push `backend/` to a GitHub repo
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Set environment variables in Railway dashboard:
   ```
   MONGO_URI=...
   JWT_SECRET=...
   JWT_EXPIRES_IN=7d
   CLIENT_URL=https://your-vercel-app.vercel.app
   NODE_ENV=production
   ```
4. Railway auto-deploys on every push
5. Copy your Railway URL (e.g. `https://forge-api.up.railway.app`)

### Frontend → Vercel

1. Push `frontend/` to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Framework preset: **Vite**
4. Add environment variable:
   ```
   VITE_API_URL=https://forge-api.up.railway.app/api
   ```
5. Click Deploy

---

## 🐛 Known Issues & Fixes

### "Assigned user is not a member of this project" error
**Cause:** Old code rejected task creation if the assignee wasn't already in `project.members`.  
**Fix:** `taskController.js` now auto-adds the assignee to the project's member list when creating a task.

### `/api/tasks/stats` returns 404 or CastError
**Cause:** Express was matching `"stats"` as an `:id` param.  
**Fix:** `/stats` route is declared **before** `/:id` in `routes/tasks.js`.

---

## 📄 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Validation error |
| 401 | No token / invalid token |
| 403 | Forbidden (wrong role) |
| 404 | Resource not found |
| 409 | Email already registered |
| 500 | Internal server error |

---

## 🧪 Quick Test with cURL

```bash
# 1. Signup as admin
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@forge.dev","password":"pass123","role":"admin"}'

# 2. Login and grab token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@forge.dev","password":"pass123"}'

# 3. Create a project (replace TOKEN)
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Website Redesign","description":"Q3 revamp"}'
```

---

## 📝 License

MIT — free to use and modify.
