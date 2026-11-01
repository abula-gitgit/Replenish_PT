import { ConsumableItem, CycleUnit, Category } from '../types/consumable';
import { getTodayString } from '../utils/dateCalc';

export interface ReplacementGuideItem {
  id: string;
  title: string;
  subtitle?: string;
  illustrationKey?: string;
  category: 'kitchen' | 'bath' | 'living' | 'appliance' | 'beauty' | 'seasonal' | 'disaster' | 'baby' | 'pet' | 'baby_pet';
  categoryLabel: string;
  cycleDays: number;
  cycleDisplay: string;
  hygieneReason: string;
  dangerOfNeglect: string;
  signsOfDegradation: string[];
  scientificNote?: string;
  proTips: string;
  urgencyLevel: 'high' | 'medium' | 'standard';
  badgeLabel?: string;
  recommendedLeadDays?: number;
}

export const REPLACEMENT_GUIDES: ReplacementGuideItem[] = [
  {
    id: 'sponge',
    title: 'Esponja de cozinha',
    subtitle: 'Prevenir a contaminação bacteriana em loiça e talheres',
    illustrationKey: 'sponge',
    category: 'kitchen',
    categoryLabel: 'Cozinha e Banho',
    cycleDays: 14,
    cycleDisplay: 'A cada 2 semanas (~14 dias)',
    hygieneReason:
      'La estructura porosa retiene restos orgánicos, humedad y calor constante, creando un ecosistema idóneo para la rápida proliferación bacteriana (E. coli, estafilococos, salmonela).',
    dangerOfNeglect:
      'Lavar los platos con un estropajo viejo propaga bacterias invisibles por vasos y platos, elevando el riesgo de molestias digestivas y malos olores en el fregadero.',
    signsOfDegradation: [
      'Pierde elasticidad y queda baboso o blando al tacto',
      'El lavavajillas no genera espuma con facilidad',
      'La fibra verde o abrasiva se deshilacha o desmenuza',
      'Desprende un persistente olor rancio a humedad'
    ],
    scientificNote:
      'Estudios microbiológicos publicados en revistas científicas demuestran que un estropajo usado de cocina alberga densidades bacterianas a menudo superiores a las del asiento de un inodoro.',
    proTips:
      'Antes de tirarlo a las 2 semanas, úsalo una última vez para limpiar a fondo el cubo de basura, las esquinas del fregadero o la rejilla del fuego.',
    urgencyLevel: 'high',
    badgeLabel: 'Prioridade máxima de higiene',
    recommendedLeadDays: 3
  },
  {
    id: 'dish_cloth',
    title: 'Pano e baeta de cozinha',
    subtitle: 'Prevenir a contaminação cruzada em bancadas e loiça',
    illustrationKey: 'towel',
    category: 'kitchen',
    categoryLabel: 'Cozinha e Banho',
    cycleDays: 3,
    cycleDisplay: 'Lavar a cada 2-3 dias (renovar a cada 3-6 meses)',
    hygieneReason:
      'Los paños absorben restos líquidos y grasa de encimeras y vajillas, propiciando la acumulación y transferencia rápida de moho y bacterias.',
    dangerOfNeglect:
      'Una bayeta húmeda esparce microorganismos indeseados por superficies limpias y platos recién aclarados.',
    signsOfDegradation: [
      'Tacto aceitoso, rígido o pegajoso incluso en seco',
      'Desprende olor agrio al contacto con agua caliente',
      'Las fibras se endurecen y pierden capacidad de absorción'
    ],
    proTips:
      'Lavar a máquina a 60 °C o desinfectar periódicamente con agua hirviendo o lejía apta para tejidos de cocina.',
    urgencyLevel: 'medium',
    recommendedLeadDays: 7
  },
  {
    id: 'water_filter',
    title: 'Cartucho para jarro de água purificadora',
    subtitle: 'Preservar a qualidade de filtragem contra calcário e cloro',
    illustrationKey: 'purifier',
    category: 'kitchen',
    categoryLabel: 'Cozinha e Banho',
    cycleDays: 30,
    cycleDisplay: 'A cada 4 semanas (~1 mês ou 150 litros)',
    hygieneReason:
      'El carbón activo y las resinas intercambiadoras se saturan con el paso del tiempo. Tras su vida útil, pueden acumular biopelículas bacterianas o desprender sedimentos.',
    dangerOfNeglect:
      'Degradación del sabor y olor del agua, incrustaciones prematuras de cal en hervidores y cafeteras, y proliferación microbiana interna.',
    signsOfDegradation: [
      'El goteo de filtración se vuelve anormalmente lento',
      'Reaparición del sabor u olor a cloro en el agua potable',
      'Presencia de pequeñas partículas o depósitos calcáreos en la jarra'
    ],
    proTips:
      'Configura entregas periódicas de recambios o guarda siempre un paquete de repuesto en el armario para nunca beber agua filtrada de forma deficiente.',
    urgencyLevel: 'high',
    badgeLabel: 'Substituição mensal recomendada',
    recommendedLeadDays: 7
  },
  {
    id: 'drain_filter',
    title: 'Filtro e ralo do lava-loiça',
    subtitle: 'Prevenir entupimentos, pragas e maus odores nos canos',
    illustrationKey: 'sponge',
    category: 'kitchen',
    categoryLabel: 'Cozinha e Banho',
    cycleDays: 3,
    cycleDisplay: 'Limpeza diária (substituir rede a cada 3-7 dias)',
    hygieneReason:
      'El desagüe recoge grasas y residuos orgánicos bajo humedad permanente, generando descomposición y proliferación de hongos filamentosos.',
    dangerOfNeglect:
      'Subida de malos olores persistentes, atracción de mosquitas de la humedad y riesgo de obstrucción costosa en las cañerías del hogar.',
    signsOfDegradation: [
      'Acumulación de limo negruzco difícil de eliminar',
      'Desagüe lento incluso con el colador aparentemente vacío',
      'Olores desagradables que emergen hacia la cocina'
    ],
    proTips:
      'Aplica bicarbonato y vinagre o agua caliente una vez por semana para mantener los conductos limpios y sin olores.',
    urgencyLevel: 'medium',
    recommendedLeadDays: 7
  },
  {
    id: 'toothbrush',
    title: 'Escova de dentes / Cabeça elétrica',
    subtitle: 'Garantir a eficácia da escovagem e proteger as gengivas',
    illustrationKey: 'toothbrush',
    category: 'beauty',
    categoryLabel: 'Cuidados Pessoais e Beleza',
    cycleDays: 30,
    cycleDisplay: 'A cada 1 mês (~30 dias)',
    hygieneReason:
      'Las cerdas abiertas pierden su flexibilidad geométrica, reduciendo la eliminación de placa dental hasta en un 50% y erosionando las encías.',
    dangerOfNeglect:
      'Aparición de sarro, caries interdentales, retracción gingival y proliferación de bacterias bucales depositadas en el cabezal húmedo.',
    signsOfDegradation: [
      'Las cerdas se abren hacia los lados o se doblan',
      'Las bandas indicadoras de color se han desgastado',
      'Sensación de aspereza o menor limpieza tras el cepillado'
    ],
    scientificNote:
      'La Asociación Dental Americana (ADA) recomienda renovar el cepillo cada 3-4 meses o antes si las cerdas están abiertas o tras pasar una infección vírica.',
    proTips:
      'Si pasas por un resfriado, gripe o infección de garganta, estrena un cepillo nuevo de inmediato para evitar reinfecciones.',
    urgencyLevel: 'high',
    badgeLabel: 'Vital para a saúde oral',
    recommendedLeadDays: 5
  },
  {
    id: 'towel',
    title: 'Toalha de banho e rosto',
    subtitle: 'Manter a absorção e frescura após cada banho',
    illustrationKey: 'towel',
    category: 'bath',
    categoryLabel: 'Cozinha e Banho',
    cycleDays: 180,
    cycleDisplay: 'Lavar após 3 utilizações (renovar a cada 6-12 meses)',
    hygieneReason:
      'Las toallas acumulan células epiteliales desprendidas, humedad y residuos de jabón, convirtiéndose en reservorios bacterianos.',
    dangerOfNeglect:
      'Brotes de acné corporal, eccemas, irritación cutánea y olor persistente a humedad adherido al cuerpo recién lavado.',
    signsOfDegradation: [
      'Pérdida de tacto suave, volviéndose áspera o tiesa',
      'Desprende olor agrio nada más humedecerse con el cuerpo',
      'Pérdida evidente de absorción y adelgazamiento de fibras'
    ],
    proTips:
      'Seca las toallas bien extendidas en lugar ventilado y evita el exceso de suavizante, ya que crea una película hidrofóbica que reduce la absorción.',
    urgencyLevel: 'standard',
    recommendedLeadDays: 14
  },
  {
    id: 'bath_mat',
    title: 'Tapete de banho (tecido / diatomite)',
    subtitle: 'Prevenir o aparecimento de fungos e pé de atleta',
    illustrationKey: 'bath',
    category: 'bath',
    categoryLabel: 'Cozinha e Banho',
    cycleDays: 7,
    cycleDisplay: 'Lavar semanalmente (substituir ao fim de 1 ano)',
    hygieneReason:
      'Permanece en el punto con más condensación del cuarto de baño, acumulando agua estancada y microorganismos.',
    dangerOfNeglect:
      'Desarrollo de hongos podales (tiña / pie de atleta), colonias de moho negro y superficies deslizantes y peligrosas.',
    signsOfDegradation: [
      'Aparición de manchas oscuras o moho en el reverso',
      'Tarda mucho más tiempo en secarse que de costumbre',
      'En alfombrillas de diatomeas: pérdida total de capacidad absorbente'
    ],
    proTips:
      'Si usas una alfombrilla de tierra de diatomeas, límpiala suavemente con lija fina de grano medio para reactivar su porosidad.',
    urgencyLevel: 'medium',
    recommendedLeadDays: 14
  },
  {
    id: 'razor',
    title: 'Lâmina de barbear descartável / Cabeça de recarga',
    subtitle: 'Evitar foliculite e cortes pelo desgaste do fio',
    illustrationKey: 'beauty',
    category: 'beauty',
    categoryLabel: 'Cuidados Pessoais e Beleza',
    cycleDays: 14,
    cycleDisplay: 'A cada 10-15 utilizações (~2 semanas)',
    hygieneReason:
      'El microfilo de acero se deforma microscópicamente tras pocos usos, provocando tirones del folículo y microcortes donde proliferan bacterias.',
    dangerOfNeglect:
      'Foliculitis bacteriana, rojeces e irritaciones severas y mayor probabilidad de heridas infectadas.',
    signsOfDegradation: [
      'Tirón molesto del pelo en lugar de un corte suave',
      'Banda lubricante descolorida, rota o inexistente',
      'Puntos microscópicos de oxidación o acumulación de cal en el peine'
    ],
    proTips:
      'Guarda siempre la maquinilla fuera de la ducha en un lugar seco y ventilado para evitar que el vapor oxide el filo prematuramente.',
    urgencyLevel: 'high',
    recommendedLeadDays: 3
  },
  {
    id: 'body_towel',
    title: 'Esponja e luva esfoliante de banho',
    subtitle: 'Cuidado dermatológico ótimo e livre de bactérias',
    illustrationKey: 'bath',
    category: 'bath',
    categoryLabel: 'Cozinha e Banho',
    cycleDays: 60,
    cycleDisplay: 'A cada 2 meses (~60 dias)',
    hygieneReason:
      'El contacto directo diario con queratina y piel muerta, sumado a la humedad constante del baño, favorece la proliferación de hongos.',
    dangerOfNeglect:
      'Foliculitis, picor cutáneo, empeoramiento de eccemas y olores no deseados en la piel.',
    signsOfDegradation: [
      'Sensación viscosa o pegajosa persistente en la esponja',
      'Color desvaído, pérdida de densidad o fibras rotas',
      'Olor desagradable a pesar de aclararla a fondo'
    ],
    proTips:
      'Escurre bien la esponja tras cada uso y cuélgala en un punto ventilado fuera del flujo directo de vapor.',
    urgencyLevel: 'medium',
    recommendedLeadDays: 7
  },
  {
    id: 'contact_case',
    title: 'Estojo para lentes de contacto',
    subtitle: 'Prevenir queratite grave e infeções oculares',
    illustrationKey: 'beauty',
    category: 'beauty',
    categoryLabel: 'Cuidados Pessoais e Beleza',
    cycleDays: 30,
    cycleDisplay: 'A cada 1-3 meses (~30-90 dias)',
    hygieneReason:
      'Las soluciones de mantenimiento no impiden totalmente la formación de biopelículas de amebas y bacterias en las ranuras del portalentillas.',
    dangerOfNeglect:
      'Queratitis por Acanthamoeba o Pseudomonas, patologías que amenazan gravemente la visión y requieren tratamientos prolongados.',
    signsOfDegradation: [
      'Ligeros depósitos blancos o turbios en las esquinas internas',
      'Grietas microscópicas o roscas con holgura',
      'Más de 3 meses de uso continuado'
    ],
    scientificNote:
      'Los oftalmólogos y la FDA recomiendan renovar el estuche porta-lentillas al menos una vez al mes o con cada nuevo bote de líquido.',
    proTips:
      'Aclara el estuche únicamente con solución salina estéril o líquido de lentillas, nunca con agua del grifo, y déjalo secar boca abajo sobre papel limpio.',
    urgencyLevel: 'high',
    badgeLabel: 'Saúde ocular prioritária',
    recommendedLeadDays: 5
  },
  {
    id: 'pillow',
    title: 'Almofada de dormir',
    subtitle: 'Higiene do sono, apoio cervical e redução de ácaros',
    illustrationKey: 'living',
    category: 'living',
    categoryLabel: 'Saúde e Bem-Estar',
    cycleDays: 730,
    cycleDisplay: 'A cada 2-3 anos (~700-1000 dias)',
    hygieneReason:
      'A lo largo de los años, una almohada acumula miles de litros de sudor, caspa y millones de ácaros del polvo y sus heces microscópicas.',
    dangerOfNeglect:
      'Aparición o empeoramiento de asma matutina, rinitis alérgica crónica, acné facial y dolor cervical por pérdida de sustentación.',
    signsOfDegradation: [
      'Al doblarla por la mitad, no recupera su forma elástica inmediatamente',
      'Aparición de manchas amarillentas difíciles de quitar',
      'Despertares frecuentes con rigidez cervical o estornudos'
    ],
    scientificNote:
      'Estudios de alergología afirman que hasta un tercio del peso de una almohada de más de 2 años puede estar formado por piel muerta, ácaros y sus alérgenos.',
    proTips:
      'Usa fundas protectoras impermeables y transpirables y lávalas semanalmente a 60 °C para alargar la salubridad del núcleo de la almohada.',
    urgencyLevel: 'standard',
    recommendedLeadDays: 30
  },
  {
    id: 'slippers',
    title: 'Chinelos de quarto / casa',
    subtitle: 'Conforto, higiene do chão e amortecimento plantar',
    illustrationKey: 'living',
    category: 'living',
    categoryLabel: 'Uso Diário e Outros',
    cycleDays: 180,
    cycleDisplay: 'A cada 6 meses (~180 dias)',
    hygieneReason:
      'El calzado de interior absorbe humedad y sudor durante horas, compactando sus plantillas y facilitando malos olores.',
    dangerOfNeglect:
      'Sobrecarga en la fascia plantar, pisada inestable y proliferación bacteriana en la piel del pie.',
    signsOfDegradation: [
      'Suela gastada, agrietada o resbaladiza',
      'Plantilla hundida sin amortiguación',
      'Olor residual persistente tras el lavado'
    ],
    proTips:
      'Disponer de 2 pares para alternar a diario permite que cada par se ventile y seque por completo, duplicando su vida útil.',
    urgencyLevel: 'standard',
    recommendedLeadDays: 14
  },
  {
    id: 'cutting_board',
    title: 'Tábua de corte (madeira / plástico)',
    subtitle: 'Impedir a anidação de microrganismos em fendas e riscos',
    illustrationKey: 'kitchen',
    category: 'kitchen',
    categoryLabel: 'Cozinha e Banho',
    cycleDays: 365,
    cycleDisplay: 'A cada 1-2 anos (~365-730 dias)',
    hygieneReason:
      'Los cortes de cuchillo crean hendiduras profundas inaccesibles para el estropajo, donde anidan restos microscópicos de carnes y verduras.',
    dangerOfNeglect:
      'Contaminación cruzada por salmonela y campylobacter entre carnes crudas y alimentos listos para comer como ensaladas.',
    signsOfDegradation: [
      'Surcos profundos y visibles de cuchillo',
      'Coloración persistente o ennegrecimiento en el centro',
      'La tabla de madera se ha combado y baila sobre la encimera'
    ],
    proTips:
      'Usa tablas de distintos colores para carnes, pescados y verduras crudas, y desinfecta periódicamente las de madera con aceite mineral apto.',
    urgencyLevel: 'medium',
    recommendedLeadDays: 14
  },
  {
    id: 'chopsticks',
    title: 'Talheres e utensílios de pau / madeira',
    subtitle: 'Segurança alimentar em utensílios de contacto direto',
    illustrationKey: 'kitchen',
    category: 'kitchen',
    categoryLabel: 'Cozinha e Banho',
    cycleDays: 180,
    cycleDisplay: 'A cada 6-12 meses (~180-365 dias)',
    hygieneReason:
      'El barniz superficial se desgasta con los lavados, dejando al descubierto la madera porosa que absorbe jugos y grasas de alimentos.',
    dangerOfNeglect:
      'Desarrollo de moho interno no visible y riesgo de pequeñas astillas en los alimentos.',
    signsOfDegradation: [
      'Puntas astilladas, ásperas o con pérdida de color',
      'Curvatura o grietas longitudinales en la madera',
      'Olor persistente a comida o detergente al mojarse'
    ],
    proTips:
      'Evita meter utensilios de madera en el lavavajillas a altas temperaturas; lávalos a mano y déjalos secar de pie.',
    urgencyLevel: 'standard',
    recommendedLeadDays: 7
  },
  {
    id: 'toilet_brush',
    title: 'Piaçaba de sanita e suporte',
    subtitle: 'Limpeza e higiene essencial na casa de banho',
    illustrationKey: 'bath',
    category: 'bath',
    categoryLabel: 'Cozinha e Banho',
    cycleDays: 180,
    cycleDisplay: 'A cada 6-12 meses (~180-365 dias)',
    hygieneReason:
      'Permanece en un recipiente cerrado y húmedo tras limpiar materia fecal, acumulando millones de microorganismos y cal.',
    dangerOfNeglect:
      'Foco de bacterias patógenas, salpicaduras antihigiénicas al usarla y mal olor permanente en el cuarto de baño.',
    signsOfDegradation: [
      'Cerdas amarillentas, dobladas o desprendidas',
      'Óxido en el mango metálico o agua sucia retenida en la base',
      'Pérdida de eficacia para raspar la porcelana'
    ],
    proTips:
      'Las escobillas con cabezal de silicona hidrófuga retienen menos agua y bacterias que las de cerdas sintéticas clásicas.',
    urgencyLevel: 'medium',
    recommendedLeadDays: 14
  },
  {
    id: 'ac_filter',
    title: 'Filtro do ar condicionado / bomba de calor',
    subtitle: 'Rendimento energético e ar puro sem poeiras',
    illustrationKey: 'aircon',
    category: 'appliance',
    categoryLabel: 'Eletrodomésticos',
    cycleDays: 14,
    cycleDisplay: 'Limpar a cada 2 semanas (renovar a cada 1-2 anos)',
    hygieneReason:
      'El filtro atrapa el polvo ambiental. Al condensar agua en verano o calentar en invierno, el polvo acumulado genera mohos esporulantes.',
    dangerOfNeglect:
      'Aumento del 15 al 30% en el consumo eléctrico, menor capacidad frigorífica y síntomas de alergia respiratoria al encender el equipo.',
    signsOfDegradation: [
      'Capa gruesa de polvo visible en la malla exterior',
      'Olor a humedad o rancio al encender la ventilación',
      'La malla plástica se agrieta o presenta roturas'
    ],
    proTips:
      'Lava los filtros con agua templada y jabón neutro, y sécalos a la sombra antes de volver a colocarlos.',
    urgencyLevel: 'high',
    badgeLabel: 'Poupança de energia e conforto',
    recommendedLeadDays: 7
  },
  {
    id: 'air_purifier',
    title: 'Filtro HEPA para purificador de ar',
    subtitle: 'Capturar partículas finas PM2.5, alergénios e pólen',
    illustrationKey: 'purifier',
    category: 'appliance',
    categoryLabel: 'Eletrodomésticos',
    cycleDays: 365,
    cycleDisplay: 'A cada 1-2 anos (~365-730 dias)',
    hygieneReason:
      'Las microfibras electrostáticas del filtro HEPA se saturan gradualmente de micropartículas, humo, polen y caspa de animales.',
    dangerOfNeglect:
      'Pérdida drástica del caudal de purificación, sobrecalentamiento del motor eléctrico y retorno de partículas a la estancia.',
    signsOfDegradation: [
      'El filtro cambia de blanco a gris oscuro o negro',
      'El ventilador emite un ruido forzado o mayor vibración',
      'El sensor del purificador indica niveles de aire desfavorables continuos'
    ],
    proTips:
      'Aspira el prefiltro exterior mensualmente sin tocar la superficie interna del HEPA para maximizar su durabilidad.',
    urgencyLevel: 'medium',
    recommendedLeadDays: 20
  },
  {
    id: 'humidifier_filter',
    title: 'Filtro e pastilha anticalcário do humidificador',
    subtitle: 'Prevenir a propagação de bactérias e fungos respiratórios',
    illustrationKey: 'humidifier',
    category: 'appliance',
    categoryLabel: 'Eletrodomésticos',
    cycleDays: 30,
    cycleDisplay: 'Limpeza quinzenal (substituir a cada 1-6 meses)',
    hygieneReason:
      'El agua templada estancada combinada con minerales favorece la colonización de Legionella y bacterias que se aerosolizan al respirar.',
    dangerOfNeglect:
      'Riesgo de neumonitis por hipersensibilidad, tos seca, rinitis y difusión de polvo blanco calcáreo sobre los muebles.',
    signsOfDegradation: [
      'El filtro adquiere color amarillento, pardo o negruzco',
      'Incrustaciones duras de cal que impiden absorber el agua',
      'Desprende olor agrio nada más encender el vapor'
    ],
    proTips:
      'Usa agua fresca desmineralizada o cambia el agua del depósito cada 24 horas desinfectando periódicamente con ácido cítrico diluido.',
    urgencyLevel: 'high',
    badgeLabel: 'Risco respiratório relevante',
    recommendedLeadDays: 7
  },
  {
    id: 'gas_canister',
    title: 'Cartucho de gás para fogão portátil (Campismo)',
    subtitle: 'Segurança contra fugas em emergências e atividades ao ar livre',
    illustrationKey: 'disaster',
    category: 'disaster',
    categoryLabel: 'Emergência e Segurança',
    cycleDays: 2555,
    cycleDisplay: 'Substituir antes de 7 anos desde o fabrico',
    hygieneReason:
      'Las juntas de goma internas se degradan con el paso de los años, perdiendo elasticidad y propiciando fugas de gas butano.',
    dangerOfNeglect:
      'Fugas inadvertidas durante el almacenamiento y alto riesgo de incendio o deflagración al encender el hornillo.',
    signsOfDegradation: [
      'Han transcurrido más de 7 años desde la fecha impresa en la base',
      'Presencia de óxido en el borde superior o en la válvula',
      'Deformaciones o abolladuras por caídas'
    ],
    proTips:
      'Guarda siempre los cartuchos en un lugar fresco y seco, lejos de fuentes de calor o rayos solares directos, y anota la fecha de compra en el tapón.',
    urgencyLevel: 'high',
    badgeLabel: 'Segurança doméstica prioritária',
    recommendedLeadDays: 30
  },
  {
    id: 'frying_pan',
    title: 'Frigideira antiaderente (revestimento de teflon)',
    subtitle: 'Cozedura saudável e prevenção de compostos tóxicos por riscos',
    illustrationKey: 'kitchen',
    category: 'kitchen',
    categoryLabel: 'Cozinha e Banho',
    cycleDays: 365,
    cycleDisplay: 'A cada 1-2 anos (~365-730 dias)',
    hygieneReason:
      'El recubrimiento antiadherente sufre microgrietas por choques térmicos y uso de utensilios, perdiendo su propiedad de sellado.',
    dangerOfNeglect:
      'La comida se pega y se quema fácilmente, y se desprenden micropartículas poliméricas sobre los alimentos preparados.',
    signsOfDegradation: [
      'Los huevos o el pescado se pegan incluso con aceite',
      'Arañazos visibles que dejan al descubierto el aluminio inferior',
      'Fondo abombado o deformado que calienta de forma irregular'
    ],
    proTips:
      'Nunca enfríes una sartén caliente bajo el grifo de agua fría; el choque térmico es el causante del 80% de los desprendimientos prematuros.',
    urgencyLevel: 'medium',
    recommendedLeadDays: 14
  },
  {
    id: 'ventilation_filter',
    title: 'Filtro antigordura de exaustor de cozinha',
    subtitle: 'Rendimento de extração e prevenção de incêndios na cozinha',
    illustrationKey: 'kitchen',
    category: 'kitchen',
    categoryLabel: 'Cozinha e Banho',
    cycleDays: 90,
    cycleDisplay: 'A cada 3-6 meses (~90-180 dias)',
    hygieneReason:
      'El vapor de cocción saturado de lípidos se solidifica en la malla metálica o textil, bloqueando la salida de aire.',
    dangerOfNeglect:
      'Reducción drástica de la extracción de humos, goteo de grasa quemada sobre la encimera y grave riesgo de ignición en caso de llamarada en la sartén.',
    signsOfDegradation: [
      'Goteo visible de aceite marrón desde los bordes del filtro',
      'La campana produce más ruido de motor pero aspira poco humo',
      'Tacto viscoso y pegajoso resistente a los detergentes habituales'
    ],
    proTips:
      'Si tienes filtros metálicos, sumérgelos periódicamente en agua caliente con desengrasante o colócalos en el lavavajillas a programa intensivo.',
    urgencyLevel: 'medium',
    recommendedLeadDays: 14
  }
];

