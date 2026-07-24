export interface DiaDestete {
  dia: number;
  nombreDia: string;
  fecha?: string;
  total: number;
  nodrizas: number;
  neto: number;
}

export interface SemanaMontas {
  id: string;
  numeroSemana: number;
  fechaInicio: string;
  metaSemanal: number; // 239 por defecto
  
  // Destetes
  destetes: DiaDestete[];
  totalDestetadas: number;
  totalNodrizas: number;
  netoDestetes: number;
  
  // Creaciones de Chanchillas
  loteCreacionId: number | null;
  semanaCreacionLote: number; // 1, 2, 3 o 4
  totalCreaciones: number;
  
  // Programadas (+21 días / +3 semanas)
  programadasDisponiblesHoy: number;
  guardarFuturoProgramadas: number;
  
  // Faenadora / Descarte
  descartePlanificadoFaenadora: number;
  descarteAjusteFaenadora: number;
  totalFaenadora: number;
  
  // Resultados finales
  totalDisponible: number;
  montasReales: number;
  diferencia: number;
  cumplimientoPorcentaje: number;
  mes: number;
  anio: number;
  notas?: string;
  guardadaEnHistorial?: boolean;
}

export interface ProgramadaItem {
  id: string;
  semanaOrigen: number;
  cantidad: number;
  semanaDestino: number; // semanaOrigen + 3
  fechaCreacion: string;
  notas?: string;
  estado: 'pendiente' | 'aplicado' | 'cancelado';
}

export interface BatchCreacion {
  id: string;
  loteNumero: number;
  totalBatch: number; // 240 por defecto
  semanaInicio: number;
  distribucion: {
    semana1: number;
    semana2: number;
    semana3: number;
    semana4: number;
  };
  fechaIngreso?: string;
  totalDistribuido: number;
  pendientes: number;
  notas?: string;
}

export interface EstadoGlobalFarm {
  semanaActual: number;
  semanas: Record<number, SemanaMontas>;
  programadas: ProgramadaItem[];
  batches: BatchCreacion[];
}