import LegalPage from "@/components/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="August 1, 2026"
      sections={[
        {
          heading: "Overview",
          body: (
            <p>
              Valix (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;)
              respects your privacy. This policy explains what information we
              collect when you use our chart analysis service, how we use it,
              and the choices you have.
            </p>
          ),
        },
        {
          heading: "Information We Collect",
          body: (
            <div className="space-y-3">
              <p>We collect the following information:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Account details: your name, email address and profile picture when you sign in with Google.</li>
                <li>Chart screenshots: the images you upload for analysis.</li>
                <li>Usage data: pages visited, features used and analysis requests.</li>
                <li>Payment data: handled by our payment processor, Dodo Payments. We do not store your card details.</li>
              </ul>
            </div>
          ),
        },
        {
          heading: "How We Use Your Information",
          body: (
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To provide and operate the service, including analyzing your chart screenshots.</li>
              <li>To manage your account, subscription and billing.</li>
              <li>To improve the service and understand how it is used.</li>
              <li>To communicate with you about your account and the service.</li>
            </ul>
          ),
        },
        {
          heading: "Chart Screenshots & Analysis",
          body: (
            <p>
              The screenshots you upload are used solely to produce your
              analysis. We may retain them briefly to complete and support the
              analysis, and we do not sell them. Please do not upload images
              containing personal or sensitive information you do not want us
              to process.
            </p>
          ),
        },
        {
          heading: "Payment Information",
          body: (
            <p>
              Payments are processed by Dodo Payments under their own privacy
              and security practices. We receive confirmation of payment status
              but never see or store your full card details.
            </p>
          ),
        },
        {
          heading: "Third-Party Services",
          body: (
            <div className="space-y-3">
              <p>We use a limited set of third-party services to run the product:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Google for sign-in (OAuth).</li>
                <li>Our AI model providers to generate chart analysis.</li>
                <li>Dodo Payments for subscription billing.</li>
                <li>Google Analytics for aggregated usage insights.</li>
              </ul>
              <p>
                Each provider processes data under its own privacy policy and
                only for the purposes described above.
              </p>
            </div>
          ),
        },
        {
          heading: "Data Security",
          body: (
            <p>
              We use reasonable technical and organizational measures to protect
              your data, including encryption in transit. No method of
              transmission over the internet is completely secure, so we cannot
              guarantee absolute security.
            </p>
          ),
        },
        {
          heading: "Your Rights",
          body: (
            <div className="space-y-3">
              <p>
                Depending on your location, you may have the right to access,
                correct, or delete your personal data, and to object to or
                restrict certain processing. To exercise these rights, contact
                us at{" "}
                  <a href="mailto:niyomutabazifabrice100@gmail.com" className="font-semibold text-ink underline decoration-signal/50 underline-offset-2 hover:decoration-signal transition-colors">
                    niyomutabazifabrice100@gmail.com
                </a>.
              </p>
              <p>
                You can also delete your uploaded screenshots and cancel your
                account at any time from your dashboard.
              </p>
            </div>
          ),
        },
        {
          heading: "Contact",
          body: (
            <p>
              Questions about this policy? Email{" "}
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
