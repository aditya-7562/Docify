import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Create a version snapshot of a document
 */
export const create = mutation({
  args: {
    documentId: v.id("documents"),
    content: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    // Verify user has access to the document
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new ConvexError("Document not found");
    }

    const isOwner = document.ownerId === user.subject;
    const organizationId = (user.organization_id ?? undefined) as string | undefined;
    const isOrganizationMember = !!(
      document.organizationId && document.organizationId === organizationId
    );

    if (!isOwner && !isOrganizationMember) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.insert("versions", {
      documentId: args.documentId,
      content: args.content,
      title: args.title,
      createdBy: user.subject,
      description: args.description,
    });
  },
});

/**
 * Get all versions for a document, ordered by creation time (newest first)
 */
export const getByDocumentId = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    // Verify user has access to the document
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new ConvexError("Document not found");
    }

    const isOwner = document.ownerId === user.subject;
    const organizationId = (user.organization_id ?? undefined) as string | undefined;
    const isOrganizationMember = !!(
      document.organizationId && document.organizationId === organizationId
    );

    if (!isOwner && !isOrganizationMember) {
      // Check if user has any explicit permission (viewer, commenter, or editor)
      const userPermission = await ctx.db
        .query("permissions")
        .withIndex("by_document_user", (q) =>
          q.eq("documentId", args.documentId).eq("userId", user.subject)
        )
        .first();

      if (!userPermission) {
        // If no explicit permission, check if document has active share links
        // This allows users accessing via share links to view versions
        // (version history is read-only, so this is safe)
        const shareLinks = await ctx.db
          .query("shareLinks")
          .withIndex("by_document_id", (q) => q.eq("documentId", args.documentId))
          .collect();

        // Check if any share link is active (not expired)
        const hasActiveShareLink = shareLinks.some(
          (link) => !link.expiresAt || link.expiresAt > Date.now()
        );

        // Instead of throwing, return empty array when share link is deleted/expired
        // This prevents the error from crashing the UI
        if (!hasActiveShareLink) {
          return [];
        }
      }
    }

    const versions = await ctx.db
      .query("versions")
      .withIndex("by_document_id", (q) =>
        q.eq("documentId", args.documentId)
      )
      .order("desc")
      .collect();

    return versions;
  },
});

/**
 * Get a specific version by ID
 */
export const getById = query({
  args: { id: v.id("versions") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const version = await ctx.db.get(args.id);
    if (!version) {
      throw new ConvexError("Version not found");
    }

    // Verify user has access to the document
    const document = await ctx.db.get(version.documentId);
    if (!document) {
      throw new ConvexError("Document not found");
    }

    const isOwner = document.ownerId === user.subject;
    const organizationId = (user.organization_id ?? undefined) as string | undefined;
    const isOrganizationMember = !!(
      document.organizationId && document.organizationId === organizationId
    );

    if (!isOwner && !isOrganizationMember) {
      // Check if user has any explicit permission (viewer, commenter, or editor)
      const userPermission = await ctx.db
        .query("permissions")
        .withIndex("by_document_user", (q) =>
          q.eq("documentId", version.documentId).eq("userId", user.subject)
        )
        .first();

      if (!userPermission) {
        // If no explicit permission, check if document has active share links
        // This allows users accessing via share links to view versions
        // (version history is read-only, so this is safe)
        const shareLinks = await ctx.db
          .query("shareLinks")
          .withIndex("by_document_id", (q) => q.eq("documentId", version.documentId))
          .collect();

        // Check if any share link is active (not expired)
        const hasActiveShareLink = shareLinks.some(
          (link) => !link.expiresAt || link.expiresAt > Date.now()
        );

        // Instead of throwing, return null when share link is deleted/expired
        // This prevents the error from crashing the UI
        if (!hasActiveShareLink) {
          throw new ConvexError("Unauthorized");
        }
      }
    }

    return version;
  },
});

