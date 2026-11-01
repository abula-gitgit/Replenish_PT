import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Edit2, 
  Trash2, 
  Check, 
  RotateCcw, 
  Sliders, 
  Search,
  CheckCircle2,
  AlertCircle,
  Tag,
  AlertTriangle
} from 'lucide-react';
import { 
  MasterOption, 
  Category, 
  CATEGORIES, 
  DEFAULT_CATEGORIES, 
  CycleUnit, 
  ConsumableItem 
} from '../types/consumable';
import { DEFAULT_MASTER_OPTIONS } from '../utils/masterOptions';
import { getCycleUnitLabel } from '../utils/dateCalc';
import { getCategoryStyle } from '../utils/categoryColors';

interface MasterOptionModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onFermer?: () => void;
  options: MasterOption[];
  onUpdateOptions: (newOptions: MasterOption[]) => void;
  categories?: string[];
  onUpdateCategories?: (newCategories: string[]) => void;
  items?: ConsumableItem[];
  onUpdateItems?: (newItems: ConsumableItem[]) => void;
}

export const MasterOptionModal: React.FC<MasterOptionModalProps> = ({
  isOpen,
  onClose,
  onFermer,
  options,
  onUpdateOptions,
  categories = CATEGORIES,
  onUpdateCategories,
  items = [],
  onUpdateItems
}) => {
  const handleClose = onClose || onFermer || (() => {});

  const [activeTab, setActiveTab] = useState<'options' | 'categories'>('options');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const listContainerRef = useRef<HTMLDivElement>(null);

  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
    }
  }, [selectedCategory, isAdding, activeTab]);

  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<Category>(categories[0] || 'Cozinha e Banho');
  const [newCycleValue, setNewCycleValue] = useState<number>(1);
  const [newCycleUnit, setNewCycleUnit] = useState<CycleUnit>('month');
  const [newLeadDays, setNewLeadDays] = useState<number>(7);
  const [newMemo, setNewMemo] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<Category>(categories[0] || 'Cozinha e Banho');
  const [editCycleValue, setEditCycleValue] = useState<number>(1);
  const [editCycleUnit, setEditCycleUnit] = useState<CycleUnit>('month');
  const [editLeadDays, setEditLeadDays] = useState<number>(7);
  const [editMemo, setEditMemo] = useState('');

  const [newCatInput, setNewCatInput] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  };

  const handleMoveOption = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= options.length) return;

    const newOptions = [...options];
    const [moved] = newOptions.splice(index, 1);
    newOptions.splice(targetIndex, 0, moved);

    const reordered = newOptions.map((opt, idx) => ({
      ...opt,
      order: idx + 1
    }));
    onUpdateOptions(reordered);
  };

  const handleAddOption = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) {
      showFeedback('Introduza um nome para o modelo.', 'error');
      return;
    }

    if (options.some((opt) => opt.name.toLowerCase() === trimmed.toLowerCase())) {
      showFeedback(`La plantilla "${trimmed}" ya existe.`, 'error');
      return;
    }

    const newOption: MasterOption = {
      id: `master-custom-${Date.now()}`,
      name: trimmed,
      category: newCategory,
      defaultCycleValue: newCycleValue,
      defaultCycleUnit: newCycleUnit,
      defaultLeadDays: newLeadDays,
      defaultMemo: newMemo.trim(),
      order: options.length + 1
    } as any;

    onUpdateOptions([...options, newOption]);
    setNewName('');
    setNewMemo('');
    setIsAdding(false);
    showFeedback(`Plantilla "${trimmed}" añadida con éxito.`);
  };

  const handleStartEdit = (opt: MasterOption) => {
    setEditingId(opt.id);
    setEditName(opt.name);
    setEditCategory(opt.category);
    setEditCycleValue(opt.defaultCycleValue ?? 1);
    setEditCycleUnit(opt.defaultCycleUnit ?? 'month');
    setEditLeadDays(opt.defaultLeadDays ?? 7);
    setEditMemo((opt as any).defaultMemo || '');
  };

  const handleSaveEdit = (id: string) => {
    const trimmed = editName.trim();
    if (!trimmed) {
      showFeedback('El nombre de la plantilla no puede estar vacío.', 'error');
      return;
    }

    if (options.some((opt) => opt.id !== id && opt.name.toLowerCase() === trimmed.toLowerCase())) {
      showFeedback(`Il nome „${trimmed}“ è già utilizzato.`, 'error');
      return;
    }

    const updated = options.map((opt) => {
      if (opt.id === id) {
        return {
          ...opt,
          name: trimmed,
          category: editCategory,
          defaultCycleValue: editCycleValue,
          defaultCycleUnit: editCycleUnit,
          defaultLeadDays: editLeadDays,
          defaultMemo: editMemo.trim()
        };
      }
      return opt;
    });

    onUpdateOptions(updated as MasterOption[]);
    setEditingId(null);
    showFeedback(`Plantilla "${trimmed}" actualizada.`);
  };

  const handleDeleteOption = (id: string, name: string) => {
    if (window.confirm(`¿Eliminar la plantilla "${name}"?\n(Los artículos ya registrados se mantendrán sin cambios.)`)) {
      const filtered = options.filter((opt) => opt.id !== id).map((opt, idx) => ({
        ...opt,
        order: idx + 1
      }));
      onUpdateOptions(filtered);
      showFeedback(`Plantilla "${name}" eliminada.`);
    }
  };

  const handleResetOptionsToDefault = () => {
    if (window.confirm('¿Restablecer las plantillas predeterminadas?\n* Las plantillas personalizadas creadas se eliminarán.')) {
      onUpdateOptions([...DEFAULT_MASTER_OPTIONS]);
      showFeedback('Las plantillas predeterminadas han sido restablecidas.');
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatInput.trim();
    if (!trimmed) return;

    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      showFeedback(`La categoría "${trimmed}" ya existe.`, 'error');
      return;
    }

    const updated = [...categories, trimmed];
    if (onUpdateCategories) onUpdateCategories(updated);
    setNewCatInput('');
    showFeedback(`Categoria „${trimmed}“ aggiunta.`);
  };

  const handleSaveRenameCategory = (oldName: string) => {
    const trimmed = editingCatName.trim();
    if (!trimmed) {
      showFeedback('Introduza um nome para a categoria.', 'error');
      return;
    }

    if (trimmed.toLowerCase() !== oldName.toLowerCase() && categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      showFeedback(`La categoría "${trimmed}" ya existe.`, 'error');
      return;
    }

    const updatedCategories = categories.map((c) => (c === oldName ? trimmed : c));
    if (onUpdateCategories) onUpdateCategories(updatedCategories);

    let updatedOptionsCount = 0;
    const updatedOptions = options.map((opt) => {
      if (opt.category === oldName) {
        updatedOptionsCount++;
        return { ...opt, category: trimmed };
      }
      return opt;
    });
    onUpdateOptions(updatedOptions);

    let updatedItemsCount = 0;
    if (items && onUpdateItems) {
      const updatedItems = items.map((it) => {
        if (it.category === oldName) {
          updatedItemsCount++;
          return { ...it, category: trimmed };
        }
        return it;
      });
      onUpdateItems(updatedItems);
    }

    setEditingCategory(null);
    setEditingCatName('');
    showFeedback(
      `Categoria renombrada a "${trimmed}" (${updatedItemsCount} artículos y ${updatedOptionsCount} plantillas actualizados).`
    );
  };

  const handleDeleteCategory = (cat: string) => {
    const registeredItems = items.filter((it) => it.category === cat);
    if (registeredItems.length > 0) {
      showFeedback(
        `Impossibile eliminare „${cat}“: ci sono ${registeredItems.length} articolo/i attivo/i associato/i a questa categoria. Modifica prima la loro categoria.`,
        'error'
      );
      return;
    }

    const attachedOptions = options.filter((opt) => opt.category === cat);
    let confirmMsg = `Eliminare la categoria „${cat}“?`;
    if (attachedOptions.length > 0) {
      confirmMsg += `\n* Nota: ${attachedOptions.length} plantilla(s) se asignarán a la categoría "Uso Diario y Otros".`;
    }

    if (window.confirm(confirmMsg)) {
      const updatedCategories = categories.filter((c) => c !== cat);
      if (onUpdateCategories) onUpdateCategories(updatedCategories);

      if (attachedOptions.length > 0) {
        const fallbackCat = updatedCategories[updatedCategories.length - 1] || 'Uso Diário e Outros';
        const updatedOptions = options.map((opt) => (opt.category === cat ? { ...opt, category: fallbackCat } : opt));
        onUpdateOptions(updatedOptions);
      }

      showFeedback(`Categoria „${cat}“ eliminata.`);
    }
  };

  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newCategories = [...categories];
    const [moved] = newCategories.splice(index, 1);
    newCategories.splice(targetIndex, 0, moved);

    if (onUpdateCategories) onUpdateCategories(newCategories);
  };

  const handleResetCategories = () => {
    if (
      window.confirm(
        'Ripristinare le 12 categorie predefinite?\n* Gli articoli già assegnati rimarranno invariati.'
      )
    ) {
      if (onUpdateCategories) onUpdateCategories([...DEFAULT_CATEGORIES]);
      showFeedback('Las categorías predeterminadas han sido restablecidas.');
    }
  };

  const filteredOptions = options.filter((opt) => {
    const matchesCategory = selectedCategory === 'all' || opt.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      opt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ((opt as any).defaultMemo && (opt as any).defaultMemo.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/45 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Sliders className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
                Gestionar plantillas y categorías
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Personalizza cicli predefiniti, nomi e raggruppamenti
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer shrink-0"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-slate-200 bg-slate-100/60 px-6 pt-2 shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('options')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all relative cursor-pointer ${
              activeTab === 'options'
                ? 'text-emerald-800'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <span>Plantillas ({options.length})</span>
            {activeTab === 'options' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-600 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all relative cursor-pointer ${
              activeTab === 'categories'
                ? 'text-emerald-800'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <span>Categorie ({categories.length})</span>
            {activeTab === 'categories' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Feedback Message Banner */}
        {message && (
          <div
            className={`px-6 py-2.5 text-xs flex items-center gap-2 border-b shrink-0 font-medium ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* TAB 1: Plantillas */}
        {activeTab === 'options' && (
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {/* Filter toolbar */}
            <div className="p-4 border-b border-slate-100 bg-white shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar modelo..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as Category | 'all')}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-2.5 pr-7 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer font-medium"
                >
                  <option value="all">Todas as categorias</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setIsAdding(!isAdding)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer shrink-0 ${
                    isAdding
                      ? 'bg-slate-200 text-slate-800'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAdding ? 'Cerrar' : 'Novo modelo'}</span>
                </button>
              </div>
            </div>

            {/* Form to add new option */}
            {isAdding && (
              <form onSubmit={handleAddOption} className="p-4.5 bg-emerald-50/50 border-b border-emerald-100 shrink-0 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-emerald-600" />
                    Criar novo modelo
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium">* Verrà aggiunto all'elenco di selezione</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Nome do modelo *</label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="es.: Decalcificante macchina da caffè"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Categoria</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Ciclo</label>
                    <input
                      type="number"
                      min="1"
                      value={newCycleValue}
                      onChange={(e) => setNewCycleValue(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Unidade</label>
                    <select
                      value={newCycleUnit}
                      onChange={(e) => setNewCycleUnit(e.target.value as CycleUnit)}
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium cursor-pointer"
                    >
                      <option value="month">Meses</option>
                      <option value="year">Años</option>
                      <option value="week">Semanas</option>
                      <option value="day">Días</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Anticipo</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        value={newLeadDays}
                        onChange={(e) => setNewLeadDays(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                      />
                      <span className="text-[10px] text-slate-400 shrink-0">giorni</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nota / Promemoria (opzionale)</label>
                  <input
                    type="text"
                    value={newMemo}
                    onChange={(e) => setNewMemo(e.target.value)}
                    placeholder="Intervallo consigliato, note di utilizzo..."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Guardar modelo</span>
                  </button>
                </div>
              </form>
            )}

            {/* List of options */}
            <div ref={listContainerRef} className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredOptions.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-400 font-medium">
                  Nenhum modelo encontrado.
                </div>
              ) : (
                filteredOptions.map((opt, index) => {
                  const globalIndex = options.findIndex((o) => o.id === opt.id);
                  const isEditing = editingId === opt.id;
                  const catStyle = getCategoryStyle(opt.category);

                  if (isEditing) {
                    return (
                      <div key={opt.id} className="p-3.5 bg-amber-50/70 border border-amber-300 rounded-2xl space-y-2.5 text-xs shadow-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-amber-900 mb-0.5">Nome do modelo</label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-2.5 py-1 text-xs bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-amber-900 mb-0.5">Categoria</label>
                            <select
                              value={editCategory}
                              onChange={(e) => setEditCategory(e.target.value)}
                              className="w-full px-2 py-1 text-xs bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium cursor-pointer"
                            >
                              {categories.map((c) => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-amber-900 mb-0.5">Ciclo</label>
                            <input
                              type="number"
                              min="1"
                              value={editCycleValue}
                              onChange={(e) => setEditCycleValue(Math.max(1, parseInt(e.target.value, 10) || 1))}
                              className="w-full px-2 py-1 text-xs bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-amber-900 mb-0.5">Unidade</label>
                            <select
                              value={editCycleUnit}
                              onChange={(e) => setEditCycleUnit(e.target.value as CycleUnit)}
                              className="w-full px-2 py-1 text-xs bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium cursor-pointer"
                            >
                              <option value="month">Meses</option>
                              <option value="year">Años</option>
                              <option value="week">Semanas</option>
                              <option value="day">Días</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-amber-900 mb-0.5">Anticipo</label>
                            <input
                              type="number"
                              min="0"
                              value={editLeadDays}
                              onChange={(e) => setEditLeadDays(Math.max(0, parseInt(e.target.value, 10) || 0))}
                              className="w-full px-2 py-1 text-xs bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-amber-900 mb-0.5">Nota</label>
                          <input
                            type="text"
                            value={editMemo}
                            onChange={(e) => setEditMemo(e.target.value)}
                            className="w-full px-2.5 py-1 text-xs bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                          />
                        </div>

                        <div className="flex justify-end gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(opt.id)}
                            className="px-3 py-1 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-lg shadow-2xs inline-flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Applica</span>
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={opt.id}
                      className="p-3 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-2xs hover:border-slate-300 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="flex flex-col items-center shrink-0">
                          <button
                            type="button"
                            disabled={globalIndex === 0}
                            onClick={() => handleMoveOption(globalIndex, 'up')}
                            className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                            title="Subir"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={globalIndex === options.length - 1}
                            onClick={() => handleMoveOption(globalIndex, 'down')}
                            className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                            title="Bajar"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold text-slate-900 truncate text-xs sm:text-sm">
                              {opt.name}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${catStyle.badgeBg}`}>
                              {opt.category}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span>
                              Ciclo: Ogni {opt.defaultCycleValue ?? 1} {getCycleUnitLabel(opt.defaultCycleUnit || 'month', opt.defaultCycleValue ?? 1)}
                            </span>
                            <span>·</span>
                            <span>Anticipo: {opt.defaultLeadDays ?? 7} giorni</span>
                          </div>

                          {(opt as any).defaultMemo && (
                            <p className="text-[11px] text-slate-400 truncate mt-0.5 font-normal">
                              {(opt as any).defaultMemo}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(opt)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Modifica"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteOption(opt.id, opt.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer reset button */}
            <div className="p-3 px-6 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={handleResetOptionsToDefault}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Restaurar modelos predefinidos</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Categorie */}
        {activeTab === 'categories' && (
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {/* Form to add new category */}
            <form onSubmit={handleAddCategory} className="p-4 border-b border-slate-100 bg-white shrink-0">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Adicionar nova categoria
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={newCatInput}
                  onChange={(e) => setNewCatInput(e.target.value)}
                  placeholder="Inserisci nome categoria..."
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir</span>
                </button>
              </div>
            </form>

            {/* List of categories */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {categories.map((cat, index) => {
                const isEditing = editingCategory === cat;
                const catStyle = getCategoryStyle(cat);
                const itemsCount = items.filter((it) => it.category === cat).length;
                const optionsCount = options.filter((opt) => opt.category === cat).length;

                if (isEditing) {
                  return (
                    <div key={cat} className="p-3 bg-amber-50/70 border border-amber-300 rounded-2xl flex items-center gap-2 text-xs shadow-xs">
                      <input
                        type="text"
                        autoFocus
                        value={editingCatName}
                        onChange={(e) => setEditingCatName(e.target.value)}
                        className="flex-1 px-2.5 py-1 text-xs bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingCategory(null)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveRenameCategory(cat)}
                        className="px-3 py-1 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-lg shadow-2xs inline-flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Rinomina</span>
                      </button>
                    </div>
                  );
                }

                return (
                  <div
                    key={cat}
                    className="p-3 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-2xs hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="flex flex-col items-center shrink-0">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveCategory(index, 'up')}
                          className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                          title="Subir"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === categories.length - 1}
                          onClick={() => handleMoveCategory(index, 'down')}
                          className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                          title="Bajar"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 border ${catStyle.badgeBg}`}>
                          {cat}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          ({itemsCount} artículos, {optionsCount} plantillas)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategory(cat);
                          setEditingCatName(cat);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Rinomina categoria"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar categoria"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer reset button */}
            <div className="p-3 px-6 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={handleResetCategories}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Ripristina 12 categorie predefinite</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
