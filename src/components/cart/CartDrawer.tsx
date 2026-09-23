import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { formatPrice } from '../../utils/formatting';
import { getProductById } from '../../data/products';
import { getColorById } from '../../data/materials';
import { Link } from 'react-router-dom';
import './CartDrawer.css';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getShipping, getTotal } =
    useCartStore();

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={closeCart} />
      <div className="cart-drawer animate-slide-in-right">
        <div className="cart-drawer__header">
          <h2 className="heading-3">Warenkorb</h2>
          <button className="btn btn-icon btn-ghost" onClick={closeCart} aria-label="Schließen">
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <ShoppingBag size={48} strokeWidth={1} />
            <p>Dein Warenkorb ist leer</p>
            <Link to="/produkte" className="btn btn-primary" onClick={closeCart}>
              Produkte entdecken
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-drawer__items">
              {items.map((item) => {
                const product = getProductById(item.configuration.productId);
                const baseColor = getColorById(item.configuration.baseColorId);
                return (
                  <div key={item.id} className="cart-item glass-card-static">
                    <div className="cart-item__preview">
                      <div
                        className="cart-item__color-swatch"
                        style={{ background: baseColor?.hex ?? '#333' }}
                      />
                    </div>
                    <div className="cart-item__info">
                      <h4 className="cart-item__name">{product?.name}</h4>
                      <p className="cart-item__config text-secondary">
                        {item.configuration.textLayers[0]?.text}
                        {item.configuration.textLayers[1] &&
                          ` · ${item.configuration.textLayers[1].text}`}
                      </p>
                      <p className="cart-item__dims text-secondary">
                        {item.configuration.width}×{item.configuration.height} mm
                      </p>
                      <div className="cart-item__bottom">
                        <div className="cart-item__qty">
                          <button
                            className="btn btn-icon btn-sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label="Weniger"
                          >
                            <Minus size={14} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            className="btn btn-icon btn-sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Mehr"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="cart-item__price">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                    <button
                      className="cart-item__remove btn btn-icon btn-ghost btn-sm"
                      onClick={() => removeItem(item.id)}
                      aria-label="Entfernen"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="cart-drawer__footer">
              <div className="cart-drawer__totals">
                <div className="cart-drawer__total-row">
                  <span className="text-secondary">Zwischensumme</span>
                  <span>{formatPrice(getSubtotal())}</span>
                </div>
                <div className="cart-drawer__total-row">
                  <span className="text-secondary">Versand</span>
                  <span>{formatPrice(getShipping())}</span>
                </div>
                <div className="cart-drawer__total-row cart-drawer__total-row--final">
                  <span>Gesamt</span>
                  <span className="text-accent">{formatPrice(getTotal())}</span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="btn btn-primary btn-lg cart-drawer__checkout-btn"
                onClick={closeCart}
              >
                Zur Kasse
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
