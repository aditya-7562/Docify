"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "lucide-react";
import Link from "next/link";
import { logger } from "@/lib/errors";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  useEffect(() => {

    logger.error(error, {
      digest: error.digest,
      component: "ErrorBoundary",
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 px-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex justify-center">
          <div className="bg-rose-100 p-3 rounded-full">
            <AlertTriangleIcon className="size-10 text-rose-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Something went wrong</h2>
          <p className="text-gray-600">{error.message || "An unexpected error occurred"}</p>
          {error.digest && (
            <p className="text-sm text-gray-500">Error ID: {error.digest}</p>
          )}
          {isDevelopment && error.stack && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Show error details
              </summary>
              <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-64">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      </div>
      <div className="flex items-center gap-x-3">
        <Button onClick={reset} className="font-medium">
          Try again
        </Button>
        <Button asChild variant="ghost" className="font-medium">
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
