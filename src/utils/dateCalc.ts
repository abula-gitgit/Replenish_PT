import { ConsumableItem, CalculatedItem, CycleUnit, ItemStatus } from '../types/consumable';

export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDays(dateStr: string, days: number): string {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

export function subtractDays(dateStr: string, days: number): string {
  return addDays(dateStr, -days);
}

export function addCycle(dateStr: string, cycleValue: number, cycleUnit: CycleUnit): string {
  const d = parseDate(dateStr);
  switch (cycleUnit) {
    case 'day':
      d.setDate(d.getDate() + cycleValue);
      break;
    case 'week':
      d.setDate(d.getDate() + cycleValue * 7);
      break;
    case 'month':
      d.setMonth(d.getMonth() + cycleValue);
      break;
    case 'year':
      d.setFullYear(d.getFullYear() + cycleValue);
      break;
  }
  return formatDate(d);
}

export function diffInDays(targetDateStr: string, baseDateStr: string): number {
  const target = parseDate(targetDateStr);
  const base = parseDate(baseDateStr);
  const diffTime = target.getTime() - base.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function getCycleUnitLabel(unit: CycleUnit, count = 1): string {
  switch (unit) {
    case 'day':
      return count === 1 ? 'dia' : 'dias';
    case 'week':
      return count === 1 ? 'semana' : 'semanas';
    case 'month':
      return count === 1 ? 'mês' : 'meses';
    case 'year':
      return count === 1 ? 'ano' : 'anos';
    default:
      return '';
  }
}

export function calculateItem(item: ConsumableItem, todayStr: string = getTodayString()): CalculatedItem {
  const nextReplacementDate = addCycle(item.lastReplacedDate, item.cycleValue, item.cycleUnit);
  const purchaseReminderDate = subtractDays(nextReplacementDate, item.purchaseLeadDays);

  const daysUntilReplacement = diffInDays(nextReplacementDate, todayStr);
  const daysUntilPurchaseReminder = diffInDays(purchaseReminderDate, todayStr);

  const totalCycleDays = diffInDays(nextReplacementDate, item.lastReplacedDate);
  const elapsedDays = diffInDays(todayStr, item.lastReplacedDate);

  let lifeRemainingPercent = 0;
  if (totalCycleDays > 0) {
    const raw = Math.round(((totalCycleDays - elapsedDays) / totalCycleDays) * 100);
    lifeRemainingPercent = Math.max(0, Math.min(100, raw));
  }

  let status: ItemStatus = 'normal';
  let statusLabel = '';

  if (daysUntilReplacement < 0) {
    status = 'overdue';
    const abs = Math.abs(daysUntilReplacement);
    statusLabel = `${abs} d. de atraso`;
  } else if (daysUntilReplacement === 0) {
    status = 'today';
    statusLabel = 'Vence hoje!';
  } else if (daysUntilPurchaseReminder <= 0) {
    status = 'buy_soon';
    statusLabel = `Comprar em breve (${daysUntilReplacement} d.)`;
  } else {
    status = 'normal';
    statusLabel = `Em dia (${daysUntilReplacement} d.)`;
  }

  return {
    ...item,
    nextReplacementDate,
    purchaseReminderDate,
    daysUntilReplacement,
    daysUntilPurchaseReminder,
    lifeRemainingPercent,
    status,
    statusLabel
  };
}

export function sortCalculatedItems(items: CalculatedItem[], sortOption: string): CalculatedItem[] {
  const sorted = [...items];
  switch (sortOption) {
    case 'priority': {
      const priorityOrder: Record<ItemStatus, number> = {
        overdue: 0,
        today: 1,
        buy_soon: 2,
        normal: 3
      };
      return sorted.sort((a, b) => {
        const pA = priorityOrder[a.status];
        const pB = priorityOrder[b.status];
        if (pA !== pB) return pA - pB;
        return a.daysUntilReplacement - b.daysUntilReplacement;
      });
    }
    case 'date_asc':
      return sorted.sort((a, b) => a.daysUntilReplacement - b.daysUntilReplacement);
    case 'date_desc':
      return sorted.sort((a, b) => b.daysUntilReplacement - a.daysUntilReplacement);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'pt'));
    default:
      return sorted;
  }
}

export function formatDateDisplay(dateStr: string, includeYear = true): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  if (!includeYear) {
    return `${day}/${month}`;
  }
  return `${day}/${month}/${year}`;
}

export interface CalendarGridCell {
  dateStr: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: 'sat' | 'sun' | null;
}

export function getCalendarGrid(year: number, month: number, todayStr: string): CalendarGridCell[] {
  const firstDay = new Date(year, month, 1);
  const startDayOfWeek = firstDay.getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: CalendarGridCell[] = [];

  // Previous month trailing days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = month === 0 ? 12 : month;
    const y = month === 0 ? year - 1 : year;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dateObj = new Date(y, m - 1, d);
    const dayOfWeek = dateObj.getDay();

    cells.push({
      dateStr,
      dayNumber: d,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isWeekend: dayOfWeek === 0 ? 'sun' : dayOfWeek === 6 ? 'sat' : null
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dateObj = new Date(year, month, d);
    const dayOfWeek = dateObj.getDay();

    cells.push({
      dateStr,
      dayNumber: d,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      isWeekend: dayOfWeek === 0 ? 'sun' : dayOfWeek === 6 ? 'sat' : null
    });
  }

  // Next month leading days to complete full grid
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const m = month === 11 ? 1 : month + 2;
    const y = month === 11 ? year + 1 : year;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dateObj = new Date(y, m - 1, d);
    const dayOfWeek = dateObj.getDay();

    cells.push({
      dateStr,
      dayNumber: d,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isWeekend: dayOfWeek === 0 ? 'sun' : dayOfWeek === 6 ? 'sat' : null
    });
  }

  return cells;
}
