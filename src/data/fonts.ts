import type { FontDefinition } from '../types';

/**
 * Verfügbare Schriftarten.
 * typefaceUrl verweist auf konvertierte Typeface-JSON-Dateien
 * für die Three.js TextGeometry.
 *
 * Für den MVP verwenden wir die von Three.js bereitgestellten
 * Standard-Typeface-Fonts aus dem CDN. In der Produktion sollten
 * diese lokal gehostet werden.
 */
const THREE_FONTS_CDN =
  'https://cdn.jsdelivr.net/npm/three@0.175.0/examples/fonts';

export const fonts: FontDefinition[] = [
  {
    id: 'font-helvetiker',
    name: 'helvetiker',
    displayName: 'Helvetica',
    cssFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    typefaceUrl: `${THREE_FONTS_CDN}/droid/droid_sans_regular.typeface.json`,
    isActive: true,
    category: 'sans-serif',
  },
  {
    id: 'font-helvetiker-bold',
    name: 'helvetiker-bold',
    displayName: 'Helvetica Bold',
    cssFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    typefaceUrl: `${THREE_FONTS_CDN}/droid/droid_sans_bold.typeface.json`,
    isActive: true,
    category: 'sans-serif',
  },
  {
    id: 'font-optimer',
    name: 'optimer',
    displayName: 'Optimer',
    cssFamily: "'Optima', 'Segoe UI', sans-serif",
    typefaceUrl: `${THREE_FONTS_CDN}/optimer_regular.typeface.json`,
    isActive: true,
    category: 'sans-serif',
  },
  {
    id: 'font-optimer-bold',
    name: 'optimer-bold',
    displayName: 'Optimer Bold',
    cssFamily: "'Optima', 'Segoe UI', sans-serif",
    typefaceUrl: `${THREE_FONTS_CDN}/optimer_bold.typeface.json`,
    isActive: true,
    category: 'sans-serif',
  },
  {
    id: 'font-gentilis',
    name: 'gentilis',
    displayName: 'Gentilis',
    cssFamily: "'Times New Roman', Georgia, serif",
    typefaceUrl: `${THREE_FONTS_CDN}/gentilis_regular.typeface.json`,
    isActive: true,
    category: 'serif',
  },
  {
    id: 'font-gentilis-bold',
    name: 'gentilis-bold',
    displayName: 'Gentilis Bold',
    cssFamily: "'Times New Roman', Georgia, serif",
    typefaceUrl: `${THREE_FONTS_CDN}/gentilis_bold.typeface.json`,
    isActive: true,
    category: 'serif',
  },
  {
    id: 'font-droid-sans',
    name: 'droid-sans',
    displayName: 'Droid Sans',
    cssFamily: "'Droid Sans', 'Roboto', sans-serif",
    typefaceUrl: `${THREE_FONTS_CDN}/droid/droid_sans_regular.typeface.json`,
    isActive: true,
    category: 'sans-serif',
  },
  {
    id: 'font-droid-sans-bold',
    name: 'droid-sans-bold',
    displayName: 'Droid Sans Bold',
    cssFamily: "'Droid Sans', 'Roboto', sans-serif",
    typefaceUrl: `${THREE_FONTS_CDN}/droid/droid_sans_bold.typeface.json`,
    isActive: true,
    category: 'sans-serif',
  },
  {
    id: 'font-droid-serif',
    name: 'droid-serif',
    displayName: 'Droid Serif',
    cssFamily: "'Droid Serif', Georgia, serif",
    typefaceUrl: `${THREE_FONTS_CDN}/droid/droid_serif_regular.typeface.json`,
    isActive: true,
    category: 'serif',
  },
];

export function getFontById(id: string): FontDefinition | undefined {
  return fonts.find((f) => f.id === id);
}

export function getActiveFonts(): FontDefinition[] {
  return fonts.filter((f) => f.isActive);
}
