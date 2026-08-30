/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Colorway, CustomizerState, CartItem } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FrameScrubber360 } from './components/FrameScrubber360';
import { CustomizerStudio } from './components/CustomizerStudio';
import { TechBreakdown } from './components/TechBreakdown';
import { ProductShowcase } from './components/ProductShowcase';
import { PerformanceTelemetry } from './components/PerformanceTelemetry';
import { VirtualTryOnModal } from './components/VirtualTryOnModal';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { soundEngine } from './utils/audio';

export const INITIAL_COLORWAYS: Colorway[] = [
  {
    id: 'k01-apex',
    name: 'K-01 APEX STEALTH',
    subtitle: 'TRIPLE BLACK / OBSIDIAN CHROME',
    price: 320,
    badge: 'SIGNATURE DROP',
    primaryColor: '#0a0a0d',
    secondaryColor: '#1a1a22',
    accentColor: '#e2e8f0',
    soleColor: '#121217',
    glowColor: '#ff1e27',
    description: 'The definitive silhouette. Matte obsidian armor plating paired with a high-polish chrome heel chassis and blood-crimson LED core.',
    specs: {
      weight: '310g',
      energyReturn: '89.4%',
      drop: '8mm',
      material: 'Ballistic Carbon Knit & TPU Armor',
    },
  },
  {
    id: 'k01-inferno',
    name: 'K-01 INFERNO',
    subtitle: 'CRIMSON CYBER / RED FLARE',
    price: 340,
    badge: 'LIMITED EDITION',
    primaryColor: '#ff1e27',
    secondaryColor: '#121217',
    accentColor: '#ffffff',
    soleColor: '#0a0a0d',
    glowColor: '#ff1e27',
    description: 'Hyper-saturated crimson cyber armor. Bold high-contrast white accents over an impenetrable stealth carbon midsole.',
    specs: {
      weight: '315g',
      energyReturn: '90.2%',
      drop: '8mm',
      material: 'Anodized Polymer & Spacer Knit',
    },
  },
  {
    id: 'k01-ghost',
    name: 'K-01 GHOST TITANIUM',
    subtitle: 'ARCTIC WHITE / MIRROR CHROME',
    price: 330,
    badge: 'NEW ARRIVAL',
    primaryColor: '#f8fafc',
    secondaryColor: '#0a0a0d',
    accentColor: '#e2e8f0',
    soleColor: '#0e0e14',
    glowColor: '#ffffff',
    description: 'Minimalist purity meets biomechanical aggression. Ghost white upper with aerospace mirror-chrome heel stabilizer.',
    specs: {
      weight: '308g',
      energyReturn: '88.9%',
      drop: '8mm',
      material: 'Reflective TPU & Titanium Matrix',
    },
  },
  {
    id: 'k01-venom',
    name: 'K-01 VENOM SPLIT',
    subtitle: 'CYBERPUNK BLACK / HYPER RED SOLE',
    price: 350,
    badge: 'SPECIAL ALLOCATION',
    primaryColor: '#18181f',
    secondaryColor: '#ff1e27',
    accentColor: '#e2e8f0',
    soleColor: '#ff1e27',
    glowColor: '#ff1e27',
    description: 'High-contrast split edition. Stealth upper resting upon a fiery hyper-red kinetic surge wave sole with pulsating LED chamber.',
    specs: {
      weight: '320g',
      energyReturn: '91.0%',
      drop: '8mm',
      material: 'Carbon Weave & Nitrogen Foam Pods',
    },
  },
];

