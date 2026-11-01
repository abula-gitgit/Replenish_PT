import React, { useState } from 'react';
import { X, Calendar, Check } from 'lucide-react';
import { CalculatedItem } from '../types/consumable';
import { getTodayString, getCycleUnitLabel } from '../utils/dateCalc';

interface CustomReplaceModalProps {
  isOpen: boolean;
  item: CalculatedItem | null;
  onClose: () => void;
  onConfirm: (itemId: string, replacedDate: string, memo: string) => void;
}

export const CustomReplaceModal: React.FC<CustomReplaceModalProps> = ({
  isOpen,
  item,
  onClose,
  onConfirm
}) => {
  const [replacedDate, setReplacedDate] = useState(getTodayString());
  const [memo, setMemo] = useState('');

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replacedDate) return;
    onConfirm(item.id, replacedDate, memo.trim());
    onClose();
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
              <Calendar className="w-4 h-4 stroke-[2.4]" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Registar substituição com data
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
            <span className="text-xs text-slate-400 block font-medium">Artigo selecionado</span>
            <span className="text-base font-extrabold text-slate-900 block mt-0.5 tracking-tight">{item.name}</span>
            <span className="text-xs text-slate-500 block mt-0.5 font-medium">
              Ciclo configurado: A cada {item.cycleValue} {getCycleUnitLabel(item.cycleUnit, item.cycleValue)}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Data efetiva da substituição <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={replacedDate}
              onChange={(e) => setReplacedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/80 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
            />
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => setReplacedDate(getTodayString())}
                className="text-xs text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer font-bold"
              >
                Hoje
              </button>
              <span className="text-slate-300">·</span>
              <button
                type="button"
                onClick={() => {
                  const y = new Date();
                  y.setDate(y.getDate() - 1);
                  setReplacedDate(y.toISOString().slice(0, 10));
                }}
                className="text-xs text-slate-600 hover:text-slate-900 hover:underline cursor-pointer font-medium"
              >
                Ontem
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Notas / Lembrete (Opcional)
            </label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="ex.: usado recarga original, limpeza profunda..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/80 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 rounded-xl shadow-xs shadow-emerald-600/25 transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[2.4]" />
              <span>Registar substituição</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
