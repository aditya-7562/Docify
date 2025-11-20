"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2Icon, CopyIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface ShareDialogProps {
  documentId: Id<"documents">;
}

type PermissionRole = "viewer" | "commenter" | "editor";

export function ShareDialog({ documentId }: ShareDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<PermissionRole>("viewer");
  const [expiresInDays, setExpiresInDays] = useState<string>("");

  // Always call hooks in the same order - useQuery returns undefined on error or while loading
  // We'll handle the error case gracefully in the UI
  const permissions = useQuery(api.permissions.getByDocumentId, { documentId });
  const shareLinks = useQuery(api.shareLinks.getByDocumentId, { documentId });
  
  const createShareLink = useMutation(api.shareLinks.create);
  const deleteShareLink = useMutation(api.shareLinks.remove);

  const handleCreateLink = async () => {
    try {
      const expiresDays = expiresInDays ? parseInt(expiresInDays) : undefined;
      await createShareLink({
        documentId,
        role: selectedRole,
        expiresInDays: expiresDays,
      });
      toast.success("Share link created");
      setExpiresInDays("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create share link");
    }
  };

  const handleCopyLink = (token: string) => {
    const url = `${window.location.origin}/documents/${documentId}?token=${token}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const handleDeleteLink = async (linkId: Id<"shareLinks">) => {
    try {
      await deleteShareLink({ id: linkId });
      toast.success("Share link deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete share link");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Share2Icon className="size-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            Share this document with others or create a shareable link
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 overflow-y-auto flex-1 min-h-0 pr-1">
          {/* Create Share Link */}
          <div className="space-y-4">
            <h3 className="font-semibold">Create Share Link</h3>
            <div className="space-y-2">
              <Label>Permission Level</Label>
              <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as PermissionRole)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer - Can view only</SelectItem>
                  <SelectItem value="commenter">Commenter - Can view and comment</SelectItem>
                  <SelectItem value="editor">Editor - Can view, comment, and edit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Expires in (days, optional)</Label>
              <Input
                type="number"
                placeholder="Leave empty for no expiration"
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateLink} className="w-full">
              Create Link
            </Button>
          </div>

          {/* Existing Share Links */}
          {shareLinks && shareLinks.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Active Share Links</h3>
              <div className="space-y-2">
                {shareLinks.map((link) => {
                  const url = `${window.location.origin}/documents/${documentId}?token=${link.token}`;
                  const isExpired = link.expiresAt && link.expiresAt < Date.now();

                  return (
                    <div
                      key={link._id}
                      className="flex items-center justify-between gap-3 p-3 border rounded-lg"
                    >
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize">{link.role}</span>
                          {isExpired && (
                            <span className="text-xs text-red-500">Expired</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate break-all">{url}</p>
                        {link.expiresAt && (
                          <p className="text-xs text-gray-400">
                            Expires: {format(new Date(link.expiresAt), "PPpp")}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyLink(link.token)}
                        >
                          <CopyIcon className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteLink(link._id)}
                        >
                          <TrashIcon className="size-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Permissions List - Only show if user has access and permissions are loaded */}
          {permissions && Array.isArray(permissions) && permissions.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">People with Access</h3>
              <div className="space-y-2">
                {permissions.map((permission) => (
                  <div
                    key={permission._id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="font-medium truncate">User ID: {permission.userId}</p>
                      <p className="text-sm text-gray-500 capitalize">{permission.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

