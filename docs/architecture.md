# System Architecture

Docify pairs a modern Next.js client with real-time collaboration services
powered by Liveblocks and Convex. This page captures the high-level design,
data flow, and technology stack.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Next.js    │  │   React 19   │  │    TipTap    │        │
│  │   App Router │  │   Components │  │    Editor    │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Real-Time Layer                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Liveblocks (Y.js/CRDT)                  │   │
│  │  - Real-time collaboration                           │   │
│  │  - Presence management                               │   │
│  │  - Thread/comment synchronization                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │    Convex    │  │    Clerk     │  │  Liveblocks   │        │
│  │  - Database  │  │  - Auth      │  │  - API        │        │
│  │  - Functions │  │  - Orgs      │  │  - Auth       │        │
│  │  - Real-time │  │  - Users     │  │               │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

1. **Document Editing**
   - User actions → TipTap editor → Liveblocks extension → Liveblocks API.
   - Y.js CRDT keeps every connected client in sync.
2. **Document Metadata**
   - CRUD ops → Convex functions → Convex database.
   - Convex subscriptions push updates to clients.
3. **Authentication**
   - Clerk issues JWTs consumed by Convex and Liveblocks.
   - Organization context travels through JWT claims.
4. **Comments & Threads**
   - Created via Liveblocks Threads API and stored per room.
5. **Permissions**
   - Role changes call Convex mutations which enforce access control.

## Technology Stack

### Frontend

- **Next.js 15** with the App Router.
- **React 19** concurrent features.
- **TypeScript** for safety.
- **TipTap** editor extensions.
- **Tailwind CSS** and **shadcn/ui** components.
- **Zustand**, **React Hook Form**, **Zod** for state, forms, validation.

### Backend & Services

- **Convex**
  - Realtime database with automatic subscriptions.
  - Serverless functions (queries/mutations) and full-text search.
- **Clerk**
  - Authentication, user profiles, and organization support.
  - JWT templates to integrate with Convex.
- **Liveblocks**
  - Y.js-powered collaboration, presence, and threads.
  - Room-based architecture for each document.

### Development Tooling

- **Vitest** + **Testing Library**.
- **ESLint** and **TypeScript** builds.

