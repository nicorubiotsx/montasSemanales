import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface DatePickerPopoverProps {
  value: string; // Formato YYYY-MM-DD
  onChange: (newDate: string) => void;
  label?: string;
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DIAS_SEMANA_CORTOS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

export const DatePickerPopover: React.FC<DatePickerPopoverProps> = ({
  value,
  onChange,
  label = 'FECHA INICIO'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parsear la fecha guardada (YYYY-MM-DD)
  const parseDate = (str: string) => {
    if (!str) return new Date();
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  };

  const selectedDate = parseDate(value);

  // Estado del mes/año que se está visualizando en el calendario
  const [viewDate, setViewDate] = useState<Date>(() => selectedDate);

  useEffect(() => {
    setViewDate(parseDate(value));
  }, [value]);

  // Cerrar si se hace clic fuera del popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  // Días del mes actual
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  // Ajustar para que Lunes sea 0 y Domingo sea 6
  let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startingDayOfWeek === -1) startingDayOfWeek = 6;

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Días del mes anterior para rellenar
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const handleSelectDay = (day: number, isCurrentMonth: boolean = true) => {
    let targetYear = viewYear;
    let targetMonth = viewMonth;
    if (!isCurrentMonth) {
      // no hacer nada o ajustar si se desea
    }
    const formattedMonth = String(targetMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${targetYear}-${formattedMonth}-${formattedDay}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  const handleSetToday = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    onChange(dateStr);
    setViewDate(today);
    setIsOpen(false);
  };

  const handleSetCurrentMonday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 es domingo, 1 es lunes
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    const y = monday.getFullYear();
    const m = String(monday.getMonth() + 1).padStart(2, '0');
    const d = String(monday.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    onChange(dateStr);
    setViewDate(monday);
    setIsOpen(false);
  };

  // Formato amigable de la fecha seleccionada
  const formattedSelected = `${selectedDate.getDate()} de ${MESES[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;

  // Construir celdas del calendario
  const calendarCells = [];
  
  // Días del mes anterior
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const prevDay = daysInPrevMonth - i;
    calendarCells.push({
      day: prevDay,
      isCurrentMonth: false,
      key: `prev-${prevDay}`
    });
  }

  // Días del mes actual
  for (let d = 1; d <= daysInMonth; d++) {
    const isSelected =
      selectedDate.getFullYear() === viewYear &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getDate() === d;

    const today = new Date();
    const isToday =
      today.getFullYear() === viewYear &&
      today.getMonth() === viewMonth &&
      today.getDate() === d;

    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      isSelected,
      isToday,
      key: `curr-${d}`
    });
  }

  // Días del mes siguiente para completar 42 celdas (6 semanas)
  const remainingCells = 42 - calendarCells.length;
  for (let n = 1; n <= remainingCells; n++) {
    calendarCells.push({
      day: n,
      isCurrentMonth: false,
      key: `next-${n}`
    });
  }

  return (
    <div className="relative inline-block w-full" ref={containerRef}>
      {/* Botón / Campo disparador */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 hover:border-emerald-500/60 transition-all flex items-center gap-2.5 text-left cursor-pointer group"
      >
        <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
          <CalendarIcon className="w-4 h-4" />
        </div>
        <div className="flex-1 overflow-hidden">
          <label className="text-[10px] font-bold text-slate-400 uppercase block leading-none mb-1">
            {label}
          </label>
          <span className="text-xs font-semibold text-slate-100 block truncate">
            {formattedSelected}
          </span>
        </div>
      </button>

      {/* Popover flotante del Calendario */}
      {isOpen && (
        <div className="absolute left-0 mt-2 z-50 w-72 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-4 animate-fade-in backdrop-blur-md">
          {/* Cabecera del Calendario: Mes y Año */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Mes anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-center">
              <span className="text-sm font-extrabold text-slate-100 block">
                {MESES[viewMonth]} {viewYear}
              </span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Mes siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Días de la semana header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DIAS_SEMANA_CORTOS.map((d, i) => (
              <span key={d} className={`text-[10px] font-bold uppercase py-1 ${i >= 5 ? 'text-amber-400' : 'text-slate-400'}`}>
                {d}
              </span>
            ))}
          </div>

          {/* Grid de días */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarCells.map(cell => {
              if (!cell.isCurrentMonth) {
                return (
                  <span
                    key={cell.key}
                    className="py-1.5 text-xs text-slate-600 cursor-not-allowed select-none opacity-40"
                  >
                    {cell.day}
                  </span>
                );
              }

              return (
                <button
                  key={cell.key}
                  type="button"
                  onClick={() => handleSelectDay(cell.day, true)}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    cell.isSelected
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-950/40 scale-105'
                      : cell.isToday
                      ? 'border border-emerald-500 text-emerald-400 hover:bg-emerald-500/20 font-bold'
                      : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          {/* Accesos Rápidos */}
          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
            <button
              type="button"
              onClick={handleSetToday}
              className="text-[11px] font-bold text-emerald-400 hover:underline cursor-pointer"
            >
              Hoy
            </button>
            <button
              type="button"
              onClick={handleSetCurrentMonday}
              className="text-[11px] font-bold text-sky-400 hover:underline cursor-pointer"
            >
              Lunes de esta semana
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
