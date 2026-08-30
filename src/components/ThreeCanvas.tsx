import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { CustomizerState, TechHotspot } from '../types';
import { createShoe3D, ShoePartMesh } from './ShoeModel';
import { soundEngine } from '../utils/audio';
import { RotateCw, Eye, Sparkles, Layers, RefreshCw, ZoomIn, ZoomOut, Zap } from 'lucide-react';

interface ThreeCanvasProps {
  config: CustomizerState;
  exploded?: boolean;
  onExplodedChange?: (val: boolean) => void;
  autoRotate?: boolean;
  activePartId?: string | null;
  onSelectPart?: (partId: string) => void;
  cameraPreset?: 'hero' | 'side' | 'heel' | 'top' | 'front';
  height?: string;
  showControlsOverlay?: boolean;
  hotspots?: TechHotspot[];
  onSelectHotspot?: (hotspot: TechHotspot) => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  config,
  exploded = false,
  onExplodedChange,
  autoRotate: initialAutoRotate = true,
  activePartId,
  onSelectPart,
  cameraPreset = 'hero',
  height = 'h-[500px] md:h-[650px]',
  showControlsOverlay = true,
  hotspots = [],
  onSelectHotspot,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(initialAutoRotate);
  const [isExploded, setIsExploded] = useState(exploded);
  const [activePreset, setActivePreset] = useState<string>(cameraPreset);
  const [hoveredHotspot, setHoveredHotspot] = useState<TechHotspot | null>(null);

