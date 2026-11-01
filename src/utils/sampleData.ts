import { ConsumableItem } from '../types/consumable';
import { getTodayString, subtractDays } from './dateCalc';

export function generateSampleItems(): ConsumableItem[] {
  const today = getTodayString();

  return [
    {
      id: 'sample-1',
      name: 'Cartucho de filtro para jarro de água',
      category: 'Cozinha e Banho',
      cycleValue: 1,
      cycleUnit: 'month',
      lastReplacedDate: subtractDays(today, 25),
      purchaseLeadDays: 7,
      modelNumber: 'MAXTRA+',
      purchaseUrl: 'https://www.amazon.es/s?k=brita+maxtra+plus',
      memo: 'Recomenda-se a substituição a cada 4 semanas para manter a qualidade da água.',
      history: [
        {
          id: 'hist-sample-1-1',
          replacedDate: subtractDays(today, 55),
          memo: 'Substituição regular',
          recordedAt: new Date(Date.now() - 55 * 86400000).toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sample-2',
      name: 'Cabeças de substituição para escova de dentes elétrica',
      category: 'Cuidados Pessoais e Beleza',
      cycleValue: 3,
      cycleUnit: 'month',
      lastReplacedDate: subtractDays(today, 80),
      purchaseLeadDays: 14,
      modelNumber: 'Oral-B CrossAction',
      purchaseUrl: 'https://www.amazon.es/s?k=oral+b+crossaction+cabezales',
      memo: 'Substituir quando as cerdas azuis perderem a cor.',
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sample-3',
      name: 'Cabeça de substituição para máquina de barbear',
      category: 'Cuidados Pessoais e Beleza',
      cycleValue: 2,
      cycleUnit: 'year',
      lastReplacedDate: subtractDays(today, 700),
      purchaseLeadDays: 30,
      modelNumber: 'SH90/70',
      purchaseUrl: 'https://www.amazon.es/s?k=philips+sh90+cabezal',
      memo: 'Substituição recomendada a cada 2 anos para garantir um corte suave.',
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sample-4',
      name: 'Filtro HEPA para purificador de ar',
      category: 'Eletrodomésticos',
      cycleValue: 1,
      cycleUnit: 'year',
      lastReplacedDate: subtractDays(today, 360),
      purchaseLeadDays: 14,
      modelNumber: 'FZ-D50HF',
      purchaseUrl: 'https://www.amazon.es/s?k=filtro+hepa+purificador',
      memo: 'Limpar o pré-filtro mensalmente com aspirador.',
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sample-5',
      name: 'Esponja salva-unhas para loiça',
      category: 'Cozinha e Banho',
      cycleValue: 2,
      cycleUnit: 'week',
      lastReplacedDate: subtractDays(today, 12),
      purchaseLeadDays: 3,
      modelNumber: '',
      purchaseUrl: 'https://www.amazon.es/s?k=estropajo+cocina+salvaunas',
      memo: 'Trocar a cada 2 semanas para evitar proliferação bacteriana.',
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}
