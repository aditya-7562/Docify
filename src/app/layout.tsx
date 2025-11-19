import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-tiptap/styles.css";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from "@/components/convex-client-provider";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Docify",
  description: "Docify is a real-time collaborative document editor built with Next.js, Convex, Clerk, and Liveblocks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <NuqsAdapter>
            <Toaster />
            {children}
          </NuqsAdapter>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
