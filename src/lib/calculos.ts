import { DiaDestete, SemanaMontas } from '@/types/montas';

export const DIAS_DESTETE_NOMBRES_BASE = ['Jueves', 'Viernes', 'Sábado', 'Domingo', 'Lunes', 'Martes', 'Miércoles'];

export function generarDestetesConFechas(fechaInicioLunesStr: string = '2026-01-05'): DiaDestete[] {
  const [y, m, d] = (fechaInicioLunesStr || '2026-01-05').split('-').map(Number);
  const lunes = new Date(y, (m || 1) - 1, d || 1);

  const baseTotales = [38, 38, 38, 38, 38, 38, 38];
  const baseNodrizas = [4, 4, 4, 4, 4, 4, 4];

  return [0, 1, 2, 3, 4, 5, 6].map(offset => {
    const deltaDays = offset - 4;
    const diaFecha = new Date(lunes);
    diaFecha.setDate(lunes.getDate() + deltaDays);

    const year = diaFecha.getFullYear();
    const month = String(diaFecha.getMonth() + 1).padStart(2, '0');
    const day = String(diaFecha.getDate()).padStart(2, '0');
    const fechaFormatted = `${year}-${month}-${day}`;

    const nombreBase = DIAS_DESTETE_NOMBRES_BASE[offset];
    const esSemanaAnterior = offset < 4;
    const nombreDiaDisplay = `${nombreBase} (${day}/${month})${esSemanaAnterior ? ' *' : ''}`;

    const total = baseTotales[offset];
    const nodrizas = baseNodrizas[offset];

    return {
      dia: offset + 1,
      nombreDia: nombreDiaDisplay,
      fecha: fechaFormatted,
      total,
      nodrizas,
      neto: total - nodrizas
    };
  });
}

export function sincronizarFechasDestetes(destetes: DiaDestete[], fechaInicioLunesStr: string): DiaDestete[] {
  const nuevosFechas = generarDestetesConFechas(fechaInicioLunesStr);
  if (!destetes || destetes.length === 0) return nuevosFechas;

  return nuevosFechas.map((itemConFecha, idx) => {
    const itemOriginal = destetes[idx];
    const total = itemOriginal ? Number(itemOriginal.total) || 0 : itemConFecha.total;
    const nodrizas = itemOriginal ? Number(itemOriginal.nodrizas) || 0 : itemConFecha.nodrizas;
    return {
      ...itemConFecha,
      total,
      nodrizas,
      neto: total - nodrizas
    };
  });
}

export function generarDestetesDefault(fechaInicioLunesStr: string = '2026-01-05'): DiaDestete[] {
  return generarDestetesConFechas(fechaInicioLunesStr);
}

export function calcularTotalesDestetes(destetes: DiaDestete[]) {
  const totalDestetadas = destetes.reduce((sum, d) => sum + (Number(d.total) || 0), 0);
  const totalNodrizas = destetes.reduce((sum, d) => sum + (Number(d.nodrizas) || 0), 0);
  const netoDestetes = totalDestetadas - totalNodrizas;
  
  return { totalDestetadas, totalNodrizas, netoDestetes };
}

export function calcularTotalDisponible(params: {
  netoDestetes: number;
  totalCreaciones: number;
  programadasDisponiblesHoy: number;
  totalFaenadora: number;
  guardarFuturoProgramadas: number;
}): number {
  return (
    params.netoDestetes +
    params.totalCreaciones +
    params.programadasDisponiblesHoy -
    params.totalFaenadora -
    params.guardarFuturoProgramadas
  );
}

export function calcularDiferencia(totalDisponible: number, meta: number = 239): number {
  return totalDisponible - meta;
}

export function calcularCumplimiento(montasReales: number, meta: number = 239): number {
  if (!meta || meta === 0) return 0;
  return Number(((montasReales / meta) * 100).toFixed(1));
}

export interface SugerenciaAccion {
  estado: 'meta' | 'superavit' | 'deficit';
  titulo: string;
  emoji: string;
  badgeClass: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
  mensaje: string;
  accionesRecomendadas: string[];
}

