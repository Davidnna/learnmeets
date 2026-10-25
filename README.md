# LearnMeets AI — Student Learning Assistance System

Version 6 update: adds local Ollama support and a responsive mobile navigation menu.

A final-year Computer Science project prototype built with Python, Flask, Flask-Login, Flask-SQLAlchemy, SQLite, HTML/CSS, and optional local Ollama, hosted Groq, OpenAI, or Gemini API integration.

## Features
- Student registration, login, and logout
- Password hashing
- AI tutor with optional live model integration and note-grounded responses
- PDF/TXT upload and text extraction, including PDF page markers for source locations
- BM25-style keyword retrieval of relevant passages from the selected student-owned notes
- Retrieved-passage labels ([S1], [S2], etc.) shown in the tutor UI for source transparency
- Explicit no-match handling so the tutor does not imply unrelated notes support an answer
- Source-grounded offline fallback when the AI API is not configured
- Quiz generation with strict JSON/schema validation, distinct answer choices, and verified verbatim evidence quotes when uploaded notes are selected
- Offline note-based quiz fallback whose correct choices are copied from the selected notes
- Dashboard score trend visualization for up to the latest seven quiz attempts
- CSRF protection for POST forms and safer session-cookie defaults
- Study tools for summaries and revision flashcards from uploaded or pasted material
- Quiz scoring, history, and performance-based study recommendations
- Basic administrator dashboard
- Responsive user interface with a keyboard-operable mobile navigation menu
- Free local AI support through Ollama, without a hosted API key

## Requirements
- Python 3.10 or newer recommended
- Internet access only for package installation and live AI requests
- Optional Ollama installation for free local model responses, a Groq API key for hosted free-tier inference, or an OpenAI API key for hosted responses

## Run locally
1. Extract this project folder.
2. Create and activate a virtual environment:
   - Windows: `py -m venv .venv` then `.venv\\Scripts\\activate`
   - macOS/Linux: `python3 -m venv .venv` then `source .venv/bin/activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Copy `.env.example` to `.env`.
5. Set a strong random `SECRET_KEY`. For free local AI, install Ollama, run `ollama pull qwen2.5:3b`, then set `AI_PROVIDER=ollama` in `.env`. For hosted Groq, set `AI_PROVIDER=groq`, `GROQ_API_KEY`, and `GROQ_MODEL=openai/gpt-oss-20b`; for hosted OpenAI, set `AI_PROVIDER=openai` and configure `OPENAI_API_KEY`. Never commit `.env`.
6. Start the application: `python app.py`
7. Open `http://127.0.0.1:5000` in your browser.

The database tables are created automatically on first run.

## Create an administrator
Register an account normally, stop the app, then run:
```bash
python
>>> from app import app, db, User
>>> with app.app_context():
...     u = User.query.filter_by(email="your-email@example.com").first()
...     u.role = "admin"
...     db.session.commit()
>>> exit()
```
Restart the application and use the Admin link. Do not expose this prototype publicly without hardening it.

## Important limitations
- Without the required key for the selected hosted provider, the app explicitly states that live AI is not configured. When course notes are selected, fallback quiz answers are copied from source sentences; without notes, fallback questions are clearly labeled study-habit demonstrations, not subject assessments.
- Document retrieval uses a lightweight BM25-style keyword ranker, not embeddings or a vector database. It is a transparent baseline suitable for demonstrating retrieval-augmented generation (RAG), but may miss semantically related passages. Source labels identify the retrieved snippets supplied to the model; they are not a guarantee that the answer is correct or exhaustive.
- PDF extraction works only for text-based PDFs; scanned image PDFs require OCR, which is not included.
- The starter is for local academic demonstration. Before production deployment, add email verification/password reset, login rate limiting, robust audit logging, malware scanning, stronger file isolation, database migrations, HTTPS, and operational monitoring. CSRF protection and basic session-cookie flags are included in this prototype, but they do not by themselves make it production-ready.
- The first registered user is not automatically an administrator.
- Performance recommendations are simple rules based on quiz scores; this is not a validated predictive model.

