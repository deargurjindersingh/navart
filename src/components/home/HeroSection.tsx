import React, { useState } from 'react';
import { 
  Palette, 
  ShieldCheck, 
  Sparkles, 
  Star, 
  ArrowRight, 
  Eye, 
  Check, 
  CheckCircle2, 
  Truck, 
  RotateCcw, 
  Award,
  Heart,
  ChevronLeft,
  ChevronRight,
  Clock
} from 'lucide-react';

interface HeroSectionProps {
  onStartConfigurator?: (style?: string) => void;
  onStartCustomOrder?: () => void;
  onExploreGallery: () => void;
  onTrackOrder?: () => void;
}

const HERO_SLIDES = [
  {
    id: 'family',
    title: 'Cherished Family Oil Painting',
    artist: 'Master Atelier Elena',
    medium: 'Oil on 100% Linen Canvas',
    paintedImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    originalPhoto: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=500&q=80',
    originalLabel: 'Customer Photo'
  },
  {
    id: 'couple',
    title: 'Vintage Couple Graphite Portrait',
    artist: 'Senior Artist Raghav M.',
    medium: 'Tonal Pencil on Cotton Paper',
    paintedImage: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1200&q=80',
    originalPhoto: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=500&q=80',
    originalLabel: 'Anniversary Photo'
  },
  {
    id: 'pet',
    title: 'Bespoke Pet Watercolor Study',
    artist: 'Illustrator Priya K.',
    medium: 'Layered Wet-on-Wet Watercolor',
    paintedImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    originalPhoto: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80',
    originalLabel: 'Original Snap'
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartConfigurator,
  onStartCustomOrder,
  onExploreGallery,
  onTrackOrder
}) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const handleStart = () => {
    if (onStartCustomOrder) onStartCustomOrder();
    else if (onStartConfigurator) onStartConfigurator();
  };

  const activeSlide = HERO_SLIDES[activeSlideIndex];

  return (
    <div className="bg-[#fbf8f4] text-stone-900 selection:bg-emerald-900 selection:text-white">
      
      {/* Top Main Hero Section */}
      <section className="relative pt-8 pb-14 lg:pt-14 lg:pb-20 border-b border-stone-200/70 overflow-hidden">
        
        {/* Subtle Ambient Atelier Glow */}
        <div className="absolute top-0 right-10 w-[550px] h-[550px] bg-amber-100/35 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-emerald-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
            
            {/* Left Column: Visual Artwork Showcase with Inset Polaroid & Carousel */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative mx-auto max-w-xl lg:max-w-none">
                
                {/* Main Painted Artwork Display Frame */}
                <div className="relative rounded-3xl overflow-hidden bg-stone-900 shadow-2xl ring-1 ring-stone-900/10 aspect-[4/3] sm:aspect-[16/13]">
                  <img
                    src={activeSlide.paintedImage}
                    alt={activeSlide.title}
                    className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
                    key={activeSlide.id}
                  />

                  {/* Soft Gradient Overlay for Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/10 to-transparent" />

                  {/* Top Floating Badge: Handcrafted Guarantee */}
                  <div className="absolute top-4 left-4 sm:top-5 sm:left-5">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-900/85 backdrop-blur-md text-white text-[11px] sm:text-xs font-medium border border-white/15 shadow-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>100% Hand-Painted Original</span>
                    </span>
                  </div>

                  {/* Inset Polaroid: "Original Customer Photo" */}
                  <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 transform rotate-2 hover:rotate-0 transition-transform duration-300 z-10">
                    <div className="bg-white p-2 sm:p-2.5 pb-4 sm:pb-5 rounded-xl shadow-2xl border border-stone-200/80 w-28 sm:w-36 text-center">
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-stone-100 border border-stone-200/60 mb-1.5">
                        <img
                          src={activeSlide.originalPhoto}
                          alt={activeSlide.originalLabel}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 left-1 bg-stone-900/75 text-[9px] text-white font-mono px-1.5 py-0.5 rounded">
                          Before
                        </div>
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-serif text-stone-700 font-bold block truncate">
                        {activeSlide.originalLabel}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Left Artwork Caption */}
                  <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 text-white max-w-[55%] z-10">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-amber-300/90 flex items-center gap-1">
                      <Palette className="w-3 h-3" />
                      <span>{activeSlide.medium}</span>
                    </div>
                    <div className="font-serif font-bold text-sm sm:text-base text-white truncate drop-shadow-sm">
                      {activeSlide.title}
                    </div>
                    <div className="text-[11px] text-stone-300">
                      By {activeSlide.artist}
                    </div>
                  </div>

                  {/* Slide Navigation Buttons */}
                  <button
                    type="button"
                    onClick={() => setActiveSlideIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-stone-900/60 hover:bg-stone-900/90 text-white flex items-center justify-center backdrop-blur-xs transition-colors z-20"
                    aria-label="Previous masterpiece preview"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSlideIndex((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-stone-900/60 hover:bg-stone-900/90 text-white flex items-center justify-center backdrop-blur-xs transition-colors z-20"
                    aria-label="Next masterpiece preview"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Carousel Pagination Indicator Dots */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  {HERO_SLIDES.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        activeSlideIndex === idx
                          ? 'w-7 bg-emerald-800'
                          : 'w-2 bg-stone-300 hover:bg-stone-400'
                      }`}
                      aria-label={`Show ${slide.title}`}
                    />
                  ))}
                </div>

                {/* Social Proof Bar underneath image */}
                <div className="mt-4 pt-4 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-stone-700">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <img
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-[#fbf8f4] object-cover"
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                        alt="Customer Priya S."
                      />
                      <img
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-[#fbf8f4] object-cover"
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                        alt="Customer Rohan M."
                      />
                      <img
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-[#fbf8f4] object-cover"
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                        alt="Customer Ananya D."
                      />
                      <img
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-[#fbf8f4] object-cover"
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                        alt="Customer Vikram P."
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1 text-emerald-700">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="inline-block text-emerald-700 text-xs leading-none">★</span>
                        ))}
                        <span className="font-bold text-stone-900 text-xs ml-1 font-mono">4.9 / 5</span>
                      </div>
                      <p className="text-[11px] text-stone-500 font-medium">
                        Trusted by 2,500+ happy customers
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-600 bg-white/70 px-3 py-1 rounded-lg border border-stone-200/60 font-serif italic">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>Museum Archival Materials</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: High-Conversion Headline, Copy, Guarantees & Actions */}
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6 text-left">
              
              {/* Atelier Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-stone-100/90 text-stone-800 text-[11px] sm:text-xs font-semibold tracking-wider uppercase border border-stone-300/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>Hand-Painted by Real Artists</span>
              </div>

              {/* Display Headline */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-stone-900 leading-[1.15]">
                Turn Your Photo Into a <br className="hidden sm:inline" />
                <span className="font-serif text-stone-900">
                  Hand-Painted Masterpiece
                </span>
              </h1>

              {/* Subheadline Copy */}
              <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Professional artists paint your portrait by hand in oil, acrylic, watercolor, and pencil. 
                Delivered safely across India with <strong className="text-stone-900 font-semibold">free digital proofs & unlimited revisions</strong> included.
              </p>

              {/* Bullet Guarantees List */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center gap-2.5 text-stone-800 text-sm font-medium">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span>Free safe & insured shipping nationwide</span>
                </div>

                <div className="flex items-center gap-2.5 text-stone-800 text-sm font-medium">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span>Free proof revisions until you're 100% happy</span>
                </div>

                <div className="flex items-center gap-2.5 text-stone-800 text-sm font-medium">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span>100% money-back satisfaction guarantee</span>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  id="hero-cta-create-artwork"
                  onClick={handleStart}
                  className="px-8 py-4 bg-[#143e2b] hover:bg-[#0e2c1e] text-white rounded-xl font-bold text-base shadow-lg shadow-emerald-950/15 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 group"
                >
                  <Palette className="w-5 h-5 text-emerald-300 group-hover:rotate-12 transition-transform" />
                  <span>Start My Portrait</span>
                  <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  id="hero-cta-browse-gallery"
                  onClick={onExploreGallery}
                  className="px-7 py-4 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 rounded-xl font-semibold text-base shadow-xs hover:border-stone-400 transition-all flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4 text-stone-500" />
                  <span>Browse Gallery</span>
                </button>
              </div>

              {/* Pricing Assurance Subline */}
              <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-stone-600 font-medium">
                <span className="font-bold text-stone-900 font-mono">₹999 starting price</span>
                <span className="text-stone-300">•</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Free proof to review</span>
                </span>
                <span className="text-stone-300">•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Balance due only after you approve</span>
                </span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4 Bottom Value Stats Ribbon */}
      <section className="bg-white border-b border-stone-200/80 py-6 sm:py-8">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-stone-200/70">
            
            {/* Stat 1 */}
            <div className="flex items-center gap-3.5 sm:px-4 pt-4 sm:pt-0">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/60">
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
              </div>
              <div>
                <div className="font-serif font-bold text-stone-900 text-base">4.9 / 5</div>
                <div className="text-xs text-stone-500">Verified client rating</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-3.5 sm:px-4 pt-4 sm:pt-0">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/60">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-serif font-bold text-stone-900 text-base">4–7 Days</div>
                <div className="text-xs text-stone-500">Express insured delivery</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-3.5 sm:px-4 pt-4 sm:pt-0">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200/60">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <div className="font-serif font-bold text-stone-900 text-base">Free Revisions</div>
                <div className="text-xs text-stone-500">Until you love your proof</div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-3.5 sm:px-4 pt-4 sm:pt-0">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200/60">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-serif font-bold text-stone-900 text-base">100% Guarantee</div>
                <div className="text-xs text-stone-500">Risk-free satisfaction</div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
