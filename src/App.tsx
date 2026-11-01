import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ConsumableItem, CalculatedItem, Category, ItemStatus, MasterOption, ViewMode } from './types/consumable';
import { calculateItem, sortCalculatedItems, getTodayString } from './utils/dateCalc';
import { loadStoredItems, saveStoredItems, loadStoredCategories, saveStoredCategories } from './utils/storage';
import { generateSampleItems } from './utils/sampleData';
import { loadMasterOptions, saveMasterOptions, sanitizeMasterOptions } from './utils/masterOptions';
import {
  getNotificationPermission,
  requestNotificationPermission,
  checkAndNotifyUrgentItems,
  registerServiceWorker
} from './utils/notifications';

import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { UrgentAlertBanner } from './components/UrgentAlertBanner';
import { FilterToolbar, SortOption } from './components/FilterToolbar';
import { ItemCard } from './components/ItemCard';
import { CalendarView } from './components/CalendarView';
import { CycleGuideView } from './components/CycleGuideView';
import { InfoPagesView, InfoTab } from './components/InfoPagesView';
import { mapGuideToPreset } from './data/replacementGuides';
import { HistoryTimelineView } from './components/HistoryTimelineView';
import { ItemModal } from './components/ItemModal';
import { MasterOptionModal } from './components/MasterOptionModal';
import { CustomReplaceModal } from './components/CustomReplaceModal';
import { HistoryModal } from './components/HistoryModal';
import { BackupModal } from './components/BackupModal';
import { NotificationModal } from './components/NotificationModal';
import { BottomNavBar, BottomNavTab } from './components/BottomNavBar';
import { AdBanner } from './components/AdBanner';
import { Toast, ToastMessage, ToastAction } from './components/Toast';
import { Plus, PackageOpen, RotateCcw } from 'lucide-react';

