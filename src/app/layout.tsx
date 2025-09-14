import type { Metadata } from "next";
import { routing } from '@/i18n/routing';

export const metadata: Metadata = {
  title: "DANVERSE | Digital Innovation Accelerator",
  description: "Where innovation accelerates your success. Global Creative Designs, Brand Transformation, End-to-End Campaigns, High-End Web Development, Full-Stack Development, DANVERSE Academy.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

