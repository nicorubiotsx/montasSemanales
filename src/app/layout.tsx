import type { Metadata } from 'next';
import './globals.css';
import { ClientProviders } from '@/components/ClientProviders';

export const metadata: Metadata = {
  title: 'Gestión de Montas Semanales - Porcinos',
  description: 'Planificación, cálculo de disponibilidad y control de inventario de hembras porcinas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}