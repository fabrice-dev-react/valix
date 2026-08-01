import LegalPage from "@/components/LegalPage";

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      updated="August 1, 2026"
      sections={[
        {
          heading: "What Are Cookies",
          body: (
            <p>
              Cookies are small text files stored on your device when you visit
              a website. They help sites work properly, remember your
              preferences, and understand how visitors use the service.
            </p>
          ),
        },
        {
          heading: "Cookies We Use",
          body: (
            <div className="space-y-3">
              <p>Valix uses the following categories of cookies:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <span className="font-semibold text-ink">Essential:</span>{" "}
                  required for sign-in and to keep you logged in while using the
                  service.
                </li>
                <li>
                  <span className="font-semibold text-ink">Analytics:</span>{" "}
                  placed by Google Analytics to measure how the site is used, in
                  an aggregated form.
                </li>
                <li>
                  <span className="font-semibold text-ink">Payment:</span>{" "}
                  set by our payment processor to complete and confirm
                  subscriptions.
                </li>
              </ul>
            </div>
          ),
        },
        {
          heading: "Managing Cookies",
          body: (
            <div className="space-y-3">
              <p>
                You can control or delete cookies through your browser settings.
                Blocking essential cookies may prevent you from signing in or
                using the service. Most browsers let you clear cookies and
                disable tracking in their privacy settings.
              </p>
              <p>
                To opt out of Google Analytics tracking specifically, you can
                use the{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-ink underline decoration-signal/50 underline-offset-2 hover:decoration-signal transition-colors"
                >
                  Google Analytics opt-out browser add-on
                </a>.
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
