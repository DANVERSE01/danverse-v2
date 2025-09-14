import type { Metadata } from "next";
import { Inter, Noto_Naskh_Arabic } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const notoNaskhArabic = Noto_Naskh_Arabic({ 
  subsets: ["arabic"],
  variable: "--font-noto-naskh-arabic",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "DANVERSE | Digital Innovation Accelerator",
  description: "Where innovation accelerates your success. Global Creative Designs, Brand Transformation, End-to-End Campaigns, High-End Web Development, Full-Stack Development, DANVERSE Academy.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const isRTL = locale === 'ar';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body className={`${inter.variable} ${notoNaskhArabic.variable} ${
        isRTL ? 'font-noto-naskh-arabic' : 'font-inter'
      } antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

