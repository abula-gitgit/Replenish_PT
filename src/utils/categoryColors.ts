import { Category } from '../types/consumable';

export interface CategoryStyle {
  badgeBg: string;
  badgeText: string;
  border: string;
  dotColor: string;
  iconColor: string;
}

export const getCategoryStyle = (category: Category): CategoryStyle => {
  switch (category) {
    case 'Cozinha e Banho':
    case 'Cocina y Baño':
    case 'Cucina e Sanitari':
    case 'Küche & Sanitär':
    case 'Cuisine & Salle de bain':
    case 'Kitchen & Bath':
      return {
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
        badgeText: 'text-emerald-800',
        border: 'border-emerald-300',
        dotColor: 'bg-emerald-500',
        iconColor: 'text-emerald-600'
      };
    case 'Eletrodomésticos':
    case 'Electrodomésticos':
    case 'Elettrodomestici':
    case 'Haushaltsgeräte':
    case 'Électroménager':
    case 'Appliances':
      return {
        badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-200/80',
        badgeText: 'text-cyan-800',
        border: 'border-cyan-300',
        dotColor: 'bg-cyan-500',
        iconColor: 'text-cyan-600'
      };
    case 'Eletrónica e Escritório':
    case 'Electrónica y Oficina':
    case 'Elettronica e Ufficio':
    case 'Elektronik & Büro':
    case 'Numérique & Informatique':
    case 'Digital & PC':
      return {
        badgeBg: 'bg-blue-50 text-blue-800 border-blue-200/80',
        badgeText: 'text-blue-800',
        border: 'border-blue-300',
        dotColor: 'bg-blue-500',
        iconColor: 'text-blue-600'
      };
    case 'Saúde e Bem-Estar':
    case 'Salud y Bienestar':
    case 'Salute e Benessere':
    case 'Gesundheit':
    case 'Santé':
    case 'Healthcare':
      return {
        badgeBg: 'bg-teal-50 text-teal-800 border-teal-200/80',
        badgeText: 'text-teal-800',
        border: 'border-teal-300',
        dotColor: 'bg-teal-500',
        iconColor: 'text-teal-600'
      };
    case 'Cuidados Pessoais e Beleza':
    case 'Cuidado Personal y Belleza':
    case 'Cura della Persona':
    case 'Körperpflege & Kosmetik':
    case 'Beauté & Soins':
    case 'Beauty & Care':
      return {
        badgeBg: 'bg-pink-50 text-pink-800 border-pink-200/80',
        badgeText: 'text-pink-800',
        border: 'border-pink-300',
        dotColor: 'bg-pink-500',
        iconColor: 'text-pink-600'
      };
    case 'Roupa e Estação':
    case 'Ropa y Temporada':
    case 'Abbigliamento e Stagionale':
    case 'Saisonales & Kleidung':
    case 'Saisonnier & Vêtements':
    case 'Seasonal & Apparel':
      return {
        badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
        badgeText: 'text-indigo-800',
        border: 'border-indigo-300',
        dotColor: 'bg-indigo-500',
        iconColor: 'text-indigo-600'
      };
    case 'Emergência e Segurança':
    case 'Emergencia y Seguridad':
    case 'Emergenza e Sicurezza':
    case 'Notfall & Sicherheit':
    case 'Urgence & Sécurité':
    case 'Emergency & Safety':
      return {
        badgeBg: 'bg-rose-50 text-rose-800 border-rose-200/80',
        badgeText: 'text-rose-800',
        border: 'border-rose-300',
        dotColor: 'bg-rose-500',
        iconColor: 'text-rose-600'
      };
    case 'Bebés e Crianças':
    case 'Bebés y Niños':
    case 'Infanzia e Neonati':
    case 'Baby & Kind':
    case 'Bébé & Enfants':
    case 'Baby & Kids':
      return {
        badgeBg: 'bg-amber-50 text-amber-900 border-amber-200/80',
        badgeText: 'text-amber-900',
        border: 'border-amber-300',
        dotColor: 'bg-amber-500',
        iconColor: 'text-amber-600'
      };
    case 'Animais de Estimação':
    case 'Mascotas':
    case 'Animali Domestici':
    case 'Haustiere':
    case 'Animaux':
    case 'Pets':
      return {
        badgeBg: 'bg-orange-50 text-orange-900 border-orange-200/80',
        badgeText: 'text-orange-900',
        border: 'border-orange-300',
        dotColor: 'bg-orange-500',
        iconColor: 'text-orange-600'
      };
    case 'Automóvel e Mobilidade':
    case 'Automóvil y Movilidad':
    case 'Auto e Mobilità':
    case 'Auto & Mobilität':
    case 'Automobile':
      return {
        badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
        badgeText: 'text-slate-800',
        border: 'border-slate-400',
        dotColor: 'bg-slate-500',
        iconColor: 'text-slate-600'
      };
    case 'Casa e Bricolage':
    case 'Hogar y Bricolaje':
    case 'Casa e Fai-da-te':
    case 'Wohnen & Heimwerken':
    case 'Maison & Équipements':
    case 'Home & Facilities':
      return {
        badgeBg: 'bg-lime-50 text-lime-900 border-lime-200/80',
        badgeText: 'text-lime-900',
        border: 'border-lime-300',
        dotColor: 'bg-lime-500',
        iconColor: 'text-lime-600'
      };
    case 'Uso Diário e Outros':
    case 'Uso Diario y Otros':
    case 'Uso Quotidiano e Altro':
    case 'Alltägliches & Sonstiges':
    case 'Quotidien & Autres':
    case 'Daily Supplies & Other':
    default:
      return {
        badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
        badgeText: 'text-slate-700',
        border: 'border-slate-300',
        dotColor: 'bg-slate-400',
        iconColor: 'text-slate-500'
      };
  }
};
