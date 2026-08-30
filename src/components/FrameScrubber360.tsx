import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCw, ZoomIn, Info, Shield, Compass, Sparkles, Sliders, ChevronLeft, ChevronRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';

interface FrameScrubber360Props {
  onOpenSpecsModal?: () => void;
}

export const FrameScrubber360: React.FC<FrameScrubber360Props> = ({ onOpenSpecsModal }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [isMagnifierActive, setIsMagnifierActive] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });

  const totalFrames = 60; // 60-step continuous high fidelity 360 sequence
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startFrameRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-spin animation interval
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames);
    }, Math.floor(40 / playbackSpeed));

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, totalFrames]);

  // Pointer drag for manual scrubbing
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startFrameRef.current = currentFrame;
    setIsPlaying(false);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isMagnifierActive && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMagnifierPos({ x, y });
    }

    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    const frameDelta = Math.floor(deltaX / 6);
    let nextFrame = (startFrameRef.current + frameDelta) % totalFrames;
    if (nextFrame < 0) nextFrame += totalFrames;
    setCurrentFrame(nextFrame);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const hotspots = [
    {
      id: 1,
      name: 'Mag-Lock Tactical Strap',
      frameRange: [0, 15],
      x: '50%',
      y: '35%',
      desc: 'High-tensile ballistic nylon with magnetic cyber buckle and micro-ratchet adjustment.',
      tag: 'CHASSIS'
    },
    {
      id: 2,
      name: 'Titanium Multi-Tier Heel Shield',
      frameRange: [22, 38],
      x: '62%',
      y: '48%',
      desc: 'Mirror-polished metallic heel counter with aerodynamic tiered ridges for torsional stability.',
      tag: 'STABILIZER'
    },
    {
      id: 3,
      name: 'Kinetic-Surge Pod Midsole',
      frameRange: [10, 50],
      x: '45%',
      y: '68%',
      desc: 'Tri-density geometric EVA pods absorbing 94% of heel impact and redirecting horizontal shear.',
      tag: 'PROPULSION'
    },
    {
      id: 4,
      name: 'Aero-Grid Carbon Toe Matrix',
      frameRange: [48, 59],
      x: '35%',
      y: '52%',
      desc: 'Seamless dual-layered TPU armor cage over breathable 3D spacer knit mesh.',
      tag: 'UPPER'
    }
  ];

  const currentDegree = Math.round((currentFrame / totalFrames) * 360);

  return (
    <section id="turntable-section" className="relative py-20 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block w-2 h-2 bg-red-600 rounded-full animate-ping" />
            <span className="text-xs font-mono-tech uppercase tracking-[0.2em] text-red-600">360° PRECISION SCAN</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tighter text-white uppercase">
            EXPLORE THE <span className="text-gradient-red">CHASSIS</span>
          </h2>
        </div>
        <p className="text-white/40 max-w-md text-sm md:text-base leading-relaxed">
          Scrub through the 360-degree rotation studio. Inspect the architectural midsole waveforms, aerospace chrome plating, and tactical mag-lock harness.
        </p>
      </div>

      {/* Main Turntable Stage Container */}
      <div className="relative rounded-3xl bg-[#08080a] border border-white/10 overflow-hidden shadow-2xl">
        {/* Background Gradients & Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-25" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-radial-gradient opacity-60 pointer-events-none" />

        {/* Top Info Bar */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-mono-tech text-white/70">
            <Compass className="w-3.5 h-3.5 text-red-600" />
            <span>AZIMUTH: <strong className="text-white">{currentDegree}°</strong></span>
            <span className="text-white/20">|</span>
            <span>FRAME: <strong className="text-white">{currentFrame + 1}</strong> / {totalFrames}</span>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <button
              id="magnifier-toggle-btn"
              onClick={() => {
                setIsMagnifierActive(!isMagnifierActive);
                soundEngine.playClick();
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono-tech uppercase tracking-wider transition-all border cursor-pointer ${
                isMagnifierActive
                  ? 'bg-red-600 text-white border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)]'
                  : 'bg-black/70 text-white/50 border-white/10 hover:text-white hover:border-white/30'
              }`}
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">LOUPE ZOOM</span>
            </button>
          </div>
        </div>

        {/* 360 Scrubber Interactive Area */}
        <div
          ref={containerRef}
          id="turntable-drag-canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative w-full h-[380px] sm:h-[480px] md:h-[580px] flex items-center justify-center cursor-ew-resize touch-none select-none"
        >
          {/* Dynamic 3D Sneaker Visualization Canvas */}
          <div className="relative w-full max-w-2xl h-full flex items-center justify-center p-6">
            {/* SVG Interactive Render with Dynamic Rotation Angle */}
            <div 
              className="relative w-full h-full flex items-center justify-center transition-transform duration-75"
              style={{
                perspective: '1200px',
              }}
            >
              <div 
                className="relative w-full max-w-lg aspect-[4/3] rounded-2xl flex items-center justify-center overflow-hidden"
                style={{
                  transform: `rotateY(${currentDegree}deg) rotateX(${Math.sin((currentFrame / totalFrames) * Math.PI * 2) * 5}deg)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* SVG Silhouette / Architectural Wireframe / Photorealistic Sneaker Artwork */}
                <svg
                  viewBox="0 0 800 550"
                  className="w-full h-full drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)] filter transition-all duration-100"
                  style={{
                    filter: `drop-shadow(0 20px 30px rgba(255,30,39,${0.15 + Math.sin(currentDegree * 0.05) * 0.1}))`,
                  }}
                >
                  <defs>
                    <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="30%" stopColor="#94a3b8" />
                      <stop offset="70%" stopColor="#e2e8f0" />
                      <stop offset="100%" stopColor="#475569" />
                    </linearGradient>
                    <linearGradient id="redGlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ff1e27" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#ff6b72" stopOpacity="1" />
                      <stop offset="100%" stopColor="#e60012" stopOpacity="0.9" />
                    </linearGradient>
                    <linearGradient id="carbonSoleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#1c1c22" />
                      <stop offset="50%" stopColor="#111115" />
                      <stop offset="100%" stopColor="#08080a" />
                    </linearGradient>
                    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="8" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Ground Shadow Ellipse */}
                  <ellipse cx="400" cy="460" rx="320" ry="25" fill="#000000" opacity="0.6" />
                  <ellipse cx="400" cy="460" rx="200" ry="12" fill="#ff1e27" opacity="0.15" filter="url(#neonGlow)" />

                  {/* Sculptural Midsole Layer (Wave forms from user video) */}
                  <path
                    d="M 160 380 Q 220 370 280 410 Q 360 430 450 390 Q 550 400 660 360 Q 680 380 660 415 Q 560 450 430 445 Q 310 460 200 440 Q 140 430 160 380 Z"
                    fill="url(#carbonSoleGrad)"
                    stroke="#27272a"
                    strokeWidth="3"
                  />

                  {/* Midsole Heel Tiered Teeth (Matching video chunky sole) */}
                  <path d="M 180 395 L 240 395 L 230 430 L 170 425 Z" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
                  <path d="M 250 405 L 310 412 L 300 445 L 240 435 Z" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
                  <path d="M 320 415 L 390 418 L 380 450 L 310 447 Z" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
                  <path d="M 460 395 L 530 385 L 540 425 L 470 435 Z" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
                  <path d="M 545 380 L 620 365 L 625 405 L 555 420 Z" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />

                  {/* LED Air Chamber Core */}
                  <rect x="210" y="395" width="110" height="24" rx="8" fill="url(#redGlowGrad)" filter="url(#neonGlow)" />
                  <rect x="215" y="398" width="100" height="18" rx="6" fill="#ffffff" opacity="0.8" />

                  {/* Upper Shoe Silhouette */}
                  <path
                    d="M 190 380 C 170 340 180 260 230 220 C 270 190 330 250 370 270 C 430 290 520 310 610 340 C 660 355 670 370 655 385 Z"
                    fill="#121217"
                    stroke="#27272a"
                    strokeWidth="2"
                  />

                  {/* Ankle Collar & Heel Cushion */}
                  <path
                    d="M 230 220 C 220 180 260 150 300 170 C 330 185 350 230 370 270 Z"
                    fill="#09090b"
                    stroke="#3f3f46"
                    strokeWidth="2"
                  />

                  {/* Heel Pull Tab */}
                  <path d="M 215 190 Q 190 170 205 145 Q 225 155 235 180 Z" fill="#27272a" stroke="#ff1e27" strokeWidth="2" />

                  {/* Rear Chrome Heel Stabilizer with Tiered Horizontal Ridges ("PREMIUM" Badge) */}
                  <g>
                    <path d="M 160 360 C 150 310 180 280 210 290 C 230 330 220 370 175 380 Z" fill="url(#chromeGrad)" />
                    <line x1="165" y1="310" x2="205" y2="305" stroke="#ffffff" strokeWidth="3" />
                    <line x1="162" y1="330" x2="212" y2="325" stroke="#ffffff" strokeWidth="3" />
                    <line x1="165" y1="350" x2="210" y2="345" stroke="#ffffff" strokeWidth="3" />
                    <line x1="170" y1="368" x2="200" y2="364" stroke="#ffffff" strokeWidth="2.5" />
                    {/* Badge text */}
                    <text x="182" y="340" fill="#08080a" fontSize="9" fontWeight="900" fontFamily="Syne" letterSpacing="1" transform="rotate(-10 182 340)">KINETIX</text>
                  </g>

                  {/* Tactical Instep Strap with Buckle */}
                  <g>
                    <path d="M 370 250 L 440 275 L 430 315 L 360 290 Z" fill="#27272a" stroke="#52525b" strokeWidth="2" />
                    <rect x="390" y="260" width="35" height="28" rx="4" fill="url(#chromeGrad)" stroke="#18181b" strokeWidth="2" />
                    <line x1="407" y1="264" x2="407" y2="284" stroke="#ff1e27" strokeWidth="3" />
                  </g>

                  {/* Laces Assembly */}
                  <g stroke="#ffffff" strokeWidth="4" strokeLinecap="round">
                    <line x1="440" y1="285" x2="480" y2="295" />
                    <line x1="480" y1="295" x2="520" y2="305" />
                    <line x1="520" y1="305" x2="560" y2="318" />
                    <line x1="560" y1="318" x2="600" y2="330" />
                  </g>

                  {/* Red Cybernetic Piping & Accents */}
                  <path
                    d="M 310 270 Q 420 310 520 325 Q 580 340 640 365"
                    fill="none"
                    stroke="#ff1e27"
                    strokeWidth="3"
                    filter="url(#neonGlow)"
                  />
                  <circle cx="640" cy="365" r="4" fill="#ffffff" />
                  <circle cx="310" cy="270" r="4" fill="#ffffff" />
                </svg>

                {/* Hotspot Floating Markers */}
                {hotspots.map((hs) => (
                  <div
                    key={hs.id}
                    className="absolute transition-all duration-300 z-30"
                    style={{ left: hs.x, top: hs.y }}
                  >
                    <button
                      id={`hotspot-${hs.id}-btn`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHotspot(activeHotspot === hs.id ? null : hs.id);
                        soundEngine.playClick();
                      }}
                      className="group relative flex items-center justify-center w-7 h-7 rounded-full bg-black/80 border border-[#ff1e27] text-white shadow-[0_0_15px_rgba(255,30,39,0.8)] hover:scale-125 transition-transform"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#ff1e27] group-hover:scale-150 transition-transform" />
                      <span className="sr-only">{hs.name}</span>
                    </button>

                    {/* Popover Card */}
                    <AnimatePresence>
                      {activeHotspot === hs.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.95 }}
                          className="absolute bottom-9 left-1/2 -translate-x-1/2 w-64 p-3.5 rounded-xl bg-black/90 backdrop-blur-xl border border-white/20 shadow-2xl text-left z-40"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="px-2 py-0.5 rounded bg-[#ff1e27]/20 border border-[#ff1e27]/40 text-[10px] font-mono-tech text-[#ff1e27]">
                              {hs.tag}
                            </span>
                            <span className="text-[10px] font-mono-tech text-neutral-500">SPEC_ID // 0{hs.id}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white font-display">{hs.name}</h4>
                          <p className="text-xs text-neutral-300 mt-1 leading-relaxed">{hs.desc}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Magnifier Lens Overlay */}
          {isMagnifierActive && (
            <div
              className="pointer-events-none absolute w-48 h-48 rounded-full border-2 border-[#ff1e27] overflow-hidden shadow-[0_0_30px_rgba(255,30,39,0.5)] z-40 bg-black"
              style={{
                left: `calc(${magnifierPos.x}% - 96px)`,
                top: `calc(${magnifierPos.y}% - 96px)`,
              }}
            >
              <div
                className="w-[300%] h-[300%] absolute flex items-center justify-center"
                style={{
                  left: `${-magnifierPos.x * 2}%`,
                  top: `${-magnifierPos.y * 2}%`,
                }}
              >
                <div className="w-96 h-64 bg-radial-gradient flex items-center justify-center text-white font-mono-tech text-sm">
                  [ ULTRA-RES CARBON GRAIN INSPECTION ]
                </div>
              </div>
              <div className="absolute inset-0 border border-white/20 rounded-full" />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono-tech text-[#ff1e27] bg-black/80 px-2 py-0.5 rounded">
                3.5X OPTICAL
              </div>
            </div>
          )}
        </div>

        {/* Bottom Playback & Scrubber Controls Bar */}
        <div className="p-4 sm:p-6 bg-black/80 backdrop-blur-xl border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Play/Pause & Speed Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <button
              id="turntable-play-toggle"
              onClick={() => {
                setIsPlaying(!isPlaying);
                soundEngine.playClick();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#ff1e27] hover:text-white transition-all shadow-lg"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'PAUSE ROTATION' : 'RESUME ROTATION'}</span>
            </button>

            {/* Speed Multipliers */}
            <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-white/10 text-xs font-mono-tech">
              {[0.5, 1, 2].map((spd) => (
                <button
                  key={spd}
                  id={`speed-${spd}x-btn`}
                  onClick={() => {
                    setPlaybackSpeed(spd);
                    soundEngine.playClick();
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    playbackSpeed === spd
                      ? 'bg-[#ff1e27] text-white font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {spd}X
                </button>
              ))}
            </div>
          </div>

          {/* Scrub Slider */}
          <div className="flex items-center gap-3 w-full md:max-w-md">
            <button
              onClick={() => {
                setCurrentFrame((prev) => (prev - 1 + totalFrames) % totalFrames);
                setIsPlaying(false);
                soundEngine.playClick();
              }}
              className="p-1.5 rounded-lg bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white"
              title="Previous Frame"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="relative flex-1 flex items-center">
              <input
                id="turntable-scrubber-slider"
                type="range"
                min="0"
                max={totalFrames - 1}
                value={currentFrame}
                onChange={(e) => {
                  setCurrentFrame(parseInt(e.target.value, 10));
                  setIsPlaying(false);
                }}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#ff1e27]"
              />
            </div>

            <button
              onClick={() => {
                setCurrentFrame((prev) => (prev + 1) % totalFrames);
                setIsPlaying(false);
                soundEngine.playClick();
              }}
              className="p-1.5 rounded-lg bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white"
              title="Next Frame"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Technical Specs Trigger */}
          <button
            id="view-anatomy-btn"
            onClick={onOpenSpecsModal}
            className="flex items-center gap-1.5 text-xs font-mono-tech text-neutral-300 hover:text-[#ff1e27] transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
          >
            <Sliders className="w-3.5 h-3.5 text-[#ff1e27]" />
            <span>FULL ANATOMY BENCHMARK</span>
          </button>
        </div>
      </div>
    </section>
  );
};
