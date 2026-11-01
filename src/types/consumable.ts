export type CycleUnit = 'day' | 'week' | 'month' | 'year';

export type Category =
  | 'Cozinha e Banho'
  | 'Eletrodomésticos'
  | 'Eletrónica e Escritório'
  | 'Saúde e Bem-Estar'
  | 'Cuidados Pessoais e Beleza'
  | 'Roupa e Estação'
  | 'Emergência e Segurança'
  | 'Bebés e Crianças'
  | 'Animais de Estimação'
  | 'Automóvel e Mobilidade'
  | 'Casa e Bricolage'
  | 'Uso Diário e Outros'
  // Compatibility with other language templates
  | 'Cocina y Baño'
  | 'Electrodomésticos'
  | 'Electrónica y Oficina'
  | 'Salud y Bienestar'
  | 'Cuidado Personal y Belleza'
  | 'Ropa y Temporada'
  | 'Emergencia y Seguridad'
  | 'Bebés y Niños'
  | 'Mascotas'
  | 'Automóvil y Movilidad'
  | 'Hogar y Bricolaje'
  | 'Uso Diario y Otros'
  | 'Cucina e Sanitari'
  | 'Elettrodomestici'
  | 'Elettronica e Ufficio'
  | 'Salute e Benessere'
  | 'Cura della Persona'
  | 'Abbigliamento e Stagionale'
  | 'Emergenza e Sicurezza'
  | 'Infanzia e Neonati'
  | 'Animali Domestici'
  | 'Auto e Mobilità'
  | 'Casa e Fai-da-te'
  | 'Uso Quotidiano e Altro'
  | string;

export const DEFAULT_CATEGORIES: Category[] = [
  'Cozinha e Banho',
  'Eletrodomésticos',
  'Eletrónica e Escritório',
  'Saúde e Bem-Estar',
  'Cuidados Pessoais e Beleza',
  'Roupa e Estação',
  'Emergência e Segurança',
  'Bebés e Crianças',
  'Animais de Estimação',
  'Automóvel e Mobilidade',
  'Casa e Bricolage',
  'Uso Diário e Outros'
];

export const CATEGORIES = DEFAULT_CATEGORIES;

export interface ReplacementHistoryRecord {
  id: string;
  replacedDate: string; // YYYY-MM-DD
  memo?: string;
  recordedAt: string; // ISO string
}

export interface ConsumableItem {
  id: string;
  name: string;
  category: Category;
  cycleValue: number;
  cycleUnit: CycleUnit;
  lastReplacedDate: string; // YYYY-MM-DD
  purchaseLeadDays: number;
  modelNumber?: string;
  purchaseUrl?: string;
  memo?: string;
  history?: ReplacementHistoryRecord[];
  createdAt: string;
  updatedAt: string;
}

export type ItemStatus = 'overdue' | 'today' | 'buy_soon' | 'normal';

export interface CalculatedItem extends ConsumableItem {
  nextReplacementDate: string; // YYYY-MM-DD
  purchaseReminderDate: string; // YYYY-MM-DD
  daysUntilReplacement: number; // negative if overdue
  daysUntilPurchaseReminder: number;
  lifeRemainingPercent: number; // 0 - 100+
  status: ItemStatus;
  statusLabel: string;
}

export interface MasterOption {
  id: string;
  name: string;
  category: Category;
  defaultCycleValue?: number;
  defaultCycleUnit?: CycleUnit;
  defaultLeadDays?: number;
  defaultMemo?: string;
  order?: number;
}

export type ViewMode = 'list' | 'calendar' | 'guide' | 'history' | 'about' | 'privacy' | 'terms' | 'contact';
