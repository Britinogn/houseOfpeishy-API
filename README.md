
# Server — Today (2025-10-06)

- What I did: reviewed the server codebase, checked the `start` script, and inspected controllers & middleware.
- Files looked at: `package.json`, `src/server.js`, `src/controllers/*`, `src/middleware/*`, `src/config/*`, `src/utils/*`.
- Run (PowerShell):

```powershell
npm install
npm run start
```

- Notes: ensure a valid `.env` (Mongo URI, Cloudinary, JWT secret) before starting.
- Next: add a health-check endpoint, add basic tests, and verify auth middleware behavior.

