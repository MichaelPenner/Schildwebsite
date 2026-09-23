import { useConfigStore } from '../../stores/configStore';
import { useCartStore } from '../../stores/cartStore';
import { pricingService } from '../../services/PricingService';
import { getActiveMaterials, getColorsForMaterial, getColorById } from '../../data/materials';
import { getActiveFonts } from '../../data/fonts';
import { getProductByType } from '../../data/products';
import { formatPrice } from '../../utils/formatting';
import { Check, QrCode, Wifi, Plus, Trash2, ShoppingCart } from 'lucide-react';
import './ProductConfigurator.css';

export default function ProductConfigurator() {
  const config = useConfigStore((s) => s.configuration);
  const {
    setWidth, setHeight, setDepth,
    setMaterial, setBaseColor, setFont,
    updateTextLayer, addTextLayer, removeTextLayer,
    setQREnabled, setQRUrl, setNFCEnabled, setNFCUrl,
  } = useConfigStore();
  const addItem = useCartStore((s) => s.addItem);

  const product = getProductByType(config.productType);
  const materials = getActiveMaterials();
  const availableColors = getColorsForMaterial(config.materialId);
  const fonts = getActiveFonts();
  const pricing = pricingService.calculatePrice(config);

  const handleAddToCart = () => {
    addItem(config);
  };

  return (
    <div className="configurator">
      {/* Dimensions */}
      <section className="config-section">
        <h3 className="config-section__title">Abmessungen</h3>
        <div className="config-dims">
          <label className="config-field">
            <span className="config-field__label">Breite</span>
            <div className="config-field__input-wrap">
              <input
                type="range"
                className="config-range"
                min={product?.constraints.minWidth ?? 80}
                max={product?.constraints.maxWidth ?? 300}
                value={config.width}
                onChange={(e) => setWidth(Number(e.target.value))}
              />
              <span className="config-field__value">{config.width} mm</span>
            </div>
          </label>
          <label className="config-field">
            <span className="config-field__label">Höhe</span>
            <div className="config-field__input-wrap">
              <input
                type="range"
                className="config-range"
                min={product?.constraints.minHeight ?? 25}
                max={product?.constraints.maxHeight ?? 80}
                value={config.height}
                onChange={(e) => setHeight(Number(e.target.value))}
              />
              <span className="config-field__value">{config.height} mm</span>
            </div>
          </label>
          <label className="config-field">
            <span className="config-field__label">Tiefe</span>
            <div className="config-field__input-wrap">
              <input
                type="range"
                className="config-range"
                min={product?.constraints.minDepth ?? 2}
                max={product?.constraints.maxDepth ?? 8}
                step={0.5}
                value={config.depth}
                onChange={(e) => setDepth(Number(e.target.value))}
              />
              <span className="config-field__value">{config.depth} mm</span>
            </div>
          </label>
        </div>
      </section>

      {/* Text layers */}
      <section className="config-section">
        <div className="config-section__header">
          <h3 className="config-section__title">Text</h3>
          {config.textLayers.length < (product?.constraints.maxLayers ?? 2) && (
            <button className="btn btn-ghost btn-sm" onClick={addTextLayer}>
              <Plus size={14} /> Ebene
            </button>
          )}
        </div>
        {config.textLayers.map((layer, i) => (
          <div key={layer.id} className="config-text-layer">
            <div className="config-text-layer__header">
              <span className="config-text-layer__label">
                {i === 0 ? 'Haupttext' : `Zusatztext ${i}`}
              </span>
              {config.textLayers.length > 1 && (
                <button
                  className="btn btn-icon btn-ghost btn-sm"
                  onClick={() => removeTextLayer(layer.id)}
                  aria-label="Ebene entfernen"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <input
              type="text"
              className="glass-input"
              value={layer.text}
              placeholder={i === 0 ? 'z.B. Michael Krahn' : 'z.B. Musterstraße 12'}
              maxLength={product?.constraints.maxTextLength ?? 40}
              onChange={(e) => updateTextLayer(layer.id, { text: e.target.value })}
            />
            {/* Text layer color */}
            <div className="config-color-row">
              <span className="config-field__label config-field__label--sm">Textfarbe</span>
              <div className="config-colors config-colors--sm">
                {availableColors.map((color) => (
                  <button
                    key={color.id}
                    className={`config-color-swatch config-color-swatch--sm ${
                      layer.colorId === color.id ? 'config-color-swatch--active' : ''
                    }`}
                    style={{ background: color.hex }}
                    onClick={() => updateTextLayer(layer.id, { colorId: color.id })}
                    title={color.name}
                    aria-label={color.name}
                  >
                    {layer.colorId === color.id && <Check size={10} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Font */}
      <section className="config-section">
        <h3 className="config-section__title">Schriftart</h3>
        <div className="config-fonts">
          {fonts.map((f) => (
            <button
              key={f.id}
              className={`config-font-btn ${config.fontId === f.id ? 'config-font-btn--active' : ''}`}
              onClick={() => setFont(f.id)}
              style={{ fontFamily: f.cssFamily }}
            >
              {f.displayName}
            </button>
          ))}
        </div>
      </section>

      {/* Material */}
      <section className="config-section">
        <h3 className="config-section__title">Material</h3>
        <div className="config-materials">
          {materials.map((mat) => (
            <button
              key={mat.id}
              className={`config-material-btn ${config.materialId === mat.id ? 'config-material-btn--active' : ''}`}
              onClick={() => setMaterial(mat.id)}
            >
              <span className="config-material-btn__name">{mat.name}</span>
              {mat.priceModifier > 0 && (
                <span className="config-material-btn__price">
                  +{formatPrice(mat.priceModifier)}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Color */}
      <section className="config-section">
        <h3 className="config-section__title">Grundfarbe</h3>
        <div className="config-colors">
          {availableColors.map((color) => (
            <button
              key={color.id}
              className={`config-color-swatch ${
                config.baseColorId === color.id ? 'config-color-swatch--active' : ''
              }`}
              style={{ background: color.hex }}
              onClick={() => setBaseColor(color.id)}
              title={`${color.name} (${color.finish})`}
              aria-label={color.name}
            >
              {config.baseColorId === color.id && <Check size={14} />}
            </button>
          ))}
        </div>
        {(() => {
          const selected = getColorById(config.baseColorId);
          return selected ? (
            <div className="config-color-info">
              <span>{selected.name}</span>
              <span className="text-secondary">
                {selected.finish === 'matt' ? 'Matt' : selected.finish === 'satin' ? 'Satin' : 'Glanz'}
                {selected.priceModifier > 0 && ` · +${formatPrice(selected.priceModifier)}`}
              </span>
            </div>
          ) : null;
        })()}
      </section>

      {/* QR & NFC (only for keychain) */}
      {product?.constraints.supportsQR && (
        <section className="config-section">
          <h3 className="config-section__title">Extras</h3>
          <label className="config-toggle">
            <input
              type="checkbox"
              checked={config.qrEnabled}
              onChange={(e) => setQREnabled(e.target.checked)}
            />
            <div className="config-toggle__track">
              <div className="config-toggle__thumb" />
            </div>
            <QrCode size={16} />
            <span>QR-Code</span>
            <span className="config-toggle__price">+{formatPrice(300)}</span>
          </label>
          {config.qrEnabled && (
            <input
              type="url"
              className="glass-input"
              placeholder="https://example.com"
              value={config.qrUrl ?? ''}
              onChange={(e) => setQRUrl(e.target.value)}
            />
          )}

          {product?.constraints.supportsNFC && (
            <>
              <label className="config-toggle">
                <input
                  type="checkbox"
                  checked={config.nfcEnabled}
                  onChange={(e) => setNFCEnabled(e.target.checked)}
                />
                <div className="config-toggle__track">
                  <div className="config-toggle__thumb" />
                </div>
                <Wifi size={16} />
                <span>NFC-Tag</span>
                <span className="config-toggle__price">+{formatPrice(500)}</span>
              </label>
              {config.nfcEnabled && (
                <input
                  type="url"
                  className="glass-input"
                  placeholder="https://example.com/kontakt"
                  value={config.nfcUrl ?? ''}
                  onChange={(e) => setNFCUrl(e.target.value)}
                />
              )}
            </>
          )}
        </section>
      )}

      {/* Pricing */}
      <section className="config-section config-pricing">
        <h3 className="config-section__title">Preis</h3>
        <div className="config-pricing__lines">
          {pricing.lineItems.map((item, i) => (
            <div key={i} className="config-pricing__line">
              <span className="text-secondary">{item.label}</span>
              <span>{formatPrice(item.amount)}</span>
            </div>
          ))}
          <div className="config-pricing__line config-pricing__line--tax">
            <span className="text-secondary">inkl. MwSt.</span>
            <span className="text-secondary">{formatPrice(pricing.tax)}</span>
          </div>
          <div className="config-pricing__line config-pricing__line--total">
            <span>Gesamt</span>
            <span className="text-accent">{formatPrice(pricing.total)}</span>
          </div>
        </div>
      </section>

      {/* Add to cart */}
      <button className="btn btn-primary btn-lg config-add-btn" onClick={handleAddToCart}>
        <ShoppingCart size={18} />
        In den Warenkorb · {formatPrice(pricing.total)}
      </button>
    </div>
  );
}
