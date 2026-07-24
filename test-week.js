// Reproduce the exact function from calculos.ts
function calcularSemanaDesdeFecha(fechaStr) {
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

  const thursday = new Date(monday);
  thursday.setDate(monday.getDate() + 3);
  const isoYear = thursday.getFullYear();

  const jan4 = new Date(isoYear, 0, 4);
  const jan4DayOfWeek = jan4.getDay();
  const jan4DiffToMonday = jan4DayOfWeek === 0 ? -6 : 1 - jan4DayOfWeek;
  const firstISOMonday = new Date(jan4);
  firstISOMonday.setDate(jan4.getDate() + jan4DiffToMonday);

  const diffMs = monday.getTime() - firstISOMonday.getTime();
  const numeroSemana = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1;

  return { 
    input: fechaStr,
    monday: monday.toISOString().split('T')[0], 
    firstISOMonday: firstISOMonday.toISOString().split('T')[0],
    isoYear,
    numeroSemana 
  };
}

console.log('=== Test: 20 julio 2026 (Lunes) - Esperado: Semana 30 ===');
console.log(calcularSemanaDesdeFecha('2026-07-20'));

console.log('\n=== Test: 16 julio 2026 (Jueves) - Esperado: Semana 29 ===');
console.log(calcularSemanaDesdeFecha('2026-07-16'));

console.log('\n=== Test: 24 julio 2026 (Viernes) - Esperado: Semana 30 ===');
console.log(calcularSemanaDesdeFecha('2026-07-24'));

console.log('\n=== Test: 5 enero 2026 (Lunes) - Esperado: Semana 2 ===');
console.log(calcularSemanaDesdeFecha('2026-01-05'));

console.log('\n=== Test: 29 dic 2025 (Lunes) - Esperado: Semana 1 de 2026 ===');
console.log(calcularSemanaDesdeFecha('2025-12-29'));

console.log('\n=== Test: 1 enero 2026 (Jueves) - Esperado: Semana 1 ===');
console.log(calcularSemanaDesdeFecha('2026-01-01'));
