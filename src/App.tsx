import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import AdminLayout from './components/admin/AdminLayout';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ConfiguratorPage from './pages/ConfiguratorPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminMaterials from './pages/admin/AdminMaterials';
import AdminFonts from './pages/admin/AdminFonts';
import { ImpressumPage, DatenschutzPage } from './pages/LegalPage';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <CartDrawer />
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Shop routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/produkte" element={<ProductsPage />} />
          <Route path="/konfigurator/:productType" element={<ConfiguratorPage />} />
          <Route path="/warenkorb" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/bestellung/:id" element={<OrderConfirmationPage />} />
          <Route path="/impressum" element={<ImpressumPage />} />
          <Route path="/datenschutz" element={<DatenschutzPage />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="bestellungen" element={<AdminOrders />} />
            <Route path="produkte" element={<AdminProducts />} />
            <Route path="materialien" element={<AdminMaterials />} />
            <Route path="schriftarten" element={<AdminFonts />} />
          </Route>
        </Routes>
      </main>
      <Routes>
        {/* Footer only on non-admin pages */}
        <Route path="/admin/*" element={null} />
        <Route path="*" element={<Footer />} />
      </Routes>
    </BrowserRouter>
  );
}
