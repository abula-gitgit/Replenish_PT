import { MasterOption } from '../types/consumable';

export const DEFAULT_MASTER_OPTIONS: MasterOption[] = [
  // Cozinha e Banho
  {
    id: 'master-1',
    name: 'Cartucho de filtro de agua',
    category: 'Cozinha e Banho',
    defaultCycleValue: 1,
    defaultCycleUnit: 'month',
    defaultLeadDays: 7,
    defaultMemo: 'Cartucho para jarra filtrante o grifo. Cambiar cada 4 semanas para un sabor siempre fresco.'
  },
  {
    id: 'master-2',
    name: 'Estropajo salvaúñas para vajilla',
    category: 'Cozinha e Banho',
    defaultCycleValue: 2,
    defaultCycleUnit: 'week',
    defaultLeadDays: 3,
    defaultMemo: 'Sustituir cada dos semanas para prevenir la proliferación de bacterias y malos olores.'
  },
  {
    id: 'master-3',
    name: 'Filtro para campana extractora',
    category: 'Cozinha e Banho',
    defaultCycleValue: 2,
    defaultCycleUnit: 'month',
    defaultLeadDays: 7,
    defaultMemo: 'Filtro antigrasa o carbón activo para mantener la eficacia de extracción en la cocina.'
  },
  {
    id: 'master-4',
    name: 'Gel desatascador y limpiador de tuberías',
    category: 'Cozinha e Banho',
    defaultCycleValue: 1,
    defaultCycleUnit: 'month',
    defaultLeadDays: 3,
    defaultMemo: 'Previene atascos y malos olores en el fregadero de la cocina y el desagüe de la ducha.'
  },
  {
    id: 'master-5',
    name: 'Tratamiento antimoho para baño',
    category: 'Cozinha e Banho',
    defaultCycleValue: 2,
    defaultCycleUnit: 'month',
    defaultLeadDays: 5,
    defaultMemo: 'Aplicar spray o espuma protectora cada dos meses para evitar el moho en las juntas.'
  },
  {
    id: 'master-6',
    name: 'Bloque limpiador para inodoro / WC',
    category: 'Cozinha e Banho',
    defaultCycleValue: 1,
    defaultCycleUnit: 'month',
    defaultLeadDays: 5,
    defaultMemo: 'Previene la cal y mantiene la higiene con cada descarga.'
  },
  {
    id: 'master-7',
    name: 'Escobilla de baño con soporte',
    category: 'Cozinha e Banho',
    defaultCycleValue: 1,
    defaultCycleUnit: 'year',
    defaultLeadDays: 7,
    defaultMemo: 'Por razones higiénicas se recomienda su sustitución completa una vez al año.'
  },
  {
    id: 'master-8',
    name: 'Filtro de pelusas y goma de lavadora',
    category: 'Cozinha e Banho',
    defaultCycleValue: 1,
    defaultCycleUnit: 'year',
    defaultLeadDays: 10,
    defaultMemo: 'Revisar y sustituir si está desgastado, incrustado o con moho persistente.'
  },

  // Eletrodomésticos
  {
    id: 'master-9',
    name: 'Filtro do ar condicionado',
    category: 'Eletrodomésticos',
    defaultCycleValue: 2,
    defaultCycleUnit: 'week',
    defaultLeadDays: 0,
    defaultMemo: 'Aspirar el polvo, lavar suavemente con agua y secar a la sombra.'
  },
  {
    id: 'master-10',
    name: 'Filtro HEPA para purificador de aire',
    category: 'Eletrodomésticos',
    defaultCycleValue: 1,
    defaultCycleUnit: 'year',
    defaultLeadDays: 14,
    defaultMemo: 'Aspirar regularmente el prefiltro y sustituir la unidad HEPA cada 12 meses.'
  },
  {
    id: 'master-11',
    name: 'Filtro evaporativo para humidificador',
    category: 'Eletrodomésticos',
    defaultCycleValue: 6,
    defaultCycleUnit: 'month',
    defaultLeadDays: 7,
    defaultMemo: 'Lavar con ácido cítrico antical o cambiar cuando esté endurecido o amarillento.'
  },
  {
    id: 'master-12',
    name: 'Bolsa / Filtro de aspiradora',
    category: 'Eletrodomésticos',
    defaultCycleValue: 2,
    defaultCycleUnit: 'month',
    defaultLeadDays: 7,
    defaultMemo: 'Cambiar para mantener la potencia de succión y la pureza del aire expulsado.'
  },
  {
    id: 'master-13',
    name: 'Cepillos y filtro de robot aspirador',
    category: 'Eletrodomésticos',
    defaultCycleValue: 3,
    defaultCycleUnit: 'month',
    defaultLeadDays: 7,
    defaultMemo: 'Retirar pelos enredados y cambiar filtros y cepillos laterales cada 3 meses.'
  },
  {
    id: 'master-14',
    name: 'Cartucho antical para plancha de vapor',
    category: 'Eletrodomésticos',
    defaultCycleValue: 6,
    defaultCycleUnit: 'month',
    defaultLeadDays: 10,
    defaultMemo: 'Evita la expulsión de residuos calcáreos y protege los tejidos al planchar.'
  },

  // Eletrónica e Escritório
  {
    id: 'master-15',
    name: 'Cinta para rotuladora de etiquetas',
    category: 'Eletrónica e Escritório',
    defaultCycleValue: 6,
    defaultCycleUnit: 'month',
    defaultLeadDays: 7,
    defaultMemo: 'Para etiquetadoras Brother P-touch o Dymo. Tener siempre un casete de reserva.'
  },
  {
    id: 'master-16',
    name: 'Spray de aire comprimido para teclado',
    category: 'Eletrónica e Escritório',
    defaultCycleValue: 3,
    defaultCycleUnit: 'month',
    defaultLeadDays: 5,
    defaultMemo: 'Ideal para eliminar polvo y migajas entre las teclas del PC y ranuras electrónicas.'
  },
  {
    id: 'master-17',
    name: 'Paño de microfibra para pantallas',
    category: 'Eletrónica e Escritório',
    defaultCycleValue: 6,
    defaultCycleUnit: 'month',
    defaultLeadDays: 3,
    defaultMemo: 'Lavar periódicamente y renovar para evitar microrrayaduras en pantallas y lentes.'
  },
  {
    id: 'master-18',
    name: 'Pilas para mando a distancia / ratón inalámbrico',
    category: 'Eletrónica e Escritório',
    defaultCycleValue: 1,
    defaultCycleUnit: 'year',
    defaultLeadDays: 7,
    defaultMemo: 'Pilas AA o AAA. Comprobar periódicamente para evitar fugas de electrolito.'
  },

  // Saúde e Bem-Estar
  {
    id: 'master-19',
    name: 'Cabezales de cepillo eléctrico',
    category: 'Saúde e Bem-Estar',
    defaultCycleValue: 3,
    defaultCycleUnit: 'month',
    defaultLeadDays: 7,
    defaultMemo: 'Sustituir cuando las cerdas indicadoras pierdan color para un cepillado eficaz.'
  },
  {
    id: 'master-20',
    name: 'Cepillo de dientes manual',
    category: 'Saúde e Bem-Estar',
    defaultCycleValue: 1,
    defaultCycleUnit: 'month',
    defaultLeadDays: 5,
    defaultMemo: 'Cambiar mensualmente o antes si las cerdas se abren hacia los lados.'
  },
  {
    id: 'master-21',
    name: 'Estuche para lentes de contacto',
    category: 'Saúde e Bem-Estar',
    defaultCycleValue: 3,
    defaultCycleUnit: 'month',
    defaultLeadDays: 7,
    defaultMemo: 'Cambiar cada 3 meses para prevenir infecciones bacterianas oculares graves.'
  },
  {
    id: 'master-22',
    name: 'Solución única para lentes de contacto',
    category: 'Saúde e Bem-Estar',
    defaultCycleValue: 1,
    defaultCycleUnit: 'month',
    defaultLeadDays: 5,
    defaultMemo: 'Desechar el frasco 30-90 días después de abrirlo según indicaciones del fabricante.'
  },
  {
    id: 'master-23',
    name: 'Boquillas para irrigador dental',
    category: 'Saúde e Bem-Estar',
    defaultCycleValue: 6,
    defaultCycleUnit: 'month',
    defaultLeadDays: 7,
    defaultMemo: 'Para Waterpik u otros irrigadores bucales. Sustituir cada 6 meses.'
  },
  {
    id: 'master-24',
    name: 'Botiquín de primeros auxilios (Desinfectante y tiritas)',
    category: 'Saúde e Bem-Estar',
    defaultCycleValue: 1,
    defaultCycleUnit: 'year',
    defaultLeadDays: 14,
    defaultMemo: 'Revisar fechas de caducidad de desinfectantes, tiritas adhesivas y gasas.'
  },

  // Cuidados Pessoais e Beleza
  {
    id: 'master-25',
    name: 'Cabeça de corte para máquina de barbear',
    category: 'Cuidados Pessoais e Beleza',
    defaultCycleValue: 1,
    defaultCycleUnit: 'year',
    defaultLeadDays: 14,
    defaultMemo: 'Cambiar cada 12-18 meses para un afeitado suave sin tirones ni irritaciones.'
  },
  {
    id: 'master-26',
    name: 'Cuchillas para maquinilla de afeitar',
    category: 'Cuidados Pessoais e Beleza',
    defaultCycleValue: 3,
    defaultCycleUnit: 'week',
    defaultLeadDays: 5,
    defaultMemo: 'Cambiar cada 10-15 afeitados para evitar microcortes e infecciones en los folículos.'
  },
  {
    id: 'master-27',
    name: 'Esponja de maquillaje / Blender',
    category: 'Cuidados Pessoais e Beleza',
    defaultCycleValue: 3,
    defaultCycleUnit: 'month',
    defaultLeadDays: 7,
    defaultMemo: 'Lavar semanalmente y renovar cada 3 meses para mantener la piel limpia de bacterias.'
  },
  {
    id: 'master-28',
    name: 'Rímel y cosméticos líquidos',
    category: 'Cuidados Pessoais e Beleza',
    defaultCycleValue: 3,
    defaultCycleUnit: 'month',
    defaultLeadDays: 7,
    defaultMemo: 'Desechar después de 3 a 6 meses de uso para evitar conjuntivitis o irritación ocular.'
  },
  {
    id: 'master-29',
    name: 'Protector solar facial / corporal',
    category: 'Cuidados Pessoais e Beleza',
    defaultCycleValue: 1,
    defaultCycleUnit: 'year',
    defaultLeadDays: 14,
    defaultMemo: 'El factor de protección disminuye tras abrir el envase. Renovar al inicio de cada temporada.'
  },
  {
    id: 'master-30',
    name: 'Bálsamo labial hidratante',
    category: 'Cuidados Pessoais e Beleza',
    defaultCycleValue: 6,
    defaultCycleUnit: 'month',
    defaultLeadDays: 5,
    defaultMemo: 'Renovar cada semestre para mantener la higiene labial.'
  },

  // Roupa e Estação
  {
    id: 'master-31',
    name: 'Antipolillas para armarios y cajones',
    category: 'Roupa e Estação',
    defaultCycleValue: 6,
    defaultCycleUnit: 'month',
    defaultLeadDays: 14,
    defaultMemo: 'Sustituir en primavera y otoño coincidiendo con el cambio de ropa de temporada.'
  },
  {
    id: 'master-32',
    name: 'Absorbentes de humedad / Deshumidificadores para armario',
    category: 'Roupa e Estação',
    defaultCycleValue: 3,
    defaultCycleUnit: 'month',
    defaultLeadDays: 7,
    defaultMemo: 'Comprobar el nivel de agua acumulada y cambiar cuando alcance la marca de llenado.'
  },
  {
    id: 'master-33',
    name: 'Zapatillas de correr / deporte',
    category: 'Roupa e Estação',
    defaultCycleValue: 1,
    defaultCycleUnit: 'year',
    defaultLeadDays: 14,
    defaultMemo: 'Cambiar tras 500-800 km o cuando la amortiguación de la suela pierda elasticidad.'
  },
  {
    id: 'master-34',
    name: 'Ropa interior básica y calcetines',
    category: 'Roupa e Estação',
    defaultCycleValue: 1,
    defaultCycleUnit: 'year',
    defaultLeadDays: 14,
    defaultMemo: 'Renovar prendas desgastadas, con elásticos flojos o pérdida de forma.'
  },

  // Emergência e Segurança
  {
    id: 'master-35',
    name: 'Cartucho de gas para hornillo portátil',
    category: 'Emergência e Segurança',
    defaultCycleValue: 6,
    defaultCycleUnit: 'year',
    defaultLeadDays: 30,
    defaultMemo: 'Vida útil máxima de 6 a 7 años para prevenir el deterioro de juntas de goma.'
  },
  {
    id: 'master-36',
    name: 'Agua mineral embotellada de reserva',
    category: 'Emergência e Segurança',
    defaultCycleValue: 2,
    defaultCycleUnit: 'year',
    defaultLeadDays: 30,
    defaultMemo: 'Almacenar al menos 3 litros por persona al día. Consumir y rotar antes de la fecha límite.'
  },
  {
    id: 'master-37',
    name: 'Raciones de alimentos de emergencia no perecederos',
    category: 'Emergência e Segurança',
    defaultCycleValue: 3,
    defaultCycleUnit: 'year',
    defaultLeadDays: 30,
    defaultMemo: 'Conservas, barritas energéticas y alimentos liofilizados. Rotación continua.'
  },
  {
    id: 'master-38',
    name: 'Pilas para linterna y radio de emergencia',
    category: 'Emergência e Segurança',
    defaultCycleValue: 5,
    defaultCycleUnit: 'year',
    defaultLeadDays: 30,
    defaultMemo: 'Elegir pilas alcalinas o de litio de larga duración y comprobar anualmente.'
  },
  {
    id: 'master-39',
    name: 'Bolsas y reactivos para inodoro de emergencia',
    category: 'Emergência e Segurança',
    defaultCycleValue: 5,
    defaultCycleUnit: 'year',
    defaultLeadDays: 30,
    defaultMemo: 'Los reactivos aglutinantes tienen una vida útil garantizada de 5 a 10 años.'
  },

  // Bebés e Crianças
  {
    id: 'master-40',
    name: 'Tetinas para biberón',
    category: 'Bebés e Crianças',
    defaultCycleValue: 2,
    defaultCycleUnit: 'month',
    defaultLeadDays: 7,
    defaultMemo: 'Sustituir ante cualquier grieta, decoloración o según el crecimiento del bebé.'
  },
  {
    id: 'master-41',
    name: 'Chupetes de silicona / látex',
    category: 'Bebés e Crianças',
    defaultCycleValue: 2,
    defaultCycleUnit: 'month',
    defaultLeadDays: 7,
    defaultMemo: 'Cambiar cada 1-2 meses por seguridad e higiene o inmediatamente si hay signos de mordeduras.'
  },
  {
    id: 'master-42',
    name: 'Pastillas o solución esterilizante de biberones',
    category: 'Bebés e Crianças',
    defaultCycleValue: 1,
    defaultCycleUnit: 'month',
    defaultLeadDays: 5,
    defaultMemo: 'Comprobar el stock de pastillas o líquido desinfectante para no quedarse sin suministros.'
  },

  // Animais de Estimação
  {
    id: 'master-43',
    name: 'Filtro para fuente de agua de mascotas',
    category: 'Animais de Estimação',
    defaultCycleValue: 3,
    defaultCycleUnit: 'week',
    defaultLeadDays: 5,
    defaultMemo: 'Filtro de carbón e intercambio iónico. Cambiar cada 2-4 semanas para evitar sarro y bacterias.'
  },
  {
    id: 'master-44',
    name: 'Arena / Virutas para caja de arena de gatos',
    category: 'Animais de Estimação',
    defaultCycleValue: 1,
    defaultCycleUnit: 'month',
    defaultLeadDays: 5,
    defaultMemo: 'Vaciado y limpieza completa de la bandeja cada mes para evitar malos olores persistentes.'
  },
  {
    id: 'master-45',
    name: 'Pipeta antiparasitaria externa (Pulgas y garrapatas)',
    category: 'Animais de Estimação',
    defaultCycleValue: 1,
    defaultCycleUnit: 'month',
    defaultLeadDays: 5,
    defaultMemo: 'Aplicar mensualmente sobre la nuca según recomendación veterinaria.'
  },

  // Automóvel e Mobilidade
  {
    id: 'master-46',
    name: 'Líquido lavaparabrisas anticongelante',
    category: 'Automóvel e Mobilidade',
    defaultCycleValue: 3,
    defaultCycleUnit: 'month',
    defaultLeadDays: 7,
    defaultMemo: 'Rellenar el depósito y usar fórmula para bajas temperaturas en invierno.'
  },
  {
    id: 'master-47',
    name: 'Escovas limpa-para-brisas',
    category: 'Automóvel e Mobilidade',
    defaultCycleValue: 1,
    defaultCycleUnit: 'year',
    defaultLeadDays: 14,
    defaultMemo: 'Sustituir cuando dejen rayas de agua o hagan ruido de chirrido en el cristal.'
  },
  {
    id: 'master-48',
    name: 'Filtro de habitáculo do automóvel',
    category: 'Automóvel e Mobilidade',
    defaultCycleValue: 1,
    defaultCycleUnit: 'year',
    defaultLeadDays: 14,
    defaultMemo: 'Filtro antipolen y carbón activo. Mejora el flujo del aire acondicionado y elimina olores.'
  },

  // Casa e Bricolage
  {
    id: 'master-49',
    name: 'Filtro de ventilación de pared',
    category: 'Casa e Bricolage',
    defaultCycleValue: 3,
    defaultCycleUnit: 'month',
    defaultLeadDays: 7,
    defaultMemo: 'Filtro antipolen y antipolvo en los conductos de ventilación pasiva de las habitaciones.'
  },
  {
    id: 'master-50',
    name: 'Almohadillas de fieltro para patas de sillas',
    category: 'Casa e Bricolage',
    defaultCycleValue: 1,
    defaultCycleUnit: 'year',
    defaultLeadDays: 7,
    defaultMemo: 'Protegen el suelo de parqué o tarima de rayaduras y ruidos al arrastrar sillas.'
  },
  {
    id: 'master-51',
    name: 'Protector anticalcáreo para ducha',
    category: 'Casa e Bricolage',
    defaultCycleValue: 6,
    defaultCycleUnit: 'month',
    defaultLeadDays: 7,
    defaultMemo: 'Cartucho de decloración o filtro para alcachofa de ducha.'
  },

  // Uso Diário e Outros
  {
    id: 'master-52',
    name: 'Toallas de baño de algodón',
    category: 'Uso Diário e Outros',
    defaultCycleValue: 1,
    defaultCycleUnit: 'year',
    defaultLeadDays: 14,
    defaultMemo: 'Tras un año de lavados frecuentes, la capacidad de absorción y suavidad disminuyen.'
  },
  {
    id: 'master-53',
    name: 'Almohada para dormir',
    category: 'Uso Diário e Outros',
    defaultCycleValue: 2,
    defaultCycleUnit: 'year',
    defaultLeadDays: 20,
    defaultMemo: 'Sustituir cada 2-3 años para evitar la acumulación de ácaros y asegurar el apoyo cervical.'
  },
  {
    id: 'master-54',
    name: 'Recambio de fragancia / ambientador',
    category: 'Uso Diário e Outros',
    defaultCycleValue: 1,
    defaultCycleUnit: 'month',
    defaultLeadDays: 5,
    defaultMemo: 'Ambientador de varillas o difusor eléctrico para salón o recibidor.'
  },
  {
    id: 'master-55',
    name: 'Suplementos nutricionales y vitaminas',
    category: 'Uso Diário e Outros',
    defaultCycleValue: 1,
    defaultCycleUnit: 'month',
    defaultLeadDays: 5,
    defaultMemo: 'Supervisar el frasco de 30-60 comprimidos para reponer antes de agotarlo.'
  }
];

