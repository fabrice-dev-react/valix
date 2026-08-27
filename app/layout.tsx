import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Valix — AI Missed-Call Recovery for Service Businesses",
  description: "Valix instantly texts every missed caller by SMS, qualifies them with AI, and shows you a list of qualified leads ready to call back. Don't lose a customer to a missed call again. Live in minutes, no CRM required.",
  openGraph: {
    title: "Valix — Never lose a customer to a missed call again",
    description: "Miss a call? Valix texts them back instantly, AI finds out what they need, and you get a qualified lead ready to call back—so you don't lose them to a competitor.",
    type: "website",
    siteName: "Valix",
  },
  twitter: {
    card: "summary_large_image",
    title: "Valix — Never lose a customer to a missed call again",
    description: "Valix texts missed callers by SMS, qualifies them with AI, and hands you a list of qualified leads ready to call back.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
      </body>
    </html>
  );
}
