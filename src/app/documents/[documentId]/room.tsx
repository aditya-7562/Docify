"use client";

import { ReactNode, useEffect, useMemo, useState, useCallback } from "react";
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import { useParams, useSearchParams } from "next/navigation";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { getUsers, getDocuments } from "./action";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";
import { LEFT_MARGIN_DEFAULT, RIGHT_MARGIN_DEFAULT } from "@/constants/margins";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type User = { id: string; name: string; avatar: string; color: string; };

interface RoomProps {
  children: ReactNode;
  shareToken?: string;
}

export function Room({ children, shareToken }: RoomProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const documentId = params.documentId as string;
  const urlShareToken = searchParams.get("token");

  const [users, setUsers] = useState<User[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchUsers = useMemo(
    () => async () => {
      try {
        const list = await getUsers();
        setUsers(list);
      } catch {
        toast.error("Failed to fetch users");
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const authEndpoint = useCallback(async () => {
    const endpoint = "/api/liveblocks-auth";
    const room = documentId;
    const token = shareToken || urlShareToken;

    // Only include token in request body if it exists
    const requestBody: { room: string; token?: string } = { room };
    if (token) {
      requestBody.token = token;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Authentication failed: ${response.statusText}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorMessage;
      } catch {
        // If response is not JSON, use the text
        errorMessage = errorText || errorMessage;
      }
      
      // If it's a 403 and we have a share token, show a specific error
      if (response.status === 403 && (shareToken || urlShareToken)) {
        setAuthError("Share link expired or deleted. Please contact the document owner for a new link.");
      } else {
        setAuthError(errorMessage);
      }
      
      throw new Error(errorMessage);
    }

    // Clear any previous auth errors on success
    setAuthError(null);

    // Parse the response body and return the token object
    // Liveblocks expects { token: "..." } format
    const data = await response.json();
    return data;
  }, [documentId, shareToken, urlShareToken]);

  // If there's an auth error, show error UI instead of the document
  if (authError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6 px-4 bg-editor-bg">
        <div className="text-center space-y-4 max-w-md">
          <div className="flex justify-center">
            <div className="bg-rose-100 p-3 rounded-full">
              <svg
                className="size-10 text-rose-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
            <p className="text-gray-600">{authError}</p>
          </div>
        </div>
        <div className="flex items-center gap-x-3">
          <Button asChild variant="default" className="font-medium">
            <Link href="/">Go back home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <LiveblocksProvider
      throttle={16}
      authEndpoint={authEndpoint}
      resolveUsers={({ userIds }) => {
        return userIds.map((userId) => users.find((user) => user.id === userId) ?? undefined);
      }}
      resolveMentionSuggestions={({ text }) => {
        let filteredUsers = users;

        if (text) {
          filteredUsers = users.filter((user) =>
            user.name.toLowerCase().includes(text.toLowerCase())
          );
        }

        return filteredUsers.map((user) => user.id);
      }}
      resolveRoomsInfo={async ({ roomIds }) => {
        const documents = await getDocuments(roomIds as Id<"documents">[]);
        return documents.map((document) => ({
          id: document.id,
          name: document.name,
        }));
      }}
    >
      <RoomProvider
        id={documentId}
        initialStorage={{ leftMargin: LEFT_MARGIN_DEFAULT, rightMargin: RIGHT_MARGIN_DEFAULT }}
      >
        <ClientSideSuspense fallback={<FullscreenLoader label="Room loading..." />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