export default function App() {
  const [items, setItems] = useState<ConsumableItem[]>(() => loadStoredItems());
  const [masterOptions, setMasterOptions] = useState<MasterOption[]>(() => loadMasterOptions());
  const [categories, setCategories] = useState<string[]>(() => loadStoredCategories());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ItemStatus | 'all'>('all');
  const [sortOption, setSortOption] = useState<SortOption>('priority');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ConsumableItem | null>(null);
  const [customReplaceItem, setCustomReplaceItem] = useState<CalculatedItem | null>(null);
  const [historyViewItem, setHistoryViewItem] = useState<CalculatedItem | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isAdVisible, setIsAdVisible] = useState(false);

  // Notifications & Toasts
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Add toast helper
  const addToast = useCallback((
    text: string,
    type: 'success' | 'error' | 'info' = 'success',
    action?: ToastAction,
    duration = 3500
  ) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, text, type, action }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Undo replace action
  const handleUndoReplace = (itemId: string, recordId: string, previousDate: string) => {
    setItems((prevItems) => {
      const updated = prevItems.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            lastReplacedDate: previousDate,
            history: (item.history || []).filter((h) => h.id !== recordId),
            updatedAt: new Date().toISOString()
          };
        }
        return item;
      });
      saveStoredItems(updated);
      return updated;
    });
    addToast('Substituição cancelada e prazo restaurado.', 'info');
  };

  // Persist items whenever items change
  const updateAndSaveItems = (newItems: ConsumableItem[]) => {
    setItems(newItems);
    saveStoredItems(newItems);
  };

  // Persist custom categories
  const handleUpdateCategories = (newCategories: string[]) => {
    setCategories(newCategories);
    saveStoredCategories(newCategories);
  };

  // URL Hash & Pathname synchronization for direct navigation (#privacy, /privacy, #about, /about, etc.)
  useEffect(() => {
    const validModes = ['about', 'privacy', 'terms', 'contact', 'guide', 'history', 'calendar', 'list'];
    const syncViewFromUrl = () => {
      const hash = window.location.hash.replace('#', '');
      if (validModes.includes(hash)) {
        setViewMode(hash as ViewMode);
        return;
      }
      const pathSegment = window.location.pathname.replace(/^\/+|\/+$/g, '').replace(/\.html$/i, '');
      if (validModes.includes(pathSegment)) {
        setViewMode(pathSegment as ViewMode);
      }
    };
    syncViewFromUrl();
    window.addEventListener('hashchange', syncViewFromUrl);
    window.addEventListener('popstate', syncViewFromUrl);
    return () => {
      window.removeEventListener('hashchange', syncViewFromUrl);
      window.removeEventListener('popstate', syncViewFromUrl);
    };
  }, []);

  useEffect(() => {
    const currentPerm = getNotificationPermission();
    setNotificationPermission(currentPerm);
    registerServiceWorker();
  }, []);

  // URL Query Parameters listener for instant preset item addition (?add=sponge or ?preset=sponge)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const targetAdd = params.get('add') || params.get('preset');
    if (targetAdd) {
      const preset = mapGuideToPreset(targetAdd);
      if (preset) {
        setEditingItem(preset);
        setIsAddEditModalOpen(true);
        addToast(`Modulo aperto per "${preset.name}" dalla guida.`, 'info');
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [addToast]);

  const calculatedItems = useMemo(() => {
    const today = getTodayString();
    return items.map((item) => calculateItem(item, today));
  }, [items]);

  // Check urgent items for browser notification on mount or when permission is granted
  useEffect(() => {
    if (notificationPermission === 'granted' && calculatedItems.length > 0) {
      checkAndNotifyUrgentItems(calculatedItems);
    }
  }, [notificationPermission, calculatedItems]);

  // Handle request notification permission
  const handleRequestNotification = async () => {
    const perm = await requestNotificationPermission();
    setNotificationPermission(perm);
    if (perm === 'granted') {
      addToast('Notifiche attivate! Riceverai promemoria quando i consumabili sono in scadenza.', 'success');
      checkAndNotifyUrgentItems(calculatedItems);
    } else if (perm === 'denied') {
      addToast('Notifiche bloccate. Puoi abilitarle nelle impostazioni del browser.', 'info');
    }
  };

  // Status counts for KPI cards
  const statusCounts = useMemo(() => {
    return {
      total: calculatedItems.length,
      overdue: calculatedItems.filter((i) => i.status === 'overdue').length,
      today: calculatedItems.filter((i) => i.status === 'today').length,
      buy_soon: calculatedItems.filter((i) => i.status === 'buy_soon').length,
      normal: calculatedItems.filter((i) => i.status === 'normal').length
    };
  }, [calculatedItems]);

  // Filtered & Sorted items
  const filteredAndSortedItems = useMemo(() => {
    let result = calculatedItems;

    if (selectedCategory !== 'all') {
      result = result.filter((i) => i.category === selectedCategory);
    }

    if (selectedStatus !== 'all') {
      result = result.filter((i) => i.status === selectedStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((i) => {
        return (
          i.name.toLowerCase().includes(q) ||
          (i.modelNumber && i.modelNumber.toLowerCase().includes(q)) ||
          (i.memo && i.memo.toLowerCase().includes(q)) ||
          i.category.toLowerCase().includes(q)
        );
      });
    }

    switch (sortOption) {
      case 'priority':
        return sortCalculatedItems(result);
      case 'date_asc':
        return [...result].sort((a, b) => a.daysUntilReplacement - b.daysUntilReplacement);
      case 'date_desc':
        return [...result].sort((a, b) => b.daysUntilReplacement - a.daysUntilReplacement);
      case 'name':
        return [...result].sort((a, b) => a.name.localeCompare(b.name, 'en'));
      default:
        return sortCalculatedItems(result);
    }
  }, [calculatedItems, selectedCategory, selectedStatus, searchQuery, sortOption]);

  // Urgent items for banner (overdue, today, buy_soon)
  const urgentItems = useMemo(() => {
    return calculatedItems.filter(
      (item) => item.status === 'overdue' || item.status === 'today' || item.status === 'buy_soon'
    );
  }, [calculatedItems]);

  // Quick Replace Action: today
  const handleQuickReplace = (item: CalculatedItem) => {
    const today = getTodayString();
    const previousDate = item.lastReplacedDate;
    const recordId = `record-${Date.now()}`;
    const newRecord = {
      id: recordId,
      replacedDate: today,
      memo: 'Sostituzione registrata con 1 clic',
      recordedAt: new Date().toISOString(),
      previousReplacedDate: previousDate
    };

    const updated = items.map((i) => {
      if (i.id === item.id) {
        return {
          ...i,
          lastReplacedDate: today,
          history: [...(i.history || []), newRecord],
          updatedAt: new Date().toISOString()
        };
      }
      return i;
    });

    updateAndSaveItems(updated);
    addToast(
      `Sostituzione registrata per "${item.name}".`,
      'success',
      {
        label: 'Anular',
        onClick: () => handleUndoReplace(item.id, recordId, previousDate)
      },
      7000
    );
  };

  // Custom Date Replace Action
  const handleCustomReplaceConfirm = (itemId: string, replacedDate: string, memo: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const previousDate = item.lastReplacedDate;
    const recordId = `record-${Date.now()}`;
    const newRecord = {
      id: recordId,
      replacedDate,
      memo: memo || 'Sostituzione registrata',
      recordedAt: new Date().toISOString(),
      previousReplacedDate: previousDate
    };

    const updated = items.map((i) => {
      if (i.id === itemId) {
        return {
          ...i,
          lastReplacedDate: replacedDate,
          history: [...(i.history || []), newRecord],
          updatedAt: new Date().toISOString()
        };
      }
      return i;
    });

    updateAndSaveItems(updated);
    addToast(
      `Data di sostituzione (${replacedDate}) registrata per "${item.name}".`,
      'success',
      {
        label: 'Anular',
        onClick: () => handleUndoReplace(item.id, recordId, previousDate)
      },
      7000
    );
  };

  // Save Item (Create or Update)
  const handleSaveItem = (itemData: Partial<ConsumableItem>) => {
    if (editingItem && editingItem.id) {
      const updated = items.map((i) => {
        if (i.id === editingItem.id) {
          return {
            ...i,
            ...itemData,
            updatedAt: new Date().toISOString()
          } as ConsumableItem;
        }
        return i;
      });
      updateAndSaveItems(updated);
      addToast(`"${itemData.name}" aggiornato.`, 'success');
    } else {
      const newItem: ConsumableItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: itemData.name || '',
        category: itemData.category || 'Uso Quotidiano e Altro',
        cycleValue: itemData.cycleValue || 1,
        cycleUnit: itemData.cycleUnit || 'month',
        lastReplacedDate: itemData.lastReplacedDate || getTodayString(),
        purchaseLeadDays: itemData.purchaseLeadDays ?? 7,
        modelNumber: itemData.modelNumber || '',
        purchaseUrl: itemData.purchaseUrl || '',
        memo: itemData.memo || '',
        history: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      updateAndSaveItems([newItem, ...items]);
      addToast(`Nuovo articolo "${newItem.name}" aggiunto.`, 'success');
    }

    setIsAddEditModalOpen(false);
    setEditingItem(null);
  };

  // Delete Item
  const handleDeleteItem = (id: string, name: string) => {
    if (window.confirm(`Eliminare definitivamente "${name}"?`)) {
      const updated = items.filter((i) => i.id !== id);
      updateAndSaveItems(updated);
      addToast(`"${name}" eliminato.`, 'info');
    }
  };

  // Delete single history log entry and auto rollback lastReplacedDate if needed
  const handleDeleteHistoryEntry = (itemId: string, historyRecordId: string) => {
    const targetItem = items.find((i) => i.id === itemId);
    if (!targetItem) return;

    const recordToDelete = targetItem.history?.find((h) => h.id === historyRecordId);
    const remainingHistory = (targetItem.history || []).filter((h) => h.id !== historyRecordId);

    let newLastReplacedDate = targetItem.lastReplacedDate;
    if (recordToDelete && recordToDelete.replacedDate === targetItem.lastReplacedDate) {
      if (recordToDelete.previousReplacedDate) {
        newLastReplacedDate = recordToDelete.previousReplacedDate;
      } else if (remainingHistory.length > 0) {
        const sorted = [...remainingHistory].sort((a, b) => b.replacedDate.localeCompare(a.replacedDate));
        newLastReplacedDate = sorted[0].replacedDate;
      } else {
        newLastReplacedDate = targetItem.createdAt ? targetItem.createdAt.slice(0, 10) : targetItem.lastReplacedDate;
      }
    }

    const updatedItem: ConsumableItem = {
      ...targetItem,
      lastReplacedDate: newLastReplacedDate,
      history: remainingHistory,
      updatedAt: new Date().toISOString()
    };

    const updatedItems = items.map((i) => (i.id === itemId ? updatedItem : i));
    updateAndSaveItems(updatedItems);

    if (historyViewItem && historyViewItem.id === itemId) {
      setHistoryViewItem(calculateItem(updatedItem));
    }

    addToast(
      newLastReplacedDate !== targetItem.lastReplacedDate
        ? `Voce eliminata e data di sostituzione ripristinata al ${newLastReplacedDate}.`
        : 'Voce dello storico eliminata.',
      'info'
    );
  };

  // Reset to default samples
  const handleResetToSample = () => {
    const samples = generateSampleItems();
    updateAndSaveItems(samples);
    addToast('Dati di esempio ricaricati.', 'success');
  };

  // Clear all
  const handleClearAll = () => {
    updateAndSaveItems([]);
    addToast('Tutti gli articoli sono stati eliminati.', 'info');
  };

  // Import items
  const handleImportItems = (newItems: ConsumableItem[]) => {
    updateAndSaveItems(newItems);
    addToast(`${newItems.length} articoli importati.`, 'success');
  };

  const handleUpdateMasterOptions = (newOptions: MasterOption[]) => {
    const sanitized = sanitizeMasterOptions(newOptions);
    setMasterOptions(sanitized);
    saveMasterOptions(sanitized);
  };

  const handleAddNewMasterOption = (newOption: MasterOption) => {
    const sanitized = sanitizeMasterOptions([...masterOptions, newOption]);
    setMasterOptions(sanitized);
    saveMasterOptions(sanitized);
    addToast(`Modello "${newOption.name}" aggiunto al catalogo.`, 'success');
  };

  // Determine current active mobile navigation tab
  const currentNavTab: BottomNavTab = useMemo(() => {
    if (viewMode === 'guide') return 'guide';
    if (viewMode === 'calendar') return 'schedule';
    if (viewMode === 'history') return 'history';
    if (selectedStatus === 'buy_soon') return 'buy';
    return 'stock';
  }, [viewMode, selectedStatus]);

  const handleNavTabChange = (tab: BottomNavTab) => {
    if (tab === 'stock') {
      setViewMode('list');
      setSelectedStatus('all');
    } else if (tab === 'schedule') {
      setViewMode('calendar');
    } else if (tab === 'history') {
      setViewMode('history');
    } else if (tab === 'guide') {
      setViewMode('guide');
    } else if (tab === 'buy') {
      setViewMode('list');
      setSelectedStatus('buy_soon');
      const targetEl = document.getElementById('items-section');
      if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'insights') {
      setIsMasterModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 font-sans antialiased flex flex-col overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900 relative">
      {/* Ambient background glow */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-50">
        <div className="absolute -top-[25%] left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-emerald-100/50 via-teal-50/25 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-[35%] -right-[15%] w-[600px] h-[500px] bg-sky-100/40 blur-3xl rounded-full" />
      </div>

      {/* Top Header */}
      <Header
        viewMode={viewMode}
        onViewChange={setViewMode}
        onOpenAddModal={() => {
          setEditingItem(null);
          setIsAddEditModalOpen(true);
        }}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onOpenMasterModal={() => setIsMasterModalOpen(true)}
        notificationPermission={notificationPermission}
        onRequestNotification={handleRequestNotification}
        onOpenNotificationModal={() => setIsNotificationModalOpen(true)}
        urgentCount={urgentItems.length}
      />

      {/* Main Content Area */}
      <main className={`flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 transition-all duration-300 ${isAdVisible ? 'pb-44 sm:pb-28' : 'pb-24 sm:pb-16'}`}>
        {['about', 'privacy', 'terms', 'contact'].includes(viewMode) ? (
          <InfoPagesView
            initialTab={viewMode as InfoTab}
            onNavigateToList={() => {
              setViewMode('list');
              window.location.hash = '';
            }}
            onTabChange={(tab) => {
              setViewMode(tab as ViewMode);
              window.location.hash = tab;
            }}
            onAddPresetItem={(preset) => {
              setEditingItem(preset);
              setIsAddEditModalOpen(true);
              addToast(`Modulo aperto per "${preset.name}". Verifica e salva!`, 'info');
            }}
          />
        ) : viewMode === 'guide' ? (
          <CycleGuideView
            onNavigateToList={() => {
              setViewMode('list');
              window.location.hash = '';
            }}
            onAddPresetItem={(preset) => {
              setEditingItem(preset);
              setIsAddEditModalOpen(true);
              addToast(`Modulo aperto per "${preset.name}". Verifica e salva!`, 'info');
            }}
          />
        ) : viewMode === 'history' ? (
          <HistoryTimelineView
            items={calculatedItems}
            categories={categories}
            onDeleteHistoryEntry={handleDeleteHistoryEntry}
            onNavigateToList={() => setViewMode('list')}
            onEditItem={(it) => {
              setEditingItem(it);
              setIsAddEditModalOpen(true);
            }}
          />
        ) : (
          <>
            {/* Urgent Alerts Banner (Overdue / Today / Buy soon) */}
            <UrgentAlertBanner
              urgentItems={urgentItems}
              onFocusStatus={(status) => {
                setSelectedStatus(status);
                const targetEl = document.getElementById('items-section');
                if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Status KPI Summary Bento Grid */}
            <SummaryCards
              statusCounts={statusCounts}
              activeStatusFilter={selectedStatus}
              onSelectStatusFilter={(status) => setSelectedStatus(status)}
            />

            {/* View Content */}
            {viewMode === 'calendar' ? (
              <CalendarView
                items={calculatedItems}
                onQuickReplace={handleQuickReplace}
                onCustomReplace={(it) => setCustomReplaceItem(it)}
                onEdit={(it) => {
                  setEditingItem(it);
                  setIsAddEditModalOpen(true);
                }}
                onViewHistory={(it) => setHistoryViewItem(it)}
              />
            ) : (
              <>
                {/* Filter, Search & Sort Toolbar */}
                <div id="items-section">
                  <FilterToolbar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    sortOption={sortOption}
                    onSortChange={setSortOption}
                    categories={categories}
                  />
                </div>

                {/* Filter Indicator / Reset */}
                {(selectedCategory !== 'all' || selectedStatus !== 'all' || searchQuery) && (
                  <div className="flex items-center justify-between mb-3 px-1 text-xs text-slate-500">
                    <span>
                      Risultati: <strong className="text-slate-900 font-bold tabular-nums">{filteredAndSortedItems.length}</strong> su {items.length} articoli
                    </span>
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSelectedStatus('all');
                        setSearchQuery('');
                      }}
                      className="text-xs text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer inline-flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reimposta filtri</span>
                    </button>
                  </div>
                )}

                {/* Empty States */}
                {items.length === 0 ? (
                  <div className="text-center py-20 px-6 bg-white/90 backdrop-blur-md rounded-3xl border border-slate-300 shadow-xs max-w-2xl mx-auto my-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-emerald-500/10 to-teal-500/20 text-emerald-600 rounded-2xl flex items-center justify-center">
                      <PackageOpen className="w-8 h-8 stroke-[2]" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1.5 tracking-tight">
                      Nessun materiale di consumo registrato
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                      Aggiungi articoli che sostituisci periodicamente (filtri per l'acqua, testine per spazzolino, filtri per aspirapolvere...). Replenish calcola automaticamente le scadenze e consiglia quando riordinare.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          setEditingItem(null);
                          setIsAddEditModalOpen(true);
                        }}
                        className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 shadow-sm shadow-emerald-600/20 active:scale-95"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>Aggiungi il primo articolo</span>
                      </button>
                      <button
                        onClick={handleResetToSample}
                        className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
                      >
                        Carica dati di esempio
                      </button>
                    </div>
                  </div>
                ) : filteredAndSortedItems.length === 0 ? (
                  <div className="text-center py-16 px-6 bg-white/90 backdrop-blur-md rounded-3xl border border-slate-300 shadow-xs max-w-xl mx-auto my-6">
                    <p className="text-sm font-bold text-slate-900 mb-1">
                      Nessun articolo corrispondente trovato
                    </p>
                    <p className="text-xs text-slate-400 mb-4">
                      Prova a modificare i termini di ricerca o i filtri di categoria e stato.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSelectedStatus('all');
                        setSearchQuery('');
                      }}
                      className="px-4 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 rounded-xl transition-colors cursor-pointer border border-emerald-300"
                    >
                      Reimposta tutti i filtri
                    </button>
                  </div>
                ) : (
                  /* Cards Grid: 1 col on mobile, 2 on tablet, 3 on desktop */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {filteredAndSortedItems.map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        onQuickReplace={handleQuickReplace}
                        onCustomReplace={(it) => setCustomReplaceItem(it)}
                        onEdit={(it) => {
                          setEditingItem(it);
                          setIsAddEditModalOpen(true);
                        }}
                        onViewHistory={(it) => setHistoryViewItem(it)}
                        onDelete={handleDeleteItem}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-10 border-t border-slate-200/80 bg-white/90 backdrop-blur-md mb-32 md:mb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-sm">Replenish</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Gestore cicli di consumo domestico</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-400">Fornito da STONE PLANNING</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <button
                type="button"
                onClick={() => { setViewMode('about'); window.location.hash = 'about'; }}
                className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Sobre nós
              </button>
              <button
                type="button"
                onClick={() => { setViewMode('guide'); window.location.hash = 'guide'; }}
                className="text-emerald-700 hover:text-emerald-800 font-semibold transition-colors cursor-pointer"
              >
                Guida ai cicli
              </button>
              <button
                type="button"
                onClick={() => { setViewMode('privacy'); window.location.hash = 'privacy'; }}
                className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Privacy
              </button>
              <button
                type="button"
                onClick={() => { setViewMode('terms'); window.location.hash = 'terms'; }}
                className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Termini di servizio
              </button>
              <button
                type="button"
                onClick={() => { setViewMode('contact'); window.location.hash = 'contact'; }}
                className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Contatti
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <div>
              © 2026 STONE PLANNING · Replenish. Todos os direitos reservados.
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsNotificationModalOpen(true)}
                className="hover:text-slate-700 transition-colors cursor-pointer"
              >
                Impostazioni notifiche
              </button>
              <button
                type="button"
                onClick={() => setIsMasterModalOpen(true)}
                className="hover:text-slate-700 transition-colors cursor-pointer"
              >
                Catalogo modelli
              </button>
              <button
                type="button"
                onClick={() => setIsBackupModalOpen(true)}
                className="hover:text-slate-700 transition-colors cursor-pointer"
              >
                Backup e ripristino JSON
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavBar
        currentTab={currentNavTab}
        onTabChange={handleNavTabChange}
        onOpenAddModal={() => {
          setEditingItem(null);
          setIsAddEditModalOpen(true);
        }}
        urgentCount={urgentItems.length}
        buyCount={statusCounts.buy_soon}
        hasBottomAd={isAdVisible}
      />

      {/* Fixed Bottom Advertisement Banner */}
      <AdBanner onVisibilityChange={setIsAdVisible} />

      {/* Item Modal (Create & Edit) */}
      <ItemModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        initialItem={editingItem}
        masterOptions={masterOptions}
        onOpenMasterManager={() => setIsMasterModalOpen(true)}
        onAddNewMasterOption={handleAddNewMasterOption}
        categories={categories}
      />

      {/* Master Options Maintenance Modal */}
      <MasterOptionModal
        isOpen={isMasterModalOpen}
        onClose={() => setIsMasterModalOpen(false)}
        options={masterOptions}
        onUpdateOptions={handleUpdateMasterOptions}
        categories={categories}
        onUpdateCategories={handleUpdateCategories}
        items={items}
        onUpdateItems={updateAndSaveItems}
      />

      {/* Custom Date Replace Modal */}
      <CustomReplaceModal
        isOpen={Boolean(customReplaceItem)}
        item={customReplaceItem}
        onClose={() => setCustomReplaceItem(null)}
        onConfirm={handleCustomReplaceConfirm}
      />

      {/* History and Details Modal */}
      <HistoryModal
        isOpen={Boolean(historyViewItem)}
        item={historyViewItem}
        onClose={() => setHistoryViewItem(null)}
        onDeleteHistoryEntry={handleDeleteHistoryEntry}
      />

      {/* Backup and Restore Modal */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        items={items}
        masterOptions={masterOptions}
        categories={categories}
        onImportItems={handleImportItems}
        onImportMasterOptions={handleUpdateMasterOptions}
        onImportCategories={handleUpdateCategories}
        onResetToSample={handleResetToSample}
        onClearAll={handleClearAll}
      />

      {/* Notification Settings Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        urgentItems={urgentItems}
        onPermissionChange={(perm) => setNotificationPermission(perm)}
        onShowToast={(text, type) => addToast(text, type)}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
