# LearnMeets AI email API migration patch

- Adds `EMAIL_PROVIDER=nylas` to send verification messages over HTTPS using Nylas Transactional Send.
- Keeps existing SMTP behavior available as a fallback.
- No database schema or account records are changed by this patch.
- Nylas Transactional Send is currently documented as beta; confirm feature access and use the free Nylas-branded `*.nylas.email` domain in your account.
- Requires Render environment variables: `EMAIL_PROVIDER=nylas`, `NYLAS_API_KEY`, `NYLAS_DOMAIN`, `NYLAS_FROM_EMAIL`, `BACKEND_PUBLIC_URL`; optionally `NYLAS_API_BASE` for region.
- Do not commit API keys. Test an actual message before treating verification as fixed.
