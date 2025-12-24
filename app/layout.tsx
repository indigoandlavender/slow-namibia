import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  metadataBase: new URL("https://slownamibia.com"),
  title: {
    default: "Slow Namibia | Private Journeys Through Namibia",
    template: "%s | Slow Namibia",
  },
  description: "Thoughtful private journeys across Namibia — designed for travellers who prefer ease and deep immersion. From the Skeleton Coast to the red dunes of Sossusvlei, crafted around what matters to you.",
  keywords: ["namibia private tours", "luxury namibia travel", "namibia journeys", "sossusvlei tours", "etosha safari", "skeleton coast", "namibia itinerary", "private guide namibia", "namibia travel agency"],
  authors: [{ name: "Slow Namibia" }],
  creator: "Slow Namibia",
  publisher: "Slow Namibia",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://slownamibia.com",
    siteName: "Slow Namibia",
    title: "Slow Namibia | Private Journeys Through Namibia",
    description: "Thoughtful private journeys across Namibia — designed for travellers who prefer ease and deep immersion.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Slow Namibia - Private journeys through Namibia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Slow Namibia | Private Journeys Through Namibia",
    description: "Thoughtful private journeys across Namibia — designed for travellers who prefer ease and deep immersion.",
    images: ["/og-image.jpg"],
  },
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
  alternates: {
    canonical: "https://slownamibia.com",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-643KCNHE59"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-643KCNHE59');
          `}
        </Script>
      </head>
      <body>
        <StructuredData />
        <Header />
        <main>{children}</main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
