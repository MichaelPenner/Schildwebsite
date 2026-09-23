import type { ProductConfiguration } from '../types';

/**
 * QR-Code-Generierung.
 *
 * Verwendet die `qrcode`-Library für echte QR-Code-Erzeugung.
 * Die Matrix-Funktion liefert Rohdaten für spätere 3D-Geometrie-Integration.
 */

// Dynamischer Import, da qrcode CommonJS ist
async function getQRCodeLib() {
  const mod = await import('qrcode');
  return mod.default || mod;
}

export interface QROptions {
  width?: number;
  margin?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  color?: {
    dark?: string;
    light?: string;
  };
}

export class QRCodeService {
  /**
   * Generiert einen QR-Code als Data-URL (PNG).
   */
  async generateQRCode(url: string, options?: QROptions): Promise<string> {
    const QRCode = await getQRCodeLib();
    const dataUrl = await QRCode.toDataURL(url, {
      width: options?.width ?? 256,
      margin: options?.margin ?? 2,
      errorCorrectionLevel: options?.errorCorrectionLevel ?? 'H',
      color: {
        dark: options?.color?.dark ?? '#000000',
        light: options?.color?.light ?? '#ffffff',
      },
    });
    return dataUrl;
  }

  /**
   * Generiert einen QR-Code als SVG-String.
   */
  async generateQRCodeSVG(url: string): Promise<string> {
    const QRCode = await getQRCodeLib();
    return QRCode.toString(url, {
      type: 'svg',
      errorCorrectionLevel: 'H',
      margin: 2,
    });
  }

  /**
   * Generiert die QR-Code-Matrix als 2D-Boolean-Array.
   * Kann für die 3D-Geometrie-Generierung verwendet werden,
   * um jeden Pixel als erhabenes Element darzustellen.
   */
  async generateQRMatrix(url: string): Promise<boolean[][]> {
    const QRCode = await getQRCodeLib();
    // QRCode.create gibt das rohe QR-Code-Objekt zurück
    const qr = QRCode.create(url, {
      errorCorrectionLevel: 'H',
    });
    const size = qr.modules.size;
    const data = qr.modules.data;
    const matrix: boolean[][] = [];

    for (let row = 0; row < size; row++) {
      const rowData: boolean[] = [];
      for (let col = 0; col < size; col++) {
        rowData.push(data[row * size + col] === 1);
      }
      matrix.push(rowData);
    }

    return matrix;
  }

  /**
   * Prüft, ob eine URL für QR-Code-Generierung geeignet ist.
   */
  isValidQRContent(url: string): boolean {
    if (!url || url.trim().length === 0) return false;
    if (url.length > 2953) return false; // QR-Code max
    return true;
  }

  /**
   * Berechnet die empfohlene Mindestgröße für den 3D-Druck (in mm).
   */
  getRecommendedPrintSize(url: string): number {
    // Mehr Daten = mehr Module = größer muss der QR-Code sein
    const baseSize = 15; // mm Minimum
    const sizePerChar = 0.3;
    return Math.max(baseSize, baseSize + url.length * sizePerChar);
  }
}

export const qrCodeService = new QRCodeService();

// Helper-Funktion für den Konfigurator
export async function generateQRForConfig(
  config: ProductConfiguration
): Promise<string | null> {
  if (!config.qrEnabled || !config.qrUrl) return null;
  return qrCodeService.generateQRCode(config.qrUrl);
}
