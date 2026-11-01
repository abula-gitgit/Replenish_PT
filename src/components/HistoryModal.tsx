import React from 'react';
import { X, History, Trash2, Calendar, ShoppingCart, ExternalLink } from 'lucide-react';
import { CalculatedItem } from '../types/consumable';
import { formatDateDisplay } from '../utils/dateCalc';

interface HistoryModalProps {
  isOpen: boolean;
  item: CalculatedItem | null;
  onClose: () => void;
  onDeleteHistoryEntry: (itemId: string, historyRecordId: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  item,
  onClose,
  onDeleteHistoryEntry
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <History className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Histórico e detalhes do artigo
              </h2>
              <p className="text-xs text-slate-400 font-medium">{item.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Quick info overview */}
          <div className="grid grid-cols-2 gap-2 text-xs p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Categoria</span>
              <span className="font-bold text-slate-800">{item.category}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Código de modelo / Referência</span>
              <span className="font-mono font-bold text-slate-800 select-all">
                {item.modelNumber || 'Não especificado'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Próxima substituição</span>
              <span className="font-extrabold text-slate-900 tabular-nums">
                {formatDateDisplay(item.nextReplacementDate)}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Aviso de compra</span>
              <span className="font-extrabold text-amber-700 tabular-nums">
                {formatDateDisplay(item.purchaseReminderDate)}
              </span>
            </div>
            {item.purchaseUrl && (
              <div className="col-span-2 pt-2.5 border-t border-slate-200/60">
                <a
                  href={item.purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1 font-bold"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Abrir ligação de compra guardada</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* History records */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 mb-2.5 flex items-center justify-between">
              <span>Histórico de substituições ({item.history?.length || 0})</span>
            </h3>

            {!item.history || item.history.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 font-medium">
                Nenhuma substituição registada até ao momento. Clique em "Substituído hoje" ou "Substituir em data personalizada" para adicionar um registo.
              </div>
            ) : (
              <div className="space-y-2">
                {item.history
                  .slice()
                  .reverse()
                  .map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3.5 bg-white border border-slate-200/80 rounded-2xl flex items-start justify-between gap-3 text-xs shadow-2xs hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0 mt-0.5 border border-emerald-100">
                          <Calendar className="w-3.5 h-3.5 stroke-[2.2]" />
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-900 tabular-nums block">
                            {formatDateDisplay(rec.replacedDate)}
                          </span>
                          {rec.memo && (
                            <p className="text-slate-600 text-xs mt-1 leading-relaxed bg-slate-50 p-2 rounded-xl">
                              {rec.memo}
                            </p>
                          )}
                          <span className="text-[10px] text-slate-400 block mt-1 font-medium">
                            Registado em: {new Date(rec.recordedAt).toLocaleString('pt-PT')}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteHistoryEntry(item.id, rec.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Eliminar este registo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>
            )}
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
