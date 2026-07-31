import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Valix — Great Ads, Straight From a Website URL",
  description: "Paste a URL. Valix reads your site, pulls the offer, tone and proof, then writes and designs Facebook & Instagram ads in your voice. Four ready-to-publish variations per run.",
  openGraph: {
    title: "Valix — Great Ads, Straight From a URL",
    description: "Turn any website into publishable Facebook & Instagram ads. No briefs, no designers, no guesswork.",
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
