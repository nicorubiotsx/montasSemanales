import React from 'react';
import { useMontas } from '../../context/MontasContext';
import { Card } from '../UI/Card';
import { Target, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { DatePickerPopover } from '../UI/DatePickerPopover';

export const SemanaInfoCard: React.FC = () => {
  const { semanaActualData, cambiarSemanaActual, seleccionarFechaYRecalcularSemana, actualizarSemanaField } = useMontas();

  return (
    <Card className="border-l-4 border-l-emerald-500 relative z-30">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Selector de Semana */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => cambiarSemanaActual(semanaActualData.numeroSemana - 1)}
            disabled={semanaActualData.numeroSemana <= 1}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer text-slate-200"
            title="Semana anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-center relative">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">SEMANA ACTUAL</span>
            <span className="text-2xl font-black text-emerald-400">
              SEMANA {semanaActualData.numeroSemana}
            </span>
            {semanaActualData.guardadaEnHistorial ? (
              <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full inline-block mt-0.5">
                ✅ Guardada en Historial
              </span>
            ) : (
              <span className="text-[9px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full inline-block mt-0.5">
                📝 Borrador (Sin guardar)
              </span>
            )}
          </div>

          <button
            onClick={() => cambiarSemanaActual(semanaActualData.numeroSemana + 1)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer text-slate-200"
            title="Semana siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs de Configuración de la Semana */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
          {/* Componente Calendario Interactivo */}
          <div className="min-w-[180px]">
            <DatePickerPopover
              value={semanaActualData.fechaInicio}
              onChange={newDate => seleccionarFechaYRecalcularSemana(newDate)}
              label="FECHA INICIO"
            />
          </div>

          {/* Meta Semanal */}
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="w-full">
              <label className="text-[10px] font-bold text-slate-400 uppercase block">META (MONTAS)</label>
              <input
                type="number"
                value={semanaActualData.metaSemanal}
                onChange={e => actualizarSemanaField('metaSemanal', Number(e.target.value))}
                className="bg-transparent text-sm text-emerald-400 font-bold focus:outline-none w-full"
              />
            </div>
          </div>

          {/* Notas rapidas */}
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="w-full">
              <label className="text-[10px] font-bold text-slate-400 uppercase block">NOTAS / OBSERVACIONES</label>
              <input
                type="text"
                value={semanaActualData.notas || ''}
                placeholder="Obs. de la semana..."
                onChange={e => actualizarSemanaField('notas', e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
