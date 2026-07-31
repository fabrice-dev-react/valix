import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Valix — Viral, Converting Ads From a Website URL",
  description: "Paste a URL. Valix understands your offer, your customers and their pain points, then turns it into 10 ready-to-publish Facebook & Instagram ads — each with a different angle. Pick the winner and run.",
  openGraph: {
    title: "Valix — Viral, Converting Ads From a Website URL",
    description: "Paste any website URL and get 10 beautiful Facebook & Instagram ads that convert. Trained on 800 ads that worked.",
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
