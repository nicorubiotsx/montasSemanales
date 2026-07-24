import React, { useRef, useState } from 'react';
import { useMontas } from '../../context/MontasContext';
import { PiggyBank, Download, FileSpreadsheet, RotateCcw, Upload, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '../UI/Button';

export const Header: React.FC = () => {
  const { estado, exportarBackup, exportarCSV, resetearValores, importarBackupJSON } = useMontas();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

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

  const handleConfirmReset = async () => {
    setIsResetting(true);
    try {
      await resetearValores();
      window.location.reload();
    } catch (error) {
      console.error('Error al resetear valores:', error);
      setIsResetting(false);
      setShowConfirmReset(false);
      alert('Hubo un error al vaciar la base de datos.');
    }
  };

  return (
    <>
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
              onClick={() => setShowConfirmReset(true)}
              title="Vaciar base de datos y navegador"
            >
              🧹 Vaciar DB & Blanco
            </Button>
          </div>
        </div>
      </header>

      {/* Modal de Confirmación de Borrado */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-red-500/30 shadow-2xl shadow-red-500/10 rounded-2xl max-w-md w-full overflow-hidden animate-slide-up">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 mx-auto border border-red-500/20">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              
              <h3 className="text-xl font-bold text-white text-center mb-2">
                ¿Vaciar la Base de Datos?
              </h3>
              
              <p className="text-slate-400 text-sm text-center mb-6">
                Esta acción borrará <strong className="text-red-400">TODOS los datos</strong> almacenados en Neon DB y en el navegador. 
                Iniciará con la aplicación 100% en blanco. <br className="my-1"/>
                Esta acción no se puede deshacer.
              </p>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="secondary"
                  className="w-full justify-center"
                  onClick={() => setShowConfirmReset(false)}
                  disabled={isResetting}
                >
                  Cancelar
                </Button>
                <button
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-xl transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleConfirmReset}
                  disabled={isResetting}
                >
                  {isResetting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Borrando...
                    </>
                  ) : (
                    'Sí, vaciar datos'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
