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
  token: z.string().optional(),
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
      throw new ValidationError("Invalid request data", {
        errors: validationResult.error.errors,
      });
    }

    const { room, token } = validationResult.data as LiveblocksAuthRequest & { token?: string };

    // ---- Fetch Document ----
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

    // ---- Permission Check ----
    const isOwner = document.ownerId === user.id;

    // Clerk org lives under sessionClaims.o.id, not sessionClaims.org_id
    const typedSessionClaims = sessionClaims as ClerkSessionClaims;
    const clerkOrgId = typedSessionClaims.o?.id;
    const isOrganizationMember =
      !!document.organizationId &&
      !!clerkOrgId &&
      document.organizationId === clerkOrgId;

    // Check share link if user is not owner or org member
    let hasShareLinkAccess = false;
    if (!isOwner && !isOrganizationMember && token) {
      try {
        const shareLink = await convex.query(api.shareLinks.getByToken, { token });
        if (shareLink && shareLink.documentId === room) {
          // Check if expired
          if (!shareLink.expiresAt || shareLink.expiresAt > Date.now()) {
            hasShareLinkAccess = true;
          }
        }
      } catch (error) {
        // Share link not found or invalid - continue to check other permissions
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

    // ---- Liveblocks Session ----
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

    session.allow(room, session.FULL_ACCESS);

    // Liveblocks expects raw body + status, NOT JSON wrapped
    const { body: responseBody, status } = await session.authorize();

    // Return response with proper Content-Type header for JSON
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

    // If it's already an AppError with proper status, return JSON response
    if (appError.statusCode !== 500) {
      return createErrorResponse(appError);
    }

    // For internal errors, log but don't expose details
    logger.error(appError, { endpoint: "/api/liveblocks-auth" });
    return Response.json(
      { error: { code: appError.code, message: "Internal server error" } },
      { status: 500 }
    );
  }
}