export default function App() {
  const [activeColorway, setActiveColorway] = useState<Colorway>(INITIAL_COLORWAYS[0]);
  
  // Customizer 3D State
  const [customizerConfig, setCustomizerConfig] = useState<CustomizerState>({
    upperColor: INITIAL_COLORWAYS[0].primaryColor,
    soleColor: INITIAL_COLORWAYS[0].soleColor,
    accentColor: INITIAL_COLORWAYS[0].accentColor,
    strapColor: INITIAL_COLORWAYS[0].secondaryColor,
    lacesColor: '#0a0a0d',
    glowColor: INITIAL_COLORWAYS[0].glowColor,
    finish: 'matte',
  });

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'k01-apex-initial',
      colorwayId: 'k01-apex',
      title: 'K-01 APEX STEALTH',
      size: 9.5,
      price: 320,
      quantity: 1,
      colorName: 'Obsidian Black / Chrome',
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);

  // Sync colorway selection to 3D model
  const handleSelectColorway = (cw: Colorway) => {
    setActiveColorway(cw);
    setCustomizerConfig({
      upperColor: cw.primaryColor,
      soleColor: cw.soleColor,
      accentColor: cw.accentColor,
      strapColor: cw.secondaryColor,
      lacesColor: cw.id === 'k01-ghost' || cw.id === 'k01-inferno' ? '#ffffff' : '#0a0a0d',
      glowColor: cw.glowColor,
      finish: cw.id === 'k01-ghost' ? 'metallic' : cw.id === 'k01-inferno' ? 'carbon' : 'matte',
    });
  };

  const handleAddToCart = (cw: Colorway, size: number = 9.5) => {
    soundEngine.playClick();
    const existingIndex = cartItems.findIndex(
      (item) => item.colorwayId === cw.id && item.size === size
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      setCartItems(updated);
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          id: `${cw.id}-${size}-${Date.now()}`,
          colorwayId: cw.id,
          title: cw.name,
          size,
          price: cw.price,
          quantity: 1,
          colorName: cw.subtitle,
        },
      ]);
    }
    setIsCartOpen(true);
  };

  const handleAddCustomToCart = (config: CustomizerState, customName: string) => {
    setCartItems((prev) => [
      ...prev,
      {
        id: `bespoke-${Date.now()}`,
        colorwayId: 'custom-bespoke',
        title: customName || 'KINETIX BESPOKE 01',
        size: 9.5,
        price: 340,
        quantity: 1,
        customConfig: config,
        colorName: 'Custom 3D Formulation',
      },
    ]);
    setIsCartOpen(true);
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const scrollToCustomizer = () => {
    soundEngine.playSwoosh();
    const elem = document.getElementById('customizer-section');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTelemetry = () => {
    soundEngine.playSwoosh();
    const elem = document.getElementById('tech-breakdown-section');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col selection:bg-[#ff1e27] selection:text-white">
      {/* Navigation Topbar */}
      <Navbar
        cartCount={cartItems.reduce((s, i) => s + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTryOn={() => setIsTryOnOpen(true)}
        onOpenCustomizer={scrollToCustomizer}
      />

      {/* Main Page Content */}
      <main className="flex-1 space-y-8 md:space-y-16">
        {/* 1. Hero 3D Showcase */}
        <HeroSection
          config={customizerConfig}
          onConfigChange={setCustomizerConfig}
          colorways={INITIAL_COLORWAYS}
          activeColorway={activeColorway}
          onSelectColorway={handleSelectColorway}
          onOpenCustomizer={scrollToCustomizer}
          onAddToCart={(cw) => handleAddToCart(cw, 9.5)}
        />

        {/* 2. 360-Degree Precision Scan Turntable */}
        <FrameScrubber360 onOpenSpecsModal={scrollToTelemetry} />

        {/* 3. Real-time 3D Bespoke Customizer Studio */}
        <CustomizerStudio
          config={customizerConfig}
          onConfigChange={setCustomizerConfig}
          onAddToCartWithCustom={handleAddCustomToCart}
        />

        {/* 4. Biomechanical Technical Breakdown */}
        <TechBreakdown />

        {/* 5. Product Collection Showcase */}
        <ProductShowcase
          colorways={INITIAL_COLORWAYS}
          onSelectColorway={handleSelectColorway}
          onAddToCart={handleAddToCart}
          onOpenCustomizer={scrollToCustomizer}
        />

        {/* 6. Performance Telemetry & Comparison Lab */}
        <PerformanceTelemetry />
      </main>

      {/* Virtual Try-On AR Modal */}
      <VirtualTryOnModal
        isOpen={isTryOnOpen}
        onClose={() => setIsTryOnOpen(false)}
        onSelectRecommendedSize={(size) => {
          handleAddToCart(activeColorway, size);
        }}
      />

      {/* Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
