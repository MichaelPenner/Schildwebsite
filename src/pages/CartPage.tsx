import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { formatPrice } from '../utils/formatting';
import { getProductById } from '../data/products';
import { getColorById, getMaterialById } from '../data/materials';
import { getFontById } from '../data/fonts';
import './CartPage.css';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getShipping, getTotal } =
    useCartStore();

  if (items.length === 0) {
    return (
      <div className="cart-page section">
        <div className="container">
          <div className="cart-empty glass-card-static">
            <ShoppingBag size={56} strokeWidth={1} />
            <h2 className="heading-3">Dein Warenkorb ist leer</h2>
            <p className="text-secondary">
              Entdecke unsere Produkte und gestalte dein individuelles Namensschild.
            </p>
            <Link to="/produkte" className="btn btn-primary btn-lg">
              Produkte entdecken
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page section">
      <div className="container">
        <h1 className="heading-2">Warenkorb</h1>

        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => {
              const product = getProductById(item.configuration.productId);
              const material = getMaterialById(item.configuration.materialId);
              const baseColor = getColorById(item.configuration.baseColorId);
              const font = getFontById(item.configuration.fontId);

              return (
                <div key={item.id} className="cart-full-item glass-card-static">
                  <div className="cart-full-item__visual">
                    <div
                      className="cart-full-item__swatch"
                      style={{ background: baseColor?.hex ?? '#333' }}
                    >
                      <span>{item.configuration.textLayers[0]?.text?.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="cart-full-item__details">
                    <h3>{product?.name}</h3>
                    <div className="cart-full-item__config-grid">
                      <span className="text-secondary">Text:</span>
                      <span>
                        {item.configuration.textLayers.map((l) => l.text).join(' · ')}
                      </span>
                      <span className="text-secondary">Maße:</span>
                      <span>
                        {item.configuration.width}×{item.configuration.height}×
                        {item.configuration.depth} mm
                      </span>
                      <span className="text-secondary">Material:</span>
                      <span>{material?.name}</span>
                      <span className="text-secondary">Farbe:</span>
                      <span>{baseColor?.name}</span>
                      <span className="text-secondary">Schrift:</span>
                      <span>{font?.displayName}</span>
                      {item.configuration.qrEnabled && (
                        <>
                          <span className="text-secondary">QR-Code:</span>
                          <span>{item.configuration.qrUrl}</span>
                        </>
                      )}
                      {item.configuration.nfcEnabled && (
                        <>
                          <span className="text-secondary">NFC:</span>
                          <span>{item.configuration.nfcUrl}</span>
                        </>
                      )}
                    </div>
                    <div className="cart-full-item__bottom">
                      <div className="cart-full-item__qty">
                        <button
                          className="btn btn-icon btn-sm btn-secondary"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="cart-full-item__qty-val">{item.quantity}</span>
                        <button
                          className="btn btn-icon btn-sm btn-secondary"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="cart-full-item__price text-accent">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={16} /> Entfernen
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary glass-card-static">
            <h3 className="heading-3">Zusammenfassung</h3>
            <div className="cart-summary__lines">
              <div className="cart-summary__line">
                <span className="text-secondary">Zwischensumme</span>
                <span>{formatPrice(getSubtotal())}</span>
              </div>
              <div className="cart-summary__line">
                <span className="text-secondary">Versand</span>
                <span>{formatPrice(getShipping())}</span>
              </div>
              <div className="cart-summary__line cart-summary__line--total">
                <span>Gesamt</span>
                <span className="text-accent">{formatPrice(getTotal())}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn btn-primary btn-lg cart-summary__cta">
              Zur Kasse <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
