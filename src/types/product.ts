export type ProductType = 'mailbox-sign' | 'keychain';

export interface ProductConstraints {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  minDepth: number;
  maxDepth: number;
  maxTextLength: number;
  maxLayers: number;
  supportsQR: boolean;
  supportsNFC: boolean;
}

export interface Product {
  id: string;
  type: ProductType;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  basePrice: number; // in Cent
  isActive: boolean;
  thumbnail: string;
  features: string[];
  constraints: ProductConstraints;
  defaultWidth: number;
  defaultHeight: number;
  defaultDepth: number;
}
