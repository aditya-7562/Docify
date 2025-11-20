"use client";

import Link from "next/link";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="
        border-t border-gray-200 dark:border-gray-800
        bg-white dark:bg-gray-900
        relative
      "
    >

      <div className="absolute inset-x-0 top-0 h-px bg-gray-200/60 dark:bg-gray-800/60" />

      <div
        className="
          max-w-screen-xl mx-auto
          px-4 md:px-6
          py-3
          flex items-center justify-between
          text-xs md:text-sm
          text-gray-600 dark:text-gray-400
        "
      >

        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            © {currentYear} Docify
          </span>

          <span className="hidden md:inline text-gray-400">·</span>

          <span className="hidden md:inline">
            All rights reserved
          </span>
        </div>


        <div className="flex items-center gap-3">
          <FooterLink label="Privacy" href="/privacy" />
          <FooterSeparator />
          <FooterLink label="Terms" href="/terms" />
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ label, href }: { label: string; href: string }) => (
  <Link
    href={href}
    className="
      hover:text-gray-900 dark:hover:text-white
      transition-colors
      px-1 py-0.5
      rounded-sm
    "
  >
    {label}
  </Link>
);

const FooterSeparator = () => (
  <span className="text-gray-400 dark:text-gray-600">·</span>
);
