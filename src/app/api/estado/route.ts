import { NextRequest, NextResponse } from 'next/server';
import { db, sql } from '@/db';
import * as schema from '@/db/schema';
import { EstadoGlobalFarm, SemanaMontas, ProgramadaItem, BatchCreacion } from '@/types/montas';
import { obtenerEstadoInicial } from '@/lib/seedData';

let constraintDropped = false;

export async function GET() {
  const headers = {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  };

  if (!db) {
    const seed = obtenerEstadoInicial();
    return NextResponse.json(seed, { headers });
  }

  if (sql && !constraintDropped) {
    try {
      await sql`ALTER TABLE destetes_dias DROP CONSTRAINT IF EXISTS destetes_dias_numero_semana_semanas_numero_semana_fk`;
      constraintDropped = true;
    } catch {
      // Ignorar si ya fue eliminada
    }
  }

  try {
    const semanasDb = await db.select().from(schema.semanas);
    const destetesDb = await db.select().from(schema.destetesDias);
    const programadasDb = await db.select().from(schema.programadas);
    const batchesDb = await db.select().from(schema.batchesCreacion);

    if (semanasDb.length === 0) {
      const seed = obtenerEstadoInicial();
      return NextResponse.json(seed, { headers });
    }

    const semanasMap: Record<number, SemanaMontas> = {};
    for (const s of semanasDb) {
      const dias = destetesDb
        .filter(d => d.numeroSemana === s.numeroSemana)
        .sort((a, b) => a.dia - b.dia)
        .map(d => ({
          dia: d.dia,
          nombreDia: d.nombreDia,
          fecha: d.fecha || undefined,
          total: d.total,
          nodrizas: d.nodrizas,
          neto: d.neto
        }));

      semanasMap[s.numeroSemana] = {
        id: s.id,
        numeroSemana: s.numeroSemana,
        fechaInicio: s.fechaInicio,
        metaSemanal: s.metaSemanal,
        destetes: dias,
        totalDestetadas: s.totalDestetadas,
        totalNodrizas: s.totalNodrizas,
        netoDestetes: s.netoDestetes,
        loteCreacionId: s.loteCreacionId,
        semanaCreacionLote: s.semanaCreacionLote,
        totalCreaciones: s.totalCreaciones,
        programadasDisponiblesHoy: s.programadasDisponiblesHoy,
        guardarFuturoProgramadas: s.guardarFuturoProgramadas,
        descartePlanificadoFaenadora: s.descartePlanificadoFaenadora,
        descarteAjusteFaenadora: s.descarteAjusteFaenadora,
        totalFaenadora: s.totalFaenadora,
        totalDisponible: s.totalDisponible,
        montasReales: s.montasReales,
        diferencia: s.diferencia,
        cumplimientoPorcentaje: s.cumplimientoPorcentaje,
        mes: s.mes,
        anio: s.anio,
        notas: s.notas || undefined,
        guardadaEnHistorial: s.guardadaEnHistorial
      };
    }

    const programadas: ProgramadaItem[] = programadasDb.map(p => ({
      id: p.id,
      semanaOrigen: p.semanaOrigen,
      cantidad: p.cantidad,
      semanaDestino: p.semanaDestino,
      fechaCreacion: p.fechaCreacion,
      notas: p.notas || undefined,
      estado: (p.estado as any) || 'pendiente'
    }));

    const batches: BatchCreacion[] = batchesDb.map(b => ({
      id: b.id,
      loteNumero: b.loteNumero,
      totalBatch: b.totalBatch,
      semanaInicio: b.semanaInicio || 1,
      distribucion: {
        semana1: b.semana1,
        semana2: b.semana2,
        semana3: b.semana3,
        semana4: b.semana4
      },
      totalDistribuido: b.totalDistribuido,
      pendientes: b.pendientes,
      notas: b.notas || undefined
    }));

    const numSemanas = Object.keys(semanasMap).map(Number);
    const semActualDerivada = numSemanas.length > 0 ? Math.max(...numSemanas) : 1;

    const estado: EstadoGlobalFarm = {
      semanaActual: semActualDerivada,
      semanas: semanasMap,
      programadas,
      batches
    };

    return NextResponse.json(estado, { headers });
  } catch (err: any) {
    console.error('Error en GET /api/estado:', err);
    return NextResponse.json({ error: err.message || 'Error del servidor' }, { status: 500, headers });
  }
}

