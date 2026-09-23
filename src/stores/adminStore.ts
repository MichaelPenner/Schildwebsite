import { create } from 'zustand';
import type { Order, ProductionStatus, Material, ProductColor, FontDefinition } from '../types';
import { orderService } from '../services/OrderService';
import { materials as initialMaterials, colors as initialColors } from '../data/materials';
import { fonts as initialFonts } from '../data/fonts';

interface AdminState {
  orders: Order[];
  materials: Material[];
  colors: ProductColor[];
  fonts: FontDefinition[];
  selectedOrderId: string | null;
  refreshOrders: () => void;
  selectOrder: (id: string | null) => void;
  updateOrderStatus: (orderId: string, status: ProductionStatus) => void;
  toggleMaterial: (materialId: string) => void;
  toggleColor: (colorId: string) => void;
  toggleFont: (fontId: string) => void;
  updateColor: (colorId: string, updates: Partial<ProductColor>) => void;
  addColor: (color: ProductColor) => void;
  getStats: () => { orders: number; revenue: number; pending: number; printing: number };
}

export const useAdminStore = create<AdminState>((set, get) => ({
  orders: orderService.getAllOrders(),
  materials: [...initialMaterials],
  colors: [...initialColors],
  fonts: [...initialFonts],
  selectedOrderId: null,

  refreshOrders: () => {
    set({ orders: orderService.getAllOrders() });
  },

  selectOrder: (id: string | null) => {
    set({ selectedOrderId: id });
  },

  updateOrderStatus: (orderId: string, status: ProductionStatus) => {
    orderService.updateProductionStatus(orderId, status);
    set({ orders: orderService.getAllOrders() });
  },

  toggleMaterial: (materialId: string) => {
    set((state) => ({
      materials: state.materials.map((m) =>
        m.id === materialId ? { ...m, isActive: !m.isActive } : m
      ),
    }));
  },

  toggleColor: (colorId: string) => {
    set((state) => ({
      colors: state.colors.map((c) =>
        c.id === colorId ? { ...c, isActive: !c.isActive } : c
      ),
    }));
  },

  toggleFont: (fontId: string) => {
    set((state) => ({
      fonts: state.fonts.map((f) =>
        f.id === fontId ? { ...f, isActive: !f.isActive } : f
      ),
    }));
  },

  updateColor: (colorId: string, updates: Partial<ProductColor>) => {
    set((state) => ({
      colors: state.colors.map((c) =>
        c.id === colorId ? { ...c, ...updates } : c
      ),
    }));
  },

  addColor: (color: ProductColor) => {
    set((state) => ({
      colors: [...state.colors, color],
    }));
  },

  getStats: () => {
    const orders = get().orders;
    return {
      orders: orders.length,
      revenue: orders
        .filter((o) => o.paymentStatus === 'paid')
        .reduce((s, o) => s + o.total, 0),
      pending: orders.filter((o) => o.productionStatus === 'paid').length,
      printing: orders.filter(
        (o) =>
          o.productionStatus === 'printing' ||
          o.productionStatus === 'in-production'
      ).length,
    };
  },
}));
