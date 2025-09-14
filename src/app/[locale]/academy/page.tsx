import { useTranslations } from 'next-intl';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DANVERSE Academy | Digital Skills Training',
  description: 'Join DANVERSE Academy for comprehensive training in web development, design, and digital marketing.',
};

export default function AcademyPage() {
  const t = useTranslations('academy');
  const tCommon = useTranslations('common');

  const courses = [
    {
      id: 'webDev',
      icon: '💻',
      color: 'cosmic-purple',
      popular: true
    },
    {
      id: 'design',
      icon: '🎨',
      color: 'cosmic-blue',
      popular: false
    },
    {
      id: 'marketing',
      icon: '📈',
      color: 'cosmic-cyan',
      popular: false
    }
  ];

  const features = [
    { icon: '👨‍🏫', key: 0 },
    { icon: '🛠️', key: 1 },
    { icon: '🏆', key: 2 },
    { icon: '💼', key: 3 },
    { icon: '♾️', key: 4 },
    { icon: '🤝', key: 5 }
  ];

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

      {/* Pre-Enrollment Section */}
      <section className="py-20 px-4 bg-dark-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Pre-Enrollment Info */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cosmic-purple via-cosmic-blue to-cosmic-cyan bg-clip-text text-transparent">
                {t('preEnrollment.title')}
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                {t('preEnrollment.subtitle')}
              </p>
              <p className="text-gray-400 mb-8 leading-relaxed">
                {t('preEnrollment.description')}
              </p>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-cosmic-cyan mb-4">Benefits:</h3>
                {t.raw('preEnrollment.benefits').map((benefit: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-cosmic-purple to-cosmic-blue rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pre-Enrollment Form */}
            <div>
              <div className="bg-dark-900/50 backdrop-blur-sm border border-cosmic-purple/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-center text-white">
                  {t('preEnrollment.form.submit')}
                </h3>
                
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('preEnrollment.form.name')}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cosmic-purple focus:outline-none transition-colors duration-300"
                      placeholder={t('preEnrollment.form.name')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('preEnrollment.form.email')}
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cosmic-purple focus:outline-none transition-colors duration-300"
                      placeholder={t('preEnrollment.form.email')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('preEnrollment.form.phone')}
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cosmic-purple focus:outline-none transition-colors duration-300"
                      placeholder={t('preEnrollment.form.phone')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('preEnrollment.form.interest')}
                    </label>
                    <select className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white focus:border-cosmic-purple focus:outline-none transition-colors duration-300">
                      <option value="">{t('preEnrollment.form.interest')}</option>
                      <option value="webDev">{t('courses.webDev.title')}</option>
                      <option value="design">{t('courses.design.title')}</option>
                      <option value="marketing">{t('courses.marketing.title')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('preEnrollment.form.experience')}
                    </label>
                    <select className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white focus:border-cosmic-purple focus:outline-none transition-colors duration-300">
                      <option value="">{t('preEnrollment.form.experience')}</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('preEnrollment.form.goals')}
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cosmic-purple focus:outline-none transition-colors duration-300 resize-none"
                      placeholder={t('preEnrollment.form.goals')}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-cosmic-purple to-cosmic-blue rounded-lg text-white font-semibold hover:from-cosmic-purple/80 hover:to-cosmic-blue/80 transition-all duration-300 hover:transform hover:scale-105"
                  >
                    {t('preEnrollment.form.submit')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cosmic-purple via-cosmic-blue to-cosmic-cyan bg-clip-text text-transparent">
              {t('courses.title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="group relative">
                {course.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="px-4 py-2 bg-gradient-to-r from-neon-pink to-neon-orange rounded-full text-white text-sm font-bold">
                      Popular
                    </span>
                  </div>
                )}
                <div className={`bg-dark-900/50 backdrop-blur-sm border border-${course.color}/20 rounded-2xl p-8 h-full hover:border-${course.color}/40 transition-all duration-300 hover:transform hover:scale-105`}>
                  <div className={`w-16 h-16 bg-gradient-to-br from-${course.color} to-cosmic-blue rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{course.icon}</span>
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 text-${course.color}`}>
                    {t(`courses.${course.id}.title`)}
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {t(`courses.${course.id}.description`)}
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-cosmic-cyan">⏱️</span>
                      <span className="text-gray-300">{t(`courses.${course.id}.duration`)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-neon-green">📊</span>
                      <span className="text-gray-300">{t(`courses.${course.id}.level`)}</span>
                    </div>
                  </div>
                  <button className={`w-full px-4 py-3 bg-gradient-to-r from-${course.color} to-cosmic-blue rounded-lg text-white font-medium hover:from-${course.color}/80 hover:to-cosmic-blue/80 transition-all duration-300`}>
                    {tCommon('comingSoon')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-dark-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cosmic-purple via-cosmic-blue to-cosmic-cyan bg-clip-text text-transparent">
              {t('features.title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.key} className="group">
                <div className="bg-dark-900/50 backdrop-blur-sm border border-cosmic-purple/20 rounded-2xl p-6 text-center hover:border-cosmic-purple/40 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-cosmic-purple to-cosmic-blue rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <p className="text-white font-semibold">
                    {t(`features.items.${feature.key}`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

