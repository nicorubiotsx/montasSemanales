'use client';

import React, { useState } from 'react';
import { useMontas } from '@/context/MontasContext';
import { Header } from '@/components/Layout/Header';
import { Navigation, TabId } from '@/components/Layout/Navigation';
import { SemanaInfoCard } from '@/components/PanelControl/SemanaInfoCard';
import { DestetesTabla } from '@/components/PanelControl/DestetesTabla';
import { CreacionesSection } from '@/components/PanelControl/CreacionesSection';
import { ProgramadasSection } from '@/components/PanelControl/ProgramadasSection';
import { FaenadoraSection } from '@/components/PanelControl/FaenadoraSection';
import { ResumenAutomatico } from '@/components/PanelControl/ResumenAutomatico';
import { AccionesSugeridas } from '@/components/PanelControl/AccionesSugeridas';
import { ControlProgramadasTab } from '@/components/Programadas/ControlProgramadasTab';
import { ControlCreacionesTab } from '@/components/Creaciones/ControlCreacionesTab';
import { TablaHistorial } from '@/components/Historial/TablaHistorial';
import { KPIsCards } from '@/components/Dashboard/KPIsCards';
import { GraficoMontas } from '@/components/Dashboard/GraficoMontas';
import { GraficoComposicion } from '@/components/Dashboard/GraficoComposicion';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabId>('panel');
  const { estado } = useMontas();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        badgeProgramadasCount={estado.programadas.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
        {activeTab === 'panel' && (
          <div className="space-y-6">
            <SemanaInfoCard />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DestetesTabla />
              <div className="space-y-6">
                <CreacionesSection />
                <ProgramadasSection />
                <FaenadoraSection />
              </div>
            </div>
            <ResumenAutomatico />
            <AccionesSugeridas />
          </div>
        )}

        {activeTab === 'programadas' && <ControlProgramadasTab />}

        {activeTab === 'creaciones' && <ControlCreacionesTab />}

        {activeTab === 'historial' && <TablaHistorial />}

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <KPIsCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GraficoMontas />
              <GraficoComposicion />
            </div>
            <TablaHistorial />
          </div>
        )}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>🐷 Sistema de Gestión de Montas Semanales — Porcinos v2.0</span>
          <span>Optimizado para 239 montas semanales | Ciclo 21 días | Batches 240 chanchillas</span>
        </div>
      </footer>
    </div>
  );
}