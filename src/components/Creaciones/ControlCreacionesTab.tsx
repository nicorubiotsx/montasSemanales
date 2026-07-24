import React, { useState } from 'react';
import { useMontas } from '../../context/MontasContext';
import { Card, CardHeader, CardTitle } from '../UI/Card';
import { Button } from '../UI/Button';
import { Sparkles, Layers, PlusCircle, Edit3, Save } from 'lucide-react';

export const ControlCreacionesTab: React.FC = () => {
  const { estado, agregarBatch, actualizarBatch } = useMontas();

  // Formulario nuevo lote
  const [loteNumero, setLoteNumero] = useState<number>(6);
  const [totalBatch, setTotalBatch] = useState<number>(240);
  const [s1, setS1] = useState<number>(60);
  const [s2, setS2] = useState<number>(60);
  const [s3, setS3] = useState<number>(60);
  const [s4, setS4] = useState<number>(60);

  // Edición rápida
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDistrib, setEditDistrib] = useState({ semana1: 60, semana2: 60, semana3: 60, semana4: 60 });

  const handleCrearBatch = (e: React.FormEvent) => {
    e.preventDefault();
    agregarBatch(Number(loteNumero), Number(totalBatch), {
      semana1: Number(s1),
      semana2: Number(s2),
      semana3: Number(s3),
      semana4: Number(s4)
    });
    setLoteNumero(loteNumero + 1);
  };

  const handleStartEdit = (id: string, dist: typeof editDistrib) => {
    setEditingId(id);
    setEditDistrib(dist);
  };

  const handleSaveEdit = (id: string) => {
    actualizarBatch(id, editDistrib);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Formulario nuevo batch */}
      <Card>
        <CardHeader>
          <CardTitle>
            <PlusCircle className="w-5 h-5 text-sky-400" />
            <span>REGISTRAR NUEVO BATCH DE CHANCHILLAS (REEMPLAZO)</span>
          </CardTitle>
          <span className="text-xs bg-sky-500/20 text-sky-300 font-bold px-2.5 py-1 rounded border border-sky-500/30">
            Estándar 240 unidades en 4 semanas
          </span>
        </CardHeader>

        <form onSubmit={handleCrearBatch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Número de Lote</label>
              <input
                type="number"
                min="1"
                value={loteNumero}
                onChange={e => setLoteNumero(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 font-bold rounded-lg p-2.5 text-sm focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Total Batch Chanchillas</label>
              <input
                type="number"
                min="1"
                value={totalBatch}
                onChange={e => setTotalBatch(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-sky-400 font-bold rounded-lg p-2.5 text-sm focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" variant="primary" className="w-full">
                Crear Lote {loteNumero}
              </Button>
            </div>
          </div>

          {/* Distribución por semana */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
              Distribución Semanal (Semana 1 a 4)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">Semana 1</span>
                <input
                  type="number"
                  value={s1}
                  onChange={e => setS1(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 font-bold rounded p-1.5 text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">Semana 2</span>
                <input
                  type="number"
                  value={s2}
                  onChange={e => setS2(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 font-bold rounded p-1.5 text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">Semana 3</span>
                <input
                  type="number"
                  value={s3}
                  onChange={e => setS3(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 font-bold rounded p-1.5 text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">Semana 4</span>
                <input
                  type="number"
                  value={s4}
                  onChange={e => setS4(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 font-bold rounded p-1.5 text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Suma total distribuida: <strong className="text-sky-400">{s1 + s2 + s3 + s4} / {totalBatch}</strong>
            </p>
          </div>
        </form>
      </Card>

      {/* Lista de Batches */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Sparkles className="w-5 h-5 text-sky-400" />
            <span>LOTES DE CHANCHILLAS REGISTRADOS</span>
          </CardTitle>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-xs uppercase font-bold text-slate-400">
                <th className="py-3 px-4">Lote #</th>
                <th className="py-3 px-4">Total Batch</th>
                <th className="py-3 px-4">Semana 1</th>
                <th className="py-3 px-4">Semana 2</th>
                <th className="py-3 px-4">Semana 3</th>
                <th className="py-3 px-4">Semana 4</th>
                <th className="py-3 px-4">Pendientes</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {estado.batches.map(b => {
                const isEditing = editingId === b.id;
                return (
                  <tr key={b.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-sky-400">
                      Lote {b.loteNumero}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-slate-200">
                      {b.totalBatch}
                    </td>

                    {/* Semana 1 */}
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editDistrib.semana1}
                          onChange={e => setEditDistrib({ ...editDistrib, semana1: Number(e.target.value) })}
                          className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs"
                        />
                      ) : (
                        b.distribucion.semana1
                      )}
                    </td>

                    {/* Semana 2 */}
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editDistrib.semana2}
                          onChange={e => setEditDistrib({ ...editDistrib, semana2: Number(e.target.value) })}
                          className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs"
                        />
                      ) : (
                        b.distribucion.semana2
                      )}
                    </td>

                    {/* Semana 3 */}
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editDistrib.semana3}
                          onChange={e => setEditDistrib({ ...editDistrib, semana3: Number(e.target.value) })}
                          className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs"
                        />
                      ) : (
                        b.distribucion.semana3
                      )}
                    </td>

                    {/* Semana 4 */}
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editDistrib.semana4}
                          onChange={e => setEditDistrib({ ...editDistrib, semana4: Number(e.target.value) })}
                          className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs"
                        />
                      ) : (
                        b.distribucion.semana4
                      )}
                    </td>

                    <td className="py-3 px-4 font-bold text-amber-400">
                      {b.pendientes}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {isEditing ? (
                        <Button size="sm" variant="primary" icon={<Save className="w-3.5 h-3.5" />} onClick={() => handleSaveEdit(b.id)}>
                          Guardar
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" icon={<Edit3 className="w-3.5 h-3.5" />} onClick={() => handleStartEdit(b.id, b.distribucion)}>
                          Editar
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
