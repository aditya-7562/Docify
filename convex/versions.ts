import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";


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


export const getByDocumentId = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

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

      const userPermission = await ctx.db
        .query("permissions")
        .withIndex("by_document_user", (q) =>
          q.eq("documentId", args.documentId).eq("userId", user.subject)
        )
        .first();

      if (!userPermission) {

        const shareLinks = await ctx.db
          .query("shareLinks")
          .withIndex("by_document_id", (q) => q.eq("documentId", args.documentId))
          .collect();

        const hasActiveShareLink = shareLinks.some(
          (link) => !link.expiresAt || link.expiresAt > Date.now()
        );

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

      const userPermission = await ctx.db
        .query("permissions")
        .withIndex("by_document_user", (q) =>
          q.eq("documentId", version.documentId).eq("userId", user.subject)
        )
        .first();

      if (!userPermission) {

        const shareLinks = await ctx.db
          .query("shareLinks")
          .withIndex("by_document_id", (q) => q.eq("documentId", version.documentId))
          .collect();

        const hasActiveShareLink = shareLinks.some(
          (link) => !link.expiresAt || link.expiresAt > Date.now()
        );

        if (!hasActiveShareLink) {
          throw new ConvexError("Unauthorized");
        }
      }
    }

    return version;
  },
});

