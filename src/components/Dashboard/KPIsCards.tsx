import React from 'react';
import { useMontas } from '../../context/MontasContext';
import { Card } from '../UI/Card';
import { TrendingUp, Trophy, AlertTriangle, Target } from 'lucide-react';

export const KPIsCards: React.FC = () => {
  const { estado } = useMontas();
  const semanasList = Object.values(estado.semanas).filter(s => s.guardadaEnHistorial === true);

  if (semanasList.length === 0) return null;

  const totalCumplimiento = semanasList.reduce((acc, s) => acc + s.cumplimientoPorcentaje, 0);
  const promedioCumplimiento = (totalCumplimiento / semanasList.length).toFixed(1);

  const mejorSemana = semanasList.reduce((prev, curr) => (curr.montasReales > prev.montasReales ? curr : prev), semanasList[0]);
  const peorSemana = semanasList.reduce((prev, curr) => (curr.montasReales < prev.montasReales ? curr : prev), semanasList[0]);

  const semanasEnMeta = semanasList.filter(s => Math.abs(s.diferencia) <= 5).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Promedio Cumplimiento */}
      <Card className="bg-gradient-to-br from-slate-900 to-emerald-950/40 border-emerald-500/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase text-slate-400">Promedio Cumplimiento</span>
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-emerald-400">{promedioCumplimiento}%</span>
          <span className="text-xs text-slate-400">vs Meta 239</span>
        </div>
      </Card>

      {/* Mejor Semana */}
      <Card className="bg-gradient-to-br from-slate-900 to-sky-950/40 border-sky-500/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase text-slate-400">Mejor Semana</span>
          <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
            <Trophy className="w-5 h-5" />
          </div>
        </div>
        <div>
          <span className="text-xl font-bold text-sky-300 block">Semana {mejorSemana.numeroSemana}</span>
          <span className="text-xs text-slate-400 font-medium">{mejorSemana.montasReales} montas reales ({mejorSemana.cumplimientoPorcentaje}%)</span>
        </div>
      </Card>

      {/* Peor Semana */}
      <Card className="bg-gradient-to-br from-slate-900 to-rose-950/40 border-rose-500/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase text-slate-400">Peor Semana</span>
          <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div>
          <span className="text-xl font-bold text-rose-300 block">Semana {peorSemana.numeroSemana}</span>
          <span className="text-xs text-slate-400 font-medium">{peorSemana.montasReales} montas reales ({peorSemana.cumplimientoPorcentaje}%)</span>
        </div>
      </Card>

      {/* Semanas en Rango Meta */}
      <Card className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border-indigo-500/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase text-slate-400">Semanas en Meta (±5)</span>
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Target className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-indigo-300">{semanasEnMeta}</span>
          <span className="text-xs text-slate-400">de {semanasList.length} semanas</span>
        </div>
      </Card>
    </div>
  );
};
