import { Link } from 'react-router-dom';
import { ArrowRight, Box, Palette, Truck, Shield } from 'lucide-react';
import { getActiveProducts } from '../data/products';
import StaticViewer from '../components/viewer/StaticViewer';
import type { ProductConfiguration } from '../types';
import './HomePage.css';

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

const steps = [
  {
    icon: <Box size={24} />,
    title: 'Produkt wählen',
    description: 'Namensschild oder Schlüsselanhänger auswählen.',
  },
  {
    icon: <Palette size={24} />,
    title: 'Personalisieren',
    description: 'Text, Material, Farbe und Extras konfigurieren.',
  },
  {
    icon: <Shield size={24} />,
    title: '3D-Vorschau',
    description: 'Dein Produkt live in 3D betrachten.',
  },
  {
    icon: <Truck size={24} />,
    title: 'Lieferung',
    description: '3D-gedruckt und direkt zu dir nach Hause.',
  },
];

export default function HomePage() {
  const products = getActiveProducts();

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero__content animate-fade-in-up">
            <p className="overline">—— Handgefertigt in Deutschland</p>
            <h1 className="hero__title heading-display">
              Dein Name.<br />
              <span className="text-accent">Perfekt in Form.</span>
            </h1>
            <p className="hero__subtitle">
              3D-gedruckt. Individuell. Bleibend.
            </p>
            <div className="hero__actions">
              <Link
                to="/konfigurator/mailbox-sign"
                className="btn btn-primary btn-lg"
              >
                Jetzt gestalten <ArrowRight size={18} />
              </Link>
              <a href="#how-it-works" className="btn btn-ghost btn-lg">
                So funktioniert's <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
        <div className="hero__glow" />
      </section>

      {/* Products */}
      <section className="section" id="products">
        <div className="container">
          <div className="section-header">
            <p className="overline">Unsere Produkte</p>
            <h2 className="heading-2">Einzigartig wie du</h2>
          </div>
          <div className="product-grid">
            {products.map((product, i) => (
              <Link
                key={product.id}
                to={`/konfigurator/${product.type}`}
                className={`product-card glass-card animate-fade-in-up stagger-${i + 1}`}
              >
                <div className="product-card__visual" style={{ padding: 0, height: '260px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <StaticViewer configuration={getMockConfig(product.type as any)} />
                </div>
                <div className="product-card__info">
                  <h3 className="product-card__name">{product.name}</h3>
                  <p className="product-card__desc text-secondary">
                    {product.shortDescription}
                  </p>
                  <div className="product-card__footer">
                    <span className="product-card__price text-accent">
                      ab {(product.basePrice / 100).toFixed(2).replace('.', ',')} €
                    </span>
                    <span className="product-card__cta">
                      Gestalten <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <p className="overline">So einfach geht's</p>
            <h2 className="heading-2">In 4 Schritten zum Produkt</h2>
          </div>
          <div className="steps-grid">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`step-card glass-card-static animate-fade-in-up stagger-${i + 1}`}
              >
                <div className="step-card__icon">{step.icon}</div>
                <div className="step-card__number">{i + 1}</div>
                <h3 className="step-card__title">{step.title}</h3>
                <p className="step-card__desc text-secondary">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-box glass-card-static">
            <h2 className="heading-2">Bereit für dein Namensschild?</h2>
            <p className="text-secondary cta-box__text">
              Gestalte jetzt dein individuelles 3D-gedrucktes Produkt.
              Einfach konfigurieren, bestellen, freuen.
            </p>
            <Link to="/konfigurator/mailbox-sign" className="btn btn-primary btn-lg">
              Jetzt starten <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
