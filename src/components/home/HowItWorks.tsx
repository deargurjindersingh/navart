import React from 'react';
import { UploadCloud, Sliders, CreditCard, Palette, PackageCheck, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onStartConfiguring?: () => void;
  onStartConfigurator?: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartConfiguring, onStartConfigurator }) => {
  const handleStart = () => {
    if (onStartConfiguring) onStartConfiguring();
    else if (onStartConfigurator) onStartConfigurator();
  };

  const steps = [
    {
      step: '01',
      title: 'Upload Your Photo',
      description: 'Upload any favorite snapshot, family portrait, or pet photo. Our system analyzes photo clarity and detects faces.',
      icon: UploadCloud,
      badge: 'Smart Detection'
    },
    {
      step: '02',
      title: 'Customize Medium & Frame',
      description: 'Choose your desired medium (Pencil, Charcoal, Watercolor, or Oil), size, paper grade, framing, and custom background.',
      icon: Sliders,
      badge: 'Live Pricing'
    },
    {
      step: '03',
      title: 'Seamless Secure Payment',
      description: 'Review your calculated price breakdown, apply promo codes, and check out securely via Cards, UPI, or NetBanking.',
      icon: CreditCard,
      badge: '100% Protected'
    },
    {
      step: '04',
      title: 'Review Digital Proof',
      description: 'Your assigned master artist handcrafts the artwork and uploads a digital proof. Approve it or request free revisions with one click.',
      icon: Palette,
      badge: 'Unlimited Revisions'
    },
    {
      step: '05',
      title: 'Museum-Grade Delivery',
      description: 'Once approved, your piece is framed, sealed with UV protection, carefully packaged in shock-proof boxes, and shipped with live tracking.',
      icon: PackageCheck,
      badge: 'Insured Courier'
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-700 font-bold text-xs uppercase tracking-widest bg-blue-50 border border-blue-200/80 px-3.5 py-1.5 rounded-full">
            Simple 5-Step Craft Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mt-3">
            How Your Artwork Comes to Life
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3">
            From raw photo to heirloom masterpiece in 5 simple, transparent steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.step}
                className="relative bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono font-bold text-2xl text-slate-300">
                      {item.step}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {item.badge}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-blue-400 flex items-center justify-center mb-4 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-serif font-bold text-slate-900 text-lg mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-400">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Callout banner */}
        <div className="mt-12 p-6 sm:p-8 bg-slate-900 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-blue-400">
              Ready to create your custom masterpiece?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Start with live price calculation and instant photo face detection.
            </p>
          </div>

          <button
            onClick={handleStart}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/30 transition-all whitespace-nowrap"
          >
            Turn Your Photo Into Art Now
          </button>
        </div>

      </div>
    </section>
  );
};
