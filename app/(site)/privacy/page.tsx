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
              collect when you use our AI side-hustle builder, how we use it,
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
                <li>Profile data: your goals, skills, interests and availability that you share during onboarding.</li>
                <li>Usage data: pages visited and features used.</li>
              </ul>
            </div>
          ),
        },
        {
          heading: "How We Use Your Information",
          body: (
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To provide and operate the service, including personalising your side-hustle plan.</li>
              <li>To manage your account.</li>
              <li>To improve the service and understand how it is used.</li>
              <li>To communicate with you about your account and the service.</li>
            </ul>
          ),
        },
        {
          heading: "Your Profile Data",
          body: (
            <p>
              The information you share during onboarding is used to tailor your
              plan and recommendations. This data is not sold. You can review
              and update it at any time from your settings.
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
                <li>AI model providers to power personalised guidance.</li>
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
                You can also delete your saved profile data and cancel your
                account at any time.
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