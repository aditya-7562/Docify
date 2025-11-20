import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { api } from "../../../../convex/_generated/api";
import {
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  handleError,
  createErrorResponse,
  logger,
} from "@/lib/errors";
import type { ClerkSessionClaims } from "@/types/clerk";
import type { LiveblocksAuthRequest } from "@/types/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

// Input validation schema
const liveblocksAuthSchema = z.object({
  room: z.string().min(1, "Room ID is required"),
  token: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    // ---- Clerk Session ----
    const { sessionClaims } = await auth();
    if (!sessionClaims) {
      throw new UnauthorizedError("No session found");
    }

    const user = await currentUser();
    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    // ---- Parse and Validate Input ----
    let body: unknown;
    try {
      body = await req.json();
    } catch (error) {
      throw new ValidationError("Invalid JSON in request body", { originalError: error });
    }

    const validationResult = liveblocksAuthSchema.safeParse(body);
    if (!validationResult.success) {
      logger.warn("Validation failed", { body, errors: validationResult.error.errors });
      throw new ValidationError("Invalid request data", {
        errors: validationResult.error.errors,
      });
    }

    const { room, token } = validationResult.data as LiveblocksAuthRequest & { token?: string };

    let document;
    try {
      document = await convex.query(api.documents.getById, { id: room });
    } catch (error) {
      logger.error(error as Error, { room, userId: user.id });
      throw new NotFoundError("Document not found", { room });
    }

    if (!document) {
      throw new NotFoundError("Document not found", { room });
    }

    const isOwner = document.ownerId === user.id;

    const typedSessionClaims = sessionClaims as ClerkSessionClaims;
    const clerkOrgId = typedSessionClaims.o?.id;
    const isOrganizationMember =
      !!document.organizationId &&
      !!clerkOrgId &&
      document.organizationId === clerkOrgId;

    let hasShareLinkAccess = false;
    let shareLinkRole: "viewer" | "commenter" | "editor" | null = null;
    if (!isOwner && !isOrganizationMember && token) {
      try {
        const shareLink = await convex.query(api.shareLinks.getByToken, { token });
        if (shareLink && shareLink.documentId === room) {

          if (!shareLink.expiresAt || shareLink.expiresAt > Date.now()) {
            hasShareLinkAccess = true;
            shareLinkRole = shareLink.role;
          }
        }
      } catch (error) {

        logger.warn("Share link validation failed", { token, error });
      }
    }

    if (!isOwner && !isOrganizationMember && !hasShareLinkAccess) {
      throw new ForbiddenError("Access denied to this document", {
        documentId: room,
        userId: user.id,
        organizationId: clerkOrgId,
      });
    }

    const name =
      user.fullName ??
      user.primaryEmailAddress?.emailAddress ??
      "Anonymous";

    const hue = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;

    const color = `hsl(${hue}, 80%, 60%)`;

    const session = liveblocks.prepareSession(user.id, {
      userInfo: {
        name,
        avatar: user.imageUrl ?? undefined,
        color,
      },
    });


    if (isOwner || isOrganizationMember) {
      session.allow(room, session.FULL_ACCESS);
    } else if (shareLinkRole === "editor") {
      session.allow(room, session.FULL_ACCESS);
    } else if (shareLinkRole === "commenter") {

      session.allow(room, ["room:read", "room:presence:write", "comments:write"] as const);
    } else if (shareLinkRole === "viewer") {

      session.allow(room, session.READ_ACCESS);
    } else {

      session.allow(room, session.READ_ACCESS);
    }

    const { body: responseBody, status } = await session.authorize();

    return new Response(responseBody, {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    const appError = handleError(error, {
      endpoint: "/api/liveblocks-auth",
      method: "POST",
    });

    if (appError.statusCode !== 500) {
      return createErrorResponse(appError);
    }

    logger.error(appError, { endpoint: "/api/liveblocks-auth" });
    return Response.json(
      { error: { code: appError.code, message: "Internal server error" } },
      { status: 500 }
    );
  }
}
