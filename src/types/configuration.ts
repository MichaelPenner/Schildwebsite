import type { ProductType } from './product';

export type TextAlignment = 'left' | 'center' | 'right';

export interface TextLayerConfig {
  id: string;
  text: string;
  fontSize: number;
  alignment: TextAlignment;
  letterSpacing: number;
  colorId: string;
}

export interface ProductConfiguration {
  id: string;
  productId: string;
  productType: ProductType;
  width: number;  // mm
  height: number; // mm
  depth: number;  // mm
  textLayers: TextLayerConfig[];
  materialId: string;
  baseColorId: string;
  fontId: string;
  qrEnabled: boolean;
  qrUrl?: string;
  nfcEnabled: boolean;
  nfcUrl?: string;
}
