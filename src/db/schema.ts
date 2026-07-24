import { pgTable, integer, text, boolean, real } from 'drizzle-orm/pg-core';

// 1. Tabla de Semanas de Montas
export const semanas = pgTable('semanas', {
  numeroSemana: integer('numero_semana').primaryKey(),
  id: text('id').notNull(),
  fechaInicio: text('fecha_inicio').notNull(),
  metaSemanal: integer('meta_semanal').default(239).notNull(),
  
  totalDestetadas: integer('total_destetadas').default(0).notNull(),
  totalNodrizas: integer('total_nodrizas').default(0).notNull(),
  netoDestetes: integer('neto_destetes').default(0).notNull(),
  
  loteCreacionId: integer('lote_creacion_id'),
  semanaCreacionLote: integer('semana_creacion_lote').default(1).notNull(),
  totalCreaciones: integer('total_creaciones').default(0).notNull(),
  
  programadasDisponiblesHoy: integer('programadas_disponibles_hoy').default(0).notNull(),
  guardarFuturoProgramadas: integer('guardar_futuro_programadas').default(0).notNull(),
  
  descartePlanificadoFaenadora: integer('descarte_planificado_faenadora').default(0).notNull(),
  descarteAjusteFaenadora: integer('descarte_ajuste_faenadora').default(0).notNull(),
  totalFaenadora: integer('total_faenadora').default(0).notNull(),
  
  totalDisponible: integer('total_disponible').default(0).notNull(),
  montasReales: integer('montas_reales').default(0).notNull(),
  diferencia: integer('diferencia').default(0).notNull(),
  cumplimientoPorcentaje: real('cumplimiento_porcentaje').default(0).notNull(),
  
  mes: integer('mes').notNull(),
  anio: integer('anio').default(2026).notNull(),
  notas: text('notas'),
  guardadaEnHistorial: boolean('guardada_en_historial').default(false).notNull()
});

// 2. Tabla de Días de Destete
export const destetesDias = pgTable('destetes_dias', {
  id: text('id').primaryKey(), // ej. "sem12-dia1"
  numeroSemana: integer('numero_semana').notNull(),
  dia: integer('dia').notNull(), // 1..7
  nombreDia: text('nombre_dia').notNull(),
  fecha: text('fecha'),
  total: integer('total').default(0).notNull(),
  nodrizas: integer('nodrizas').default(0).notNull(),
  neto: integer('neto').default(0).notNull()
});

// 3. Tabla de Hembras Programadas (+21d)
export const programadas = pgTable('programadas', {
  id: text('id').primaryKey(),
  semanaOrigen: integer('semana_origen').notNull(),
  cantidad: integer('cantidad').notNull(),
  semanaDestino: integer('semana_destino').notNull(),
  fechaCreacion: text('fecha_creacion').notNull(),
  notas: text('notas'),
  estado: text('estado').default('pendiente').notNull() // 'pendiente' | 'aplicado' | 'cancelado'
});

// 4. Tabla de Batches de Creación de Chanchillas
export const batchesCreacion = pgTable('batches_creacion', {
  id: text('id').primaryKey(),
  loteNumero: integer('lote_numero').notNull(),
  totalBatch: integer('total_batch').default(240).notNull(),
  semanaInicio: integer('semana_inicio').default(1).notNull(),
  semana1: integer('semana_1').default(60).notNull(),
  semana2: integer('semana_2').default(60).notNull(),
  semana3: integer('semana_3').default(60).notNull(),
  semana4: integer('semana_4').default(60).notNull(),
  fechaIngreso: text('fecha_ingreso'),
  totalDistribuido: integer('total_distribuido').default(240).notNull(),
  pendientes: integer('pendientes').default(0).notNull(),
  notas: text('notas')
});