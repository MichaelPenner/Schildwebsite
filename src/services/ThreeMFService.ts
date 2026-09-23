import type { ProductConfiguration } from '../types';

/**
 * 3MF-Generierungs-Service.
 *
 * Definiert das Interface für die Erzeugung von produktionsfertigen
 * 3MF-Dateien für den 3D-Druck.
 *
 * Die 3MF-Datei enthält:
 * - Vollständige Mesh-Geometrie
 * - Materialinformationen
 * - Farben
 * - Druckeinstellungen (optional)
 *
 * Für die Produktion soll hier ein serverseitiger 3MF-Generator
 * (z.B. basierend auf CadQuery/OpenSCAD + three-3mf-exporter)
 * integriert werden.
 */

export interface IThreeMFService {
  /**
   * Erzeugt eine 3MF-Datei aus der Produktkonfiguration.
   */
  generate3MF(config: ProductConfiguration): Promise<Blob>;

  /**
   * Prüft, ob eine Konfiguration für die 3MF-Generierung gültig ist.
   */
  validateConfiguration(config: ProductConfiguration): ValidationResult;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Mock-Implementierung des ThreeMFService.
 *
 * Im MVP wird ein Platzhalter-Blob zurückgegeben.
 * Die eigentliche 3MF-Generierung erfordert eine
 * CAD-Engine (serverseitig) und wird in Phase 2 implementiert.
 */
export class ThreeMFService implements IThreeMFService {
  async generate3MF(config: ProductConfiguration): Promise<Blob> {
    console.warn(
      '[ThreeMFService] 3MF-Generierung ist im MVP als Mock implementiert.',
      'Konfiguration:', JSON.stringify(config, null, 2)
    );

    // Erstelle eine realistische Mock-3MF-Struktur
    const mockContent = `<?xml version="1.0" encoding="UTF-8"?>
<!-- MOCK 3MF - SchildWerk -->
<!-- Produkt: ${config.productType} -->
<!-- Maße: ${config.width}×${config.height}×${config.depth}mm -->
<!-- Material: ${config.materialId} -->
<!-- Erstellt: ${new Date().toISOString()} -->
<model unit="millimeter" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02">
  <metadata name="Application">SchildWerk MVP (Mock)</metadata>
  <resources>
    <object id="1" type="model">
      <!-- Hier würde die echte Mesh-Geometrie stehen -->
      <mesh>
        <vertices />
        <triangles />
      </mesh>
    </object>
  </resources>
  <build>
    <item objectid="1" />
  </build>
</model>`;

    return new Blob([mockContent], { type: 'application/vnd.ms-package.3dmanufacturing-3dmodel+xml' });
  }

  validateConfiguration(config: ProductConfiguration): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!config.width || config.width < 10) {
      errors.push('Breite muss mindestens 10mm betragen.');
    }
    if (!config.height || config.height < 10) {
      errors.push('Höhe muss mindestens 10mm betragen.');
    }
    if (config.textLayers.length === 0) {
      errors.push('Mindestens eine Textebene ist erforderlich.');
    }
    for (const layer of config.textLayers) {
      if (!layer.text || layer.text.trim().length === 0) {
        errors.push('Textebene darf nicht leer sein.');
      }
    }
    if (!config.materialId) {
      errors.push('Material muss ausgewählt sein.');
    }

    // Warnungen
    if (config.width > 250) {
      warnings.push('Breite über 250mm kann zu längerer Druckzeit führen.');
    }
    if (config.qrEnabled && !config.qrUrl) {
      warnings.push('QR-Code ist aktiviert, aber keine URL angegeben.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

export const threeMFService = new ThreeMFService();
