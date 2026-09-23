import { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Center, Text3D } from '@react-three/drei';
import * as THREE from 'three';
import type { ProductConfiguration } from '../../types';
import { getColorById } from '../../data/materials';
import { getFontById } from '../../data/fonts';
import { qrCodeService } from '../../services/QRCodeService';

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

export default function KeychainModel({ configuration }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const qrInstancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const [qrMatrix, setQrMatrix] = useState<boolean[][] | null>(null);

  const scaleW = configuration.width / 100;
  const scaleH = configuration.height / 100;

  const baseThickness = 0.015;
  const topThickness = 0.015;
  const totalThickness = baseThickness + topThickness;

  const baseColor = getColorById(configuration.baseColorId);
  const font = getFontById(configuration.fontId);
  const fontUrl = font?.typefaceUrl ?? 'https://cdn.jsdelivr.net/npm/three@0.175.0/examples/fonts/helvetiker_bold.typeface.json';

  const baseMaterial = useMemo(() => {
    const glossLevel = baseColor?.glossLevel ?? 20;
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(baseColor?.hex ?? '#1e3a5f'),
      roughness: 1 - glossLevel / 100,
      metalness: baseColor?.effects?.includes('metallic') ? 0.6 : 0.05,
    });
  }, [baseColor]);

  const textColorHex = useMemo(() => {
    const layer = configuration.textLayers[0];
    if (!layer) return '#ffffff';
    const color = getColorById(layer.colorId);
    return color?.hex ?? '#ffffff';
  }, [configuration.textLayers]);

  const textMaterial = useMemo(() => {
    const layer = configuration.textLayers[0];
    if (!layer) return new THREE.MeshStandardMaterial({ color: '#fff' });
    const color = getColorById(layer.colorId);
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color?.hex ?? '#ffffff'),
      roughness: 0.4,
      metalness: color?.effects?.includes('metallic') ? 0.6 : 0.05,
    });
  }, [configuration.textLayers]);

  const topLayerMaterial = baseMaterial;

  const extrudeSettingsBase = useMemo(() => ({
    steps: 1, depth: baseThickness, bevelEnabled: true, bevelThickness: 0.001, bevelSize: 0.001, bevelSegments: 2
  }), []);

  const extrudeSettingsTop = useMemo(() => ({
    steps: 1, depth: topThickness, bevelEnabled: true, bevelThickness: 0.001, bevelSize: 0.001, bevelSegments: 2
  }), []);

  const radius = scaleW * 0.12;
  const baseShape = useMemo(() => createRoundedRectShape(scaleW, scaleH, radius), [scaleW, scaleH, radius]);
  const topShape = useMemo(() => createRoundedRectShape(scaleW - 0.015, scaleH - 0.015, radius - 0.0075), [scaleW, scaleH, radius]);

  // Load QR code matrix
  useEffect(() => {
    if (!configuration.qrEnabled || !configuration.qrUrl) {
      setQrMatrix(null);
      return;
    }
    let cancelled = false;
    qrCodeService.generateQRMatrix(configuration.qrUrl).then((matrix) => {
      if (!cancelled) setQrMatrix(matrix);
    });
    return () => { cancelled = true; };
  }, [configuration.qrEnabled, configuration.qrUrl]);

  const qrInstances = useMemo(() => {
    if (!qrMatrix) return null;
    const size = qrMatrix.length;
    const padding = 2; // Quiet zone
    const totalSize = size + padding * 2;
    const qrRealSize = scaleW * 0.70;
    const moduleSize = qrRealSize / totalSize;
    
    const dummy = new THREE.Object3D();
    const positions: THREE.Matrix4[] = [];
    
    const startX = -qrRealSize / 2 + moduleSize / 2;
    const startY = qrRealSize / 2 - moduleSize / 2;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (qrMatrix[r][c]) {
          dummy.position.set(
            startX + (c + padding) * moduleSize,
            startY - (r + padding) * moduleSize,
            0
          );
          dummy.scale.set(moduleSize, moduleSize, 0.01);
          dummy.updateMatrix();
          positions.push(dummy.matrix.clone());
        }
      }
    }
    return positions;
  }, [qrMatrix, scaleW]);

  useEffect(() => {
    if (qrInstancedMeshRef.current && qrInstances) {
      qrInstances.forEach((mat, i) => {
        qrInstancedMeshRef.current!.setMatrixAt(i, mat);
      });
      qrInstancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [qrInstances]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.01;
    }
  });

  const textFontSize = configuration.textLayers[0]
    ? (configuration.textLayers[0].fontSize / 100) * scaleH * 1.1
    : 0.15;

  const hasQR = configuration.qrEnabled && qrInstances !== null;
  const textY = hasQR ? scaleH * 0.28 : 0;

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

      {/* Ring / keyhole at top */}
      <mesh position={[0, scaleH / 2 + scaleW * 0.08, 0]} castShadow>
        <torusGeometry args={[scaleW * 0.1, scaleW * 0.025, 16, 32]} />
        <meshStandardMaterial
          color="#999"
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>

      {/* Text */}
      {configuration.textLayers[0]?.text && (
        <Center key={configuration.textLayers[0].text} position={[0, textY, topThickness + 0.001]}>
          <Text3D
            font={fontUrl}
            size={textFontSize}
            height={0.01}
            bevelEnabled
            bevelThickness={0.001}
            bevelSize={0.001}
            bevelSegments={2}
            material={textMaterial}
            castShadow
          >
            {configuration.textLayers[0].text}
          </Text3D>
        </Center>
      )}

      {hasQR && qrInstances && (
        <group position={[0, -scaleH * 0.12, topThickness]}>
          {/* Extruded blocks */}
          <instancedMesh 
            ref={qrInstancedMeshRef}
            args={[undefined, undefined, qrInstances.length]} 
            position={[0, 0, 0.005]}
            castShadow 
            receiveShadow
          >
             <boxGeometry args={[1, 1, 1]} />
             <meshStandardMaterial color={textColorHex} roughness={0.4} />
          </instancedMesh>
        </group>
      )}

      {/* NFC indicator badge on back */}
      {configuration.nfcEnabled && (
        <mesh position={[0, 0, -baseThickness - 0.001]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[scaleW * 0.12, 32]} />
          <meshStandardMaterial
            color="#6b9bd2"
            roughness={0.3}
            metalness={0.2}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
}
