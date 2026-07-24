import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variantStyles = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    success: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    warning: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    danger: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    info: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    outline: 'bg-transparent text-slate-400 border-slate-700'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
