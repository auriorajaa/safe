import type { Metadata } from "next";
import { Plus_Jakarta_Sans as JakartaSans } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import ErrorBoundary from "@/components/common/error-boundary";
import Navigator from "@/components/common/navigator";
import { ORIGIN_URL } from "@/lib/helpers";

const jakartaSans = JakartaSans({
  variable: "--jakarta-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default:
      "SAFE - Advanced Financial Fraud Detection & Sentiment Analysis | PT SAFENET INDONESIA",
    template: "%s | SAFE - PT SAFENET INDONESIA",
  },
  description:
    "SAFE (Security Anti Fraud Executive) by PT SAFENET INDONESIA provides advanced AI-powered financial fraud detection, transaction security monitoring, and news sentiment analysis to protect your business from financial threats and market volatility.",
  keywords: [
    "financial fraud detection",
    "fraud prevention",
    "transaction security",
    "sentiment analysis",
    "AI fraud detection",
    "financial security",
    "anti-fraud system",
    "transaction monitoring",
    "news sentiment analysis",
    "financial protection",
    "cybersecurity",
    "fintech security",
    "fraud analytics",
    "risk management",
    "PT SAFENET INDONESIA",
  ],
  authors: [{ name: "PT SAFENET INDONESIA" }],
  creator: "PT SAFENET INDONESIA",
  publisher: "PT SAFENET INDONESIA",
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: ORIGIN_URL,
    siteName: "SAFE - PT SAFENET INDONESIA",
    title: "SAFE - Advanced Financial Fraud Detection & Sentiment Analysis",
    description:
      "Protect your business with SAFE's AI-powered financial fraud detection and sentiment analysis. Advanced security solutions by PT SAFENET INDONESIA for transaction monitoring and risk management.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "SAFE - Financial Fraud Detection & Sentiment Analysis by PT SAFENET INDONESIA",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SAFE - Advanced Financial Fraud Detection & Sentiment Analysis",
    description:
      "AI-powered financial fraud detection and sentiment analysis solutions by PT SAFENET INDONESIA. Protect your transactions and monitor market sentiment.",
    images: ["/opengraph-image.png"],
    creator: "@safenetindo",
    site: "@safenetindo",
  },
  metadataBase: new URL(ORIGIN_URL),
  alternates: {
    canonical: ORIGIN_URL,
    languages: {
      "en-US": ORIGIN_URL,
      "id-ID": `${ORIGIN_URL}/id`,
    },
  },
  category: "technology",
  classification: "Business",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // JSON-LD Structured Data
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "PT SAFENET INDONESIA",
      alternateName: "SAFE",
      url: ORIGIN_URL,
      logo: `${ORIGIN_URL}/favicon.ico`,
      description:
        "Advanced financial fraud detection and sentiment analysis solutions",
      foundingDate: "2024",
      address: {
        "@type": "PostalAddress",
        addressCountry: "ID",
        addressRegion: "Indonesia",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: ["English", "Indonesian"],
      },
      sameAs: [
        // Add social media links when available
      ],
      offers: {
        "@type": "Service",
        name: "Financial Fraud Detection & Sentiment Analysis",
        description:
          "AI-powered solutions for financial security and market sentiment analysis",
        provider: {
          "@type": "Organization",
          name: "PT SAFENET INDONESIA",
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" dir="ltr">
        <head>
          {/* Additional SEO meta tags */}
          <meta name="theme-color" content="#ffffff" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <link rel="canonical" href={ORIGIN_URL} />

          {/* Preconnect to external domains for performance */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />

          {/* Additional favicons for better browser support */}
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/favicon.ico" />

          {/* JSON-LD structured data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "SAFE - PT SAFENET INDONESIA",
                alternateName: "SAFE Financial Security",
                url: ORIGIN_URL,
                description:
                  "Advanced financial fraud detection and sentiment analysis solutions",
                publisher: {
                  "@type": "Organization",
                  name: "PT SAFENET INDONESIA",
                  logo: {
                    "@type": "ImageObject",
                    url: `${ORIGIN_URL}/favicon.ico`,
                  },
                },
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: `${ORIGIN_URL}/search?q={search_term_string}`,
                  },
                  "query-input": "required name=search_term_string",
                },
              }),
            }}
          />
        </head>
        <body className={`${jakartaSans.variable} jakarta-sans antialiased`}>
          <ErrorBoundary>
            <Navigator />
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1" role="main">
                {children}
              </main>
              <Toaster />
              <Footer />
            </div>
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}
