import React, { useState } from 'react';
import { ArrowRight, Shield, Check, Globe, Send } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    soundEngine.playChime();
    setSubscribed(true);
  };

  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top VIP Drop Newsletter Box */}
        <div className="bg-[#08080a] border border-white/10 p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-red-600/15 blur-[120px] pointer-events-none" />
          
          <div className="max-w-xl text-left">
            <span className="text-xs font-mono-tech uppercase text-red-600 tracking-[0.2em] font-bold block mb-2">
              EXCLUSIVE ACCESS // PROTOCOL 2026
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-display text-white uppercase tracking-tight">
              JOIN THE KINETIX <span className="text-gradient-red">INNER CIPHER</span>
            </h3>
            <p className="text-xs sm:text-sm text-white/40 mt-2 leading-relaxed">
              Receive zero-day notifications for limited 3D customizer drops, NFT verification keys, and private lab benchmarks.
            </p>
          </div>

          <div className="w-full lg:w-auto min-w-[320px]">
            {subscribed ? (
              <div className="flex items-center gap-2 p-4 bg-red-600/15 border border-red-600 text-white text-xs font-mono-tech uppercase tracking-wider">
                <Check className="w-4 h-4 text-red-500" />
                <span>ACCESS GRANTED. VIP PROTOCOL ACTIVE.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="ENTER CIPHER EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3.5 bg-black/70 border border-white/15 text-xs font-mono-tech text-white uppercase focus:outline-none focus:border-red-600 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-red-600 text-white font-mono-tech text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] flex items-center gap-2 cursor-pointer"
                >
                  <span>JOIN</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Links & Brand Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-mono-tech">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-600 flex items-center justify-center text-white font-black text-xs font-display">
                K
              </div>
              <span className="font-bold text-white font-display text-sm tracking-widest uppercase">KINETIX / STUDIO</span>
            </div>
            <p className="text-white/40 leading-relaxed text-[11px]">
              Biomechanical luxury footwear engineered with aerospace-grade metallurgy and supercritical kinetic foam.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <span className="text-white font-bold uppercase tracking-widest block mb-3">MODELS</span>
            <ul className="space-y-2 text-white/50">
              <li><a href="#collection-section" className="hover:text-red-500 transition-colors">K-01 APEX (STEALTH BLACK)</a></li>
              <li><a href="#collection-section" className="hover:text-red-500 transition-colors">K-01 INFERNO (CYBER RED)</a></li>
              <li><a href="#collection-section" className="hover:text-red-500 transition-colors">K-01 GHOST (ARCTIC TITANIUM)</a></li>
              <li><a href="#collection-section" className="hover:text-red-500 transition-colors">K-01 VENOM (SPLIT SPEC)</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <span className="text-white font-bold uppercase tracking-widest block mb-3">INNOVATION</span>
            <ul className="space-y-2 text-white/50">
              <li><a href="#turntable-section" className="hover:text-red-500 transition-colors">360° PRECISION SCANNER</a></li>
              <li><a href="#customizer-section" className="hover:text-red-500 transition-colors">3D BESPOKE COLOR LAB</a></li>
              <li><a href="#tech-breakdown-section" className="hover:text-red-500 transition-colors">BIOMECHANICAL ANATOMY</a></li>
              <li><a href="#telemetry-section" className="hover:text-red-500 transition-colors">PERFORMANCE BENCHMARKS</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <span className="text-white font-bold uppercase tracking-widest block mb-3">PROTOCOLS</span>
            <ul className="space-y-2 text-white/50">
              <li className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-red-600" /> GLOBAL AIR DISPATCH</li>
              <li className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-white/40" /> ON-CHAIN NFC PASSPORT</li>
              <li>30-DAY ZERO-RISK FITTING</li>
              <li>LIFETIME CHASSIS WARRANTY</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono-tech text-white/40">
          <div>
            © 2026 KINETIX FOOTWEAR LABS INC. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4 text-white/40">
            <span>TOKYO // BERLIN // LOS ANGELES</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            <span>ENCRYPTED V4.2</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
