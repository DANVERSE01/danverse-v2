import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-indigo-600">DANVERSE</h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                  {t('navigation.home')}
                </a>
                <a href="#" className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                  {t('navigation.services')}
                </a>
                <a href="#" className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                  {t('navigation.portfolio')}
                </a>
                <a href="#" className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                  {t('navigation.academy')}
                </a>
                <a href="#" className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                  {t('navigation.about')}
                </a>
                <a href="#" className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                  {t('navigation.contact')}
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                {t('navigation.getStarted')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors">
            {t('hero.cta')}
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('services.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Global Creative Designs */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-3">{t('services.globalCreative.title')}</h3>
              <p className="text-gray-600">{t('services.globalCreative.description')}</p>
            </div>

            {/* Brand Transformation */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold mb-3">{t('services.brandTransformation.title')}</h3>
              <p className="text-gray-600">{t('services.brandTransformation.description')}</p>
            </div>

            {/* End-to-End Campaigns */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-4xl mb-4">📢</div>
              <h3 className="text-xl font-semibold mb-3">{t('services.endToEndCampaigns.title')}</h3>
              <p className="text-gray-600">{t('services.endToEndCampaigns.description')}</p>
            </div>

            {/* High-End Web Development */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-xl font-semibold mb-3">{t('services.webDevelopment.title')}</h3>
              <p className="text-gray-600">{t('services.webDevelopment.description')}</p>
            </div>

            {/* Full-Stack Development */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-xl font-semibold mb-3">{t('services.fullStack.title')}</h3>
              <p className="text-gray-600">{t('services.fullStack.description')}</p>
            </div>

            {/* DANVERSE Academy */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold mb-3">{t('services.academy.title')}</h3>
              <p className="text-gray-600">{t('services.academy.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">{t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}

