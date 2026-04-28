import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function Scene() {
  const cube = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (cube.current) cube.current.rotation.y = state.clock.elapsedTime * 0.4;
    if (ringA.current) ringA.current.rotation.z = state.clock.elapsedTime * 0.7;
    if (ringB.current) ringB.current.rotation.x = state.clock.elapsedTime * 0.5;
  });

  return (
    <>
      <mesh ref={cube}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#111" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh ref={ringA}>
        <torusGeometry args={[2.8, 0.03, 16, 100]} />
        <meshStandardMaterial color="#6aa8d8" emissive="#1e4f7e" />
      </mesh>
      <mesh ref={ringB} rotation={[1, 0, 0]}>
        <torusGeometry args={[3.3, 0.03, 16, 100]} />
        <meshStandardMaterial color="#6aa8d8" emissive="#1e4f7e" />
      </mesh>
    </>
  );
}

export default function BlackBox3D() {
  return (
    <div className="canvas-wrap">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <spotLight position={[5, 5, 6]} intensity={1.4} />
        <Scene />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
