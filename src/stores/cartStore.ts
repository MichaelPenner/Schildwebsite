import { create } from 'zustand';
import type { CartItem, ProductConfiguration } from '../types';
import { generateId } from '../utils/id';
import { pricingService } from '../services/PricingService';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (config: ProductConfiguration, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getShipping: () => number;
  getTax: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (config: ProductConfiguration, quantity = 1) => {
    const pricing = pricingService.calculatePrice(config);
    const newItem: CartItem = {
      id: generateId(),
      configuration: { ...config },
      quantity,
      unitPrice: pricing.total,
      addedAt: new Date().toISOString(),
    };
    set((state) => ({ items: [...state.items, newItem], isOpen: true }));
  },

  removeItem: (itemId: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }));
  },

  updateQuantity: (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    }));
  },

  clearCart: () => set({ items: [] }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getSubtotal: () => {
    return get().items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
  },

  getShipping: () => {
    return get().items.length > 0 ? pricingService.getShippingCost() : 0;
  },

  getTax: () => {
    const subtotal = get().getSubtotal();
    return Math.round(subtotal * pricingService.getTaxRate());
  },

  getTotal: () => {
    return get().getSubtotal() + get().getShipping();
  },
}));
