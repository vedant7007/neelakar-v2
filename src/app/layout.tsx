import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond, Caveat } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-neel-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Neelakar Creative House | Luxury Creative Studio",
  description:
    "Neelakar Creative House crafts elevated visual identities for luxury, fashion, and jewellery brands — editorial campaigns, brand worlds, and prestige storytelling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${cormorant.variable} ${caveat.variable} h-full`}
    >
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/qfi2uip.css" />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased">
        {children}
        <div className="noise-overlay" aria-hidden />
      </body>
    </html>
  );
}
