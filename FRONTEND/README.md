# URLMon Frontend (React + Vite)

SPA for creating and managing short URLs with authentication, dashboard, and QR tools.

Contents
- Setup and scripts
- Environment
- App architecture
- Pages and components
- Deployment and troubleshooting

## 1) Setup

Environment (.env)
```
VITE_API_URL=http://localhost:3000
```

Install and run (Windows PowerShell)
```
cd FRONTEND
npm install
npm run dev
```
App: http://localhost:5173

Scripts
- npm run dev — Vite dev server
- npm run build — production build
- npm run preview — preview the build

## 2) Architecture

Entry & bootstrap
- src/main.jsx — mounts app, sets up QueryClient, Redux store, Router
- src/RootLayout.jsx — layout + NavBar

Routing (TanStack Router)
- src/routing/routeTree.js — route tree
- Public: /
- Auth gate: /auth (redirects authenticated users to /dashboard)
- Private: /dashboard (redirects unauthenticated users to /auth)

State management
- Redux Toolkit store: src/store/store.js
- Auth slice: src/store/slice/authSlice.js
- Initial auth check: src/utils/helper.js fetches /api/auth/me and hydrates Redux

API client
- Axios instance with credentials and error normalization: src/utils/axiosInstance.js
- API wrappers:
  - src/api/user.api.js — auth (login/register/logout/me)
  - src/api/shortUrl.api.js — create short URL

Styling
- Tailwind CSS (see src/index.css)

## 3) Pages & Components

Pages
- Home: src/pages/HomePage.jsx — create short links (custom slug if authenticated)
- Auth: src/pages/AuthPage.jsx — host LoginForm and RegisterForm
- Dashboard: src/pages/DashboardPage.jsx — list user URLs with clicks

Components
- UrlForm: src/components/UrlForm.jsx — create links, show short URL, QR preview/download
- UserUrl: src/components/UserUrl.jsx — copy, preview QR, download QR
- LoginForm: src/components/LoginForm.jsx
- RegisterForm: src/components/RegisterForm.jsx
- NavBar: src/components/NavBar.jsx

## 4) Deployment

- Vercel SPA rewrite configured at vercel.json
- Set VITE_API_URL to your backend origin
- For cross-origin cookies over HTTPS, backend must serve SameSite=None; secure cookies

## 5) Troubleshooting

- Not logged in after login:
  - Ensure VITE_API_URL matches backend origin
  - Axios instance uses withCredentials=true; backend CORS must allow origin and credentials
- QR not downloading:
  - Use the dl=1 query parameter (handled by backend QR route)
- Dev proxy vs direct:
  - This app calls the backend directly via VITE_API_URL; ensure ports and firewalls allow