import React, { useState } from 'react';
import { CartItem } from '../types';
import { soundEngine } from '../utils/audio';
import { X, Trash2, ArrowRight, ShieldCheck, Truck, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shipping = subtotal > 0 ? 0 : 0; // Free global express
  const total = subtotal - discountAmount + shipping;

  const handleApplyPromo = () => {
    soundEngine.playClick();
    if (promoCode.trim().toUpperCase() === 'KINETIX15' || promoCode.trim().toUpperCase() === 'VIP2026') {
      setDiscountPercent(15);
      setPromoError('');
      soundEngine.playChime();
    } else {
      setPromoError('Invalid code. Try "KINETIX15" for 15% VIP access.');
    }
  };

  const handleCheckout = () => {
    soundEngine.playSwoosh();
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      soundEngine.playChime();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#dc2626', '#ffffff', '#050505'],
      });
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md h-full bg-[#050505] border-l border-white/15 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full" />
              <h3 className="text-base sm:text-lg font-black font-display text-white uppercase tracking-tight">
                YOUR BAG ({items.reduce((s, i) => s + i.quantity, 0)})
              </h3>
            </div>
            <button
              id="close-cart-btn"
              onClick={onClose}
              className="p-2 bg-white/5 text-white/50 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Order Completion View */}
          {orderComplete ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-red-600/20 border border-red-600 flex items-center justify-center mx-auto text-red-500">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-black font-display text-white uppercase tracking-tight">ORDER CONFIRMED</h4>
              <p className="text-xs text-white/50 max-w-xs mx-auto leading-relaxed">
                Your KINETIX allocation is reserved. Tracking telemetry and NFC cryptographic passport key will be dispatched via email.
              </p>
              <div className="p-4 bg-[#08080a] border border-white/10 text-xs font-mono-tech text-left space-y-1.5">
                <div className="flex justify-between text-white/40">
                  <span>DISPATCH:</span>
                  <span className="text-white">DHL AIR EXPRESS (2-4 DAYS)</span>
                </div>
                <div className="flex justify-between text-white/40">
                  <span>AUTHENTICATION:</span>
                  <span className="text-red-500 font-bold">ENCRYPTED NFC PASSPORT</span>
                </div>
              </div>
              <button
                id="reset-after-checkout-btn"
                onClick={() => {
                  onClearCart();
                  setOrderComplete(false);
                  onClose();
                }}
                className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-red-600 hover:text-white transition-all shadow-lg cursor-pointer font-mono-tech"
              >
                RETURN TO LAB
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <p className="text-white/40 font-mono-tech text-xs uppercase tracking-widest">YOUR BAG IS CURRENTLY EMPTY</p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-white/5 text-white font-mono-tech text-xs uppercase tracking-widest hover:bg-white/15 transition-all border border-white/15 cursor-pointer"
              >
                BROWSE SNEAKERS
              </button>
            </div>
          ) : (
            /* Items List */
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="p-4 bg-[#08080a] border border-white/10 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-display uppercase tracking-tight">{item.title}</span>
                      <span className="px-1.5 py-0.5 bg-white/10 text-[10px] font-mono-tech text-white/70">
                        US {item.size}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono-tech text-red-500 block uppercase tracking-wider">
                      EDITION: {item.colorName}
                    </span>
                    <span className="text-sm font-black font-mono-tech text-white">${item.price} USD</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-black border border-white/10 p-1">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono-tech text-white font-bold">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      id={`remove-item-${item.id}`}
                      onClick={() => {
                        onRemoveItem(item.id);
                        soundEngine.playClick();
                      }}
                      className="p-2 text-white/30 hover:text-red-500 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Checkout and Promo */}
        {!orderComplete && items.length > 0 && (
          <div className="pt-6 border-t border-white/10 space-y-4">
            {/* Promo Code Input */}
            <div className="flex gap-2">
              <input
                id="promo-code-input"
                type="text"
                placeholder="PROMO CODE (KINETIX15)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 px-3 py-2.5 bg-black/60 border border-white/15 text-xs font-mono-tech text-white uppercase focus:outline-none focus:border-red-600 transition-colors"
              />
              <button
                id="apply-promo-btn"
                onClick={handleApplyPromo}
                className="px-4 py-2.5 bg-white/10 text-white font-mono-tech text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-all border border-white/15 cursor-pointer"
              >
                APPLY
              </button>
            </div>
            {promoError && <p className="text-[11px] font-mono-tech text-amber-400">{promoError}</p>}
            {discountPercent > 0 && (
              <p className="text-[11px] font-mono-tech text-green-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>15% VIP DISCOUNT APPLIED!</span>
              </p>
            )}

            {/* Calculations Summary */}
            <div className="space-y-1.5 text-xs font-mono-tech text-white/50">
              <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>VIP DISCOUNT (-{discountPercent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GLOBAL AIR SHIPPING</span>
                <span className="text-red-500 font-bold">FREE EXPRESS</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 text-base font-bold text-white font-display">
                <span>TOTAL</span>
                <span className="text-gradient-red text-xl font-mono-tech">${total.toFixed(2)} USD</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              id="proceed-checkout-btn"
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full flex items-center justify-between py-4 px-6 bg-red-600 text-white font-bold font-mono-tech text-xs uppercase tracking-[0.2em] hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] cursor-pointer"
            >
              <span>{isCheckingOut ? 'TRANSACTING CIPHER...' : 'CHECKOUT WITH EXPRESS PAY'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-4 text-[10px] font-mono-tech text-white/40 pt-1">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                <span>NFC VERIFIED AUTHENTIC</span>
              </div>
              <div className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-white/40" />
                <span>30-DAY FITTING GUARANTEE</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
