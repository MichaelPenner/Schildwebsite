import type { Material, ProductColor } from '../types';

export const materials: Material[] = [
  {
    id: 'mat-pla',
    name: 'PLA',
    description: 'Biologisch abbaubares Standardmaterial. Ideal für Innenbereiche.',
    density: 1.24,
    priceModifier: 0,
    isActive: true,
    availableColorIds: [
      'col-pla-black', 'col-pla-white', 'col-pla-anthracite',
      'col-pla-silver', 'col-pla-gold', 'col-pla-red',
      'col-pla-blue', 'col-pla-green',
    ],
    properties: {
      'UV-Beständigkeit': 'Mittel',
      'Temperaturbereich': '0–60 °C',
      'Eignung': 'Innenbereich',
    },
  },
  {
    id: 'mat-petg',
    name: 'PETG',
    description: 'Robustes, wetterfestes Material. Ideal für den Außenbereich.',
    density: 1.27,
    priceModifier: 350, // +3,50 €
    isActive: true,
    availableColorIds: [
      'col-petg-black', 'col-petg-white', 'col-petg-anthracite',
      'col-petg-silver', 'col-petg-transparent',
    ],
    properties: {
      'UV-Beständigkeit': 'Hoch',
      'Temperaturbereich': '-20–80 °C',
      'Eignung': 'Innen- & Außenbereich',
    },
  },
  {
    id: 'mat-asa',
    name: 'ASA',
    description: 'Premium-Material mit höchster UV- und Wetterbeständigkeit.',
    density: 1.07,
    priceModifier: 500, // +5,00 €
    isActive: true,
    availableColorIds: [
      'col-asa-black', 'col-asa-white', 'col-asa-anthracite',
    ],
    properties: {
      'UV-Beständigkeit': 'Sehr hoch',
      'Temperaturbereich': '-30–95 °C',
      'Eignung': 'Außenbereich / Profi',
    },
  },
];

export const colors: ProductColor[] = [
  // PLA Farben
  {
    id: 'col-pla-black',
    name: 'Schwarz',
    hex: '#1a1a1a',
    materialId: 'mat-pla',
    finish: 'matt',
    glossLevel: 15,
    priceModifier: 0,
    isActive: true,
  },
  {
    id: 'col-pla-white',
    name: 'Weiß',
    hex: '#f5f5f5',
    materialId: 'mat-pla',
    finish: 'satin',
    glossLevel: 40,
    priceModifier: 0,
    isActive: true,
  },
  {
    id: 'col-pla-anthracite',
    name: 'Anthrazit',
    hex: '#292929',
    materialId: 'mat-pla',
    finish: 'matt',
    glossLevel: 20,
    priceModifier: 250,
    isActive: true,
  },
  {
    id: 'col-pla-silver',
    name: 'Silber',
    hex: '#c0c0c0',
    materialId: 'mat-pla',
    finish: 'satin',
    glossLevel: 60,
    priceModifier: 350,
    isActive: true,
    effects: ['metallic'],
  },
  {
    id: 'col-pla-gold',
    name: 'Gold',
    hex: '#d4a574',
    materialId: 'mat-pla',
    finish: 'satin',
    glossLevel: 65,
    priceModifier: 400,
    isActive: true,
    effects: ['metallic'],
  },
  {
    id: 'col-pla-red',
    name: 'Rot',
    hex: '#b22222',
    materialId: 'mat-pla',
    finish: 'matt',
    glossLevel: 25,
    priceModifier: 150,
    isActive: true,
  },
  {
    id: 'col-pla-blue',
    name: 'Blau',
    hex: '#1e3a5f',
    materialId: 'mat-pla',
    finish: 'matt',
    glossLevel: 25,
    priceModifier: 150,
    isActive: true,
  },
  {
    id: 'col-pla-green',
    name: 'Grün',
    hex: '#2d5a3d',
    materialId: 'mat-pla',
    finish: 'matt',
    glossLevel: 20,
    priceModifier: 150,
    isActive: true,
  },
  // PETG Farben
  {
    id: 'col-petg-black',
    name: 'Schwarz',
    hex: '#1a1a1a',
    materialId: 'mat-petg',
    finish: 'gloss',
    glossLevel: 70,
    priceModifier: 0,
    isActive: true,
  },
  {
    id: 'col-petg-white',
    name: 'Weiß',
    hex: '#f0f0f0',
    materialId: 'mat-petg',
    finish: 'gloss',
    glossLevel: 65,
    priceModifier: 0,
    isActive: true,
  },
  {
    id: 'col-petg-anthracite',
    name: 'Anthrazit',
    hex: '#333333',
    materialId: 'mat-petg',
    finish: 'satin',
    glossLevel: 45,
    priceModifier: 250,
    isActive: true,
  },
  {
    id: 'col-petg-silver',
    name: 'Silber',
    hex: '#b8b8b8',
    materialId: 'mat-petg',
    finish: 'gloss',
    glossLevel: 75,
    priceModifier: 350,
    isActive: true,
    effects: ['metallic'],
  },
  {
    id: 'col-petg-transparent',
    name: 'Transparent',
    hex: '#e0e8f0',
    materialId: 'mat-petg',
    finish: 'gloss',
    glossLevel: 85,
    priceModifier: 200,
    isActive: true,
    effects: ['transparent'],
  },
  // ASA Farben
  {
    id: 'col-asa-black',
    name: 'Schwarz',
    hex: '#111111',
    materialId: 'mat-asa',
    finish: 'matt',
    glossLevel: 10,
    priceModifier: 0,
    isActive: true,
  },
  {
    id: 'col-asa-white',
    name: 'Weiß',
    hex: '#eeeeee',
    materialId: 'mat-asa',
    finish: 'matt',
    glossLevel: 15,
    priceModifier: 0,
    isActive: true,
  },
  {
    id: 'col-asa-anthracite',
    name: 'Anthrazit',
    hex: '#2a2a2a',
    materialId: 'mat-asa',
    finish: 'matt',
    glossLevel: 12,
    priceModifier: 250,
    isActive: true,
  },
];

export function getMaterialById(id: string): Material | undefined {
  return materials.find((m) => m.id === id);
}

export function getActiveMaterials(): Material[] {
  return materials.filter((m) => m.isActive);
}

export function getColorById(id: string): ProductColor | undefined {
  return colors.find((c) => c.id === id);
}

export function getColorsForMaterial(materialId: string): ProductColor[] {
  return colors.filter((c) => c.materialId === materialId && c.isActive);
}
