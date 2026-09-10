import LegalPage from "@/components/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="August 1, 2026"
      sections={[
        {
          heading: "Acceptance of Terms",
          body: (
            <p>
              By creating an account or using Valix, you agree to these Terms of
              Service. If you do not agree, please do not use the service.
            </p>
          ),
        },
        {
          heading: "The Service",
          body: (
            <p>
              Valix is an AI side-hustle builder that guides you through
              validated phases to research, launch, and grow a side business.
              Valix provides guidance, action plans, and recommendations based
              on the information you share. The service is educational and
              coaching in nature.
            </p>
          ),
        },
        {
          heading: "Not a Substitute for Professional Judgment",
          body: (
            <p>
              Valix provides guidance and recommendations only. You are solely
              responsible for the decisions you make about your business,
              including any financial, legal, or business decisions. We make no
              guarantee of any income, sales, or results.
            </p>
          ),
        },
        {
          heading: "Accounts & Subscriptions",
          body: (
            <div className="space-y-3">
              <p>
                You must be at least 18 years old to use the service. You agree
                to provide accurate information and to keep your account
                credentials secure.
              </p>
              <p>
                Valix is offered as a subscription billed through our payment
                processor. Payment is due in advance and is non-refundable
                except where required by law. You can cancel anytime.
              </p>
            </div>
          ),
        },
        {
          heading: "Cancellation & Refunds",
          body: (
            <p>
              You can cancel your subscription at any time. Cancellation takes
              effect at the end of the current billing period, and you keep
              access until then. We do not offer refunds for partial billing
              periods.
            </p>
          ),
        },
        {
          heading: "Acceptable Use",
          body: (
            <div className="space-y-3">
              <p>You agree not to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Upload illegal content, malware, or files you have no right to share.</li>
                <li>Attempt to reverse engineer, resell, or redistribute the service without permission.</li>
                <li>Abuse the service, including automated scraping or excessive automated requests.</li>
              </ul>
            </div>
          ),
        },
        {
          heading: "Intellectual Property",
          body: (
            <p>
              Valix and all associated branding, software, and content are owned
              by us or our licensors. Nothing in these terms transfers ownership
              of any intellectual property to you.
            </p>
          ),
        },
        {
          heading: "Limitation of Liability",
          body: (
            <p>
              To the maximum extent permitted by law, Valix shall not be liable
              for any indirect, incidental, special, consequential, or punitive
              damages, or any loss of profits, revenue, data, or business
              arising out of or related to your use of the service.
            </p>
          ),
        },
        {
          heading: "Termination",
          body: (
            <p>
              We may suspend or terminate your access if you violate these
              terms, misuse the service, or pose a risk to other users. You may
              stop using the service and delete your account at any time.
            </p>
          ),
        },
        {
          heading: "Changes to These Terms",
          body: (
            <p>
              We may update these terms from time to time. Material changes will
              be communicated through the service. Continued use of the service
              after changes take effect means you accept the updated terms.
            </p>
          ),
        },
        {
          heading: "Contact",
          body: (
            <p>
              Questions about these terms? Email{" "}
              <a href="mailto:niyomutabazifabrice100@gmail.com" className="font-semibold text-ink underline decoration-signal/50 underline-offset-2 hover:decoration-signal transition-colors">
                niyomutabazifabrice100@gmail.com
              </a>.
            </p>
          ),
        },
      ]}
    />
  );
}