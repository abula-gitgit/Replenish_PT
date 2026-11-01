import React from 'react';
import { Search, X } from 'lucide-react';
import { Category, CATEGORIES } from '../types/consumable';
import { getCategoryStyle } from '../utils/categoryColors';

export type SortOption = 'priority' | 'date_asc' | 'date_desc' | 'name';

interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: Category | 'all';
  onSelectCategory: (category: Category | 'all') => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  categories?: string[];
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  sortOption,
  onSortChange,
  categories = CATEGORIES
}) => {
  const selectedCatStyle = selectedCategory !== 'all' ? getCategoryStyle(selectedCategory) : null;

  return (
    <div className="mb-4 bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-300 shadow-xs">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
        {/* 1. Search Box */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 stroke-[2.2]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Pesquisar por nome, modelo, notas..."
            className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition-colors"
              title="Limpar pesquisa"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown controls wrapper */}
        <div className="flex items-center gap-2 shrink-0">
          {/* 2. Category Dropdown Menu */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value as Category | 'all')}
              className={`w-full sm:w-auto text-xs py-2 pl-3 pr-8 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer appearance-none transition-all border ${
                selectedCatStyle
                  ? `${selectedCatStyle.badgeBg} border-emerald-400 shadow-2xs`
                  : 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100 hover:border-slate-400'
              }`}
              title="Filtrar por categoria"
            >
              <option value="all" className="bg-white text-slate-900">Todas as categorias</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-white text-slate-900 font-medium">
                  {cat}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-3 h-3" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 1L5 5L9 1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* 3. Sort Dropdown Menu */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="w-full sm:w-auto text-xs bg-slate-50 border border-slate-300 hover:bg-slate-100 hover:border-slate-400 rounded-xl py-2 pl-3 pr-8 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer appearance-none transition-all"
              title="Ordenar"
            >
              <option value="priority">Ordem: Prioridade</option>
              <option value="date_asc">Prazo (mais próximo)</option>
              <option value="date_desc">Prazo (mais distante)</option>
              <option value="name">Nome (A - Z)</option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-3 h-3" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 1L5 5L9 1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
