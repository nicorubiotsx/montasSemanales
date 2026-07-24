import React from 'react';
import { useMontas } from '../../context/MontasContext';
import { Card, CardHeader, CardTitle } from '../UI/Card';
import { Sparkles, Layers } from 'lucide-react';

export const CreacionesSection: React.FC = () => {
  const { estado, semanaActualData, actualizarSemanaField } = useMontas();
  const { loteCreacionId, semanaCreacionLote, totalCreaciones } = semanaActualData;

  const batchActual = estado.batches.find(b => b.loteNumero === loteCreacionId);

  const handleLoteChange = (newLoteNum: number) => {
    actualizarSemanaField('loteCreacionId', newLoteNum);
    const targetBatch = estado.batches.find(b => b.loteNumero === newLoteNum);
    if (targetBatch) {
      const key = `semana${semanaCreacionLote}` as keyof typeof targetBatch.distribucion;
      const val = targetBatch.distribucion[key] || 60;
      actualizarSemanaField('totalCreaciones', val);
    }
  };

  const handleSemanaCreacionChange = (nuevaSemana: number) => {
    actualizarSemanaField('semanaCreacionLote', nuevaSemana);
    if (batchActual) {
      const key = `semana${nuevaSemana}` as keyof typeof batchActual.distribucion;
      const val = batchActual.distribucion[key] || 60;
      actualizarSemanaField('totalCreaciones', val);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Sparkles className="w-5 h-5 text-sky-400" />
          <span>CREACIONES CHANCHILLAS DE REEMPLAZO</span>
        </CardTitle>
        <span className="text-xs bg-sky-500/20 text-sky-300 font-bold px-2.5 py-1 rounded border border-sky-500/30">
          Batch 240 Unidades
        </span>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Selector de Lote */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">LOTE DE CREACIÓN</label>
          <select
            value={loteCreacionId || ''}
            onChange={e => handleLoteChange(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 text-slate-100 font-semibold rounded p-2 text-sm focus:outline-none focus:border-sky-500"
          >
            {estado.batches.map(b => (
              <option key={b.id} value={b.loteNumero}>
                Lote {b.loteNumero} ({b.totalBatch} chanchillas)
              </option>
            ))}
          </select>
        </div>

        {/* Semana de Distribución del Batch */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">SEMANA DEL BATCH (1 A 4)</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => handleSemanaCreacionChange(num)}
                className={`flex-1 py-1.5 rounded font-bold text-xs transition-all cursor-pointer ${
                  semanaCreacionLote === num
                    ? 'bg-sky-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                Sem {num}
              </button>
            ))}
          </div>
        </div>

        {/* Total Creadas en la Semana Actual */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block">TOTAL CREADAS (SEMANA)</label>
            <span className="text-xs text-slate-400">Asignadas para montas</span>
          </div>
          <input
            type="number"
            min="0"
            value={totalCreaciones}
            onChange={e => actualizarSemanaField('totalCreaciones', Number(e.target.value))}
            className="w-24 bg-slate-900 border border-slate-700 text-sky-400 font-bold text-lg rounded px-3 py-1.5 text-right focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {batchActual && (
        <div className="mt-4 p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <span>Distribución Lote {batchActual.loteNumero}:</span>
            <span className="font-mono text-slate-200">
              S1: {batchActual.distribucion.semana1} | S2: {batchActual.distribucion.semana2} | S3: {batchActual.distribucion.semana3} | S4: {batchActual.distribucion.semana4}
            </span>
          </div>
          <div>
            Saldo Pendiente: <span className="font-bold text-sky-300">{batchActual.pendientes} hembras</span>
          </div>
        </div>
      )}
    </Card>
  );
};
