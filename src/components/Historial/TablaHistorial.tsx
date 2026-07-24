import React, { useState } from 'react';
import { useMontas } from '../../context/MontasContext';
import { Card, CardHeader, CardTitle } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { History, FileSpreadsheet, ArrowUpRight, Search } from 'lucide-react';
import { Button } from '../UI/Button';

export const TablaHistorial: React.FC = () => {
  const { estado, cambiarSemanaActual, exportarCSV } = useMontas();
  const [searchTerm, setSearchTerm] = useState('');

  const semanasList = Object.values(estado.semanas)
    .filter(s => s.guardadaEnHistorial === true)
    .sort((a, b) => b.numeroSemana - a.numeroSemana);

  const filtradas = semanasList.filter(s =>
    s.numeroSemana.toString().includes(searchTerm) ||
    s.fechaInicio.includes(searchTerm) ||
    (s.notas && s.notas.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <History className="w-5 h-5 text-emerald-400" />
          <span>HISTORIAL SEMANAL ACUMULADO</span>
        </CardTitle>
        <div className="flex items-center gap-3">
          {/* Buscador */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar semana..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <Button variant="secondary" size="sm" icon={<FileSpreadsheet className="w-4 h-4 text-emerald-400" />} onClick={exportarCSV}>
            Exportar Excel
          </Button>
        </div>
      </CardHeader>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400">
              <th className="py-3 px-3">Semana</th>
              <th className="py-3 px-3">Fecha Inicio</th>
              <th className="py-3 px-3">Meta</th>
              <th className="py-3 px-3 text-emerald-400">Destetes Netos</th>
              <th className="py-3 px-3 text-sky-400">Creaciones</th>
              <th className="py-3 px-3 text-indigo-400">Programadas</th>
              <th className="py-3 px-3 text-rose-400">Faenadora</th>
              <th className="py-3 px-3 text-amber-400">Guardadas (+21d)</th>
              <th className="py-3 px-3 font-bold text-slate-200">Total Disponible</th>
              <th className="py-3 px-3 font-bold text-emerald-300">Montas Reales</th>
              <th className="py-3 px-3">Diferencia</th>
              <th className="py-3 px-3">% Cumplimiento</th>
              <th className="py-3 px-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filtradas.map(s => {
              const diff = s.diferencia;
              const isMeta = diff === 0;
              const isSuperavit = diff > 0;

              return (
                <tr key={s.numeroSemana} className="hover:bg-slate-850/40 transition-colors text-xs">
                  <td className="py-3 px-3 font-extrabold text-slate-100">
                    Semana {s.numeroSemana}
                  </td>
                  <td className="py-3 px-3 text-slate-400">{s.fechaInicio}</td>
                  <td className="py-3 px-3 font-semibold text-slate-300">{s.metaSemanal}</td>
                  <td className="py-3 px-3 font-bold text-emerald-400">+{s.netoDestetes}</td>
                  <td className="py-3 px-3 text-sky-400 font-semibold">+{s.totalCreaciones}</td>
                  <td className="py-3 px-3 text-indigo-400 font-semibold">+{s.programadasDisponiblesHoy}</td>
                  <td className="py-3 px-3 text-rose-400 font-semibold">-{s.totalFaenadora}</td>
                  <td className="py-3 px-3 text-amber-400 font-semibold">-{s.guardarFuturoProgramadas}</td>
                  <td className="py-3 px-3 font-extrabold text-slate-100 text-sm">{s.totalDisponible}</td>
                  <td className="py-3 px-3 font-black text-emerald-400 text-sm">{s.montasReales}</td>
                  <td className="py-3 px-3 font-bold">
                    <span className={isMeta ? 'text-emerald-400' : isSuperavit ? 'text-amber-400' : 'text-rose-400'}>
                      {diff > 0 ? `+${diff}` : diff}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant={s.cumplimientoPorcentaje >= 100 ? 'success' : s.cumplimientoPorcentaje >= 95 ? 'warning' : 'danger'}>
                      {s.cumplimientoPorcentaje}%
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => cambiarSemanaActual(s.numeroSemana)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                    >
                      Cargar <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
