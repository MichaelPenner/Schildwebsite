import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { Suspense, useMemo } from 'react';
import NameSignModel from './NameSignModel';
import KeychainModel from './KeychainModel';
import type { ProductConfiguration } from '../../types';

interface Props {
  configuration: ProductConfiguration;
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 0.3, 0.1]} />
      <meshStandardMaterial color="#333" transparent opacity={0.3} />
    </mesh>
  );
}

export default function StaticViewer({ configuration }: Props) {
  const cameraFov = configuration.productType === 'keychain' ? 20 : 35;
  const cameraPos = configuration.productType === 'keychain' ? [0, 0, 4] : [0, 0.2, 3];

  return (
    <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: cameraPos as any, fov: cameraFov }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
        <directionalLight position={[-3, 3, -3]} intensity={0.3} />
        
        <Suspense fallback={<LoadingFallback />}>
          {/* Rotate slightly for a better 3D look in the preview card */}
          <group rotation={[0.2, -0.2, 0]}>
            {configuration.productType === 'mailbox-sign' ? (
              <NameSignModel configuration={configuration} />
            ) : (
              <KeychainModel configuration={configuration} />
            )}
          </group>
        </Suspense>

        <ContactShadows
          position={[0, -0.6, 0]}
          opacity={0.4}
          scale={8}
          blur={2}
          far={2}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
