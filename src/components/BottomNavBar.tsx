import React from 'react';
import { LayoutGrid, Calendar, History, ShoppingCart, Plus, BookOpen } from 'lucide-react';

export type BottomNavTab = 'stock' | 'schedule' | 'history' | 'buy' | 'insights' | 'guide';

interface BottomNavBarProps {
  currentTab: BottomNavTab;
  onTabChange: (tab: BottomNavTab) => void;
  onOpenAddModal: () => void;
  urgentCount?: number;
  buyCount?: number;
  hasBottomAd?: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onTabChange,
  onOpenAddModal,
  urgentCount = 0,
  buyCount = 0,
  hasBottomAd = false,
}) => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className={`fixed ${hasBottomAd ? 'bottom-[50px]' : 'bottom-0 pb-[env(safe-area-inset-bottom)]'} inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-4px_24px_rgba(15,23,42,0.06)] md:hidden transition-all duration-300`}
    >
      <div className="max-w-md mx-auto grid grid-cols-6 h-[54px] px-1 safe-area-inset-bottom items-center">
        {/* Tab 1: Stock (Cards List) */}
        <button
          type="button"
          onClick={() => onTabChange('stock')}
          className={`flex flex-col items-center justify-center gap-0.5 transition-all relative cursor-pointer active:scale-95 ${
            currentTab === 'stock'
              ? 'text-emerald-700 font-extrabold'
              : 'text-slate-400 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <LayoutGrid className={`w-[19px] h-[19px] transition-transform ${currentTab === 'stock' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {urgentCount > 0 && currentTab !== 'stock' && (
              <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            )}
          </div>
          <span className="text-[10px] tracking-tight leading-tight">Artigos</span>
        </button>

        {/* Tab 2: Schedule (Monthly Calendar) */}
        <button
          type="button"
          onClick={() => onTabChange('schedule')}
          className={`flex flex-col items-center justify-center gap-0.5 transition-all relative cursor-pointer active:scale-95 ${
            currentTab === 'schedule'
              ? 'text-emerald-700 font-extrabold'
              : 'text-slate-400 hover:text-slate-800 font-medium'
          }`}
        >
          <Calendar className={`w-[19px] h-[19px] transition-transform ${currentTab === 'schedule' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight leading-tight">Calendário</span>
        </button>

        {/* Tab 3: Add Item (+) Floating Accent */}
        <button
          type="button"
          onClick={onOpenAddModal}
          className="flex flex-col items-center justify-center gap-0.5 transition-all relative cursor-pointer text-emerald-700 hover:text-emerald-800 active:scale-90 group -mt-2"
          aria-label="Adicionar artículo"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
            <Plus className="w-4 h-4 stroke-[2.8]" />
          </div>
          <span className="text-[9.5px] font-bold text-emerald-800 tracking-tight leading-tight">Adicionar</span>
        </button>

        {/* Tab 4: History (Exchange Timeline) */}
        <button
          type="button"
          onClick={() => onTabChange('history')}
          className={`flex flex-col items-center justify-center gap-0.5 transition-all relative cursor-pointer active:scale-95 ${
            currentTab === 'history'
              ? 'text-emerald-700 font-extrabold'
              : 'text-slate-400 hover:text-slate-800 font-medium'
          }`}
        >
          <History className={`w-[19px] h-[19px] transition-transform ${currentTab === 'history' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight leading-tight">Histórico</span>
        </button>

        {/* Tab 5: Buy (Purchase Reminders) */}
        <button
          type="button"
          onClick={() => onTabChange('buy')}
          className={`flex flex-col items-center justify-center gap-0.5 transition-all relative cursor-pointer active:scale-95 ${
            currentTab === 'buy'
              ? 'text-emerald-700 font-extrabold'
              : 'text-slate-400 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <ShoppingCart className={`w-[19px] h-[19px] transition-transform ${currentTab === 'buy' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {buyCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[15px] h-4 px-1 rounded-full bg-sky-500 text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-white">
                {buyCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight leading-tight">Compras</span>
        </button>

        {/* Tab 6: Guide (Replacement & Hygiene Cycle Guide) */}
        <button
          type="button"
          onClick={() => onTabChange('guide')}
          className={`flex flex-col items-center justify-center gap-0.5 transition-all relative cursor-pointer active:scale-95 ${
            currentTab === 'guide'
              ? 'text-emerald-700 font-extrabold'
              : 'text-slate-400 hover:text-slate-800 font-medium'
          }`}
        >
          <BookOpen className={`w-[19px] h-[19px] transition-transform ${currentTab === 'guide' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight leading-tight">Guia</span>
        </button>
      </div>
    </nav>
  );
};
