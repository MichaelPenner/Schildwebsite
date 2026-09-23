export type FinishType = 'matt' | 'satin' | 'gloss';

export interface Material {
  id: string;
  name: string;
  description: string;
  density?: number; // g/cm³
  priceModifier: number; // Cent
  isActive: boolean;
  availableColorIds: string[];
  properties?: Record<string, string>;
}

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  materialId: string;
  finish: FinishType;
  glossLevel: number; // 0-100
  priceModifier: number; // Cent
  isActive: boolean;
  effects?: string[];
}
