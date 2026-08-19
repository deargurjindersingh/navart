import React, { useState } from 'react';
import { X, ZoomIn, Palette, Star, ShieldCheck, Clock, Layers, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { GalleryItem } from '../../types';

interface ArtworkDetailModalProps {
  item: GalleryItem | null;
  onClose: () => void;
  onCommissionSimilar: (item: GalleryItem) => void;
}

export const ArtworkDetailModal: React.FC<ArtworkDetailModalProps> = ({
  item,
  onClose,
  onCommissionSimilar,
}) => {
  const [showBeforePhoto, setShowBeforePhoto] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Close Button */}
        <button
          id="btn-close-gallery-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900 transition-colors shadow-lg"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Artwork Image Showcase with Zoom / Before-After toggle */}
        <div className="md:w-7/12 bg-slate-950 relative flex items-center justify-center overflow-hidden min-h-[320px] md:min-h-[480px]">
          <img
            src={showBeforePhoto && item.beforeImage ? item.beforeImage : item.afterImage}
            alt={item.title}
            className={`w-full h-full object-contain transition-transform duration-300 ${
              isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          />

          {/* Toggle Before/After if available */}
          {item.beforeImage && (
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
              <button
                id="btn-toggle-artwork-view"
                onClick={() => setShowBeforePhoto(!showBeforePhoto)}
                className="px-3.5 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md text-sky-300 border border-sky-400/30 text-xs font-semibold flex items-center gap-1.5 shadow-md hover:bg-slate-800"
              >
                {showBeforePhoto ? (
                  <>
                    <Palette className="w-3.5 h-3.5" />
                    <span>View Handcrafted Art</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>View Original Client Photo</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Zoom hint */}
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-slate-300 text-[10px] px-2.5 py-1 rounded-md flex items-center gap-1 pointer-events-none">
            <ZoomIn className="w-3 h-3" /> Click to {isZoomed ? 'Reset' : 'Zoom'}
          </div>
        </div>

        {/* Right: Specifications, Artist Details & Commission CTA */}
        <div className="md:w-5/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-slate-50/50">
          <div className="space-y-4">
            
            {/* Category & Tags */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-full">
                {item.categoryName}
              </span>
              <span className="text-[10px] font-medium bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                {item.faceCount} {item.faceCount === 1 ? 'Face' : 'Faces'}
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                {item.title}
              </h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Specifications Card */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs text-slate-700 shadow-xs">
              <div className="flex items-start gap-2">
                <Layers className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Medium & Paper:</strong>
                  <div className="text-[11px] text-slate-500 mt-0.5">{item.mediumDetails}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <strong className="text-slate-900">Master Artist:</strong> {item.artistName}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <strong className="text-slate-900">Est. Turnaround:</strong> 3-5 Business Days
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <strong className="text-slate-900">Guarantee:</strong> Free Unlimited Proof Revisions
                </div>
              </div>
            </div>

            {/* Reviews Summary */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-slate-900">{item.rating}</span>
              <span className="text-slate-500">({item.reviewCount} reviews)</span>
            </div>

          </div>

          {/* Pricing & Primary Action */}
          <div className="pt-6 mt-6 border-t border-slate-200">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Starting at</span>
                <span className="font-mono text-2xl font-bold text-slate-900">₹{item.startingPrice}</span>
              </div>
              <span className="text-xs text-slate-500">Includes 1 face + proof</span>
            </div>

            <button
              id="btn-modal-commission-style"
              onClick={() => onCommissionSimilar(item)}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Palette className="w-4 h-4" />
              <span>Turn Photo Into This Style</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
