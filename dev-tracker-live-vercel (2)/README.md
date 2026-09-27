# Dev Tracker — Live

Tracks HARRY2O6's real Roblox presence (Playing / In Studio / Offline) and shows
it live. Unlike a claude.ai artifact, this runs as a real app, so the server
side is free to call Roblox's own APIs directly.

## How it works

- `pages/api/status.js` is a serverless function. It calls:
  - `presence.roblox.com/v1/presence/users` for online/in-game/in-studio status
  - `thumbnails.roblox.com` for his avatar
  - `users.roblox.com` for his current display name
- `pages/index.js` polls `/api/status` every 15 seconds and re-renders the
  card — green outline while playing (with the game name), orange in Studio,
  grey when offline.

## Deploy to Vercel

1. Push this folder to a GitHub repo (or run `vercel` from inside it with the
   [Vercel CLI](https://vercel.com/docs/cli) installed).
2. Import the repo at [vercel.com/new](https://vercel.com/new) — no build
   config needed, it's a standard Next.js app.
3. Deploy. No environment variables are required; it defaults to user ID
   `423428585`.

To track a different user, set an environment variable in the Vercel project
settings:

```
ROBLOX_USER_ID=<their numeric user id>
```

## Notes / caveats

- Roblox's presence endpoint is undocumented/unofficial and can change or
  rate-limit without notice. The 15s poll interval is deliberately gentle;
  don't drop it much lower.
- If HARRY2O6 has hidden his online status in his Roblox privacy settings,
  the API will return `offline` regardless of what he's actually doing —
  Roblox doesn't expose presence for users who've opted out.
- If Roblox ever blocks Vercel's IP ranges or changes the endpoint shape,
  `/api/status` falls back to returning `status: "unknown"` rather than
  crashing the page.
