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

export async function getOrganizationName(organizationId: string | null | undefined): Promise<string | null> {
  try {
    if (!organizationId) {
      return null;
    }

    const clerk = await clerkClient();
    const organization = await clerk.organizations.getOrganization({ organizationId });
    
    return organization.name ?? null;
  } catch (error) {
    logger.error(error as Error, { function: "getOrganizationName", organizationId });
    // Return null on error instead of throwing, so UI can still render
    return null;
  }
}

export interface OrganizationMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export async function getOrganizationMembers(organizationId: string): Promise<OrganizationMember[]> {
  try {
    const clerk = await clerkClient();
    const { sessionClaims } = await auth();
    
    // Verify user has access to this organization
    const typedSessionClaims = sessionClaims as ClerkSessionClaims | null;
    const userOrgId = typedSessionClaims?.o?.id ?? typedSessionClaims?.org_id;
    
    if (userOrgId !== organizationId) {
      throw new Error("Unauthorized: You don't have access to this organization");
    }

    // Get organization members
    const members = await clerk.organizations.getOrganizationMembershipList({
      organizationId,
    });

    // Get detailed user info for each member
    const memberDetails: OrganizationMember[] = await Promise.all(
      members.data.map(async (membership) => {
        const user = await clerk.users.getUser(membership.publicUserData.userId);
        return {
          id: user.id,
          name: user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous",
          email: user.primaryEmailAddress?.emailAddress ?? "",
          avatar: user.imageUrl ?? "",
          role: membership.role,
        };
      })
    );

    return memberDetails;
  } catch (error) {
    logger.error(error as Error, { function: "getOrganizationMembers", organizationId });
    throw handleError(error, { function: "getOrganizationMembers" });
  }
}

export async function inviteToOrganization(organizationId: string, emailAddress: string): Promise<void> {
  try {
    const clerk = await clerkClient();
    const { sessionClaims } = await auth();
    
    // Verify user has admin access to this organization
    const typedSessionClaims = sessionClaims as ClerkSessionClaims | null;
    const userOrgId = typedSessionClaims?.o?.id ?? typedSessionClaims?.org_id;
    const userRole = typedSessionClaims?.o?.role;
    
    if (userOrgId !== organizationId) {
      throw new Error("Unauthorized: You don't have access to this organization");
    }
    
    if (userRole !== "org:admin" && userRole !== "admin") {
      throw new Error("Unauthorized: Only organization admins can invite members");
    }

    // Create invitation
    await clerk.organizations.createOrganizationInvitation({
      organizationId,
      emailAddress,
    });
  } catch (error) {
    logger.error(error as Error, { function: "inviteToOrganization", organizationId, emailAddress });
    throw handleError(error, { function: "inviteToOrganization" });
  }
}

export async function removeFromOrganization(organizationId: string, userId: string): Promise<void> {
  try {
    const clerk = await clerkClient();
    const { sessionClaims } = await auth();
    
    // Verify user has admin access to this organization
    const typedSessionClaims = sessionClaims as ClerkSessionClaims | null;
    const userOrgId = typedSessionClaims?.o?.id ?? typedSessionClaims?.org_id;
    const userRole = typedSessionClaims?.o?.role;
    
    if (userOrgId !== organizationId) {
      throw new Error("Unauthorized: You don't have access to this organization");
    }
    
    if (userRole !== "org:admin" && userRole !== "admin") {
      throw new Error("Unauthorized: Only organization admins can remove members");
    }

    // Remove member from organization
    await clerk.organizations.deleteOrganizationMembership({
      organizationId,
      userId,
    });
  } catch (error) {
    logger.error(error as Error, { function: "removeFromOrganization", organizationId, userId });
    throw handleError(error, { function: "removeFromOrganization" });
  }
}
