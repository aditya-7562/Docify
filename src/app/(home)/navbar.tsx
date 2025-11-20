"use client";

import Link from "next/link";
import Image from "next/image";
import { SearchInput } from "./search-input";
import { UserButton, useUser } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Building2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const { user } = useUser();
  const organization = user?.organizationMemberships?.[0]?.organization;

  return (
    <header className="h-14 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link href="/">
          <Image src={"/logo.svg"} alt="Docify" width={28} height={28} />
        </Link>
        <Link href="/">
        <span className="font-semibold text-lg dark:text-white">Docify</span>
        </Link>
      </div>

      <div className="flex-1 flex justify-center px-4">
        <SearchInput />
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {organization && (
          <Link href="/organization">
            <Button variant="ghost" size="sm" className="gap-2">
              <Building2Icon className="w-4 h-4" />
              <span className="hidden sm:inline">Organization</span>
            </Button>
          </Link>
        )}
        <ThemeToggle />
        <UserButton />
      </div>
    </header>
  );
};
