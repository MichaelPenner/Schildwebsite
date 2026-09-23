import type { ProductConfiguration, PriceBreakdown, PriceLineItem } from '../types';
import { getProductById } from '../data/products';
import { getMaterialById, getColorById } from '../data/materials';

/**
 * Zentrale Preisberechnung.
 * Alle Preise in Cent.
 *
 * Kann später durch einen Backend-Service ersetzt werden,
 * indem nur diese Datei angepasst wird.
 */

// Konfigurierbare Preiskonstanten (später aus Backend/DB)
const PRICING_CONFIG = {
  /** Preis pro zusätzlichem mm² über Standard-Fläche */
  sizeModifierPerMm2: 0.08, // Cent pro mm²
  /** Standardfläche in mm² (unter der kein Aufschlag anfällt) */
  standardArea: 180 * 45, // Namensschild-Standardgröße
  /** QR-Code-Aufschlag */
  qrCodePrice: 300, // 3,00 €
  /** NFC-Tag-Aufschlag */
  nfcTagPrice: 500, // 5,00 €
  /** Aufschlag pro zusätzlicher Textebene (über 1) */
  additionalLayerPrice: 200, // 2,00 €
  /** Versandkosten */
  shippingCost: 490, // 4,90 €
  /** MwSt-Satz */
  taxRate: 0.19,
};

export class PricingService {
  calculatePrice(config: ProductConfiguration): PriceBreakdown {
    const lineItems: PriceLineItem[] = [];

    // Grundpreis
    const product = getProductById(config.productId);
    const basePrice = product?.basePrice ?? 0;
    lineItems.push({ label: 'Grundpreis', amount: basePrice });

    // Größenaufschlag
    const area = config.width * config.height;
    let sizeModifier = 0;
    if (area > PRICING_CONFIG.standardArea) {
      sizeModifier = Math.round(
        (area - PRICING_CONFIG.standardArea) * PRICING_CONFIG.sizeModifierPerMm2
      );
      if (sizeModifier > 0) {
        lineItems.push({ label: 'Größenaufschlag', amount: sizeModifier });
      }
    }

    // Materialaufschlag
    const material = getMaterialById(config.materialId);
    const materialModifier = material?.priceModifier ?? 0;
    if (materialModifier > 0) {
      lineItems.push({
        label: `Material: ${material?.name}`,
        amount: materialModifier,
      });
    }

    // Farbaufschlag (Basisfarbe)
    const baseColor = getColorById(config.baseColorId);
    const colorModifier = baseColor?.priceModifier ?? 0;
    if (colorModifier > 0) {
      lineItems.push({
        label: `Farbe: ${baseColor?.name}`,
        amount: colorModifier,
      });
    }

    // Textebenen-Farbaufschläge
    let layerColorModifier = 0;
    for (const layer of config.textLayers) {
      const layerColor = getColorById(layer.colorId);
      if (layerColor && layerColor.priceModifier > 0) {
        layerColorModifier += layerColor.priceModifier;
      }
    }
    if (layerColorModifier > 0) {
      lineItems.push({ label: 'Textfarbe(n)', amount: layerColorModifier });
    }

    // QR-Code
    const qrModifier = config.qrEnabled ? PRICING_CONFIG.qrCodePrice : 0;
    if (qrModifier > 0) {
      lineItems.push({ label: 'QR-Code', amount: qrModifier });
    }

    // NFC
    const nfcModifier = config.nfcEnabled ? PRICING_CONFIG.nfcTagPrice : 0;
    if (nfcModifier > 0) {
      lineItems.push({ label: 'NFC-Tag', amount: nfcModifier });
    }

    // Zusätzliche Ebenen
    const additionalLayers = Math.max(0, config.textLayers.length - 1);
    const layerModifier = additionalLayers * PRICING_CONFIG.additionalLayerPrice;
    if (layerModifier > 0) {
      lineItems.push({
        label: `${additionalLayers} zusätzliche Ebene(n)`,
        amount: layerModifier,
      });
    }

    const subtotal =
      basePrice +
      sizeModifier +
      materialModifier +
      colorModifier +
      layerColorModifier +
      qrModifier +
      nfcModifier +
      layerModifier;

    const tax = Math.round(subtotal * PRICING_CONFIG.taxRate);
    const total = subtotal + tax;

    return {
      basePrice,
      sizeModifier,
      materialModifier,
      colorModifier: colorModifier + layerColorModifier,
      qrModifier,
      nfcModifier,
      layerModifier,
      subtotal,
      tax,
      total,
      lineItems,
    };
  }

  getShippingCost(): number {
    return PRICING_CONFIG.shippingCost;
  }

  getTaxRate(): number {
    return PRICING_CONFIG.taxRate;
  }
}

export const pricingService = new PricingService();
