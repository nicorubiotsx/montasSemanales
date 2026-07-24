import { EstadoGlobalFarm, SemanaMontas } from '@/types/montas';
import { generarDestetesDefault } from './calculos';

export function crearSemanaInicial(numeroSemana: number): SemanaMontas {
  const fechaInicio = new Date(2026, 0, 5 + (numeroSemana - 1) * 7).toISOString().split('T')[0];
  const destetes = generarDestetesDefault(fechaInicio).map(d => ({ ...d, total: 0, nodrizas: 0, neto: 0 }));

  return {
    id: `semana-${numeroSemana}`,
    numeroSemana,
    fechaInicio,
    metaSemanal: 239,
    destetes,
    totalDestetadas: 0,
    totalNodrizas: 0,
    netoDestetes: 0,
    loteCreacionId: null,
    semanaCreacionLote: 1,
    totalCreaciones: 0,
    programadasDisponiblesHoy: 0,
    guardarFuturoProgramadas: 0,
    descartePlanificadoFaenadora: 0,
    descarteAjusteFaenadora: 0,
    totalFaenadora: 0,
    totalDisponible: 0,
    montasReales: 0,
    diferencia: -239,
    cumplimientoPorcentaje: 0,
    mes: Math.min(12, Math.ceil(numeroSemana / 4.33)),
    anio: 2026,
    notas: '',
    guardadaEnHistorial: false
  };
}

export function obtenerEstadoInicial(): EstadoGlobalFarm {
  const semanasMap: Record<number, SemanaMontas> = {};
  semanasMap[1] = crearSemanaInicial(1);

  return {
    semanaActual: 1,
    semanas: semanasMap,
    programadas: [],
    batches: []
  };
}