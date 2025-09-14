'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface BuyPageProps {
  params: {
    locale: string;
  };
}

export default function BuyPage({ params }: BuyPageProps) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [orderStep, setOrderStep] = useState<'plan' | 'details' | 'payment'>('plan');
  const [orderData, setOrderData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCode, setOrderCode] = useState<string>('');

  const plans = {
    starter: {
      name: t('offers.plans.starter.name'),
      price: '$2,999',
      originalPrice: '$3,999',
      description: t('offers.plans.starter.description'),
      color: 'neon-blue',
      gradient: 'from-neon-blue to-neon-cyan',
    },
    professional: {
      name: t('offers.plans.professional.name'),
      price: '$7,999',
      originalPrice: '$9,999',
      description: t('offers.plans.professional.description'),
      color: 'neon-pink',
      gradient: 'from-neon-pink to-neon-purple',
    },
    enterprise: {
      name: t('offers.plans.enterprise.name'),
      price: '$19,999',
      originalPrice: '$24,999',
      description: t('offers.plans.enterprise.description'),
      color: 'neon-gold',
      gradient: 'from-neon-gold to-neon-yellow',
    },
  };

  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (planParam && plans[planParam as keyof typeof plans]) {
      setSelectedPlan(planParam);
      setOrderStep('details');
    }
  }, [searchParams]);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setOrderStep('details');
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: selectedPlan,
          ...orderData,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setOrderCode(result.orderCode);
        setOrderStep('payment');
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPlanData = selectedPlan ? plans[selectedPlan as keyof typeof plans] : null;

  return (
    <div className="min-h-screen bg-dark-950 cosmic-bg pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-neon-gradient bg-clip-text text-transparent">
            {t('buy.title')}
          </h1>
          <p className="text-xl text-gray-300">
            {t('buy.subtitle')}
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {['plan', 'details', 'payment'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    orderStep === step
                      ? 'bg-neon-pink text-white shadow-neon-pink'
                      : index < ['plan', 'details', 'payment'].indexOf(orderStep)
                      ? 'bg-neon-green text-white'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
                {index < 2 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      index < ['plan', 'details', 'payment'].indexOf(orderStep)
                        ? 'bg-neon-green'
                        : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Plan Selection */}
        {orderStep === 'plan' && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              {t('buy.selectPlan')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(plans).map(([planId, plan]) => (
                <motion.div
                  key={planId}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePlanSelect(planId)}
                  className="cursor-pointer p-6 rounded-xl border-2 border-gray-700 hover:border-neon-pink glass-dark transition-all duration-300"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-white">{plan.price}</span>
                    <span className="text-sm text-gray-500 line-through">{plan.originalPrice}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                  <button className="w-full py-2 px-4 bg-neon-pink text-white rounded-lg font-semibold hover:bg-neon-pink/80 transition-colors">
                    {t('buy.selectThis')}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Order Details */}
        {orderStep === 'details' && selectedPlanData && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Selected Plan Summary */}
              <div className="glass-dark p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">{t('buy.orderSummary')}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('buy.plan')}:</span>
                    <span className="text-white font-semibold">{selectedPlanData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('buy.price')}:</span>
                    <div className="text-right">
                      <span className="text-white font-bold text-lg">{selectedPlanData.price}</span>
                      <span className="text-gray-500 line-through ml-2 text-sm">{selectedPlanData.originalPrice}</span>
                    </div>
                  </div>
                  <hr className="border-gray-700" />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">{t('buy.total')}:</span>
                    <span className="text-neon-pink">{selectedPlanData.price}</span>
                  </div>
                </div>
              </div>

              {/* Order Form */}
              <form onSubmit={handleOrderSubmit} className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">{t('buy.contactDetails')}</h3>
                
                <div>
                  <label className="block text-gray-300 mb-2">{t('buy.form.name')} *</label>
                  <input
                    type="text"
                    required
                    value={orderData.name}
                    onChange={(e) => setOrderData({ ...orderData, name: e.target.value })}
                    className="w-full p-3 bg-dark-800 border border-gray-700 rounded-lg text-white focus:border-neon-pink focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">{t('buy.form.email')} *</label>
                  <input
                    type="email"
                    required
                    value={orderData.email}
                    onChange={(e) => setOrderData({ ...orderData, email: e.target.value })}
                    className="w-full p-3 bg-dark-800 border border-gray-700 rounded-lg text-white focus:border-neon-pink focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">{t('buy.form.phone')} *</label>
                  <input
                    type="tel"
                    required
                    value={orderData.phone}
                    onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
                    className="w-full p-3 bg-dark-800 border border-gray-700 rounded-lg text-white focus:border-neon-pink focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">{t('buy.form.company')}</label>
                  <input
                    type="text"
                    value={orderData.company}
                    onChange={(e) => setOrderData({ ...orderData, company: e.target.value })}
                    className="w-full p-3 bg-dark-800 border border-gray-700 rounded-lg text-white focus:border-neon-pink focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">{t('buy.form.notes')}</label>
                  <textarea
                    rows={3}
                    value={orderData.notes}
                    onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })}
                    className="w-full p-3 bg-dark-800 border border-gray-700 rounded-lg text-white focus:border-neon-pink focus:outline-none"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setOrderStep('plan')}
                    className="flex-1 py-3 px-6 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    {t('buy.back')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-6 bg-neon-pink text-white rounded-lg font-semibold hover:bg-neon-pink/80 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? t('buy.processing') : t('buy.continue')}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Step 3: Payment Instructions */}
        {orderStep === 'payment' && orderCode && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="glass-dark p-8 rounded-xl border border-gray-700 max-w-2xl mx-auto">
              <div className="mb-6">
                <div className="w-16 h-16 bg-neon-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{t('buy.orderCreated')}</h2>
                <p className="text-gray-300">{t('buy.orderCode')}: <span className="text-neon-pink font-mono text-lg">{orderCode}</span></p>
              </div>

              <div className="text-left space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">{t('buy.paymentInstructions')}</h3>
                  <p className="text-gray-300 mb-4">{t('buy.paymentDescription')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-dark-800 rounded-lg">
                    <h4 className="font-semibold text-neon-blue mb-2">InstaPay</h4>
                    <p className="text-sm text-gray-400">@danverse_pay</p>
                  </div>
                  <div className="p-4 bg-dark-800 rounded-lg">
                    <h4 className="font-semibold text-neon-green mb-2">Vodafone Cash</h4>
                    <p className="text-sm text-gray-400">+20 1207346648</p>
                  </div>
                  <div className="p-4 bg-dark-800 rounded-lg">
                    <h4 className="font-semibold text-neon-gold mb-2">Bank Transfer</h4>
                    <p className="text-sm text-gray-400">Contact for details</p>
                  </div>
                  <div className="p-4 bg-dark-800 rounded-lg">
                    <h4 className="font-semibold text-neon-pink mb-2">PayPal</h4>
                    <p className="text-sm text-gray-400">paypal.me/danverse</p>
                  </div>
                </div>

                <div className="bg-neon-yellow/10 border border-neon-yellow/30 rounded-lg p-4">
                  <p className="text-neon-yellow text-sm">
                    <strong>{t('buy.important')}:</strong> {t('buy.includeOrderCode')}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/"
                  className="inline-block py-3 px-6 bg-neon-pink text-white rounded-lg font-semibold hover:bg-neon-pink/80 transition-colors"
                >
                  {t('buy.backToHome')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

