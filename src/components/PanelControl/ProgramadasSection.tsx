import React from 'react';
import { useMontas } from '../../context/MontasContext';
import { Card, CardHeader, CardTitle } from '../UI/Card';
import { CalendarDays, ArrowRightLeft, Clock, Info } from 'lucide-react';

export const ProgramadasSection: React.FC = () => {
  const { semanaActualData } = useMontas();
  const { numeroSemana, programadasDisponiblesHoy, guardarFuturoProgramadas } = semanaActualData;

  const semanaOrigenInversa = Math.max(1, numeroSemana - 3);
  const semanaDestinoFuturo = numeroSemana + 3;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <CalendarDays className="w-5 h-5 text-indigo-400" />
          <span>CONTROL DE HEMBRAS PROGRAMADAS (+21 DÍAS / 3 SEMANAS)</span>
        </CardTitle>
        <span className="text-xs bg-indigo-500/20 text-indigo-300 font-bold px-2.5 py-1 rounded border border-indigo-500/30">
          Ciclo Reproductivo 21 días
        </span>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Entradas provenientes de semanas anteriores (+3 semanas) */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-bold uppercase mb-1">
              <Clock className="w-4 h-4" /> DISPONIBLES HOY (DESDE SEMANA {semanaOrigenInversa})
            </div>
            <p className="text-xs text-slate-400">
              Hembras guardadas en la Semana {semanaOrigenInversa} que cumplen ciclo hoy
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-indigo-400 block">
              +{programadasDisponiblesHoy}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Hembras</span>
          </div>
        </div>

        {/* Salidas a guardar para el futuro (+3 semanas) */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase mb-1">
              <ArrowRightLeft className="w-4 h-4" /> GUARDADAS PARA FUTURO (SEMANA {semanaDestinoFuturo})
            </div>
            <p className="text-xs text-slate-400">
              Hembras registradas en la pestaña Programadas para la Semana {semanaDestinoFuturo} (+21d)
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-amber-400 block">
              -{guardarFuturoProgramadas}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Hembras</span>
          </div>
        </div>
      </div>

      {/* Nota Informativa */}
      <div className="bg-indigo-950/30 border border-indigo-500/20 p-3 rounded-lg flex items-center gap-2.5 text-xs text-indigo-300">
        <Info className="w-4 h-4 text-indigo-400 shrink-0" />
        <span>
          <strong>Nota de Operación:</strong> La programación de hembras (+21 días) se gestiona de forma centralizada en la pestaña superior <strong>"Programadas (+21d)"</strong>. Los valores reflejados en este módulo son únicamente de lectura y resumen automático.
        </span>
      </div>
    </Card>
  );
};
