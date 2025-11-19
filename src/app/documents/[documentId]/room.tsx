"use client";

import { ReactNode, useEffect, useMemo, useState, useCallback } from "react";
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { getUsers, getDocuments } from "./action";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";
import { LEFT_MARGIN_DEFAULT, RIGHT_MARGIN_DEFAULT } from "@/constants/margins";

type User = { id: string; name: string; avatar: string; color: string; };

interface RoomProps {
  children: ReactNode;
  shareToken?: string;
}

export function Room({ children, shareToken }: RoomProps) {
  const params = useParams();
  const documentId = params.documentId as string;

  const [users, setUsers] = useState<User[]>([]);

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

    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ room, token: shareToken }),
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
      throw new Error(errorMessage);
    }

    // Parse the response body and return the token object
    // Liveblocks expects { token: "..." } format
    const data = await response.json();
    return data;
  }, [documentId, shareToken]);

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
