import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function FunnelScene() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.25;
  });

  return (
    <group ref={group}>
      <mesh position={[-2.5, 0, 0]}>
        <cylinderGeometry args={[1, 1, 2.5, 48]} />
        <meshStandardMaterial color="#97A97C" />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 3, 48]} />
        <meshStandardMaterial color="#4C7A7A" emissive="#1f2d2d" />
      </mesh>
      <mesh position={[2.5, 0, 0]}>
        <cylinderGeometry args={[1, 1, 2.5, 48]} />
        <meshStandardMaterial color="#0F1E3D" />
      </mesh>
    </group>
  );
}

export default function MoatFunnel3D() {
  return (
    <div className="canvas-wrap">
      <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 3, 4]} intensity={1} />
        <FunnelScene />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.2} />
      </Canvas>
    </div>
  );
}
