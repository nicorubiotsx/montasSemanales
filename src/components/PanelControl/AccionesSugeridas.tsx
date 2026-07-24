import React from 'react';
import { useMontas } from '../../context/MontasContext';
import { Card, CardHeader, CardTitle } from '../UI/Card';
import { obtenerSugerenciasAccion } from '../../lib/calculos';
import { Lightbulb, ArrowRight, CheckCircle } from 'lucide-react';

export const AccionesSugeridas: React.FC = () => {
  const { semanaActualData } = useMontas();
  const sugerencia = obtenerSugerenciasAccion(semanaActualData.diferencia);

  return (
    <Card className="bg-slate-900/60 border border-slate-800">
      <CardHeader>
        <CardTitle className="text-base">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <span>ACCIONES RECOMENDADAS DE AJUSTE PRODUCTIVO</span>
        </CardTitle>
      </CardHeader>

      <div className="space-y-2.5">
        {sugerencia.accionesRecomendadas.map((accion, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 transition-all hover:border-slate-700"
          >
            <div className="p-1 rounded bg-slate-900 border border-slate-800 shrink-0 text-emerald-400 mt-0.5">
              <CheckCircle className="w-4 h-4" />
            </div>
            <p className="text-sm text-slate-200 font-medium leading-relaxed">
              {accion}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};
