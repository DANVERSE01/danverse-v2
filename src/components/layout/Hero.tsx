'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useState, useEffect } from 'react';

interface HeroProps {
  locale: string;
}

export default function Hero({ locale }: HeroProps) {
  const t = useTranslations();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-950">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-cosmic-gradient"></div>
      
      {/* Dynamic Gradient Orbs */}
      <div 
        className="absolute w-96 h-96 bg-cosmic-600/30 rounded-full blur-3xl animate-float"
        style={{
          left: `${20 + mousePosition.x * 0.1}%`,
          top: `${30 + mousePosition.y * 0.1}%`,
        }}
      ></div>
      <div 
        className="absolute w-80 h-80 bg-neon-purple/20 rounded-full blur-3xl animate-float"
        style={{
          right: `${15 + mousePosition.x * 0.15}%`,
          bottom: `${25 + mousePosition.y * 0.15}%`,
          animationDelay: '1s',
        }}
      ></div>
      <div 
        className="absolute w-64 h-64 bg-neon-cyan/20 rounded-full blur-3xl animate-float"
        style={{
          left: `${60 + mousePosition.x * 0.08}%`,
          top: `${60 + mousePosition.y * 0.08}%`,
          animationDelay: '2s',
        }}
      ></div>

      {/* Starfield Effect */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          ></div>
        ))}
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8 animate-fade-in">
          {/* Logo/Brand */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-neon-gradient rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-glow"></div>
              <div className="relative bg-dark-900/80 backdrop-blur-sm px-8 py-4 rounded-2xl border border-cosmic-500/30">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-neon-gradient bg-clip-text text-transparent">
                  DANVERSE
                </h1>
              </div>
            </div>
          </div>

          {/* Main Headline */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              <span className="block animate-slide-up">
                {locale === 'ar' ? 'ادخل إلى' : 'Enter'}{' '}
                <span className="bg-neon-gradient bg-clip-text text-transparent">
                  DANVERSE
                </span>
              </span>
              <span className="block animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {locale === 'ar' 
                  ? 'حيث الابتكار يسرّع نجاحك'
                  : 'Where innovation accelerates your success'
                }
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.4s' }}>
              {t('hero.subtitle')}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <Link
              href="/services"
              className="group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-neon-gradient opacity-75 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-sm"></div>
              <div className="relative bg-cosmic-600 hover:bg-cosmic-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-cosmic-500/30 backdrop-blur-sm transform group-hover:scale-105">
                {t('hero.cta')}
              </div>
            </Link>

            <Link
              href="/portfolio"
              className="group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors duration-300 rounded-xl"></div>
              <div className="relative text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-white/20 backdrop-blur-sm transform group-hover:scale-105">
                {locale === 'ar' ? 'شاهد أعمالنا' : 'View Our Work'}
              </div>
            </Link>
          </div>

          {/* Stats or Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-slide-up" style={{ animationDelay: '0.8s' }}>
            {[
              { 
                number: '100+', 
                label: locale === 'ar' ? 'مشروع مكتمل' : 'Projects Completed',
                icon: '🚀'
              },
              { 
                number: '50+', 
                label: locale === 'ar' ? 'عميل راضٍ' : 'Happy Clients',
                icon: '⭐'
              },
              { 
                number: '24/7', 
                label: locale === 'ar' ? 'دعم متواصل' : 'Support Available',
                icon: '💬'
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="group relative p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cosmic-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-cosmic-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative text-center">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}