## Suggested project structure
```text
learnmates_ai/
├── app.py
├── requirements.txt
├── .env.example
├── README.md
├── DEPLOYMENT_FREE_PILOT.md
├── docs/requirements-traceability.md
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── about.html
│   ├── features.html
│   ├── how_it_works.html
│   ├── faq.html
│   ├── privacy.html
│   ├── register.html
│   ├── login.html
│   ├── dashboard.html
│   ├── chat.html
│   ├── materials.html
│   ├── study_tools.html
│   ├── quiz.html
│   ├── quiz_result.html
│   └── admin.html
├── static/
│   ├── style.css
│   ├── brand-mark.svg
│   └── favicon.svg
└── tests/
    ├── test_accessibility_static.py
    ├── test_ai_retry.py
    ├── test_quiz_logic.py
    ├── test_retrieval.py
    └── test_smoke.py
```
## Academic integrity
Use this prototype as a starting point. Run the system yourself, test it, document the actual outcomes, cite external sources in your report, and make sure you can explain each implementation decision during your defense.


## Version 4 additions
- Source-grounded quiz generation now requires a verbatim evidence quote from the selected notes, and the correct answer option must match that quote exactly. Invalid AI output is rejected.
- If AI quiz generation is unavailable or fails validation, a local fallback builds questions from sentences in the selected notes and uses explicitly contradicted alternatives. If there is not enough readable text, the interface says so rather than pretending a content quiz was created.
- The quiz result page shows the chosen and correct answer text plus supporting source evidence when available.
- Dashboard includes a compact score-trend bar chart for the latest seven attempts.
- POST forms require a session CSRF token. Session cookies use HttpOnly and SameSite=Lax defaults; `COOKIE_SECURE=true` should be used behind HTTPS.

## Verification performed for this package
- Python syntax compilation passed for `app.py` and test modules.
- All Jinja templates parsed successfully.
- Isolated checks passed for note-derived quiz generation, unique answer options, verbatim evidence acceptance, fabricated-evidence rejection, and note retrieval.
- The full Flask integration test suite could not be run in the build environment because Flask dependencies could not be downloaded. Run `python -m unittest discover -s tests -v` locally after installing requirements.

## Functional requirements and accessibility review

The current prototype's core functional scope is: account registration/login/logout; private per-account PDF/TXT note uploads and deletion; question answering with optional note retrieval; study summaries and flashcards; quiz generation/submission/scoring/review; recent performance tracking; and a basic admin usage view. Optional live AI requires a valid API key and network access. An offline fallback is available for selected study workflows; fallback content is explicitly distinguished from live AI output.

### Accessibility and responsive design work in this version
- Semantic header, primary-navigation landmark, main landmark, and footer; skip-to-main-content link; current-page navigation state.
- Visible keyboard focus indicators and larger minimum targets for common controls.
- Proper form labels, helper text for the tutor question, fieldsets/legends for quiz questions, table header scopes, and a tabular alternative to the score chart.
- - Responsive navigation wrapping and mobile layouts, no external font download requirement, and reduced-motion/forced-colors CSS support.
- Status and error announcements for flashed messages.

These are accessibility-oriented improvements, not a claim of certified WCAG conformance. Assistive-technology testing remains necessary. Before submission, test all routes using keyboard only, a screen reader (NVDA with Firefox/Chrome or VoiceOver with Safari), 200% browser zoom, a 320 CSS-pixel viewport, Windows High Contrast/forced-colors if available, and an automated checker such as axe. Check the actual color contrast of every state and the focus order in the running application.

### Requirements traceability
See `docs/requirements-traceability.md` for the implemented scope, test coverage, and items that remain unverified or outside this prototype.

### Accessibility regression checks
After installing the requirements, run the full test suite:
```bash
python -m unittest discover -s tests -v
```
The suite includes static checks for semantic landmarks, skip navigation, public information navigation, keyboard focus support, reduced-motion/forced-colors styling, a chart table alternative, and accessible tutor prompt buttons. Static checks do not establish WCAG conformance; follow the manual test checklist above.

## Public information pages

Visitors can view the Home, About, Features, How It Works, FAQ, and Privacy pages without registering. An account is required for personal notes, AI chat history, quizzes, and progress records. The privacy page describes the current prototype's data flows and limitations; it is not a replacement for a complete institutional privacy policy.

## Hosted Groq API (free-tier pilot)

