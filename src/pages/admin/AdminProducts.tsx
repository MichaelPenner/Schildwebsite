import { useAdminStore } from '../../stores/adminStore';
import { Check, X } from 'lucide-react';
import { products } from '../../data/products';

export default function AdminProducts() {
  return (
    <div className="admin-page">
      <h1 className="heading-2">Produkte</h1>
      <p className="text-secondary admin-page__subtitle">Produktverwaltung</p>

      <div className="admin-cards">
        {products.map((product) => (
          <div key={product.id} className="admin-material-card glass-card-static">
            <div className="admin-material-card__header">
              <h4>{product.name}</h4>
              <span className={`badge ${product.isActive ? 'badge-green' : 'badge-red'}`}>
                {product.isActive ? 'Aktiv' : 'Inaktiv'}
              </span>
            </div>
            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
              {product.shortDescription}
            </p>
            <div className="admin-material-card__props" style={{ marginTop: '12px' }}>
              <div>
                <span className="text-secondary">Grundpreis:</span>{' '}
                <strong className="text-accent">{(product.basePrice / 100).toFixed(2).replace('.', ',')} €</strong>
              </div>
              <div>
                <span className="text-secondary">Maße (min/max):</span>{' '}
                {product.constraints.minWidth}–{product.constraints.maxWidth} ×{' '}
                {product.constraints.minHeight}–{product.constraints.maxHeight} mm
              </div>
              <div>
                <span className="text-secondary">Max. Text:</span>{' '}
                {product.constraints.maxTextLength} Zeichen
              </div>
              <div>
                <span className="text-secondary">Ebenen:</span>{' '}
                {product.constraints.maxLayers}
              </div>
              <div>
                <span className="text-secondary">QR-Code:</span>{' '}
                {product.constraints.supportsQR ? <Check size={14} style={{ color: 'var(--color-success)' }} /> : <X size={14} />}
              </div>
              <div>
                <span className="text-secondary">NFC:</span>{' '}
                {product.constraints.supportsNFC ? <Check size={14} style={{ color: 'var(--color-success)' }} /> : <X size={14} />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
