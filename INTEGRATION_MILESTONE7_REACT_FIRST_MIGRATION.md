# Milestone 7 — React-first application migration

## Included
- Set the React/Vite app as the intended primary browser experience and document Vercel deployment with `frontend/` as the root directory.
- Added `REACT_FRONTEND_URL` routing in Flask so legacy browser page URLs redirect to their matching React routes while `/api/*`, `/health`, `/static/*`, and `/admin` are not redirected.
- Added old-route aliases: `/chat` → `/tutor`, `/quiz` → `/quizzes`, `/quiz-history` → `/history`. Query strings are preserved.
- Kept Flask as the backend for sessions, CSRF, account endpoints, uploads, quiz generation, AI tutor and study tools.
- Updated React account mini-profile and avatar to use the signed-in user's actual name/email instead of hard-coded initials.
- Updated deployment notes for Vercel + Render, credentialed CORS and cross-origin cookies.
- No destructive database changes.

## Required deployment configuration
Render: set `REACT_FRONTEND_URL` and `FRONTEND_ORIGIN` to the exact Vercel origin; set `COOKIE_SECURE=true` and `SESSION_COOKIE_SAMESITE=None` for separate HTTPS origins. Preserve the existing `SECRET_KEY`, `DATABASE_URL`, and AI provider keys.

Vercel: root directory `frontend`; build `npm run build`; output `dist`; set the non-sensitive `API_BASE_URL` to the Render API URL. The Vite config exposes this public URL to the browser bundle.

## Verification
Run `python -m py_compile app.py`, then in `frontend/` run `npm install` and `npm run build`. Test login/register, refresh on nested routes, account profile update, password change, chat, upload/delete material, quiz generation/submission, history, and logout against a staging deployment before changing production routing.

## Git commit
`feat: make React the primary LearnMeets AI frontend`
