"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { KeyboardIcon } from "lucide-react";
import { KeyboardShortcut } from "@/hooks/use-keyboard-shortcuts";

interface KeyboardShortcutsDialogProps {
  shortcuts: KeyboardShortcut[];
}

export function KeyboardShortcutsDialog({ shortcuts }: KeyboardShortcutsDialogProps) {
  const formatKey = (shortcut: KeyboardShortcut): string => {
    const parts: string[] = [];
    if (shortcut.ctrl || shortcut.meta) parts.push("⌘");
    if (shortcut.shift) parts.push("⇧");
    if (shortcut.alt) parts.push("⌥");
    parts.push(shortcut.key.toUpperCase());
    return parts.join(" + ");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <KeyboardIcon className="size-4" />
          Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these shortcuts to work faster in the editor
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <span className="text-sm">{shortcut.description}</span>
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                  {formatKey(shortcut)}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

