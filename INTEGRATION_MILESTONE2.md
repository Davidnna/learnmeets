# LearnMeets AI — React integration milestone 2

This update adds a Flask JSON API and connects the React interface to existing features. It is intended to be tested locally before any production routing changes.

## Apply to your project safely

1. Make a backup or commit your current project first. In PowerShell from your repository:
   ```powershell
   git status
   git add -A
   git commit -m "Checkpoint before React API integration"
   ```
   If you have uncommitted work you do not want to commit, copy `app.py` to `app.py.before-react-api.py` instead.
2. Extract this ZIP somewhere separate first and review the changed files. Copy the updated `frontend/` directory into your existing repository. The updated `app.py` is based on the project version included in the previous React milestone; compare it with your current local `app.py` before replacing it so you do not lose any changes made since that package was created.
3. Keep your existing `.env`, Neon `DATABASE_URL`, Groq key, and `SECRET_KEY`. Do not replace them with example values. The new `.env.example` is documentation only.
4. In your activated `.venv`, run `python -m pip install -r requirements.txt` from the project root.
5. Run `python -m py_compile app.py`, then start Flask with `python app.py`.
6. In a second terminal, go to `frontend` and run `npm install` then `npm run dev`. Open the Vite URL it prints (normally `http://localhost:5173`).

## Local smoke test

- Open `/api/session` in the browser while Flask is running; it should return JSON with a CSRF token.
- Register a temporary test account, sign out, then sign in again.
- Confirm dashboard metrics load.
- Send a tutor question without a document and then with a document selected.
- Upload a small text-based PDF or TXT file, confirm extracted text is reported, and delete it.
- Generate a small quiz, answer questions, submit, and check the score and review.
- Open quiz history and review the attempt.
- Generate a summary and flashcards from an uploaded document.
- Sign out and confirm feature API requests return a JSON 401 instead of HTML.
- Confirm the pre-existing student accounts and records still exist. Do not reset or recreate the database.

## Deployment caution

Do not switch production traffic to the React UI until these checks pass locally. If frontend and backend have separate origins, configure the non-sensitive `API_BASE_URL` and the exact `FRONTEND_ORIGIN`; use HTTPS and cookie settings documented in `frontend/README.md`. Same-origin routing is preferred because cross-site cookie restrictions can interfere with sessions. Vercel's local filesystem is temporary; this prototype stores extracted document text in the existing database and deletes the temporary source upload after extraction.

## Validation performed while preparing this package

- `app.py` passed Python syntax compilation (`py_compile`).
- The full Flask runtime tests were not run because this build environment lacks several requirements.
- The Vite production build was not verified because `npm install` timed out in the build environment. Please run the smoke test above in your local environment before deploying.
