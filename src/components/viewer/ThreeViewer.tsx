import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Suspense, useState, useMemo } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import * as THREE from 'three';
import NameSignModel from './NameSignModel';
import KeychainModel from './KeychainModel';
import { useConfigStore } from '../../stores/configStore';
import './ThreeViewer.css';

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 0.3, 0.1]} />
      <meshStandardMaterial color="#333" transparent opacity={0.3} />
    </mesh>
  );
}

function EnvCamera({ showEnv, type }: { showEnv: boolean, type: string }) {
  const targetKeychain = useMemo(() => new THREE.Vector3(0, 1.2, 2), []);
  const targetMailbox = useMemo(() => new THREE.Vector3(0, 0, 3.5), []);

  useFrame((state) => {
    if (showEnv) {
      if (type === 'keychain') {
        state.camera.position.lerp(targetKeychain, 0.1);
        state.camera.lookAt(0, -0.2, 0);
      } else {
        state.camera.position.lerp(targetMailbox, 0.1);
        state.camera.lookAt(0, 0, 0);
      }
    }
  });
  return null;
}

export default function ThreeViewer() {
  const configuration = useConfigStore((s) => s.configuration);
  const [showEnv, setShowEnv] = useState(false);

  return (
    <div className="three-viewer">
      <button 
        className="three-viewer__env-btn"
        onClick={() => setShowEnv(!showEnv)}
      >
        <ImageIcon size={16} /> {showEnv ? '3D Ansicht' : 'Umgebung zeigen'}
      </button>
      <div 
        className={`three-viewer__canvas-wrap ${showEnv ? 'three-viewer__canvas-wrap--env' : ''}`}
        style={showEnv ? { backgroundImage: `url('/env-${configuration.productType}.jpg')` } : undefined}
      >
        <Canvas
          camera={{ position: [0, 0.5, 4], fov: 35 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
          <directionalLight position={[-3, 3, -3]} intensity={0.3} />
          <pointLight position={[0, 2, 0]} intensity={0.2} color="#d4a574" />

          <Suspense fallback={<LoadingFallback />}>
            <group
              position={showEnv ? (configuration.productType === 'keychain' ? [-0.44, -0.44, 0] : [0, 0.1, 0]) : [0, 0, 0]}
              rotation={showEnv ? (configuration.productType === 'keychain' ? [-Math.PI / 2 + 0.15, 0, -0.4] : [0, 0, 0]) : [0, 0, 0]}
              scale={showEnv ? (configuration.productType === 'keychain' ? 0.35 : 0.25) : 1}
            >
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

          <EnvCamera showEnv={showEnv} type={configuration.productType} />

          {!showEnv && (
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              autoRotate
              autoRotateSpeed={0.5}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.8}
              minDistance={2}
              maxDistance={8}
            />
          )}
        </Canvas>
      </div>
      <div className="three-viewer__hint">
        Ziehen zum Drehen · Scrollen zum Zoomen
      </div>
    </div>
  );
}
