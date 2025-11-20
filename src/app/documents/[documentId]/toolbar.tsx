"use client";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import { useUserRole } from "./user-role-context";

// types
import { type ColorResult, SketchPicker } from "react-color";
import { type Level } from "@tiptap/extension-heading";

// icons
import {
  BoldIcon,
  ItalicIcon,
  LucideIcon,
  MessageSquarePlusIcon,
  Redo2Icon,
  UnderlineIcon,
  Undo2Icon,
  ChevronDownIcon,
  HighlighterIcon,
  Link2Icon,
  ImageIcon,
  UploadIcon,
  SearchIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  PlusIcon,
  ListCollapseIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const LineHeightButton = () => {
  const { editor } = useEditorStore();
  const { canEdit } = useUserRole();

  const lineHeights = [
    { label: "Default", value: "normal" },
    { label: "Single", value: "1" },
    { label: "1.15", value: "1.15" },
    { label: "1.5", value: "1.5" },
    { label: "Double", value: "2" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          disabled={!canEdit}
          className={cn(
            "h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm transition-all hover:bg-primary-light active:scale-95 px-1.5 overflow-hidden text-sm",
            !canEdit && "opacity-50 cursor-not-allowed hover:bg-transparent active:scale-100"
          )}
        >
          <ListCollapseIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {lineHeights.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => canEdit && editor?.chain().focus().setLineHeight(value).run()}
            disabled={!canEdit}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm transition-all hover:bg-primary-light active:scale-95",
              editor?.getAttributes("paragraph").lineHeight === value && "bg-primary-light",
              !canEdit && "opacity-50 cursor-not-allowed hover:bg-transparent active:scale-100"
            )}
          >
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FontSizeButton = () => {
  const { editor } = useEditorStore();
  const { canEdit } = useUserRole();

  const currentFontSize = editor?.getAttributes("textStyle").fontSize
    ? editor?.getAttributes("textStyle").fontSize.replace("px", "")
    : "16";

  const [fontSize, setFontSize] = useState(currentFontSize);
  const [inputValue, setInputValue] = useState(fontSize);
  const [isEditing, setIsEditing] = useState(false);

  const updateFontSize = (newSize: string) => {
    const size = parseInt(newSize);
    if (!isNaN(size) && size > 0) {
      editor?.chain().focus().setFontSize(`${size}px`).run();
      setFontSize(newSize);
      setInputValue(newSize);
      setIsEditing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    updateFontSize(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateFontSize(inputValue);
      editor?.commands.focus();
    }
  };

  const increment = () => {
    const newSize = parseInt(fontSize) + 1;
    updateFontSize(newSize.toString());
  };

  const decrement = () => {
    const newSize = parseInt(fontSize) - 1;
    if (newSize > 0) {
      updateFontSize(newSize.toString());
    }
  };

  return (
    <div className="flex items-center gap-x-0.5">
      <button
        onClick={decrement}
        disabled={!canEdit}
        className={cn(
          "h-7 w-7 shrink-0 flex items-center justify-center rounded-sm transition-all hover:bg-primary-light active:scale-95",
          !canEdit && "opacity-50 cursor-not-allowed hover:bg-transparent active:scale-100"
        )}
      >
        <MinusIcon className="size-4" />
      </button>
      {isEditing ? (
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          disabled={!canEdit}
          className={cn(
            "h-7 w-10 text-sm text-center border border-neutral-400 rounded-sm bg-transparent focus:outline-none focus:ring-0",
            !canEdit && "opacity-50 cursor-not-allowed"
          )}
        />
      ) : (
        <button
          onClick={() => {
            if (canEdit) {
              setIsEditing(true);
              setFontSize(currentFontSize);
            }
          }}
          disabled={!canEdit}
          className={cn(
            "h-7 w-10 text-sm text-center border border-neutral-400 rounded-sm bg-transparent",
            canEdit ? "cursor-text" : "opacity-50 cursor-not-allowed"
          )}
        >
          {currentFontSize}
        </button>
      )}
      <button
        onClick={increment}
        disabled={!canEdit}
        className={cn(
          "h-7 w-7 shrink-0 flex items-center justify-center rounded-sm transition-all hover:bg-primary-light active:scale-95",
          !canEdit && "opacity-50 cursor-not-allowed hover:bg-transparent active:scale-100"
        )}
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
};

const ListButton = () => {
  const { editor } = useEditorStore();
  const { canEdit } = useUserRole();

  const lists = [
    {
      label: "Bullet List",
      icon: ListIcon,
      isActive: () => editor?.isActive("bulletList"),
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Ordered List",
      icon: ListOrderedIcon,
      isActive: () => editor?.isActive("orderedList"),
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          disabled={!canEdit}
          className={cn(
            "h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm transition-all hover:bg-primary-light active:scale-95 px-1.5 overflow-hidden text-sm",
            !canEdit && "opacity-50 cursor-not-allowed hover:bg-transparent active:scale-100"
          )}
        >
          <ListIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {lists.map(({ label, icon: Icon, onClick, isActive }) => (
          <button
            key={label}
            onClick={() => canEdit && onClick()}
            disabled={!canEdit}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm transition-all hover:bg-primary-light active:scale-95",
              isActive() && "bg-primary-light",
              !canEdit && "opacity-50 cursor-not-allowed hover:bg-transparent active:scale-100"
            )}
          >
            <Icon className="size-4" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AlignButton = () => {
  const { editor } = useEditorStore();
  const { canEdit } = useUserRole();

  const alignments = [
    {
      label: "Align Left",
      value: "left",
      icon: AlignLeftIcon,
    },
    {
      label: "Align Center",
      value: "center",
      icon: AlignCenterIcon,
    },
    {
      label: "Align Right",
      value: "right",
      icon: AlignRightIcon,
    },
    {
      label: "Align Justify",
      value: "justify",
      icon: AlignJustifyIcon,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          disabled={!canEdit}
          className={cn(
            "h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm transition-all hover:bg-primary-light active:scale-95 px-1.5 overflow-hidden text-sm",
            !canEdit && "opacity-50 cursor-not-allowed hover:bg-transparent active:scale-100"
          )}
        >
          <AlignLeftIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {alignments.map(({ label, value, icon: Icon }) => (
          <button
            key={value}
            onClick={() => canEdit && editor?.chain().focus().setTextAlign(value).run()}
            disabled={!canEdit}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm transition-all hover:bg-primary-light active:scale-95",
              editor?.isActive({ textAlign: value }) && "bg-primary-light",
              !canEdit && "opacity-50 cursor-not-allowed hover:bg-transparent active:scale-100"
            )}
          >
            <Icon className="size-4" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ImageButton = () => {
  const { editor } = useEditorStore();
  const { canEdit } = useUserRole();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const onChange = (src: string) => {
    editor?.chain().focus().setImage({ src }).run();
  };

  const onUpload = () => {
    if (!canEdit) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];

      if (file) {
        const imageUrl = URL.createObjectURL(file);
        onChange(imageUrl);
      }
    };

    input.click();
  };

  const handleImageUrlSubmit = () => {
    if (!canEdit) return;
    if (imageUrl) {
      onChange(imageUrl);
      setImageUrl("");
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            disabled={!canEdit}
            className={cn(
              "h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm transition-all hover:bg-primary-light active:scale-95 px-1.5 overflow-hidden text-sm",
              !canEdit && "opacity-50 cursor-not-allowed hover:bg-transparent active:scale-100"
            )}
          >
            <ImageIcon className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2.5 flex flex-col gap-x-2">
          <DropdownMenuItem onClick={onUpload} className="cursor-pointer">
            <UploadIcon className="size-4 mr-2" />
            Upload
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => canEdit && setIsDialogOpen(true)}
            className="cursor-pointer"
          >
            <SearchIcon className="size-4 mr-2" />
            Paste image url
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen && canEdit} onOpenChange={(open) => canEdit && setIsDialogOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert image URL</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Insert image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleImageUrlSubmit();
              }
            }}
          />
          <DialogFooter>
            <Button onClick={handleImageUrlSubmit}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const LinkButton = () => {
  const { editor } = useEditorStore();
  const [value, setValue] = useState("");

  const onChange = (href: string) => {
    editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setValue("");
  };

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) {
          setValue(editor?.getAttributes("link").href || "");
        }
      }}
    >
      <DropdownMenuTrigger onClick={() => setValue(editor?.getAttributes("link").href)} asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm transition-all hover:bg-primary-light active:scale-95 px-1.5 overflow-hidden text-sm">
          <Link2Icon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
        <Input
          placeholder="https://www.example.com"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button onClick={() => onChange(value)}>Apply</Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const HighlightColorButton = () => {
  const { editor } = useEditorStore();

  const value = editor?.getAttributes("highlight").color || "#FFFFFFFF";

  const onChange = (color: ColorResult) => {
    editor?.chain().focus().setHighlight({ color: color.hex }).run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm transition-all hover:bg-primary-light active:scale-95 px-1.5 overflow-hidden text-sm">
          <HighlighterIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0 border-0">
        <SketchPicker color={value} onChange={onChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const TextColorButton = () => {
  const { editor } = useEditorStore();

  const value = editor?.getAttributes("textStyle").color || "#000000";

  const onChange = (color: ColorResult) => {
    editor?.chain().focus().setColor(color.hex).run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm transition-all hover:bg-primary-light active:scale-95 px-1.5 overflow-hidden text-sm">
          <span className="text-xs">A</span>
          <div className="h-0.5 w-full" style={{ backgroundColor: value }}></div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0 border-0">
        <SketchPicker color={value} onChange={onChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const HeadingLevelButton = () => {
  const { editor } = useEditorStore();

  const headings = [
    { label: "Normal text", value: 0, fontSize: "16px" },
    { label: "Heding 1", value: 1, fontSize: "32px" },
    { label: "Heding 2", value: 2, fontSize: "24px" },
    { label: "Heding 3", value: 3, fontSize: "20px" },
    { label: "Heding 4", value: 4, fontSize: "18px" },
    { label: "Heding 5", value: 5, fontSize: "16px" },
  ];

  const getCurrentHeading = () => {
    for (let level = 1; level <= 5; level++) {
      if (editor?.isActive("heading", { level })) {
        return `Heading ${level}`;
      }
    }

    return "Normal text";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm transition-all hover:bg-primary-light active:scale-95 px-1.5 overflow-hidden text-sm">
          <span className="truncate">{getCurrentHeading()}</span>
          <ChevronDownIcon className="ml-2 size-4 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {headings.map(({ label, value, fontSize }) => (
          <button
            key={value}
            style={{ fontSize }}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 font-[value] rounded-sm transition-all hover:bg-primary-light active:scale-95",
              (value === 0 && !editor?.isActive("heading")) ||
                (editor?.isActive("heading", { level: value as Level }) && "bg-primary-light")
            )}
            onClick={() => {
              if (value === 0) {
                editor?.chain().focus().setParagraph().run();
              } else {
                editor
                  ?.chain()
                  .focus()
                  .toggleHeading({ level: value as Level })
                  .run();
              }
            }}
          >
            {label}
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const FontFamilyButton = () => {
  const { editor } = useEditorStore();

  const fonts = [
    { label: "Arial", value: "Arial" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Courier New", value: "Courier New" },
    { label: "Georgia", value: "Georgia" },
    { label: "Verdana", value: "Verdana" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 w-[120px] shrink-0 flex items-center justify-between rounded-sm transition-all hover:bg-primary-light active:scale-95 px-1.5 overflow-hidden text-sm">
          <span className="truncate">
            {editor?.getAttributes("textStyle").fontFamily || "Arial"}
          </span>
          <ChevronDownIcon className="ml-2 size-4 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {fonts.map(({ label, value }) => (
          <button
            onClick={() => editor?.chain().focus().setFontFamily(value).run()}
            key={value}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 font-[value] rounded-sm transition-all hover:bg-primary-light active:scale-95",
              editor?.getAttributes("textStyle").fontFamily === value && "bg-primary-light"
            )}
            style={{ fontFamily: value }}
          >
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface ToolbarButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  icon: LucideIcon;
  disabled?: boolean;
}

const ToolbarButton = ({ onClick, isActive, icon: Icon, disabled }: ToolbarButtonProps) => {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm transition-all hover:bg-primary-light active:scale-95",
        isActive && "bg-primary-light",
        disabled && "opacity-50 cursor-not-allowed hover:bg-transparent active:scale-100"
      )}
    >
      <Icon className="size-4" />
    </button>
  );
};

// Toolbar Groups
const UndoRedoGroup = () => {
  const { editor } = useEditorStore();
  const { canEdit } = useUserRole();

  return (
    <>
      <ToolbarButton
        icon={Undo2Icon}
        onClick={() => editor?.chain().focus().undo().run()}
        disabled={!canEdit}
      />
      <ToolbarButton
        icon={Redo2Icon}
        onClick={() => editor?.chain().focus().redo().run()}
        disabled={!canEdit}
      />
    </>
  );
};

const FontGroup = () => {
  return (
    <>
      <FontFamilyButton />
      <HeadingLevelButton />
      <FontSizeButton />
    </>
  );
};

const FormattingGroup = () => {
  const { editor } = useEditorStore();
  const { canEdit } = useUserRole();

  return (
    <>
      <ToolbarButton
        icon={BoldIcon}
        isActive={editor?.isActive("bold")}
        onClick={() => editor?.chain().focus().toggleBold().run()}
        disabled={!canEdit}
      />
      <ToolbarButton
        icon={ItalicIcon}
        isActive={editor?.isActive("italic")}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        disabled={!canEdit}
      />
      <ToolbarButton
        icon={UnderlineIcon}
        isActive={editor?.isActive("underline")}
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
        disabled={!canEdit}
      />
      <TextColorButton />
      <HighlightColorButton />
    </>
  );
};

const InsertGroup = () => {
  const { editor } = useEditorStore();
  const { canComment } = useUserRole();

  return (
    <>
      <ToolbarButton
        icon={MessageSquarePlusIcon}
        onClick={() => editor?.chain().focus().addPendingComment().run()}
        isActive={editor?.isActive("liveblocksCommentMark")}
        disabled={!canComment}
      />
      <LinkButton />
      <ImageButton />
    </>
  );
};

const AlignmentGroup = () => {
  return (
    <>
      <AlignButton />
      <LineHeightButton />
      <ListButton />
    </>
  );
};

export const Toolbar = () => {
  return (
    <div className="sticky top-16 z-20 flex justify-center px-4 py-3 print:hidden">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-xl border dark:border-gray-700 shadow-md px-4 py-2 w-fit flex gap-2 items-center overflow-x-auto">
        <UndoRedoGroup />
        <Separator orientation="vertical" className="h-6 bg-neutral-300 dark:bg-gray-600" />
        <FontGroup />
        <Separator orientation="vertical" className="h-6 bg-neutral-300 dark:bg-gray-600" />
        <FormattingGroup />
        <Separator orientation="vertical" className="h-6 bg-neutral-300 dark:bg-gray-600" />
        <InsertGroup />
        <Separator orientation="vertical" className="h-6 bg-neutral-300 dark:bg-gray-600" />
        <AlignmentGroup />
      </div>
    </div>
  );
};
