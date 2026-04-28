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
const TITLE = "Neelakar Creative House | Best Creative Studio in Hyderabad — Branding, Film & Campaigns"
const DESCRIPTION =
  "Neelakar Creative House is Hyderabad's premier luxury creative studio. We specialise in brand identity, cinematic campaigns, editorial photography, film production, and visual storytelling for fashion, jewellery, and prestige brands across India."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Neelakar Creative House — Hyderabad",
  },
  description: DESCRIPTION,
  keywords: [
    "best creative house in Hyderabad",
    "creative studio Hyderabad",
    "branding agency Hyderabad",
    "Neelakar Creative House",
    "luxury branding agency India",
    "fashion campaign production Hyderabad",
    "film production house Hyderabad",
    "jewellery brand identity",
    "editorial photography Hyderabad",
    "cinematic campaigns India",
    "ad film makers Hyderabad",
    "visual storytelling agency",
    "brand strategy Hyderabad",
    "luxury visual identity",
    "creative agency Telangana",
    "prestige brand design India",
    "Hyderabad creative agency",
    "best branding company Hyderabad",
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
    locale: "en_IN",
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
  other: {
    "geo.region": "IN-TG",
    "geo.placename": "Hyderabad",
    "geo.position": "17.385;78.4867",
    "ICBM": "17.385, 78.4867",
  },
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
              "@graph": [
                {
                  "@type": "LocalBusiness",
                  "@id": `${SITE_URL}/#business`,
                  name: "Neelakar Creative House",
                  alternateName: "Neelakar",
                  description: DESCRIPTION,
                  url: SITE_URL,
                  logo: `${SITE_URL}/NCH_logo_white.png`,
                  image: `${SITE_URL}/NCH_logo_white.png`,
                  foundingDate: "2024",
                  priceRange: "$$$$",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Hyderabad",
                    addressRegion: "Telangana",
                    addressCountry: "IN",
                  },
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: 17.385,
                    longitude: 78.4867,
                  },
                  areaServed: [
                    { "@type": "City", name: "Hyderabad" },
                    { "@type": "State", name: "Telangana" },
                    { "@type": "Country", name: "India" },
                  ],
                  knowsAbout: [
                    "Luxury Branding",
                    "Fashion Campaigns",
                    "Cinematic Film Production",
                    "Editorial Photography",
                    "Jewellery Brand Identity",
                    "Visual Storytelling",
                    "Ad Film Making",
                    "Brand Strategy",
                  ],
                  hasOfferCatalog: {
                    "@type": "OfferCatalog",
                    name: "Creative Services",
                    itemListElement: [
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name: "Brand Identity & Creative Strategy",
                          description: "Complete brand identity design, strategy, narrative, and creative direction for luxury brands.",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name: "Campaign & Film Production",
                          description: "Cinematic ad films, campaign production, and post-production for fashion and luxury brands.",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name: "Visual Content & Photography",
                          description: "Editorial photography, motion design, and visual systems for prestige brands.",
                        },
                      },
                    ],
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  name: "Neelakar Creative House",
                  url: SITE_URL,
                  publisher: { "@id": `${SITE_URL}/#business` },
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
