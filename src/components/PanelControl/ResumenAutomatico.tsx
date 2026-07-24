import React from 'react';
import { useMontas } from '../../context/MontasContext';
import { Card, CardHeader, CardTitle } from '../UI/Card';
import { obtenerSugerenciasAccion } from '../../lib/calculos';
import { Calculator, CheckCircle2, AlertCircle, AlertOctagon, TrendingUp } from 'lucide-react';

export const ResumenAutomatico: React.FC = () => {
  const { semanaActualData, actualizarSemanaField, guardarSemanaActualEnHistorial } = useMontas();
  const {
    netoDestetes,
    totalCreaciones,
    programadasDisponiblesHoy,
    totalFaenadora,
    guardarFuturoProgramadas,
    totalDisponible,
    metaSemanal,
    montasReales,
    diferencia
  } = semanaActualData;

  const sugerencia = obtenerSugerenciasAccion(diferencia);

  const handleGuardarSemana = () => {
    guardarSemanaActualEnHistorial();
    const msg = document.getElementById('save-toast');
    if (msg) {
      msg.classList.remove('hidden');
      setTimeout(() => msg.classList.add('hidden'), 4000);
    }
  };

  return (
    <Card className="border-2 border-slate-700/80 bg-slate-900 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-xl">
          <Calculator className="w-6 h-6 text-emerald-400" />
          <span>📊 RESUMEN Y CÁLCULO AUTOMÁTICO DE DISPONIBILIDAD</span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Meta Semanal:</span>
          <span className="font-extrabold text-white bg-slate-800 px-3 py-1 rounded text-sm">
            {metaSemanal} montas
          </span>
        </div>
      </CardHeader>

      {/* Desglose Matemático */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
          <span className="text-[10px] font-bold text-emerald-400 uppercase block">NETO DESTETES</span>
          <span className="text-xl font-bold text-slate-100">+{netoDestetes}</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
          <span className="text-[10px] font-bold text-sky-400 uppercase block">CREACIONES</span>
          <span className="text-xl font-bold text-slate-100">+{totalCreaciones}</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
          <span className="text-[10px] font-bold text-indigo-400 uppercase block">PROGRAMADAS (HOY)</span>
          <span className="text-xl font-bold text-slate-100">+{programadasDisponiblesHoy}</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
          <span className="text-[10px] font-bold text-rose-400 uppercase block">FAENADORA</span>
          <span className="text-xl font-bold text-rose-400">-{totalFaenadora}</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
          <span className="text-[10px] font-bold text-amber-400 uppercase block">GUARDADAS FUTURO</span>
          <span className="text-xl font-bold text-amber-400">-{guardarFuturoProgramadas}</span>
        </div>
      </div>

      {/* Totales y Diferencia Destacada */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Disponible */}
        <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase block">TOTAL DISPONIBLE</span>
            <span className="text-xs text-slate-500">Resultado de la fórmula</span>
          </div>
          <span className="text-3xl font-black text-emerald-400">
            {totalDisponible}
          </span>
        </div>

        {/* Montas Reales Editables */}
        <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase block">MONTAS REALES</span>
            <span className="text-xs text-slate-500">Ejecutadas en pabellón</span>
          </div>
          <input
            type="number"
            value={montasReales}
            onChange={e => actualizarSemanaField('montasReales', Number(e.target.value))}
            className="w-24 bg-slate-900 border border-slate-700 text-slate-100 font-black text-2xl rounded px-3 py-1 text-right focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Diferencia vs Meta */}
        <div className={`p-4 rounded-xl border flex items-center justify-between ${sugerencia.bgClass} ${sugerencia.borderClass}`}>
          <div>
            <span className="text-xs font-extrabold uppercase block text-slate-300">DIFERENCIA VS META</span>
            <span className="text-xs text-slate-400">Meta: {metaSemanal}</span>
          </div>
          <span className={`text-3xl font-black ${sugerencia.textClass}`}>
            {diferencia > 0 ? `+${diferencia}` : diferencia}
          </span>
        </div>
      </div>

      {/* Banner de Estado Dinámico y Botón Guardar */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4 ${sugerencia.bgClass} ${sugerencia.borderClass}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{sugerencia.emoji}</span>
          <div>
            <h4 className={`text-base font-extrabold tracking-wide ${sugerencia.textClass}`}>
              {sugerencia.titulo}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              {sugerencia.mensaje}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={handleGuardarSemana}
            className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-lg shadow-lg shadow-emerald-950/40 transition-all cursor-pointer flex items-center justify-center gap-2 border border-emerald-400/30"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirmar y Guardar Semana {semanaActualData.numeroSemana} en Historial</span>
          </button>
        </div>
      </div>

      {/* Toast de Confirmación de Guardado */}
      <div id="save-toast" className="hidden mt-3 p-3 bg-emerald-950 border border-emerald-500/50 rounded-lg text-emerald-200 text-xs font-semibold flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>¡Semana {semanaActualData.numeroSemana} guardada y actualizada correctamente en el Historial Acumulado!</span>
        </div>
        <span className="text-[10px] text-emerald-400/80 uppercase font-bold">Auto-sincronizado</span>
      </div>
    </Card>
  );
};
