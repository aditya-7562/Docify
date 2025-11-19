import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Create a shareable link for a document
 */
export const create = mutation({
  args: {
    documentId: v.id("documents"),
    role: v.union(v.literal("viewer"), v.literal("commenter"), v.literal("editor")),
    expiresInDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    // Verify user has permission to create share links
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

    // Generate unique token (using timestamp + random for uniqueness)
    const token = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    // Calculate expiration if provided
    const expiresAt = args.expiresInDays
      ? Date.now() + args.expiresInDays * 24 * 60 * 60 * 1000
      : undefined;

    return await ctx.db.insert("shareLinks", {
      documentId: args.documentId,
      token,
      role: args.role,
      expiresAt,
      createdBy: user.subject,
    });
  },
});

/**
 * Get share link by token
 */
export const getByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const shareLink = await ctx.db
      .query("shareLinks")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!shareLink) {
      return null;
    }

    // Check if expired
    if (shareLink.expiresAt && shareLink.expiresAt < Date.now()) {
      return null;
    }

    return shareLink;
  },
});

/**
 * Get all share links for a document
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
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db
      .query("shareLinks")
      .withIndex("by_document_id", (q) => q.eq("documentId", args.documentId))
      .collect();
  },
});

/**
 * Delete a share link
 */
export const remove = mutation({
  args: { id: v.id("shareLinks") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const shareLink = await ctx.db.get(args.id);
    if (!shareLink) {
      throw new ConvexError("Share link not found");
    }

    // Verify user has permission
    const document = await ctx.db.get(shareLink.documentId);
    if (!document) {
      throw new ConvexError("Document not found");
    }

    const isOwner = document.ownerId === user.subject;
    const organizationId = (user.organization_id ?? undefined) as string | undefined;
    const isOrganizationMember = !!(
      document.organizationId && document.organizationId === organizationId
    );

    if (!isOwner && !isOrganizationMember && shareLink.createdBy !== user.subject) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.delete(args.id);
  },
});

