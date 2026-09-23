import type { Product } from '../types';

export const products: Product[] = [
  {
    id: 'prod-mailbox-sign',
    type: 'mailbox-sign',
    name: 'Briefkasten-Namensschild',
    slug: 'briefkasten-namensschild',
    description:
      'Hochwertiges, personalisiertes Namensschild für Ihren Briefkasten. 3D-gedruckt aus robustem Material mit zwei individuell gestaltbaren Textebenen. Abgerundete Enden und modernes Design für einen professionellen ersten Eindruck.',
    shortDescription: '3D-gedrucktes Namensschild mit zwei Textebenen',
    basePrice: 2490, // 24,90 €
    isActive: true,
    thumbnail: '',
    features: [
      'Zwei individuell gestaltbare Textebenen',
      'Verschiedene Materialien & Farben',
      'Abgerundetes, modernes Design',
      'Wetterfest & langlebig',
      'Einfache Montage',
      'Maßanfertigung nach Ihren Wünschen',
    ],
    constraints: {
      minWidth: 80,
      maxWidth: 300,
      minHeight: 25,
      maxHeight: 80,
      minDepth: 2,
      maxDepth: 8,
      maxTextLength: 40,
      maxLayers: 2,
      supportsQR: false,
      supportsNFC: false,
    },
    defaultWidth: 180,
    defaultHeight: 45,
    defaultDepth: 3,
  },
  {
    id: 'prod-keychain',
    type: 'keychain',
    name: 'Schlüsselanhänger',
    slug: 'schluesselanhaenger',
    description:
      'Personalisierter Schlüsselanhänger mit individuellem Text, QR-Code und optionalem NFC-Tag. Perfekt als Geschenk oder für den eigenen Gebrauch. Kompakt, robust und einzigartig.',
    shortDescription: 'Personalisiert mit QR-Code & optionalem NFC',
    basePrice: 1490, // 14,90 €
    isActive: true,
    thumbnail: '',
    features: [
      'Individueller Text & Design',
      'QR-Code mit eigener URL',
      'Optionaler NFC-Tag',
      'Kompaktes, robustes Design',
      'Verschiedene Farben & Materialien',
      'Perfekt als Geschenk',
    ],
    constraints: {
      minWidth: 30,
      maxWidth: 70,
      minHeight: 30,
      maxHeight: 70,
      minDepth: 2,
      maxDepth: 6,
      maxTextLength: 20,
      maxLayers: 1,
      supportsQR: true,
      supportsNFC: true,
    },
    defaultWidth: 50,
    defaultHeight: 50,
    defaultDepth: 3,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductByType(type: string): Product | undefined {
  return products.find((p) => p.type === type);
}

export function getActiveProducts(): Product[] {
  return products.filter((p) => p.isActive);
}
