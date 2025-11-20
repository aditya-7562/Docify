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

  if (!editor || !threads) return null;

  // Hide resolve buttons for threads not owned by current user
  useEffect(() => {
    if (!threads || !currentUser || threads.length === 0) return;

    const updateResolveButtons = () => {
      threads.forEach((thread) => {
        // Access createdBy via type assertion since it exists at runtime
        const threadData = thread as any;
        const isOwner = threadData.createdBy === currentUser?.id;
        
        // Find thread element using Liveblocks data attributes
        const threadElement = document.querySelector(
          `[data-liveblocks-thread-id="${thread.id}"], [data-thread-id="${thread.id}"]`
        ) as HTMLElement;

        if (threadElement) {
          // Mark thread with ownership for CSS targeting
          threadElement.setAttribute("data-thread-owner", isOwner ? "true" : "false");
          
          // Find resolve buttons within this thread
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

    // Use requestAnimationFrame to ensure DOM is ready
    const rafId = requestAnimationFrame(() => {
      updateResolveButtons();
    });

    return () => cancelAnimationFrame(rafId);
  }, [threads, currentUser]);

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
