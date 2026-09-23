import type {
  Order,
  OrderItem,
  ProductionStatus,
  ProductConfiguration,
  Customer,
} from '../types';
import { generateId, generateOrderNumber } from '../utils/id';
import { pricingService } from './PricingService';
import { seedOrders } from '../data/seed';

/**
 * Bestellverwaltungs-Service.
 *
 * Im MVP werden Bestellungen im Speicher gehalten.
 * Später wird dieser Service durch eine Datenbank-Anbindung ersetzt.
 */
export class OrderService {
  private orders: Order[] = [...seedOrders];

  getAllOrders(): Order[] {
    return [...this.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id);
  }

  getOrderByNumber(orderNumber: string): Order | undefined {
    return this.orders.find((o) => o.orderNumber === orderNumber);
  }

  createOrder(
    customer: Customer,
    configurations: { config: ProductConfiguration; quantity: number }[]
  ): Order {
    const items: OrderItem[] = configurations.map(({ config, quantity }) => {
      const pricing = pricingService.calculatePrice(config);
      return {
        id: generateId(),
        configuration: config,
        quantity,
        unitPrice: pricing.total,
        totalPrice: pricing.total * quantity,
        generatedAssets: [],
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const shipping = pricingService.getShippingCost();
    const tax = Math.round(subtotal * pricingService.getTaxRate());

    const order: Order = {
      id: generateId(),
      orderNumber: generateOrderNumber(),
      createdAt: new Date().toISOString(),
      customer,
      items,
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping,
      paymentStatus: 'pending',
      productionStatus: 'paid',
      shippingStatus: 'pending',
    };

    this.orders.push(order);
    return order;
  }

  updateProductionStatus(orderId: string, status: ProductionStatus): boolean {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return false;
    order.productionStatus = status;
    if (status === 'shipped') {
      order.shippingStatus = 'shipped';
    } else if (status === 'completed') {
      order.shippingStatus = 'delivered';
    }
    return true;
  }

  updatePaymentStatus(orderId: string, status: Order['paymentStatus']): boolean {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return false;
    order.paymentStatus = status;
    return true;
  }

  getOrderCount(): number {
    return this.orders.length;
  }

  getRevenueTotal(): number {
    return this.orders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.total, 0);
  }

  getOrdersByStatus(status: ProductionStatus): Order[] {
    return this.orders.filter((o) => o.productionStatus === status);
  }
}

export const orderService = new OrderService();
