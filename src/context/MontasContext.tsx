'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { EstadoGlobalFarm, SemanaMontas, ProgramadaItem, BatchCreacion, DiaDestete } from '@/types/montas';
import { guardarEstadoEnServer, sincronizarEstadoConServer, resetearEstadoASeed, exportarEstadoJSON, exportarHistorialCSV } from '@/lib/storage';
import { crearSemanaInicial } from '@/lib/seedData';
import { calcularTotalesDestetes, calcularTotalDisponible, calcularDiferencia, calcularCumplimiento, calcularSemanaDesdeFecha, sincronizarFechasDestetes } from '@/lib/calculos';

interface MontasContextType {
  estado: EstadoGlobalFarm;
  semanaActualData: SemanaMontas;
  cambiarSemanaActual: (numero: number) => void;
  seleccionarFechaYRecalcularSemana: (fechaStr: string) => void;
  guardarSemanaActualEnHistorial: () => void;
  actualizarDesteteDia: (diaIndex: number, field: 'total' | 'nodrizas', value: number) => void;
  actualizarSemanaField: (field: keyof SemanaMontas, value: any) => void;
  agregarProgramada: (semanaOrigen: number, cantidad: number, notas?: string) => void;
  eliminarProgramada: (id: string) => void;
  agregarBatch: (loteNumero: number, totalBatch: number, distribucion: { semana1: number; semana2: number; semana3: number; semana4: number }) => void;
  actualizarBatch: (id: string, distribucion: { semana1: number; semana2: number; semana3: number; semana4: number }) => void;
  exportarBackup: () => void;
  exportarCSV: () => void;
  resetearValores: () => void;
  importarBackupJSON: (content: string) => boolean;
}

const MontasContext = createContext<MontasContextType | undefined>(undefined);

// Debounce helper: espera N ms tras el último cambio antes de ejecutar
function useDebouncedEffect(callback: () => void, delay: number, deps: any[]) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(callback, delay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, deps);
}

