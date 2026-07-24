'use client';

import React from 'react';
import { MontasProvider } from '@/context/MontasContext';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <MontasProvider>
      {children}
    </MontasProvider>
  );
}