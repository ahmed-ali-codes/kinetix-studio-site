import React, { useState } from 'react';
import { Shield, Zap, Layers, Activity, Cpu, Wind, Compass, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { soundEngine } from '../utils/audio';

export const TechBreakdown: React.FC = () => {
  const [selectedPillar, setSelectedPillar] = useState(0);

  const pillars = [
    {
      icon: Activity,
      id: '01',
      category: 'PROPULSION',
      title: 'KINETIC-SURGE MIDSOLE',
      highlight: '89.4% ENERGY RETURN',
      desc: 'Formulated with ultra-expanded supercritical nitrogen-infused foam pods. Absorbs high-impact downward velocity and redirects 89.4% into horizontal forward momentum.',
      stats: [
        { label: 'IMPACT ABSORPTION', value: '94.2%' },
        { label: 'ENERGY RETURN', value: '89.4%' },
        { label: 'FOAM DENSITY', value: '0.12 g/cm³' },
      ],
      diagramColor: '#ff1e27',
    },
    {
      icon: Shield,
      id: '02',
      category: 'STABILITY',
      title: 'AEROSPACE CHROME HEEL CHASSIS',
      highlight: 'GRADE-5 TITANIUM RIDGES',
      desc: 'Precision CNC-machined rear heel counter with multi-tiered horizontal aero-ridges. Locks the calcaneus bone securely, preventing heel slippage and ankle torsion under sharp lateral cuts.',
      stats: [
        { label: 'TORSIONAL RIGIDITY', value: '42 Nm/deg' },
        { label: 'MATERIAL', value: 'Grade-5 Titanium & Chrome' },
        { label: 'HEEL LOCKDOWN', value: '100% Zero-Slip' },
      ],
      diagramColor: '#ffffff',
    },
    {
      icon: Wind,
      id: '03',
      category: 'VENTILATION',
      title: 'AERO-GRID WEAVE MATRIX',
      highlight: 'BREATHABLE THERMAL DISSIPATION',
      desc: 'Seamless dual-layered TPU armor cage over ballistic 3D spacer knit. Engineered with micro-perforations along the vamp to channel cooling airflow while resisting abrasive urban wear.',
      stats: [
        { label: 'AIR PERMEABILITY', value: '1,450 L/m²/s' },
        { label: 'TENSILE STRENGTH', value: '2,800 N' },
        { label: 'WATER REPELLENCY', value: 'DWR Hydrophobic' },
      ],
      diagramColor: '#ff1e27',
    },
    {
      icon: Cpu,
      id: '04',
      category: 'HARNESS',
      title: 'MAG-LOCK TACTICAL HARNESS',
      highlight: 'INSTANT MAGNETIC LOCKDOWN',
      desc: 'Neodymium magnetic snap-lock buckle coupled with micro-ratchet webbing. Secures your midfoot in 0.2 seconds with uniform pressure distribution across the dorsal arch.',
      stats: [
        { label: 'LOCK TIME', value: '< 0.2s' },
        { label: 'RETENTION LOAD', value: '650 N' },
        { label: 'CLOSURE TYPE', value: 'Fidlock Magnetic' },
      ],
      diagramColor: '#e2e8f0',
    },
  ];

  return (
    <section id="tech-breakdown-section" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <span className="text-xs font-mono-tech uppercase text-red-600 tracking-[0.2em] block mb-2 font-bold">
            // BIOMECHANICAL BENCHMARK
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tighter text-white uppercase">
            ARCHITECTURAL <span className="text-gradient-red">ANATOMY</span>
          </h2>
        </div>
        <p className="text-white/40 text-sm sm:text-base max-w-md leading-relaxed">
          Engineered without compromise. Each component undergoes 10,000 km of simulated stress testing for peak vertical velocity.
        </p>
      </div>

      {/* Interactive Pillar Navigation & Deep-Dive Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: 4 Pillars Interactive Selector (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            const isSelected = selectedPillar === idx;
            return (
              <button
                key={p.id}
                id={`tech-pillar-${p.id}`}
                onClick={() => {
                  setSelectedPillar(idx);
                  soundEngine.playClick();
                }}
                className={`p-5 text-left transition-all border flex items-start gap-4 group cursor-pointer ${
                  isSelected
                    ? 'bg-[#0e0e12] border-red-600 shadow-[0_0_25px_rgba(220,38,38,0.15)]'
                    : 'bg-[#08080a] border-white/10 hover:border-white/25'
                }`}
              >
                <div
                  className={`p-3 transition-colors ${
                    isSelected ? 'bg-red-600 text-white shadow-lg' : 'bg-white/5 text-white/50 group-hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-tech text-red-600 font-bold uppercase tracking-wider">{p.category}</span>
                    <span className="text-xs font-mono-tech text-white/30">PHASE // {p.id}</span>
                  </div>
                  <h3 className="text-base font-bold text-white font-display mt-1 group-hover:text-white uppercase tracking-tight">
                    {p.title}
                  </h3>
                  <span className="text-xs text-white/50 block mt-1">{p.highlight}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Detailed HUD Holographic Spec Box (7 cols) */}
        <div className="lg:col-span-7 bg-[#08080a] p-8 border border-white/10 relative overflow-hidden flex flex-col justify-between shadow-2xl">
          {/* Ambience glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 blur-[100px] pointer-events-none" />
          <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

          {/* Active Pillar Content */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="px-3 py-1 bg-red-600/15 border border-red-600/30 text-xs font-mono-tech text-red-500 font-bold uppercase tracking-widest">
                SYS_ANATOMY_0{selectedPillar + 1}
              </span>
              <span className="text-xs font-mono-tech text-white/40 uppercase tracking-widest">STATUS: VERIFIED OPTIMAL</span>
            </div>

            <div>
              <span className="text-xs font-mono-tech text-white/40 uppercase tracking-widest block mb-1">
                {pillars[selectedPillar].category} ARCHITECTURE
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-display text-white uppercase tracking-tight">
                {pillars[selectedPillar].title}
              </h3>
              <p className="text-white/60 mt-4 text-sm sm:text-base leading-relaxed">
                {pillars[selectedPillar].desc}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              {pillars[selectedPillar].stats.map((stat, i) => (
                <div key={i} className="p-4 bg-black/60 border border-white/10 backdrop-blur-md">
                  <span className="text-[10px] font-mono-tech text-white/40 block uppercase tracking-wider mb-1">
                    {stat.label}
                  </span>
                  <span className="text-base sm:text-lg font-black font-mono-tech text-white">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Futuristic Telemetry Footer */}
          <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono-tech text-white/40 uppercase tracking-widest">
            <span>LAB BENCHMARK: ISO-9001 PROTOCOL</span>
            <span className="text-red-600 font-bold">10,000 KM CYCLED</span>
          </div>
        </div>
      </div>
    </section>
  );
};
