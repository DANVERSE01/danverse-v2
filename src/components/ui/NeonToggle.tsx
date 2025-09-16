'use client';

import React from 'react';

type NeonToggleProps = {
  id: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  className?: string;
};

export default function NeonToggle({ id, checked, onChange, label, className }: NeonToggleProps) {
  return (
    <label htmlFor={id} className={`inline-flex items-center gap-3 select-none ${className || ''}`}>
      {label ? <span className="text-sm text-gray-300">{label}</span> : null}
      <input
        id={id}
        type="checkbox"
        className="sr-only peer"
        defaultChecked={checked}
        onChange={(e) => onChange?.(e.currentTarget.checked)}
      />
      <span
        aria-hidden
        className="w-12 h-7 rounded-full border-2 border-neon-pink relative transition-colors duration-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-neon-blue peer-checked:border-neon-blue"
      >
        <span
          className="absolute top-1 left-1 w-5 h-5 rounded-full bg-neon-pink transition-transform duration-300 peer-checked:translate-x-5 peer-checked:bg-neon-blue shadow-[0_0_10px_currentColor]"
        />
      </span>
    </label>
  );
}


