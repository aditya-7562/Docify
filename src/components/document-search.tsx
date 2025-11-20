"use client";

import { useState, useMemo } from "react";
import { useEditorStore } from "@/store/use-editor-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface SearchResult {
  text: string;
  position: number;
}

export function DocumentSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const { editor } = useEditorStore();

  const searchResults = useMemo<SearchResult[]>(() => {
    if (!editor || !searchQuery.trim()) {
      return [];
    }

    const text = editor.getText();
    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];
    let position = 0;

    while (true) {
      const index = text.toLowerCase().indexOf(query, position);
      if (index === -1) break;
      results.push({
        text: text.substring(index, index + query.length),
        position: index,
      });
      position = index + 1;
    }

    return results;
  }, [editor, searchQuery]);

  const highlightText = (text: string, query: string): string => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
  };

  const goToResult = (index: number) => {
    if (!editor || searchResults.length === 0) return;

    const result = searchResults[index];
    const { from } = editor.state.doc.resolve(result.position);
    editor.commands.setTextSelection({ from, to: from + searchQuery.length });
    editor.commands.scrollIntoView();
    setCurrentResultIndex(index);
  };

  const handleNext = () => {
    if (searchResults.length === 0) return;
    const nextIndex = (currentResultIndex + 1) % searchResults.length;
    goToResult(nextIndex);
  };

  const handlePrevious = () => {
    if (searchResults.length === 0) return;
    const prevIndex =
      currentResultIndex === 0 ? searchResults.length - 1 : currentResultIndex - 1;
    goToResult(prevIndex);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <SearchIcon className="size-4" />
          Search
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search in Document</DialogTitle>
          <DialogDescription>
            Find text within the current document
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentResultIndex(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.shiftKey) {
                  e.preventDefault();
                  handlePrevious();
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  handleNext();
                }
              }}
            />
            {searchResults.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {currentResultIndex + 1} of {searchResults.length}
                </span>
                <Button variant="outline" size="sm" onClick={handlePrevious}>
                  <ArrowUpIcon className="size-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleNext}>
                  <ArrowDownIcon className="size-4" />
                </Button>
              </div>
            )}
          </div>
          {searchQuery && searchResults.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No results found
            </p>
          )}
          {searchQuery && searchResults.length > 0 && (
            <div className="max-h-60 overflow-y-auto space-y-2">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => goToResult(index)}
                  className={`w-full text-left p-2 rounded border ${
                    index === currentResultIndex
                      ? "bg-blue-50 border-blue-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <p className="text-sm">
                    {result.position > 0 && "..."}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightText(
                          editor?.getText().substring(
                            Math.max(0, result.position - 20),
                            Math.min(
                              editor?.getText().length || 0,
                              result.position + searchQuery.length + 20
                            )
                          ) || "",
                          searchQuery
                        ),
                      }}
                    />
                    {result.position + searchQuery.length < (editor?.getText().length || 0) &&
                      "..."}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

