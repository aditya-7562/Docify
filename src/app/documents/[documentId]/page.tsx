import { auth } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { ConvexHttpClient } from "convex/browser";
import { redirect } from "next/navigation";

import { Document } from "./document";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface DocumentIdPageProps {
  params: Promise<{ documentId: Id<"documents"> }>;
  searchParams: Promise<{ token?: string }>;
}

const DocumentIdPage = async ({ params, searchParams }: DocumentIdPageProps) => {
  const { documentId } = await params;
  const { token: shareToken } = await searchParams;

  const { getToken, userId } = await auth();
  const convexToken = (await getToken({ template: "convex" })) ?? undefined;

  // If user is not authenticated, return a placeholder
  // The ConvexClientProvider will detect unauthenticated state and show SignIn
  // The SignInWrapper will preserve the current URL (with token) for redirect after auth
  if (!userId || !convexToken) {
    // Return empty fragment - ConvexClientProvider will handle showing the sign-in
    // The URL with token is preserved by SignInWrapper in ConvexClientProvider
    return <></>;
  }

  // If there's a share token, validate it FIRST before loading the document
  if (shareToken) {
    try {
      const shareLink = await convex.query(
        api.shareLinks.getByToken,
        { token: shareToken },
        { token: convexToken }
      );

      // Check if share link exists and is valid
      if (!shareLink || shareLink.documentId !== documentId) {
        // Share link is invalid or doesn't match this document
        throw new Error("Share link expired or deleted. Please contact the document owner for a new link.");
      }

      // Check if expired
      if (shareLink.expiresAt && shareLink.expiresAt < Date.now()) {
        throw new Error("Share link has expired. Please contact the document owner for a new link.");
      }
    } catch (error) {
      // Share link validation failed - throw error to show error page
      // This prevents the document from loading at all
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Share link expired or deleted. Please contact the document owner for a new link.");
    }
  }

  // Now get the document to check ownership (only if no share token or share token is valid)
  const document = await convex.query(
    api.documents.getById,
    { id: documentId },
    { token: convexToken }
  );

  if (!document) {
    throw new Error("Document not found");
  }

  // Check if user is owner or organization member
  // If accessing via share link and not owner/org member, access is already validated above
  const isOwner = document.ownerId === userId;
  const { sessionClaims } = await auth();
  const typedSessionClaims = sessionClaims as { o?: { id?: string } };
  const clerkOrgId = typedSessionClaims.o?.id;
  const isOrganizationMember = !!(
    document.organizationId && document.organizationId === clerkOrgId
  );

  // If no share token and user is not owner/org member, deny access
  if (!shareToken && !isOwner && !isOrganizationMember) {
    // Check for explicit permissions
    const userPermission = await convex.query(
      api.permissions.getUserPermission,
      { documentId },
      { token: convexToken }
    );

    if (!userPermission) {
      throw new Error("Access denied to this document");
    }
  }

  const preloadedDocument = await preloadQuery(
    api.documents.getById,
    { id: documentId },
    { token: convexToken }
  );

  return <Document preloadedDocument={preloadedDocument} shareToken={shareToken} />;
};

export default DocumentIdPage;
