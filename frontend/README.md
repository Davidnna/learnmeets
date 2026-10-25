# LearnMeets AI — React application

This is the primary browser application. React + Vite provides the public pages, authentication screens, dashboard, AI tutor, study materials, quizzes, quiz history, study tools, progress, settings, and account management. Flask remains the backend for authentication, sessions, CSRF validation, database access, file processing, and AI features.

## Run locally

1. From the project root, create/activate your Python environment and install `requirements.txt`.
2. Configure the root `.env` using your existing database URL and secrets.
3. Start the Flask API: `python app.py`.
4. In this folder, copy `.env.example` to `.env.local` if needed, leave `API_BASE_URL` blank for the Vite proxy, then run `npm install` and `npm run dev`.
5. Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## Deploy React to Vercel

- Set the Vercel project root directory to `frontend`.
- Build command: `npm run build`. Output directory: `dist`.
- Set the non-sensitive Vercel environment variable `API_BASE_URL` to the full HTTPS URL of the Flask API on Render (for example, `https://learnmates.onrender.com`). The Vite config explicitly exposes this public URL to the browser bundle; do not store secrets in it. Redeploy after changing the variable.
- Keep the SPA rewrite in `vercel.json` so client-side routes such as `/account` and `/history` load correctly.

## Configure Flask on Render

Set these server-side environment variables:

- `REACT_FRONTEND_URL`: exact public Vercel origin, e.g. `https://your-app.vercel.app` (no trailing slash). This redirects old Flask HTML page URLs to their React routes.
- `FRONTEND_ORIGIN`: the same exact Vercel origin, for credentialed API CORS.
- `COOKIE_SECURE=true`
- `SESSION_COOKIE_SAMESITE=None`
- Existing `SECRET_KEY`, `DATABASE_URL`, AI provider keys, and other current production settings.

Use HTTPS for both services. Do not use wildcard CORS with credentialed sessions. Some browsers block third-party cookies across unrelated Vercel/Render domains; if login sessions fail in a browser, use a same-origin custom domain/reverse proxy for the API rather than weakening security.

## Existing data and rollback

The migration does not reset the database or delete user records. Flask retains its API and legacy HTML templates; setting `REACT_FRONTEND_URL` enables redirects so React is the primary browser UI. To temporarily restore legacy Flask pages, unset `REACT_FRONTEND_URL` and redeploy the backend. Keep `.env` and production secrets out of Git.
