export const metadata = {
  title: "Terms of Service | Docify",
  description: "Terms of Service for Docify - Learn about the terms and conditions for using our platform.",
};

export default function TermsOfService() {
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
            🔥 TERMS OF SERVICE — DOCIFY
          </h1>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Last updated: {currentDate}
          </p>

          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <section>
              <p>
                These Terms govern your access to and use of Docify ("we", "our", "us").
              </p>
              <p>
                By using Docify, you agree to these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                1. Using Docify
              </h2>
              <p>
                You must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be at least 13 years old</li>
                <li>Provide accurate account information</li>
                <li>Use the platform lawfully</li>
                <li>Not attempt to disrupt or exploit the service</li>
              </ul>
              <p className="mt-3">
                We may suspend or terminate accounts that violate these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                2. Your Content
              </h2>
              <p>
                You own all documents and content you create on Docify.
              </p>
              <p className="mt-3">
                By using Docify, you grant us a limited license to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Store your content</li>
                <li>Process it to provide collaboration features</li>
                <li>Display it to you and collaborators you explicitly authorize</li>
              </ul>
              <p className="mt-3">
                We do not claim ownership of your content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                3. Collaborative Features
              </h2>
              <p>
                If you share a document or invite others, you are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Selecting the appropriate permissions</li>
                <li>Understanding that invited users may view/edit content</li>
                <li>Revoking access if needed</li>
              </ul>
              <p className="mt-3">
                We are not responsible for actions taken by collaborators you authorize.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                4. Acceptable Use
              </h2>
              <p>
                You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Upload illegal, harmful, or abusive content</li>
                <li>Attempt to reverse engineer or exploit Docify</li>
                <li>Interfere with servers, systems, or other users</li>
                <li>Use Docify to violate copyrights or intellectual property laws</li>
              </ul>
              <p className="mt-3">
                We reserve the right to remove content that violates these rules.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                5. Service Availability
              </h2>
              <p>
                Docify may experience:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintenance periods</li>
                <li>Unexpected downtime</li>
                <li>Feature updates</li>
                <li>Changes to the platform</li>
              </ul>
              <p className="mt-3">
                We do not guarantee uninterrupted access.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                6. Limitations of Liability
              </h2>
              <p>
                To the fullest extent permitted by law:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Docify is provided "as is" without warranties</li>
                <li>We are not liable for data loss, downtime, or unauthorized access</li>
                <li>Your use of the service is at your own risk</li>
              </ul>
              <p className="mt-3">
                We recommend exporting important documents regularly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                7. Account Termination
              </h2>
              <p>
                We may suspend or terminate accounts that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate these Terms</li>
                <li>Abuse collaboration features</li>
                <li>Engage in harmful or fraudulent activities</li>
              </ul>
              <p className="mt-3">
                You may delete your account at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                8. Governing Law
              </h2>
              <p>
                These Terms are governed by the laws of your jurisdiction unless otherwise required.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                9. Changes to Terms
              </h2>
              <p>
                We may update these Terms. Continued use of Docify constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                10. Contact
              </h2>
              <p>
                For support or legal questions:
              </p>
              <ul className="list-none pl-0 space-y-2 mt-3">
                <li>
                  Email:{" "}
                  <a 
                    href="mailto:support@docify.app?subject=Legal / Terms Inquiry" 
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    support@docify.app
                  </a>
                </li>
                <li>Subject: Legal / Terms Inquiry</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

