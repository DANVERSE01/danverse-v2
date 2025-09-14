import { useTranslations } from 'next-intl';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About DANVERSE | Digital Innovation Leaders',
  description: 'Learn about DANVERSE, our mission, vision, values, and the team behind cutting-edge digital solutions.',
};

export default function AboutPage() {
  const t = useTranslations('about');
  const tCommon = useTranslations('common');

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cosmic-purple/20 via-cosmic-blue/10 to-cosmic-cyan/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.2),transparent_50%)]"></div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cosmic-purple via-cosmic-blue to-cosmic-cyan bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
          <p className="text-lg text-gray-400 max-w-4xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="group">
              <div className="bg-dark-900/50 backdrop-blur-sm border border-cosmic-purple/20 rounded-2xl p-8 h-full hover:border-cosmic-purple/40 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-cosmic-purple to-cosmic-blue rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-cosmic-purple">{t('mission.title')}</h3>
                <p className="text-gray-300 leading-relaxed">{t('mission.description')}</p>
              </div>
            </div>

            {/* Vision */}
            <div className="group">
              <div className="bg-dark-900/50 backdrop-blur-sm border border-cosmic-blue/20 rounded-2xl p-8 h-full hover:border-cosmic-blue/40 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-cosmic-blue to-cosmic-cyan rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-cosmic-blue">{t('vision.title')}</h3>
                <p className="text-gray-300 leading-relaxed">{t('vision.description')}</p>
              </div>
            </div>

            {/* Values */}
            <div className="group">
              <div className="bg-dark-900/50 backdrop-blur-sm border border-cosmic-cyan/20 rounded-2xl p-8 h-full hover:border-cosmic-cyan/40 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-cosmic-cyan to-neon-green rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-cosmic-cyan">{t('values.title')}</h3>
                <div className="space-y-3">
                  {t.raw('values.items').map((value: any, index: number) => (
                    <div key={index} className="border-l-2 border-cosmic-cyan/30 pl-4">
                      <h4 className="font-semibold text-white">{value.name}</h4>
                      <p className="text-sm text-gray-400">{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-dark-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cosmic-purple via-cosmic-blue to-cosmic-cyan bg-clip-text text-transparent">
              {t('team.title')}
            </h2>
          </div>

          <div className="flex justify-center">
            <div className="group max-w-md">
              <div className="bg-dark-900/50 backdrop-blur-sm border border-cosmic-purple/20 rounded-2xl p-8 text-center hover:border-cosmic-purple/40 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-32 h-32 bg-gradient-to-br from-cosmic-purple via-cosmic-blue to-cosmic-cyan rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                  MA
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">{t('team.founder.name')}</h3>
                <p className="text-cosmic-purple font-semibold mb-4">{t('team.founder.role')}</p>
                <p className="text-gray-300 mb-6 leading-relaxed">{t('team.founder.description')}</p>
                <a 
                  href="https://instagram.com/muhammedd_adel" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-cosmic-purple hover:text-cosmic-blue transition-colors duration-300"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  {t('team.founder.social.instagram')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cosmic-purple via-cosmic-blue to-cosmic-cyan bg-clip-text text-transparent">
              {t('achievements.title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.raw('achievements.items').map((achievement: string, index: number) => (
              <div key={index} className="group">
                <div className="bg-dark-900/50 backdrop-blur-sm border border-cosmic-purple/20 rounded-2xl p-6 text-center hover:border-cosmic-purple/40 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-cosmic-purple to-cosmic-blue rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold">{achievement}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

