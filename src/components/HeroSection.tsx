import React, { useState } from 'react';
import { ThreeCanvas } from './ThreeCanvas';
import { CustomizerState, Colorway } from '../types';
import { soundEngine } from '../utils/audio';
import { ArrowRight, Sparkles, Volume2, VolumeX, Shield, Zap, Layers, Activity } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  config: CustomizerState;
  onConfigChange: (newConfig: CustomizerState) => void;
  colorways: Colorway[];
  activeColorway: Colorway;
  onSelectColorway: (cw: Colorway) => void;
  onOpenCustomizer: () => void;
  onAddToCart: (cw: Colorway) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  config,
  onConfigChange,
  colorways,
  activeColorway,
  onSelectColorway,
  onOpenCustomizer,
  onAddToCart,
}) => {
  const [isMuted, setIsMuted] = useState(!soundEngine.enabled);
  const [isExploded, setIsExploded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<number>(44); // EU 44 / US 9.5

  const toggleSound = () => {
    const isEnabled = soundEngine.toggleSound();
    setIsMuted(!isEnabled);
  };

  const euSizes = [41, 42, 43, 44, 45, 46];

  return (
    <section className="relative min-h-[88vh] flex flex-col justify-between pt-24 pb-8 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto overflow-hidden">
      {/* Background Ambience & Red Atmospheric Glow */}
      <div className="absolute top-[15%] left-[10%] w-[550px] md:w-[750px] h-[550px] bg-red-600/20 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Main Elegant Dark Grid (Left Info, Center 3D Stage with Orbital Rings, Right Telemetry) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center my-auto">
        {/* Left Column (Cols 1-4): Title, Description, Size & Swatches */}
        <div className="lg:col-span-4 flex flex-col justify-center z-10 space-y-6">
          <div>
            <span className="text-red-600 text-xs font-bold uppercase tracking-widest mb-3 block">
              SEASON 2026 / ELITE SERIES
            </span>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black leading-[0.85] tracking-tighter mb-4 text-white uppercase font-display">
              KINETIX<br />APEX<span className="text-red-600">.01</span>
            </h1>
            <p className="text-white/40 text-sm max-w-xs leading-relaxed">
              Engineered for the vertical leap. Integrated carbon-fiber plating with high-rebound supercritical kinetic cushioning.
            </p>
          </div>

          {/* Size & Color Swatches Box */}
          <div className="flex flex-col gap-5 pt-2 border-t border-white/10">
            {/* Size Selector */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white flex items-center justify-center text-black font-black text-base font-mono-tech shadow-lg">
                {selectedSize}
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-white/60 font-mono-tech">
                  SELECT SIZE (EU)
                </div>
                <div className="flex gap-1.5 mt-1">
                  {euSizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => {
                        setSelectedSize(sz);
                        soundEngine.playClick();
                      }}
                      className={`text-[10px] font-mono-tech px-1.5 py-0.5 border transition-colors cursor-pointer ${selectedSize === sz
                          ? 'border-white text-white bg-white/10 font-bold'
                          : 'border-white/15 text-white/40 hover:text-white hover:border-white/40'
                        }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Colorway Swatches */}
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2 font-mono-tech">
                EDITION // {activeColorway.name}
              </div>
              <div className="flex gap-2.5 items-center">
                {colorways.map((cw) => (
                  <button
                    key={cw.id}
                    id={`hero-colorway-${cw.id}`}
                    onClick={() => {
                      onSelectColorway(cw);
                      soundEngine.playChime();
                    }}
                    className={`w-8 h-8 rounded-full transition-all cursor-pointer flex items-center justify-center ${activeColorway.id === cw.id
                        ? 'border-2 border-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                        : 'border-2 border-transparent hover:border-white/40 opacity-70 hover:opacity-100'
                      }`}
                    style={{ backgroundColor: cw.primaryColor }}
                    title={cw.name}
                  >
                    {activeColorway.id === cw.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center Column (Cols 5-9): 3D Interactive Model + Orbital Circles */}
        <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px] sm:min-h-[460px] lg:min-h-[520px]">
          {/* Concentric Orbital Rings */}
          <div className="w-[130%] aspect-square border border-white/5 rounded-full absolute pointer-events-none"></div>
          <div className="w-[105%] aspect-square border border-white/10 rounded-full absolute pointer-events-none"></div>
          <div className="w-[80%] aspect-square border border-red-600/10 rounded-full absolute pointer-events-none"></div>

          {/* 3D Canvas Viewport */}
          <div className="w-full relative z-20">
            <ThreeCanvas
              config={config}
              exploded={isExploded}
              onExplodedChange={setIsExploded}
              cameraPreset="hero"
              height="h-[360px] sm:h-[440px] lg:h-[480px]"
            />
          </div>
        </div>

        {/* Right Column (Cols 10-12): Linear Telemetry Progress Bars & Secure Pair CTA */}
        <div className="lg:col-span-3 flex flex-col justify-center gap-6 z-10">
          {/* Telemetry Metric 1 */}
          <div className="space-y-2">
            <div className="flex justify-between items-end border-b border-white/10 pb-1.5">
              <span className="text-[10px] uppercase text-white/40 tracking-widest font-mono-tech">STABILITY</span>
              <span className="text-sm font-mono-tech font-bold text-white">98%</span>
            </div>
            <div className="w-full h-1 bg-white/10 relative">
              <div className="absolute left-0 top-0 h-full w-[98%] bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></div>
            </div>
          </div>

          {/* Telemetry Metric 2 */}
          <div className="space-y-2">
            <div className="flex justify-between items-end border-b border-white/10 pb-1.5">
              <span className="text-[10px] uppercase text-white/40 tracking-widest font-mono-tech">WEIGHT</span>
              <span className="text-sm font-mono-tech font-bold text-white">240g</span>
            </div>
            <div className="w-full h-1 bg-white/10 relative">
              <div className="absolute left-0 top-0 h-full w-[45%] bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
            </div>
          </div>

          {/* Telemetry Metric 3 */}
          <div className="space-y-2">
            <div className="flex justify-between items-end border-b border-white/10 pb-1.5">
              <span className="text-[10px] uppercase text-white/40 tracking-widest font-mono-tech">TRACTION</span>
              <span className="text-sm font-mono-tech font-bold text-white">MAX</span>
            </div>
            <div className="w-full h-1 bg-white/10 relative">
              <div className="absolute left-0 top-0 h-full w-[85%] bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></div>
            </div>
          </div>

          {/* Telemetry Metric 4 */}
          <div className="space-y-2">
            <div className="flex justify-between items-end border-b border-white/10 pb-1.5">
              <span className="text-[10px] uppercase text-white/40 tracking-widest font-mono-tech">ENERGY RETURN</span>
              <span className="text-sm font-mono-tech font-bold text-white">89.4%</span>
            </div>
            <div className="w-full h-1 bg-white/10 relative">
              <div className="absolute left-0 top-0 h-full w-[89.4%] bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></div>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            id="hero-buy-now-btn"
            onClick={() => onAddToCart(activeColorway)}
            className="bg-red-600 hover:bg-red-700 text-white py-5 px-6 text-xs sm:text-sm font-bold uppercase tracking-[0.3em] flex justify-between items-center group transition-all mt-2 cursor-pointer shadow-[0_0_30px_rgba(220,38,38,0.4)]"
          >
            <span>SECURE PAIR</span>
            <span className="text-lg group-hover:translate-x-1.5 transition-transform">→</span>
          </button>

          {/* Secondary Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              id="hero-customizer-btn"
              onClick={onOpenCustomizer}
              className="text-[11px] font-mono-tech uppercase tracking-widest text-white/60 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>CUSTOM 3D LAB</span>
            </button>

            <button
              id="hero-sound-toggle-btn"
              onClick={toggleSound}
              className="text-[11px] font-mono-tech uppercase tracking-widest text-white/40 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {!isMuted ? <Volume2 className="w-3.5 h-3.5 text-red-600" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{!isMuted ? 'AUDIO ON' : 'AUDIO OFF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Sub-bar Metadata */}
      <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium font-mono-tech gap-3">
        <div className="flex gap-8">
          <span>MODEL NO. 042-99</span>
          <span>GLOBAL EXPRESS SHIPPING</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white font-bold">PRICE: ${activeColorway.price}.00</span>
          <div className="w-px h-3 bg-white/20"></div>
          <span className="text-white/60">IN STOCK: 14 UNITS</span>
        </div>
      </div>
    </section>
  );
};
