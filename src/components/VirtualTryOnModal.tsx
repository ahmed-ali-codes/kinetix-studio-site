import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, Sparkles, AlertCircle, Scan, Ruler, Footprints } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface VirtualTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecommendedSize: (size: number) => void;
}

export const VirtualTryOnModal: React.FC<VirtualTryOnModalProps> = ({
  isOpen,
  onClose,
  onSelectRecommendedSize,
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'calculator'>('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [footLengthCm, setFootLengthCm] = useState(27.5);
  const [archType, setArchType] = useState<'normal' | 'high' | 'flat'>('normal');
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Compute recommended US size from foot length in cm
  // Formula: approx (cm - 18) * 1.05
  const recommendedSize = Math.round(((footLengthCm - 18) * 1.05) * 2) / 2;

  const startCamera = async () => {
    soundEngine.playClick();
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch {
      setCameraError('Camera access unavailable. Use the interactive 3D Biometric Fitting calculator below.');
      setActiveTab('calculator');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleStartScan = () => {
    soundEngine.playSwoosh();
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      soundEngine.playChime();
    }, 2800);
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setIsScanning(false);
      setScanComplete(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <div className="relative w-full max-w-2xl bg-[#050505] border border-white/15 p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-red-600/10 blur-[100px] pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-red-600/15 text-red-500 border border-red-600/30">
              <Scan className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black font-display text-white uppercase tracking-tight">
                BIOMETRIC VIRTUAL FITTING LAB
              </h3>
              <span className="text-xs font-mono-tech text-white/40 uppercase tracking-wider">AI KINETIC SIZING PROTOCOL</span>
            </div>
          </div>

          <button
            id="close-try-on-modal"
            onClick={onClose}
            className="p-2 bg-white/5 text-white/50 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 p-1 bg-black border border-white/10 mb-6">
          <button
            id="tab-camera-btn"
            onClick={() => {
              setActiveTab('camera');
              soundEngine.playClick();
            }}
            className={`flex-1 py-3 text-xs font-mono-tech uppercase font-bold tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'camera'
                ? 'bg-red-600 text-white shadow-lg'
                : 'text-white/40 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>AR CAMERA VIEW</span>
          </button>

          <button
            id="tab-calc-btn"
            onClick={() => {
              setActiveTab('calculator');
              soundEngine.playClick();
            }}
            className={`flex-1 py-3 text-xs font-mono-tech uppercase font-bold tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-red-600 text-white shadow-lg'
                : 'text-white/40 hover:text-white'
            }`}
          >
            <Ruler className="w-4 h-4" />
            <span>METRIC SCANNER</span>
          </button>
        </div>

        {/* Camera AR Mode Content */}
        {activeTab === 'camera' && (
          <div className="space-y-4">
            <div className="relative w-full h-72 sm:h-80 bg-black border border-white/10 overflow-hidden flex items-center justify-center">
              {cameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Holographic AR Reticle Overlay */}
                  <div className="pointer-events-none absolute inset-8 border-2 border-dashed border-red-600/70 flex items-center justify-center">
                    <div className="text-center">
                      <Footprints className="w-12 h-12 text-red-500 mx-auto opacity-70 mb-2 animate-pulse" />
                      <span className="px-3 py-1 bg-black/80 text-[11px] font-mono-tech text-white uppercase tracking-wider">
                        ALIGN FOOT WITHIN SENSOR GRID
                      </span>
                    </div>
                  </div>
                  {isScanning && (
                    <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center">
                      <div className="w-full h-1 bg-red-500 shadow-[0_0_20px_rgba(220,38,38,1)] animate-bounce" />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center p-6 space-y-4">
                  <div className="w-16 h-16 bg-red-600/10 border border-red-600/30 flex items-center justify-center mx-auto text-red-500">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-display uppercase tracking-wider">LIVE FOOT AR VISUALIZER</h4>
                    <p className="text-xs text-white/40 max-w-sm mt-1 mx-auto leading-relaxed">
                      Use your device camera to project KINETIX K-01 directly onto your foot with millimeter alignment.
                    </p>
                  </div>
                  <button
                    id="start-camera-btn"
                    onClick={startCamera}
                    className="px-6 py-3 bg-red-600 text-white text-xs font-mono-tech font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] cursor-pointer"
                  >
                    ACTIVATE AR CAMERA
                  </button>
                  {cameraError && (
                    <p className="text-xs text-amber-400 flex items-center justify-center gap-1.5 mt-2 font-mono-tech">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{cameraError}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {cameraActive && (
              <div className="flex items-center gap-3">
                <button
                  id="trigger-ar-scan-btn"
                  onClick={handleStartScan}
                  disabled={isScanning}
                  className="flex-1 py-3.5 bg-red-600 text-white font-mono-tech text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-700 transition-all cursor-pointer"
                >
                  <Scan className="w-4 h-4" />
                  <span>{isScanning ? 'ANALYZING BIOMETRICS...' : 'SCAN & CALIBRATE FIT'}</span>
                </button>
                <button
                  onClick={stopCamera}
                  className="px-4 py-3.5 bg-white/5 border border-white/10 text-white/60 hover:text-white text-xs font-mono-tech uppercase cursor-pointer"
                >
                  STOP
                </button>
              </div>
            )}
          </div>
        )}

        {/* Metric Calculator Mode Content */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono-tech text-white/50 uppercase tracking-wider">MEASURED FOOT LENGTH:</span>
                <span className="text-lg font-black font-mono-tech text-white">{footLengthCm} CM</span>
              </div>
              <input
                id="foot-length-slider"
                type="range"
                min="22"
                max="32"
                step="0.5"
                value={footLengthCm}
                onChange={(e) => setFootLengthCm(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-none appearance-none cursor-pointer accent-red-600"
              />
              <div className="flex justify-between text-[10px] font-mono-tech text-white/40 mt-1 uppercase">
                <span>22.0 CM (US 5)</span>
                <span>27.5 CM (US 9.5)</span>
                <span>32.0 CM (US 14)</span>
              </div>
            </div>

            {/* Arch Profile */}
            <div>
              <span className="text-xs font-mono-tech text-white/50 uppercase tracking-wider block mb-2">ARCH PROFILE:</span>
              <div className="grid grid-cols-3 gap-2">
                {(['normal', 'high', 'flat'] as const).map((arch) => (
                  <button
                    key={arch}
                    onClick={() => {
                      setArchType(arch);
                      soundEngine.playClick();
                    }}
                    className={`py-3 px-3 text-xs font-mono-tech uppercase tracking-wider transition-all border cursor-pointer ${
                      archType === arch
                        ? 'bg-white text-black font-bold border-white shadow-lg'
                        : 'bg-black text-white/40 border-white/10 hover:text-white'
                    }`}
                  >
                    {arch} ARCH
                  </button>
                ))}
              </div>
            </div>

            {/* Computed Size Recommendation Card */}
            <div className="p-5 bg-[#08080a] border border-red-600/40 flex items-center justify-between shadow-xl">
              <div>
                <span className="text-[10px] font-mono-tech text-red-500 uppercase tracking-widest font-bold block mb-1">
                  RECOMMENDED KINETIX SIZE
                </span>
                <div className="text-3xl font-black font-mono-tech text-white">
                  US {recommendedSize} <span className="text-sm font-normal text-white/40 font-mono-tech">/ EU {Math.round(recommendedSize * 1.3 + 31)}</span>
                </div>
                <span className="text-[11px] text-white/40 block mt-1 font-mono-tech">
                  Fit advice: True to size with Mag-Lock lockdown harness.
                </span>
              </div>

              <button
                id="apply-recommended-size-btn"
                onClick={() => {
                  soundEngine.playChime();
                  onSelectRecommendedSize(recommendedSize);
                  onClose();
                }}
                className="px-6 py-3.5 bg-red-600 text-white font-bold font-mono-tech text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg cursor-pointer"
              >
                APPLY SIZE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
