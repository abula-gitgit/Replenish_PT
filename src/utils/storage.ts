import { ConsumableItem, Category, DEFAULT_CATEGORIES, MasterOption } from '../types/consumable';
import { generateSampleItems } from './sampleData';

const STORAGE_KEY_ITEMS = 'replenish_consumable_items_pt_v1';
const STORAGE_KEY_CATEGORIES = 'replenish_categories_pt_v1';

export function loadStoredItems(): ConsumableItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (!raw) {
      const sample = generateSampleItems();
      saveStoredItems(sample);
      return sample;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return generateSampleItems();
  } catch (e) {
    console.error('Failed to load items from storage:', e);
    return generateSampleItems();
  }
}

export function saveStoredItems(items: ConsumableItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save items to storage:', e);
  }
}

export function loadStoredCategories(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (!raw) {
      saveStoredCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_CATEGORIES;
  } catch (e) {
    console.error('Failed to load categories from storage:', e);
    return DEFAULT_CATEGORIES;
  }
}

export function saveStoredCategories(categories: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories to storage:', e);
  }
}

export interface BackupData {
  version: string;
  exportedAt: string;
  items: ConsumableItem[];
  masterOptions?: MasterOption[];
  categories?: string[];
}

export function exportToJSONFile(
  items: ConsumableItem[],
  masterOptions?: MasterOption[],
  categories?: string[]
): void {
  const data: BackupData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    items,
    masterOptions,
    categories
  };

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `replenish_backup_pt_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseAndValidateImportJSON(jsonText: string): {
  success: boolean;
  items?: ConsumableItem[];
  masterOptions?: MasterOption[];
  categories?: string[];
  error?: string;
} {
  try {
    const data = JSON.parse(jsonText);
    let itemsToImport: ConsumableItem[] = [];

    if (Array.isArray(data)) {
      itemsToImport = data;
    } else if (data && typeof data === 'object' && Array.isArray(data.items)) {
      itemsToImport = data.items;
    } else {
      return { success: false, error: 'Formato do ficheiro JSON inválido. A lista de artigos não foi encontrada.' };
    }

    const validItems: ConsumableItem[] = itemsToImport.filter((it: any) => {
      return (
        typeof it === 'object' &&
        it !== null &&
        typeof it.name === 'string' &&
        typeof it.category === 'string' &&
        typeof it.cycleValue === 'number' &&
        ['day', 'week', 'month', 'year'].includes(it.cycleUnit) &&
        typeof it.lastReplacedDate === 'string'
      );
    });

    if (validItems.length === 0 && itemsToImport.length > 0) {
      return { success: false, error: 'O ficheiro JSON não contém artigos de consumíveis válidos.' };
    }

    return {
      success: true,
      items: validItems,
      masterOptions: Array.isArray(data.masterOptions) ? data.masterOptions : undefined,
      categories: Array.isArray(data.categories) ? data.categories : undefined
    };
  } catch (e: any) {
    return { success: false, error: `Erro na leitura do JSON: ${e.message}` };
  }
}
