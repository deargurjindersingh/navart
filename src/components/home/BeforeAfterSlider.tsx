import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, MoveHorizontal, Image as ImageIcon, Palette } from 'lucide-react';
import { ComparisonPair } from '../../types';
import { StorageManager } from '../../utils/storage';

interface BeforeAfterSliderProps {
  onStartConfigurator?: (style?: string) => void;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ onStartConfigurator }) => {
  const [comparisons] = useState<ComparisonPair[]>(() => StorageManager.getComparisonPairs());
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activePair = comparisons[activePresetIndex] || comparisons[0];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    percentage = Math.max(0, Math.min(100, percentage));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <section className="py-20 bg-white border-y border-slate-200">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Interactive Handcrafted Proofs
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            See Customer Photos Become True Art
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Drag the slider across to compare the client's uploaded photograph with the final master artist commission.
          </p>

          {/* Preset Selector Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {comparisons.map((preset, idx) => (
              <button
                key={preset.id}
                id={`preset-comparison-btn-${idx}`}
                onClick={() => {
                  setActivePresetIndex(idx);
                  setSliderPosition(50);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  activePresetIndex === idx
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {preset.title} ({preset.medium})
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Split Comparison Card */}
        <div className="max-w-5xl 2xl:max-w-6xl mx-auto bg-white p-3 sm:p-5 rounded-2xl shadow-xl border border-slate-200">
          
          <div 
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative h-[340px] sm:h-[480px] w-full rounded-xl overflow-hidden select-none cursor-ew-resize group"
          >
            {/* Background: Final Handcrafted Artwork */}
            <img
              src={activePair.artImage}
              alt="Final Handcrafted Artwork"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            
            {/* Top Badge for Art */}
            <div className="absolute top-4 right-4 z-20 bg-slate-900/85 backdrop-blur-md text-sky-300 border border-sky-400/30 text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 shadow-lg">
              <Palette className="w-3.5 h-3.5" />
              <span>Handmade Artwork</span>
            </div>

            {/* Foreground: Customer Uploaded Photo (Clipped based on slider position) */}
            <div 
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={activePair.originalImage}
                alt="Original Customer Photo"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: containerRef.current?.clientWidth || '100%' }}
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* Top Badge for Original Photo */}
            <div className="absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 shadow-lg">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Original Photo</span>
            </div>

            {/* Slider Dividing Bar & Handle */}
            <div 
              className="absolute top-0 bottom-0 z-30 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize flex items-center justify-center -ml-0.5"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-10 h-10 rounded-full bg-white text-slate-900 shadow-2xl border-2 border-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MoveHorizontal className="w-5 h-5 text-slate-900" />
              </div>
            </div>

            {/* Subtle Drag Prompt on bottom */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-slate-900/85 backdrop-blur-md text-slate-300 text-[11px] px-3.5 py-1 rounded-full pointer-events-none">
              Drag left or right to compare
            </div>
          </div>

          {/* Metadata & Quick Commission Bar */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-slate-900 text-lg">
                {activePair.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Artisan: <strong className="text-slate-800">{activePair.artist}</strong> • Medium: {activePair.medium} • {activePair.faceCount}
              </p>
            </div>

            <button
              id="btn-create-similar-from-slider"
              onClick={() => onStartConfigurator && onStartConfigurator(activePair.medium)}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Palette className="w-4 h-4" />
              <span>Turn Photo Into This Style</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
