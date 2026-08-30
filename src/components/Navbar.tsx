import React, { useState, useEffect } from 'react';
import { ShoppingBag, Volume2, VolumeX, Sparkles, Scan, Menu, X, Compass } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenTryOn: () => void;
  onOpenCustomizer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenTryOn,
  onOpenCustomizer,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(!soundEngine.enabled);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const isEnabled = soundEngine.toggleSound();
    setIsMuted(!isEnabled);
  };

  const scrollTo = (elementId: string) => {
    soundEngine.playClick();
    setMobileMenuOpen(false);
    const elem = document.getElementById(elementId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050505]/95 backdrop-blur-xl border-b border-white/10 py-3.5 shadow-2xl'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo with Slash Accent from Elegant Dark */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 group text-left"
        >
          <div className="text-xl sm:text-2xl font-black font-display tracking-tighter text-white uppercase">
            KINETIX<span className="text-red-600">/</span>STUDIO
          </div>
          <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-mono-tech tracking-[0.2em] uppercase text-white/40 border border-white/10 rounded">
            ELITE .01
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium text-white/60">
          <button
            onClick={() => scrollTo('turntable-section')}
            className="hover:text-white transition-colors py-1 cursor-pointer"
          >
            360° Scan
          </button>
          <button
            onClick={() => scrollTo('customizer-section')}
            className="hover:text-white transition-colors py-1 flex items-center gap-1.5 cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
            <span>Custom Lab</span>
          </button>
          <button
            onClick={() => scrollTo('tech-breakdown-section')}
            className="hover:text-white transition-colors py-1 cursor-pointer"
          >
            Anatomy
          </button>
          <button
            onClick={() => scrollTo('collection-section')}
            className="hover:text-white transition-colors py-1 cursor-pointer"
          >
            Drop Archive
          </button>
          <button
            onClick={() => scrollTo('telemetry-section')}
            className="hover:text-white transition-colors py-1 cursor-pointer"
          >
            Telemetry
          </button>
        </nav>

        {/* Right Tools & Cart Action */}
        <div className="flex items-center gap-3">
          {/* AR Fitting Shortcut */}
          <button
            id="nav-tryon-btn"
            onClick={onOpenTryOn}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/20 text-[11px] font-mono-tech uppercase tracking-widest text-white/70 hover:text-white hover:border-red-600 transition-colors"
            title="AR Foot Sizing Simulator"
          >
            <Scan className="w-3.5 h-3.5 text-red-600" />
            <span>AR FITTING</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="nav-audio-btn"
            onClick={toggleSound}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
              !isMuted
                ? 'border-red-600 text-red-600 bg-red-600/10'
                : 'border-white/20 text-white/60 hover:border-white hover:text-white'
            }`}
            title={!isMuted ? 'Mute Sound FX' : 'Enable Cybernetic Sound FX'}
          >
            {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            id="nav-cart-btn"
            onClick={() => {
              onOpenCart();
              soundEngine.playClick();
            }}
            className="relative flex items-center gap-2.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(220,38,38,0.35)] cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">BAG</span>
            {cartCount > 0 && (
              <span className="w-4 h-4 bg-white text-black text-[10px] font-bold flex items-center justify-center rounded-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:border-red-600 transition-colors md:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#050505] border-b border-white/10 px-6 py-6 space-y-4 text-xs font-mono-tech uppercase tracking-widest">
          <button
            onClick={() => scrollTo('turntable-section')}
            className="w-full text-left py-2 text-white/60 hover:text-white border-b border-white/5"
          >
            360° PRECISION SCAN
          </button>
          <button
            onClick={() => scrollTo('customizer-section')}
            className="w-full text-left py-2 text-white/60 hover:text-white border-b border-white/5 flex items-center justify-between"
          >
            <span>BESPOKE 3D LAB</span>
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
          </button>
          <button
            onClick={() => scrollTo('tech-breakdown-section')}
            className="w-full text-left py-2 text-white/60 hover:text-white border-b border-white/5"
          >
            ANATOMY BREAKDOWN
          </button>
          <button
            onClick={() => scrollTo('collection-section')}
            className="w-full text-left py-2 text-white/60 hover:text-white border-b border-white/5"
          >
            DROP LINEUP
          </button>
          <button
            onClick={() => scrollTo('telemetry-section')}
            className="w-full text-left py-2 text-white/60 hover:text-white border-b border-white/5"
          >
            LAB TELEMETRY
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTryOn();
            }}
            className="w-full text-left py-3 text-red-600 font-bold flex items-center gap-2"
          >
            <Scan className="w-4 h-4" />
            <span>ACTIVATE AR FITTING</span>
          </button>
        </div>
      )}
    </header>
  );
};
