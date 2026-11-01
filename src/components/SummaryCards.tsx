import React from 'react';
import { ItemStatus } from '../types/consumable';
import { Layers, AlertCircle, Clock, ShoppingCart, CheckCircle2 } from 'lucide-react';

interface SummaryCardsProps {
  statusCounts: {
    total: number;
    overdue: number;
    today: number;
    buy_soon: number;
    normal: number;
  };
  activeStatusFilter: ItemStatus | 'all';
  onSelectStatusFilter: (status: ItemStatus | 'all') => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  statusCounts,
  activeStatusFilter,
  onSelectStatusFilter
}) => {
  const cards = [
    {
      id: 'all' as const,
      label: 'Todos',
      count: statusCounts.total,
      icon: Layers,
      iconBg: 'bg-slate-100 text-slate-700',
      countColor: 'text-slate-900',
      activeRing: 'ring-2 ring-slate-900 border-slate-900 bg-white shadow-sm',
      hoverBorder: 'hover:border-slate-300'
    },
    {
      id: 'overdue' as const,
      label: 'Em atraso',
      count: statusCounts.overdue,
      icon: AlertCircle,
      iconBg: 'bg-rose-50 text-rose-600',
      countColor: 'text-rose-600',
      activeRing: 'ring-2 ring-rose-500 border-rose-500 bg-rose-50/20 shadow-sm shadow-rose-500/10',
      hoverBorder: 'hover:border-rose-300'
    },
    {
      id: 'today' as const,
      label: 'Hoje',
      count: statusCounts.today,
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-600',
      countColor: 'text-amber-600',
      activeRing: 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/20 shadow-sm shadow-amber-500/10',
      hoverBorder: 'hover:border-amber-300'
    },
    {
      id: 'buy_soon' as const,
      label: 'A comprar',
      count: statusCounts.buy_soon,
      icon: ShoppingCart,
      iconBg: 'bg-sky-50 text-sky-600',
      countColor: 'text-sky-600',
      activeRing: 'ring-2 ring-sky-500 border-sky-500 bg-sky-50/20 shadow-sm shadow-sky-500/10',
      hoverBorder: 'hover:border-sky-300'
    },
    {
      id: 'normal' as const,
      label: 'Em dia',
      count: statusCounts.normal,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600',
      countColor: 'text-emerald-600',
      activeRing: 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20 shadow-sm shadow-emerald-500/10',
      hoverBorder: 'hover:border-emerald-300'
    }
  ];

  return (
    <div className="mb-4">
      <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
        {cards.map((card) => {
          const isActive = activeStatusFilter === card.id;
          const Icon = card.icon;

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onSelectStatusFilter(card.id)}
              className={`rounded-2xl text-center transition-all duration-200 cursor-pointer p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2.5 min-w-0 border relative overflow-hidden group ${
                isActive
                  ? `${card.activeRing} scale-[1.02]`
                  : `bg-white border-slate-300 shadow-2xs hover:bg-slate-50 ${card.hoverBorder} hover:shadow-xs hover:-translate-y-0.5`
              }`}
            >
              {isActive && (
                <div className="absolute top-0 inset-x-0 h-0.5 bg-current opacity-70" />
              )}

              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 min-w-0">
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${card.iconBg}`}>
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                </div>
                <span className={`text-[10px] sm:text-xs font-semibold truncate text-center sm:text-left leading-tight transition-colors ${
                  isActive ? 'text-slate-900 font-bold' : 'text-slate-600 group-hover:text-slate-900'
                }`}>
                  {card.label}
                </span>
              </div>

              <div className="flex items-baseline justify-center sm:justify-end">
                <span className={`text-base sm:text-xl font-extrabold leading-none tabular-nums tracking-tight ${card.countColor}`}>
                  {card.count}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
