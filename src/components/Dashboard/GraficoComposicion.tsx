import React from 'react';
import { useMontas } from '../../context/MontasContext';
import { Card, CardHeader, CardTitle } from '../UI/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Layers } from 'lucide-react';

export const GraficoComposicion: React.FC = () => {
  const { estado } = useMontas();
  const data = Object.values(estado.semanas)
    .filter(s => s.guardadaEnHistorial === true)
    .sort((a, b) => a.numeroSemana - b.numeroSemana)
    .map(s => ({
      semana: `Sem ${s.numeroSemana}`,
      destetesNetos: s.netoDestetes,
      creaciones: s.totalCreaciones,
      programadas: s.programadasDisponiblesHoy,
      faenadora: -s.totalFaenadora
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Layers className="w-5 h-5 text-sky-400" />
          <span>COMPOSICIÓN DE DISPONIBILIDAD POR ORIGEN DE HEMBRAS</span>
        </CardTitle>
      </CardHeader>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="semana" stroke="#94a3b8" tick={{ fontSize: 12 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="destetesNetos" name="Destetes Netos" fill="#10b981" stackId="a" />
            <Bar dataKey="creaciones" name="Creaciones (Chanchillas)" fill="#0284c7" stackId="a" />
            <Bar dataKey="programadas" name="Programadas (+21d)" fill="#6366f1" stackId="a" />
            <Bar dataKey="faenadora" name="Envíos Faenadora (-)" fill="#f43f5e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
