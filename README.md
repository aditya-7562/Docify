# Docify - Real-Time Collaborative Document Editor

A modern, full-featured collaborative document editor built with Next.js, featuring real-time collaboration, rich text editing, and comprehensive document management. Docify provides a Google Docs-like experience with advanced features for teams and individuals.

![Docify](https://img.shields.io/badge/Docify-Collaborative%20Editor-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Features

Docify delivers collaborative editing (presence, live cursors, CRDT conflict-free sync), a full TipTap-powered rich text surface (tables, media, color, comments) and enterprise-friendly management (folders, templates, role-based sharing, version history). Explore the complete capability breakdown in [`docs/features.md`](docs/features.md).

## 🏗️ System Architecture

The app combines a Next.js 15 client, Liveblocks real-time rooms, Convex functions/storage, and Clerk auth/org contexts. Data flow diagrams, key services, and the tooling stack are illustrated in [`docs/architecture.md`](docs/architecture.md).

## 🛠️ Setup

Clone the repo, install dependencies, and configure Convex, Clerk, and Liveblocks credentials via `.env.local`. Detailed instructions (CLI commands, dashboard steps, JWT templates, and local dev tips) live in [`docs/setup.md`](docs/setup.md).

## 📁 Project Structure

Need to find a feature fast? [`docs/project-structure.md`](docs/project-structure.md) walks through the `src/app` routes, Convex backend, shared components, utilities, and config files so you know where each concern resides.

## 🔑 Key Concepts

Understand how docs are modeled, how permissions cascade from orgs/share links, what powers real-time presence, and how manual versions are stored by visiting [`docs/key-concepts.md`](docs/key-concepts.md).

## 🧪 Testing

Vitest + Testing Library back the suite. Command variants for watch UI and coverage, along with expectations for new tests, are summarized in [`docs/testing.md`](docs/testing.md).

## 🚀 Deployment

Production build/Vercel deploy notes plus Convex deployment commands are in [`docs/deployment/overview.md`](docs/deployment/overview.md). For single-VM Docker Compose setups (e.g., GCP), follow [`docs/deployment/dev-gcp.md`](docs/deployment/dev-gcp.md).

## 📝 Scripts

Quick reference for `npm run dev`, `build`, `start`, `lint`, and test commands is available in [`docs/scripts.md`](docs/scripts.md).

## 🤝 Contributing

Want to open a PR? The branching workflow, checklist (tests, lint, docs), and style guidance are captured in [`docs/contributing.md`](docs/contributing.md).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) – React framework
- [Convex](https://convex.dev/) – Real-time backend
- [Clerk](https://clerk.com/) – Authentication
- [Liveblocks](https://liveblocks.io/) – Real-time collaboration
- [TipTap](https://tiptap.dev/) – Rich text editor
- [shadcn/ui](https://ui.shadcn.com/) – UI components

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

