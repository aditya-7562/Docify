"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePaginatedQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Home, FileText, Plus, Settings } from "lucide-react";
import { toast } from "sonner";

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const create = useMutation(api.documents.create);
  const { results: documents } = usePaginatedQuery(
    api.documents.get,
    {},
    { initialNumItems: 10 }
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleNewDocument = () => {
    create({ title: "Untitled document" })
      .then((documentId) => {
        toast.success("Document created");
        router.push(`/documents/${documentId}`);
        setOpen(false);
      })
      .catch(() => {
        toast.error("Failed to create document");
      });
  };

  const handleDocumentSelect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => { router.push("/"); setOpen(false); }}>
            <Home className="h-4 w-4" />
            <span>Go to Home</span>
            <CommandShortcut>⌘H</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Documents">
          <CommandItem onSelect={handleNewDocument}>
            <Plus className="h-4 w-4" />
            <span>New Document</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          {documents && documents.length > 0 && (
            <>
              <CommandSeparator />
              {documents.map((doc) => (
                <CommandItem
                  key={doc._id}
                  onSelect={() => handleDocumentSelect(doc._id)}
                >
                  <FileText className="h-4 w-4" />
                  <span>{doc.title}</span>
                </CommandItem>
              ))}
            </>
          )}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => { router.push("/organization"); setOpen(false); }}>
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

