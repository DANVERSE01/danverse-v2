'use client';

import React from 'react';
import NeonToggle from './NeonToggle';

type Method = 'instapay' | 'vodafone' | 'bank' | 'paypal';

type Props = {
  value: Method;
  onChange: (m: Method) => void;
};

const methods: { id: Method; label: string; disabled?: boolean; hint: string }[] = [
  { id: 'instapay', label: 'InstaPay', hint: 'Alias' },
  { id: 'vodafone', label: 'Vodafone Cash', hint: 'Number' },
  { id: 'bank', label: 'Bank', hint: 'Account' },
  { id: 'paypal', label: 'PayPal', hint: 'Disabled', disabled: true },
];

export default function PaymentMethodToggle({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {methods.map((m) => (
        <button
          key={m.id}
          type="button"
          aria-pressed={value === m.id}
          disabled={m.disabled}
          onClick={() => !m.disabled && onChange(m.id)}
          className={`group flex items-center justify-between px-4 py-3 rounded-lg border text-left transition-colors ${
            value === m.id
              ? 'border-neon-pink bg-white/5'
              : 'border-gray-700 hover:border-gray-600'
          } ${m.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div>
            <div className="text-white font-medium">{m.label}</div>
            <div className="text-xs text-gray-400">{m.hint}</div>
          </div>
          <NeonToggle id={`toggle-${m.id}`} checked={value === m.id} onChange={() => onChange(m.id)} />
        </button>
      ))}
    </div>
  );
}


