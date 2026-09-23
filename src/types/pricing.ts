export interface PriceLineItem {
  label: string;
  amount: number; // Cent
}

export interface PriceBreakdown {
  basePrice: number;
  sizeModifier: number;
  materialModifier: number;
  colorModifier: number;
  qrModifier: number;
  nfcModifier: number;
  layerModifier: number;
  subtotal: number;
  tax: number;
  total: number;
  lineItems: PriceLineItem[];
}
