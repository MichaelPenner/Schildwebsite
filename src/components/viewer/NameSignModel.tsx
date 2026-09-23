import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Center, Text3D } from '@react-three/drei';
import * as THREE from 'three';
import type { ProductConfiguration } from '../../types';
import { getColorById } from '../../data/materials';
import { getFontById } from '../../data/fonts';

interface Props {
  configuration: ProductConfiguration;
}

function createRoundedRectShape(width: number, height: number, radius: number) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  
  shape.moveTo(x, y + radius);
  shape.lineTo(x, y + height - radius);
  shape.absarc(x + radius, y + height - radius, radius, Math.PI, Math.PI / 2, true);
  shape.lineTo(x + width - radius, y + height);
  shape.absarc(x + width - radius, y + height - radius, radius, Math.PI / 2, 0, true);
  shape.lineTo(x + width, y + radius);
  shape.absarc(x + width - radius, y + radius, radius, 0, -Math.PI / 2, true);
  shape.lineTo(x + radius, y);
  shape.absarc(x + radius, y + radius, radius, -Math.PI / 2, -Math.PI, true);
  return shape;
}

export default function NameSignModel({ configuration }: Props) {
  const groupRef = useRef<THREE.Group>(null);

  // Scale: 1 unit = 100mm in scene
  const scaleW = configuration.width / 100;
  const scaleH = configuration.height / 100;

  // Use fixed thicknesses for realistic multi-color 3D printing
  const baseThickness = 0.015; // 1.5mm
  const topThickness = 0.015; // 1.5mm
  const totalThickness = baseThickness + topThickness;

  const baseColor = getColorById(configuration.baseColorId);
  const font = getFontById(configuration.fontId);
  const fontUrl = font?.typefaceUrl ?? 'https://cdn.jsdelivr.net/npm/three@0.175.0/examples/fonts/helvetiker_bold.typeface.json';

  const baseMaterial = useMemo(() => {
    const glossLevel = baseColor?.glossLevel ?? 20;
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(baseColor?.hex ?? '#292929'),
      roughness: 1 - glossLevel / 100,
      metalness: baseColor?.effects?.includes('metallic') ? 0.6 : 0.05,
    });
  }, [baseColor]);

  // If text layer 1 has a color, we might want to use it for the top layer plate as well,
  // or maybe use baseColor for the whole plate. The user said:
  // "base layout should be two flat layers like 1,5 mm for each schild... top layer is a bit smaller. and on top of these two layers are the font"
  // Usually the top layer has the color of the text (in 2-color prints). Let's use the first text color for the top layer plate.
  const textMaterials = useMemo(() => {
    return configuration.textLayers.map((layer) => {
      const color = getColorById(layer.colorId);
      const glossLevel = color?.glossLevel ?? 40;
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color?.hex ?? '#ffffff'),
        roughness: 1 - glossLevel / 100,
        metalness: color?.effects?.includes('metallic') ? 0.6 : 0.05,
      });
    });
  }, [configuration.textLayers]);

  const topLayerMaterial = baseMaterial;

  const extrudeSettingsBase = useMemo(() => ({
    steps: 1,
    depth: baseThickness,
    bevelEnabled: true,
    bevelThickness: 0.001,
    bevelSize: 0.001,
    bevelSegments: 2
  }), []);

  const extrudeSettingsTop = useMemo(() => ({
    steps: 1,
    depth: topThickness,
    bevelEnabled: true,
    bevelThickness: 0.001,
    bevelSize: 0.001,
    bevelSegments: 2
  }), []);

  const radius = scaleH * 0.25;
  const baseShape = useMemo(() => createRoundedRectShape(scaleW, scaleH, radius), [scaleW, scaleH, radius]);
  const topShape = useMemo(() => createRoundedRectShape(scaleW - 0.02, scaleH - 0.02, radius - 0.01), [scaleW, scaleH, radius]);

  // Subtle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.01;
    }
  });

  // Font sizes relative to sign
  const layer1FontSize = configuration.textLayers[0]
    ? (configuration.textLayers[0].fontSize / 100) * (scaleH * 0.95)
    : 0.15;
  const layer2FontSize = configuration.textLayers[1]
    ? (configuration.textLayers[1].fontSize / 100) * (scaleH * 0.75)
    : 0.08;

  const hasLayer2 = configuration.textLayers.length > 1 && configuration.textLayers[1]?.text;
  const layer1Y = hasLayer2 ? scaleH * 0.12 : 0;
  const layer2Y = -scaleH * 0.18;

  return (
    <group ref={groupRef}>
      {/* Base Layer */}
      <mesh material={baseMaterial} castShadow receiveShadow position={[0, 0, -baseThickness]}>
        <extrudeGeometry args={[baseShape, extrudeSettingsBase]} />
      </mesh>

      {/* Top Layer */}
      <mesh material={topLayerMaterial} castShadow receiveShadow position={[0, 0, 0]}>
        <extrudeGeometry args={[topShape, extrudeSettingsTop]} />
      </mesh>

      {/* Mounting holes - passing through both layers */}
      {[-(scaleW / 2 - scaleH * 0.2), scaleW / 2 - scaleH * 0.2].map(
        (xPos, i) => (
          <mesh key={i} position={[xPos, 0, totalThickness / 2 - baseThickness]}>
            <cylinderGeometry args={[scaleH * 0.04, scaleH * 0.04, totalThickness + 0.01, 16]} />
            <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
          </mesh>
        )
      )}

      {/* Layer 1 text */}
      {configuration.textLayers[0]?.text && (
        <Center key={configuration.textLayers[0].text} position={[0, layer1Y, topThickness + 0.001]}>
          <Text3D
            font={fontUrl}
            size={layer1FontSize}
            height={0.02}
            bevelEnabled
            bevelThickness={0.001}
            bevelSize={0.001}
            bevelSegments={2}
            material={textMaterials[0]}
            castShadow
          >
            {configuration.textLayers[0].text}
          </Text3D>
        </Center>
      )}

      {/* Layer 2 text (subtitle) */}
      {hasLayer2 && (
        <Center key={configuration.textLayers[1]!.text} position={[0, layer2Y, topThickness + 0.001]}>
          <Text3D
            font={fontUrl}
            size={layer2FontSize}
            height={0.015}
            bevelEnabled
            bevelThickness={0.001}
            bevelSize={0.001}
            bevelSegments={2}
            letterSpacing={(configuration.textLayers[1]!.letterSpacing ?? 0.5) * 0.02}
            material={textMaterials[1]}
            castShadow
          >
            {configuration.textLayers[1]!.text}
          </Text3D>
        </Center>
      )}
    </group>
  );
}
