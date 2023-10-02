'use client';

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Center } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { CubeCamera, Environment } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  TiltShift2,
} from "@react-three/postprocessing";
// @ts-ignore
import { Astronaut } from "@/app/walking-astronaut/Astronaut.tsx";
// @ts-ignore
import { Ground } from "@/app/walking-astronaut/Ground.tsx"
import styles from '@/app/walking-astronaut/styles.module.css'

function Rings() {
  const itemsRef = useRef([]);

  useFrame((state) => {
    for (let i = 0; i < itemsRef.current.length; i++) {
      let mesh = itemsRef.current[i];

      // @ts-ignore
      mesh.rotation.x = state.clock.elapsedTime + 2*Math.PI*i/itemsRef.current.length;
      // @ts-ignore
      mesh.rotation.y = state.clock.elapsedTime*0.4 + 2*Math.PI*i/itemsRef.current.length;
    }
  });

  return (
    <>
      {[0, 0, 0, 0, 0].map((v, i) => (
        <mesh
          castShadow
          receiveShadow
          position={[0, 0, 0]}
          rotation = {[0,i/5,0]}
          key={i}
          // @ts-ignore
          ref={(el) => (itemsRef.current[i] = el)}
        >
          <torusGeometry args={[3.35 + i / 10, 0.05, 16, 100]} />
          <meshStandardMaterial emissive={[1, 0.1, 0.4]} color={[1, i%2, i%2]}  />
        </mesh>
      ))}
    </>
  );
}

export default function WalkingAstronaut() {
  return (
    <Canvas className={styles.canvas} shadows>
      <color attach="background" args={["black"]} />

      <OrbitControls />
      <ambientLight intensity={0.5} />

      <Rings />

      <spotLight
        color={[1, 0.25, 0.7]}
        intensity={35}
        angle={0.6}
        penumbra={0.5}
        position={[5, 5, 0]}
        castShadow
        shadow-bias={-0.0001}
      />
      <spotLight
        color={[0.16, 0.5, 1]}
        intensity={20}
        angle={0.6}
        penumbra={0.5}
        position={[-5, 5, 0]}
        castShadow
        shadow-bias={-0.0001}
      />


      <CubeCamera resolution={256} frames={Infinity} position={[0, 0, -1]}>
        {(texture) => (
          <>
            <Environment map={texture} />
            <Center>
              <Astronaut position={[0,0,0]}  />
            </Center>
          </>
        )}
      </CubeCamera>

      <Ground />

       <EffectComposer>
        <Bloom mipmapBlur radius={0.75} luminanceThreshold={1} intensity={0.5}  />
        <TiltShift2 />

      </EffectComposer>
    </Canvas>
  );
}