  // References for Three.js instance
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const shoeInstanceRef = useRef<ReturnType<typeof createShoe3D> | null>(null);
  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.2, y: -0.6 });
  const currentRotationRef = useRef({ x: 0.2, y: -0.6 });
  const zoomLevelRef = useRef(1);
  const explosionProgressRef = useRef(0);
  const groundRingLightRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  // Sync external exploded prop
  useEffect(() => {
    setIsExploded(exploded);
  }, [exploded]);

  // Update materials when config changes
  useEffect(() => {
    if (shoeInstanceRef.current) {
      shoeInstanceRef.current.updateMaterials(config);
    }
  }, [config]);

  // Camera presets
  const applyPreset = useCallback((preset: 'hero' | 'side' | 'heel' | 'top' | 'front') => {
    setActivePreset(preset);
    soundEngine.playSwoosh();
    switch (preset) {
      case 'hero':
        targetRotationRef.current = { x: 0.2, y: -0.6 };
        break;
      case 'side':
        targetRotationRef.current = { x: 0.05, y: -Math.PI / 2 };
        break;
      case 'heel':
        targetRotationRef.current = { x: 0.1, y: Math.PI * 0.95 };
        break;
      case 'top':
        targetRotationRef.current = { x: Math.PI / 2.2, y: -0.2 };
        break;
      case 'front':
        targetRotationRef.current = { x: 0.1, y: 0.0 };
        break;
    }
  }, []);

  useEffect(() => {
    if (cameraPreset) {
      applyPreset(cameraPreset);
    }
  }, [cameraPreset, applyPreset]);

  // Initialize Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.4, 4.8);
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Lighting Rig (Studio Red / White Contrast)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Key Light (Clean White Studio light from top-front)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Rim Light (Crimson Red Cybernetic Glow from back-left)
    const rimRedLight = new THREE.DirectionalLight(0xff1e27, 3.5);
    rimRedLight.position.set(-3.5, 2, -2.5);
    scene.add(rimRedLight);

    // Fill Light (Cool White / Chrome highlight from low-right)
    const fillLight = new THREE.DirectionalLight(0xe2e8f0, 1.2);
    fillLight.position.set(2, -1, -2);
    scene.add(fillLight);

    // Point Light under sneaker for LED ground reflection
    const underglow = new THREE.PointLight(0xff1e27, 2, 4);
    underglow.position.set(0, -0.6, 0);
    scene.add(underglow);

    // 4. Ground Shadow & Circular Reflection Pod
    const groundGeo = new THREE.PlaneGeometry(8, 8);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const groundPlane = new THREE.Mesh(groundGeo, groundMat);
    groundPlane.rotation.x = -Math.PI / 2;
    groundPlane.position.y = -0.9;
    groundPlane.receiveShadow = true;
    scene.add(groundPlane);

    // Glowing Holographic Pedestal Ring
    const ringGeo = new THREE.RingGeometry(1.6, 1.68, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff1e27,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const groundRing = new THREE.Mesh(ringGeo, ringMat);
    groundRing.rotation.x = -Math.PI / 2;
    groundRing.position.y = -0.89;
    scene.add(groundRing);
    groundRingLightRef.current = groundRing;

    // 5. Floating Dust / Cyber Particles
    const particleCount = 75;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 6;
      particlePos[i + 1] = Math.random() * 3 - 0.5;
      particlePos[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xff4b55,
      size: 0.03,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 6. Create 3D Shoe
    const shoeInstance = createShoe3D(config);
    shoeInstanceRef.current = shoeInstance;
    scene.add(shoeInstance.shoeGroup);

    // 7. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Auto-rotation when not dragging
      if (autoRotate && !isDraggingRef.current) {
        targetRotationRef.current.y += delta * 0.45;
      }

      // Smooth rotation damping (Lerp)
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.08;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.08;

      if (shoeInstanceRef.current) {
        shoeInstanceRef.current.shoeGroup.rotation.x = currentRotationRef.current.x;
        shoeInstanceRef.current.shoeGroup.rotation.y = currentRotationRef.current.y;

        // Subtle floating breathing effect
        if (!isExploded) {
          shoeInstanceRef.current.shoeGroup.position.y = Math.sin(time * 1.8) * 0.04;
        }

        // Exploded view animation lerp
        const targetExp = isExploded ? 1.0 : 0.0;
        explosionProgressRef.current += (targetExp - explosionProgressRef.current) * 0.08;

        shoeInstanceRef.current.parts.forEach((part: ShoePartMesh) => {
          part.mesh.position.lerpVectors(
            part.basePos,
            part.basePos.clone().add(part.explodedOffset),
            explosionProgressRef.current
          );
        });
      }

      // Particles ambient drift
      if (particlesRef.current) {
        particlesRef.current.rotation.y = time * 0.05;
      }

      // Pulse pedestal ring
      if (groundRingLightRef.current) {
        (groundRingLightRef.current.material as THREE.MeshBasicMaterial).opacity =
          0.35 + Math.sin(time * 3) * 0.15;
      }

      // Update Underglow color based on config
      underglow.color.set(config.glowColor);

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler using ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !camera || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Drag Controls Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    prevPointerRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevPointerRef.current.x;
    const deltaY = e.clientY - prevPointerRef.current.y;

    targetRotationRef.current.y += deltaX * 0.008;
    targetRotationRef.current.x = Math.max(-0.6, Math.min(0.9, targetRotationRef.current.x + deltaY * 0.008));

    prevPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!cameraRef.current) return;
    const zoomDelta = e.deltaY * 0.002;
    const newZ = Math.max(2.8, Math.min(7.0, cameraRef.current.position.z + zoomDelta));
    cameraRef.current.position.z = newZ;
    zoomLevelRef.current = 4.8 / newZ;
  };

  const toggleExploded = () => {
    const nextVal = !isExploded;
    setIsExploded(nextVal);
    soundEngine.playExplode();
    if (onExplodedChange) onExplodedChange(nextVal);
  };

  const toggleRotation = () => {
    setAutoRotate(!autoRotate);
    soundEngine.playClick();
  };

  const zoomCamera = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    soundEngine.playClick();
    const factor = direction === 'in' ? -0.6 : 0.6;
    cameraRef.current.position.z = Math.max(2.8, Math.min(7.0, cameraRef.current.position.z + factor));
  };

  return (
    <div className={`relative w-full ${height} select-none overflow-hidden rounded-2xl bg-gradient-to-b from-[#0e0e12] via-[#08080a] to-[#040405] border border-white/5`}>
      {/* 3D Canvas Mounting Point */}
      <div
        ref={mountRef}
        id="shoe-3d-canvas-container"
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      />

      {/* Cyber Grid & Glowing Accents Background */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-40" />
      <div className="pointer-events-none absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#ff1e27]/20 blur-[100px] rounded-full" />

      {/* Top Left HUD Telemetry Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono-tech text-white">
          <span className="w-2 h-2 rounded-full bg-[#ff1e27] animate-pulse" />
          <span>3D_ENGINE_v4.2</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/5 text-[11px] font-mono-tech text-neutral-400">
          <Zap className="w-3 h-3 text-[#ff1e27]" />
          <span>PBR_RAYTRACED</span>
        </div>
      </div>

      {/* Camera Presets Toolbar */}
      {showControlsOverlay && (
        <div className="absolute bottom-4 left-4 z-10 flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-black/70 backdrop-blur-lg border border-white/10">
          {(['hero', 'side', 'heel', 'top', 'front'] as const).map((preset) => (
            <button
              key={preset}
              id={`preset-${preset}-btn`}
              onClick={() => applyPreset(preset)}
              className={`px-2.5 py-1 text-xs font-mono-tech uppercase rounded-lg transition-all ${
                activePreset === preset
                  ? 'bg-[#ff1e27] text-white font-bold shadow-[0_0_12px_rgba(255,30,39,0.5)]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      )}

      {/* Top Right Action Tools */}
      {showControlsOverlay && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {/* Exploded View Toggle */}
          <button
            id="toggle-exploded-view-btn"
            onClick={toggleExploded}
            title="Exploded Anatomy View"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium backdrop-blur-md transition-all border ${
              isExploded
                ? 'bg-[#ff1e27] text-white border-[#ff1e27] shadow-[0_0_16px_rgba(255,30,39,0.5)]'
                : 'bg-black/60 text-neutral-300 border-white/10 hover:border-white/30 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">EXPLODED VIEW</span>
          </button>

          {/* Auto Rotation Toggle */}
          <button
            id="toggle-rotation-btn"
            onClick={toggleRotation}
            title={autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
            className={`p-2 rounded-xl text-xs backdrop-blur-md transition-all border ${
              autoRotate
                ? 'bg-[#ff1e27]/20 text-[#ff1e27] border-[#ff1e27]/40'
                : 'bg-black/60 text-neutral-400 border-white/10 hover:text-white'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          </button>

          {/* Zoom Buttons */}
          <button
            id="zoom-in-btn"
            onClick={() => zoomCamera('in')}
            className="p-2 rounded-xl bg-black/60 text-neutral-300 border border-white/10 hover:text-white hover:border-white/30 transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            id="zoom-out-btn"
            onClick={() => zoomCamera('out')}
            className="p-2 rounded-xl bg-black/60 text-neutral-300 border border-white/10 hover:text-white hover:border-white/30 transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Drag Instruction Banner on first view */}
      <div className="pointer-events-none absolute bottom-4 right-4 z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/5 text-[11px] font-mono-tech text-neutral-400">
        <RefreshCw className="w-3 h-3 animate-spin text-[#ff1e27]" style={{ animationDuration: '10s' }} />
        <span>DRAG TO ROTATE 360° // SCROLL TO ZOOM</span>
      </div>
    </div>
  );
};
