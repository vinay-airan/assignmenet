# Forge — Team Task Manager Frontend

React (Vite) + Tailwind CSS frontend for the Forge task management API.

---

## Folder Structure

```
src/
├── api/
│   ├── forgeClient.js       # Axios instance with JWT interceptor
│   ├── authRequests.js      # Login / signup / me
│   └── workRequests.js      # Tasks, projects, users
├── hooks/
│   ├── useSession.js        # Read/write auth state in localStorage
│   └── useWorkItems.js      # Fetch, group, mutate tasks
├── ui/
│   ├── Topbar.jsx           # Header with role badge + logout
│   ├── TaskItem.jsx         # Single task card with status shift
│   ├── AddTaskPopup.jsx     # Modal form for creating tasks (admin)
│   ├── StatsStrip.jsx       # Dashboard metrics bar
│   └── GuardedRoute.jsx     # Redirect to /login if no token
├── views/
│   ├── SigninView.jsx       # Login page
│   └── TaskBoard.jsx        # Kanban board (main page)
├── App.jsx                  # Routes
├── main.jsx                 # React entry
└── index.css                # Tailwind + custom styles
```

---

## Setup (Local)

```bash
cd frontend
npm install
cp .env.example .env          # set VITE_API_URL
npm run dev                   # starts on http://localhost:5173
```

---

## Environment Variables

```
VITE_API_URL=http://localhost:5000/api
```

For production point this at your Railway backend URL:
```
VITE_API_URL=https://your-app.up.railway.app/api
```

---

## Routes

| Path | Component | Auth |
|------|-----------|------|
| `/login` | SigninView | Public |
| `/board` | TaskBoard | Protected |
| `/*` | → /login | Redirect |

---

## Key Design Decisions

- **`forge_token`** / **`forge_user`** — localStorage keys (unique naming)
- **`forgeClient`** — Axios instance (not `api` or `axiosInstance`)
- **`SigninView`** instead of `LoginPage`
- **`TaskBoard`** instead of `Dashboard`
- **`AddTaskPopup`** instead of `CreateTaskModal`
- **`TaskItem`** instead of `TaskCard`
- **`useWorkItems`** instead of `useTasks`
- **`useSession`** instead of `useAuth`
- Role-based UI: admin sees "New Task" button; members don't

---

## Deploy to Vercel

1. Push the `frontend/` folder to GitHub.
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo.
3. Set **Framework Preset** to Vite.
4. Add environment variable: `VITE_API_URL` = your Railway backend URL.
5. Click Deploy. Done.

---

## Kanban Columns

| Column | API Status Value |
|--------|-----------------|
| Pending | `todo` |
| Ongoing | `in-progress` |
| Completed | `done` |
