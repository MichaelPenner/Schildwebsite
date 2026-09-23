import type { ProductConfiguration } from '../types';

/**
 * 3D-Modell-Generierungs-Service.
 *
 * Definiert das Interface für die Erzeugung von 3D-Vorschaumodellen
 * und GLB-Export. Die MVP-Implementierung erzeugt Modelle
 * programmatisch mit Three.js TextGeometry.
 *
 * Für die Produktion kann hier ein serverseitiger Generator
 * (z.B. OpenSCAD, CadQuery, FreeCAD) angebunden werden.
 */

export interface IModelGeneratorService {
  /**
   * Erzeugt ein 3D-Vorschaumodell aus der Konfiguration.
   * Gibt eine Three.js Group zurück, die in die Szene eingefügt werden kann.
   */
  generatePreviewModel(config: ProductConfiguration): Promise<unknown>;

  /**
   * Exportiert eine Three.js Szene/Gruppe als GLB-Blob.
   */
  exportGLB(sceneOrGroup: unknown): Promise<Blob>;
}

/**
 * Mock-Implementierung des ModelGeneratorService.
 *
 * Die tatsächliche 3D-Geometrie wird in den React-Komponenten
 * (NameSignModel, KeychainModel) mit @react-three/fiber erzeugt.
 * Dieser Service dient als zentrale Abstraktion für den Export.
 */
export class ModelGeneratorService implements IModelGeneratorService {
  async generatePreviewModel(config: ProductConfiguration): Promise<unknown> {
    // Im MVP wird das Modell direkt in den React Three Fiber
    // Komponenten erzeugt. Dieser Service gibt nur die
    // Konfiguration zurück und loggt den Aufruf.
    console.log(
      '[ModelGeneratorService] Generiere Vorschaumodell für:',
      config.productType,
      `(${config.width}×${config.height}mm)`
    );
    return config;
  }

  async exportGLB(_sceneOrGroup: unknown): Promise<Blob> {
    // TODO: Implementiere GLTFExporter-Integration
    // import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
    console.warn(
      '[ModelGeneratorService] GLB-Export ist im MVP als Mock implementiert.',
      'Für die Produktion muss GLTFExporter integriert werden.'
    );
    return new Blob(['[GLB-MOCK]'], { type: 'model/gltf-binary' });
  }
}

export const modelGeneratorService = new ModelGeneratorService();
