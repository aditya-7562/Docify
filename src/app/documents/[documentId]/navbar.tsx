"use client";

import Image from "next/image";
import Link from "next/link";

// icons
import { BsFilePdf } from "react-icons/bs";
import {
  BoldIcon,
  FileIcon,
  FileJsonIcon,
  FilePenIcon,
  FilePlusIcon,
  FileTextIcon,
  GlobeIcon,
  ItalicIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  StrikethroughIcon,
  TextIcon,
  // TrashIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react";

import { RenameDialog } from "@/components/rename-dialog";
// import { RemoveDialog } from "@/components/remove-dialog";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { Avatars } from "./avatars";

import { DocumentInput } from "./document-input";
import { useEditorStore } from "@/store/use-editor-store";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Inbox } from "./inbox";
import { VersionHistory } from "./version-history";
import { ShareDialog } from "./share-dialog";
import { KeyboardShortcutsDialog } from "@/components/keyboard-shortcuts-dialog";
import { KeyboardShortcut } from "@/hooks/use-keyboard-shortcuts";
import { DocumentSearch } from "@/components/document-search";
import { Doc } from "../../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

interface NavbarProps {
  data: Doc<"documents">;
}

export const Navbar = ({ data }: NavbarProps) => {
  const router = useRouter();
  const { editor } = useEditorStore();
  const { user } = useUser();

  // Check if user has permission to manage sharing (owner, org member, or editor)
  // This query returns null if user doesn't have access, which is fine
  const userPermission = useQuery(api.permissions.getUserPermission, { documentId: data._id });
  const canManageSharing = 
    user?.id === data.ownerId ||
    (userPermission !== null && userPermission !== undefined && userPermission.role === "editor");

  const mutation = useMutation(api.documents.create);
  const onNewDocument = () => {
    mutation({
      title: "Untitled Document",
      initialContent: "",
    })
      .catch(() => toast.error("Something went wrong"))
      .then((id) => {
        toast.success("Document created");
        router.push(`/documents/${id}`);
      });
  };

  const insertTable = ({ rows, cols }: { rows: number; cols: number }) => {
    editor?.chain().focus().insertTable({ rows, cols, withHeaderRow: false }).run();
  };

  const onDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  const onSaveJson = () => {
    if (!editor) return;

    const content = editor.getJSON();
    const blob = new Blob([JSON.stringify(content)], {
      type: "application/json",
    });
    onDownload(blob, `${data.title}.json`);
  };

  const onSaveHTML = () => {
    if (!editor) return;

    const content = editor.getHTML();
    const blob = new Blob([content], {
      type: "text/html",
    });
    onDownload(blob, `${data.title}.html`);
  };

  const onSaveText = () => {
    if (!editor) return;

    const content = editor.getText();
    const blob = new Blob([content], {
      type: "text/plain",
    });
    onDownload(blob, `${data.title}.txt`);
  };

  const onSaveMarkdown = async () => {
    if (!editor) return;

    const { exportToMarkdown, downloadFile } = await import("@/lib/export");
    const markdown = exportToMarkdown(editor);
    downloadFile(markdown, `${data.title}.md`, "text/markdown");
    toast.success("Document saved as Markdown");
  };

  const editorShortcuts: KeyboardShortcut[] = [
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
      key: "s",
      ctrl: true,
      action: onSaveHTML,
      description: "Save as HTML",
    },
    {
      key: "k",
      ctrl: true,
      action: onSaveMarkdown,
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
      action: onNewDocument,
      description: "New Document",
    },
  ];

  return (
    <nav className="flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <Link href="/">
          <Image src={"/logo.svg"} alt="logo" width={36} height={36} />
        </Link>
        <div className="flex flex-col">
          <DocumentInput title={data.title} id={data._id} />
          <div className="flex">
            <Menubar className="border-none bg-transparent shadow-none h-auto p-0">
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  File
                </MenubarTrigger>
                <MenubarContent className="print:hidden">
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <FileIcon className="size-4 mr-2" /> Save
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem onClick={onSaveJson}>
                        <FileJsonIcon className="size-4 mr-2" />
                        JSON
                      </MenubarItem>
                      <MenubarItem onClick={onSaveHTML}>
                        <GlobeIcon className="size-4 mr-2" />
                        HTML
                      </MenubarItem>
                      <MenubarItem onClick={() => window.print()}>
                        <BsFilePdf className="size-4 mr-2" />
                        PDF
                      </MenubarItem>
                      <MenubarItem onClick={onSaveText}>
                        <FileTextIcon className="size-4 mr-2" />
                        Text
                      </MenubarItem>
                      <MenubarItem onClick={onSaveMarkdown}>
                        <FileTextIcon className="size-4 mr-2" />
                        Markdown
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarItem onClick={onNewDocument}>
                    <FilePlusIcon className="mr-2 size-4" />
                    New Document
                  </MenubarItem>
                  <MenubarSeparator />
                  <RenameDialog documentId={data._id} initialTitle={data.title}>
                    <MenubarItem
                      onClick={(e) => e.stopPropagation()}
                      onSelect={(e) => e.preventDefault()}
                    >
                      <FilePenIcon className="mr-2 size-4" />
                      Rename
                    </MenubarItem>
                  </RenameDialog>
                  {/* <RemoveDialog documentId={data._id}>
                    <MenubarItem
                      onClick={(e) => e.stopPropagation()}
                      onSelect={(e) => e.preventDefault()}
                    >
                      <TrashIcon className="mr-2 size-4" />
                      Remove
                    </MenubarItem>
                  </RemoveDialog> */}
                  <MenubarSeparator />
                  <MenubarItem onClick={() => window.print()}>
                    <PrinterIcon className="mr-2 size-4" />
                    Print <MenubarShortcut>&#x2318; + P</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  Edit
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem onClick={() => editor?.chain().focus().undo().run()}>
                    <Undo2Icon className="mr-2 size-4" />
                    Undo <MenubarShortcut>&#x2318; + Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem onClick={() => editor?.chain().focus().redo().run()}>
                    <Redo2Icon className="mr-2 size-4" />
                    Redo <MenubarShortcut>&#x2318; + Y</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  Insert
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarSub>
                    <MenubarSubTrigger>Table</MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem onClick={() => insertTable({ rows: 1, cols: 1 })}>
                        1 x 1
                      </MenubarItem>
                      <MenubarItem onClick={() => insertTable({ rows: 2, cols: 2 })}>
                        2 x 2
                      </MenubarItem>
                      <MenubarItem onClick={() => insertTable({ rows: 4, cols: 4 })}>
                        4 x 4
                      </MenubarItem>
                      <MenubarItem onClick={() => insertTable({ rows: 4, cols: 6 })}>
                        4 x 6
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  Format
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <TextIcon className="size-4 mr-2" />
                      Text
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem onClick={() => editor?.chain().focus().toggleBold().run()}>
                        <BoldIcon className="size-4 mr-2" />
                        Bold
                      </MenubarItem>
                      <MenubarItem onClick={() => editor?.chain().focus().toggleItalic().run()}>
                        <ItalicIcon className="size-4 mr-2" />
                        Italic
                      </MenubarItem>
                      <MenubarItem onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                        <UnderlineIcon className="size-4 mr-2" />
                        Underline
                      </MenubarItem>
                      <MenubarItem onClick={() => editor?.chain().focus().toggleStrike().run()}>
                        <StrikethroughIcon className="size-4 mr-2" />
                        Strikethrough
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarItem onClick={() => editor?.chain().focus().unsetAllMarks().run()}>
                    <RemoveFormattingIcon className="size-4 mr-2" />
                    Clear formatting
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </div>
      <div className="flex gap-3 items-center pl-6">
        <Avatars />
        <DocumentSearch />
        <KeyboardShortcutsDialog shortcuts={editorShortcuts} />
        {canManageSharing && <ShareDialog documentId={data._id} />}
        <VersionHistory documentId={data._id} documentTitle={data.title} />
        <Inbox />
        <OrganizationSwitcher
          afterCreateOrganizationUrl="/"
          afterLeaveOrganizationUrl="/"
          afterSelectOrganizationUrl="/"
          afterSelectPersonalUrl="/"
        />
        <UserButton />
      </div>
    </nav>
  );
};
