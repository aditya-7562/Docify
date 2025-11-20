# Setup Guide

Follow these steps to run Docify locally. All content below previously lived in
`README.md` and is now expanded for clarity.

## Prerequisites

- **Node.js** 18+ and npm (or yarn/pnpm).
- Accounts for [Convex](https://convex.dev), [Clerk](https://clerk.com), and
  [Liveblocks](https://liveblocks.io).

## 1. Clone the Repository

```bash
git clone https://github.com/aditya-7562/Docify.git
cd Docify
```

## 2. Install Dependencies

```bash
npm install
```

If you see peer dependency warnings, you can fall back to:

```bash
npm install --legacy-peer-deps
```

## 3. Environment Variables

Create `.env.local` in the project root:

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=your-convex-deployment-url

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key

# Liveblocks
LIVEBLOCKS_SECRET_KEY=your-liveblocks-secret-key
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=your-liveblocks-public-key
```

## 4. Convex Setup

### Install Convex CLI

```bash
npm install -g convex
```

### Initialize Convex

```bash
npx convex dev
```

The CLI will create or connect a Convex project, deploy schema/functions, start
the dev server, and print the deployment URL.

### Configure Authentication

1. Open the [Convex dashboard](https://dashboard.convex.dev).
2. Settings → **Authentication** → add Clerk:
   - Domain: `https://your-clerk-domain.clerk.accounts.dev`
   - Application ID: `convex`

### Update `convex/auth.config.ts`

```ts
export default {
  providers: [
    {
      domain: "https://your-clerk-domain.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
```

## 5. Clerk Setup

1. Sign up/sign in at [clerk.com](https://clerk.com) and create an application.
2. Enable organizations (Configure → Organizations).
3. Configure the JWT template (Configure → JWT Templates):
   - Name it `convex`.
   - Include claims such as:

```json
{
  "aud": "convex",
  "name": "{{user.full_name}}",
  "email": "{{user.primary_email_address}}",
  "picture": "{{user.image_url}}",
  "nickname": "{{user.username}}",
  "given_name": "{{user.first_name}}",
  "updated_at": "{{user.updated_at}}",
  "family_name": "{{user.last_name}}",
  "phone_number": "{{user.primary_phone_number}}",
  "email_verified": "{{user.email_verified}}",
  "organization_id": "{{org.id}}",
  "phone_number_verified": "{{user.phone_number_verified}}"
}
```

## 6. Liveblocks Setup

1. Sign up at [liveblocks.io](https://liveblocks.io) and create a project.
2. Copy the public and secret keys into `.env.local`.
3. The auth endpoint at `src/app/api/liveblocks-auth/route.ts` uses
   `LIVEBLOCKS_SECRET_KEY`. No extra wiring is needed beyond the env vars.

## 7. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to access the app.

