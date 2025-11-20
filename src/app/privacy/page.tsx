export const metadata = {
  title: "Privacy Policy | Docify",
  description: "Privacy Policy for Docify - Learn how we collect, use, and protect your information.",
};

export default function PrivacyPolicy() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-white">
            🔥 PRIVACY POLICY — DOCIFY
          </h1>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Last updated: {currentDate}
          </p>

          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <section>
              <p>
                Docify ("we", "our", "us") provides a collaborative document editing platform.
              </p>
              <p>
                This Privacy Policy explains how we collect, use, store, and protect your information when you use Docify.
              </p>
              <p>
                By accessing Docify, you agree to this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                1. Information We Collect
              </h2>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">
                1.1 Account Information
              </h3>
              <p>
                When you create or access an account using authentication providers (such as Clerk), we collect:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name</li>
                <li>Email address</li>
                <li>Profile picture</li>
                <li>Organization information (if applicable)</li>
                <li>Authentication identifiers</li>
              </ul>
              <p className="mt-3">
                We do not store passwords.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">
                1.2 Usage Data
              </h3>
              <p>
                We collect basic usage data, such as:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Pages visited</li>
                <li>Features used</li>
                <li>Timestamps</li>
                <li>Device/browser information</li>
                <li>IP address (for security & fraud prevention)</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">
                1.3 Document & Collaboration Data
              </h3>
              <p>
                When you create or edit documents, we process:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Document titles</li>
                <li>Document content</li>
                <li>Comments, edits, and revision history</li>
                <li>Collaboration indicators (cursor positions, presence, status)</li>
              </ul>
              <p className="mt-3">
                Your data is stored securely using Convex and synced via Liveblocks.
              </p>
              <p>
                We do not sell or share document contents with third parties.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">
                1.4 Cookies & Local Storage
              </h3>
              <p>
                We use cookies/local storage for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Authentication</li>
                <li>Session management</li>
                <li>Performance & analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                2. How We Use Your Information
              </h2>
              <p>
                We use your data to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain the Docify platform</li>
                <li>Enable real-time collaboration</li>
                <li>Sync and store documents</li>
                <li>Prevent unauthorized access</li>
                <li>Improve reliability, performance, and usability</li>
                <li>Communicate service updates or security notices</li>
              </ul>
              <p className="mt-3">
                We never sell your data to advertisers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                3. Sharing of Information
              </h2>
              <p>
                We share data only with trusted service providers necessary to operate Docify, such as:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Authentication provider (Clerk)</li>
                <li>Database & storage provider (Convex)</li>
                <li>Real-time sync service (Liveblocks)</li>
                <li>Hosting providers</li>
              </ul>
              <p className="mt-3">
                These processors are contractually required to protect your data.
              </p>
              <p>
                We do not share your document contents with third parties for marketing or analytics.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                4. Data Security
              </h2>
              <p>
                We use industry-standard security measures, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>HTTPS encryption</li>
                <li>Secure authentication</li>
                <li>Encrypted storage where applicable</li>
                <li>Access controls</li>
                <li>Audit logging</li>
              </ul>
              <p className="mt-3">
                No system is perfectly secure, but we work continuously to protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                5. Your Rights
              </h2>
              <p>
                Depending on your region, you may have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion</li>
                <li>Export your data</li>
                <li>Withdraw consent</li>
                <li>Object to certain processing</li>
              </ul>
              <p className="mt-3">
                You can request these by contacting us at{" "}
                <a 
                  href="mailto:support@docify.app?subject=Privacy Inquiry" 
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  support@docify.app
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                6. Data Retention
              </h2>
              <p>
                We retain data as long as your account is active.
              </p>
              <p className="mt-3">
                Upon account deletion:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Documents and related data are deleted</li>
                <li>Backups may persist temporarily for security and disaster recovery</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                7. Children's Privacy
              </h2>
              <p>
                Docify is not intended for users under 13.
              </p>
              <p className="mt-3">
                We do not knowingly collect information from children.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                8. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy periodically.
              </p>
              <p className="mt-3">
                If changes are significant, we will notify you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                9. Contact Us
              </h2>
              <p>
                For privacy questions:
              </p>
              <ul className="list-none pl-0 space-y-2 mt-3">
                <li>
                  Email:{" "}
                  <a 
                    href="mailto:support@docify.app?subject=Privacy Inquiry" 
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    support@docify.app
                  </a>
                </li>
                <li>Subject: Privacy Inquiry</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

