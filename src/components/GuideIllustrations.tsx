import React, { useState } from 'react';
import {
  Sparkles,
  Droplets,
  Shirt,
  Smile,
  Eye,
  ShieldCheck,
  Layers,
  Home,
  RotateCcw,
  Wind,
  AlertTriangle,
  ShieldAlert,
  Heart,
  PawPrint,
  Laptop,
  Flame,
  Activity
} from 'lucide-react';

interface GuideMeta {
  enTitle: string;
  categoryName: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgGradient: string;
  badgeBg: string;
  badgeText: string;
  urgencyTag: string;
  urgencyBadgeStyle: string;
  metricLabel: string;
  metricValue: string;
  keyCheck: string;
  imageFileName?: string;
}

const GUIDE_METAS: Record<string, GuideMeta> = {
  sponge: {
    enTitle: 'KITCHEN SPONGE',
    categoryName: 'Kitchen & Sink Hygiene',
    icon: Sparkles,
    accentColor: 'text-emerald-700',
    bgGradient: 'from-emerald-500/15 via-teal-500/10 to-amber-500/10',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    badgeText: 'Top Hygiene Priority',
    urgencyTag: 'High Bacterial Growth Risk',
    urgencyBadgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
    metricLabel: 'Recommended Cycle',
    metricValue: '14 Days (approx. 2 weeks)',
    keyCheck: 'Loss of bounce · Musty odor · Weak lather',
    imageFileName: 'sponge.jpg'
  },
  cloth: {
    enTitle: 'KITCHEN CLOTH & DUSTER',
    categoryName: 'Kitchen & Surface Care',
    icon: Shirt,
    accentColor: 'text-teal-700',
    bgGradient: 'from-teal-500/15 via-emerald-500/10 to-sky-500/10',
    badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
    badgeText: 'Hygiene Control',
    urgencyTag: 'Moraxella Odor Prevention',
    urgencyBadgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
    metricLabel: 'Recommended Cycle',
    metricValue: '1–2 Months',
    keyCheck: 'Thinning fibers · Yellowing · Poor absorption',
    imageFileName: 'cloth.jpg'
  },
  purifier: {
    enTitle: 'WATER PURIFIER CARTRIDGE',
    categoryName: 'Drinking Water Filtration',
    icon: Droplets,
    accentColor: 'text-sky-700',
    bgGradient: 'from-sky-500/15 via-blue-500/10 to-teal-500/10',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-300',
    badgeText: 'Water Quality & Purity',
    urgencyTag: 'Chlorine & Biofilm Risk',
    urgencyBadgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
    metricLabel: 'Recommended Cycle',
    metricValue: '3 Months – 1 Year',
    keyCheck: 'Reduced flow · Carbon saturation · Clogging',
    imageFileName: 'purifier.jpg'
  },
  toothbrush: {
    enTitle: 'ORAL CARE TOOTHBRUSH',
    categoryName: 'Oral & Dental Care',
    icon: Smile,
    accentColor: 'text-emerald-700',
    bgGradient: 'from-emerald-500/15 via-sky-500/10 to-teal-500/10',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    badgeText: 'Plaque Removal & Gum Care',
    urgencyTag: '40% Drop in Cleaning Power',
    urgencyBadgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
    metricLabel: 'Recommended Cycle',
    metricValue: '1 Month (approx. 30 days)',
    keyCheck: 'Frayed bristles · Loss of stiffness',
    imageFileName: 'toothbrush.jpg'
  },
  contact_case: {
    enTitle: 'CONTACT LENS CASE',
    categoryName: 'Eye Care & Sterility',
    icon: Eye,
    accentColor: 'text-cyan-700',
    bgGradient: 'from-cyan-500/15 via-sky-500/10 to-blue-500/10',
    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    badgeText: 'Corneal Infection Prevention',
    urgencyTag: 'Biofilm & Amoeba Shield',
    urgencyBadgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
    metricLabel: 'Recommended Cycle',
    metricValue: '1–3 Months',
    keyCheck: 'Invisible biofilm · Slimy residue · Micro-scratches',
    imageFileName: 'contact_case.jpg'
  },
  razor: {
    enTitle: 'ELECTRIC SHAVER BLADES',
    categoryName: 'Personal Grooming',
    icon: ShieldCheck,
    accentColor: 'text-slate-800',
    bgGradient: 'from-slate-500/15 via-indigo-500/10 to-blue-500/10',
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
    badgeText: 'Smooth Shave & Skin Protection',
    urgencyTag: 'Micro-Blade Wear',
    urgencyBadgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
    metricLabel: 'Recommended Cycle',
    metricValue: 'Foil: 1 Yr / Inner Blade: 2 Yrs',
    keyCheck: 'Tugging hairs · Post-shave irritation',
    imageFileName: 'razor.jpg'
  },
  towel: {
    enTitle: 'BATH & FACE TOWEL',
    categoryName: 'Bath & Linens',
    icon: Layers,
    accentColor: 'text-purple-700',
    bgGradient: 'from-purple-500/15 via-pink-500/10 to-rose-500/10',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
    badgeText: 'Softness & Absorbency',
    urgencyTag: 'Embedded Bacteria & Stiff Pile',
    urgencyBadgeStyle: 'bg-slate-100 text-slate-700 border-slate-200',
    metricLabel: 'Recommended Cycle',
    metricValue: '6 Months – 1 Year',
    keyCheck: 'Slow water absorption · Stiff texture · Persistent odor',
    imageFileName: 'towel.jpg'
  },
  pillow: {
    enTitle: 'SLEEP COMFORT PILLOW',
    categoryName: 'Bedroom & Sleep Environment',
    icon: Home,
    accentColor: 'text-amber-800',
    bgGradient: 'from-amber-500/15 via-orange-500/10 to-yellow-500/10',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    badgeText: 'Neck Alignment & Sleep Quality',
    urgencyTag: 'Dust Mite & Allergen Buildup',
    urgencyBadgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
    metricLabel: 'Recommended Cycle',
    metricValue: '1–3 Years',
    keyCheck: 'Flattened loft · Loss of rebound support',
    imageFileName: 'pillow.jpg'
  },
  washing_cleaner: {
    enTitle: 'WASHING TUB CLEANER',
    categoryName: 'Appliance Maintenance',
    icon: RotateCcw,
    accentColor: 'text-teal-700',
    bgGradient: 'from-teal-500/15 via-sky-500/10 to-cyan-500/10',
    badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
    badgeText: 'Mold Removal & Odor Control',
    urgencyTag: 'Hidden Drum Biofilm',
    urgencyBadgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
    metricLabel: 'Recommended Frequency',
    metricValue: 'Every 1–2 Months',
    keyCheck: 'Dark flakes on laundry · Musty drum smell',
    imageFileName: 'washing_cleaner.jpg'
  },
  ac_filter: {
    enTitle: 'AC AIR FILTER',
    categoryName: 'HVAC & Energy Efficiency',
    icon: Wind,
    accentColor: 'text-sky-700',
    bgGradient: 'from-sky-500/15 via-indigo-500/10 to-slate-500/10',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-300',
    badgeText: 'Energy Savings & Clean Air',
    urgencyTag: 'Up to 25% Efficiency Loss',
    urgencyBadgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
    metricLabel: 'Recommended Cleaning Cycle',
    metricValue: 'Every 2 Weeks',
    keyCheck: 'Dust buildup · Weakened airflow',
    imageFileName: 'ac_filter.jpg'
  },
  makeup_sponge: {
    enTitle: 'COSMETIC PUFF & SPONGE',
    categoryName: 'Beauty & Skincare',
    icon: Sparkles,
    accentColor: 'text-rose-700',
    bgGradient: 'from-rose-500/15 via-pink-500/10 to-purple-500/10',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
    badgeText: 'Breakout & Blemish Prevention',
    urgencyTag: 'Oxidized Sebum & Bacteria',
    urgencyBadgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
    metricLabel: 'Recommended Cycle',
    metricValue: '1–3 Months',
    keyCheck: 'Hardened surface · Crumbling · Streaky finish',
    imageFileName: 'makeup_sponge.jpg'
  },
  gas_canister: {
    enTitle: 'CASSETTE GAS CANISTER',
    categoryName: 'Emergency & Fire Safety',
    icon: AlertTriangle,
    accentColor: 'text-orange-700',
    bgGradient: 'from-orange-500/15 via-amber-500/10 to-red-500/10',
    badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
    badgeText: 'Gas Leak & Fire Prevention',
    urgencyTag: 'O-Ring Seal Aging',
    urgencyBadgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
    metricLabel: 'Safe Service Life',
    metricValue: 'Approx. 7 Years from Mfg',
    keyCheck: 'Bottom Mfg date stamp · Rust · Dents',
    imageFileName: 'gas_canister.jpg'
  },
  emergency_toilet: {
    enTitle: 'EMERGENCY TOILET AGENT',
    categoryName: 'Disaster Preparedness',
    icon: ShieldAlert,
    accentColor: 'text-red-700',
    bgGradient: 'from-red-500/15 via-rose-500/10 to-amber-500/10',
    badgeBg: 'bg-red-100 text-red-900 border-red-300',
    badgeText: 'Emergency Sanitation',
    urgencyTag: 'Coagulant Moisture Clumping',
    urgencyBadgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
    metricLabel: 'Stock Rotation Cycle',
    metricValue: '7–10 Years',
    keyCheck: 'Swollen packets · Hardened powder clumps',
    imageFileName: 'emergency_toilet.jpg'
  },
  dehumidifier: {
    enTitle: 'BOX DEHUMIDIFIER',
    categoryName: 'Closet & Mold Control',
    icon: Droplets,
    accentColor: 'text-blue-700',
    bgGradient: 'from-blue-500/15 via-indigo-500/10 to-sky-500/10',
    badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
    badgeText: 'Moisture & Mildew Defense',
    urgencyTag: 'Zero Absorption When Full',
    urgencyBadgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
    metricLabel: 'Recommended Cycle',
    metricValue: '2–4 Months',
    keyCheck: 'Water reaches replacement fill line',
    imageFileName: 'dehumidifier.jpg'
  },
  baby_nipple: {
    enTitle: 'BABY FEEDING NIPPLE',
    categoryName: 'Baby & Infant Safety',
    icon: Heart,
    accentColor: 'text-orange-700',
    bgGradient: 'from-orange-500/15 via-rose-500/10 to-amber-500/10',
    badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
    badgeText: 'Choking Prevention & Flow Control',
    urgencyTag: 'Silicone Tear Hazard',
    urgencyBadgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
    metricLabel: 'Recommended Cycle',
    metricValue: '1–2 Months',
    keyCheck: 'Cloudiness · Loss of elasticity · Bite marks',
    imageFileName: 'baby_nipple.jpg'
  },
  pet_water_filter: {
    enTitle: 'PET FOUNTAIN FILTER',
    categoryName: 'Pet Health & Hydration',
    icon: PawPrint,
    accentColor: 'text-emerald-700',
    bgGradient: 'from-emerald-500/15 via-teal-500/10 to-sky-500/10',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    badgeText: 'Urinary Tract & Water Care',
    urgencyTag: 'Saliva Biofilm Growth',
    urgencyBadgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
    metricLabel: 'Recommended Cycle',
    metricValue: '2–4 Weeks',
    keyCheck: 'Slimy tray surface · Trapped fur & debris',
    imageFileName: 'pet_water_filter.jpg'
  },
  power_strip: {
    enTitle: 'POWER STRIP & OUTLET',
    categoryName: 'Electrical & Fire Safety',
    icon: Laptop,
    accentColor: 'text-slate-800',
    bgGradient: 'from-slate-500/15 via-amber-500/10 to-rose-500/10',
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
    badgeText: 'Electrical Fire & Arc Prevention',
    urgencyTag: 'Contact Fatigue & Overheating',
    urgencyBadgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
    metricLabel: 'Safe Replacement Cycle',
    metricValue: '3–5 Years',
    keyCheck: 'Loose plug fit · Scorch marks · Warm cord',
    imageFileName: 'power_strip.jpg'
  },
  ice_maker_filter: {
    enTitle: 'ICE MAKER WATER FILTER',
    categoryName: 'Refrigerator Hygiene',
    icon: Wind,
    accentColor: 'text-sky-700',
    bgGradient: 'from-sky-500/15 via-cyan-500/10 to-teal-500/10',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-300',
    badgeText: 'Clean Ice & Mold Prevention',
    urgencyTag: 'Water Line Mold & Odors',
    urgencyBadgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
    metricLabel: 'Recommended Cycle',
    metricValue: '3–4 Years',
    keyCheck: 'Off-tasting ice · Discolored filter mesh',
    imageFileName: 'ice_maker_filter.jpg'
  },
  eye_drops: {
    enTitle: 'EYE DROPS MEDICATION',
    categoryName: 'Ophthalmic Care',
    icon: Smile,
    accentColor: 'text-emerald-700',
    bgGradient: 'from-emerald-500/15 via-cyan-500/10 to-sky-500/10',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    badgeText: 'Sterile Eye Care',
    urgencyTag: 'Post-Opening Contamination',
    urgencyBadgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
    metricLabel: 'Discard After Opening',
    metricValue: 'Approx. 1 Month',
    keyCheck: 'Cloudy solution · Eyelash contact with tip',
    imageFileName: 'eye_drops.jpg'
  },
  frying_pan: {
    enTitle: 'NON-STICK FRYING PAN',
    categoryName: 'Cookware & Kitchen',
    icon: Flame,
    accentColor: 'text-slate-800',
    bgGradient: 'from-slate-500/15 via-stone-500/10 to-amber-500/10',
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
    badgeText: 'Non-Stick Coating Lifespan',
    urgencyTag: 'Peeling Coating & Sticking',
    urgencyBadgeStyle: 'bg-slate-100 text-slate-700 border-slate-200',
    metricLabel: 'Recommended Replacement',
    metricValue: '1–2 Years',
    keyCheck: 'Food sticking · Visible surface scratches',
    imageFileName: 'frying_pan.jpg'
  },
  air_intake_filter: {
    enTitle: 'AIR INTAKE VENT FILTER',
    categoryName: 'Ventilation & Allergen Control',
    icon: Wind,
    accentColor: 'text-teal-700',
    bgGradient: 'from-teal-500/15 via-sky-500/10 to-slate-500/10',
    badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
    badgeText: 'Fresh Air & Pollen Filtration',
    urgencyTag: 'Clogged Airflow & Soot',
    urgencyBadgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
    metricLabel: 'Cleaning / Replacement Cycle',
    metricValue: '2–3 Months',
    keyCheck: 'Darkened filter pad · Restricted airflow',
    imageFileName: 'air_intake_filter.jpg'
  }
};

