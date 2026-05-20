# Auth Fire Drill

Fragments access-layer hardening challenge.

## What this folder demonstrates

- JWT secret moved to environment configuration
- JWT payload includes role
- Frontend role derived from token instead of localStorage
- Role and ownership checks on fragment endpoints
- CORS restriction and CSRF token verification
- Server-side token blacklist for logout
