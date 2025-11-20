"use client";

import { useRouter } from "next/navigation";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FileText, Home, Plus, LoaderIcon, Copy, Download, Trash2 } from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Doc } from "../../../../convex/_generated/dataModel";
import { RemoveDialog } from "@/components/remove-dialog";

interface DocumentsSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentDocument?: Doc<"documents"> | null;
}

export const DocumentsSidebar = ({ open, onOpenChange, currentDocument }: DocumentsSidebarProps) => {
  const router = useRouter();
  const create = useMutation(api.documents.create);
  const { results, status, loadMore } = usePaginatedQuery(
    api.documents.get,
    {},
    { initialNumItems: 20 }
  );

  const handleNewDocument = () => {
    create({ title: "Untitled document" })
      .then((documentId) => {
        toast.success("Document created");
        router.push(`/documents/${documentId}`);
        onOpenChange(false);
      })
      .catch(() => {
        toast.error("Failed to create document");
      });
  };

  const handleDocumentClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
    onOpenChange(false);
  };

  const handleMakeCopy = () => {
    toast.info("Make a Copy feature coming soon");
  };

  const handleDownload = () => {
    toast.info("Download feature coming soon");
  };


  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 sm:w-96 p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            All Documents
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          <div className="p-4 border-b space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => {
                router.push("/");
                onOpenChange(false);
              }}
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            <Button
              variant="default"
              className="w-full justify-start gap-2"
              onClick={handleNewDocument}
            >
              <Plus className="h-4 w-4" />
              New Document
            </Button>
          </div>

          {/* File Menu Section - Only show if we have a current document */}
          {currentDocument && (
            <>
              <Separator />
              <div className="p-4 border-b space-y-1">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  File
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-sm"
                  onClick={handleMakeCopy}
                >
                  <Copy className="h-4 w-4" />
                  Make a Copy
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-sm"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <RemoveDialog documentId={currentDocument._id}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                    Move to Trash
                  </Button>
                </RemoveDialog>
              </div>
            </>
          )}

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-1">
              {results === undefined ? (
                <div className="flex justify-center items-center py-8">
                  <LoaderIcon className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No documents found
                </div>
              ) : (
                <>
                  {results.map((document) => (
                    <DocumentItem
                      key={document._id}
                      document={document}
                      onClick={() => handleDocumentClick(document._id)}
                    />
                  ))}
                  {status === "CanLoadMore" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => loadMore(10)}
                    >
                      Load more
                    </Button>
                  )}
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface DocumentItemProps {
  document: Doc<"documents">;
  onClick: () => void;
}

const DocumentItem = ({ document, onClick }: DocumentItemProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
    >
      <div className="flex items-start gap-3">
        <FileText className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
            {document.title}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {format(new Date(document._creationTime), "MMM dd, yyyy")}
          </div>
        </div>
      </div>
    </button>
  );
};