export const MontasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Calcular la semana actual al iniciar
  const getSemanaHoy = () => {
    const hoy = new Date();
    const fechaHoy = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    return calcularSemanaDesdeFecha(fechaHoy);
  };

  const [estado, setEstado] = useState<EstadoGlobalFarm>(() => {
    const { numeroSemana } = getSemanaHoy();
    return {
      semanaActual: numeroSemana,
      semanas: { [numeroSemana]: crearSemanaInicial(numeroSemana) },
      programadas: [],
      batches: []
    };
  });

  const isLoadedRef = useRef(false);
  const saveCounterRef = useRef(0);

  // 1. Carga inicial desde el servidor (solo 1 vez), siempre aterriza en la semana actual
  useEffect(() => {
    sincronizarEstadoConServer(estado).then(remoteState => {
      if (remoteState && remoteState.semanas && Object.keys(remoteState.semanas).length > 0) {
        const { numeroSemana } = getSemanaHoy();
        const nuevasSemanas = { ...remoteState.semanas };
        if (!nuevasSemanas[numeroSemana]) {
          nuevasSemanas[numeroSemana] = crearSemanaInicial(numeroSemana);
        }
        setEstado({
          ...remoteState,
          semanaActual: numeroSemana,
          semanas: nuevasSemanas
        });
      }
      isLoadedRef.current = true;
    }).catch(() => {
      isLoadedRef.current = true;
    });
  }, []);

  // 2. Auto-guardado con DEBOUNCE de 1.5s
  useDebouncedEffect(() => {
    if (!isLoadedRef.current) return;
    saveCounterRef.current += 1;
    if (saveCounterRef.current <= 1) return;
    
    console.log('[Sync] Guardando estado en Neon DB...');
    guardarEstadoEnServer(estado).catch(err => {
      console.warn('[Sync] Error guardando:', err);
    });
  }, 1500, [estado]);

  const recalcularSemana = (sem: SemanaMontas, programadasHoyCalc?: number, programadasLista?: ProgramadaItem[]): SemanaMontas => {
    const listProg = programadasLista || estado?.programadas || [];
    const destetesSincronizados = sincronizarFechasDestetes(sem.destetes, sem.fechaInicio);
    const { totalDestetadas, totalNodrizas, netoDestetes } = calcularTotalesDestetes(destetesSincronizados);
    const totalFaenadora = (Number(sem.descartePlanificadoFaenadora) || 0) + (Number(sem.descarteAjusteFaenadora) || 0);
    
    const progDisponibles = programadasHoyCalc !== undefined 
      ? programadasHoyCalc 
      : listProg
          .filter(p => p.semanaDestino === sem.numeroSemana && p.estado !== 'cancelado')
          .reduce((acc, p) => acc + p.cantidad, 0);

    const progGuardarFuturo = listProg
      .filter(p => p.semanaOrigen === sem.numeroSemana && p.estado !== 'cancelado')
      .reduce((acc, p) => acc + p.cantidad, 0);

    const totalDisponible = calcularTotalDisponible({
      netoDestetes,
      totalCreaciones: Number(sem.totalCreaciones) || 0,
      programadasDisponiblesHoy: progDisponibles,
      totalFaenadora,
      guardarFuturoProgramadas: progGuardarFuturo
    });

    const metaSemanal = Number(sem.metaSemanal) || 239;
    const montasReales = Number(sem.montasReales) || totalDisponible;
    const diferencia = calcularDiferencia(totalDisponible, metaSemanal);
    const cumplimientoPorcentaje = calcularCumplimiento(montasReales, metaSemanal);

    return {
      ...sem,
      destetes: destetesSincronizados,
      totalDestetadas,
      totalNodrizas,
      netoDestetes,
      programadasDisponiblesHoy: progDisponibles,
      guardarFuturoProgramadas: progGuardarFuturo,
      totalFaenadora,
      totalDisponible,
      montasReales,
      diferencia,
      cumplimientoPorcentaje
    };
  };

  const numSemana = estado.semanaActual;
  const semActualRaw = estado.semanas[numSemana] || crearSemanaInicial(numSemana);
  const semanaActualData: SemanaMontas = recalcularSemana(semActualRaw, undefined, estado.programadas);

  const cambiarSemanaActual = (numero: number) => {
    if (numero < 1) return;
    setEstado(prev => {
      const exist = prev.semanas[numero];
      const nuevasSemanas = { ...prev.semanas };
      if (!exist) {
        nuevasSemanas[numero] = crearSemanaInicial(numero);
      }
      return {
        ...prev,
        semanaActual: numero,
        semanas: nuevasSemanas
      };
    });
  };

  const seleccionarFechaYRecalcularSemana = (fechaStr: string) => {
    const { numeroSemana, fechaInicioLunes, mes, anio } = calcularSemanaDesdeFecha(fechaStr);

    setEstado(prev => {
      const nuevasSemanas = { ...prev.semanas };
      const semExistente = nuevasSemanas[numeroSemana] || crearSemanaInicial(numeroSemana);

      const sumaProgDestino = prev.programadas
        .filter(p => p.semanaDestino === numeroSemana && p.estado !== 'cancelado')
        .reduce((acc, p) => acc + p.cantidad, 0);

      const semModificada: SemanaMontas = {
        ...semExistente,
        numeroSemana,
        fechaInicio: fechaInicioLunes,
        mes,
        anio
      };

      nuevasSemanas[numeroSemana] = recalcularSemana(semModificada, sumaProgDestino, prev.programadas);

      return {
        ...prev,
        semanaActual: numeroSemana,
        semanas: nuevasSemanas
      };
    });
  };

  const guardarSemanaActualEnHistorial = () => {
    setEstado(prev => {
      const semActual = prev.semanas[prev.semanaActual] || crearSemanaInicial(prev.semanaActual);
      const semGuardada: SemanaMontas = {
        ...semActual,
        guardadaEnHistorial: true
      };
      const semRecalculada = recalcularSemana(semGuardada, undefined, prev.programadas);

      return {
        ...prev,
        semanas: {
          ...prev.semanas,
          [prev.semanaActual]: semRecalculada
        }
      };
    });
  };

  const actualizarDesteteDia = (diaIndex: number, field: 'total' | 'nodrizas', value: number) => {
    setEstado(prev => {
      const semActual = prev.semanas[prev.semanaActual] || crearSemanaInicial(prev.semanaActual);
      const nuevosDestetes = [...semActual.destetes];
      
      const itemAnterior = nuevosDestetes[diaIndex];
      const valNum = Math.max(0, Number(value) || 0);

      nuevosDestetes[diaIndex] = {
        ...itemAnterior,
        [field]: valNum,
        neto: field === 'total' 
          ? valNum - itemAnterior.nodrizas 
          : itemAnterior.total - valNum
      };

      const semModificada = { ...semActual, destetes: nuevosDestetes };
      const semRecalculada = recalcularSemana(semModificada, undefined, prev.programadas);

      return {
        ...prev,
        semanas: {
          ...prev.semanas,
          [prev.semanaActual]: semRecalculada
        }
      };
    });
  };

  const actualizarSemanaField = (field: keyof SemanaMontas, value: any) => {
    setEstado(prev => {
      const semActual = prev.semanas[prev.semanaActual] || crearSemanaInicial(prev.semanaActual);
      const semModificada = { ...semActual, [field]: value };
      const semRecalculada = recalcularSemana(semModificada, undefined, prev.programadas);

      return {
        ...prev,
        semanas: {
          ...prev.semanas,
          [prev.semanaActual]: semRecalculada
        }
      };
    });
  };

  const agregarProgramada = (semanaOrigen: number, cantidad: number, notas: string = '') => {
    const semanaDestino = semanaOrigen + 3;
    const nueva: ProgramadaItem = {
      id: `prog-${Date.now()}`,
      semanaOrigen,
      cantidad: Math.max(1, cantidad),
      semanaDestino,
      fechaCreacion: new Date().toISOString().split('T')[0],
      notas,
      estado: 'pendiente'
    };

    setEstado(prev => {
      const nuevasProgramadas = [nueva, ...prev.programadas];
      const nuevasSemanas = { ...prev.semanas };

      if (nuevasSemanas[semanaOrigen]) {
        nuevasSemanas[semanaOrigen] = recalcularSemana(nuevasSemanas[semanaOrigen], undefined, nuevasProgramadas);
      }
      if (nuevasSemanas[semanaDestino]) {
        nuevasSemanas[semanaDestino] = recalcularSemana(nuevasSemanas[semanaDestino], undefined, nuevasProgramadas);
      }

      return {
        ...prev,
        programadas: nuevasProgramadas,
        semanas: nuevasSemanas
      };
    });
  };

  const eliminarProgramada = (id: string) => {
    setEstado(prev => {
      const itemAEliminar = prev.programadas.find(p => p.id === id);
      const nuevasProgramadas = prev.programadas.filter(p => p.id !== id);
      const nuevasSemanas = { ...prev.semanas };

      if (itemAEliminar) {
        const { semanaOrigen, semanaDestino } = itemAEliminar;
        if (nuevasSemanas[semanaOrigen]) {
          nuevasSemanas[semanaOrigen] = recalcularSemana(nuevasSemanas[semanaOrigen], undefined, nuevasProgramadas);
        }
        if (nuevasSemanas[semanaDestino]) {
          nuevasSemanas[semanaDestino] = recalcularSemana(nuevasSemanas[semanaDestino], undefined, nuevasProgramadas);
        }
      }

      return {
        ...prev,
        programadas: nuevasProgramadas,
        semanas: nuevasSemanas
      };
    });
  };

  const agregarBatch = (loteNumero: number, totalBatch: number, distribucion: { semana1: number; semana2: number; semana3: number; semana4: number }) => {
    const totalDistribuido = distribucion.semana1 + distribucion.semana2 + distribucion.semana3 + distribucion.semana4;
    const semIni = estado.semanaActual;
    const nuevo: BatchCreacion = {
      id: `batch-${Date.now()}`,
      loteNumero,
      totalBatch,
      semanaInicio: semIni,
      distribucion,
      totalDistribuido,
      pendientes: Math.max(0, totalBatch - totalDistribuido),
      notas: `Batch Lote ${loteNumero} creado`
    };

    setEstado(prev => {
      const nuevasSemanas = { ...prev.semanas };
      const distArray = [distribucion.semana1, distribucion.semana2, distribucion.semana3, distribucion.semana4];

      distArray.forEach((cant, idx) => {
        const numSem = semIni + idx;
        const semExistente = nuevasSemanas[numSem] || crearSemanaInicial(numSem);
        const semModificada = {
          ...semExistente,
          loteCreacionId: loteNumero,
          semanaCreacionLote: idx + 1,
          totalCreaciones: cant
        };
        nuevasSemanas[numSem] = recalcularSemana(semModificada, undefined, prev.programadas);
      });

      return {
        ...prev,
        batches: [nuevo, ...prev.batches],
        semanas: nuevasSemanas
      };
    });
  };

  const actualizarBatch = (id: string, distribucion: { semana1: number; semana2: number; semana3: number; semana4: number }) => {
    setEstado(prev => {
      let semIni = prev.semanaActual;
      const nuevosBatches = prev.batches.map(b => {
        if (b.id === id) {
          semIni = b.semanaInicio;
          const totalDistribuido = distribucion.semana1 + distribucion.semana2 + distribucion.semana3 + distribucion.semana4;
          return {
            ...b,
            distribucion,
            totalDistribuido,
            pendientes: Math.max(0, b.totalBatch - totalDistribuido)
          };
        }
        return b;
      });

      const nuevasSemanas = { ...prev.semanas };
      const distArray = [distribucion.semana1, distribucion.semana2, distribucion.semana3, distribucion.semana4];

      distArray.forEach((cant, idx) => {
        const numSem = semIni + idx;
        const semExistente = nuevasSemanas[numSem] || crearSemanaInicial(numSem);
        const semModificada = {
          ...semExistente,
          totalCreaciones: cant
        };
        nuevasSemanas[numSem] = recalcularSemana(semModificada, undefined, prev.programadas);
      });

      return {
        ...prev,
        batches: nuevosBatches,
        semanas: nuevasSemanas
      };
    });
  };

  const exportarBackup = () => exportarEstadoJSON(estado);
  const exportarCSV = () => exportarHistorialCSV(estado);
  const resetearValores = async () => {
    const limpio = resetearEstadoASeed();
    setEstado(limpio);
    saveCounterRef.current = 0;
    isLoadedRef.current = false;
    await guardarEstadoEnServer({ ...limpio, isReset: true } as any);
    isLoadedRef.current = true;
    saveCounterRef.current = 1;
  };

  const importarBackupJSON = (content: string): boolean => {
    try {
      const parsed = JSON.parse(content) as EstadoGlobalFarm;
      if (parsed && parsed.semanas && parsed.programadas) {
        setEstado(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <MontasContext.Provider
      value={{
        estado,
        semanaActualData,
        cambiarSemanaActual,
        seleccionarFechaYRecalcularSemana,
        guardarSemanaActualEnHistorial,
        actualizarDesteteDia,
        actualizarSemanaField,
        agregarProgramada,
        eliminarProgramada,
        agregarBatch,
        actualizarBatch,
        exportarBackup,
        exportarCSV,
        resetearValores,
        importarBackupJSON
      }}
    >
      {children}
    </MontasContext.Provider>
  );
};

export function useMontas() {
  const context = useContext(MontasContext);
  if (!context) {
    throw new Error('useMontas debe usarse dentro de un MontasProvider');
  }
  return context;
}