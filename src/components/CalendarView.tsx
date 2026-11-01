import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Calendar as CalendarIcon, 
  Clock, 
  ShoppingCart, 
  Check, 
  ExternalLink, 
  X, 
  Tag
} from 'lucide-react';
import { CalculatedItem } from '../types/consumable';
import { getCalendarGrid, getTodayString, parseDate, formatDateDisplay } from '../utils/dateCalc';

interface CalendarViewProps {
  items: CalculatedItem[];
  onQuickReplace: (item: CalculatedItem) => void;
  onCustomReplace: (item: CalculatedItem) => void;
  onEdit: (item: CalculatedItem) => void;
  onViewHistory: (item: CalculatedItem) => void;
}

export interface DayEvent {
  type: 'replacement' | 'purchase';
  item: CalculatedItem;
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const CalendarView: React.FC<CalendarViewProps> = ({
  items,
  onQuickReplace,
  onCustomReplace,
  onViewHistory
}) => {
  const todayStr = getTodayString();
  const todayDate = parseDate(todayStr);

  const [currentYear, setCurrentYear] = useState<number>(todayDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(todayDate.getMonth());
  const [selectedDayDateStr, setSelectedDayDateStr] = useState<string | null>(null);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    setCurrentYear(todayDate.getFullYear());
    setCurrentMonth(todayDate.getMonth());
    setSelectedDayDateStr(todayStr);
  };

  const gridDays = useMemo(() => {
    return getCalendarGrid(currentYear, currentMonth, todayStr);
  }, [currentYear, currentMonth, todayStr]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, DayEvent[]>();

    const addEvent = (dateStr: string, event: DayEvent) => {
      if (!map.has(dateStr)) {
        map.set(dateStr, []);
      }
      map.get(dateStr)!.push(event);
    };

    items.forEach((item) => {
      if (item.nextReplacementDate) {
        addEvent(item.nextReplacementDate, {
          type: 'replacement',
          item
        });
      }

      if (item.purchaseReminderDate && item.purchaseLeadDays > 0) {
        addEvent(item.purchaseReminderDate, {
          type: 'purchase',
          item
        });
      }
    });

    return map;
  }, [items]);

