import { auth } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";

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

  const preloadedDocument = await preloadQuery(
    api.documents.getById,
    { id: documentId },
    { token: convexToken }
  );

  return <Document preloadedDocument={preloadedDocument} shareToken={shareToken} />;
};

export default DocumentIdPage;
