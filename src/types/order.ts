import type { Customer } from './customer';
import type { ProductConfiguration } from './configuration';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type ShippingStatus = 'pending' | 'shipped' | 'delivered';
export type ProductionStatus =
  | 'paid'
  | 'in-production'
  | 'printing'
  | 'printed'
  | 'shipped'
  | 'completed';

export type GeneratedAssetType = 'glb' | '3mf' | 'qr';

export interface GeneratedAsset {
  id: string;
  type: GeneratedAssetType;
  path: string;
  createdAt: string;
  configurationId: string;
}

export interface OrderItem {
  id: string;
  configuration: ProductConfiguration;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  generatedAssets: GeneratedAsset[];
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentStatus: PaymentStatus;
  productionStatus: ProductionStatus;
  shippingStatus: ShippingStatus;
  trackingNumber?: string;
  notes?: string;
}
