/**
 * Export utilities for converting editor content to various formats
 */

import { Editor } from "@tiptap/react";

/**
 * Convert HTML to Markdown (simplified version)
 */
function htmlToMarkdown(html: string): string {
  let markdown = html;

  // Remove HTML tags and convert to markdown
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n");
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n");
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n");
  markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n\n");
  markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, "##### $1\n\n");
  markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, "###### $1\n\n");
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**");
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**");
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*");
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*");
  markdown = markdown.replace(/<u[^>]*>(.*?)<\/u>/gi, "$1");
  markdown = markdown.replace(/<s[^>]*>(.*?)<\/s>/gi, "~~$1~~");
  markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n");
  markdown = markdown.replace(/<br[^>]*>/gi, "\n");
  markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n");
  markdown = markdown.replace(/<ul[^>]*>/gi, "");
  markdown = markdown.replace(/<\/ul>/gi, "\n");
  markdown = markdown.replace(/<ol[^>]*>/gi, "");
  markdown = markdown.replace(/<\/ol>/gi, "\n");
  markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, "> $1\n");
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");
  markdown = markdown.replace(/<pre[^>]*>(.*?)<\/pre>/gi, "```\n$1\n```");
  markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, "![$2]($1)");
  markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, "![]($1)");

  // Remove remaining HTML tags
  markdown = markdown.replace(/<[^>]+>/g, "");

  // Decode HTML entities
  markdown = markdown.replace(/&nbsp;/g, " ");
  markdown = markdown.replace(/&amp;/g, "&");
  markdown = markdown.replace(/&lt;/g, "<");
  markdown = markdown.replace(/&gt;/g, ">");
  markdown = markdown.replace(/&quot;/g, '"');
  markdown = markdown.replace(/&#39;/g, "'");

  // Clean up extra newlines
  markdown = markdown.replace(/\n{3,}/g, "\n\n");
  markdown = markdown.trim();

  return markdown;
}

/**
 * Export editor content to Markdown
 */
export function exportToMarkdown(editor: Editor): string {
  const html = editor.getHTML();
  return htmlToMarkdown(html);
}

/**
 * Export editor content to Plain Text
 */
export function exportToPlainText(editor: Editor): string {
  return editor.getText();
}

/**
 * Export editor content to HTML
 */
export function exportToHTML(editor: Editor): string {
  return editor.getHTML();
}

/**
 * Export editor content to JSON
 */
export function exportToJSON(editor: Editor): string {
  return JSON.stringify(editor.getJSON(), null, 2);
}

/**
 * Download content as a file
 */
export function downloadFile(content: string | Blob, filename: string, mimeType?: string): void {
  const blob = typeof content === "string" 
    ? new Blob([content], { type: mimeType || "text/plain" })
    : content;
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

