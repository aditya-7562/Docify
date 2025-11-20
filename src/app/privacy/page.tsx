"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/app/(home)/navbar";
import { ChevronRight, Dot, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [activeSection, setActiveSection] = useState<string>("");
  const [isMobileTOCOpen, setIsMobileTOCOpen] = useState(false);

  const sections = [
    { id: "intro", title: "Introduction" },
    { id: "what-we-collect", title: "What We Collect" },
    { id: "how-we-use", title: "How We Use Data" },
    { id: "sharing", title: "Information Sharing" },
    { id: "security", title: "Security Measures" },
    { id: "your-rights", title: "Your Rights" },
    { id: "retention", title: "Data Retention" },
    { id: "children", title: "Children's Privacy" },
    { id: "changes", title: "Policy Changes" },
    { id: "contact", title: "Contact Us" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setIsMobileTOCOpen(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <main className="mt-14 flex-1">
        {/* Hero Section */}
        <HeroPrivacyHeader currentDate={currentDate} />

        {/* Subtle gradient border */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
            {/* Table of Contents Sidebar */}
            <PrivacySidebarTOC
              sections={sections}
              activeSection={activeSection}
              scrollToSection={scrollToSection}
              isMobileTOCOpen={isMobileTOCOpen}
              setIsMobileTOCOpen={setIsMobileTOCOpen}
            />

            {/* Content */}
            <div className="flex-1 lg:max-w-[800px]">
              <PrivacyContent />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      
    </div>
  );
}

// Hero Header Component
function HeroPrivacyHeader({ currentDate }: { currentDate: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex items-center gap-3 mb-6 transition-opacity duration-500">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Image src={"/logo.svg"} alt="Docify" width={32} height={32} />
            <span className="font-semibold text-xl dark:text-white">
              Docify
            </span>
          </Link>
          <span className="text-gray-400 dark:text-gray-600">/</span>
          <span className="text-gray-600 dark:text-gray-400">Privacy Policy</span>
        </div>

        <div className="space-y-4 transition-opacity duration-700">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
            We respect your privacy and are committed to protecting your personal
            information. This policy explains how we collect, use, and safeguard
            your data.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
              Last updated: {currentDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Table of Contents Sidebar
function PrivacySidebarTOC({
  sections,
  activeSection,
  scrollToSection,
  isMobileTOCOpen,
  setIsMobileTOCOpen,
}: {
  sections: { id: string; title: string }[];
  activeSection: string;
  scrollToSection: (id: string) => void;
  isMobileTOCOpen: boolean;
  setIsMobileTOCOpen: (open: boolean) => void;
}) {
  return (
    <>
      {/* Mobile TOC Button */}
      <div className="lg:hidden mb-6">
        <Button
          variant="outline"
          onClick={() => setIsMobileTOCOpen(!isMobileTOCOpen)}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <Menu className="w-4 h-4" />
            Table of Contents
          </span>
          {isMobileTOCOpen ? (
            <X className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24">
          <nav className="space-y-1">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-3">
              Contents
            </div>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`
                  w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
                  ${
                    activeSection === section.id
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium border-l-2 border-blue-600 dark:border-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                  }
                `}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile TOC Dropdown */}
      {isMobileTOCOpen && (
        <div className="lg:hidden mb-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 p-4 transition-all duration-200">
          <nav className="space-y-1">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-3">
              Contents
            </div>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`
                  w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
                  ${
                    activeSection === section.id
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

// Main Content Component
function PrivacyContent() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      {/* Introduction */}
      <section
        id="intro"
        className="mb-16 scroll-mt-24"
      >
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p className="text-lg">
            Docify ("we", "our", "us") provides a collaborative document editing
            platform.
          </p>
          <p>
            This Privacy Policy explains how we collect, use, store, and protect
            your information when you use Docify.
          </p>
          <p>
            By accessing Docify, you agree to this Privacy Policy.
          </p>
        </div>
      </section>

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-12" />

      {/* What We Collect */}
      <section
        id="what-we-collect"
        className="mb-16 scroll-mt-24"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
          What We Collect
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Account Information
            </h3>
            <p className="mb-3 text-gray-700 dark:text-gray-300">
              When you create or access an account using authentication providers
              (such as Clerk), we collect:
            </p>
            <ul className="space-y-2.5 list-none">
              <ListItem>Name</ListItem>
              <ListItem>Email address</ListItem>
              <ListItem>Profile picture</ListItem>
              <ListItem>Organization information (if applicable)</ListItem>
              <ListItem>Authentication identifiers</ListItem>
            </ul>
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              We do not store passwords.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Usage Data
            </h3>
            <p className="mb-3 text-gray-700 dark:text-gray-300">
              We collect basic usage data, such as:
            </p>
            <ul className="space-y-2.5 list-none">
              <ListItem>Pages visited</ListItem>
              <ListItem>Features used</ListItem>
              <ListItem>Timestamps</ListItem>
              <ListItem>Device/browser information</ListItem>
              <ListItem>IP address (for security & fraud prevention)</ListItem>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Document & Collaboration Data
            </h3>
            <p className="mb-3 text-gray-700 dark:text-gray-300">
              When you create or edit documents, we process:
            </p>
            <ul className="space-y-2.5 list-none">
              <ListItem>Document titles</ListItem>
              <ListItem>Document content</ListItem>
              <ListItem>Comments, edits, and revision history</ListItem>
              <ListItem>
                Collaboration indicators (cursor positions, presence, status)
              </ListItem>
            </ul>
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              Your data is stored securely using Convex and synced via Liveblocks.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              We do not sell or share document contents with third parties.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Cookies & Local Storage
            </h3>
            <p className="mb-3 text-gray-700 dark:text-gray-300">
              We use cookies/local storage for:
            </p>
            <ul className="space-y-2.5 list-none">
              <ListItem>Authentication</ListItem>
              <ListItem>Session management</ListItem>
              <ListItem>Performance & analytics</ListItem>
            </ul>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-12" />

      {/* How We Use Data */}
      <section
        id="how-we-use"
        className="mb-16 scroll-mt-24"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
          How We Use Data
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          We use your data to:
        </p>
        <ul className="space-y-2.5 list-none mb-6">
          <ListItem>Provide and maintain the Docify platform</ListItem>
          <ListItem>Enable real-time collaboration</ListItem>
          <ListItem>Sync and store documents</ListItem>
          <ListItem>Prevent unauthorized access</ListItem>
          <ListItem>Improve reliability, performance, and usability</ListItem>
          <ListItem>Communicate service updates or security notices</ListItem>
        </ul>
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          We never sell your data to advertisers.
        </p>
      </section>

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-12" />

      {/* Information Sharing */}
      <section
        id="sharing"
        className="mb-16 scroll-mt-24"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
          Information Sharing
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          We share data only with trusted service providers necessary to operate
          Docify, such as:
        </p>
        <ul className="space-y-2.5 list-none mb-6">
          <ListItem>Authentication provider (Clerk)</ListItem>
          <ListItem>Database & storage provider (Convex)</ListItem>
          <ListItem>Real-time sync service (Liveblocks)</ListItem>
          <ListItem>Hosting providers</ListItem>
        </ul>
        <p className="mb-3 text-gray-700 dark:text-gray-300">
          These processors are contractually required to protect your data.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          We do not share your document contents with third parties for marketing
          or analytics.
        </p>
      </section>

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-12" />

      {/* Security Measures */}
      <section
        id="security"
        className="mb-16 scroll-mt-24"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
          Security Measures
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          We use industry-standard security measures, including:
        </p>
        <ul className="space-y-2.5 list-none mb-6">
          <ListItem>HTTPS encryption</ListItem>
          <ListItem>Secure authentication</ListItem>
          <ListItem>Encrypted storage where applicable</ListItem>
          <ListItem>Access controls</ListItem>
          <ListItem>Audit logging</ListItem>
        </ul>
        <p className="text-gray-700 dark:text-gray-300">
          No system is perfectly secure, but we work continuously to protect your
          information.
        </p>
      </section>

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-12" />

      {/* Your Rights */}
      <section
        id="your-rights"
        className="mb-16 scroll-mt-24"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
          Your Rights
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Depending on your region, you may have the right to:
        </p>
        <ul className="space-y-2.5 list-none mb-6">
          <ListItem>Access your data</ListItem>
          <ListItem>Correct inaccurate data</ListItem>
          <ListItem>Request deletion</ListItem>
          <ListItem>Export your data</ListItem>
          <ListItem>Withdraw consent</ListItem>
          <ListItem>Object to certain processing</ListItem>
        </ul>
        <p className="text-gray-700 dark:text-gray-300">
          You can request these by contacting us at{" "}
          <a
            href="mailto:support@docify.app?subject=Privacy Inquiry"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline font-medium transition-colors"
          >
            support@docify.app
          </a>
          .
        </p>
      </section>

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-12" />

      {/* Data Retention */}
      <section
        id="retention"
        className="mb-16 scroll-mt-24"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
          Data Retention
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          We retain data as long as your account is active.
        </p>
        <p className="mb-3 text-gray-700 dark:text-gray-300">
          Upon account deletion:
        </p>
        <ul className="space-y-2.5 list-none">
          <ListItem>Documents and related data are deleted</ListItem>
          <ListItem>
            Backups may persist temporarily for security and disaster recovery
          </ListItem>
        </ul>
      </section>

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-12" />

      {/* Children's Privacy */}
      <section
        id="children"
        className="mb-16 scroll-mt-24"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
          Children's Privacy
        </h2>
        <p className="mb-3 text-gray-700 dark:text-gray-300">
          Docify is not intended for users under 13.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          We do not knowingly collect information from children.
        </p>
      </section>

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-12" />

      {/* Policy Changes */}
      <section
        id="changes"
        className="mb-16 scroll-mt-24"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
          Policy Changes
        </h2>
        <p className="mb-3 text-gray-700 dark:text-gray-300">
          We may update this Privacy Policy periodically.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          If changes are significant, we will notify you.
        </p>
      </section>

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-12" />

      {/* Contact Us */}
      <section
        id="contact"
        className="mb-16 scroll-mt-24"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
          Contact Us
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          For privacy questions:
        </p>
        <div className="space-y-2 text-gray-700 dark:text-gray-300">
          <p>
            Email:{" "}
            <a
              href="mailto:support@docify.app?subject=Privacy Inquiry"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline font-medium transition-colors"
            >
              support@docify.app
            </a>
          </p>
          <p>Subject: Privacy Inquiry</p>
        </div>
      </section>
    </article>
  );
}

// Custom List Item Component with Icon
function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
      <Dot className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
      <span className="flex-1">{children}</span>
    </li>
  );
}
