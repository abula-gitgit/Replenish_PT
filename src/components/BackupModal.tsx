import React, { useRef, useState } from 'react';
import { X, Download, Upload, RefreshCw, AlertCircle, CheckCircle2, Database, Trash2 } from 'lucide-react';
import { ConsumableItem, MasterOption } from '../types/consumable';
import { exportToJSONFile, parseAndValidateImportJSON } from '../utils/storage';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ConsumableItem[];
  masterOptions?: MasterOption[];
  categories?: string[];
  onImportItems: (newItems: ConsumableItem[]) => void;
  onImportMasterOptions?: (newOptions: MasterOption[]) => void;
  onImportCategories?: (newCategories: string[]) => void;
  onResetToSample: () => void;
  onClearAll: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  items,
  masterOptions,
  categories,
  onImportItems,
  onImportMasterOptions,
  onImportCategories,
  onResetToSample,
  onClearAll
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    exportToJSONFile(items, masterOptions, categories);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = parseAndValidateImportJSON(content);
      if (result.success && result.items) {
        onImportItems(result.items);
        if (result.masterOptions && onImportMasterOptions) {
          onImportMasterOptions(result.masterOptions);
        }
        if (result.categories && onImportCategories) {
          onImportCategories(result.categories);
        }
        const parts = [
          `${result.items.length} artigos`,
          result.masterOptions ? `${result.masterOptions.length} modelo(s)` : '',
          result.categories ? `${result.categories.length} categoria(s)` : ''
        ].filter(Boolean);
        setImportStatus({
          type: 'success',
          message: `Importado com sucesso: ${parts.join(', ')}.`
        });
      } else {
        setImportStatus({
          type: 'error',
          message: result.error || 'Erro ao ler o ficheiro de cópia de segurança.'
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Database className="w-4 h-4 stroke-[2.2]" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Gestão de dados e cópias de segurança
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {importStatus && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 font-medium ${
                importStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}
            >
              {importStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}

          {/* Export JSON */}
          <div className="p-4 sm:p-4.5 rounded-2xl border border-slate-200/80 bg-slate-50/80">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1">
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Exportar cópia de segurança (JSON)</span>
            </h3>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed font-medium">
              Descarga tus datos actuales ({items.length} artigos) en un archivo JSON. Ideal para cambiar de dispositivo o como respaldo periódico de seguridad.
            </p>
            <button
              onClick={handleExport}
              disabled={items.length === 0}
              className="w-full py-2.5 px-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Transferir ficheiro de cópia de segurança</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-4 sm:p-4.5 rounded-2xl border border-slate-200/80 bg-slate-50/80">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1">
              <Upload className="w-4 h-4 text-sky-600" />
              <span>Restaurar a partir de cópia de segurança (JSON)</span>
            </h3>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed font-medium">
              Selecciona un archivo JSON de Replenish para restaurar artigos, historial y plantillas guardadas.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-3 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 active:scale-95 border border-slate-200/80 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Selecionar ficheiro JSON</span>
            </button>
          </div>

          {/* Reset / Clear actions */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  if (window.confirm('¿Cargar los artigos de ejemplo? Tus artigos actuales se sustituirán por los datos de prueba.')) {
                    onResetToSample();
                    onClose();
                  }
                }}
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer p-1 font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                <span>Restaurar com exemplos</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Tem a certeza de que pretende eliminar todos os consumíveis guardados? Esta ação não pode ser anulada.')) {
                    onClearAll();
                    onClose();
                  }
                }}
                className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer p-1 font-bold"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Eliminar todos os dados</span>
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-3.5 border-t border-slate-100 flex justify-end bg-slate-50/70">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
