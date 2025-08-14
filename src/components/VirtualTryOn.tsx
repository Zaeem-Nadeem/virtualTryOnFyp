import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as THREE from 'three';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-backend-webgl';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { GlassesAdjustments } from '../types';
import { Camera, Download, RotateCcw, Zap, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VirtualTryOnProps {
  glassesImage: string;
  adjustments: GlassesAdjustments;
  onScreenshot: (imageData: string) => void;
}

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ glassesImage, adjustments, onScreenshot }) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const screenshotCanvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<any>(null);
  const [glassesMesh, setGlassesMesh] = useState<THREE.Mesh | null>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Camera Access
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (webcamRef.current) {
          webcamRef.current.video!.srcObject = stream;
        }

        // TensorFlow Model
        await tf.setBackend('webgl');
        const loadedModel = await faceLandmarksDetection.load(
          faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
          {
            shouldLoadIrisModel: true,
            maxFaces: 1,
          }
        );
        setModel(loadedModel);

        // Three.js Setup
        const width = canvasRef.current!.clientWidth;
        const height = canvasRef.current!.clientHeight;
        const newScene = new THREE.Scene();
        const newCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        newCamera.position.z = 5;

        const newRenderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current!,
          alpha: true,
          preserveDrawingBuffer: true,
        });
        newRenderer.setSize(width, height);
        newRenderer.setAnimationLoop(() => newRenderer.render(newScene, newCamera));

        setScene(newScene);
        setCamera(newCamera);
        setRenderer(newRenderer);

        setIsLoading(false);
      } catch (error) {
        console.error('Initialization error:', error);
        setError('Failed to initialize camera and AI model. Please check permissions.');
        setIsLoading(false);
      }
    };

    loadResources();

    return () => {
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!scene || !glassesImage) return;

    // Remove existing glasses mesh
    if (glassesMesh) {
      scene.remove(glassesMesh);
      glassesMesh.geometry.dispose();
      if (glassesMesh.material instanceof THREE.Material) {
        glassesMesh.material.dispose();
      }
    }

    // Glasses Mesh
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      glassesImage,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        const geometry = new THREE.PlaneGeometry(2, 1);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
        });
        const glasses = new THREE.Mesh(geometry, material);
        scene.add(glasses);
        setGlassesMesh(glasses);
      },
      undefined,
      (error) => {
        console.error('Error loading glasses texture:', error);
      }
    );
  }, [scene, glassesImage]);

  useEffect(() => {
    const detectAndPositionGlasses = async () => {
      if (!webcamRef.current || !model || !glassesMesh) return;
      const video = webcamRef.current.video;
      if (!video || video.readyState !== 4) return;

      try {
        const faceEstimates = await model.estimateFaces({ input: video });
        if (faceEstimates.length > 0) {
          setIsLoading(false);
          // Face mesh keypoints
          const keypoints = faceEstimates[0].scaledMesh;
          const leftEye = keypoints[130];
          const rightEye = keypoints[359];
          const eyeCenter = keypoints[168];

          // Eye distance for glasses scaling
          const eyeDistance = Math.sqrt(
            Math.pow(rightEye[0] - leftEye[0], 2) + Math.pow(rightEye[1] - leftEye[1], 2)
          );
          const scaleMultiplier = (eyeDistance / 140) * adjustments.scale;

          // Glasses scaling and offset values
          const scaleX = -0.01;
          const scaleY = -0.01;
          const offsetX = 0.00 + adjustments.offsetX;
          const offsetY = -0.01 + adjustments.offsetY;

          // Glasses positioningnpm r
          glassesMesh.position.x = (eyeCenter[0] - video.videoWidth / 2) * scaleX + offsetX;
          glassesMesh.position.y = (eyeCenter[1] - video.videoHeight / 2) * scaleY + offsetY;
          glassesMesh.scale.set(scaleMultiplier, scaleMultiplier, scaleMultiplier);
          glassesMesh.position.z = 1;

          // Rotate glasses to align with eyes
          const eyeLine = new THREE.Vector2(rightEye[0] - leftEye[0], rightEye[1] - leftEye[1]);
          const rotationZ = Math.atan2(eyeLine.y, eyeLine.x) + adjustments.rotation;
          glassesMesh.rotation.z = rotationZ;
        }
      } catch (error) {
        console.error('Face detection error:', error);
      }
    };

    // Run detection and positioning every 120ms
    const intervalId = setInterval(detectAndPositionGlasses, 120);
    return () => clearInterval(intervalId);
  }, [model, glassesMesh, adjustments]);

  const takeScreenshot = async () => {
    if (!webcamRef.current || !canvasRef.current || !renderer || !model) return;

    setIsCapturing(true);

    try {
      const video = webcamRef.current.video;
      if (!video || video.readyState !== 4) return;

      // Wait for the next frame to ensure everything is rendered
      await new Promise(resolve => requestAnimationFrame(resolve));

      // Create a temporary canvas for combining video and glasses
      const tempCanvas = screenshotCanvasRef.current || document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      // Set canvas size to match the display size (not video size)
      const container = video.parentElement;
      const displayWidth = container?.clientWidth || video.videoWidth;
      const displayHeight = container?.clientHeight || video.videoHeight;
      
      tempCanvas.width = displayWidth;
      tempCanvas.height = displayHeight;

      // Calculate scaling factors
      const scaleX = displayWidth / video.videoWidth;
      const scaleY = displayHeight / video.videoHeight;

      // Draw the video frame (mirrored to match display)
      tempCtx.save();
      tempCtx.scale(-1, 1);
      tempCtx.drawImage(video, -displayWidth, 0, displayWidth, displayHeight);
      tempCtx.restore();

      // Force a render of the Three.js scene to ensure it's up to date
      if (scene && camera) {
        renderer.render(scene, camera);
      }

      // Get the glasses canvas data
      const glassesCanvas = canvasRef.current;
      
      // Draw the glasses overlay on top of the video at the same scale
      if (glassesCanvas) {
        tempCtx.drawImage(glassesCanvas, 0, 0, displayWidth, displayHeight);
      }

      const imageData = tempCanvas.toDataURL('image/png', 1.0);
      onScreenshot(imageData);
    } catch (error) {
      console.error('Screenshot error:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center h-96 bg-red-100/20 backdrop-blur-xl rounded-3xl border border-red-300/30 shadow-ocean"
      >
        <div className="text-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-red-500 text-lg font-medium mb-2"
          >
            ⚠️
          </motion.div>
          <div className="text-red-600 text-lg font-medium mb-2">Camera Error</div>
          <div className="text-red-500 text-sm mb-4">{error}</div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors flex items-center space-x-2 mx-auto shadow-ocean"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry</span>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card rounded-3xl border-sky_blue/20 overflow-hidden shadow-ocean-xl"
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-ocean-card border-b border-sky_blue/20 p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div 
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-selective_yellow to-ut_orange rounded-xl blur opacity-75"></div>
              <div className="relative p-3 bg-gradient-to-r from-selective_yellow to-ut_orange rounded-xl shadow-ocean">
                <Zap className="w-6 h-6 text-prussian_blue" />
              </div>
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-sky_blue">
                AI Virtual Try-On
              </h1>
              <p className="text-sm text-blue_green">Real-time face tracking & AR overlay</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-500/30"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-300 font-medium">Live</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      <div className="relative mx-auto" style={{ width: '100%', maxWidth: '800px', aspectRatio: '1' }}>
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10"
            >
              <div className="text-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="relative mb-6"
                >
                  <div className="w-20 h-20 border-4 border-blue_green/30 rounded-full"></div>
                  <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue_green rounded-full animate-spin"></div>
                </motion.div>
                <motion.div 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-sky_blue font-medium text-lg"
                >
                  Initializing AI Model...
                </motion.div>
                <div className="text-blue_green text-sm mt-2">Please allow camera access</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Webcam
          ref={webcamRef}
          autoPlay
          playsInline
          style={{ width: '100%', height: '100%' }}
          mirrored={true}
          className="rounded-b-3xl"
        />
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          className="rounded-b-3xl"
        />

        {/* Hidden canvas for screenshots */}
        <canvas
          ref={screenshotCanvasRef}
          style={{ display: 'none' }}
        />

        {/* Floating Controls */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-8 right-8 flex items-center space-x-4"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={takeScreenshot}
            disabled={isCapturing}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-selective_yellow to-ut_orange rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-gradient-to-r from-selective_yellow to-ut_orange hover:from-ut_orange hover:to-selective_yellow text-prussian_blue p-4 rounded-full shadow-ocean-xl transition-all duration-200">
              {isCapturing ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Camera className="w-6 h-6" />
              )}
            </div>
          </motion.button>
        </motion.div>

        {/* AR Frame Indicators */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute inset-4 pointer-events-none"
        >
          <div className="absolute top-0 left-0 w-8 h-8 border-l-3 border-t-3 border-blue_green rounded-tl-xl"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-r-3 border-t-3 border-blue_green rounded-tr-xl"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-3 border-b-3 border-blue_green rounded-bl-xl"></div>
          <div className="absolute bottom-0 right-20 w-8 h-8 border-r-3 border-b-3 border-blue_green rounded-br-xl"></div>
        </motion.div>

        {/* Capture Flash Effect */}
        <AnimatePresence>
          {isCapturing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-sky_blue rounded-b-3xl pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default VirtualTryOn;