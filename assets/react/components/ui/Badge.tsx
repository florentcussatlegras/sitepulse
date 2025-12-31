// assets\react/components\ui\Badge.tsx

import React, { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export default function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${className} transition-colors font-bold`}>
      {children}
    </span>
  );
}
