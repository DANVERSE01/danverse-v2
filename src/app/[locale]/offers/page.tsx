'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function OffersPage() {
  const t = useTranslations();
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'starter',
      name: t('offers.plans.starter.name'),
      price: '$2,999',
      originalPrice: '$3,999',
      description: t('offers.plans.starter.description'),
      features: [
        t('offers.plans.starter.features.0'),
        t('offers.plans.starter.features.1'),
        t('offers.plans.starter.features.2'),
        t('offers.plans.starter.features.3'),
        t('offers.plans.starter.features.4'),
      ],
      color: 'neon-blue',
      gradient: 'from-neon-blue to-neon-cyan',
      popular: false,
    },
    {
      id: 'professional',
      name: t('offers.plans.professional.name'),
      price: '$7,999',
      originalPrice: '$9,999',
      description: t('offers.plans.professional.description'),
      features: [
        t('offers.plans.professional.features.0'),
        t('offers.plans.professional.features.1'),
        t('offers.plans.professional.features.2'),
        t('offers.plans.professional.features.3'),
        t('offers.plans.professional.features.4'),
        t('offers.plans.professional.features.5'),
        t('offers.plans.professional.features.6'),
      ],
      color: 'neon-pink',
      gradient: 'from-neon-pink to-neon-purple',
      popular: true,
    },
    {
      id: 'enterprise',
      name: t('offers.plans.enterprise.name'),
      price: '$19,999',
      originalPrice: '$24,999',
      description: t('offers.plans.enterprise.description'),
      features: [
        t('offers.plans.enterprise.features.0'),
        t('offers.plans.enterprise.features.1'),
        t('offers.plans.enterprise.features.2'),
        t('offers.plans.enterprise.features.3'),
        t('offers.plans.enterprise.features.4'),
        t('offers.plans.enterprise.features.5'),
        t('offers.plans.enterprise.features.6'),
        t('offers.plans.enterprise.features.7'),
      ],
      color: 'neon-gold',
      gradient: 'from-neon-gold to-neon-yellow',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-dark-950 cosmic-bg">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-neon-gradient bg-clip-text text-transparent">
              {t('offers.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12">
              {t('offers.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                onHoverStart={() => setHoveredPlan(plan.id)}
                onHoverEnd={() => setHoveredPlan(null)}
                className={`relative group ${
                  plan.popular ? 'lg:scale-105 lg:-mt-8' : ''
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-neon-pink text-white px-6 py-2 rounded-full text-sm font-semibold shadow-neon-pink">
                      {t('offers.popular')}
                    </div>
                  </div>
                )}

                {/* Plan Card */}
                <div
                  className={`relative h-full p-8 rounded-2xl border-2 transition-all duration-500 ${
                    hoveredPlan === plan.id
                      ? `border-${plan.color} shadow-${plan.color} scale-105`
                      : 'border-gray-700 hover:border-gray-600'
                  } glass-dark backdrop-blur-xl`}
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-5 rounded-2xl transition-opacity duration-500 ${
                      hoveredPlan === plan.id ? 'opacity-10' : ''
                    }`}
                  />

                  <div className="relative z-10">
                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-gray-400 mb-6">{plan.description}</p>
                      
                      {/* Pricing */}
                      <div className="mb-6">
                        <div className="flex items-center justify-center gap-3 mb-2">
                          <span className="text-4xl md:text-5xl font-bold text-white">
                            {plan.price}
                          </span>
                          <span className="text-xl text-gray-500 line-through">
                            {plan.originalPrice}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">
                          {t('offers.oneTime')}
                        </p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-8">
                      <ul className="space-y-4">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full bg-${plan.color} flex-shrink-0 mt-0.5 shadow-${plan.color}`} />
                            <span className="text-gray-300 text-sm leading-relaxed">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={`/buy?plan=${plan.id}` as any}
                      className="block w-full"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                          plan.popular
                            ? `bg-gradient-to-r ${plan.gradient} text-white shadow-neon hover:shadow-neon-lg`
                            : `border-2 border-${plan.color} text-${plan.color} hover:bg-${plan.color} hover:text-white hover:shadow-${plan.color}`
                        }`}
                      >
                        {t('offers.startNow')}
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="glass-dark p-8 rounded-2xl border border-gray-700"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              {t('offers.guarantee.title')}
            </h3>
            <p className="text-gray-300 mb-6">
              {t('offers.guarantee.description')}
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-green rounded-full" />
                {t('offers.guarantee.features.0')}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-blue rounded-full" />
                {t('offers.guarantee.features.1')}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-pink rounded-full" />
                {t('offers.guarantee.features.2')}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

