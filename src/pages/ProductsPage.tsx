import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getActiveProducts } from '../data/products';
import StaticViewer from '../components/viewer/StaticViewer';
import type { ProductConfiguration } from '../types';
import './ProductsPage.css';

function getMockConfig(type: 'mailbox-sign' | 'keychain'): ProductConfiguration {
  return {
    productType: type,
    width: type === 'mailbox-sign' ? 180 : 50,
    height: type === 'mailbox-sign' ? 45 : 50,
    depth: 3,
    baseMaterialId: 'mat-pla-basic',
    baseColorId: type === 'keychain' ? 'col-pla-gold' : 'col-pla-white',
    fontId: 'font-helvetica',
    textLayers: type === 'mailbox-sign' ? [
      { id: 'l1', text: 'Dr. M. Schneider', fontSize: 18, yOffset: 6, colorId: 'col-pla-gold', materialId: 'mat-pla-basic' },
      { id: 'l2', text: 'Praxis · 1. OG', fontSize: 12, yOffset: -8, colorId: 'col-pla-gold', materialId: 'mat-pla-basic' }
    ] : [
      { id: 'l1', text: 'Max W.', fontSize: 12, yOffset: 0, colorId: 'col-pla-white', materialId: 'mat-pla-basic' }
    ],
    qrEnabled: type === 'keychain',
    qrUrl: type === 'keychain' ? 'https://google.com' : '',
    nfcEnabled: false,
    mountingOption: 'none',
  };
}

export default function ProductsPage() {
  const products = getActiveProducts();

  return (
    <div className="products-page section">
      <div className="container">
        <div className="section-header">
          <p className="overline">Alle Produkte</p>
          <h1 className="heading-2">Unsere 3D-Druck Produkte</h1>
        </div>

        <div className="products-list">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/konfigurator/${product.type}`}
              className="product-detail-card glass-card"
            >
              <div className="product-detail-card__visual" style={{ padding: 0, height: '320px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <StaticViewer configuration={getMockConfig(product.type as any)} />
              </div>
              <div className="product-detail-card__content">
                <span className="badge badge-accent">
                  {product.type === 'mailbox-sign' ? 'Bestseller' : 'Neu'}
                </span>
                <h2 className="product-detail-card__title">{product.name}</h2>
                <p className="product-detail-card__desc text-secondary">
                  {product.description}
                </p>
                <ul className="product-detail-card__features">
                  {product.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <div className="product-detail-card__footer">
                  <span className="product-detail-card__price text-accent">
                    ab {(product.basePrice / 100).toFixed(2).replace('.', ',')} €
                  </span>
                  <span className="btn btn-primary">
                    Jetzt gestalten <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
