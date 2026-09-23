import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/OrderService';
import { formatPrice, formatDate } from '../utils/formatting';
import { getProductById } from '../data/products';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import './OrderConfirmationPage.css';

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const order = id ? orderService.getOrderById(id) : undefined;

  if (!order) {
    return (
      <div className="order-confirm section">
        <div className="container">
          <div className="glass-card-static" style={{ textAlign: 'center', padding: '64px' }}>
            <h2 className="heading-3">Bestellung nicht gefunden</h2>
            <p className="text-secondary">Die Bestellung existiert nicht oder wurde noch nicht verarbeitet.</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '24px' }}>
              Zur Startseite
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirm section">
      <div className="container">
        <div className="order-confirm__hero glass-card-static animate-scale-in">
          <CheckCircle2 size={56} className="text-accent" strokeWidth={1.5} />
          <h1 className="heading-2">Vielen Dank für deine Bestellung!</h1>
          <p className="text-secondary">
            Deine Bestellung <strong>{order.orderNumber}</strong> wurde erfolgreich aufgegeben.
          </p>
        </div>

        <div className="order-confirm__details glass-card-static">
          <h3 className="heading-3">Bestelldetails</h3>
          <div className="order-confirm__grid">
            <div>
              <span className="text-secondary">Bestellnummer</span>
              <strong>{order.orderNumber}</strong>
            </div>
            <div>
              <span className="text-secondary">Datum</span>
              <strong>{formatDate(order.createdAt)}</strong>
            </div>
            <div>
              <span className="text-secondary">Status</span>
              <span className="badge badge-green">Bezahlt</span>
            </div>
            <div>
              <span className="text-secondary">Gesamt</span>
              <strong className="text-accent">{formatPrice(order.total)}</strong>
            </div>
          </div>

          <h4 style={{ marginTop: '24px' }}>Artikel</h4>
          {order.items.map((item) => {
            const product = getProductById(item.configuration.productId);
            return (
              <div key={item.id} className="order-confirm__item">
                <Package size={20} />
                <div>
                  <strong>{product?.name}</strong>
                  <p className="text-secondary">
                    {item.configuration.textLayers.map((l) => l.text).join(' · ')} ·{' '}
                    {item.configuration.width}×{item.configuration.height} mm
                  </p>
                </div>
                <span>×{item.quantity}</span>
                <span className="text-accent">{formatPrice(item.totalPrice)}</span>
              </div>
            );
          })}
        </div>

        <div className="order-confirm__actions">
          <Link to="/" className="btn btn-secondary">
            Zur Startseite
          </Link>
          <Link to="/konfigurator/mailbox-sign" className="btn btn-primary">
            Weiteres Produkt gestalten <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
