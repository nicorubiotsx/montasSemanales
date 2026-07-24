import { EstadoGlobalFarm } from '@/types/montas';
import { obtenerEstadoInicial } from './seedData';

export async function sincronizarEstadoConServer(estadoLocal: EstadoGlobalFarm): Promise<EstadoGlobalFarm> {
  try {
    const response = await fetch('/api/estado');
    const contentType = response.headers.get('content-type');
    if (response.ok && contentType && contentType.includes('application/json')) {
      const remoteState = await response.json();
      if (remoteState && remoteState.semanas) {
        return remoteState;
      }
    }
  } catch (err) {
    console.warn('[Storage] Error leyendo desde Neon DB / API:', err);
  }
  return estadoLocal;
}

export async function guardarEstadoEnServer(estado: EstadoGlobalFarm): Promise<void> {
  try {
    const response = await fetch('/api/estado', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(estado)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn('[Storage] Error guardando en Neon DB:', response.status, errorData);
    }
  } catch (err) {
    console.warn('[Storage] Error de red guardando en Neon DB:', err);
  }
}

export function resetearEstadoASeed(): EstadoGlobalFarm {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.clear();
  }
  return obtenerEstadoInicial();
}

export function exportarEstadoJSON(estado: EstadoGlobalFarm): void {
  const jsonStr = JSON.stringify(estado, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_montas_porcinas_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportarHistorialCSV(estado: EstadoGlobalFarm): void {
  let semanas = Object.values(estado.semanas)
    .filter(s => s.guardadaEnHistorial)
    .sort((a, b) => a.numeroSemana - b.numeroSemana);

  if (semanas.length === 0) {
    semanas = Object.values(estado.semanas).sort((a, b) => a.numeroSemana - b.numeroSemana);
  }

  if (semanas.length === 0) {
    alert('No hay información de semanas disponible para exportar.');
    return;
  }

  const totalMeta = semanas.reduce((acc, s) => acc + (s.metaSemanal || 0), 0);
  const totalDestetadas = semanas.reduce((acc, s) => acc + (s.totalDestetadas || 0), 0);
  const totalNodrizas = semanas.reduce((acc, s) => acc + (s.totalNodrizas || 0), 0);
  const totalNetoDestetes = semanas.reduce((acc, s) => acc + (s.netoDestetes || 0), 0);
  const totalCreaciones = semanas.reduce((acc, s) => acc + (s.totalCreaciones || 0), 0);
  const totalProgramadas = semanas.reduce((acc, s) => acc + (s.programadasDisponiblesHoy || 0), 0);
  const totalFaenadora = semanas.reduce((acc, s) => acc + (s.totalFaenadora || 0), 0);
  const totalGuardarFuturo = semanas.reduce((acc, s) => acc + (s.guardarFuturoProgramadas || 0), 0);
  const totalDisponible = semanas.reduce((acc, s) => acc + (s.totalDisponible || 0), 0);
  const totalMontasReales = semanas.reduce((acc, s) => acc + (s.montasReales || 0), 0);
  const totalDiferencia = totalDisponible - totalMeta;
  const promedioCumplimiento = totalMeta > 0 ? ((totalMontasReales / totalMeta) * 100).toFixed(1) : '0.0';

  const fechaHoy = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const htmlContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8" />
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Gestión de Montas</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        body { font-family: 'Segoe UI', Calibri, Helvetica, Arial, sans-serif; font-size: 11pt; color: #1e293b; }
        .title-table { margin-bottom: 20px; }
        .main-title { font-size: 18pt; font-weight: bold; color: #0f172a; text-align: left; }
        .subtitle { font-size: 10pt; color: #64748b; margin-bottom: 10px; }
        
        .kpi-card { background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 10px; text-align: center; }
        .kpi-title { font-size: 9pt; font-weight: bold; color: #475569; text-transform: uppercase; }
        .kpi-value { font-size: 14pt; font-weight: bold; color: #0284c7; }
        
        table.data-table { border-collapse: collapse; width: 100%; font-size: 10pt; }
        table.data-table th { background-color: #0f172a; color: #ffffff; font-weight: bold; padding: 10px 8px; border: 1px solid #1e293b; text-align: center; }
        table.data-table td { padding: 8px; border: 1px solid #e2e8f0; text-align: center; }
        
        tr.even { background-color: #f8fafc; }
        tr.odd { background-color: #ffffff; }
        
        .text-left { text-align: left !important; }
        .text-right { text-align: right !important; }
        .font-bold { font-weight: bold; }
        
        .badge-success { background-color: #dcfce7; color: #15803d; font-weight: bold; padding: 3px 8px; border-radius: 4px; }
        .badge-warning { background-color: #fef3c7; color: #b45309; font-weight: bold; padding: 3px 8px; border-radius: 4px; }
        .badge-danger { background-color: #fee2e2; color: #b91c1c; font-weight: bold; padding: 3px 8px; border-radius: 4px; }
        
        .totals-row td { background-color: #0284c7; color: #ffffff; font-weight: bold; border-top: 2px solid #0369a1; padding: 10px 8px; }
      </style>
    </head>
    <body>
      <table class="title-table">
        <tr>
          <td colspan="15" class="main-title">REPORTE EJECUTIVO DE GESTIÓN DE MONTAS SEMANALES</td>
        </tr>
        <tr>
          <td colspan="15" class="subtitle">Granja Porcina — Exportado el ${fechaHoy} | Semanas registradas: ${semanas.length}</td>
        </tr>
      </table>

      <br/>

      <table class="data-table">
        <thead>
          <tr>
            <th>SEMANA</th>
            <th>FECHA INICIO</th>
            <th>META (Nº)</th>
            <th>DESTETADAS (+)</th>
            <th>NODRIZAS (-)</th>
            <th>NETO DESTETES</th>
            <th>CREACIONES (+)</th>
            <th>PROGRAMADAS (+21d)</th>
            <th>FAENADORA (-)</th>
            <th>FUTURO PROGRAMADAS (-)</th>
            <th>TOTAL DISPONIBLE</th>
            <th>MONTAS REALES</th>
            <th>DIFERENCIA</th>
            <th>% CUMPLIMIENTO</th>
            <th>NOTAS</th>
          </tr>
        </thead>
        <tbody>
          ${semanas.map((s, idx) => {
            const isEven = idx % 2 === 0;
            const cumplimiento = Number(s.cumplimientoPorcentaje) || 0;
            let badgeClass = 'badge-danger';
            if (cumplimiento >= 100) badgeClass = 'badge-success';
            else if (cumplimiento >= 90) badgeClass = 'badge-warning';

            return `
              <tr class="${isEven ? 'even' : 'odd'}">
                <td class="font-bold">Semana ${s.numeroSemana}</td>
                <td>${s.fechaInicio || '-'}</td>
                <td class="font-bold">${s.metaSemanal || 239}</td>
                <td>${s.totalDestetadas || 0}</td>
                <td>${s.totalNodrizas || 0}</td>
                <td class="font-bold">${s.netoDestetes || 0}</td>
                <td>${s.totalCreaciones || 0}</td>
                <td>${s.programadasDisponiblesHoy || 0}</td>
                <td>${s.totalFaenadora || 0}</td>
                <td>${s.guardarFuturoProgramadas || 0}</td>
                <td class="font-bold" style="color:#0284c7;">${s.totalDisponible || 0}</td>
                <td class="font-bold" style="color:#0f172a;">${s.montasReales || 0}</td>
                <td style="color:${(s.diferencia || 0) >= 0 ? '#15803d' : '#b91c1c'}; font-weight:bold;">
                  ${(s.diferencia || 0) > 0 ? '+' : ''}${s.diferencia || 0}
                </td>
                <td>
                  <span class="${badgeClass}">${cumplimiento.toFixed(1)}%</span>
                </td>
                <td class="text-left" style="font-size:9pt; color:#64748b;">${(s.notas || '').replace(/</g, '<').replace(/>/g, '>')}</td>
              </tr>
            `;
          }).join('')}

          <tr class="totals-row">
            <td colspan="2" class="text-left font-bold">TOTALES ACUMULADOS / PROMEDIO</td>
            <td>${totalMeta}</td>
            <td>${totalDestetadas}</td>
            <td>${totalNodrizas}</td>
            <td>${totalNetoDestetes}</td>
            <td>${totalCreaciones}</td>
            <td>${totalProgramadas}</td>
            <td>${totalFaenadora}</td>
            <td>${totalGuardarFuturo}</td>
            <td>${totalDisponible}</td>
            <td>${totalMontasReales}</td>
            <td>${totalDiferencia > 0 ? '+' : ''}${totalDiferencia}</td>
            <td>${promedioCumplimiento}%</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\uFEFF' + htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `reporte_montas_porcinas_${new Date().toISOString().split('T')[0]}.xls`;
  a.click();
  URL.revokeObjectURL(url);
}