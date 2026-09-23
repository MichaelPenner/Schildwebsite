import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useConfigStore } from '../stores/configStore';
import ThreeViewer from '../components/viewer/ThreeViewer';
import ProductConfigurator from '../components/configurator/ProductConfigurator';
import { getProductByType } from '../data/products';
import type { ProductType } from '../types';
import './ConfiguratorPage.css';

export default function ConfiguratorPage() {
  const { productType } = useParams<{ productType: string }>();
  const navigate = useNavigate();
  const initConfiguration = useConfigStore((s) => s.initConfiguration);
  const config = useConfigStore((s) => s.configuration);

  useEffect(() => {
    const validTypes: ProductType[] = ['mailbox-sign', 'keychain'];
    if (!productType || !validTypes.includes(productType as ProductType)) {
      navigate('/produkte', { replace: true });
      return;
    }
    if (config.productType !== productType) {
      initConfiguration(productType as ProductType);
    }
  }, [productType]);

  const product = getProductByType(config.productType);

  if (!product) return null;

  return (
    <div className="configurator-page">
      <div className="container container-wide">
        {/* Page title (mobile only) */}
        <div className="configurator-page__header">
          <p className="overline">Konfigurator</p>
          <h1 className="heading-3">{product.name}</h1>
        </div>

        <div className="configurator-page__layout">
          {/* Left: 3D Preview */}
          <div className="configurator-page__viewer glass-card-static">
            <ThreeViewer />
          </div>

          {/* Right: Configuration */}
          <div className="configurator-page__config">
            <div className="configurator-page__config-header">
              <p className="overline">Konfigurator</p>
              <h2 className="heading-3">{product.name}</h2>
            </div>
            <ProductConfigurator />
          </div>
        </div>
      </div>
    </div>
  );
}
