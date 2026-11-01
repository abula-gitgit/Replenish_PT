import React, { useState, useEffect } from 'react';
import { X, Sparkles, Sliders, Plus, Check, ExternalLink } from 'lucide-react';
import { ConsumableItem, Category, CATEGORIES, CycleUnit, MasterOption } from '../types/consumable';
import { getTodayString, addCycle, subtractDays, formatDateDisplay } from '../utils/dateCalc';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<ConsumableItem>) => void;
  initialItem?: ConsumableItem | null;
  masterOptions: MasterOption[];
  onOpenMasterManager: () => void;
  onAddNewMasterOption: (option: MasterOption) => void;
  categories?: string[];
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  masterOptions,
  onOpenMasterManager,
  onAddNewMasterOption,
  categories = CATEGORIES
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>(categories[0] || 'Cozinha e Banho');
  const [cycleValue, setCycleValue] = useState<number>(1);
  const [cycleUnit, setCycleUnit] = useState<CycleUnit>('month');
  const [lastReplacedDate, setLastReplacedDate] = useState(getTodayString());
  const [purchaseLeadDays, setPurchaseLeadDays] = useState<number>(7);
  const [modelNumber, setModelNumber] = useState('');
  const [purchaseUrl, setPurchaseUrl] = useState('');
  const [memo, setMemo] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [isAddingNewOption, setIsAddingNewOption] = useState(false);
  const [saveToMaster, setSaveToMaster] = useState(true);

  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name);
      setCategory(initialItem.category);
      setCycleValue(initialItem.cycleValue);
      setCycleUnit(initialItem.cycleUnit);
      setLastReplacedDate(initialItem.lastReplacedDate);
      setPurchaseLeadDays(initialItem.purchaseLeadDays);
      setModelNumber(initialItem.modelNumber || '');
      setPurchaseUrl(initialItem.purchaseUrl || '');
      setMemo(initialItem.memo || '');
      setIsAddingNewOption(false);
    } else {
      const firstOpt = masterOptions[0];
      if (firstOpt) {
        setName(firstOpt.name);
        setCategory(firstOpt.category);
        setCycleValue(firstOpt.defaultCycleValue ?? 3);
        setCycleUnit(firstOpt.defaultCycleUnit ?? 'month');
        setPurchaseLeadDays(firstOpt.defaultLeadDays ?? 7);
        setMemo(firstOpt.defaultMemo ?? '');
      } else {
        setName('');
        setCategory(categories[0] || 'Cozinha e Banho');
        setCycleValue(3);
        setCycleUnit('month');
        setPurchaseLeadDays(7);
        setMemo('');
      }
      setLastReplacedDate(getTodayString());
      setModelNumber('');
      setPurchaseUrl('');
      setIsAddingNewOption(false);
    }
    setErrors({});
  }, [initialItem, isOpen, masterOptions, categories]);

  if (!isOpen) return null;

  const handleSelectMasterOption = (selectedName: string) => {
    if (selectedName === '__NEW__') {
      setIsAddingNewOption(true);
      setName('');
      return;
    }

    setIsAddingNewOption(false);
    const matched = masterOptions.find((opt) => opt.name === selectedName);
    if (matched) {
      setName(matched.name);
      setCategory(matched.category);
      if (matched.defaultCycleValue) setCycleValue(matched.defaultCycleValue);
      if (matched.defaultCycleUnit) setCycleUnit(matched.defaultCycleUnit);
      if (typeof matched.defaultLeadDays === 'number') setPurchaseLeadDays(matched.defaultLeadDays);
      if (matched.defaultMemo) setMemo(matched.defaultMemo);
    } else {
      setName(selectedName);
    }
  };

  const calculatedNext = addCycle(lastReplacedDate, cycleValue, cycleUnit);
  const calculatedReminder = subtractDays(calculatedNext, purchaseLeadDays);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) {
      newErrors.name = 'Introduza um nome para este artigo';
    }
    if (!lastReplacedDate) {
      newErrors.lastReplacedDate = 'Selecione a data da última substituição';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isAddingNewOption && saveToMaster && name.trim()) {
      const exists = masterOptions.some((m) => m.name.toLowerCase() === name.trim().toLowerCase());
      if (!exists) {
        onAddNewMasterOption({
          id: `master-custom-${Date.now()}`,
          name: name.trim(),
          category,
          defaultCycleValue: cycleValue,
          defaultCycleUnit: cycleUnit,
          defaultLeadDays: purchaseLeadDays,
          defaultMemo: memo.trim(),
          order: masterOptions.length
        } as any);
      }
    }

    onSave({
      name: name.trim(),
      category,
      cycleValue: Number(cycleValue),
      cycleUnit,
      lastReplacedDate,
      purchaseLeadDays: Number(purchaseLeadDays),
      modelNumber: modelNumber.trim(),
      purchaseUrl: purchaseUrl.trim(),
      memo: memo.trim()
    });
  };

  const groupedOptions = categories.map((cat) => ({
    category: cat,
    items: masterOptions.filter((opt) => opt.category === cat)
  })).filter((group) => group.items.length > 0);

  const isCurrentNameInMaster = masterOptions.some((opt) => opt.name === name);
  const amazonSearchQuery = [name.trim(), modelNumber.trim()].filter(Boolean).join(' ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden my-8 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
              <Sparkles className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight tracking-tight">
                {initialItem?.id ? 'Editar artigo consumível' : 'Novo artigo consumível'}
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Cálculo automático de ciclos, gestão de modelos e lembretes de reposição
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer shrink-0"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Name / Item Select */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Nome do artigo / Tarefa <span className="text-rose-500">*</span>
              </label>

              <button
                type="button"
                onClick={onOpenMasterManager}
                className="text-xs text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1 cursor-pointer font-semibold"
              >
                <Sliders className="w-3 h-3 text-emerald-600" />
                <span>Gerir modelos e ordenação</span>
              </button>
            </div>

            {/* Select Dropdown */}
            {!isAddingNewOption ? (
              <div className="space-y-2">
                <select
                  value={isCurrentNameInMaster ? name : '__CUSTOM__'}
                  onChange={(e) => handleSelectMasterOption(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/80 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer font-medium"
                >
                  <option value="" disabled>Selecione um modelo predefinido</option>
                  
                  {groupedOptions.map((group) => (
                    <optgroup key={group.category} label={`[${group.category}]`}>
                      {group.items.map((opt, optIdx) => (
                        <option key={`${opt.id}-${opt.category}-${optIdx}`} value={opt.name}>
                          {opt.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}

                  {!isCurrentNameInMaster && name && (
                    <option value="__CUSTOM__">
                      Valor atual: {name}
                    </option>
                  )}

                  <option value="__NEW__" className="font-bold text-emerald-700">
                    + Introduzir nome personalizado...
                  </option>
                </select>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>* Ao selecionar um modelo, a categoria e o ciclo são preenchidos automaticamente</span>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewOption(true)}
                    className="text-emerald-700 hover:underline cursor-pointer font-bold inline-flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Introdução livre</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Introduza o nome do consumível ou da tarefa..."
                    className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/80 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setIsAddingNewOption(false)}
                    className="px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200/80 rounded-xl cursor-pointer whitespace-nowrap"
                  >
                    Escolher modelo
                  </button>
                </div>

                {name && !isCurrentNameInMaster && (
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200 font-medium">
                    <input
                      type="checkbox"
                      checked={saveToMaster}
                      onChange={(e) => setSaveToMaster(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span>Guardar este artigo como modelo para utilizações futuras</span>
                  </label>
                )}
              </div>
            )}

            {errors.name && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Categoria
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-1 px-2.5 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Replacement Cycle (Value + Unit) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ciclo de substituição <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                step="1"
                required
                value={cycleValue}
                onChange={(e) => setCycleValue(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50/80 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Unidade de tempo
              </label>
              <select
                value={cycleUnit}
                onChange={(e) => setCycleUnit(e.target.value as CycleUnit)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50/80 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium cursor-pointer"
              >
                <option value="month">Meses</option>
                <option value="year">Anos</option>
                <option value="week">Semanas</option>
                <option value="day">Dias</option>
              </select>
            </div>
          </div>

          {/* Last Replaced Date & Purchase Lead Days */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Última substituição <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={lastReplacedDate}
                  onChange={(e) => setLastReplacedDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50/80 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                />
              </div>
              <button
                type="button"
                onClick={() => setLastReplacedDate(getTodayString())}
                className="text-[11px] text-emerald-700 hover:text-emerald-800 mt-1 cursor-pointer font-bold inline-block"
              >
                Hoje
              </button>
              {errors.lastReplacedDate && (
                <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.lastReplacedDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Antecedência do aviso de compra
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={purchaseLeadDays}
                  onChange={(e) => setPurchaseLeadDays(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50/80 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                />
                <span className="text-xs text-slate-500 whitespace-nowrap font-medium">dias antes</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">
                Dias de antecedência para preparar a compra (0 = no próprio dia)
              </p>
            </div>
          </div>

          {/* Live Calculation Preview Banner */}
          <div className="p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pré-visualização dos prazos calculados</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Próxima substituição:</span>
                <span className="font-extrabold text-slate-900 tabular-nums">
                  {formatDateDisplay(calculatedNext)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Aviso de compra:</span>
                <span className="font-extrabold text-amber-700 tabular-nums">
                  {formatDateDisplay(calculatedReminder)}
                </span>
              </div>
            </div>
          </div>

          {/* Model Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Código de modelo / Referência (Opcional)
            </label>
            <input
              type="text"
              value={modelNumber}
              onChange={(e) => setModelNumber(e.target.value)}
              placeholder="ex.: EDR1RXD1, SH90/72, 0W-20..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50/80 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
            />
          </div>

          {/* Purchase URL */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Ligação de compra (Opcional)
              </label>
              {amazonSearchQuery && (
                <a
                  href={`https://www.amazon.es/s?k=${encodeURIComponent(amazonSearchQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1 font-bold"
                >
                  <span>Pesquisar na Amazon</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <input
              type="url"
              value={purchaseUrl}
              onChange={(e) => setPurchaseUrl(e.target.value)}
              placeholder="https://www.amazon.es/... ou loja online"
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50/80 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Memo */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Notas e instruções (Opcional)
            </label>
            <textarea
              rows={2}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Instruções de instalação, compatibilidade, prazos recomendados..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50/80 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer order-2 sm:order-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 rounded-xl shadow-xs shadow-emerald-600/25 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 order-1 sm:order-2"
            >
              <Check className="w-4 h-4 stroke-[2.4]" />
              <span>{initialItem ? 'Guardar alterações' : 'Adicionar e iniciar acompanhamento'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
