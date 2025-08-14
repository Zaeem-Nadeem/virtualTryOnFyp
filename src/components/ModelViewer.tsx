import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Environment, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url }: { url: string }) {
  const gltf = useLoader(GLTFLoader, url);
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (modelRef.current) {
      // Gentle rotation animation
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  useEffect(() => {
    if (gltf.scene) {
      try {
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
                 const scale = 6 / maxDim; // Reduced scale to prevent cutting off
        
        gltf.scene.position.sub(center);
        gltf.scene.scale.setScalar(scale);
      } catch (error) {
        console.error('Error processing 3D model:', error);
      }
    }
  }, [gltf]);

           return (
           <primitive 
             ref={modelRef}
             object={gltf.scene} 
             position={[0, 2, 0]}
           />
         );
}

interface ModelViewerProps {
  modelPath: string;
  className?: string;
}

export default function ModelViewer({ modelPath, className = "" }: ModelViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className={`w-full h-full ${className}`}>
      {isLoading && (
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-professional-deep-lavender mx-auto mb-4"></div>
            <p className="text-professional-medium-lavender text-sm">Loading 3D Model...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-center text-red-500">
            <p>Error loading 3D model: {error}</p>
          </div>
        </div>
      )}
      
                    <Canvas
         camera={{ position: [0, 0, 10], fov: 50 }}
         style={{ background: 'transparent' }}
         onCreated={() => setIsLoading(false)}
         onError={(error) => setError(error.toString())}
         className="w-full h-full"
       >
         <Suspense fallback={null}>
           <ambientLight intensity={0.6} />
           <directionalLight position={[10, 10, 5]} intensity={1} />
           <directionalLight position={[-10, -10, -5]} intensity={0.5} />
           
           <PresentationControls
             global
             rotation={[0, 0, 0]}
             polar={[-Math.PI / 4, Math.PI / 4]}
             azimuth={[-Math.PI / 4, Math.PI / 4]}
             config={{ mass: 2, tension: 400 }}
             snap={{ mass: 4, tension: 400 }}
           >
             <Model url={modelPath} />
           </PresentationControls>
           
           <Environment preset="city" />
         </Suspense>
       </Canvas>
    </div>
  );
}
