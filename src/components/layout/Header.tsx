import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Shield } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '../../stores/cartStore';
import './Header.css';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const itemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);

  const isAdmin = location.pathname.startsWith('/admin');

  const navLinks = [
    { to: '/', label: 'Start' },
    { to: '/produkte', label: 'Produkte' },
    { to: '/konfigurator/mailbox-sign', label: 'Konfigurator' },
  ];

  return (
    <header className="header">
      <div className="header__inner container container-wide">
        <Link to="/" className="header__logo">
          <div className="header__logo-icon">
            <Shield size={20} />
          </div>
          <span className="header__logo-text">SchildWerk</span>
        </Link>

        <nav className={`header__nav ${mobileOpen ? 'header__nav--open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`header__link ${location.pathname === link.to ? 'header__link--active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {mobileOpen && (
            <Link
              to="/admin"
              className="header__link header__link--admin"
              onClick={() => setMobileOpen(false)}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="header__actions">
          {!isAdmin && (
            <button
              className="header__cart-btn btn btn-icon"
              onClick={openCart}
              aria-label="Warenkorb öffnen"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="header__cart-badge">{itemCount}</span>
              )}
            </button>
          )}
          <Link to="/admin" className="header__admin-link btn btn-ghost btn-sm">
            Admin
          </Link>
          <button
            className="header__menu-btn btn btn-icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="header__overlay" onClick={() => setMobileOpen(false)} />
      )}
    </header>
  );
}
