import React from 'react';
import { useMontas } from '../../context/MontasContext';
import { Card, CardHeader, CardTitle } from '../UI/Card';
import { Baby, MinusCircle, Calculator, Info } from 'lucide-react';

export const DestetesTabla: React.FC = () => {
  const { semanaActualData, actualizarDesteteDia } = useMontas();
  const { destetes, totalDestetadas, totalNodrizas, netoDestetes } = semanaActualData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Baby className="w-5 h-5 text-emerald-400" />
          <span>REGISTRO DIARIO DE DESTETES (7 DÍAS)</span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Neto Destetes Semanal:</span>
          <span className="bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-md text-sm border border-emerald-500/40">
            {netoDestetes} hembras
          </span>
        </div>
      </CardHeader>

      {/* Nota explicativa del ciclo de destetes */}
      <div className="mb-3 p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Ciclo de Destete:</strong> Jueves a Domingo (Semana anterior) + Lunes a Miércoles (Semana actual)
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-semibold">* Semana Anterior</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
              <th className="py-3 px-3">Día del Ciclo</th>
              <th className="py-3 px-3">Destetadas Totales</th>
              <th className="py-3 px-3 text-amber-400 flex items-center gap-1">
                <MinusCircle className="w-3.5 h-3.5" /> Nodrizas (-)
              </th>
              <th className="py-3 px-3 text-emerald-400 font-bold">Neto Disponible (=)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
            {destetes.map((d, index) => {
              const esSemanaAnterior = index < 4;

              return (
                <tr key={d.dia} className={`transition-colors ${esSemanaAnterior ? 'bg-slate-950/40 hover:bg-slate-900/60' : 'hover:bg-slate-850/40'}`}>
                  <td className="py-2.5 px-3 font-semibold">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${esSemanaAnterior ? 'text-slate-300' : 'text-emerald-300 font-bold'}`}>
                        {d.nombreDia}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      min="0"
                      value={d.total}
                      onChange={e => actualizarDesteteDia(index, 'total', Number(e.target.value))}
                      className="w-24 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded px-2.5 py-1 text-sm text-slate-100 font-semibold focus:outline-none"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      min="0"
                      value={d.nodrizas}
                      onChange={e => actualizarDesteteDia(index, 'nodrizas', Number(e.target.value))}
                      className="w-24 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded px-2.5 py-1 text-sm text-amber-300 font-semibold focus:outline-none"
                    />
                  </td>
                  <td className="py-2.5 px-3 font-bold text-emerald-400 text-base">
                    {d.neto}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-slate-950 border-t-2 border-slate-800 font-extrabold text-slate-100">
              <td className="py-3 px-3 text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-emerald-400" /> TOTAL SEMANAL
              </td>
              <td className="py-3 px-3 text-base text-slate-200">{totalDestetadas}</td>
              <td className="py-3 px-3 text-base text-amber-400">-{totalNodrizas}</td>
              <td className="py-3 px-3 text-lg text-emerald-400">{netoDestetes}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
};
