import React from 'react';
import { LayoutDashboard, CalendarDays, Sparkles, History, BarChart3 } from 'lucide-react';

export type TabId = 'panel' | 'programadas' | 'creaciones' | 'historial' | 'dashboard';

interface NavigationProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  badgeProgramadasCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  badgeProgramadasCount = 0
}) => {
  const tabs = [
    {
      id: 'panel' as TabId,
      label: 'Panel de Control',
      icon: LayoutDashboard,
      description: 'Calculadora semanal y resumen'
    },
    {
      id: 'programadas' as TabId,
      label: 'Programadas (+21d)',
      icon: CalendarDays,
      description: 'Hembras guardadas a +3 semanas',
      badge: badgeProgramadasCount > 0 ? badgeProgramadasCount : null
    },
    {
      id: 'creaciones' as TabId,
      label: 'Creaciones Chanchillas',
      icon: Sparkles,
      description: 'Batches de 240 unidades'
    },
    {
      id: 'historial' as TabId,
      label: 'Historial Acumulado',
      icon: History,
      description: 'Registro semanal completo'
    },
    {
      id: 'dashboard' as TabId,
      label: 'Dashboard & KPIs',
      icon: BarChart3,
      description: 'Gráficos y métricas de desempeño'
    }
  ];

  return (
    <nav className="bg-slate-900/80 border-b border-slate-800 px-6 py-2">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none">
        {tabs.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTab(t.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-950/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{t.label}</span>
              {t.badge !== null && t.badge !== undefined && (
                <span className="bg-emerald-500 text-slate-950 text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
