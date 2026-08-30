import React, { useState } from 'react';
import { ThreeCanvas } from './ThreeCanvas';
import { CustomizerState, Colorway } from '../types';
import { soundEngine } from '../utils/audio';
import { Sliders, Sparkles, Check, ShoppingBag, RotateCcw, Palette, Layers, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CustomizerStudioProps {
  config: CustomizerState;
  onConfigChange: (newConfig: CustomizerState) => void;
  onAddToCartWithCustom: (config: CustomizerState, customName: string) => void;
}

export const CustomizerStudio: React.FC<CustomizerStudioProps> = ({
  config,
  onConfigChange,
  onAddToCartWithCustom,
}) => {
  const [activeTab, setActiveTab] = useState<'upper' | 'sole' | 'accent' | 'strap' | 'laces' | 'glow' | 'finish'>('upper');
  const [customName, setCustomName] = useState('KINETIX BESPOKE 01');
  const [savedNotification, setSavedNotification] = useState(false);

  // Preset Color Palettes (Red, White, Black & Metallic Luxury Tones)
  const colorOptions = [
    { name: 'Obsidian Black', hex: '#0a0a0d', category: 'dark' },
    { name: 'Stealth Carbon', hex: '#1c1c24', category: 'dark' },
    { name: 'Venom Red', hex: '#ff1e27', category: 'red' },
    { name: 'Crimson Hyper', hex: '#b91c1c', category: 'red' },
    { name: 'Ghost White', hex: '#f8fafc', category: 'light' },
    { name: 'Titanium Slate', hex: '#94a3b8', category: 'light' },
    { name: 'Mirror Chrome', hex: '#e2e8f0', category: 'chrome' },
    { name: 'Gunmetal Silver', hex: '#475569', category: 'chrome' },
  ];

  const presets = [
    {
      name: 'APEX OBSIDIAN',
      desc: 'All-black tactical silhouette with blood-red LED core.',
      config: {
        upperColor: '#0a0a0d',
        soleColor: '#121217',
        accentColor: '#e2e8f0',
        strapColor: '#1e1e24',
        lacesColor: '#0a0a0d',
        glowColor: '#ff1e27',
        finish: 'matte' as const,
      }
    },
    {
      name: 'CRIMSON VENOM',
      desc: 'Hyper-vibrant red upper with chrome heel stabilizer.',
      config: {
        upperColor: '#ff1e27',
        soleColor: '#0a0a0d',
        accentColor: '#ffffff',
        strapColor: '#1c1c24',
        lacesColor: '#ffffff',
        glowColor: '#ff1e27',
        finish: 'carbon' as const,
      }
    },
    {
      name: 'ARCTIC TITANIUM',
      desc: 'High-contrast white armor with chrome accents & stealth sole.',
      config: {
        upperColor: '#f8fafc',
        soleColor: '#0a0a0d',
        accentColor: '#e2e8f0',
        strapColor: '#0a0a0d',
        lacesColor: '#ff1e27',
        glowColor: '#ffffff',
        finish: 'metallic' as const,
      }
    },
    {
      name: 'CYBER CYBORG',
      desc: 'Split black-and-red ballistic grid with glowing neon tread.',
      config: {
        upperColor: '#1c1c24',
        soleColor: '#ff1e27',
        accentColor: '#e2e8f0',
        strapColor: '#ff1e27',
        lacesColor: '#ffffff',
        glowColor: '#ff1e27',
        finish: 'glossy' as const,
      }
    },
  ];

  const handleColorSelect = (key: keyof CustomizerState, colorHex: string) => {
    soundEngine.playClick();
    onConfigChange({
      ...config,
      [key]: colorHex,
    });
  };

  const handleFinishSelect = (finish: 'matte' | 'glossy' | 'metallic' | 'carbon') => {
    soundEngine.playClick();
    onConfigChange({
      ...config,
      finish,
    });
  };

  const handleApplyPreset = (presetConfig: CustomizerState, name: string) => {
    soundEngine.playChime();
    onConfigChange(presetConfig);
    setCustomName(name);
  };

  const handleOrderCustom = () => {
    soundEngine.playChime();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff1e27', '#ffffff', '#18181c'],
    });
    onAddToCartWithCustom(config, customName);
  };

  return (
    <section id="customizer-section" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono-tech uppercase text-red-600 tracking-[0.2em] font-bold block mb-2">
          // BESPOKE SPECIFICATION ENGINE
        </span>
        <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tighter text-white uppercase">
          CUSTOMIZE YOUR <span className="text-gradient-red">CHASSIS</span>
        </h2>
        <p className="text-white/40 mt-3 text-sm sm:text-base leading-relaxed">
          Fine-tune every layer in full interactive 3D. Configure carbon fiber weaves, mirror chrome armor, ballistic straps, and kinetic LED underglows.
        </p>
      </div>

      {/* Main Customizer Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 3D Viewport (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative border border-white/10 bg-[#08080a] shadow-2xl">
            <ThreeCanvas
              config={config}
              cameraPreset="hero"
              height="h-[420px] sm:h-[500px] lg:h-[580px]"
            />
            {/* Live Name Badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3.5 py-1.5 border border-white/15">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="bg-transparent text-xs font-bold text-white font-mono-tech uppercase tracking-wider focus:outline-none w-36 sm:w-48"
                title="Click to rename design"
              />
            </div>
          </div>

          {/* Quick Presets Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {presets.map((p) => (
              <button
                key={p.name}
                id={`preset-spec-${p.name.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => handleApplyPreset(p.config, p.name)}
                className="p-3 bg-[#08080a] border border-white/10 hover:border-red-600 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.config.upperColor }} />
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.config.accentColor }} />
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.config.glowColor }} />
                </div>
                <span className="text-xs font-bold text-white block truncate font-mono-tech uppercase tracking-wider group-hover:text-red-500 transition-colors">
                  {p.name}
                </span>
                <span className="text-[10px] text-white/40 line-clamp-1 font-mono-tech mt-0.5">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Component Customization Tool Controls (5 Cols) */}
        <div className="lg:col-span-5 bg-[#08080a] p-6 sm:p-8 border border-white/10 space-y-6 shadow-2xl">
          {/* Part Selection Tabs */}
          <div>
            <span className="text-[11px] font-mono-tech text-white/50 uppercase tracking-widest block mb-3 font-bold">SELECT COMPONENT TO MODIFY:</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'upper', label: 'Upper Weave', key: 'upperColor' },
                { id: 'sole', label: 'Midsole Pods', key: 'soleColor' },
                { id: 'accent', label: 'Chrome Heel', key: 'accentColor' },
                { id: 'strap', label: 'Tactical Strap', key: 'strapColor' },
                { id: 'laces', label: 'Speed Laces', key: 'lacesColor' },
                { id: 'glow', label: 'LED Glow Core', key: 'glowColor' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  id={`customizer-tab-${tab.id}`}
                  onClick={() => {
                    setActiveTab(tab.id as typeof activeTab);
                    soundEngine.playClick();
                  }}
                  className={`p-3 text-xs font-mono-tech uppercase tracking-wider text-left transition-all border cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-white text-black font-bold border-white shadow-lg'
                      : 'bg-black text-white/50 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{tab.label}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0 ml-1"
                      style={{
                        backgroundColor: (config as Record<string, string>)[tab.key] || '#ffffff',
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette Swatches */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono-tech text-white/50 uppercase tracking-widest font-bold">
                {activeTab.toUpperCase()} COLOR PALETTE:
              </span>
              <span className="text-xs font-mono-tech text-red-500 font-bold">
                {(config as Record<string, string>)[`${activeTab}Color`] || config.upperColor}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {colorOptions.map((c) => {
                const currentFieldKey = `${activeTab}Color` as keyof CustomizerState;
                const isSelected = config[currentFieldKey] === c.hex;
                return (
                  <button
                    key={c.name}
                    id={`color-opt-${c.hex.replace('#', '')}`}
                    onClick={() => handleColorSelect(currentFieldKey, c.hex)}
                    className={`relative p-2.5 flex flex-col items-center gap-1.5 transition-all border cursor-pointer ${
                      isSelected
                        ? 'border-red-600 bg-red-600/10 shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                        : 'border-white/10 bg-black/60 hover:border-white/30'
                    }`}
                  >
                    <span
                      className="w-6 h-6 rounded-full border border-white/20 shadow-inner flex items-center justify-center"
                      style={{ backgroundColor: c.hex }}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white filter drop-shadow" />}
                    </span>
                    <span className="text-[10px] text-white/70 font-mono-tech truncate w-full text-center uppercase">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upper Material Finish Selector */}
          <div>
            <span className="text-[11px] font-mono-tech text-white/50 uppercase tracking-widest block mb-3 font-bold">UPPER MATERIAL FINISH:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['matte', 'glossy', 'metallic', 'carbon'] as const).map((finish) => (
                <button
                  key={finish}
                  id={`finish-opt-${finish}`}
                  onClick={() => handleFinishSelect(finish)}
                  className={`py-2.5 px-3 text-xs font-mono-tech uppercase tracking-wider text-center transition-all border cursor-pointer ${
                    config.finish === finish
                      ? 'bg-red-600 text-white font-bold border-red-600 shadow-[0_0_12px_rgba(220,38,38,0.4)]'
                      : 'bg-black text-white/50 border-white/10 hover:text-white'
                  }`}
                >
                  {finish}
                </button>
              ))}
            </div>
          </div>

          {/* Order / Add Custom to Bag Button */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono-tech text-white/40 uppercase tracking-wider">
              <span>ESTIMATED PRODUCTION</span>
              <span className="text-white">3-5 BUSINESS DAYS</span>
            </div>

            <button
              id="add-bespoke-to-cart-btn"
              onClick={handleOrderCustom}
              className="w-full flex items-center justify-center gap-2 py-4 bg-red-600 text-white font-bold font-mono-tech text-xs uppercase tracking-[0.2em] hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ADD BESPOKE SNEAKER • $340</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
