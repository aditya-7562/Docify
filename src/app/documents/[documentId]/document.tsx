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
        <div className="flex-1 flex flex-col bg-surface dark:bg-gray-900">
          <div className="fixed top-0 left-0 right-0 z-10 print:hidden">
            <Navbar data={document} />
          </div>
          <div className="pt-16 print:pt-0 flex-1">
            <Toolbar />
            <Editor initialContent={document.initialContent} />
          </div>
        </div>
      </Room>
    </UserRoleProvider>
  );
};
