import { create } from 'zustand';
import type { ProductConfiguration, ProductType, TextLayerConfig } from '../types';
import { generateId } from '../utils/id';
import { getProductByType } from '../data/products';
import { getActiveMaterials, getColorsForMaterial } from '../data/materials';
import { getActiveFonts } from '../data/fonts';

interface ConfigState {
  configuration: ProductConfiguration;
  currentStep: number;
  totalSteps: number;
  initConfiguration: (productType: ProductType) => void;
  setProductType: (type: ProductType) => void;
  setDimensions: (width: number, height: number, depth: number) => void;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  setDepth: (depth: number) => void;
  setMaterial: (materialId: string) => void;
  setBaseColor: (colorId: string) => void;
  setFont: (fontId: string) => void;
  updateTextLayer: (layerId: string, updates: Partial<TextLayerConfig>) => void;
  addTextLayer: () => void;
  removeTextLayer: (layerId: string) => void;
  setQREnabled: (enabled: boolean) => void;
  setQRUrl: (url: string) => void;
  setNFCEnabled: (enabled: boolean) => void;
  setNFCUrl: (url: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetConfiguration: () => void;
}

function createDefaultConfig(productType: ProductType): ProductConfiguration {
  const product = getProductByType(productType);
  const materials = getActiveMaterials();
  const defaultMaterial = materials[0];
  const defaultColors = getColorsForMaterial(defaultMaterial.id);
  const defaultColor = defaultColors[0];
  const fontsData = getActiveFonts();
  const defaultFont = fontsData[0];

  const baseColorId = productType === 'keychain' ? 'col-pla-gold' : 'col-pla-white';
  const textColorId = productType === 'keychain' ? 'col-pla-white' : 'col-pla-gold';

  const defaultBaseColor = defaultColors.find((c) => c.id === baseColorId) || defaultColor;
  const defaultTextColor = defaultColors.find((c) => c.id === textColorId) || defaultColor;

  const layers: TextLayerConfig[] = [
    {
      id: generateId(),
      text: productType === 'mailbox-sign' ? 'Michael Krahn' : 'Mein Tag',
      fontSize: productType === 'mailbox-sign' ? 14 : 10,
      alignment: 'center',
      letterSpacing: 0.5,
      colorId: defaultTextColor.id,
    },
  ];

  if (productType === 'mailbox-sign') {
    layers.push({
      id: generateId(),
      text: 'Musterstraße 12',
      fontSize: 8,
      alignment: 'center',
      letterSpacing: 1,
      colorId: defaultTextColor.id,
    });
  }

  return {
    id: generateId(),
    productId: product?.id ?? '',
    productType,
    width: product?.defaultWidth ?? 180,
    height: product?.defaultHeight ?? 45,
    depth: product?.defaultDepth ?? 3,
    textLayers: layers,
    materialId: defaultMaterial.id,
    baseColorId: defaultBaseColor.id,
    fontId: defaultFont.id,
    qrEnabled: productType === 'keychain',
    qrUrl: productType === 'keychain' ? 'https://schildwerk.de' : '',
    nfcEnabled: false,
    nfcUrl: '',
  };
}

export const useConfigStore = create<ConfigState>((set, get) => ({
  configuration: createDefaultConfig('mailbox-sign'),
  currentStep: 0,
  totalSteps: 4,

  initConfiguration: (productType: ProductType) => {
    set({
      configuration: createDefaultConfig(productType),
      currentStep: 0,
    });
  },

  setProductType: (type: ProductType) => {
    set({ configuration: createDefaultConfig(type) });
  },

  setDimensions: (width, height, depth) => {
    set((state) => ({
      configuration: { ...state.configuration, width, height, depth },
    }));
  },

  setWidth: (width) => {
    set((state) => ({
      configuration: { ...state.configuration, width },
    }));
  },

  setHeight: (height) => {
    set((state) => ({
      configuration: { ...state.configuration, height },
    }));
  },

  setDepth: (depth) => {
    set((state) => ({
      configuration: { ...state.configuration, depth },
    }));
  },

  setMaterial: (materialId: string) => {
    const colorsData = getColorsForMaterial(materialId);
    const firstColor = colorsData[0];
    set((state) => ({
      configuration: {
        ...state.configuration,
        materialId,
        baseColorId: firstColor?.id ?? state.configuration.baseColorId,
      },
    }));
  },

  setBaseColor: (colorId: string) => {
    set((state) => ({
      configuration: { ...state.configuration, baseColorId: colorId },
    }));
  },

  setFont: (fontId: string) => {
    set((state) => ({
      configuration: { ...state.configuration, fontId },
    }));
  },

  updateTextLayer: (layerId: string, updates: Partial<TextLayerConfig>) => {
    set((state) => ({
      configuration: {
        ...state.configuration,
        textLayers: state.configuration.textLayers.map((layer) =>
          layer.id === layerId ? { ...layer, ...updates } : layer
        ),
      },
    }));
  },

  addTextLayer: () => {
    const config = get().configuration;
    const product = getProductByType(config.productType);
    if (config.textLayers.length >= (product?.constraints.maxLayers ?? 2)) return;

    const newLayer: TextLayerConfig = {
      id: generateId(),
      text: '',
      fontSize: 8,
      alignment: 'center',
      letterSpacing: 0.5,
      colorId: config.baseColorId,
    };
    set((state) => ({
      configuration: {
        ...state.configuration,
        textLayers: [...state.configuration.textLayers, newLayer],
      },
    }));
  },

  removeTextLayer: (layerId: string) => {
    const config = get().configuration;
    if (config.textLayers.length <= 1) return;
    set((state) => ({
      configuration: {
        ...state.configuration,
        textLayers: state.configuration.textLayers.filter(
          (l) => l.id !== layerId
        ),
      },
    }));
  },

  setQREnabled: (enabled: boolean) => {
    set((state) => ({
      configuration: { ...state.configuration, qrEnabled: enabled },
    }));
  },

  setQRUrl: (url: string) => {
    set((state) => ({
      configuration: { ...state.configuration, qrUrl: url },
    }));
  },

  setNFCEnabled: (enabled: boolean) => {
    set((state) => ({
      configuration: { ...state.configuration, nfcEnabled: enabled },
    }));
  },

  setNFCUrl: (url: string) => {
    set((state) => ({
      configuration: { ...state.configuration, nfcUrl: url },
    }));
  },

  nextStep: () => {
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1),
    }));
  },

  prevStep: () => {
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 0),
    }));
  },

  goToStep: (step: number) => {
    set({ currentStep: Math.max(0, Math.min(step, get().totalSteps - 1)) });
  },

  resetConfiguration: () => {
    set({
      configuration: createDefaultConfig('mailbox-sign'),
      currentStep: 0,
    });
  },
}));
