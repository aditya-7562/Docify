# Docify - Real-Time Collaborative Document Editor

A modern, full-featured collaborative document editor built with Next.js, featuring real-time collaboration, rich text editing, and comprehensive document management. Docify provides a Google Docs-like experience with advanced features for teams and individuals.

![Docify](https://img.shields.io/badge/Docify-Collaborative%20Editor-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Features

### Real-Time Collaboration
- **Live Editing**: Multiple users can edit documents simultaneously with instant synchronization
- **Live Cursors**: See where other collaborators are working in real-time
- **Presence Indicators**: View active users and their avatars
- **Offline Support**: Continue working offline with automatic sync when connection is restored
- **Conflict Resolution**: Automatic conflict resolution using CRDT (Conflict-free Replicated Data Types)

### Rich Text Editor
- **Comprehensive Formatting**: Bold, italic, underline, strikethrough, and more
- **Typography**: Multiple heading levels, font families, font sizes, and line heights
- **Text Alignment**: Left, center, right, and justify alignment options
- **Lists**: Bulleted lists, numbered lists, and task lists with checkboxes
- **Tables**: Full table support with cells, headers, and rows
- **Images**: Insert and resize images within documents
- **Links**: Automatic link detection and manual link insertion
- **Text Highlighting**: Multi-color text highlighting
- **Text Color**: Custom text and background colors
- **Remove Formatting**: Quick formatting removal tool

### Comments & Threading
- **Threaded Comments**: Create comments anchored to specific text selections
- **Floating Comments**: View and manage comments in a dedicated sidebar
- **Comment Resolution**: Mark comments as resolved
- **Real-Time Comment Updates**: See new comments as they're added
- **Comment Notifications**: Stay informed about document discussions

### Document Management
- **Create Documents**: Start from scratch or use pre-built templates
- **Document Templates**: Choose from professional templates including:
  - Blank Document
  - Software Development Proposal
  - Project Proposal
  - Business Letter
  - Resume
  - Cover Letter
  - Letter
- **Document Organization**: Organize documents into folders
- **Star Documents**: Mark important documents for quick access
- **Document Tags**: Tag documents for better organization
- **Search**: Full-text search across all your documents
- **Pagination**: Efficient document loading with pagination
- **Document Renaming**: Quick rename functionality
- **Document Deletion**: Safe document removal

### Sharing & Permissions
- **Role-Based Access Control**: Three permission levels:
  - **Viewer**: Can only view the document
  - **Commenter**: Can view and add comments
  - **Editor**: Can view, comment, and edit
- **Share Links**: Generate shareable links with customizable permissions
- **Link Expiration**: Set expiration dates for share links
- **Organization Support**: Share documents within organizations
- **User Permissions**: Grant specific permissions to individual users
- **Permission Management**: Easily grant, modify, or revoke access

### Version History
- **Version Snapshots**: Create manual version snapshots of documents
- **Version Restoration**: Restore any previous version of a document
- **Version Metadata**: Track who created each version and when
- **Version Descriptions**: Add descriptions to document versions
- **Chronological View**: Browse versions in chronological order

### User Experience
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS and shadcn/ui
- **Keyboard Shortcuts**: Comprehensive keyboard shortcuts for power users
- **Document Ruler**: Visual ruler for document margins
- **Customizable Margins**: Adjustable left and right document margins
- **Print Support**: Optimized document printing
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode Ready**: UI components support theme customization
- **Loading States**: Smooth loading indicators and suspense boundaries
- **Error Handling**: Graceful error handling and user feedback

### Authentication & Security
- **Clerk Integration**: Secure authentication with Clerk
- **Organization Support**: Multi-tenant organization support
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Route-level authentication protection
- **User Identity**: Rich user profile information

## 🏗️ System Architecture

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Next.js    │  │   React 19   │  │  TipTap      │     │
│  │   App Router │  │   Components │  │  Editor      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Real-Time Layer                           │
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
│                      Backend Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Convex    │  │    Clerk     │  │  Liveblocks   │     │
│  │  - Database  │  │  - Auth      │  │  - API        │     │
│  │  - Functions │  │  - Orgs      │  │  - Auth       │     │
│  │  - Real-time │  │  - Users     │  │               │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Document Creation/Editing**:
   - User actions → TipTap Editor → Liveblocks Extension → Liveblocks API
   - Changes synced in real-time to all connected clients via Y.js CRDT

2. **Document Metadata**:
   - Document CRUD operations → Convex Functions → Convex Database
   - Real-time updates via Convex subscriptions

3. **Authentication**:
   - User login → Clerk → JWT Token → Convex/Liveblocks
   - Organization context propagated through JWT claims

4. **Comments/Threads**:
   - Comment creation → Liveblocks Threads API → Real-time sync
   - Thread metadata stored in Liveblocks room storage

5. **Permissions**:
   - Permission changes → Convex Mutations → Database update
   - Access control enforced at Convex function level

### Technology Stack

#### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **TipTap**: Extensible rich text editor framework
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React component library
- **Zustand**: Lightweight state management
- **React Hook Form**: Form state management
- **Zod**: Schema validation

#### Backend & Services
- **Convex**: Real-time backend platform
  - Database with automatic real-time subscriptions
  - Serverless functions (queries and mutations)
  - Built-in authentication integration
  - Full-text search capabilities
- **Clerk**: Authentication and user management
  - User authentication
  - Organization management
  - JWT token generation
- **Liveblocks**: Real-time collaboration infrastructure
  - Y.js integration for CRDT-based collaboration
  - Presence management
  - Thread/comment system
  - Room-based architecture

#### Development Tools
- **Vitest**: Fast unit testing framework
- **Testing Library**: React component testing
- **ESLint**: Code linting
- **TypeScript**: Static type checking

## 📋 Prerequisites

Before setting up the project, ensure you have:

- **Node.js** 18+ and npm/yarn
- **Convex Account**: Sign up at [convex.dev](https://convex.dev)
- **Clerk Account**: Sign up at [clerk.com](https://clerk.com)
- **Liveblocks Account**: Sign up at [liveblocks.io](https://liveblocks.io)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd google-docs-main
```

### 2. Install Dependencies

```bash
npm install
```

> **Note**: If you encounter peer dependency conflicts, use `npm install --legacy-peer-deps`

### 3. Environment Variables

Create a `.env.local` file in the root directory:

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

### 4. Convex Setup

#### Install Convex CLI

```bash
npm install -g convex
```

#### Initialize Convex

```bash
npx convex dev
```

This will:
- Create a new Convex project (if needed)
- Deploy your schema and functions
- Start the development server
- Provide your deployment URL

#### Configure Authentication

1. Go to your [Convex Dashboard](https://dashboard.convex.dev)
2. Navigate to **Settings** > **Authentication**
3. Add Clerk as an authentication provider:
   - **Domain**: `https://your-clerk-domain.clerk.accounts.dev`
   - **Application ID**: `convex`

#### Update Auth Configuration

Edit `convex/auth.config.ts`:

```typescript
export default {
  providers: [
    {
      domain: "https://your-clerk-domain.clerk.accounts.dev",
      applicationID: "convex"
    }
  ]
}
```

### 5. Clerk Setup

#### Create Clerk Application

1. Sign up at [clerk.com](https://clerk.com)
2. Create a new application
3. Enable organizations:
   - Go to **Configure** > **Organizations**
   - Enable the organizations feature
   - Configure organization settings as needed

#### Configure JWT Template

1. In your Clerk dashboard, go to **Configure** > **JWT Templates**
2. Create a new template named `convex`
3. Add the following claims:

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

### 6. Liveblocks Setup

#### Create Liveblocks Project

1. Sign up at [liveblocks.io](https://liveblocks.io)
2. Create a new project
3. Get your keys from the dashboard:
   - **Public Key**: Used in `NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY`
   - **Secret Key**: Used in `LIVEBLOCKS_SECRET_KEY`

#### Configure Liveblocks Auth

The Liveblocks authentication endpoint is already configured at `src/app/api/liveblocks-auth/route.ts`. Ensure your secret key is set in the environment variables.

### 7. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🐳 GCP VM Dev Deployment (Docker Compose)

For staging/testing on a single Compute Engine VM, use the provided Docker workflow:

1. Copy `.env.docker.example` to `.env.docker` and fill in your Clerk & Liveblocks keys (keep `NEXT_PUBLIC_CONVEX_URL=http://convex:8787`).
2. Build and start the stack with:
   ```bash
   docker compose build
   docker compose up -d
   ```
3. Expose ports `3000` (Next.js dev) and `8787` (Convex dev) via firewall rules or a reverse proxy.

See `docs/deployment/dev-gcp.md` for detailed VM provisioning, DNS/TLS, and operational notes.

## 📁 Project Structure

```
google-docs-main/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (home)/                   # Home page route group
│   │   │   ├── page.tsx             # Home page with document list
│   │   │   ├── navbar.tsx           # Navigation bar
│   │   │   ├── documents-table.tsx  # Document listing table
│   │   │   ├── templates-gallery.tsx # Template selection
│   │   │   └── ...
│   │   ├── documents/
│   │   │   ├── [documentId]/        # Dynamic document route
│   │   │   │   ├── page.tsx         # Document page
│   │   │   │   ├── document.tsx     # Document wrapper
│   │   │   │   ├── editor.tsx       # TipTap editor component
│   │   │   │   ├── toolbar.tsx      # Formatting toolbar
│   │   │   │   ├── navbar.tsx       # Document navbar
│   │   │   │   ├── share-dialog.tsx # Sharing interface
│   │   │   │   ├── version-history.tsx # Version management
│   │   │   │   ├── threads.tsx      # Comments/threads
│   │   │   │   ├── avatars.tsx      # User avatars
│   │   │   │   └── ...
│   │   │   └── page.tsx             # Documents listing
│   │   ├── api/
│   │   │   └── liveblocks-auth/      # Liveblocks auth endpoint
│   │   │       └── route.ts
│   │   ├── layout.tsx               # Root layout
│   │   ├── globals.css              # Global styles
│   │   └── error.tsx                # Error boundary
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...                  # 40+ UI components
│   │   ├── convex-client-provider.tsx
│   │   ├── document-search.tsx
│   │   └── ...
│   ├── hooks/                       # Custom React hooks
│   │   ├── use-debounce.ts
│   │   ├── use-keyboard-shortcuts.ts
│   │   ├── use-mobile.tsx
│   │   └── use-search-param.ts
│   ├── lib/                         # Utility functions
│   │   ├── utils.ts
│   │   ├── errors.ts
│   │   └── export.ts
│   ├── store/                       # State management
│   │   └── use-editor-store.ts      # Editor state (Zustand)
│   ├── extensions/                  # TipTap extensions
│   │   ├── font-size.ts
│   │   └── line-height.ts
│   ├── constants/                   # Constants
│   │   ├── templates.ts
│   │   └── margins.ts
│   ├── types/                       # TypeScript types
│   │   ├── api.ts
│   │   └── clerk.ts
│   ├── middleware.ts                # Next.js middleware
│   └── test/                        # Test setup
│       └── setup.ts
├── convex/                          # Convex backend
│   ├── _generated/                  # Auto-generated types
│   ├── schema.ts                    # Database schema
│   ├── documents.ts                # Document CRUD operations
│   ├── folders.ts                  # Folder management
│   ├── permissions.ts              # Permission management
│   ├── shareLinks.ts               # Share link management
│   ├── versions.ts                 # Version history
│   └── auth.config.ts              # Auth configuration
├── public/                          # Static assets
│   ├── logo.svg
│   └── template-images/
├── liveblocks.config.ts            # Liveblocks TypeScript config
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
├── vitest.config.ts                # Vitest configuration
└── package.json                    # Dependencies
```

## 🔑 Key Concepts

### Document Model

Documents in Convex have the following structure:
- `title`: Document title
- `ownerId`: User ID of the document owner
- `organizationId`: Optional organization ID
- `folderId`: Optional parent folder ID
- `roomId`: Liveblocks room ID for real-time collaboration
- `tags`: Array of tags for organization
- `isStarred`: Boolean flag for favorites
- `initialContent`: Optional initial HTML content

### Permission System

Three permission levels:
1. **Viewer**: Read-only access
2. **Commenter**: Can view and comment
3. **Editor**: Full edit access

Permissions can be:
- Inherited from organization membership
- Explicitly granted to individual users
- Shared via share links with specific roles

### Real-Time Collaboration

- Each document has a unique Liveblocks room
- Changes are synchronized using Y.js CRDT
- Presence information shows active users
- Comments are stored in Liveblocks threads
- Document margins are stored in Liveblocks storage

### Version History

- Versions are manually created snapshots
- Each version stores:
  - Document content (HTML)
  - Document title
  - Creator user ID
  - Creation timestamp
  - Optional description
- Versions can be restored to replace current content

## 🧪 Testing

Run tests with:

```bash
npm test
```

Run tests with UI:

```bash
npm run test:ui
```

Run tests with coverage:

```bash
npm run test:coverage
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Deploy Convex

```bash
npx convex deploy
```

## 📝 Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm test`: Run tests
- `npm run test:ui`: Run tests with UI
- `npm run test:coverage`: Run tests with coverage

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add some amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Write tests for new features
- Follow the existing code style
- Update documentation as needed


## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Convex](https://convex.dev/) - Real-time backend
- [Clerk](https://clerk.com/) - Authentication
- [Liveblocks](https://liveblocks.io/) - Real-time collaboration
- [TipTap](https://tiptap.dev/) - Rich text editor
- [shadcn/ui](https://ui.shadcn.com/) - UI components

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

