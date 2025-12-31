// assets\react/components\ui\Button.tsx

import React, { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  className?: string;
  type?: 'button' | 'submit' | 'reset'; // <- ajoute cette ligne
  disabled?: Boolean
};

export default function Button({ children, onClick, variant = 'primary', type = 'button', className = '' }: ButtonProps) {
  const base = 'inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold transition focus:outline-none focus:ring-2';

  const variants: Record<string, string> = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-primary-500',
    outline: 'bg-transparent border border-neutral-300 text-neutral-900 hover:bg-neutral-50 focus:ring-primary-500',
    ghost: 'bg-transparent text-neutral-900 hover:bg-neutral-50 focus:ring-primary-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