export async function POST(req: NextRequest) {
  const headers = {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  };

  if (!db) {
    return NextResponse.json({ error: 'DATABASE_URL no configurada' }, { status: 500, headers });
  }

  try {
    const nuevoEstado = await req.json() as EstadoGlobalFarm & { isReset?: boolean };
    if (!nuevoEstado || !nuevoEstado.semanas) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400, headers });
    }

    if (nuevoEstado.isReset === true) {
      console.log('[API] Reset explícito: borrando todas las tablas...');
      await db.delete(schema.destetesDias);
      await db.delete(schema.programadas);
      await db.delete(schema.batchesCreacion);
      await db.delete(schema.semanas);
    }

    for (const sem of Object.values(nuevoEstado.semanas)) {
      await db
        .insert(schema.semanas)
        .values({
          numeroSemana: sem.numeroSemana,
          id: sem.id,
          fechaInicio: sem.fechaInicio,
          metaSemanal: sem.metaSemanal,
          totalDestetadas: sem.totalDestetadas,
          totalNodrizas: sem.totalNodrizas,
          netoDestetes: sem.netoDestetes,
          loteCreacionId: sem.loteCreacionId,
          semanaCreacionLote: sem.semanaCreacionLote,
          totalCreaciones: sem.totalCreaciones,
          programadasDisponiblesHoy: sem.programadasDisponiblesHoy,
          guardarFuturoProgramadas: sem.guardarFuturoProgramadas,
          descartePlanificadoFaenadora: sem.descartePlanificadoFaenadora,
          descarteAjusteFaenadora: sem.descarteAjusteFaenadora,
          totalFaenadora: sem.totalFaenadora,
          totalDisponible: sem.totalDisponible,
          montasReales: sem.montasReales,
          diferencia: sem.diferencia,
          cumplimientoPorcentaje: sem.cumplimientoPorcentaje,
          mes: sem.mes,
          anio: sem.anio,
          notas: sem.notas,
          guardadaEnHistorial: sem.guardadaEnHistorial || false
        })
        .onConflictDoUpdate({
          target: schema.semanas.numeroSemana,
          set: {
            id: sem.id,
            fechaInicio: sem.fechaInicio,
            metaSemanal: sem.metaSemanal,
            totalDestetadas: sem.totalDestetadas,
            totalNodrizas: sem.totalNodrizas,
            netoDestetes: sem.netoDestetes,
            loteCreacionId: sem.loteCreacionId,
            semanaCreacionLote: sem.semanaCreacionLote,
            totalCreaciones: sem.totalCreaciones,
            programadasDisponiblesHoy: sem.programadasDisponiblesHoy,
            guardarFuturoProgramadas: sem.guardarFuturoProgramadas,
            descartePlanificadoFaenadora: sem.descartePlanificadoFaenadora,
            descarteAjusteFaenadora: sem.descarteAjusteFaenadora,
            totalFaenadora: sem.totalFaenadora,
            totalDisponible: sem.totalDisponible,
            montasReales: sem.montasReales,
            diferencia: sem.diferencia,
            cumplimientoPorcentaje: sem.cumplimientoPorcentaje,
            notas: sem.notas,
            guardadaEnHistorial: sem.guardadaEnHistorial || false
          }
        });

      if (sem.destetes && Array.isArray(sem.destetes)) {
        for (const d of sem.destetes) {
          const diaId = `${sem.id}-dia${d.dia}`;
          await db
            .insert(schema.destetesDias)
            .values({
              id: diaId,
              numeroSemana: sem.numeroSemana,
              dia: d.dia,
              nombreDia: d.nombreDia,
              fecha: d.fecha,
              total: d.total,
              nodrizas: d.nodrizas,
              neto: d.neto
            })
            .onConflictDoUpdate({
              target: schema.destetesDias.id,
              set: {
                total: d.total,
                nodrizas: d.nodrizas,
                neto: d.neto,
                fecha: d.fecha
              }
            });
        }
      }
    }

    if (nuevoEstado.batches && Array.isArray(nuevoEstado.batches)) {
      for (const b of nuevoEstado.batches) {
        await db
          .insert(schema.batchesCreacion)
          .values({
            id: b.id,
            loteNumero: b.loteNumero,
            totalBatch: b.totalBatch,
            semanaInicio: b.semanaInicio || 1,
            semana1: b.distribucion.semana1,
            semana2: b.distribucion.semana2,
            semana3: b.distribucion.semana3,
            semana4: b.distribucion.semana4,
            fechaIngreso: new Date().toISOString().split('T')[0],
            totalDistribuido: b.totalDistribuido,
            pendientes: b.pendientes,
            notas: b.notas
          })
          .onConflictDoUpdate({
            target: schema.batchesCreacion.id,
            set: {
              loteNumero: b.loteNumero,
              totalBatch: b.totalBatch,
              semanaInicio: b.semanaInicio || 1,
              semana1: b.distribucion.semana1,
              semana2: b.distribucion.semana2,
              semana3: b.distribucion.semana3,
              semana4: b.distribucion.semana4,
              totalDistribuido: b.totalDistribuido,
              pendientes: b.pendientes,
              notas: b.notas
            }
          });
      }
    }

    if (nuevoEstado.programadas && Array.isArray(nuevoEstado.programadas)) {
      for (const p of nuevoEstado.programadas) {
        await db
          .insert(schema.programadas)
          .values({
            id: p.id,
            semanaOrigen: p.semanaOrigen,
            cantidad: p.cantidad,
            semanaDestino: p.semanaDestino,
            fechaCreacion: p.fechaCreacion,
            notas: p.notas,
            estado: p.estado
          })
          .onConflictDoUpdate({
            target: schema.programadas.id,
            set: {
              semanaOrigen: p.semanaOrigen,
              cantidad: p.cantidad,
              semanaDestino: p.semanaDestino,
              notas: p.notas,
              estado: p.estado
            }
          });
      }
    }

    return NextResponse.json({ ok: true }, { headers });
  } catch (err: any) {
    console.error('Error en POST /api/estado:', err);
    return NextResponse.json({ error: err.message || 'Error del servidor' }, { status: 500, headers });
  }
}

export async function DELETE() {
  const headers = {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  };

  if (!db) {
    return NextResponse.json({ error: 'DATABASE_URL no configurada' }, { status: 500, headers });
  }

  try {
    await db.delete(schema.destetesDias);
    await db.delete(schema.programadas);
    await db.delete(schema.batchesCreacion);
    await db.delete(schema.semanas);
    return NextResponse.json({ ok: true, message: 'Base de datos vaciada exitosamente' }, { headers });
  } catch (err: any) {
    console.error('Error en DELETE /api/estado:', err);
    return NextResponse.json({ error: err.message || 'Error del servidor' }, { status: 500, headers });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    },
  });
}