export function obtenerSugerenciasAccion(diferencia: number): SugerenciaAccion {
  if (diferencia === 0) {
    return {
      estado: 'meta',
      titulo: 'META CUMPLIDA EXACTAMENTE',
      emoji: '✅',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      textClass: 'text-emerald-400',
      bgClass: 'bg-emerald-950/30',
      borderClass: 'border-emerald-500/30',
      mensaje: 'La cantidad de hembras disponibles coincide perfectamente con la meta semanal de 239 montas.',
      accionesRecomendadas: [
        'Proceder con el plan de montas estandarizado.',
        'Mantener el esquema de descartes en faenadora tal como fue planificado.',
        'Registrar el cierre semanal en el historial.'
      ]
    };
  }

  if (diferencia > 0) {
    return {
      estado: 'superavit',
      titulo: `SOBRAN ${diferencia} HEMBRAS (SUPERÁVIT)`,
      emoji: '⚠️',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      textClass: 'text-amber-400',
      bgClass: 'bg-amber-950/30',
      borderClass: 'border-amber-500/30',
      mensaje: `Tienes ${diferencia} hembra(s) más de la meta semanal requerida (239).`,
      accionesRecomendadas: [
        `Programar ${diferencia} hembra(s) excedente(s) para el banco de programadas a +21 días (+3 semanas).`,
        `Incrementar la selección en Faenadora / Descarte planificado en ${diferencia} hembra(s) de menor productividad.`,
        'Revisar la distribución del lote de chanchillas de reemplazo si aplica.'
      ]
    };
  }

  const deficit = Math.abs(diferencia);
  return {
    estado: 'deficit',
    titulo: `FALTAN ${deficit} HEMBRAS (DÉFICIT)`,
    emoji: '🔴',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    textClass: 'text-rose-400',
    bgClass: 'bg-rose-950/30',
    borderClass: 'border-rose-500/30',
    mensaje: `Faltan ${deficit} hembra(s) para alcanzar la meta de 239 montas en la semana actual.`,
    accionesRecomendadas: [
      `Reducir o pausar el descarte en faenadora en ${deficit} hembra(s).`,
      `Revisar si hay hembras adicionales en el banco de programadas (+21 días) disponibles para sincronizar.`,
      `Verificar si se pueden adelantar chanchillas del lote de creaciones actual.`
    ]
  };
}

export function calcularSemanaDesdeFecha(fechaStr: string): {
  numeroSemana: number;
  fechaInicioLunes: string;
  mes: number;
  anio: number;
} {
  if (!fechaStr) {
    const hoy = new Date();
    fechaStr = hoy.toISOString().split('T')[0];
  }

  const [y, m, d] = fechaStr.split('-').map(Number);
  const targetDate = new Date(y, (m || 1) - 1, d || 1);

  const dayOfWeek = targetDate.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(targetDate);
  monday.setDate(targetDate.getDate() + diffToMonday);

  const targetYear = monday.getFullYear();
  const jan1 = new Date(targetYear, 0, 1);
  const firstJanDayOfWeek = jan1.getDay();
  const jan1MondayDiff = firstJanDayOfWeek === 0 ? 1 : (firstJanDayOfWeek === 1 ? 0 : 8 - firstJanDayOfWeek);
  const firstMondayOfYear = new Date(targetYear, 0, 1 + jan1MondayDiff);

  let numeroSemana = Math.floor((monday.getTime() - firstMondayOfYear.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;

  if (numeroSemana < 1) {
    numeroSemana = 1;
  } else if (numeroSemana > 52) {
    numeroSemana = 52;
  }

  const mondayY = monday.getFullYear();
  const mondayM = String(monday.getMonth() + 1).padStart(2, '0');
  const mondayD = String(monday.getDate()).padStart(2, '0');
  const fechaInicioLunes = `${mondayY}-${mondayM}-${mondayD}`;
  const mesCalculado = monday.getMonth() + 1;

  return {
    numeroSemana,
    fechaInicioLunes,
    mes: mesCalculado,
    anio: mondayY
  };
}