import React, { useState, useMemo } from 'react';
import {
  History,
  Calendar,
  Search,
  Download,
  Trash2,
  ArrowLeft,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  AlertCircle,
  PackageOpen,
  Sparkles,
  Droplets,
  Wind,
  Laptop,
  Smile,
  Shirt,
  ShieldAlert,
  Baby,
  PawPrint,
  Car,
  Home,
  Layers,
  RotateCcw,
  TrendingUp,
  Award,
  CalendarDays
} from 'lucide-react';
import { CalculatedItem, Category } from '../types/consumable';
import { formatDateDisplay, getTodayString } from '../utils/dateCalc';
import { getCategoryStyle } from '../utils/categoryColors';

interface HistoryTimelineViewProps {
  items: CalculatedItem[];
  categories: string[];
  onDeleteHistoryEntry: (itemId: string, historyRecordId: string) => void;
  onNavigateToList: () => void;
  onEditItem?: (item: CalculatedItem) => void;
}

interface FlatHistoryItem {
  recordId: string;
  itemId: string;
  itemName: string;
  category: Category;
  modelNumber?: string;
  purchaseUrl?: string;
  replacedDate: string;
  memo?: string;
  recordedAt: string;
  previousReplacedDate?: string;
  nextReplacementDate: string;
  daysUntilReplacement: number;
  item: CalculatedItem;
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const getCategoryIcon = (category: Category) => {
  switch (category) {
    case 'Cocina y Baño':
    case 'Electrodomésticos':
    case 'Electrónica y Oficina':
    case 'Salud y Bienestar':
    case 'Cuidado Personal y Belleza':
    case 'Ropa y Temporada':
    case 'Emergencia y Seguridad':
    case 'Bebés y Niños':
    case 'Mascotas':
    case 'Automóvil y Movilidad':
    case 'Hogar y Bricolaje':
    case 'Uso Diario y Otros':
    case 'Cucina e Sanitari':
    case 'Küche & Sanitär':
    case 'Cuisine & Salle de bain':
    case 'Kitchen & Bath':
      return Droplets;
    case 'Elettrodomestici':
    case 'Haushaltsgeräte':
    case 'Électroménager':
    case 'Appliances':
      return Wind;
    case 'Elettronica e Ufficio':
    case 'Elektronik & Büro':
    case 'Numérique & Informatique':
    case 'Digital & PC':
      return Laptop;
    case 'Salute e Benessere':
    case 'Gesundheit':
    case 'Santé':
    case 'Healthcare':
      return Smile;
    case 'Cura della Persona':
    case 'Körperpflege & Kosmetik':
    case 'Beauté & Soins':
    case 'Beauty & Care':
      return Sparkles;
    case 'Abbigliamento e Stagionale':
    case 'Saisonales & Kleidung':
    case 'Saisonnier & Vêtements':
    case 'Seasonal & Apparel':
      return Shirt;
    case 'Emergenza e Sicurezza':
    case 'Notfall & Sicherheit':
    case 'Urgence & Sécurité':
    case 'Emergency & Safety':
      return ShieldAlert;
    case 'Infanzia e Neonati':
    case 'Baby & Kind':
    case 'Bébé & Enfants':
    case 'Baby & Kids':
      return Baby;
    case 'Animali Domestici':
    case 'Haustiere':
    case 'Animaux':
    case 'Pets':
      return PawPrint;
    case 'Auto e Mobilità':
    case 'Auto & Mobilität':
    case 'Automobile':
      return Car;
    case 'Casa e Fai-da-te':
    case 'Wohnen & Heimwerken':
    case 'Maison & Équipements':
    case 'Home & Facilities':
      return Home;
    case 'Uso Quotidiano e Altro':
    case 'Alltägliches & Sonstiges':
    case 'Quotidien & Autres':
    case 'Daily Supplies & Other':
    default:
      return Layers;
  }
};

export const HistoryTimelineView: React.FC<HistoryTimelineViewProps> = ({
  items,
  categories,
  onDeleteHistoryEntry,
  onNavigateToList,
  onEditItem
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedItemId, setSelectedItemId] = useState<string | 'all'>('all');
  const [selectedYear, setSelectedYear] = useState<string | 'all'>('all');
  const [recordToDelete, setRecordToDelete] = useState<FlatHistoryItem | null>(null);

  const allHistoryRecords = useMemo<FlatHistoryItem[]>(() => {
    const list: FlatHistoryItem[] = [];

    items.forEach((item) => {
      if (Array.isArray(item.history)) {
        item.history.forEach((rec) => {
          list.push({
            recordId: rec.id,
            itemId: item.id,
            itemName: item.name,
            category: item.category,
            modelNumber: item.modelNumber,
            purchaseUrl: item.purchaseUrl,
            replacedDate: rec.replacedDate,
            memo: rec.memo,
            recordedAt: rec.recordedAt,
            previousReplacedDate: rec.previousReplacedDate,
            nextReplacementDate: item.nextReplacementDate,
            daysUntilReplacement: item.daysUntilReplacement,
            item
          });
        });
      }
    });

    return list.sort((a, b) => {
      const dateDiff = b.replacedDate.localeCompare(a.replacedDate);
      if (dateDiff !== 0) return dateDiff;
      return b.recordedAt.localeCompare(a.recordedAt);
    });
  }, [items]);

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    allHistoryRecords.forEach((r) => {
      if (r.replacedDate && r.replacedDate.length >= 4) {
        years.add(r.replacedDate.slice(0, 4));
      }
    });
    return Array.from(years).sort().reverse();
  }, [allHistoryRecords]);

  const filteredRecords = useMemo(() => {
    return allHistoryRecords.filter((rec) => {
      if (selectedCategory !== 'all' && rec.category !== selectedCategory) {
        return false;
      }
      if (selectedItemId !== 'all' && rec.itemId !== selectedItemId) {
        return false;
      }
      if (selectedYear !== 'all' && !rec.replacedDate.startsWith(selectedYear)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = rec.itemName.toLowerCase().includes(q);
        const matchesModel = (rec.modelNumber || '').toLowerCase().includes(q);
        const matchesMemo = (rec.memo || '').toLowerCase().includes(q);
        const matchesDate = rec.replacedDate.includes(q);
        if (!matchesName && !matchesModel && !matchesMemo && !matchesDate) {
          return false;
        }
      }
      return true;
    });
  }, [allHistoryRecords, selectedCategory, selectedItemId, selectedYear, searchQuery]);

  const groupedByMonth = useMemo(() => {
    const groups: { [monthKey: string]: FlatHistoryItem[] } = {};

    filteredRecords.forEach((record) => {
      const monthKey = record.replacedDate.slice(0, 7);
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(record);
    });

    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredRecords]);

  const stats = useMemo(() => {
    const todayStr = getTodayString();
    const currentMonth = todayStr.slice(0, 7);
    const currentYear = todayStr.slice(0, 4);

    const thisMonthCount = allHistoryRecords.filter((r) => r.replacedDate.startsWith(currentMonth)).length;
    const thisYearCount = allHistoryRecords.filter((r) => r.replacedDate.startsWith(currentYear)).length;
    const itemsWithHistory = new Set(allHistoryRecords.map((r) => r.itemId)).size;

    return {
      total: allHistoryRecords.length,
      thisMonth: thisMonthCount,
      thisYear: thisYearCount,
      itemsWithHistory
    };
  }, [allHistoryRecords]);

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) return;

    const headers = ['Data de substituição', 'Nome do artigo', 'Categoria', 'Número de modelo', 'Notas', 'Data de registo', 'Próximo prazo'];
    const rows = filteredRecords.map((r) => [
      `"${r.replacedDate}"`,
      `"${r.itemName.replace(/"/g, '""')}"`,
      `"${r.category.replace(/"/g, '""')}"`,
      `"${(r.modelNumber || '').replace(/"/g, '""')}"`,
      `"${(r.memo || '').replace(/"/g, '""')}"`,
      `"${new Date(r.recordedAt).toLocaleString('it-IT')}"`,
      `"${r.nextReplacementDate}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `replenish_cronologia_${getTodayString().replace(/-/g, '')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      onDeleteHistoryEntry(recordToDelete.itemId, recordToDelete.recordId);
      setRecordToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white shadow-lg shadow-emerald-950/10">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <History className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold mb-3.5 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>Histórico e registo de substituições</span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight mb-2.5">
              Histórico de substituições
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl">
              Consulte o registo histórico completo de substituições realizadas para otimizar o consumo e planear as suas compras com antecedência.
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-xs text-emerald-200/90 font-medium">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                {stats.total} reemplazos en total
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-emerald-300" />
                {stats.thisMonth} questo mese
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-300" />
                {stats.itemsWithHistory} articoli con storico
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={filteredRecords.length === 0}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer ${
                filteredRecords.length > 0
                  ? 'bg-white text-emerald-900 hover:bg-emerald-50 active:scale-95'
                  : 'bg-emerald-900/40 text-emerald-400 cursor-not-allowed border border-emerald-700/40'
              }`}
              title="Esporta dati cronologici visibili in CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Exportar CSV</span>
            </button>

            <button
              type="button"
              onClick={onNavigateToList}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-100 hover:text-white hover:bg-emerald-900/50 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver à lista</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Bento Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Replacements */}
        <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-300 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Substituições totais</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums tracking-tight">
              {stats.total}
            </span>
            <span className="text-xs font-medium text-slate-500">volte</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Voci totali registrate
          </span>
        </div>

        {/* Card 2: This Month */}
        <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-300 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-700">Questo mese</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tabular-nums tracking-tight">
              {stats.thisMonth}
            </span>
            <span className="text-xs font-medium text-emerald-600">volte</span>
          </div>
          <span className="text-[11px] text-emerald-600/80 mt-1 block">
            Attività del mese corrente
          </span>
        </div>

        {/* Card 3: This Year */}
        <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-300 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-sky-700">Quest'anno</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-sky-700 tabular-nums tracking-tight">
              {stats.thisYear}
            </span>
            <span className="text-xs font-medium text-sky-600">volte</span>
          </div>
          <span className="text-[11px] text-sky-600/80 mt-1 block">
            Totale dell'anno
          </span>
        </div>

        {/* Card 4: Covered items */}
        <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-300 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Articoli con storico</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums tracking-tight">
              {stats.itemsWithHistory}
            </span>
            <span className="text-xs font-medium text-slate-500">/ {items.length} totali</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Copertura articoli attivi
          </span>
        </div>
      </div>

      {/* Filter, Search & View Controls */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-300 shadow-xs space-y-3.5">
        {/* Row 1: Search + Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          {/* Keyword Search */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.2]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca per nome, modello, nota o data..."
              className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400 font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                title="Azzera ricerca"
              >
                ✕
              </button>
            )}
          </div>

          {/* Item Selector Dropdown */}
          <div className="sm:col-span-4">
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50/80 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 cursor-pointer font-medium"
            >
              <option value="all">Tutti gli articoli ({items.length} totali)</option>
              {items.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.name} ({it.history?.length || 0} voci)
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50/80 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 cursor-pointer font-medium"
            >
              <option value="all">Todos os anos</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
            }`}
          >
            Todas as categorias
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const style = getCategoryStyle(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? style.activeTabBg
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Active Filter Summary Bar */}
        {(selectedCategory !== 'all' || selectedItemId !== 'all' || selectedYear !== 'all' || searchQuery) && (
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Risultati filtrati: <strong className="text-slate-900 font-bold tabular-nums">{filteredRecords.length}</strong> / {allHistoryRecords.length} totali
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedItemId('all');
                setSelectedYear('all');
                setSearchQuery('');
              }}
              className="text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer inline-flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reimposta filtri</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content: Timeline */}
      {allHistoryRecords.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200/90 shadow-xs">
          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <PackageOpen className="w-8 h-8 stroke-[1.8]" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">
            Nenhum histórico registado até ao momento
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
            Clique em "Substituído hoje" ou "Substituir em data personalizada" nos cartões dos artigos para começar a registar o histórico.
          </p>
          <button
            type="button"
            onClick={onNavigateToList}
            className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver à lista</span>
          </button>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white rounded-3xl border border-slate-200/90 shadow-xs">
          <p className="text-sm font-bold text-slate-900 mb-1">
            Nenhum registo do histórico coincidente
          </p>
          <p className="text-xs text-slate-400 mb-4">
            Prova a modificare i termini di ricerca o i filtri di categoria e anno.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSelectedItemId('all');
              setSelectedYear('all');
              setSearchQuery('');
            }}
            className="px-4 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer border border-emerald-200"
          >
            Reimposta filtri
          </button>
        </div>
      ) : (
        /* Vertical Tree Timeline */
        <div className="space-y-8">
          {groupedByMonth.map(([monthKey, records]) => {
            const [y, m] = monthKey.split('-');
            const monthIndex = parseInt(m, 10) - 1;
            const monthLabel = `${MONTH_NAMES[monthIndex] || m} ${y}`;

            return (
              <div key={monthKey} className="relative">
                {/* Month Badge Sticky Header */}
                <div className="sticky top-16 z-20 mb-4 flex items-center justify-between py-2.5 px-4 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-md border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs sm:text-sm font-extrabold tracking-tight">
                      {monthLabel}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
                    {records.length} {records.length === 1 ? 'reemplazo' : 'reemplazos'}
                  </span>
                </div>

                {/* Timeline Container with Vertical Line */}
                <div className="relative pl-6 sm:pl-8 space-y-3.5 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-300">
                  {records.map((record) => {
                    const categoryStyle = getCategoryStyle(record.category);
                    const CategoryIcon = getCategoryIcon(record.category);

                    return (
                      <div
                        key={record.recordId}
                        className="relative bg-white rounded-2xl border border-slate-300 shadow-xs hover:shadow-lg hover:shadow-slate-200/80 hover:border-emerald-500 transition-all duration-200 p-4 group"
                      >
                        {/* Timeline Node Icon */}
                        <div className="absolute -left-6 sm:-left-8 top-4 w-5 h-5 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center shadow-xs -translate-x-1/2">
                          <div className="w-2 h-2 rounded-full bg-emerald-600" />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          {/* Left: Main Details */}
                          <div className="min-w-0 flex-1">
                            {/* Header row: Date Badge + Category + Model */}
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              {/* Date chip */}
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-950 border border-emerald-400 tabular-nums">
                                <Calendar className="w-3.5 h-3.5 text-emerald-600 stroke-[2.2]" />
                                <span>{formatDateDisplay(record.replacedDate, true)}</span>
                              </span>

                              {/* Category chip */}
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${categoryStyle.badgeBg}`}
                              >
                                <CategoryIcon className={`w-3.5 h-3.5 ${categoryStyle.iconColor}`} />
                                <span>{record.category}</span>
                              </span>

                              {/* Model Number */}
                              {record.modelNumber && (
                                <span className="font-mono text-[11px] text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-300 font-medium truncate max-w-[150px]">
                                  {record.modelNumber}
                                </span>
                              )}
                            </div>

                            {/* Item Name */}
                            <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug break-words">
                              {record.itemName}
                            </h3>

                            {/* Memo strip */}
                            {record.memo && (
                              <div className="mt-1.5 inline-flex items-start gap-1.5 px-3 py-1 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700 max-w-full">
                                <span className="text-slate-400 font-bold shrink-0">Nota:</span>
                                <span className="break-words">{record.memo}</span>
                              </div>
                            )}

                            {/* Meta info row */}
                            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs text-slate-400 mt-2.5 pt-2 border-t border-slate-100">
                              <span className="inline-flex items-center gap-1 text-slate-500">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>Registrato: {new Date(record.recordedAt).toLocaleString('it-IT')}</span>
                              </span>

                              {record.previousReplacedDate && (
                                <span className="text-slate-500">
                                  Precedente: {formatDateDisplay(record.previousReplacedDate, false)}
                                </span>
                              )}

                              <span className="text-emerald-700 font-semibold ml-auto sm:ml-0">
                                Prossima scadenza: {formatDateDisplay(record.nextReplacementDate, false)}
                              </span>
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div className="flex items-center sm:flex-col justify-end gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            {onEditItem && (
                              <button
                                type="button"
                                onClick={() => onEditItem(record.item)}
                                className="px-3 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="Editar artigo"
                              >
                                Editar
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setRecordToDelete(record)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Eliminar este registo (restaura a data de substituição anterior)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  Eliminar o registo de substituição?
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Questa azione non può essere annullata</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
              <p>
                Eliminare la voce per <strong>{recordToDelete.itemName}</strong> (
                {formatDateDisplay(recordToDelete.replacedDate)})?
              </p>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Se eliminar o registo mais recente, a data de substituição do artigo será restaurada automaticamente para a anterior.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRecordToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
