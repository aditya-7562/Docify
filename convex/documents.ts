import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

import { mutation, query } from "./_generated/server";

export const getByIds = query({
  args: { ids: v.array(v.id("documents")) },
  handler: async (ctx, { ids }) => {
    const documents = [];

    for (const id of ids) {
      const document = await ctx.db.get(id);

      if (document) {
        documents.push({ id: document._id, name: document.title });
      } else {
        documents.push({ id, name: "[Removed]" });
      }
    }

    return documents;
  },
});

export const create = mutation({
  args: {
    title: v.optional(v.string()),
    initialContent: v.optional(v.string()),
    folderId: v.optional(v.id("folders")),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const organizationId = (user.organization_id ?? undefined) as string | undefined;

    return ctx.db.insert("documents", {
      title: args.title ?? "Untitled document",
      ownerId: user.subject,
      organizationId,
      initialContent: args.initialContent,
      folderId: args.folderId,
      tags: args.tags,
      isStarred: false,
    });
  },
});

/**
 * Update document tags
 */
export const updateTags = mutation({
  args: { id: v.id("documents"), tags: v.array(v.string()) },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const document = await ctx.db.get(args.id);
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

    return await ctx.db.patch(args.id, { tags: args.tags });
  },
});

/**
 * Toggle document starred status
 */
export const toggleStarred = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const document = await ctx.db.get(args.id);
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

    return await ctx.db.patch(args.id, { isStarred: !document.isStarred });
  },
});

/**
 * Move document to folder
 */
export const moveToFolder = mutation({
  args: { id: v.id("documents"), folderId: v.optional(v.id("folders")) },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const document = await ctx.db.get(args.id);
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

    return await ctx.db.patch(args.id, { folderId: args.folderId });
  },
});

export const get = query({
  args: { paginationOpts: paginationOptsValidator, search: v.optional(v.string()) },
  handler: async (ctx, { search, paginationOpts }) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const organizationId = (user.organization_id ?? undefined) as string | undefined;

    // Search within organization
    if (search && organizationId) {
      return ctx.db
        .query("documents")
        .withSearchIndex("search_title", (q) =>
          q.search("title", search).eq("organizationId", organizationId)
        )
        .paginate(paginationOpts);
    }

    // Personal search
    if (search) {
      return await ctx.db
        .query("documents")
        .withSearchIndex("search_title", (q) => {
          return q.search("title", search).eq("ownerId", user.subject);
        })
        .paginate(paginationOpts);
    }

    // All docs inside organization
    if (organizationId) {
      return await ctx.db
        .query("documents")
        .withIndex("by_organization_id", (q) => q.eq("organizationId", organizationId))
        .paginate(paginationOpts);
    }

    // All personal docs
    return await ctx.db
      .query("documents")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", user.subject))
      .paginate(paginationOpts);
  },
});

export const removeById = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const organizationId = (user.organization_id ?? undefined) as string | undefined;

    const document = await ctx.db.get(args.id);

    if (!document) {
      throw new ConvexError("Document not found");
    }

    const isOwner = document.ownerId === user.subject;
    const isOrganizationMember = !!(
      document.organizationId && document.organizationId === organizationId
    );
    if (!isOwner && !isOrganizationMember) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.delete(args.id);
  },
});

export const updateById = mutation({
  args: { id: v.id("documents"), title: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const organizationId = (user.organization_id ?? undefined) as string | undefined;

    const document = await ctx.db.get(args.id);

    if (!document) {
      throw new ConvexError("Document not found");
    }

    const isOwner = document.ownerId === user.subject;
    const isOrganizationMember = !!(
      document.organizationId && document.organizationId === organizationId
    );

    if (!isOwner && !isOrganizationMember) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.patch(args.id, { title: args.title });
  },
});

export const getById = query({
  args: { id: v.id("documents") },
  handler: async (ctx, { id }) => {
    const document = await ctx.db.get(id);

    if (!document) {
      throw new ConvexError("Document not found");
    }

    return document;
  },
});