  const monthStats = useMemo(() => {
    const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    let replacements = 0;
    let purchases = 0;

    items.forEach((item) => {
      if (item.nextReplacementDate.startsWith(monthPrefix)) replacements++;
      if (item.purchaseReminderDate.startsWith(monthPrefix) && item.purchaseLeadDays > 0) purchases++;
    });

    return { replacements, purchases };
  }, [items, currentYear, currentMonth]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDayDateStr) return [];
    return eventsByDate.get(selectedDayDateStr) || [];
  }, [selectedDayDateStr, eventsByDate]);

  return (
    <div className="space-y-4">
      {/* Calendar Top Control Bar */}
      <div className="bg-white/85 backdrop-blur-md py-3 px-4 sm:px-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Navigation buttons and Year/Month title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200/60">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-all cursor-pointer active:scale-95"
              title="Mês anterior"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-all cursor-pointer active:scale-95"
              title="Mês seguinte"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>

          <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 tabular-nums">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </h2>

          <button
            onClick={handleJumpToToday}
            className="ml-1 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/70 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95 shadow-2xs"
          >
            <RotateCcw className="w-3 h-3 stroke-[2.5]" />
            <span>Oggi</span>
          </button>
        </div>

        {/* Legend & Month Summary */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-1.5 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200/50">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Prazos: <strong className="font-extrabold text-emerald-950 tabular-nums">{monthStats.replacements}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 bg-sky-50/80 px-2.5 py-1 rounded-lg border border-sky-200/50">
            <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
            <span>Avisos: <strong className="font-extrabold text-sky-950 tabular-nums">{monthStats.purchases}</strong></span>
          </div>

          <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200/80 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-xs border-2 border-emerald-500 bg-emerald-50" />
              Oggi
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Em atraso
            </span>
          </div>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-slate-200/70 text-center text-xs font-bold py-3 bg-slate-50/80">
          <div className="text-rose-600">Dom</div>
          <div className="text-slate-700">Seg</div>
          <div className="text-slate-700">Ter</div>
          <div className="text-slate-700">Qua</div>
          <div className="text-slate-700">Qui</div>
          <div className="text-slate-700">Sex</div>
          <div className="text-sky-600">Sáb</div>
        </div>

        {/* Calendar days matrix */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
          {gridDays.map((cell) => {
            const dayEvents = eventsByDate.get(cell.dateStr) || [];
            const hasEvents = dayEvents.length > 0;
            const isToday = cell.isToday;
            const isCurrentMonth = cell.isCurrentMonth;

            return (
              <div
                key={cell.dateStr}
                onClick={() => setSelectedDayDateStr(cell.dateStr)}
                className={`min-h-[96px] sm:min-h-[115px] p-2 sm:p-2.5 flex flex-col justify-between transition-all cursor-pointer relative group ${
                  !isCurrentMonth
                    ? 'bg-slate-50/40 text-slate-400'
                    : 'bg-white hover:bg-slate-50/80'
                } ${isToday ? 'ring-2 ring-emerald-500 ring-inset bg-emerald-50/20' : ''}`}
              >
                {/* Cell Header: Date Number and "Today" badge */}
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span
                    className={`text-xs sm:text-sm font-bold tabular-nums rounded-lg px-2 py-0.5 transition-colors ${
                      isToday
                        ? 'bg-emerald-600 text-white font-extrabold shadow-2xs'
                        : cell.isWeekend === 'sun'
                        ? 'text-rose-600'
                        : cell.isWeekend === 'sat'
                        ? 'text-sky-600'
                        : isCurrentMonth
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {isToday && (
                    <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      Oggi
                    </span>
                  )}
                </div>

                {/* Events list within cell */}
                <div className="space-y-1 flex-1 overflow-hidden">
                  {dayEvents.slice(0, 3).map((event, idx) => {
                    const isReplacement = event.type === 'replacement';
                    const item = event.item;

                    let badgeClass = '';
                    let IconComponent = Clock;

                    if (isReplacement) {
                      IconComponent = Clock;
                      if (item.status === 'overdue') {
                        badgeClass = 'bg-rose-50 text-rose-800 border-rose-200/80 hover:bg-rose-100 font-semibold';
                      } else if (item.status === 'today') {
                        badgeClass = 'bg-amber-50 text-amber-800 border-amber-200/80 hover:bg-amber-100 font-semibold';
                      } else {
                        badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100 font-semibold';
                      }
                    } else {
                      IconComponent = ShoppingCart;
                      badgeClass = 'bg-sky-50 text-sky-800 border-sky-200/80 hover:bg-sky-100 font-semibold';
                    }

                    return (
                      <div
                        key={`${event.type}-${item.id}-${idx}`}
                        className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-lg border truncate flex items-center gap-1.5 transition-colors shadow-2xs ${badgeClass}`}
                        title={`${isReplacement ? '[Substituição]' : '[Aviso de compra]'} ${item.name} (${item.category})`}
                      >
                        <IconComponent className="w-3 h-3 shrink-0 stroke-[2.2]" />
                        <span className="truncate">
                          {isReplacement ? 'Substituir: ' : 'Comprar: '}{item.name}
                        </span>
                      </div>
                    );
                  })}

                  {dayEvents.length > 3 && (
                    <div className="text-[10px] text-slate-500 font-bold text-center bg-slate-100/70 rounded-md py-0.5">
                      +{dayEvents.length - 3} mais
                    </div>
                  )}
                </div>

                {/* Bottom hint on hover */}
                {hasEvents && (
                  <div className="text-[9.5px] text-emerald-700 text-right opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                    Detalhes
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Day Details Modal */}
      {selectedDayDateStr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center border border-emerald-200/60 shadow-2xs">
                  <CalendarIcon className="w-4 h-4 stroke-[2.4]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                    Eventos de {formatDateDisplay(selectedDayDateStr)}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedDayEvents.length > 0
                      ? `${selectedDayEvents.length} evento(s) agendado(s)`
                      : 'Nenhum evento agendado'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDayDateStr(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                aria-label="Chiudi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-3.5 max-h-[70vh] overflow-y-auto">
              {selectedDayEvents.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  Nenhuma substituição ou lembrete de compra planeado para esta data.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDayEvents.map((event, idx) => {
                    const isReplacement = event.type === 'replacement';
                    const item = event.item;

                    return (
                      <div
                        key={`modal-event-${event.type}-${item.id}-${idx}`}
                        className={`p-4 rounded-2xl border transition-all ${
                          isReplacement
                            ? item.status === 'overdue'
                              ? 'border-rose-200 bg-rose-50/40'
                              : item.status === 'today'
                              ? 'border-amber-200 bg-amber-50/40'
                              : 'border-emerald-200 bg-emerald-50/40'
                            : 'border-sky-200 bg-sky-50/40'
                        }`}
                      >
                        {/* Event Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            {isReplacement ? (
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
                                  item.status === 'overdue'
                                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                                    : item.status === 'today'
                                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                }`}
                              >
                                <Clock className="w-3.5 h-3.5 stroke-[2.2]" />
                                <span>Substituição agendada</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">
                                <ShoppingCart className="w-3.5 h-3.5 stroke-[2.2]" />
                                <span>Aviso de compra</span>
                              </span>
                            )}

                            <span className="text-xs font-semibold text-slate-600 bg-white/80 px-2.5 py-0.5 rounded-md border border-slate-200/60">
                              {item.category}
                            </span>
                          </div>

                          <span className="text-xs font-bold tabular-nums text-slate-700">
                            {item.statusLabel}
                          </span>
                        </div>

                        {/* Title & Model */}
                        <h4 className="text-base font-bold text-slate-900 mb-1 tracking-tight">
                          {item.name}
                        </h4>

                        {item.modelNumber && (
                          <div className="flex items-center gap-1 text-xs text-slate-500 font-mono mb-2">
                            <Tag className="w-3 h-3 text-slate-400" />
                            <span>Modelo: {item.modelNumber}</span>
                          </div>
                        )}

                        {item.memo && (
                          <p className="text-xs text-slate-600 mb-3 bg-white/80 p-2.5 rounded-xl border border-slate-200/60 leading-relaxed">
                            {item.memo}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-200/60">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                onQuickReplace(item);
                                setSelectedDayDateStr(null);
                              }}
                              className="px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-xs shadow-emerald-600/20 transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[2.8]" />
                              <span>Substituído hoje</span>
                            </button>

                            <button
                              onClick={() => {
                                onCustomReplace(item);
                                setSelectedDayDateStr(null);
                              }}
                              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer bg-white active:scale-95"
                            >
                              Outra data
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.purchaseUrl && (
                              <a
                                href={item.purchaseUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 text-xs font-bold text-sky-800 bg-sky-100 hover:bg-sky-200 border border-sky-300/60 rounded-xl transition-colors inline-flex items-center gap-1 active:scale-95"
                              >
                                <span>Comprar</span>
                                <ExternalLink className="w-3 h-3 stroke-[2]" />
                              </a>
                            )}
                            <button
                              onClick={() => {
                                onViewHistory(item);
                                setSelectedDayDateStr(null);
                              }}
                              className="px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                            >
                              Histórico
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 border-t border-slate-100 flex justify-end bg-slate-50/70">
              <button
                onClick={() => setSelectedDayDateStr(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer active:scale-95"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
