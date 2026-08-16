import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import "./globals.css";

const diatypeMono = localFont({
  src: "./fonts/ABCDiatypeMono/ABCDiatypeMono-Regular.woff2",
  variable: "--font-diatype-mono",
  display: "swap",
  weight: "400",
});

const title = "Jon Hargreaves | Product Designer";
const description =
  "A product designer who builds thoughtful experiences that users love.";

export const metadata: Metadata = {
  metadataBase: new URL("https://jonhargreaves.com"),
  title,
  description,
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "Jon Hargreaves", url: "/" }],
  creator: "Jon Hargreaves",
  keywords: [
    "Jon Hargreaves",
    "product designer",
    "frontend developer",
    "branding",
    "design systems",
    "Norfolk Virginia",
  ],
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Jon Hargreaves",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#000000",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${diatypeMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
