'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';

interface HeaderProps {
  locale: string;
}

export default function Header({ locale }: HeaderProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: t('navigation.home'), href: '/' },
    { name: t('navigation.services'), href: '/services' },
    { name: t('navigation.portfolio'), href: '/portfolio' },
    { name: t('navigation.academy'), href: '/academy' },
    { name: t('navigation.about'), href: '/about' },
    { name: t('navigation.contact'), href: '/contact' },
  ];

  const isRTL = locale === 'ar';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-dark-900/80 backdrop-blur-md border-b border-white/10 shadow-glass'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-neon-gradient rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-dark-900 px-3 py-2 rounded-lg border border-cosmic-600/30">
                <span className="text-xl lg:text-2xl font-bold bg-neon-gradient bg-clip-text text-transparent">
                  DANVERSE
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative px-3 py-2 text-sm font-medium transition-all duration-300 group',
                  pathname === item.href
                    ? 'text-cosmic-400'
                    : 'text-gray-300 hover:text-white'
                )}
              >
                <span className="relative z-10">{item.name}</span>
                {pathname === item.href && (
                  <div className="absolute inset-0 bg-cosmic-600/20 rounded-lg border border-cosmic-500/30 backdrop-blur-sm"></div>
                )}
                <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="hidden sm:flex items-center space-x-2">
              <Link
                href={pathname}
                locale="en"
                className={cn(
                  'px-3 py-1 text-sm font-medium rounded-md transition-all duration-300',
                  locale === 'en'
                    ? 'bg-cosmic-600/30 text-cosmic-300 border border-cosmic-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                EN
              </Link>
              <Link
                href={pathname}
                locale="ar"
                className={cn(
                  'px-3 py-1 text-sm font-medium rounded-md transition-all duration-300',
                  locale === 'ar'
                    ? 'bg-cosmic-600/30 text-cosmic-300 border border-cosmic-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                AR
              </Link>
            </div>

            {/* CTA Button */}
            <Link
              href="/contact"
              className="relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-neon-gradient opacity-75 group-hover:opacity-100 transition-opacity duration-300 rounded-lg blur-sm"></div>
              <div className="relative bg-cosmic-600 hover:bg-cosmic-500 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-lg font-medium transition-all duration-300 border border-cosmic-500/30 backdrop-blur-sm">
                {t('navigation.getStarted')}
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors duration-300"
              aria-label="Toggle mobile menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={cn(
                    'block w-5 h-0.5 bg-current transition-all duration-300',
                    isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''
                  )}
                ></span>
                <span
                  className={cn(
                    'block w-5 h-0.5 bg-current transition-all duration-300 mt-1',
                    isMobileMenuOpen ? 'opacity-0' : ''
                  )}
                ></span>
                <span
                  className={cn(
                    'block w-5 h-0.5 bg-current transition-all duration-300 mt-1',
                    isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''
                  )}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'lg:hidden transition-all duration-300 overflow-hidden',
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="py-4 space-y-2 bg-dark-900/90 backdrop-blur-md rounded-lg mt-2 border border-white/10">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'block px-4 py-3 text-base font-medium transition-all duration-300',
                  pathname === item.href
                    ? 'text-cosmic-400 bg-cosmic-600/20 border-r-2 border-cosmic-500'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                )}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Language Switcher */}
            <div className="flex items-center justify-center space-x-4 pt-4 border-t border-white/10">
              <Link
                href={pathname}
                locale="en"
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-all duration-300',
                  locale === 'en'
                    ? 'bg-cosmic-600/30 text-cosmic-300 border border-cosmic-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                English
              </Link>
              <Link
                href={pathname}
                locale="ar"
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-all duration-300',
                  locale === 'ar'
                    ? 'bg-cosmic-600/30 text-cosmic-300 border border-cosmic-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                العربية
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

