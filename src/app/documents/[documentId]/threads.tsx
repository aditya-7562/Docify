"use client";

import { ClientSideSuspense, useThreads } from "@liveblocks/react/suspense";
import { AnchoredThreads, FloatingComposer, FloatingThreads } from "@liveblocks/react-tiptap";
import { useSelf } from "@liveblocks/react";
import { Editor } from "@tiptap/react";
import { useEffect, useRef } from "react";

export const Threads = ({ editor }: { editor: Editor | null }) => {
  return (
    <ClientSideSuspense fallback={<></>}>
      <ThreadsList editor={editor} />
    </ClientSideSuspense>
  );
};

export function ThreadsList({ editor }: { editor: Editor | null }) {
  const { threads } = useThreads({ query: { resolved: false } });
  const currentUser = useSelf();
  const observerRef = useRef<MutationObserver | null>(null);

  // Hide resolve buttons for threads not owned by current user
  useEffect(() => {
    if (!currentUser || !threads || threads.length === 0) return;

    const hideResolveButtons = () => {
      threads.forEach((thread) => {
        const isOwner = thread.createdBy === currentUser.id;
        
        // Try multiple selectors to find thread elements
        const threadSelectors = [
          `[data-thread-id="${thread.id}"]`,
          `[data-liveblocks-thread-id="${thread.id}"]`,
          `[id*="${thread.id}"]`,
        ];

        let threadElement: HTMLElement | null = null;
        for (const selector of threadSelectors) {
          threadElement = document.querySelector(selector) as HTMLElement;
          if (threadElement) break;
        }

        // If we can't find by ID, search all thread-like elements
        if (!threadElement) {
          const allThreadElements = document.querySelectorAll(
            '[class*="thread"], [class*="Thread"], [data-liveblocks-thread]'
          );
          allThreadElements.forEach((el) => {
            // Check if this element might be our thread
            const text = el.textContent || "";
            if (thread.comments && thread.comments.length > 0) {
              const firstComment = thread.comments[0];
              if (firstComment?.body) {
                const commentText = typeof firstComment.body === 'string' 
                  ? firstComment.body 
                  : JSON.stringify(firstComment.body);
                if (text.includes(commentText.substring(0, 30))) {
                  threadElement = el as HTMLElement;
                }
              }
            }
          });
        }

        if (threadElement) {
          // Find resolve button - try multiple selectors
          let resolveButton: HTMLElement | null = null;
          
          // Try common selectors
          const selectors = [
            'button[aria-label*="Resolve"]',
            'button[aria-label*="resolve"]',
            '[data-resolve-button]',
            'button[class*="resolve"]',
            'button[class*="Resolve"]',
          ];

          for (const selector of selectors) {
            try {
              resolveButton = threadElement.querySelector(selector) as HTMLElement;
              if (resolveButton) break;
            } catch {
              // Invalid selector, continue
            }
          }

          // If not found by selector, search all buttons in thread
          if (!resolveButton) {
            const buttons = threadElement.querySelectorAll("button");
            buttons.forEach((btn) => {
              const text = btn.textContent?.toLowerCase() || "";
              const ariaLabel = btn.getAttribute("aria-label")?.toLowerCase() || "";
              if (text.includes("resolve") || ariaLabel.includes("resolve")) {
                resolveButton = btn;
              }
            });
          }

          if (resolveButton) {
            if (isOwner) {
              resolveButton.style.display = "";
              resolveButton.removeAttribute("disabled");
              resolveButton.style.pointerEvents = "";
            } else {
              resolveButton.style.display = "none";
              resolveButton.setAttribute("disabled", "true");
              resolveButton.style.pointerEvents = "none";
            }
          }
        }
      });
    };

    // Initial hide
    hideResolveButtons();

    // Set up MutationObserver to watch for dynamically added thread elements
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new MutationObserver(() => {
      hideResolveButtons();
    });

    // Observe changes in the document body (where threads are rendered)
    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "data-thread-id", "data-liveblocks-thread-id"],
    });

    // Also run periodically to catch any missed updates
    const interval = setInterval(hideResolveButtons, 1000);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      clearInterval(interval);
    };
  }, [threads, currentUser]);

  return (
    <>
      <div className="anchored-threads">
        <AnchoredThreads editor={editor} threads={threads} />
      </div>
      <FloatingThreads editor={editor} threads={threads} className="floating-threads" />
      <FloatingComposer editor={editor} className="floating-composer" />
    </>
  );
}
