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
              collect when you use our AI missed-call recovery service, how we
              use it, and the choices you have.
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
                <li>Conversation data: the SMS conversations and lead details captured from your missed-call follow-ups.</li>
                <li>Usage data: pages visited, features used and missed-call activity on your connected numbers.</li>
                <li>Payment data: handled by our payment processor. We do not store your card details.</li>
              </ul>
            </div>
          ),
        },
        {
          heading: "How We Use Your Information",
          body: (
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To provide and operate the service, including sending SMS follow-ups and qualifying leads on your missed calls.</li>
              <li>To manage your account, subscription and billing.</li>
              <li>To improve the service and understand how it is used.</li>
              <li>To communicate with you about your account and the service.</li>
            </ul>
          ),
        },
        {
          heading: "Caller Conversations & Lead Data",
          body: (
            <p>
              The SMS conversations and details of the callers Valix follows up
              with are collected on your behalf and used to qualify and present
              leads to you. These are only used to provide the service, and are
              not sold. You are responsible for handling any customer data you
              act on in line with your own privacy obligations.
            </p>
          ),
        },
        {
          heading: "Payment Information",
          body: (
            <p>
              Payments are processed by our payment processor under their own
              privacy and security practices. We receive confirmation of payment
              status but never see or store your full card details.
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
                <li>Our SMS and AI model providers to run missed-call follow-ups and lead qualification.</li>
                <li>Our payment processor for subscription billing.</li>
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
                You can also delete your saved lead and conversation data and
                cancel your account at any time from your dashboard.
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
