# Project Structure

Reference layout of the Docify monorepo:

```
google-docs-main/
├── src/
│   ├── app/
│   │   ├── (home)/               # Landing page group
│   │   ├── documents/            # Document routes
│   │   ├── api/                  # App Router API routes
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   └── ui/                   # shadcn/ui components
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utilities
│   ├── store/                    # Zustand stores
│   ├── extensions/               # TipTap extensions
│   ├── constants/                # Shared constants
│   ├── types/                    # TypeScript definitions
│   └── middleware.ts             # Next.js middleware
├── convex/                       # Convex backend
│   ├── schema.ts                 # Database schema
│   ├── documents.ts              # Document CRUD
│   ├── folders.ts                # Folder logic
│   ├── permissions.ts            # Access control
│   ├── shareLinks.ts             # Share links
│   ├── versions.ts               # Version history
│   └── auth.config.ts            # Auth provider config
├── public/                       # Static assets (logo, template images)
├── docs/                         # In-depth documentation (this folder)
├── liveblocks.config.ts          # Liveblocks typing
├── next.config.ts                # Next.js config
├── tailwind.config.ts            # Tailwind CSS config
├── tsconfig.json                 # TypeScript config
├── vitest.config.ts              # Vitest config
└── package.json                  # Dependencies and scripts
```

Use this map to quickly locate features referenced elsewhere in the docs.

