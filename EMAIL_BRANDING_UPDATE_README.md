# LearnMeets AI verification email branding update

This patch updates the account-verification email to use a branded, responsive HTML layout with the LearnMeets AI mark, purple brand styling, a clear verification button, a visible fallback URL, a 24-hour expiry notice, and a friendly sign-off. It preserves a plain-text alternative for SMTP delivery and uses the existing Nylas Transactional Send configuration.

## Apply safely
1. Make a backup/commit of the current `app.py` in your GitHub repository.
2. Merge the `app.py` changes from this patch into the current repository version. Do not overwrite a newer `app.py` wholesale if it contains later fixes.
3. Confirm `frontend/public/brand-mark.svg` is present and deployed at `https://learnmeets.vercel.app/brand-mark.svg` (the email will still be readable if an email client blocks images).
4. Commit and push to GitHub, then let Render deploy.
5. Register a test account using an inbox you control. Check the email on desktop and mobile, click the button, and verify the fallback link works too.

No Render environment-variable changes are required. Existing `EMAIL_PROVIDER=nylas`, `NYLAS_API_KEY`, `NYLAS_DOMAIN`, and `NYLAS_FROM_EMAIL` remain unchanged.

Suggested commit message: `style: personalize LearnMeets verification email`
