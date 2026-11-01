import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  ShoppingCart,
  CheckCircle2,
  ExternalLink,
  Check,
  Calendar,
  MoreVertical,
  Edit3,
  History,
  Trash2,
  Copy,
  CheckCheck,
  Droplets,
  Wind,
  Smile,
  Car,
  Layers,
  Sparkles,
  Shirt,
  ShieldAlert,
  Baby,
  PawPrint,
  Laptop,
  Home
} from 'lucide-react';
import { CalculatedItem, Category } from '../types/consumable';
import { formatDateDisplay, getCycleUnitLabel } from '../utils/dateCalc';
import { getCategoryStyle } from '../utils/categoryColors';

interface ItemCardProps {
  item: CalculatedItem;
  onQuickReplace: (item: CalculatedItem) => void;
  onCustomReplace: (item: CalculatedItem) => void;
  onEdit: (item: CalculatedItem) => void;
  onViewHistory: (item: CalculatedItem) => void;
  onDelete: (id: string, name: string) => void;
}

const getCategoryIcon = (category: Category) => {
  switch (category) {
    case 'Cozinha e Banho':
    case 'Eletrodomésticos':
    case 'Eletrónica e Escritório':
    case 'Saúde e Bem-Estar':
    case 'Cuidados Pessoais e Beleza':
    case 'Roupa e Estação':
    case 'Emergência e Segurança':
    case 'Bebés e Crianças':
    case 'Animais de Estimação':
    case 'Automóvel e Mobilidade':
    case 'Casa e Bricolage':
    case 'Uso Diário e Outros':
    case 'Cocina y Baño':
    case 'Cucina e Sanitari':
    case 'Küche & Sanitär':
    case 'Cuisine & Salle de bain':
    case 'Kitchen & Bath':
      return Droplets;
    case 'Electrodomésticos':
    case 'Elettrodomestici':
    case 'Haushaltsgeräte':
    case 'Électroménager':
    case 'Appliances':
      return Wind;
    case 'Electrónica y Oficina':
    case 'Elettronica e Ufficio':
    case 'Elektronik & Büro':
    case 'Numérique & Informatique':
    case 'Digital & PC':
      return Laptop;
    case 'Salud y Bienestar':
    case 'Salute e Benessere':
    case 'Gesundheit':
    case 'Santé':
    case 'Healthcare':
      return Smile;
    case 'Cuidado Personal y Belleza':
    case 'Cura della Persona':
    case 'Körperpflege & Kosmetik':
    case 'Beauté & Soins':
    case 'Beauty & Care':
      return Sparkles;
    case 'Ropa y Temporada':
    case 'Abbigliamento e Stagionale':
    case 'Saisonales & Kleidung':
    case 'Saisonnier & Vêtements':
    case 'Seasonal & Apparel':
      return Shirt;
    case 'Emergencia y Seguridad':
    case 'Emergenza e Sicurezza':
    case 'Notfall & Sicherheit':
    case 'Urgence & Sécurité':
    case 'Emergency & Safety':
      return ShieldAlert;
    case 'Bebés y Niños':
    case 'Infanzia e Neonati':
    case 'Baby & Kind':
    case 'Bébé & Enfants':
    case 'Baby & Kids':
      return Baby;
    case 'Mascotas':
    case 'Animali Domestici':
    case 'Haustiere':
    case 'Animaux':
    case 'Pets':
      return PawPrint;
    case 'Automóvil y Movilidad':
    case 'Auto e Mobilità':
    case 'Auto & Mobilität':
    case 'Automobile':
      return Car;
    case 'Hogar y Bricolaje':
    case 'Casa e Fai-da-te':
    case 'Wohnen & Heimwerken':
    case 'Maison & Équipements':
    case 'Home & Facilities':
      return Home;
    case 'Uso Diario y Otros':
    case 'Uso Quotidiano e Altro':
    case 'Alltägliches & Sonstiges':
    case 'Quotidien & Autres':
    case 'Daily Supplies & Other':
    default:
      return Layers;
  }
};

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onQuickReplace,
  onCustomReplace,
  onEdit,
  onViewHistory,
  onDelete
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copiedModel, setCopiedModel] = useState(false);

  const handleCopyModel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.modelNumber) {
      navigator.clipboard.writeText(item.modelNumber);
      setCopiedModel(true);
      setTimeout(() => setCopiedModel(false), 1800);
    }
  };

  const handleBuyAction = () => {
    if (item.purchaseUrl) {
      window.open(item.purchaseUrl, '_blank', 'noopener,noreferrer');
    } else {
      const query = [item.name, item.modelNumber].filter(Boolean).join(' ');
      const amazonUrl = `https://www.amazon.es/s?k=${encodeURIComponent(query)}`;
      window.open(amazonUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getStatusStyles = () => {
    const absDays = Math.abs(item.daysUntilReplacement);
    switch (item.status) {
      case 'overdue':
        return {
          badgeText: `Em atraso (+${absDays} d.)`,
          badgeBg: 'bg-rose-50 text-rose-800 border border-rose-300 font-bold',
          badgeIcon: AlertTriangle,
          daysColor: 'text-rose-600',
          dueDateColor: 'text-rose-600 font-bold',
          percentColor: 'text-rose-600 font-bold',
          progressBar: 'bg-gradient-to-r from-rose-500 to-red-600',
          progressWidth: '100%',
          cardAccent: 'hover:border-rose-400'
        };
      case 'today':
        return {
          badgeText: 'Vence hoje',
          badgeBg: 'bg-amber-50 text-amber-900 border border-amber-400 font-bold',
          badgeIcon: Clock,
          daysColor: 'text-amber-600',
          dueDateColor: 'text-amber-600 font-bold',
          percentColor: 'text-amber-600 font-bold',
          progressBar: 'bg-gradient-to-r from-amber-400 to-amber-500',
          progressWidth: `${Math.max(5, item.lifeRemainingPercent)}%`,
          cardAccent: 'hover:border-amber-400'
        };
      case 'buy_soon':
        return {
          badgeText: `Em ${item.daysUntilReplacement} d. (Comprar)`,
          badgeBg: 'bg-sky-50 text-sky-950 border border-sky-300 font-bold',
          badgeIcon: ShoppingCart,
          daysColor: 'text-sky-600',
          dueDateColor: 'text-sky-700 font-bold',
          percentColor: 'text-sky-600 font-medium',
          progressBar: 'bg-gradient-to-r from-sky-400 to-sky-500',
          progressWidth: `${Math.max(5, item.lifeRemainingPercent)}%`,
          cardAccent: 'hover:border-sky-400'
        };
      case 'normal':
      default:
        return {
          badgeText: `Em ${item.daysUntilReplacement} d.`,
          badgeBg: 'bg-emerald-50 text-emerald-950 border border-emerald-300 font-bold',
          badgeIcon: CheckCircle2,
          daysColor: 'text-emerald-600',
          dueDateColor: 'text-slate-700 font-medium',
          percentColor: 'text-emerald-600 font-medium',
          progressBar: 'bg-gradient-to-r from-emerald-400 to-teal-500',
          progressWidth: `${Math.max(5, item.lifeRemainingPercent)}%`,
          cardAccent: 'hover:border-emerald-400'
        };
    }
  };

  const status = getStatusStyles();
  const categoryStyle = getCategoryStyle(item.category);
  const CategoryIcon = getCategoryIcon(item.category);
  const StatusIcon = status.badgeIcon;

  return (
    <div className={`bg-white rounded-2xl border border-slate-300 shadow-xs hover:shadow-xl hover:shadow-slate-200/80 hover:border-slate-400 ${status.cardAccent} hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden`}>
      <div className="p-4 sm:p-4.5 flex-1 flex flex-col">
        {/* Top Header: Category Badge + Status Badge + Menu */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          {/* Category Chip */}
          <div className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${categoryStyle.badgeBg}`}>
            <CategoryIcon className={`w-3.5 h-3.5 ${categoryStyle.iconColor}`} />
            <span>{item.category}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Status Tag */}
            <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${status.badgeBg}`}>
              <StatusIcon className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>{status.badgeText}</span>
            </div>

            {/* Actions Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Opções do artigo"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-8 w-56 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-xl py-1.5 z-30 text-xs animate-in fade-in zoom-in-95 duration-100">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onEdit(item);
                      }}
                      className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer font-medium"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onViewHistory(item);
                      }}
                      className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer font-medium"
                    >
                      <History className="w-3.5 h-3.5 text-slate-400" />
                      Histórico ({item.history?.length || 0})
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onCustomReplace(item);
                      }}
                      className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer font-medium"
                    >
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Substituir em data personalizada
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onDelete(item.id, item.name);
                      }}
                      className="w-full text-left px-3.5 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-2">
          <h3 className="text-base font-bold text-slate-900 leading-snug break-words tracking-tight group-hover:text-emerald-950 transition-colors">
            {item.name}
          </h3>
        </div>

        {/* Model Number & Memo Strip */}
        <div className="mb-3 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-300 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span className="font-mono text-slate-600 text-[11px] truncate select-all">
              {item.modelNumber || 'Sem código de modelo'}
            </span>
            {item.modelNumber && (
              <button
                onClick={handleCopyModel}
                title="Copiar código de modelo"
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors cursor-pointer shrink-0"
              >
                {copiedModel ? (
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
          {item.memo && (
            <span className="text-slate-500 text-[11px] truncate max-w-[130px] sm:max-w-[170px]" title={item.memo}>
              {item.memo}
            </span>
          )}
        </div>

        {/* Lifespan Progress Bar */}
        <div className="mt-auto pt-1 mb-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium">Duração do ciclo</span>
            <span className={`text-xs ${status.percentColor}`}>
              {item.status === 'overdue' ? 'Em atraso' : `${item.lifeRemainingPercent} % restante`}
            </span>
          </div>

          <div className="w-full h-2 rounded-full overflow-hidden bg-slate-100/90 shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${status.progressBar}`}
              style={{ width: status.progressWidth }}
            />
          </div>
        </div>

        {/* Timeline Metadata */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-slate-400 text-[11px] shrink-0">Prazo:</span>
            <span className={`tabular-nums truncate font-semibold ${status.dueDateColor}`}>
              {formatDateDisplay(item.nextReplacementDate, false)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 text-right">
            <span className="text-slate-400 text-[11px]">Ciclo:</span>
            <span className="font-semibold text-slate-700">
              A cada {item.cycleValue} {getCycleUnitLabel(item.cycleUnit, item.cycleValue)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-2 border-t border-slate-200 bg-slate-50/80">
        {/* Left: Replaced Today Primary Button */}
        <button
          onClick={() => onQuickReplace(item)}
          className="flex-1 py-2 px-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 rounded-xl shadow-xs shadow-emerald-600/20 transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer"
          title="Marcar como substituído hoje"
        >
          <Check className="w-3.5 h-3.5 stroke-[2.8]" />
          <span>Substituído hoje</span>
        </button>

        {/* Right: Buy / Restock Action Button */}
        <button
          onClick={handleBuyAction}
          className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 active:scale-95 border border-slate-300 hover:border-slate-400 rounded-xl shadow-2xs transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer"
          title={item.purchaseUrl ? 'Abrir ligação de compra' : 'Pesquisar na Amazon'}
        >
          <ShoppingCart className="w-3.5 h-3.5 text-slate-500" />
          <span>{item.purchaseUrl ? 'Comprar' : 'Amazon'}</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
