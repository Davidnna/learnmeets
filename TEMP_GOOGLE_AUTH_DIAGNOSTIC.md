# Temporary Google OAuth diagnostic

This build adds `GET /api/debug/auth-status`. After deploying, open:
`https://learnmates.onrender.com/api/debug/auth-status`

It reports whether Authlib imports/installs and whether Google credential variables are present, without exposing their values. Once the issue is resolved, remove the `api_debug_auth_status` route from `app.py` and redeploy.

This diagnostic is temporarily public; remove it after testing. It does not change the database, authentication flow, or email verification.
