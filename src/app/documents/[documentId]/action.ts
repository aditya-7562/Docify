"use server";

import { ConvexHttpClient } from "convex/browser";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import type { ClerkSessionClaims } from "@/types/clerk";
import type { UserResponse, DocumentResponse } from "@/types/api";
import { handleError, logger } from "@/lib/errors";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getDocuments(ids: Id<"documents">[]): Promise<DocumentResponse[]> {
  try {
    return await convex.query(api.documents.getByIds, { ids });
  } catch (error) {
    logger.error(error as Error, { function: "getDocuments", ids });
    throw handleError(error, { function: "getDocuments" });
  }
}

export async function getUsers(): Promise<UserResponse[]> {
  try {
    const { sessionClaims } = await auth();
    const clerk = await clerkClient();

    const typedSessionClaims = sessionClaims as ClerkSessionClaims | null;
    const organizationId = typedSessionClaims?.o?.id ?? typedSessionClaims?.org_id;

    if (!organizationId) {
      // Return empty array if no organization
      return [];
    }

    const response = await clerk.users.getUserList({
      organizationId: [organizationId],
    });

    const users: UserResponse[] = response.data.map((user) => {
      const name =
        user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous";
      
      // Generate color based on name (consistent with liveblocks-auth)
      const hue = name
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
      const color = `hsl(${hue}, 80%, 60%)`;

      return {
        id: user.id,
        name,
        avatar: user.imageUrl ?? "",
        color,
      };
    });

    return users;
  } catch (error) {
    logger.error(error as Error, { function: "getUsers" });
    throw handleError(error, { function: "getUsers" });
  }
}
