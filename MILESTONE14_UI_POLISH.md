# Milestone 14 — UI polish follow-up

## Changes
- Route changes now scroll smoothly to the top of the window.
- Repositioned the floating scroll-to-top control above the bottom edge/navigation area and changed the icon to an upward arrow.
- Replaced competing generic `aria-label` tooltip styling with a single LearnMeets-branded tooltip treatment using the app's purple identity, subtle border, tail, and focus-visible support.
- Restored/retained the Change password section for password-authenticated accounts on the Account page.
- Styled Remove picture as a deliberate outlined danger action with an icon, hover/focus states, and a busy state.
- Sign-out now disables the control and displays a spinner while the logout request is in progress.

## Validation
- Reviewed the changed React JSX and CSS source.
- Full React production build and browser-level testing were not run in this environment. Test route scrolling, tooltip positioning, password change, picture removal, and logout in local development before deploying.
