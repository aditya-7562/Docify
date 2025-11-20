"use client";

import { Avatars } from "./avatars";
import { DocumentInput } from "./document-input";
import { UserButton } from "@clerk/nextjs";
import { ShareDialog } from "./share-dialog";
import { VersionHistory } from "./version-history";
import { Inbox } from "./inbox";
import { Doc } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { FileTextIcon } from "lucide-react";
import { useStatus } from "@liveblocks/react";

interface NavbarProps {
  data: Doc<"documents">;
}

export const Navbar = ({ data }: NavbarProps) => {
  const { user } = useUser();

  const userPermission = useQuery(api.permissions.getUserPermission, { documentId: data._id });
  const canManageSharing =
    user?.id === data.ownerId ||
    (userPermission && userPermission.role === "editor");

  const status = useStatus();
  const savedText = status === "connected" ? "Saved" : "Saving...";

  return (
    <div className="h-16 border-b bg-white dark:bg-gray-900 px-6 flex items-center justify-between">
      
      {/* LEFT BLOCK */}
      <div className="flex items-center gap-3 min-w-0 flex-none">
        <FileTextIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
        <DocumentInput title={data.title} id={data._id} />
        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap flex-shrink-0">
          {savedText} · 1 min ago
        </span>
      </div>

      {/* RIGHT BLOCK */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Avatars />
        <Inbox />
        <VersionHistory documentId={data._id} documentTitle={data.title} />
        {canManageSharing && <ShareDialog documentId={data._id} />}
        <UserButton />
      </div>

    </div>
  );
};

