import type { ProductConfiguration } from './configuration';

export interface CartItem {
  id: string;
  configuration: ProductConfiguration;
  quantity: number;
  unitPrice: number; // Cent
  addedAt: string;
}
