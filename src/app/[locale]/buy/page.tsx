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
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [copiedField, setCopiedField] = useState<string>('');

  const plans = {
    starter: {
      name: t('offers.plans.starter.name'),
      price: '2,999 EGP',
      originalPrice: '3,999 EGP',
      description: t('offers.plans.starter.description'),
      color: 'neon-blue',
      gradient: 'from-neon-blue to-neon-cyan',
    },
    professional: {
      name: t('offers.plans.professional.name'),
      price: '7,999 EGP',
      originalPrice: '9,999 EGP',
      description: t('offers.plans.professional.description'),
      color: 'neon-pink',
      gradient: 'from-neon-pink to-neon-purple',
    },
    enterprise: {
      name: t('offers.plans.enterprise.name'),
      price: '19,999 EGP',
      originalPrice: '24,999 EGP',
      description: t('offers.plans.enterprise.description'),
      color: 'neon-gold',
      gradient: 'from-neon-gold to-neon-yellow',
    },
  };

  const paymentMethods = [
    {
      name: 'InstaPay',
      value: 'muhamedadel69@instapay',
      color: 'neon-blue',
      icon: '💳',
    },
    {
      name: 'Vodafone Cash',
      value: '+201069415658',
      color: 'neon-green',
      icon: '📱',
    },
    {
      name: 'Bank Transfer',
      value: 'CIB - MOHAMED ADEL - 100065756317',
      color: 'neon-gold',
      icon: '🏦',
    },
  ];

  useEffect(() => {
    const plan = searchParams.get('plan');
    if (plan && plans[plan as keyof typeof plans]) {
      setSelectedPlan(plan);
      setOrderStep('details');
    }
  }, [searchParams]);

  // Save order to localStorage in preview mode
  const saveOrderLocally = (order: any) => {
    if (typeof window !== 'undefined') {
      const existingOrders = JSON.parse(localStorage.getItem('danverse_orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('danverse_orders', JSON.stringify(existingOrders));
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateQRCode = (text: string) => {
    // Simple QR code generation using a service
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(text)}`;
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedPlanData = plans[selectedPlan as keyof typeof plans];
      const orderPayload = {
        ...orderData,
        service: selectedPlanData.name,
        package_type: selectedPlan,
        total_amount: parseInt(selectedPlanData.price.replace(/[^0-9]/g, '')),
        currency: 'EGP',
        payment_method: 'manual',
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const result = await response.json();

      if (result.success && result.order) {
        setOrderCode(result.order.order_code);
        setIsPreviewMode(result.isPreviewMode || false);
        setOrderStep('payment');
        
        // Save locally in preview mode
        if (result.isPreviewMode) {
          saveOrderLocally(result.order);
        }
      } else {
        alert('Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error('Order submission error:', error);
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

        {/* Step 1: Plan Selection */}
        {orderStep === 'plan' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.entries(plans).map(([key, plan]) => (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedPlan(key);
                    setOrderStep('details');
                  }}
                  className="glass-dark p-8 rounded-xl border border-gray-700 hover:border-neon-pink/50 transition-all duration-300 cursor-pointer"
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-neon-pink">{plan.price}</span>
                      <span className="text-gray-500 line-through ml-2">{plan.originalPrice}</span>
                    </div>
                    <p className="text-gray-300 mb-6">{plan.description}</p>
                    <button className="w-full py-3 px-6 bg-neon-pink text-white rounded-lg font-semibold hover:bg-neon-pink/80 transition-colors">
                      {t('buy.selectPlan')}
                    </button>
                  </div>
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
            <div className="glass-dark p-8 rounded-xl border border-gray-700 max-w-2xl mx-auto">
              {/* Order Summary */}
              <div className="mb-8 p-6 bg-dark-800 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-4">{t('buy.orderSummary')}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('buy.plan')}:</span>
                    <span className="text-white">{selectedPlanData.name}</span>
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
          >
            <div className="glass-dark p-8 rounded-xl border border-gray-700 max-w-4xl mx-auto">
              {/* Success Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-neon-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{t('buy.orderCreated')}</h2>
                <div className="flex items-center justify-center gap-4">
                  <p className="text-gray-300">{t('buy.orderCode')}: 
                    <span className="text-neon-pink font-mono text-xl ml-2">{orderCode}</span>
                  </p>
                  <button
                    onClick={() => copyToClipboard(orderCode, 'orderCode')}
                    className="p-2 bg-neon-pink/20 hover:bg-neon-pink/30 border border-neon-pink/50 rounded-lg transition-colors"
                    title="Copy Order Code"
                  >
                    {copiedField === 'orderCode' ? '✅' : '📋'}
                  </button>
                </div>
                {isPreviewMode && (
                  <div className="mt-4 bg-neon-yellow/20 border border-neon-yellow/50 px-4 py-2 rounded-lg inline-block">
                    <span className="text-neon-yellow font-semibold text-sm">PREVIEW MODE - Order saved locally</span>
                  </div>
                )}
              </div>

              {/* Payment Instructions */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-white mb-4 text-center">{t('buy.paymentInstructions')}</h3>
                <p className="text-gray-300 mb-6 text-center">{t('buy.paymentDescription')}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {paymentMethods.map((method, index) => (
                    <div key={method.name} className="bg-dark-800 rounded-xl p-6 border border-gray-700">
                      <div className="text-center mb-4">
                        <div className="text-3xl mb-2">{method.icon}</div>
                        <h4 className={`font-semibold text-${method.color} text-lg mb-2`}>{method.name}</h4>
                        
                        {/* QR Code */}
                        <div className="mb-4">
                          <img
                            src={generateQRCode(method.value)}
                            alt={`${method.name} QR Code`}
                            className="w-32 h-32 mx-auto rounded-lg"
                          />
                        </div>
                        
                        {/* Payment Details */}
                        <div className="bg-dark-900 rounded-lg p-3 mb-3">
                          <p className="text-gray-300 text-sm font-mono break-all">{method.value}</p>
                        </div>
                        
                        {/* Copy Button */}
                        <button
                          onClick={() => copyToClipboard(method.value, method.name)}
                          className={`w-full py-2 px-4 bg-${method.color}/20 hover:bg-${method.color}/30 border border-${method.color}/50 hover:border-${method.color} text-${method.color} rounded-lg transition-all duration-300 text-sm`}
                        >
                          {copiedField === method.name ? '✅ Copied!' : '📋 Copy Details'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-neon-yellow/10 border border-neon-yellow/30 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-3">
                  <div className="text-neon-yellow text-xl">⚠️</div>
                  <div>
                    <p className="text-neon-yellow font-semibold mb-2">{t('buy.important')}:</p>
                    <p className="text-gray-300 text-sm">
                      {t('buy.includeOrderCode')} <span className="font-mono text-neon-pink">{orderCode}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="inline-block py-3 px-8 bg-neon-pink text-white rounded-lg font-semibold hover:bg-neon-pink/80 transition-colors text-center"
                >
                  {t('buy.backToHome')}
                </Link>
                <button
                  onClick={() => copyToClipboard(`Order: ${orderCode}\nAmount: ${selectedPlanData?.price}\nPayment methods: InstaPay: muhamedadel69@instapay, Vodafone: +201069415658`, 'fullDetails')}
                  className="py-3 px-8 border border-neon-blue text-neon-blue rounded-lg font-semibold hover:bg-neon-blue/10 transition-colors"
                >
                  {copiedField === 'fullDetails' ? '✅ Copied!' : '📋 Copy All Details'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

