import Header from '@/components/layout/Header';
import Hero from '@/components/layout/Hero';
import ServicesSection from '@/components/layout/ServicesSection';
import Footer from '@/components/layout/Footer';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-dark-950">
      <Header locale={locale} />
      <main>
        <Hero locale={locale} />
        <ServicesSection locale={locale} />
      </main>
      <Footer locale={locale} />
    </div>
  );
}

