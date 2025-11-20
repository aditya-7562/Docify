"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/app/(home)/navbar";
import { ChevronRight, Dot, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [activeSection, setActiveSection] = useState<string>("");
  const [isMobileTOCOpen, setIsMobileTOCOpen] = useState(false);

  const sections = [
    { id: "intro", title: "Introduction" },
    { id: "using-docify", title: "Using Docify" },
    { id: "your-content", title: "Your Content" },
    { id: "collaboration", title: "Collaboration Features" },
    { id: "acceptable-use", title: "Acceptable Use" },
    { id: "availability", title: "Service Availability" },
    { id: "liability", title: "Limitations of Liability" },
    { id: "termination", title: "Account Termination" },
    { id: "law", title: "Governing Law" },
    { id: "changes", title: "Changes to Terms" },
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
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <main className="mt-14 flex-1">
        <HeroTermsHeader currentDate={currentDate} />

        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
            <TermsSidebarTOC
              sections={sections}
              activeSection={activeSection}
              scrollToSection={scrollToSection}
              isMobileTOCOpen={isMobileTOCOpen}
              setIsMobileTOCOpen={setIsMobileTOCOpen}
            />

            <div className="flex-1 lg:max-w-[800px]">
              <TermsContent />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function HeroTermsHeader({ currentDate }: { currentDate: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80">
            <Image src={"/logo.svg"} alt="Docify" width={32} height={32} />
            <span className="font-semibold text-xl dark:text-white">Docify</span>
          </Link>
          <span className="text-gray-400 dark:text-gray-600">/</span>
          <span className="text-gray-600 dark:text-gray-400">Terms of Service</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
          Terms of Service
        </h1>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mt-4">
          Please read these terms carefully before using Docify.
        </p>

        <div className="flex items-center gap-2 pt-2">
          <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
            Last updated: {currentDate}
          </span>
        </div>
      </div>
    </div>
  );
}

function TermsSidebarTOC({
  sections,
  activeSection,
  scrollToSection,
  isMobileTOCOpen,
  setIsMobileTOCOpen,
}: any) {
  return (
    <>
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
          {isMobileTOCOpen ? <X className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>

      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24">
          <nav className="space-y-1">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-3">
              Contents
            </div>
            {sections.map((section: any) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
                  ${
                    activeSection === section.id
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium border-l-2 border-blue-600 dark:border-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {isMobileTOCOpen && (
        <div className="lg:hidden mb-6 border border-gray-200 dark:border-gray-800 rounded-lg p-4 transition-all duration-200">
          <nav className="space-y-1">
            {sections.map((section: any) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
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

function TermsContent() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">

      {/* INTRO */}
      <section id="intro" className="mb-16 scroll-mt-24">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          These Terms govern your access to and use of Docify ("we", "our", "us").
        </p>
        <p className="text-gray-700 dark:text-gray-300 mt-3">
          By using Docify, you agree to these Terms.
        </p>
      </section>

      <Divider />

      {/* USING DOCIFY */}
      <section id="using-docify" className="mb-16 scroll-mt-24">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Using Docify</h2>

        <p className="mb-4 text-gray-700 dark:text-gray-300">You must:</p>

        <ul className="space-y-2.5 list-none">
          <ListItem>Be at least 13 years old</ListItem>
          <ListItem>Provide accurate account information</ListItem>
          <ListItem>Use the platform lawfully</ListItem>
          <ListItem>Not attempt to disrupt, exploit, or abuse the service</ListItem>
        </ul>

        <p className="mt-4 text-gray-700 dark:text-gray-300">
          We may suspend or terminate accounts that violate these terms.
        </p>
      </section>

      <Divider />

      {/* YOUR CONTENT */}
      <section id="your-content" className="mb-16 scroll-mt-24">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Your Content</h2>

        <p className="mb-4 text-gray-700 dark:text-gray-300">
          You own all documents and content you create on Docify.
        </p>

        <p className="mb-3 text-gray-700 dark:text-gray-300">
          By using Docify, you grant us a limited license to:
        </p>

        <ul className="space-y-2.5 list-none">
          <ListItem>Store your content</ListItem>
          <ListItem>Process it to provide collaboration features</ListItem>
          <ListItem>Display it to you and collaborators you authorize</ListItem>
        </ul>

        <p className="mt-4 text-gray-700 dark:text-gray-300">
          We do not claim ownership of your content.
        </p>
      </section>

      <Divider />

      {/* COLLABORATION */}
      <section id="collaboration" className="mb-16 scroll-mt-24">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Collaboration Features
        </h2>

        <p className="mb-4 text-gray-700 dark:text-gray-300">
          If you share a document or invite others, you are responsible for:
        </p>

        <ul className="space-y-2.5 list-none">
          <ListItem>Choosing appropriate permissions</ListItem>
          <ListItem>Understanding collaborators may view or edit content</ListItem>
          <ListItem>Revoking access when necessary</ListItem>
        </ul>

        <p className="mt-4 text-gray-700 dark:text-gray-300">
          We are not responsible for actions taken by collaborators you authorize.
        </p>
      </section>

      <Divider />

      {/* ACCEPTABLE USE */}
      <section id="acceptable-use" className="mb-16 scroll-mt-24">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Acceptable Use</h2>

        <p className="mb-4 text-gray-700 dark:text-gray-300">You agree not to:</p>

        <ul className="space-y-2.5 list-none">
          <ListItem>Upload illegal, harmful, or abusive content</ListItem>
          <ListItem>Reverse engineer or exploit Docify</ListItem>
          <ListItem>Interfere with servers, systems, or other users</ListItem>
          <ListItem>Violate intellectual property or copyright laws</ListItem>
        </ul>

        <p className="mt-4 text-gray-700 dark:text-gray-300">
          We may remove content that violates these rules.
        </p>
      </section>

      <Divider />

      {/* AVAILABILITY */}
      <section id="availability" className="mb-16 scroll-mt-24">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Service Availability
        </h2>

        <p className="mb-4 text-gray-700 dark:text-gray-300">Docify may experience:</p>

        <ul className="space-y-2.5 list-none">
          <ListItem>Maintenance periods</ListItem>
          <ListItem>Unexpected downtime</ListItem>
          <ListItem>Feature updates or changes</ListItem>
        </ul>

        <p className="mt-4 text-gray-700 dark:text-gray-300">
          We do not guarantee uninterrupted access.
        </p>
      </section>

      <Divider />

      {/* LIABILITY */}
      <section id="liability" className="mb-16 scroll-mt-24">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Limitations of Liability
        </h2>

        <p className="mb-4 text-gray-700 dark:text-gray-300">
          To the fullest extent permitted by law:
        </p>

        <ul className="space-y-2.5 list-none">
          <ListItem>Docify is provided “as is” without warranties</ListItem>
          <ListItem>We are not liable for data loss, downtime, or unauthorized access</ListItem>
          <ListItem>Your use of the service is at your own risk</ListItem>
        </ul>
      </section>

      <Divider />

      {/* TERMINATION */}
      <section id="termination" className="mb-16 scroll-mt-24">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Account Termination
        </h2>

        <p className="mb-4 text-gray-700 dark:text-gray-300">
          We may suspend or terminate accounts that:
        </p>

        <ul className="space-y-2.5 list-none">
          <ListItem>Violate these Terms</ListItem>
          <ListItem>Abuse collaboration features</ListItem>
          <ListItem>Engage in harmful or fraudulent activities</ListItem>
        </ul>
      </section>

      <Divider />

      {/* LAW */}
      <section id="law" className="mb-16 scroll-mt-24">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Governing Law
        </h2>

        <p className="text-gray-700 dark:text-gray-300">
          These Terms are governed by the laws of your jurisdiction unless otherwise required.
        </p>
      </section>

      <Divider />

      {/* CHANGES */}
      <section id="changes" className="mb-16 scroll-mt-24">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Changes to Terms
        </h2>

        <p className="text-gray-700 dark:text-gray-300">
          We may update these Terms. Continued use of Docify constitutes acceptance.
        </p>
      </section>

      <Divider />

      {/* CONTACT */}
      <section id="contact" className="mb-16 scroll-mt-24">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Contact Us</h2>

        <p className="mb-4 text-gray-700 dark:text-gray-300">For legal or support inquiries:</p>

        <ul className="space-y-2 list-none">
          <ListItem>
            Email:{" "}
            <a
              href="mailto:support@docify.app?subject=Legal / Terms Inquiry"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              support@docify.app
            </a>
          </ListItem>
          <ListItem>Subject: Legal / Terms Inquiry</ListItem>
        </ul>
      </section>
    </article>
  );
}

function Divider() {
  return (
    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-12" />
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
      <Dot className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
      <span className="flex-1">{children}</span>
    </li>
  );
}
