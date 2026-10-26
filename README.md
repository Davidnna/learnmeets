# LearnMeets AI

**AI-Based Student Learning Assistance System** — a final-year Computer Science project built with a React/Vite frontend and a Flask/Python backend.

LearnMeets AI helps students organise course materials, ask questions about their notes, practise with quizzes, review their progress, and access study tools. It also includes account management and a feedback/support workflow.

## Features

- Student registration, login, logout, and session-based authentication.
- Google sign-in when OAuth credentials are configured.
- Email verification for password-based registration, plus password reset and email-change confirmation flows.
- Account profile management, profile-picture upload, account deletion, and password changes for password-based accounts.
- Upload and manage PDF/TXT study materials, with text extraction and retrieval from the current student's materials.
- AI tutor responses with optional note-grounded retrieval and source labels.
- Quiz generation, quiz scoring and review, quiz history, and dashboard progress summaries.
- Study tools for summaries and revision flashcards.
- Feedback and support submissions, with protected administrator endpoints for reviewing and responding.
- Responsive React interface, with a Flask-rendered template interface retained in the backend.
- Optional hosted AI providers and local Ollama support, depending on configuration and installed models.

## Technology

- **Frontend:** React, Vite, React Router, `lucide-react`, React Markdown.
- **Backend:** Python, Flask, Flask-Login, Flask-SQLAlchemy.
- **Database:** SQLite for local development by default; PostgreSQL can be configured with `DATABASE_URL`.
- **AI:** provider selection through environment variables; hosted provider access requires the corresponding API key.
- **Email:** SMTP or the Nylas HTTPS API, configured through environment variables.
- **Deployment:** the React frontend can be hosted separately from the Flask API. The repository includes Vercel configuration for the frontend.

## Project layout

```text
LearnMeets_AI/
├── app.py                    # Flask app, API routes, auth and data models
├── requirements.txt          # Python dependencies
├── .env.example              # Backend/local environment variable template
├── templates/                # Flask-rendered pages
├── static/                   # Flask styles and brand assets
├── tests/                    # Python tests
├── scripts/                  # Project verification utilities
└── frontend/
    ├── package.json          # Frontend scripts and dependencies
    ├── vite.config.js        # Vite config and local API proxy
    ├── vercel.json           # Vercel routing configuration
    ├── .env.example          # Frontend environment template
    ├── index.html
    └── src/                  # React app, API client and styles
```

## Requirements

- Python 3.10 or newer.
- Node.js and npm compatible with the Vite version installed by `npm install`.
- A database supported by the configured SQLAlchemy URL.
- Internet access for installing dependencies and using hosted AI/email services.
- Optional: an AI provider API key or a local Ollama installation.

## Run locally

### 1. Configure and start the Flask backend

From the project root:

**Windows PowerShell**

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

**macOS/Linux**

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env
```

Edit `.env` before running the app. Set a unique, strong `SECRET_KEY`. For local development, `DATABASE_URL` may be left unset to use the configured SQLite default. To use PostgreSQL, provide a valid connection URL. Never commit `.env` or share its secrets.

Start the backend:

```bash
python app.py
```

The Flask development server normally listens at `http://127.0.0.1:5000`. The `/health` endpoint can be used for a basic health check.

### 2. Configure and start the React frontend

Open a second terminal and change into `frontend`:

```bash
cd frontend
npm install
```

Copy `frontend/.env.example` to `frontend/.env.local` if needed, then configure `API_BASE_URL` only when you want the frontend to call a separately hosted backend. For local development, the Vite development server proxies `/api` and `/health` to `http://127.0.0.1:5000` by default.

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

To create a production frontend build:

```bash
npm run build
```

The generated build is written to `frontend/dist/`. Do not commit build output unless your deployment process specifically requires it.

## Environment configuration

Use `.env.example` as the reference for backend configuration and `frontend/.env.example` for frontend configuration. Common settings include:

