import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Create a folder
 */
export const create = mutation({
  args: {
    name: v.string(),
    parentId: v.optional(v.id("folders")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const organizationId = (user.organization_id ?? undefined) as string | undefined;

    return await ctx.db.insert("folders", {
      name: args.name,
      ownerId: user.subject,
      organizationId,
      parentId: args.parentId,
    });
  },
});

/**
 * Get all folders for the current user
 */
export const get = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const organizationId = (user.organization_id ?? undefined) as string | undefined;

    if (organizationId) {
      return await ctx.db
        .query("folders")
        .withIndex("by_organization_id", (q) => q.eq("organizationId", organizationId))
        .collect();
    }

    return await ctx.db
      .query("folders")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", user.subject))
      .collect();
  },
});

/**
 * Delete a folder
 */
export const remove = mutation({
  args: { id: v.id("folders") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const folder = await ctx.db.get(args.id);
    if (!folder) {
      throw new ConvexError("Folder not found");
    }

    if (folder.ownerId !== user.subject) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.delete(args.id);
  },
});

