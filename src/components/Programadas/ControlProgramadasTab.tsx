import React, { useState } from 'react';
import { useMontas } from '../../context/MontasContext';
import { Card, CardHeader, CardTitle } from '../UI/Card';
import { Button } from '../UI/Button';
import { CalendarDays, PlusCircle, Trash2, ArrowRight, Info } from 'lucide-react';

export const ControlProgramadasTab: React.FC = () => {
  const { estado, agregarProgramada, eliminarProgramada, cambiarSemanaActual } = useMontas();
  const [semanaOrigen, setSemanaOrigen] = useState<number>(estado.semanaActual);
  const [cantidad, setCantidad] = useState<number>(20);
  const [notas, setNotas] = useState<string>('');

  const semanaDestinoCalculada = Number(semanaOrigen) + 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cantidad <= 0) return;
    agregarProgramada(Number(semanaOrigen), Number(cantidad), notas);
    setNotas('');
  };

  return (
    <div className="space-y-6">
      {/* Explicación del Ciclo */}
      <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-4 flex items-start gap-3 text-xs text-indigo-200">
        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-indigo-300">Regla de Negocio: Ciclo de Sincronización +21 Días (+3 Semanas)</h4>
          <p className="mt-1 leading-relaxed">
            Las hembras reservadas o retenidas en una semana determinada (Semana Origen) entrarán en celo sincronizado a los 21 días (exactamente 3 semanas después). Al registrar la Semana Origen, la app calcula automáticamente su presencia en la **Semana Destino (Origen + 3)**.
          </p>
        </div>
      </div>

      {/* Formulario de Registro */}
      <Card>
        <CardHeader>
          <CardTitle>
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            <span>REGISTRAR NUEVAS HEMBRAS PROGRAMADAS</span>
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Semana Origen</label>
            <input
              type="number"
              min="1"
              max="52"
              value={semanaOrigen}
              onChange={e => setSemanaOrigen(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 font-bold rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Cantidad Hembras</label>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={e => setCantidad(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 text-indigo-400 font-bold rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Semana Destino (+3)</label>
            <div className="w-full bg-slate-950/80 border border-indigo-500/40 text-indigo-300 font-extrabold rounded-lg p-2.5 text-sm flex items-center justify-between">
              <span>Semana {semanaDestinoCalculada}</span>
              <ArrowRight className="w-4 h-4 text-indigo-400" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Notas / Motivo</label>
            <input
              type="text"
              placeholder="Ej. Reserva por superávit"
              value={notas}
              onChange={e => setNotas(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <Button type="submit" variant="primary" className="w-full">
              Agregar Programada
            </Button>
          </div>
        </form>
      </Card>

      {/* Tabla de Programadas Registradas */}
      <Card>
        <CardHeader>
          <CardTitle>
            <CalendarDays className="w-5 h-5 text-indigo-400" />
            <span>BANCO ACUMULADO DE HEMBRAS PROGRAMADAS</span>
          </CardTitle>
          <span className="text-xs bg-indigo-500/20 text-indigo-300 font-bold px-3 py-1 rounded border border-indigo-500/30">
            {estado.programadas.length} Registros Activos
          </span>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-xs uppercase font-bold text-slate-400">
                <th className="py-3 px-4">Semana Origen</th>
                <th className="py-3 px-4">Cantidad</th>
                <th className="py-3 px-4 text-indigo-400">Semana Destino (+3 sem)</th>
                <th className="py-3 px-4">Fecha Registro</th>
                <th className="py-3 px-4">Notas</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {estado.programadas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No hay registros de hembras programadas aún.
                  </td>
                </tr>
              ) : (
                estado.programadas.map(p => (
                  <tr key={p.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-200">
                      Semana {p.semanaOrigen}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-indigo-400 text-base">
                      {p.cantidad} hembras
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => cambiarSemanaActual(p.semanaDestino)}
                        className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/40 px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        Ir a Semana {p.semanaDestino} <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400">{p.fechaCreacion}</td>
                    <td className="py-3 px-4 text-xs text-slate-300">{p.notas || '-'}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => eliminarProgramada(p.id)}
                        className="text-rose-400 hover:text-rose-300 p-1.5 rounded hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
