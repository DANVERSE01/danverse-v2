import type { Metadata } from "next";
import { routing } from '@/i18n/routing';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://danverse.ai'),
  title: {
    default: "DANVERSE | Digital Innovation Accelerator",
    template: "%s | DANVERSE"
  },
  description: "Transform your digital presence with DANVERSE. We specialize in cutting-edge web development, digital marketing, and brand transformation. From startups to enterprises, we accelerate your digital innovation journey.",
  keywords: [
    "digital innovation",
    "web development", 
    "digital marketing",
    "brand transformation",
    "startup acceleration",
    "enterprise solutions",
    "DANVERSE",
    "digital agency",
    "technology consulting",
    "digital transformation"
  ],
  authors: [{ name: "DANVERSE Team" }],
  creator: "DANVERSE",
  publisher: "DANVERSE",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_EG"],
    url: "/",
    siteName: "DANVERSE",
    title: "DANVERSE | Digital Innovation Accelerator",
    description: "Transform your digital presence with cutting-edge solutions. Web development, digital marketing, and brand transformation services.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DANVERSE - Digital Innovation Accelerator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DANVERSE | Digital Innovation Accelerator",
    description: "Transform your digital presence with cutting-edge solutions. Web development, digital marketing, and brand transformation services.",
    images: ["/og-image.jpg"],
    creator: "@danverse",
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
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "ar-EG": "/ar",
    },
  },
  category: "technology",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DANVERSE",
  alternateName: "DANVERSE Digital Innovation Accelerator",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://danverse.ai",
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://danverse.ai"}/logo.png`,
  description: "Digital innovation accelerator specializing in web development, digital marketing, and brand transformation services.",
  foundingDate: "2024",
  founders: [
    {
      "@type": "Person",
      name: "Mohammed Adel",
      jobTitle: "Founder & CEO",
      sameAs: ["https://instagram.com/mohammed.adel"]
    }
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "EG",
    addressRegion: "Cairo"
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+20-1207346648",
    contactType: "customer service",
    availableLanguage: ["English", "Arabic"]
  },
  sameAs: [
    "https://instagram.com/danverse",
    "https://linkedin.com/company/danverse",
    "https://twitter.com/danverse"
  ],
  services: [
    {
      "@type": "Service",
      name: "Web Development",
      description: "Custom website and web application development"
    },
    {
      "@type": "Service", 
      name: "Digital Marketing",
      description: "Comprehensive digital marketing and social media management"
    },
    {
      "@type": "Service",
      name: "Brand Transformation",
      description: "Complete brand identity and visual design services"
    }
  ],
  offers: [
    {
      "@type": "Offer",
      name: "Starter Package",
      price: "2999",
      priceCurrency: "USD",
      description: "Professional website design & development with basic brand identity"
    },
    {
      "@type": "Offer",
      name: "Professional Package",
      price: "7999", 
      priceCurrency: "USD",
      description: "Advanced website with complete brand identity & digital marketing"
    },
    {
      "@type": "Offer",
      name: "Enterprise Package",
      price: "19999",
      priceCurrency: "USD", 
      description: "Custom web application with full brand transformation & ongoing support"
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FF2BD7" />
        <meta name="color-scheme" content="dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

