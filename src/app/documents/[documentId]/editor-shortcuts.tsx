"use client";

import { useEditorStore } from "@/store/use-editor-store";
import { useKeyboardShortcuts, KeyboardShortcut } from "@/hooks/use-keyboard-shortcuts";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { exportToMarkdown, exportToHTML, exportToJSON, downloadFile } from "@/lib/export";

interface EditorShortcutsProps {
  documentTitle: string;
  onSaveMarkdown?: () => void;
  onSaveHTML?: () => void;
  onSaveJSON?: () => void;
}

export function EditorShortcuts({
  documentTitle,
  onSaveMarkdown,
  onSaveHTML,
  onSaveJSON,
}: EditorShortcutsProps) {
  const { editor } = useEditorStore();
  const router = useRouter();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: "b",
      ctrl: true,
      action: () => editor?.chain().focus().toggleBold().run(),
      description: "Toggle Bold",
    },
    {
      key: "i",
      ctrl: true,
      action: () => editor?.chain().focus().toggleItalic().run(),
      description: "Toggle Italic",
    },
    {
      key: "u",
      ctrl: true,
      action: () => editor?.chain().focus().toggleUnderline().run(),
      description: "Toggle Underline",
    },
    {
      key: "z",
      ctrl: true,
      action: () => editor?.chain().focus().undo().run(),
      description: "Undo",
    },
    {
      key: "y",
      ctrl: true,
      action: () => editor?.chain().focus().redo().run(),
      description: "Redo",
    },
    {
      key: "z",
      ctrl: true,
      shift: true,
      action: () => editor?.chain().focus().redo().run(),
      description: "Redo (Alternative)",
    },
    {
      key: "s",
      ctrl: true,
      action: () => {
        if (editor) {
          const html = exportToHTML(editor);
          downloadFile(html, `${documentTitle}.html`, "text/html");
          toast.success("Document saved as HTML");
        }
      },
      description: "Save as HTML",
    },
    {
      key: "k",
      ctrl: true,
      action: () => {
        if (editor) {
          const markdown = exportToMarkdown(editor);
          downloadFile(markdown, `${documentTitle}.md`, "text/markdown");
          toast.success("Document saved as Markdown");
        }
      },
      description: "Save as Markdown",
    },
    {
      key: "p",
      ctrl: true,
      action: () => window.print(),
      description: "Print",
    },
    {
      key: "n",
      ctrl: true,
      action: () => router.push("/"),
      description: "New Document",
    },
    {
      key: "/",
      ctrl: true,
      action: () => {
        // This would open the shortcuts dialog - handled by parent
        toast.info("Press Ctrl+/ to see all shortcuts");
      },
      description: "Show Shortcuts",
    },
  ];

  useKeyboardShortcuts(shortcuts);

  return null;
}

