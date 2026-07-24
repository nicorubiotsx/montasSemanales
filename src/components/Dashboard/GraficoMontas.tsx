import React from 'react';
import { useMontas } from '../../context/MontasContext';
import { Card, CardHeader, CardTitle } from '../UI/Card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Activity } from 'lucide-react';

export const GraficoMontas: React.FC = () => {
  const { estado } = useMontas();
  const data = Object.values(estado.semanas)
    .filter(s => s.guardadaEnHistorial === true)
    .sort((a, b) => a.numeroSemana - b.numeroSemana)
    .map(s => ({
      semana: `Sem ${s.numeroSemana}`,
      montasReales: s.montasReales,
      totalDisponible: s.totalDisponible,
      meta: s.metaSemanal
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Activity className="w-5 h-5 text-emerald-400" />
          <span>TENDENCIA SEMANAL DE MONTAS VS META (239)</span>
        </CardTitle>
      </CardHeader>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="semana" stroke="#94a3b8" tick={{ fontSize: 12 }} />
            <YAxis domain={[180, 280]} stroke="#94a3b8" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Line
              type="monotone"
              dataKey="montasReales"
              name="Montas Reales"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 5, fill: '#10b981' }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="totalDisponible"
              name="Total Disponible"
              stroke="#38bdf8"
              strokeWidth={2}
              strokeDasharray="3 3"
            />
            <Line
              type="monotone"
              dataKey="meta"
              name="Meta (239)"
              stroke="#f43f5e"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
