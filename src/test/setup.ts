
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";


afterEach(() => {
  cleanup();
});


vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));


process.env.NEXT_PUBLIC_CONVEX_URL = "https://test.convex.cloud";
process.env.LIVEBLOCKS_SECRET_KEY = "test-secret-key";

