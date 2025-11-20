"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";

import { Room } from "./room";
import { Editor } from "./editor";
import { Navbar } from "./navbar";
import { Toolbar } from "./toolbar";
import { EditorShortcuts } from "./editor-shortcuts";
import { UserRoleProvider } from "./user-role-context";
import { api } from "../../../../convex/_generated/api";

interface DocumentProps {
  preloadedDocument: Preloaded<typeof api.documents.getById>;
  shareToken?: string;
  userRole: "viewer" | "commenter" | "editor";
}

export const Document = ({ preloadedDocument, shareToken, userRole }: DocumentProps) => {
  const document = usePreloadedQuery(preloadedDocument);

  return (
    <UserRoleProvider userRole={userRole}>
      <Room shareToken={shareToken}>
        <EditorShortcuts documentTitle={document.title} />
        <div className="min-h-screen bg-editor-bg">
          <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden h-[112px]">
            <Navbar data={document} />
            <Toolbar />
          </div>
          <div className="pt-[114px] print:pt-0">
            <Editor initialContent={document.initialContent} />
          </div>
        </div>
      </Room>
    </UserRoleProvider>
  );
};