The default hosted provider is Groq, using its OpenAI-compatible Chat Completions endpoint. In Render, set `AI_PROVIDER=groq`, `GROQ_API_KEY`, and `GROQ_MODEL=openai/gpt-oss-20b`. The application retries transient failures a limited number of times and can try an optional `GROQ_FALLBACK_MODEL` if you configure a second model that is confirmed available to your account. Check current models and rate limits in [Groq documentation](https://console.groq.com/docs/models) and [rate limits](https://console.groq.com/docs/rate-limits). Free-tier availability and quotas can change; do not send sensitive student data unless the applicable terms and institutional rules permit it.

## Free local AI with Ollama (recommended for development)

1. Install Ollama for Windows from https://ollama.com/download/windows.
2. Open a new PowerShell terminal and download a small model: `ollama pull qwen2.5:3b`. This download can take several minutes and uses disk space.
3. In the project `.env` file, set `AI_PROVIDER=ollama`, `OLLAMA_BASE_URL=http://localhost:11434/v1`, and `OLLAMA_MODEL=qwen2.5:3b`.
4. Restart LearnMeets AI (`Ctrl+C`, then `python app.py`). Keep Ollama running in the background.
5. Check the model is installed with `ollama list`.

No OpenAI API key is required for Ollama. Response speed depends on your computer's RAM/CPU/GPU. If you prefer hosted OpenAI, set `AI_PROVIDER=openai` and configure `OPENAI_API_KEY`. Never commit `.env` or share API keys.

## Render URL note

The default `onrender.com` hostname is based on the Render service name. To try to use `https://learnmates.onrender.com`, open the existing web service in the Render Dashboard and rename it to `learnmates` if that name is available. Render may keep the old URL or require creating a new service depending on the service state; verify the hostname shown in Settings before sharing it. The requested name is not guaranteed to be available.


## Temporary quiz diagnostics (remove after troubleshooting)

To show the initial and repair AI response when quiz generation fails, set the Render environment variable `QUIZ_DEBUG_ERRORS` to `true` and redeploy. The diagnostics panel appears only on the authenticated quiz page after a failed generation and shows at most 1,200 characters per response. It may expose provider error details or text returned by the model, so use it only temporarily. After diagnosing the issue, set `QUIZ_DEBUG_ERRORS` to `false` (or remove the variable) and redeploy. This does not change the database or student records.

### Scanned PDF OCR (Groq vision)

Digital PDF text is extracted first. PDF pages with little or no selectable text are rendered with PyMuPDF and sent to Groq's vision-capable model for transcription. Configure `GROQ_API_KEY` in Render and, optionally, `GROQ_VISION_MODEL` (default: `qwen/qwen3.8-27b`) and `OCR_TIMEOUT_SECONDS` (default: `90`). OCR is performed during upload, so very large scanned documents may take longer and consume additional provider usage. Clear printed scans work best; handwriting, low resolution, and complex tables may be imperfect. The existing text-only quiz model remains responsible for generating questions from the extracted text.


## Password-registration email verification (Render)

The backend supports an HTTPS email API provider as well as SMTP. On Render Free, direct SMTP connections to ports 25, 465, and 587 are blocked, so use the Nylas transactional-send API path instead of Gmail SMTP.

1. Create a Nylas account and register a free Nylas-branded domain such as `your-app.nylas.email` in its dashboard (no custom domain purchase or DNS setup is needed for this trial domain). Transactional Send is currently documented by Nylas as a beta feature; confirm that it is enabled for your account.
2. Create an API key and note the exact registered Nylas domain name.
3. In Render, add `EMAIL_PROVIDER=nylas`, `NYLAS_API_KEY`, `NYLAS_DOMAIN` (the registered `*.nylas.email` domain only, no protocol), `NYLAS_FROM_EMAIL` (an address such as `no-reply@your-app.nylas.email` on that domain), and `NYLAS_API_BASE=https://api.us.nylas.com` if your Nylas account is in the US region. Use the API base for your actual account region if different.
4. Keep `BACKEND_PUBLIC_URL=https://learnmates.onrender.com`. Keep existing `SECRET_KEY`, `DATABASE_URL`, Groq, Google OAuth, and frontend settings unchanged. Do not put API keys in Git or the frontend.
5. Deploy the backend patch and test by registering with an email address different from the Nylas account email. Check Render logs and Nylas delivery events. Do not consider this complete until a real verification link arrives and opens successfully.

This patch does not change the verification-token format, expiry, database schema, student records, or Google OAuth flow. SMTP remains available by setting `EMAIL_PROVIDER=smtp` on a host that permits outbound SMTP.
