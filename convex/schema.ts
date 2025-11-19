import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    initialContent: v.optional(v.string()),
    ownerId: v.string(),
    roomId: v.optional(v.string()),
    organizationId: v.optional(v.string()),
    folderId: v.optional(v.id("folders")),
    tags: v.optional(v.array(v.string())),
    isStarred: v.optional(v.boolean()),
  })
    .index("by_owner_id", ["ownerId"])
    .index("by_organization_id", ["organizationId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["ownerId", "organizationId"],
    }),
  versions: defineTable({
    documentId: v.id("documents"),
    content: v.string(),
    title: v.string(),
    createdBy: v.string(),
    description: v.optional(v.string()),
  })
    .index("by_document_id", ["documentId"]),
  permissions: defineTable({
    documentId: v.id("documents"),
    userId: v.string(),
    role: v.union(v.literal("viewer"), v.literal("commenter"), v.literal("editor")),
  })
    .index("by_document_id", ["documentId"])
    .index("by_user_id", ["userId"])
    .index("by_document_user", ["documentId", "userId"]),
  shareLinks: defineTable({
    documentId: v.id("documents"),
    token: v.string(),
    role: v.union(v.literal("viewer"), v.literal("commenter"), v.literal("editor")),
    expiresAt: v.optional(v.number()),
    createdBy: v.string(),
  })
    .index("by_token", ["token"])
    .index("by_document_id", ["documentId"]),
  folders: defineTable({
    name: v.string(),
    ownerId: v.string(),
    organizationId: v.optional(v.string()),
    parentId: v.optional(v.id("folders")),
  })
    .index("by_owner_id", ["ownerId"])
    .index("by_organization_id", ["organizationId"])
    .index("by_parent_id", ["parentId"]),
});
