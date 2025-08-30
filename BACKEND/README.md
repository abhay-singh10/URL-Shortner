# URLMon Frontend (React + Vite)

SPA for creating and managing short URLs with auth, dashboard, and QR tools.

Tech
- React (Vite), Redux Toolkit
- TanStack Router and Query
- Tailwind CSS
- Axios with credentials

## Setup

Environment (.env)
```
VITE_API_URL=http://localhost:3000
```

Install & run
```
cd FRONTEND
npm install
npm run dev
```
App: http://localhost:5173

Build
```
npm run build
npm run preview
```

## App Overview

- Auth bootstrap: src/utils/helper.js + src/main.jsx
- Routing: src/routing/routeTree.js
  - Public: Home (/)
  - Auth gate: /auth (redirects authed users to /dashboard)
  - Private: /dashboard (requires auth; redirects to /auth)
- State: Redux slice at src/store/slice/authSlice.js
- API client: src/utils/axiosInstance.js (withCredentials + error normalization)

Key UI
- Home: src/pages/HomePage.jsx
  - URL creator: src/components/UrlForm.jsx (supports custom slug when authed)
- Auth: src/pages/AuthPage.jsx
  - Forms: LoginForm.jsx, RegisterForm.jsx
- Dashboard: src/pages/DashboardPage.jsx
  - UserUrl.jsx (copy links, preview/download QR)
- Layout: src/RootLayout.jsx with NavBar.jsx

## Deployment

- SPA rewrite for Vercel: vercel.json
- Set VITE_API_URL to your backend origin
- If served over HTTPS with cross-origin API, backend cookies must be SameSite=None and