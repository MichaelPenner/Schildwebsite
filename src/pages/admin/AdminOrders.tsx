import { useAdminStore } from '../../stores/adminStore';
import { formatPrice, formatDate } from '../../utils/formatting';
import { getProductById } from '../../data/products';
import type { ProductionStatus } from '../../types';
import { Eye, Download, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const STATUS_LABELS: Record<ProductionStatus, string> = {
  paid: 'Bezahlt',
  'in-production': 'In Produktion',
  printing: '3D-Druck läuft',
  printed: 'Gedruckt',
  shipped: 'Versendet',
  completed: 'Abgeschlossen',
};

const STATUS_BADGE: Record<ProductionStatus, string> = {
  paid: 'badge-accent',
  'in-production': 'badge-blue',
  printing: 'badge-purple',
  printed: 'badge-green',
  shipped: 'badge-blue',
  completed: 'badge-green',
};

const STATUSES: ProductionStatus[] = [
  'paid', 'in-production', 'printing', 'printed', 'shipped', 'completed',
];

export default function AdminOrders() {
  const { orders, updateOrderStatus, selectedOrderId, selectOrder } = useAdminStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const selectedOrder = selectedOrderId
    ? orders.find((o) => o.id === selectedOrderId)
    : null;

  return (
    <div className="admin-page">
      <h1 className="heading-2">Bestellungen</h1>
      <p className="text-secondary admin-page__subtitle">
        {orders.length} Bestellung{orders.length !== 1 ? 'en' : ''}
      </p>

      <div className="admin-table-wrap glass-card-static">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Bestellnr.</th>
              <th>Datum</th>
              <th>Kunde</th>
              <th>Produkt</th>
              <th>Betrag</th>
              <th>Zahlung</th>
              <th>Status</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <>
                <tr key={order.id} className={expandedId === order.id ? 'admin-table__row--expanded' : ''}>
                  <td><strong>{order.orderNumber}</strong></td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    {order.customer.billingAddress.firstName}{' '}
                    {order.customer.billingAddress.lastName}
                  </td>
                  <td>
                    {order.items.map((item) => {
                      const p = getProductById(item.configuration.productId);
                      return p?.name;
                    }).join(', ')}
                  </td>
                  <td className="text-accent"><strong>{formatPrice(order.total)}</strong></td>
                  <td>
                    <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-green' : 'badge-accent'}`}>
                      {order.paymentStatus === 'paid' ? 'Bezahlt' : 'Ausstehend'}
                    </span>
                  </td>
                  <td>
                    <select
                      className="admin-status-select"
                      value={order.productionStatus}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as ProductionStatus)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button
                        className="btn btn-icon btn-ghost btn-sm"
                        onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                        title="Details"
                      >
                        <ChevronDown size={16} style={{
                          transform: expandedId === order.id ? 'rotate(180deg)' : 'rotate(0)',
                          transition: 'transform 0.2s',
                        }} />
                      </button>
                      <button className="btn btn-icon btn-ghost btn-sm" title="3MF herunterladen">
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedId === order.id && (
                  <tr key={`${order.id}-detail`} className="admin-table__detail-row">
                    <td colSpan={8}>
                      <div className="order-detail">
                        {order.items.map((item) => (
                          <div key={item.id} className="order-detail__config">
                            <h4>Konfiguration</h4>
                            <div className="order-detail__grid">
                              <span className="text-secondary">Typ:</span>
                              <span>{item.configuration.productType}</span>
                              <span className="text-secondary">Maße:</span>
                              <span>
                                {item.configuration.width}×{item.configuration.height}×
                                {item.configuration.depth} mm
                              </span>
                              <span className="text-secondary">Text:</span>
                              <span>
                                {item.configuration.textLayers.map((l) => l.text).join(' · ')}
                              </span>
                              <span className="text-secondary">Material:</span>
                              <span>{item.configuration.materialId}</span>
                              <span className="text-secondary">Schrift:</span>
                              <span>{item.configuration.fontId}</span>
                              {item.configuration.qrEnabled && (
                                <>
                                  <span className="text-secondary">QR-URL:</span>
                                  <span>{item.configuration.qrUrl}</span>
                                </>
                              )}
                              {item.configuration.nfcEnabled && (
                                <>
                                  <span className="text-secondary">NFC-URL:</span>
                                  <span>{item.configuration.nfcUrl}</span>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="order-detail__customer">
                          <h4>Kunde</h4>
                          <p>
                            {order.customer.billingAddress.firstName}{' '}
                            {order.customer.billingAddress.lastName}<br />
                            {order.customer.billingAddress.street}{' '}
                            {order.customer.billingAddress.houseNumber}<br />
                            {order.customer.billingAddress.zip}{' '}
                            {order.customer.billingAddress.city}
                          </p>
                          <p className="text-secondary">{order.customer.email}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
