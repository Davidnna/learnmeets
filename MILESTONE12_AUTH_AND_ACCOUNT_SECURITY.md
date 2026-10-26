# LearnMeets AI — Milestone 12: Authentication and Account Security

This milestone extends the existing React/Vite frontend and Flask backend without replacing the project or resetting the database.

## Included in this milestone

- Added forgot-password and reset-password API flows with generic request responses to reduce account enumeration. Password reset links expire after 10 minutes.
- Added React routes and forms for requesting and completing password resets.
- Added a verified email-change flow. The account email remains unchanged until the new address confirms ownership; the confirmation link expires after 10 minutes. Password-based accounts must confirm with their current password.
- Corrected the HTML registration email expiry copy to 10 minutes, matching the server-side timed token validation.
- Kept existing Nylas HTTPS / SMTP configuration paths and existing Google OAuth implementation.
- Updated logout to clear the Flask session. Existing permanent session lifetime remains eight hours, with secure cookie behaviour controlled by deployment environment settings.
- Profile images are centre-cropped to a square before upload; account deletion confirmation now uses a branded modal.
- Existing Feedback & Support routes and private per-user submission checks are retained. Admin endpoints remain protected by the existing admin-role decorator.
- Existing custom scrollbar, text selection colour, custom tooltips, route scroll-to-top and floating scroll-to-top control are retained.

## Deployment notes

- Keep current Render and Vercel environment variables unchanged. No new environment variables are required for these flows.
- Do not reset the existing Neon database. `db.create_all()` creates the new feedback table when absent and does not drop existing data.
- Test in staging or a local environment before deploying. Test Nylas delivery, password reset, email change, login, Google OAuth, feedback submission, admin review and account deletion.

## Verification status

- `python -m py_compile app.py`: passed.
- ZIP integrity: checked after packaging.
- Full pytest suite: could not run because Flask and project dependencies are not installed in this execution environment.
- React production build: not verified; npm dependency installation timed out in this environment.
- Live Nylas delivery and deployed end-to-end workflows: not tested.
