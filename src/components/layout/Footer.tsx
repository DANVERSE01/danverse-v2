'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations();

  const services = [
    { name: t('services.globalCreative.title'), href: '/services#global-creative' },
    { name: t('services.brandTransformation.title'), href: '/services#brand-transformation' },
    { name: t('services.endToEndCampaigns.title'), href: '/services#campaigns' },
    { name: t('services.webDevelopment.title'), href: '/services#web-development' },
    { name: t('services.fullStack.title'), href: '/services#full-stack' },
    { name: t('services.academy.title'), href: '/academy' },
  ];

  const company = [
    { name: t('navigation.about'), href: '/about' },
    { name: t('navigation.portfolio'), href: '/portfolio' },
    { name: t('navigation.contact'), href: '/contact' },
    { name: 'Pre-enrollment', href: '/pre-enrollment' },
  ];

  const legal = [
    { name: t('footer.privacyPolicy'), href: '/privacy' },
    { name: t('footer.terms'), href: '/terms' },
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/muhammedd_adel',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.928-.438-.928-.928s.438-.928.928-.928.928.438.928.928-.438.928-.928.928zm-3.323 9.781c-1.297 0-2.448-.49-3.323-1.297-.928-.875-1.418-2.026-1.418-3.323s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297z"/>
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      href: 'https://wa.me/201207346648',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      ),
    },
    {
      name: 'Telegram',
      href: 'https://t.me/+201207346648',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative bg-dark-950 border-t border-white/10">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-cosmic-gradient opacity-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-neon-gradient rounded-lg blur-sm opacity-75"></div>
                  <div className="relative bg-dark-900 px-3 py-2 rounded-lg border border-cosmic-600/30">
                    <span className="text-xl font-bold bg-neon-gradient bg-clip-text text-transparent">
                      DANVERSE
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {locale === 'ar' 
                  ? 'نحوّل الأعمال من خلال الحلول الرقمية المتطورة والاستراتيجيات الإبداعية التي تحقق نتائج قابلة للقياس.'
                  : 'We transform businesses through cutting-edge digital solutions and creative strategies that drive measurable results.'
                }
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-2 rounded-lg bg-white/5 border border-white/10 hover:border-cosmic-500/50 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-cosmic-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative text-gray-400 group-hover:text-cosmic-300 transition-colors duration-300">
                      {social.icon}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-white font-semibold mb-6 text-lg">
                {t('footer.services')}
              </h3>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service.href}>
                    <Link
                      href={service.href as any}
                      className="text-gray-400 hover:text-cosmic-300 transition-colors duration-300 text-sm"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-semibold mb-6 text-lg">
                {t('footer.company')}
              </h3>
              <ul className="space-y-3">
                {company.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href as any}
                      className="text-gray-400 hover:text-cosmic-300 transition-colors duration-300 text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Legal */}
            <div>
              <h3 className="text-white font-semibold mb-6 text-lg">
                {t('contact.title')}
              </h3>
              <div className="space-y-4 mb-8">
                <div>
                  <p className="text-gray-400 text-sm">
                    {t('contact.info.email')}
                  </p>
                  <a
                    href="mailto:danverseai@outlook.com"
                    className="text-cosmic-300 hover:text-cosmic-200 transition-colors duration-300 text-sm"
                  >
                    danverseai@outlook.com
                  </a>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">
                    {t('contact.info.whatsapp')}
                  </p>
                  <a
                    href="https://wa.me/201207346648"
                    className="text-cosmic-300 hover:text-cosmic-200 transition-colors duration-300 text-sm"
                  >
                    +20 1207346648
                  </a>
                </div>
              </div>

              <h4 className="text-white font-medium mb-4">
                {t('footer.legal')}
              </h4>
              <ul className="space-y-3">
                {legal.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href as any}
                      className="text-gray-400 hover:text-cosmic-300 transition-colors duration-300 text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center space-x-6">
              <span className="text-gray-500 text-xs">
                Made with ❤️ using Next.js & Supabase
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

