import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Search,
  X,
  Plus,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { REPLACEMENT_GUIDES, ReplacementGuideItem, mapGuideToPreset } from '../data/replacementGuides';
import { ConsumableItem } from '../types/consumable';
import { getCategoryStyle } from '../utils/categoryColors';
import { GuideIllustration } from './GuideIllustrations';

interface CycleGuideViewProps {
  onNavigateToList?: () => void;
  onAddPresetItem?: (preset: ConsumableItem) => void;
}

const CATEGORY_TABS: { id: string; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'kitchen', label: 'Cozinha' },
  { id: 'bath', label: 'Banho e Higiene' },
  { id: 'beauty', label: 'Cuidados Pessoais' },
  { id: 'disaster', label: 'Emergência e Segurança' },
  { id: 'seasonal', label: 'Roupa e Estação' },
  { id: 'baby', label: 'Bebés e Crianças' },
  { id: 'pet', label: 'Animais de Estimação' },
  { id: 'living', label: 'Casa e Quarto' },
  { id: 'appliance', label: 'Eletrodomésticos' }
];

export const CycleGuideView: React.FC<CycleGuideViewProps> = ({ onNavigateToList, onAddPresetItem }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<ReplacementGuideItem | null>(null);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: REPLACEMENT_GUIDES.length };
    REPLACEMENT_GUIDES.forEach((guide) => {
      counts[guide.category] = (counts[guide.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredGuides = useMemo(() => {
    return REPLACEMENT_GUIDES.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesCategory = item.categoryLabel.toLowerCase().includes(query);
        const matchesReason = item.hygieneReason.toLowerCase().includes(query);
        const matchesDanger = item.dangerOfNeglect.toLowerCase().includes(query);
        const matchesSigns = item.signsOfDegradation.some((s) => s.toLowerCase().includes(query));
        const matchesTips = item.proTips.toLowerCase().includes(query);
        return matchesTitle || matchesCategory || matchesReason || matchesDanger || matchesSigns || matchesTips;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Editorial Header Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white shadow-xl shadow-emerald-950/10">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-60 h-60 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold mb-3.5 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            <span>Guia de higiene e ciclos de substituição ({REPLACEMENT_GUIDES.length} elementos essenciais)</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight mb-3 leading-snug">
            &laquo; Ancora utilizzabile &raquo; non significa igienico
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed mb-5">
            De esponjas de loiça e escovas de dentes a cartuchos de gás, filtros de água ou humidificadores: muitos artigos do dia a dia têm intervalos de substituição recomendados. Conheça as bases científicas e os sinais de desgaste.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-emerald-200/90 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              Recomendações segundo normas de higiene
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              Sinais visíveis de desgaste
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              Adicione com um toque aos seus artigos
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="bg-white/85 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3.5">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none stroke-[2.2]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca per nome, rischio o parola chiave (es.: spugna, filtro, muffa, gas...)"
            className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-slate-50/80 border border-slate-200/80 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
              aria-label="Azzera ricerca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {CATEGORY_TABS.map((tab) => {
            const count = categoryCounts[tab.id] || 0;
            if (tab.id !== 'all' && count === 0) return null;
            const isSelected = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-bold shadow-xs shadow-emerald-600/20 scale-[1.02]'
                    : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums ${
                    isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-200/90 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {filteredGuides.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3.5 shadow-xs">
          <p className="text-sm font-semibold text-slate-600">
            Nessuna guida corrisponde alla tua ricerca.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            Reimposta filtri e mostra tutto
          </button>
        </div>
      )}

      {/* Guides Grid with Visual Illustrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {filteredGuides.map((item) => {
          const catStyle = getCategoryStyle(item.categoryLabel);
          return (
            <article
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-xl hover:shadow-slate-200/60 hover:border-emerald-300/80 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden"
            >
              <div>
                {/* Visual Illustration Banner */}
                <div 
                  onClick={() => setSelectedArticle(item)}
                  className="mb-4 rounded-2xl overflow-hidden cursor-pointer group-hover:opacity-95 transition-opacity"
                  title="Fai clic per leggere la guida completa"
                >
                  <GuideIllustration guideId={item.id} className="w-full min-h-[135px]" />
                </div>

                {/* Card Header */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${catStyle.badgeBg}`}>
                      {item.categoryLabel}
                    </span>
                    {item.badgeLabel && (
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                        {item.badgeLabel}
                      </span>
                    )}
                  </div>
                  <h3 
                    onClick={() => setSelectedArticle(item)}
                    className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-2 tracking-tight group-hover:text-emerald-800 transition-colors cursor-pointer"
                  >
                    {item.title}
                  </h3>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-bold max-w-full">
                      <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.2]" />
                      <span className="leading-snug break-words">Ciclo recomendado: {item.cycleDisplay}</span>
                    </div>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="space-y-3 mb-2">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.hygieneReason}
                  </p>

                  <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-200/60">
                    <div className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Segni chiave di usura per la sostituzione</span>
                      </span>
                      {item.signsOfDegradation.length > 2 && (
                        <span className="text-[10px] text-slate-400 font-normal">
                          {item.signsOfDegradation.length} segni in totale
                        </span>
                      )}
                    </div>
                    <ul className="space-y-1">
                      {item.signsOfDegradation.slice(0, 2).map((sign, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-slate-600 flex items-start gap-1.5 font-medium line-clamp-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span className="truncate">{sign}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Card Bottom CTA Row */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedArticle(item)}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center gap-1 transition-colors cursor-pointer group-hover:underline"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Leggi la guida completa</span>
                  <ChevronRight className="w-3 h-3 text-emerald-600" />
                </button>

                {onAddPresetItem && (
                  <button
                    type="button"
                    onClick={() => {
                      const preset = mapGuideToPreset(item.id);
                      if (preset) onAddPresetItem(preset);
                    }}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 rounded-xl shadow-xs shadow-emerald-600/20 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.8]" />
                    <span>Aggiungi con questo ciclo</span>
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Bottom helper card linking back to items list */}
      {onNavigateToList && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <strong className="text-slate-900 font-extrabold text-sm block tracking-tight">
              Gestisci la tua lista di consumabili
            </strong>
            <p className="text-slate-500 mt-1 font-medium">
              Tieni traccia delle scadenze e dei promemoria di acquisto per tutti i tuoi materiali di consumo.
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToList}
            className="shrink-0 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer text-xs active:scale-95"
          >
            <span>Visualizza i miei articoli</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden max-h-[88vh] flex flex-col animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70 shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800">
                    {selectedArticle.categoryLabel}
                  </span>
                  {selectedArticle.badgeLabel && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                      {selectedArticle.badgeLabel}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  {selectedArticle.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer shrink-0"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto">
              {/* Illustration in modal */}
              <div className="rounded-2xl overflow-hidden shadow-xs border border-slate-100">
                <GuideIllustration guideId={selectedArticle.id} className="w-full min-h-[140px]" />
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200/80 text-xs font-bold">
                <Clock className="w-4 h-4 text-emerald-600 stroke-[2.2]" />
                <span>Ciclo recomendado: {selectedArticle.cycleDisplay}</span>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Perché questo ciclo? (Motivi igienici e di sicurezza)</span>
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 font-medium">
                  {selectedArticle.hygieneReason}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Rischi in caso di sostituzione ritardata</span>
                </h4>
                <p className="text-xs text-amber-950 leading-relaxed bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/60 font-medium">
                  {selectedArticle.dangerOfNeglect}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Segni di usura che indicano la necessità di sostituzione</span>
                </h4>
                <ul className="space-y-1.5 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/60">
                  {selectedArticle.signsOfDegradation.map((sign, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedArticle.scientificNote && (
                <div className="p-3.5 bg-teal-50/70 border border-teal-200/70 rounded-2xl text-xs text-teal-950 leading-relaxed font-medium">
                  <strong className="font-extrabold block mb-0.5">Studi e pareri di esperti:</strong>
                  {selectedArticle.scientificNote}
                </div>
              )}

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block">
                  Consigli di manutenzione e utilizzo
                </span>
                <p className="leading-relaxed font-medium pt-1">
                  {selectedArticle.proTips}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              >
                Fechar
              </button>

              {onAddPresetItem && (
                <button
                  type="button"
                  onClick={() => {
                    const preset = mapGuideToPreset(selectedArticle.id);
                    if (preset) {
                      onAddPresetItem(preset);
                      setSelectedArticle(null);
                    }
                  }}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 rounded-xl shadow-xs shadow-emerald-600/25 transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 stroke-[2.8]" />
                  <span>Adicionar aos meus artigos</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
