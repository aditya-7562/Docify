"use client";

import { ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { FullscreenLoader } from "./fullscreen-loader";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth, SignIn } from "@clerk/nextjs";
import { ConvexReactClient, Authenticated, Unauthenticated, AuthLoading } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function SignInWrapper() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  

  const redirectUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <SignIn 
        routing="hash"
        fallbackRedirectUrl={redirectUrl}
        forceRedirectUrl={redirectUrl}
      />
    </div>
  );
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <Authenticated>{children}</Authenticated>
        <Unauthenticated>
          <SignInWrapper />
        </Unauthenticated>
        <AuthLoading>
          <FullscreenLoader label="Auth loading..." />
        </AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
