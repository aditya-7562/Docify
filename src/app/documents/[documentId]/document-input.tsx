"use client";

import { useRef, useState } from "react";

import { useMutation } from "convex/react";
import { useDebounce } from "@/hooks/use-debounce";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";

interface DocumentInputProps {
  title: string;
  id: Id<"documents">;
}

export const DocumentInput = ({ title, id }: DocumentInputProps) => {
  const [value, setValue] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const mutate = useMutation(api.documents.updateById);

  const debouncedUpdate = useDebounce((newValue: string) => {
    if (newValue === title) return;

    mutate({ id, title: newValue })
      .then(() => toast.success("Document updated"))
      .catch(() => toast.error("Sometimes went wrong"));
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate({ id, title: value })
      .then(() => {
        toast.success("Document updated");
        setIsEditing(false);
      })
      .catch(() => toast.error("Sometimes went wrong"));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedUpdate(newValue);
  };

  return (
    <>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="relative w-full min-w-0">
          <span className="invisible whitespace-pre px-1.5 text-xl font-medium">{value || " "}</span>
          <input
            ref={inputRef}
            value={value}
            onChange={onChange}
            onBlur={() => setIsEditing(false)}
            className="absolute inset-0 text-xl font-medium text-black dark:text-white px-1.5 bg-transparent focus:outline-none w-full"
          />
        </form>
      ) : (
        <input
          onClick={() => {
            setIsEditing(true);
            setTimeout(() => {
              inputRef.current?.focus();
            }, 0);
          }}
          readOnly
          value={title}
          className="text-xl font-medium bg-transparent focus:outline-none cursor-pointer px-1.5 -ml-1.5 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 rounded text-black dark:text-white w-full min-w-0 truncate"
        />
      )}
    </>
  );
};
