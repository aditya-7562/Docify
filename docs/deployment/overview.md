# Deployment Guide

## Build for Production

```bash
npm run build
```

## Deploy to Vercel

1. Push the repository to GitHub.
2. Import the repo in Vercel.
3. Configure the required environment variables.
4. Trigger a deploy.

## Deploy Convex

```bash
npx convex deploy
```

## Docker-Based Dev/Staging on GCP

For single-VM staging with Docker Compose:

1. Create `.env.docker` (you can copy the keys you use in `.env.local`) and include:
   ```env
   NEXT_PUBLIC_CONVEX_URL=http://convex:8787
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
   CLERK_SECRET_KEY=your-clerk-secret-key
   LIVEBLOCKS_SECRET_KEY=your-liveblocks-secret-key
   NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=your-liveblocks-public-key
   ```
2. Build and start:

   ```bash
   docker compose build
   docker compose up -d
   ```

3. Expose ports `3000` (Next.js dev) and `8787` (Convex dev) via firewall rules or
   reverse proxy.

See `docs/deployment/dev-gcp.md` for full VM provisioning, DNS, TLS, and
operations guidance.

