# Auth Fire Drill — Security Investigation

## Suspicious behavior found before fixes

1. `server/auth/jwt.js` used a hardcoded JWT secret and tokens were created without a real expiry window. If the source leaked, the signing key would leak too, and stolen tokens would remain useful for too long.
2. `server/routes/auth.js` did not reliably include the user role in the signed JWT payload, which meant downstream authorization could not trust the session identity.
3. `client/src/context/AuthContext.jsx` stored role information in `localStorage`, which made role escalation trivial through browser DevTools.
4. `server/routes/fragments.js` had missing or inconsistent role checks on fragment creation, edit, approval, and deletion endpoints.
5. `server/index.js` allowed overly broad cross-origin access and lacked a CSRF defense for state-changing requests.
6. `client/src/components/LogoutButton.jsx` only cleared local storage, so a copied JWT could still be replayed after logout.

## Expected remediation

- Move JWT signing secret to an environment variable and require it at startup.
- Add a 1 hour expiry to tokens.
- Include the user role in the JWT payload.
- Derive the role from the token on the frontend instead of storing it separately.
- Enforce role checks and ownership checks on all protected fragment endpoints.
- Restrict CORS to a trusted origin and require a CSRF header.
- Blacklist tokens on logout so a logged-out token cannot be reused.
