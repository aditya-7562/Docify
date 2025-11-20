import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export type PermissionRole = "viewer" | "commenter" | "editor";


export const grant = mutation({
  args: {
    documentId: v.id("documents"),
    userId: v.string(),
    role: v.union(v.literal("viewer"), v.literal("commenter"), v.literal("editor")),
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

      const existingPermission = await ctx.db
        .query("permissions")
        .withIndex("by_document_user", (q) =>
          q.eq("documentId", args.documentId).eq("userId", user.subject)
        )
        .first();

      if (existingPermission?.role !== "editor") {
        throw new ConvexError("Unauthorized");
      }
    }


    const existing = await ctx.db
      .query("permissions")
      .withIndex("by_document_user", (q) =>
        q.eq("documentId", args.documentId).eq("userId", args.userId)
      )
      .first();

    if (existing) {

      return await ctx.db.patch(existing._id, { role: args.role });
    }


    return await ctx.db.insert("permissions", {
      documentId: args.documentId,
      userId: args.userId,
      role: args.role,
    });
  },
});


export const revoke = mutation({
  args: {
    documentId: v.id("documents"),
    userId: v.string(),
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

    const permission = await ctx.db
      .query("permissions")
      .withIndex("by_document_user", (q) =>
        q.eq("documentId", args.documentId).eq("userId", args.userId)
      )
      .first();

    if (permission) {
      return await ctx.db.delete(permission._id);
    }
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
        throw new ConvexError("Unauthorized");
      }
    }

    return await ctx.db
      .query("permissions")
      .withIndex("by_document_id", (q) => q.eq("documentId", args.documentId))
      .collect();
  },
});


export const getUserPermission = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      return null;
    }

    const document = await ctx.db.get(args.documentId);
    if (!document) {
      return null;
    }

    if (document.ownerId === user.subject) {
      return { role: "editor" as PermissionRole, isOwner: true };
    }

    const organizationId = (user.organization_id ?? undefined) as string | undefined;
    if (document.organizationId && document.organizationId === organizationId) {
      return { role: "editor" as PermissionRole, isOwner: false };
    }


    const permission = await ctx.db
      .query("permissions")
      .withIndex("by_document_user", (q) =>
        q.eq("documentId", args.documentId).eq("userId", user.subject)
      )
      .first();

    if (permission) {
      return { role: permission.role, isOwner: false };
    }

    return null;
  },
});

