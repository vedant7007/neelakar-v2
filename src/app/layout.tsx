import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-neel-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-neel-script",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

const SITE_URL = "https://neelakar-v2.vercel.app"
const TITLE = "Neelakar Creative House — Luxury Branding, Film & Campaign Studio"
const DESCRIPTION =
  "Neelakar Creative House is a luxury creative studio specialising in brand identity, cinematic campaigns, editorial photography, and visual storytelling for fashion, jewellery, and prestige brands worldwide."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Neelakar Creative House",
  },
  description: DESCRIPTION,
  keywords: [
    "luxury branding agency",
    "creative studio",
    "fashion campaign production",
    "jewellery brand identity",
    "editorial photography",
    "cinematic campaigns",
    "luxury visual identity",
    "brand storytelling",
    "Neelakar Creative House",
    "prestige brand design",
    "luxury fashion film",
    "haute couture campaigns",
  ],
  authors: [{ name: "Neelakar Creative House" }],
  creator: "Neelakar Creative House",
  publisher: "Neelakar Creative House",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Neelakar Creative House",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@neelakar",
  },
  icons: {
    icon: [
      { url: "/NCH_logo_white.png", type: "image/png" },
    ],
    apple: "/NCH_logo_white.png",
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "Creative Agency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable} ${cormorant.variable} h-full`}
    >
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/qfi2uip.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CreativeWorkSeries",
              name: "Neelakar Creative House",
              description: DESCRIPTION,
              url: SITE_URL,
              logo: `${SITE_URL}/NCH_logo_white.png`,
              foundingDate: "2024",
              sameAs: [],
              "@graph": [
                {
                  "@type": "Organization",
                  name: "Neelakar Creative House",
                  url: SITE_URL,
                  logo: `${SITE_URL}/NCH_logo_white.png`,
                  description: DESCRIPTION,
                  knowsAbout: [
                    "Luxury Branding",
                    "Fashion Campaigns",
                    "Cinematic Film Production",
                    "Editorial Photography",
                    "Jewellery Brand Identity",
                    "Visual Storytelling",
                  ],
                },
                {
                  "@type": "WebSite",
                  name: "Neelakar Creative House",
                  url: SITE_URL,
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased">
        {children}
        <div className="noise-overlay" aria-hidden />
      </body>
    </html>
  );
}