- `SECRET_KEY`: required secret used by Flask sessions; use a strong, unique value in production.
- `DATABASE_URL`: optional local database URL; set to your hosted PostgreSQL connection string in production.
- `COOKIE_SECURE`: enable secure session cookies when serving over HTTPS.
- `SESSION_COOKIE_SAMESITE`: cookie policy. Cross-site frontend/API deployments may require `None` together with secure cookies; test this carefully in the deployed environment.
- `FRONTEND_ORIGIN`: allowed origin for a separately hosted React frontend.
- `API_BASE_URL`: public Flask API base URL used by the Vite frontend when deployed separately. It is not a secret; never place API keys in frontend variables.
- `AI_PROVIDER`: selects the configured AI provider.
- Provider-specific variables such as `GROQ_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `OLLAMA_BASE_URL`, and model names.
- Email variables such as `EMAIL_PROVIDER`, `NYLAS_API_KEY`, `NYLAS_DOMAIN`, `NYLAS_FROM_EMAIL`, or SMTP settings.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` for Google OAuth.

Only configure providers you intend to use. Keep all API keys and other secrets on the backend. On hosting platforms, configure production values in the service's environment-variable settings rather than committing them to the repository.

### AI providers

The application supports provider configuration through environment variables. For hosted inference, configure the matching provider and valid API key/model. For local inference, install Ollama, download a model supported by your machine, and set the Ollama URL and model name. Provider availability, model names, quotas, and prices can change; check the provider's current documentation before deployment.

When an AI provider is unavailable or not configured, some study workflows have local fallbacks. Fallback results may be more limited than live model responses; check the UI and logs when troubleshooting.

### Email verification and password recovery

The backend supports email delivery through SMTP or Nylas HTTPS API configuration. On hosts that block outbound SMTP, use an HTTPS email provider. For Nylas, configure a verified sending domain and sender address in its dashboard, then set the corresponding environment variables in the backend service. Never put the Nylas key in the React frontend. After configuration, test registration, verification links, password reset, and email-change confirmation using a non-production test account before relying on the workflow.

## Administrator access

Administrator privileges are assigned through the backend's user role; creating an ordinary account does not automatically grant admin access. Only promote an account when you are authorised to administer this installation. Confirm the actual database schema and user record before making a role change. Do not expose administrator credentials or grant admin access to student accounts. The backend must enforce authorisation for admin APIs; hiding a link in the frontend is not a security boundary.

## Tests and checks

Install the Python dependencies first, activate the virtual environment, and run the test suite from the project root:

```bash
python -m unittest discover -s tests -v
```

For the frontend, run the production build from `frontend/`:

```bash
npm run build
```

A passing syntax check or successful build does not replace functional testing. Before deploying, test registration and sign-in, email verification and recovery, Google OAuth if enabled, account updates, file upload and ownership, AI workflows, quizzes, feedback submissions, admin authorisation, and logout. Check the browser console and backend logs for errors.

## Deployment notes

- Deploy the Flask backend and React frontend according to your hosting providers' instructions.
- Set `API_BASE_URL` to the public backend URL for a separately hosted frontend, and set `FRONTEND_ORIGIN` to the exact public frontend origin on the backend.
- Use HTTPS and secure cookies in production. Confirm cookie and CORS behaviour when frontend and backend use different origins.
- Configure the production database URL, secret key, AI provider credentials, email provider, and OAuth credentials in the host dashboard.
- Run a database backup before schema or application changes. Do not reset the production database as a deployment shortcut.
- Verify health checks, deployment logs, email delivery, OAuth redirect URIs, and the main student workflows after deployment.
- Never commit `.env`, access tokens, API keys, database credentials, or real student data.

## Known limitations and responsible use

- Retrieval quality depends on the text extracted from uploaded documents and the lightweight ranking method; relevant passages can be missed and AI-generated answers can still be incorrect.
- Text extraction may not work well for scanned PDFs, handwriting, complex layouts, or tables. OCR and vision-provider support depend on the current implementation and provider configuration.
- AI model access, rate limits, and service availability depend on the selected provider and account.
- Quiz recommendations and progress summaries are study aids, not validated educational or psychological assessments.
- This project is an academic application. Before real institutional use, perform a security review, accessibility testing, privacy review, file-upload abuse testing, database migration planning, backup/restore testing, and monitoring setup.

## Academic project note

Use the application to demonstrate and evaluate the implemented system. Test it yourself, report actual test outcomes, cite external sources in your academic report, and make sure you can explain the architecture and design decisions during your project defence.

### Support notification emails

Set `SUPPORT_EMAIL` in the backend environment to the address that should receive new student feedback and support submissions. If omitted, the application attempts to notify email addresses on accounts with the `admin` role. Ensure at least one destination is configured. Student email notifications are sent when an administrator adds or changes a reply. Transactional messages use the configured Nylas HTTPS provider or SMTP fallback and share the LearnMeets AI branded email layout.
