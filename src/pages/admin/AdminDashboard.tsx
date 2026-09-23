import { useMemo } from 'react';
import { useAdminStore } from '../../stores/adminStore';
import { formatPrice } from '../../utils/formatting';
import { ShoppingBag, TrendingUp, Clock, Printer } from 'lucide-react';
import './AdminPages.css';

export default function AdminDashboard() {
  const orders = useAdminStore((s) => s.orders);

  const stats = useMemo(() => {
    return {
      orders: orders.length,
      revenue: orders
        .filter((o) => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + o.total, 0),
      pending: orders.filter((o) => o.productionStatus === 'paid').length,
      printing: orders.filter(
        (o) =>
          o.productionStatus === 'printing' ||
          o.productionStatus === 'in-production'
      ).length,
    };
  }, [orders]);

  const cards = [
    {
      icon: <ShoppingBag size={20} />,
      label: 'Bestellungen',
      value: stats.orders.toString(),
      color: 'blue',
    },
    {
      icon: <TrendingUp size={20} />,
      label: 'Umsatz',
      value: formatPrice(stats.revenue),
      color: 'green',
    },
    {
      icon: <Clock size={20} />,
      label: 'Ausstehend',
      value: stats.pending.toString(),
      color: 'accent',
    },
    {
      icon: <Printer size={20} />,
      label: 'In Produktion',
      value: stats.printing.toString(),
      color: 'purple',
    },
  ];

  return (
    <div className="admin-page">
      <h1 className="heading-2">Dashboard</h1>
      <p className="text-secondary admin-page__subtitle">Übersicht über deinen Shop</p>

      <div className="admin-stats">
        {cards.map((card) => (
          <div key={card.label} className={`admin-stat glass-card-static admin-stat--${card.color}`}>
            <div className="admin-stat__icon">{card.icon}</div>
            <div>
              <p className="admin-stat__label text-secondary">{card.label}</p>
              <p className="admin-stat__value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-info glass-card-static">
        <h3 className="heading-3">Willkommen im Admin-Bereich</h3>
        <p className="text-secondary">
          Hier kannst du Bestellungen verwalten, Materialien und Farben konfigurieren,
          Schriftarten verwalten und den Produktionsstatus aktualisieren.
        </p>
        <p className="text-secondary" style={{ marginTop: '12px' }}>
          <strong>Hinweis:</strong> Im MVP werden Daten im Speicher gehalten.
          Für die Produktion wird eine Datenbankanbindung integriert.
        </p>
      </div>
    </div>
  );
}
