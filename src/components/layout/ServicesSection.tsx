'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useState } from 'react';

interface ServicesSectionProps {
  locale: string;
}

export default function ServicesSection({ locale }: ServicesSectionProps) {
  const t = useTranslations();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const services = [
    {
      id: 1,
      title: t('services.globalCreative.title'),
      description: t('services.globalCreative.description'),
      icon: '🎨',
      gradient: 'from-neon-pink to-neon-purple',
      href: '/services#global-creative',
    },
    {
      id: 2,
      title: t('services.brandTransformation.title'),
      description: t('services.brandTransformation.description'),
      icon: '🔄',
      gradient: 'from-neon-blue to-neon-cyan',
      href: '/services#brand-transformation',
    },
    {
      id: 3,
      title: t('services.endToEndCampaigns.title'),
      description: t('services.endToEndCampaigns.description'),
      icon: '📢',
      gradient: 'from-neon-green to-neon-cyan',
      href: '/services#campaigns',
    },
    {
      id: 4,
      title: t('services.webDevelopment.title'),
      description: t('services.webDevelopment.description'),
      icon: '💻',
      gradient: 'from-cosmic-500 to-cosmic-700',
      href: '/services#web-development',
    },
    {
      id: 5,
      title: t('services.fullStack.title'),
      description: t('services.fullStack.description'),
      icon: '⚙️',
      gradient: 'from-neon-purple to-cosmic-600',
      href: '/services#full-stack',
    },
    {
      id: 6,
      title: t('services.academy.title'),
      description: t('services.academy.description'),
      icon: '🎓',
      gradient: 'from-accent to-accent-dark',
      href: '/academy',
    },
  ];

  return (
    <section className="relative py-20 lg:py-32 bg-dark-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.1),transparent_70%)]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            <span className="bg-neon-gradient bg-clip-text text-transparent">
              {t('services.title')}
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {locale === 'ar' 
              ? 'نقدم مجموعة شاملة من الخدمات الرقمية المتطورة لتحويل أعمالك وتحقيق أهدافك'
              : 'We offer a comprehensive suite of cutting-edge digital services to transform your business and achieve your goals'
            }
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="group relative"
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Card Background Glow */}
              <div 
                className={`absolute inset-0 bg-gradient-to-r ${service.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
              ></div>
              
              {/* Main Card */}
              <div className="relative h-full p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 group-hover:border-white/20 transition-all duration-500 transform group-hover:scale-105">
                {/* Service Icon */}
                <div className="relative mb-6">
                  <div 
                    className={`absolute inset-0 bg-gradient-to-r ${service.gradient} rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300`}
                  ></div>
                  <div className="relative w-16 h-16 bg-dark-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
                    <span className="text-3xl">{service.icon}</span>
                  </div>
                </div>

                {/* Service Content */}
                <div className="space-y-4">
                  <h3 className="text-xl lg:text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed text-sm lg:text-base">
                    {service.description}
                  </p>
                </div>

                {/* Learn More Link */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <Link
                    href={service.href as any}
                    className="inline-flex items-center text-cosmic-300 hover:text-white transition-colors duration-300 text-sm font-medium group/link"
                  >
                    <span>
                      {locale === 'ar' ? 'اعرف المزيد' : 'Learn More'}
                    </span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1 ${
                        locale === 'ar' ? 'rotate-180 mr-2' : 'ml-2'
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 lg:mt-20">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-neon-gradient rounded-xl blur-lg opacity-50"></div>
            <Link
              href="/services"
              className="relative bg-dark-800/80 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg border border-cosmic-500/30 hover:border-cosmic-400/50 transition-all duration-300 transform hover:scale-105"
            >
              {locale === 'ar' ? 'استكشف جميع خدماتنا' : 'Explore All Our Services'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

