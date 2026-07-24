import { EstadoGlobalFarm, SemanaMontas } from '@/types/montas';
import { generarDestetesDefault } from './calculos';

export function crearSemanaInicial(numeroSemana: number, anioISO: number = 2026): SemanaMontas {
  // Calcular el lunes de la semana ISO dada usando el estándar ISO 8601.
  // El 4 de enero siempre pertenece a la semana ISO 1.
  const jan4 = new Date(anioISO, 0, 4);
  const jan4DayOfWeek = jan4.getDay();
  const jan4DiffToMonday = jan4DayOfWeek === 0 ? -6 : 1 - jan4DayOfWeek;
  const firstISOMonday = new Date(anioISO, 0, 4 + jan4DiffToMonday);

  // El lunes de la semana N es: firstISOMonday + (N - 1) * 7 días
  const monday = new Date(firstISOMonday);
  monday.setDate(firstISOMonday.getDate() + (numeroSemana - 1) * 7);

  const y = monday.getFullYear();
  const m = String(monday.getMonth() + 1).padStart(2, '0');
  const d = String(monday.getDate()).padStart(2, '0');
  const fechaInicio = `${y}-${m}-${d}`;

  const destetes = generarDestetesDefault(fechaInicio).map(dt => ({ ...dt, total: 0, nodrizas: 0, neto: 0 }));

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
    mes: monday.getMonth() + 1,
    anio: y,
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