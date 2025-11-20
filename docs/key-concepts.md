# Key Concepts

## Document Model

Convex stores documents with fields like:

- `title`: Document title.
- `ownerId`: Owner user ID.
- `organizationId`: Optional organization scope.
- `folderId`: Parent folder (optional).
- `roomId`: Liveblocks room ID.
- `tags`: String array for organization.
- `isStarred`: Boolean favorite flag.
- `initialContent`: Optional initial HTML snapshot.

## Permission System

Docify relies on three roles:

1. **Viewer** – read-only access.
2. **Commenter** – read plus comments.
3. **Editor** – full editing rights.

Permissions can be inherited from organizations, granted to individuals, or
shared via secure share links.

## Real-Time Collaboration

- Each document corresponds to a Liveblocks room backed by Y.js CRDT state.
- Presence APIs broadcast active collaborators.
- Comments live in Liveblocks threads, while layout preferences (e.g. margins)
  live in per-room storage.

## Version History

- Users manually create versions storing HTML content, title, creator,
  timestamp, and optional descriptions.
- Any version can be restored to replace the current document state.

