import React from "react";
import Seo from "../components/Essential/Seo";
import Navbar from "../components/Essential/Navbar";
import Footer from "../components/Essential/Footer";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Seo
        title="Cookie Policy | Aicyro"
        description="Learn how Aicyro uses cookies and similar technologies to improve your browsing experience on our website."
      />

      <Navbar />

      {/* Main Content - flex-grow ensures footer is pushed to bottom */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-24 md:py-32 w-full">
        {/* Header */}
        <div className="mb-12 border-b border-gray-200 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
            Cookie Policy
          </h1>
          <p className="text-textSecondary font-medium text-lg">
            Effective Date: June 8, 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 leading-relaxed text-textPrimary">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              1. Introduction
            </h2>
            <p className="text-textSecondary mb-3">
              This Cookie Policy explains how AICYRO ("we," "our," or "us") uses
              cookies and similar technologies when you visit our website.
            </p>
            <p className="text-textSecondary font-medium">
              By continuing to use our website, you consent to the use of
              cookies as described in this Policy unless you disable them
              through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              2. What Are Cookies?
            </h2>
            <p className="text-textSecondary mb-3">
              Cookies are small text files placed on your device when you visit
              a website.
            </p>
            <p className="text-textSecondary">
              They help websites function efficiently, remember preferences,
              improve performance, and provide analytical insights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              3. Types of Cookies We Use
            </h2>

            <h3 className="text-xl font-semibold mb-3 mt-6 text-secondary">
              Essential Cookies
            </h3>
            <p className="text-textSecondary mb-3">
              These cookies are necessary for website functionality and
              security. Examples include:
            </p>
            <ul className="list-disc pl-6 mb-3 space-y-2 text-textSecondary">
              <li>Session management</li>
              <li>Form submission functionality</li>
              <li>Security verification</li>
              <li>Load balancing</li>
            </ul>
            <p className="text-textSecondary italic mb-6">
              These cookies cannot be disabled without affecting website
              operation.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6 text-secondary">
              Analytics Cookies
            </h3>
            <p className="text-textSecondary mb-3">
              These cookies help us understand how visitors interact with our
              website. Information collected may include:
            </p>
            <ul className="list-disc pl-6 mb-3 space-y-2 text-textSecondary">
              <li>Pages visited</li>
              <li>Time spent on pages</li>
              <li>Traffic sources</li>
              <li>Device information</li>
              <li>Geographic region</li>
            </ul>
            <p className="text-textSecondary mb-6">
              <strong>Examples:</strong> Google Analytics, similar website
              analytics platforms.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6 text-secondary">
              Functional Cookies
            </h3>
            <p className="text-textSecondary mb-3">
              These cookies remember user preferences and settings to improve
              the browsing experience. Examples include:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-textSecondary">
              <li>Language preferences</li>
              <li>Saved form information</li>
              <li>User interface settings</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6 text-secondary">
              Marketing Cookies
            </h3>
            <p className="text-textSecondary mb-3">
              These cookies may be used to measure advertising performance and
              improve marketing campaigns. Examples may include:
            </p>
            <ul className="list-disc pl-6 mb-3 space-y-2 text-textSecondary">
              <li>Meta Pixel</li>
              <li>LinkedIn Insight Tag</li>
              <li>Google Ads Tracking</li>
            </ul>
            <p className="text-textSecondary italic">
              These cookies may track interactions across websites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              4. Third-Party Cookies
            </h2>
            <p className="text-textSecondary mb-3">
              Certain cookies may be set by trusted third-party providers that
              support our website functionality, analytics, marketing, or
              customer communication systems.
            </p>
            <p className="text-textSecondary">
              These providers maintain their own privacy and cookie policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              5. Managing Cookies
            </h2>
            <p className="text-textSecondary mb-3">
              Most web browsers allow you to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-textSecondary">
              <li>View stored cookies</li>
              <li>Delete cookies</li>
              <li>Block cookies</li>
              <li>Restrict third-party cookies</li>
            </ul>
            <p className="text-textSecondary font-medium">
              Please note that disabling certain cookies may affect website
              functionality and user experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              6. Data Protection
            </h2>
            <p className="text-textSecondary mb-3">
              Information collected through cookies may be combined with other
              information collected through our website as described in our
              Privacy Policy.
            </p>
            <p className="text-textSecondary">
              For more information, please review our{" "}
              <a
                href="/privacy"
                className="text-primary hover:text-accent transition-colors font-medium"
              >
                Privacy Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              7. Changes to This Policy
            </h2>
            <p className="text-textSecondary mb-3">
              We may update this Cookie Policy periodically to reflect changes
              in technology, legal requirements, or website functionality.
            </p>
            <p className="text-textSecondary">
              Updates will be posted on this page with a revised effective date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              8. Contact Us
            </h2>
            <p className="text-textSecondary mb-6">
              If you have questions regarding our use of cookies, please contact
              us using the information below:
            </p>
            <address className="not-italic bg-surface p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
              <strong className="text-secondary block mb-2 text-lg">
                AICYRO
              </strong>
              <span className="text-textSecondary">Email: </span>
              <a
                href="mailto:info@aicyro.com"
                className="text-primary hover:text-accent transition-colors font-medium"
              >
                info@aicyro.com
              </a>
              <br />
              <span className="text-textSecondary">Website: </span>
              <a
                href="https://aicyro.com"
                className="text-primary hover:text-accent transition-colors font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://aicyro.com
              </a>
            </address>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