export const GuideIllustration: React.FC<{ guideId: string; className?: string }> = ({ guideId, className = 'w-full' }) => {
  const [imageLoaded, setImageLoaded] = useState(true);

  const meta = GUIDE_METAS[guideId] || {
    enTitle: 'HOUSEHOLD CONSUMABLE',
    categoryName: 'Household Supplies',
    icon: Sparkles,
    accentColor: 'text-emerald-700',
    bgGradient: 'from-emerald-500/15 via-teal-500/10 to-sky-500/10',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    badgeText: 'Routine Maintenance',
    urgencyTag: 'Periodic Check Recommended',
    urgencyBadgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    metricLabel: 'Recommended Cycle',
    metricValue: 'Periodic Replacement',
    keyCheck: 'Visual wear · Performance drop'
  };

  const IconComponent = meta.icon;
  const imagePath = meta.imageFileName ? `/guides/${meta.imageFileName}` : null;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${meta.bgGradient} border border-slate-200/80 shadow-xs flex flex-col justify-between select-none ${className}`}>
      {/* 3D Realistic / Clay Product Image Layer if loaded */}
      {imagePath && imageLoaded && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={imagePath}
            alt={meta.enTitle}
            onError={() => setImageLoaded(false)}
            className="w-full h-full object-cover object-center opacity-85 transition-transform duration-500 group-hover:scale-105"
          />
          {/* Subtle gradient overlay to guarantee text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/50 to-white/30 backdrop-blur-[2px]" />
        </div>
      )}

      {/* Background ambient lighting accents */}
      <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/40 blur-2xl pointer-events-none" />
      <div className="absolute right-12 bottom-0 w-20 h-20 rounded-full bg-white/30 blur-xl pointer-events-none" />

      {/* Top row: Category info & urgency pill */}
      <div className="relative z-10 p-4 pb-0 flex items-center justify-between gap-2">
        <span className="text-[10px] font-mono font-extrabold text-slate-500 tracking-wider uppercase bg-white/70 px-2 py-0.5 rounded-md backdrop-blur-xs">
          {meta.enTitle}
        </span>
        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border shadow-2xs backdrop-blur-xs ${meta.urgencyBadgeStyle}`}>
          {meta.urgencyTag}
        </span>
      </div>

      {/* Middle row: 3D Aesthetic Highlight or Icon + Key Metrics */}
      <div className="relative z-10 px-4 my-2.5 flex items-center gap-3.5">
        {/* Floating frosted glass icon / focal container */}
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/90 backdrop-blur-md border border-white shadow-md shadow-slate-300/40 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
          <IconComponent className={`w-7 h-7 sm:w-8 sm:h-8 ${meta.accentColor} stroke-[2.2]`} />
        </div>

        {/* Infographic Metric badge */}
        <div className="min-w-0 flex-1 bg-white/80 backdrop-blur-xs p-2 rounded-xl border border-white/80 shadow-2xs">
          <span className="text-[10px] font-semibold text-slate-400 block tracking-tight">
            {meta.metricLabel}
          </span>
          <span className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight block truncate tabular-nums">
            {meta.metricValue}
          </span>
        </div>
      </div>

      {/* Bottom row: Inspection Checklist Chip */}
      <div className="relative z-10 p-4 pt-2 border-t border-slate-200/60 bg-white/60 backdrop-blur-xs flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-700 font-medium truncate">
          <Activity className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.2]" />
          <span className="text-[10.5px] truncate font-semibold">{meta.keyCheck}</span>
        </div>
        <span className="text-[10px] font-bold text-slate-400 shrink-0 hidden sm:inline">
          {meta.categoryName}
        </span>
      </div>
    </div>
  );
};
