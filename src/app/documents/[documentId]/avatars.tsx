"use client";

import { ClientSideSuspense } from "@liveblocks/react";
import { useOthers, useSelf } from "@liveblocks/react/suspense";
import Image from "next/image";

export const Avatars = () => {
  return (
    <ClientSideSuspense fallback={null}>
      <AvatarStack />
    </ClientSideSuspense>
  );
};

const AvatarStack = () => {
  const users = useOthers();
  const currentUser = useSelf();

  const allUsers = currentUser ? [currentUser, ...users] : users;
  const displayUsers = allUsers.slice(0, 4);
  const remainingCount = allUsers.length - 4;

  if (allUsers.length === 0) return null;

  return (
    <div className="flex -space-x-3">
      {displayUsers.map((user) => {
        const isCurrentUser = user === currentUser;
        const info = isCurrentUser ? currentUser.info : (user as typeof users[0]).info;
        const name = isCurrentUser ? "You" : info.name;
        const key = isCurrentUser ? "current-user" : (user as typeof users[0]).connectionId;
        
        return (
          <Image
            key={key}
            src={info.avatar}
            alt={name}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full ring-2 ring-white shadow-sm hover:scale-105 transition-transform"
            title={name}
            unoptimized
          />
        );
      })}
      {remainingCount > 0 && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium ring-2 ring-white shadow-sm">
          +{remainingCount}
        </div>
      )}
    </div>
  );
};
