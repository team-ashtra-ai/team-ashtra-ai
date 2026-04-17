import type { Metadata, Viewport } from "next";
import { Fraunces, Sora } from "next/font/google";
import Script from "next/script";

import { buildMetadata } from "@/lib/seo";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = buildMetadata({
  description:
    "ash-tra.com redesigns websites and client portals for serious service businesses that need clearer messaging, stronger SEO foundations, better accessibility, multilingual readiness, and a smoother client journey.",
});

export const viewport: Viewport = {
  themeColor: "#0d1622",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-SQTQKJBKFK" />
        <Script id="ash-tra-ga" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SQTQKJBKFK');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
