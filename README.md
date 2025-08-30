# URLMon — URL Shortener (MERN)

A full-stack URL shortener with authentication, personal dashboards, and on-demand QR code generation.

Live demo
- https://urlmon.vercel.app/

What it does
- Shorten any URL and redirect via GET /:slug
- Register/login with httpOnly JWT cookies
- Authenticated users can:
  - Choose a custom slug
  - View a dashboard of their links with click counts
  - Copy links, preview QR, and download QR PNGs
- Generate QR codes on the fly with size, margin, color, and error-correction options

Tech stack
- Frontend: React (Vite), Redux Toolkit, TanStack Router/Query, Tailwind CSS
- Backend: Node.js, Express, MongoDB (Mongoose), JWT cookies, QRCode
- Deployment: Vercel-ready SPA rewrites, CORS + cookies for cross-origin auth

Monorepo layout
- BACKEND/ — Express REST API (details in BACKEND/README.md)
- FRONTEND/ — React SPA (details in FRONTEND/README.md)

Quick start
- Backend: see BACKEND/README.md (env, run, API)
- Frontend: see FRONTEND/README.md (env, run, build)

Security & ops (at a glance)
- Use strong secrets and secure cookies in production (SameSite=None, secure)
- Configure allowed origins for CORS
- Validate inputs and consider rate limiting

License
- MIT