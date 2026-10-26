# Milestone 13 — Admin Feedback & Support Inbox

## Included
- Added an administrator-only `/admin/feedback` React workspace.
- The sidebar and quick-navigation search show the Support inbox only to users whose session user role is `admin`.
- The page lists feedback, technical issues, complaints, disputes, account reports, and AI-response concerns returned by the existing admin API.
- Added status filtering, counts, student/reference details, editable statuses, admin replies, per-submission saving/loading states, and refresh.
- Added client API helpers for `GET /api/admin/feedback` and `POST /api/admin/feedback/<id>`.
- Existing Flask endpoints remain guarded by `@admin_required`, which checks the server-side user role. Frontend visibility is only a usability control, not the security boundary.
- No database reset or schema change was made in this milestone.

## Validation
- `python -m py_compile app.py`: passed.
- TypeScript transpilation syntax check for `frontend/src/App.jsx` and `frontend/src/api/client.js`: passed.
- `npm install --no-audit --no-fund` did not complete within the available time, so a full Vite production build could not be run.
- `pytest` could not collect backend tests because Flask is not installed in the current environment.
- No live database, admin-account, email, or deployment test was performed.

## How to use
1. Sign in with an account whose database `user.role` is `admin`.
2. Open **Support inbox** in the sidebar or quick-navigation search.
3. Filter submissions by status, update the status, add a reply, and choose **Save update**.
4. Students can see the status and reply in their **Feedback & Support** page.

Do not grant the `admin` role to a user unless they are authorised to access student reports and email addresses.