export function getGuideById(id: string): ReplacementGuideItem | undefined {
  return REPLACEMENT_GUIDES.find((g) => g.id === id);
}

export function getGuidesByCategory(category: string): ReplacementGuideItem[] {
  if (category === 'all') return REPLACEMENT_GUIDES;
  return REPLACEMENT_GUIDES.filter((g) => g.category === category);
}

export function convertGuideToConsumable(guide: ReplacementGuideItem): ConsumableItem {
  let category: Category;
  switch (guide.category) {
    case 'kitchen':
    case 'bath':
      category = 'Cozinha e Banho';
      break;
    case 'appliance':
      category = 'Eletrodomésticos';
      break;
    case 'beauty':
      category = 'Cuidados Pessoais e Beleza';
      break;
    case 'seasonal':
      category = 'Roupa e Estação';
      break;
    case 'disaster':
      category = 'Emergência e Segurança';
      break;
    case 'baby':
      category = 'Bebés e Crianças';
      break;
    case 'pet':
      category = 'Animais de Estimação';
      break;
    case 'living':
    default:
      category = 'Casa e Bricolage';
      break;
  }

  let cycleValue = guide.cycleDays;
  let cycleUnit: CycleUnit = 'day';

  if (guide.cycleDays >= 365 && guide.cycleDays % 365 === 0) {
    cycleValue = guide.cycleDays / 365;
    cycleUnit = 'year';
  } else if (guide.cycleDays >= 30 && guide.cycleDays % 30 === 0) {
    cycleValue = guide.cycleDays / 30;
    cycleUnit = 'month';
  } else if (guide.cycleDays >= 7 && guide.cycleDays % 7 === 0) {
    cycleValue = guide.cycleDays / 7;
    cycleUnit = 'week';
  } else if (guide.cycleDays >= 30) {
    cycleValue = Math.round(guide.cycleDays / 30);
    cycleUnit = 'month';
  }

  let purchaseLeadDays = guide.recommendedLeadDays ?? 7;
  if (guide.recommendedLeadDays === undefined) {
    if (cycleUnit === 'day' || (cycleUnit === 'week' && cycleValue <= 2)) {
      purchaseLeadDays = 3;
    } else if (cycleUnit === 'year') {
      purchaseLeadDays = 14;
    }
  }

  return {
    id: '',
    name: guide.title,
    category,
    cycleValue,
    cycleUnit,
    lastReplacedDate: getTodayString(),
    purchaseLeadDays,
    memo: `Ciclo recomendado: ${guide.cycleDisplay}. ${guide.scientificNote || guide.proTips || ''}`.slice(0, 120),
    history: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function mapGuideToPreset(guideId: string): ConsumableItem | null {
  const guide = getGuideById(guideId);
  if (!guide) return null;
  return convertGuideToConsumable(guide);
}

