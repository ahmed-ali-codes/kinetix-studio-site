import React, { useState } from 'react';
import { Activity, Zap, Shield, Flame, Gauge, CheckCircle2, TrendingUp, Info } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export const PerformanceTelemetry: React.FC = () => {
  const [velocityPace, setVelocityPace] = useState(18); // km/h
  const [activeMetricTab, setActiveMetricTab] = useState<'rebound' | 'stability' | 'weight' | 'airflow'>('rebound');

  const calculatedEnergySaving = ((velocityPace / 25) * 14.8).toFixed(1);
  const calculatedImpactLoad = (850 - velocityPace * 12).toFixed(0);

  const benchmarkData = [
    {
      name: 'Energy Return Efficiency',
      kinetix: 89.4,
      standard: 64.0,
      unit: '%',
      note: 'Supercritical Nitrogen-Infused Pods vs standard EVA foam',
    },
    {
      name: 'Calcaneus Heel Lockdown',
      kinetix: 98.6,
      standard: 72.5,
      unit: '%',
      note: 'Ti-6Al-4V Aerospace Chrome chassis with zero slip',
    },
    {
      name: 'Torsional Rigidity Index',
      kinetix: 94.0,
      standard: 58.0,
      unit: 'Nm',
      note: 'Embedded carbon fiber under-shank plate',
    },
    {
      name: 'Upper Thermal Dissipation',
      kinetix: 92.8,
      standard: 61.2,
      unit: '%',
      note: 'Ballistic 3D spacer knit matrix with active airflow vents',
    },
  ];

  return (
    <section id="telemetry-section" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <span className="text-xs font-mono-tech uppercase text-red-600 tracking-[0.2em] block mb-2 font-bold">
            // TELEMETRY LAB VERIFICATION
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tighter text-white uppercase">
            PERFORMANCE <span className="text-gradient-red">TELEMETRY</span>
          </h2>
        </div>
        <p className="text-white/40 text-sm sm:text-base max-w-md leading-relaxed">
          Tested against industry silhouettes. KINETIX sets unprecedented benchmarks in biomechanical efficiency and kinetic return.
        </p>
      </div>

      {/* Main Telemetry Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Interactive Speed & Energy Simulator (5 Cols) */}
        <div className="lg:col-span-5 bg-[#08080a] p-6 sm:p-8 border border-white/10 flex flex-col justify-between shadow-2xl space-y-6">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-mono-tech text-red-600 font-bold uppercase tracking-widest flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                <span>DYNAMIC GAIT SIMULATOR</span>
              </span>
              <span className="text-xs font-mono-tech text-white/40 uppercase">PBR_REALTIME</span>
            </div>

            <div className="mt-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-tech text-white/50 uppercase tracking-widest">RUNNING VELOCITY:</span>
                <span className="text-2xl font-black font-mono-tech text-white">{velocityPace} <span className="text-xs font-normal text-white/40 font-mono-tech">KM/H</span></span>
              </div>

              <input
                id="velocity-slider"
                type="range"
                min="5"
                max="30"
                value={velocityPace}
                onChange={(e) => {
                  setVelocityPace(parseInt(e.target.value, 10));
                  soundEngine.playClick();
                }}
                className="w-full h-1.5 bg-neutral-800 rounded-none appearance-none cursor-pointer accent-red-600"
              />

              <div className="flex justify-between text-[10px] font-mono-tech text-white/40 uppercase tracking-wider">
                <span>5 KM/H (WALK)</span>
                <span>18 KM/H (SPRINT)</span>
                <span>30 KM/H (PEAK)</span>
              </div>
            </div>
          </div>

          {/* Dynamic Computed Outputs */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div className="p-4 bg-black/60 border border-white/10">
              <span className="text-[10px] font-mono-tech text-red-600 block uppercase tracking-wider mb-1 flex items-center gap-1 font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>ENERGY GAIN</span>
              </span>
              <span className="text-2xl font-black font-mono-tech text-white">+{calculatedEnergySaving}%</span>
              <span className="text-[10px] text-white/40 block mt-1 font-mono-tech">Reduced Leg Fatigue</span>
            </div>

            <div className="p-4 bg-black/60 border border-white/10">
              <span className="text-[10px] font-mono-tech text-white block uppercase tracking-wider mb-1 flex items-center gap-1 font-bold">
                <Shield className="w-3.5 h-3.5 text-red-600" />
                <span>JOINT DAMPING</span>
              </span>
              <span className="text-2xl font-black font-mono-tech text-white">{calculatedImpactLoad} N</span>
              <span className="text-[10px] text-white/40 block mt-1 font-mono-tech">Peak Shock Absorbed</span>
            </div>
          </div>
        </div>

        {/* Right: Comparative Benchmark Bars (7 Cols) */}
        <div className="lg:col-span-7 bg-[#08080a] p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <span className="text-xs font-mono-tech text-white uppercase tracking-widest font-bold">
              KINETIX K-01 VS TRADITIONAL LUXURY SNEAKERS
            </span>
            <div className="flex items-center gap-4 text-[11px] font-mono-tech">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                <span className="text-white font-bold">KINETIX</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white/30" />
                <span className="text-white/40">INDUSTRY</span>
              </div>
            </div>
          </div>

          {/* Benchmark Bars */}
          <div className="space-y-6 pt-2">
            {benchmarkData.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white font-display uppercase tracking-tight">{item.name}</span>
                  <div className="flex items-center gap-3 font-mono-tech text-xs">
                    <span className="text-red-600 font-bold">
                      {item.kinetix}{item.unit}
                    </span>
                    <span className="text-white/30">
                      / {item.standard}{item.unit}
                    </span>
                  </div>
                </div>

                {/* Progress bar container */}
                <div className="h-2 w-full bg-white/10 relative flex">
                  {/* KINETIX Bar */}
                  <div
                    className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.7)] transition-all duration-700"
                    style={{ width: `${item.kinetix}%` }}
                  />
                  {/* Industry Standard Indicator Marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
                    style={{ left: `${item.standard}%` }}
                    title={`Industry standard: ${item.standard}%`}
                  />
                </div>

                <span className="text-[11px] text-white/40 block font-mono-tech">{item.note}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-black/60 border border-white/10 flex items-center gap-3 mt-6">
            <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-xs text-white/60 leading-relaxed font-mono-tech">
              Each pair is individually numbered and issued with an on-chain NFC verification chip embedded inside the left heel counter.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
