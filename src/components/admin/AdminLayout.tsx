import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Palette,
  Type,
  ArrowLeft,
} from 'lucide-react';
import './AdminLayout.css';

const navItems = [
  { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard', exact: true },
  { to: '/admin/bestellungen', icon: <ShoppingBag size={18} />, label: 'Bestellungen' },
  { to: '/admin/produkte', icon: <Package size={18} />, label: 'Produkte' },
  { to: '/admin/materialien', icon: <Palette size={18} />, label: 'Materialien & Farben' },
  { to: '/admin/schriftarten', icon: <Type size={18} />, label: 'Schriftarten' },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <Link to="/" className="admin-sidebar__back btn btn-ghost btn-sm">
            <ArrowLeft size={16} /> Zum Shop
          </Link>
          <h2 className="admin-sidebar__title">Admin</h2>
        </div>
        <nav className="admin-sidebar__nav">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`admin-nav-item ${isActive ? 'admin-nav-item--active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
