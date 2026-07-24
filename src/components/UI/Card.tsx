import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-lg backdrop-blur-sm transition-all hover:border-slate-700/60 ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return <div className={`mb-4 flex items-center justify-between border-b border-slate-800 pb-3 ${className}`}>{children}</div>;
};

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return <h3 className={`text-lg font-bold text-slate-100 flex items-center gap-2 ${className}`}>{children}</h3>;
};
