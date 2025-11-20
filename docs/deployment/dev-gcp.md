# GCP VM Dev Deployment (Docker Compose)

Use this guide to run the Docify stack on a single Compute Engine VM using the existing development servers (`npm run dev` for Next.js + `npx convex dev`). This setup is intended only for internal/staging testing—dev mode is not hardened for production traffic or secrets.

## 1. Prerequisites

- Ubuntu/Debian based VM with Docker Engine and Docker Compose plugin installed.
- Reserved domain or DNS record pointing to the VM’s public IP.
- Clerk + Liveblocks API keys with dev/test scopes.
- Locally cloned repo synced to the VM (git clone or `scp -r`).

## 2. Environment variables

1. Copy the template and fill in real values (never commit the filled file):
   ```bash
   cp .env.docker.example .env.docker
   ```
2. Ensure `NEXT_PUBLIC_CONVEX_URL=http://convex:8787` so the web container talks to the Convex service on the internal Docker network.
3. Store Clerk and Liveblocks keys in the same file. Docker Compose will mount them into both containers automatically via the `env_file` setting.

## 3. Build & run containers

```bash
docker compose build
docker compose up -d
```

- The Convex service exposes port `8787`, the Next.js dev server exposes `3000`.
- Containers restart automatically (`restart: unless-stopped`). Use `docker compose logs -f web` or `convex` for debugging.

## 4. Network & domain

1. Open firewall rules for TCP 3000 (web) and 8787 (if remote Convex access is required) in both GCP VPC firewall and the VM’s OS firewall.
2. Point your domain (or subdomain) to the VM’s static IP. For quick tests you can reverse proxy with nginx or Caddy to port 3000 and enable TLS via Let’s Encrypt.

## 5. Operational notes

- Dev mode means hot reload, no Next.js build output, and Convex dev storage—data will reset when containers rebuild.
- Secrets are file-based; rotate them manually if the VM is compromised.
- For a production-ready setup switch to `next build && next start`, Convex hosted deployment (`npx convex deploy`), and a dedicated database; this guide does not cover that.

## 6. Useful commands

```bash
# Restart services after config changes
docker compose down
docker compose up -d

# Tail logs
docker compose logs -f

# Enter a container shell
docker compose exec web /bin/sh
```

