# Milestone 11 — Account, identity and sign-in

## UI changes
- Replaced “Student workspace” with a simpler learning navigation and changed breadcrumbs to `LearnMeets AI / Page`.
- Renamed “Account management” to “Account”.
- Signed-in visitors see their profile avatar on public pages.
- Icon-only controls have descriptive hover/focus labels.
- Account supports profile photo upload/removal, password changes, and account deletion. Uploaded photos are stored as data URLs in PostgreSQL; uploads are limited to 1 MB and PNG/JPEG/WebP. Google users initially use their Google profile image URL.

## Backend changes
- Added additive `user` columns `email_verified`, `auth_provider`, and `profile_image`. Startup migration adds only missing columns and preserves existing tables and rows. Existing accounts default to verified so current users are not locked out.
- New password-based registrations require an email verification link before login. Verification links expire after 24 hours.
- Google OAuth uses Authlib and only accepts Google identities with a verified email. Matching verified Google emails are linked to the existing account.
- Account deletion removes the account's learning documents, chat messages, quiz attempts, active quiz, and corresponding uploaded files when present. Password accounts must re-enter their password; Google accounts must type their email to confirm.

## Required Render environment variables
Set these on the **backend Render service**, not Vercel. Never commit real credentials.

```dotenv
BACKEND_PUBLIC_URL=https://learnmates.onrender.com
REACT_FRONTEND_URL=https://learnmeets.vercel.app
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USE_TLS=true
SMTP_USERNAME=your-smtp-username
SMTP_PASSWORD=your-smtp-password
MAIL_FROM=verified-sender@example.com
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
```

For Google OAuth, add `https://learnmates.onrender.com/auth/google/callback` as an authorized redirect URI in Google Cloud Console. Configure the OAuth consent screen and allowed domains according to Google's current requirements. Keep SMTP credentials and Google client secret only in Render's environment settings.

Email registration deliberately returns a clear service error if SMTP is not configured; do not turn off verification just to make registration appear to work. Google sign-in redirects back with a status if credentials are not configured.

## Verification
Run `python -m py_compile app.py`, install backend requirements, then run the backend tests. In `frontend`, run `npm install` and `npm run build`. Test email verification and Google sign-in only after setting real SMTP/Google credentials.

## Deployment notes
- This feature set is **not live until the new code is deployed** and the SMTP/Google settings are configured on Render.
- Set `SESSION_COOKIE_SAMESITE=None` and `COOKIE_SECURE=true` for the cross-site Vercel/Render production session, as required by the existing deployment.
- Set `FRONTEND_ORIGIN=https://learnmeets.vercel.app` and `API_BASE_URL=https://learnmates.onrender.com` in the existing deployment locations (the latter belongs in Vercel, without a `VITE_` prefix).
