"use client";

import { useState } from "react";

const WHATSAPP_NUMBER = "250793242447";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        setError("Something went wrong, please try again.");
        return;
      }

      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setError("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream text-ink">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-40 pb-24">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-signal" />
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal-dark font-semibold">
              Contact
            </p>
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-[-0.03em] text-ink leading-[1.05]">
            Talk to us
          </h1>
          <p className="mt-5 text-[15px] sm:text-base leading-relaxed text-ink-soft">
            Questions, feedback or a problem with your account? Send us a
            message or reach out on WhatsApp — a human replies within a day.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-5 gap-6">
          <div className="md:col-span-2 flex flex-col gap-4">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl bg-[#25D366] text-white p-5 transition-transform duration-200 hover:scale-[1.02] shadow-[0_16px_40px_-16px_rgba(37,211,102,0.6)]"
            >
              <span className="w-11 h-11 shrink-0 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </span>
              <span>
                <span className="block text-lg font-bold">WhatsApp</span>
                <span className="block text-[13px] text-white/80">+250 793 242 447</span>
              </span>
            </a>

            <a
              href="mailto:niyomutabazifabrice100@gmail.com"
              className="flex items-center gap-4 rounded-2xl border border-line bg-paper p-5 transition-all duration-200 hover:border-ink/20"
            >
              <span className="w-11 h-11 shrink-0 rounded-full bg-signal-soft flex items-center justify-center">
                <svg className="w-5 h-5 text-signal-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <span>
                <span className="block text-lg font-bold text-ink">Email</span>
                <span className="block text-[13px] text-ink-soft">niyomutabazifabrice100@gmail.com</span>
              </span>
            </a>
          </div>

          <div className="md:col-span-3 rounded-2xl border border-line bg-paper p-6 sm:p-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center text-center py-10">
                <span className="w-12 h-12 rounded-full bg-moss/15 flex items-center justify-center">
                  <svg className="w-6 h-6 text-moss" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <h2 className="mt-4 text-xl font-bold text-ink">Message sent</h2>
                <p className="mt-2 text-[14px] text-ink-soft">
                  Thanks for reaching out — we&apos;ll get back to you within a day.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 text-[14px] font-semibold text-ink underline decoration-signal/50 underline-offset-4 hover:decoration-signal transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 bg-signal-soft text-signal-dark text-sm rounded-lg">
                    {error}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-ink mb-2">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl border border-line bg-cream text-[14px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-ink/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-line bg-cream text-[14px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-ink/30 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-ink mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help?"
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-line bg-cream text-[14px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-ink/30 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full bg-ink text-white text-[14px] font-semibold hover:bg-black transition-colors disabled:opacity-60 disabled:cursor-wait"
                >
                  {loading ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