const MASTER_STORAGE_KEY = 'replenish_master_options_pt_v1';

export function sanitizeMasterOptions(list: any[]): MasterOption[] {
  if (!Array.isArray(list)) return [];

  const seenIds = new Set<string>();
  const seenNames = new Set<string>();
  const result: MasterOption[] = [];

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (!item || typeof item.name !== 'string') continue;

    const trimmedName = item.name.trim();
    if (!trimmedName) continue;

    const lowerName = trimmedName.toLowerCase();
    if (seenNames.has(lowerName)) {
      continue;
    }
    seenNames.add(lowerName);

    let id = item.id && typeof item.id === 'string' && item.id.trim()
      ? item.id.trim()
      : `master-opt-${i + 1}`;

    if (seenIds.has(id)) {
      id = `${id}-dup-${i + 1}-${Math.random().toString(36).slice(2, 7)}`;
    }
    seenIds.add(id);

    result.push({
      ...item,
      id,
      name: trimmedName,
      order: result.length + 1
    } as any);
  }

  return result;
}

export function loadMasterOptions(): MasterOption[] {
  try {
    const raw = localStorage.getItem(MASTER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return sanitizeMasterOptions(parsed);
      }
    }

    const defaults = sanitizeMasterOptions(DEFAULT_MASTER_OPTIONS);
    saveMasterOptions(defaults);
    return defaults;
  } catch (err) {
    console.error('Error al cargar las opciones maestras:', err);
    return sanitizeMasterOptions(DEFAULT_MASTER_OPTIONS);
  }
}

export function saveMasterOptions(options: MasterOption[]): boolean {
  try {
    const sanitized = sanitizeMasterOptions(options);
    localStorage.setItem(MASTER_STORAGE_KEY, JSON.stringify(sanitized));
    return true;
  } catch (err) {
    console.error('Error al guardar las opciones maestras:', err);
    return false;
  }
}

export function resetMasterOptionsToDefault(): MasterOption[] {
  const defaults = sanitizeMasterOptions(DEFAULT_MASTER_OPTIONS);
  saveMasterOptions(defaults);
  return defaults;
}
