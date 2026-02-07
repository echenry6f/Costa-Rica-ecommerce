# Cloudflare Workers Build Settings

For **ticora-store** (Worker with static assets):

## Required build configuration

In **Workers & Pages** → **ticora-store** → **Settings** → **Build**:

| Setting | Value |
|---------|-------|
| **Build command** | *(leave empty)* |
| **Deploy command** | `npx wrangler deploy` |
| **Root directory** | `.` or `/` |
| **Production branch** | `main` |

**Important:** Use `npx wrangler deploy` (not `wrangler versions upload`) for the production Deploy command so changes go live.
