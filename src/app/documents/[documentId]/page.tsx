import { auth } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { headers } from "next/headers";

import { Document } from "./document";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

interface DocumentIdPageProps {
  params: Promise<{ documentId: Id<"documents"> }>;
  searchParams: Promise<{ token?: string }>;
}

const DocumentIdPage = async ({ params, searchParams }: DocumentIdPageProps) => {
  const { documentId } = await params;
  const { token: shareToken } = await searchParams;

  const { getToken } = await auth();
  const convexToken = (await getToken({ template: "convex" })) ?? undefined;

  // If there's a share token, validate it first
  if (shareToken && !convexToken) {
    // For share links without auth, we need to validate the token
    // For now, we'll require authentication even for share links
    // In a production app, you might want to create a guest session
    throw new Error("Unauthorized - Please sign in to access this shared document");
  }

  if (!convexToken) {
    throw new Error("Unauthorized");
  }

  const preloadedDocument = await preloadQuery(
    api.documents.getById,
    { id: documentId },
    { token: convexToken }
  );

  return <Document preloadedDocument={preloadedDocument} shareToken={shareToken} />;
};

export default DocumentIdPage;
