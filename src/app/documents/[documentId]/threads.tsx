"use client";

import {
  ClientSideSuspense,
  useThreads
} from "@liveblocks/react/suspense";

import {
  AnchoredThreads,
  FloatingComposer,
  FloatingThreads,
} from "@liveblocks/react-tiptap";

import { useSelf } from "@liveblocks/react";
import { Editor } from "@tiptap/react";
import { useEffect } from "react";

type ThreadListItem = NonNullable<ReturnType<typeof useThreads>["threads"]>[number];
type ThreadWithCreator = ThreadListItem & { createdBy?: string | null };

export const Threads = ({ editor }: { editor: Editor | null }) => {
  return (
    <ClientSideSuspense fallback={null}>
      <ThreadsList editor={editor} />
    </ClientSideSuspense>
  );
};

function ThreadsList({ editor }: { editor: Editor | null }) {
  const { threads } = useThreads({ query: { resolved: false } });
  const currentUser = useSelf();

  useEffect(() => {
    if (!threads || !currentUser || threads.length === 0) return;

    const updateResolveButtons = () => {
      threads.forEach((thread) => {
        const threadData = thread as ThreadWithCreator;
        const isOwner = threadData.createdBy === currentUser.id;

        const threadElement = document.querySelector(
          `[data-liveblocks-thread-id="${thread.id}"], [data-thread-id="${thread.id}"]`
        ) as HTMLElement;

        if (threadElement) {
          threadElement.setAttribute("data-thread-owner", isOwner ? "true" : "false");
          const resolveButtons = threadElement.querySelectorAll(
            'button[aria-label*="Resolve"], button[aria-label*="resolve"], button[class*="resolve"], button[class*="Resolve"]'
          );

          resolveButtons.forEach((btn) => {
            const buttonText = btn.textContent?.toLowerCase() || "";
            const ariaLabel = btn.getAttribute("aria-label")?.toLowerCase() || "";
            if (buttonText.includes("resolve") || ariaLabel.includes("resolve")) {
              (btn as HTMLElement).setAttribute("data-resolve-button", "true");
            }
          });
        }
      });
    };

    const rafId = requestAnimationFrame(() => {
      updateResolveButtons();
    });

    return () => cancelAnimationFrame(rafId);
  }, [threads, currentUser]);

  if (!editor || !threads) return null;

  return (
    <>
      <div className="anchored-threads-layer">
        <AnchoredThreads editor={editor} threads={threads} />
      </div>

      <div className="floating-threads-layer">
        <FloatingThreads editor={editor} threads={threads} />
      </div>

      <div className="composer-layer">
        <FloatingComposer editor={editor} />
      </div>
    </>
  );
}
