import React from 'react';
import { useMontas } from '../../context/MontasContext';
import { Card, CardHeader, CardTitle } from '../UI/Card';
import { Truck, AlertTriangle } from 'lucide-react';

export const FaenadoraSection: React.FC = () => {
  const { semanaActualData, actualizarSemanaField } = useMontas();
  const { descartePlanificadoFaenadora, descarteAjusteFaenadora, totalFaenadora } = semanaActualData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Truck className="w-5 h-5 text-rose-400" />
          <span>FAENADORA / REGISTRO DE DESCARTES (-)</span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total Envíos Faenadora:</span>
          <span className="bg-rose-500/20 text-rose-300 font-bold px-3 py-1 rounded border border-rose-500/40 text-sm">
            -{totalFaenadora} hembras
          </span>
        </div>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Descarte Planificado por Salud/Edad */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
            DESCARTE PLANIFICADO
          </label>
          <span className="text-xs text-slate-500 block mb-2">Bajas por paridad o salud</span>
          <input
            type="number"
            min="0"
            value={descartePlanificadoFaenadora}
            onChange={e => actualizarSemanaField('descartePlanificadoFaenadora', Math.max(0, Number(e.target.value)))}
            className="w-full bg-slate-900 border border-slate-700 text-rose-400 font-bold text-base rounded px-3 py-1.5 focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Descarte Ajuste por Meta */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
            DESCARTE POR AJUSTE
          </label>
          <span className="text-xs text-slate-500 block mb-2">Ajuste de inventario sobrante</span>
          <input
            type="number"
            min="0"
            value={descarteAjusteFaenadora}
            onChange={e => actualizarSemanaField('descarteAjusteFaenadora', Math.max(0, Number(e.target.value)))}
            className="w-full bg-slate-900 border border-slate-700 text-rose-400 font-bold text-base rounded px-3 py-1.5 focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Total Faenadora Resumen */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold uppercase">
            <AlertTriangle className="w-4 h-4" /> RECUENTO TOTAL FAENADORA
          </div>
          <div className="text-right mt-2">
            <span className="text-3xl font-black text-rose-400">
              -{totalFaenadora}
            </span>
            <span className="text-[10px] text-slate-500 block font-semibold uppercase">Restadas del disponible</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
