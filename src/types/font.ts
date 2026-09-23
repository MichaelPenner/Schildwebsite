export interface FontDefinition {
  id: string;
  name: string;
  displayName: string;
  cssFamily: string;
  typefaceUrl: string; // URL to typeface JSON for Three.js
  isActive: boolean;
  category: 'sans-serif' | 'serif' | 'display' | 'monospace';
}
