import React, { useRef } from 'react';
import { useMontas } from '../../context/MontasContext';
import { PiggyBank, Download, FileSpreadsheet, RotateCcw, Upload } from 'lucide-react';
import { Button } from '../UI/Button';

export const Header: React.FC = () => {
  const { estado, exportarBackup, exportarCSV, resetearValores, importarBackupJSON } = useMontas();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importarBackupJSON(content);
        if (ok) {
          alert('¡Respaldo cargado correctamente!');
        } else {
          alert('El archivo no tiene el formato JSON de montas porcinas válido.');
        }
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  return (
    <header className="bg-slate-900/95 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md px-6 py-4 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-pink-500 to-rose-600 p-2.5 rounded-xl shadow-lg shadow-pink-500/20 text-white">
            <PiggyBank className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white font-sans">
                GESTIÓN DE MONTAS SEMANALES
              </h1>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                Granja Porcina v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Planificación, cálculo de disponibilidad y control de inventario de hembras
            </p>
          </div>
        </div>

        {/* Acciones de Respaldo & CSV */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <Button
            variant="secondary"
            size="sm"
            icon={<Upload className="w-4 h-4 text-sky-400" />}
            onClick={() => fileInputRef.current?.click()}
            title="Importar archivo JSON"
          >
            Importar JSON
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<Download className="w-4 h-4 text-emerald-400" />}
            onClick={exportarBackup}
            title="Exportar respaldo completo en JSON"
          >
            Guardar JSON
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<FileSpreadsheet className="w-4 h-4 text-emerald-400" />}
            onClick={exportarCSV}
            title="Exportar historial semanal en CSV / Excel"
          >
            Exportar Excel
          </Button>

          <Button
            variant="ghost"
            size="sm"
            icon={<RotateCcw className="w-4 h-4 text-slate-400" />}
            onClick={async () => {
              if (confirm('¿Deseas vaciar la base de datos Neon DB y el navegador para iniciar con la aplicación 100% en blanco?')) {
                await resetearValores();
                window.location.reload();
              }
            }}
            title="Vaciar base de datos y navegador"
          >
            🧹 Vaciar DB & Blanco
          </Button>
        </div>
      </div>
    </header>
  );
};
