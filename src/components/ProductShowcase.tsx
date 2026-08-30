import React, { useState } from 'react';
import { Colorway } from '../types';
import { soundEngine } from '../utils/audio';
import { ShoppingBag, ArrowRight, Star, Sparkles, Check, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface ProductShowcaseProps {
  colorways: Colorway[];
  onSelectColorway: (cw: Colorway) => void;
  onAddToCart: (cw: Colorway, size: number) => void;
  onOpenCustomizer: () => void;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  colorways,
  onSelectColorway,
  onAddToCart,
  onOpenCustomizer,
}) => {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({
    'k01-apex': 9.5,
    'k01-inferno': 10,
    'k01-ghost': 9.5,
    'k01-venom': 10.5,
  });

  const availableSizes = [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13];

  const handleSizeChange = (cwId: string, size: number) => {
    soundEngine.playClick();
    setSelectedSizes((prev) => ({ ...prev, [cwId]: size }));
  };

  const handleBuy = (cw: Colorway) => {
    const size = selectedSizes[cw.id] || 9.5;
    soundEngine.playChime();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: [cw.primaryColor, '#ffffff', '#ff1e27'],
    });
    onAddToCart(cw, size);
  };

  return (
    <section id="collection-section" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <span className="text-xs font-mono-tech uppercase text-red-600 tracking-[0.2em] block mb-2 font-bold">
            // DROP EDITIONS ARCHIVE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tighter text-white uppercase">
            THE APEX <span className="text-gradient-red">LINEUP</span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-white/40 text-sm max-w-xs leading-relaxed">
            Four hyper-calibrated colorways engineered for street dominance and vertical acceleration.
          </p>
          <button
            id="collection-open-bespoke-btn"
            onClick={onOpenCustomizer}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-transparent text-white font-mono-tech text-xs uppercase tracking-widest hover:bg-white/10 border border-white/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>CUSTOM LAB</span>
          </button>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {colorways.map((cw) => {
          const currentSize = selectedSizes[cw.id] || 9.5;
          return (
            <div
              key={cw.id}
              id={`product-card-${cw.id}`}
              className="group relative bg-[#08080a] border border-white/10 overflow-hidden hover:border-red-600/50 transition-all duration-300 shadow-2xl flex flex-col justify-between"
            >
              {/* Product Visual Stage */}
              <div className="relative h-72 sm:h-80 w-full bg-gradient-to-b from-[#121216] to-[#050505] flex items-center justify-center p-6 overflow-hidden border-b border-white/10">
                <div
                  className="absolute w-72 h-72 rounded-full blur-[100px] opacity-20 pointer-events-none transition-all group-hover:opacity-35"
                  style={{ backgroundColor: cw.glowColor }}
                />

                {/* Badge if available */}
                {cw.badge && (
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-red-600 text-white text-[10px] font-bold font-mono-tech uppercase tracking-widest">
                    {cw.badge}
                  </div>
                )}

                {/* Color Swatch Indicators */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2 p-1.5 bg-black/80 backdrop-blur-md border border-white/10">
                  <span className="w-3 h-3 rounded-full border border-black/40" style={{ backgroundColor: cw.primaryColor }} />
                  <span className="w-3 h-3 rounded-full border border-black/40" style={{ backgroundColor: cw.accentColor }} />
                  <span className="w-3 h-3 rounded-full border border-black/40" style={{ backgroundColor: cw.glowColor }} />
                </div>

                {/* Stylized Sneaker Silhouette Graphic */}
                <div className="relative w-full max-w-sm h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <svg viewBox="0 0 400 250" className="w-full h-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]">
                    {/* Shadow */}
                    <ellipse cx="200" cy="220" rx="160" ry="12" fill="#000000" opacity="0.6" />
                    {/* Outsole */}
                    <path
                      d="M 80 180 Q 140 170 190 200 Q 250 205 320 175 Q 330 195 320 205 Q 240 225 180 220 Q 90 215 80 180 Z"
                      fill={cw.soleColor}
                      stroke="#27272a"
                      strokeWidth="2"
                    />
                    {/* Air Chamber */}
                    <rect x="110" y="190" width="60" height="14" rx="4" fill={cw.glowColor} opacity="0.9" />
                    {/* Upper */}
                    <path
                      d="M 95 180 C 85 150 90 110 120 90 C 150 80 180 120 200 130 C 240 145 280 155 315 170 L 320 185 Z"
                      fill={cw.primaryColor}
                      stroke={cw.accentColor}
                      strokeWidth="1.5"
                    />
                    {/* Heel counter chrome */}
                    <path d="M 80 170 C 75 140 95 125 110 135 C 120 160 110 180 85 180 Z" fill={cw.accentColor} />
                    {/* Strap */}
                    <path d="M 180 125 L 220 140 L 215 160 L 175 145 Z" fill={cw.secondaryColor} stroke={cw.accentColor} strokeWidth="1.5" />
                    {/* Laces */}
                    <line x1="220" y1="145" x2="245" y2="152" stroke="#ffffff" strokeWidth="2.5" />
                    <line x1="245" y1="152" x2="270" y2="160" stroke="#ffffff" strokeWidth="2.5" />
                  </svg>
                </div>
              </div>

              {/* Product Info & Sizing */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-mono-tech text-white/40 uppercase tracking-widest block">{cw.subtitle}</span>
                    <h3 className="text-xl sm:text-2xl font-black font-display text-white uppercase mt-1 tracking-tight">
                      {cw.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-black font-display text-white">${cw.price}</span>
                    <span className="text-[10px] font-mono-tech text-white/40 block">USD</span>
                  </div>
                </div>

                <p className="text-xs text-white/50 leading-relaxed line-clamp-2">
                  {cw.description}
                </p>

                {/* Size Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-mono-tech text-white/40 uppercase tracking-widest">SELECT US SIZE:</span>
                    <span className="text-xs font-mono-tech text-white font-bold">US {currentSize}</span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        id={`size-${cw.id}-${size}`}
                        onClick={() => handleSizeChange(cw.id, size)}
                        className={`flex-shrink-0 w-9 h-9 text-xs font-mono-tech flex items-center justify-center transition-all cursor-pointer ${
                          currentSize === size
                            ? 'bg-white text-black font-black shadow-md'
                            : 'bg-black/60 border border-white/15 text-white/60 hover:text-white hover:border-white/40'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    id={`buy-btn-${cw.id}`}
                    onClick={() => handleBuy(cw)}
                    className="flex-1 flex items-center justify-between py-4 px-6 bg-red-600 text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] cursor-pointer group"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      <span>SECURE PAIR</span>
                    </span>
                    <span className="text-sm font-mono-tech">${cw.price} →</span>
                  </button>

                  <button
                    id={`preview-3d-btn-${cw.id}`}
                    onClick={() => {
                      onSelectColorway(cw);
                      soundEngine.playSwoosh();
                      const heroElem = document.getElementById('shoe-3d-canvas-container');
                      if (heroElem) heroElem.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-4 bg-black/60 border border-white/20 text-white/60 hover:text-white hover:border-red-600 transition-colors cursor-pointer"
                    title="Load into 3D Viewport"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
