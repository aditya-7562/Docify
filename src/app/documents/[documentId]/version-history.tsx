"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HistoryIcon, RotateCcwIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { useEditorStore } from "@/store/use-editor-store";

interface VersionHistoryProps {
  documentId: Id<"documents">;
  documentTitle: string;
}

export function VersionHistory({ documentId, documentTitle }: VersionHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const versions = useQuery(api.versions.getByDocumentId, { documentId });
  const createVersion = useMutation(api.versions.create);
  const { editor } = useEditorStore();

  const handleCreateVersion = async () => {
    if (!editor) {
      toast.error("Editor not available");
      return;
    }

    try {
      const content = editor.getHTML();
      await createVersion({
        documentId,
        content,
        title: documentTitle,
        description: "Manual snapshot",
      });
      toast.success("Version created");
    } catch (error) {
      toast.error("Failed to create version");
    }
  };

  const handleRestore = async (versionId: Id<"versions">) => {
    if (!editor) {
      toast.error("Editor not available");
      return;
    }

    const version = versions?.find((v) => v._id === versionId);
    if (!version) {
      toast.error("Version not found");
      return;
    }

    try {
      editor.commands.setContent(version.content);
      toast.success("Version restored");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to restore version");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <HistoryIcon className="size-4" />
          Version History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
          <DialogDescription>
            View and restore previous versions of this document
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Button onClick={handleCreateVersion} variant="outline" className="w-full">
            Create New Version
          </Button>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {versions && versions.length > 0 ? (
                versions.map((version) => (
                  <div
                    key={version._id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{version.title}</p>
                        {version.description && (
                          <span className="text-sm text-gray-500">
                            - {version.description}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {format(new Date(version._creationTime), "PPpp")}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRestore(version._id)}
                      className="gap-2"
                    >
                      <RotateCcwIcon className="size-4" />
                      Restore
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No versions yet</p>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

