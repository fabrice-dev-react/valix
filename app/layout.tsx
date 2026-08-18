import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Valix — Daily Marketing Discipline for SaaS Founders",
  description: "Valix analyzes your SaaS, builds a custom marketing plan, and pushes daily actions to keep you consistent. Stay disciplined, grow your pipeline, ship your marketing every day.",
  openGraph: {
    title: "Valix — Daily Marketing Discipline for SaaS Founders",
    description: "Stop guessing what to market. Valix gives you a daily plan, channels to focus on, and actions to complete — so your SaaS actually grows.",
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
