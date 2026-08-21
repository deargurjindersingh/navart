import React, { useState, useEffect } from 'react';
import { Palette, Sparkles, ArrowRight, Sliders, Upload, Edit, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { ArtworkType, UserRole, UserProfile, MediumStyleItem, PricingConfig } from '../../types';
import { StorageManager } from '../../utils/storage';
import { AdminEditStyleModal } from '../admin/AdminEditStyleModal';

interface StyleShowcaseProps {
  onSelectStyle: (style: ArtworkType) => void;
  currentRole?: UserRole;
  currentUser?: UserProfile | null;
  pricingConfig?: PricingConfig;
  onUpdatePricingConfig?: (newConfig: PricingConfig) => void;
  onNavigateToAdmin?: (tab?: 'orders' | 'pricing' | 'gallery') => void;
}

export const StyleShowcase: React.FC<StyleShowcaseProps> = ({ 
  onSelectStyle,
  currentRole = 'customer',
  currentUser,
  pricingConfig,
  onUpdatePricingConfig,
  onNavigateToAdmin
}) => {
  const [styles, setStyles] = useState<MediumStyleItem[]>(() => StorageManager.getStyles());
  const [selectedStyleForEdit, setSelectedStyleForEdit] = useState<MediumStyleItem | null>(null);
  const [isAdminEditModalOpen, setIsAdminEditModalOpen] = useState(false);
  const [liveSuccessNotification, setLiveSuccessNotification] = useState<string | null>(null);

  // Sync styles on mount and role changes
  useEffect(() => {
    setStyles(StorageManager.getStyles());
  }, [currentRole]);

  const isAdmin = currentRole === 'admin' || (currentUser && (currentUser.role === 'admin' || currentUser.role === 'operations'));

  const handleCardClick = (style: MediumStyleItem) => {
    if (isAdmin) {
      // Redirect to Photo Upload and Pricing modal
      setSelectedStyleForEdit(style);
      setIsAdminEditModalOpen(true);
    } else {
      onSelectStyle(style.type);
    }
  };

  const handleSaveStyleChanges = (updatedStyle: MediumStyleItem, updatedPricing?: PricingConfig) => {
    StorageManager.updateStyle(updatedStyle);
    setStyles(StorageManager.getStyles());

    if (updatedPricing && onUpdatePricingConfig) {
      onUpdatePricingConfig(updatedPricing);
    }

    setLiveSuccessNotification(`Successfully updated photo and starting price for ${updatedStyle.title}!`);
    setTimeout(() => setLiveSuccessNotification(null), 4000);
  };

  const currentPricing = pricingConfig || StorageManager.getPricingConfig();

  return (
    <section className="py-20 bg-white border-t border-slate-200 relative">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        
        {/* Admin Operational Banner */}
        {isAdmin && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                  Admin Visual CMS Mode
                </span>
                <p className="text-xs font-semibold text-amber-900 mt-0.5">
                  Logged in as Administrator. Click <strong>"Customize"</strong> or any style card to upload a new photo & change its starting pricing.
                </p>
              </div>
            </div>

            {onNavigateToAdmin && (
              <button
                id="btn-admin-open-pricing-tab"
                onClick={() => onNavigateToAdmin('pricing')}
                className="px-3.5 py-1.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-900 text-xs font-bold transition-colors whitespace-nowrap self-start sm:self-auto"
              >
                Open Full Studio Pricing Console →
              </button>
            )}
          </div>
        )}

        {liveSuccessNotification && (
          <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{liveSuccessNotification}</span>
          </div>
        )}

        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-violet-700 font-bold text-xs uppercase tracking-widest bg-violet-50 border border-violet-200 px-4 py-1.5 rounded-full inline-block mb-3">
            Artistic Mediums
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Choose Your Art Style
          </h2>
          <p className="text-slate-600 text-base mt-3">
            From classic to contemporary, find the perfect style for your memories.
          </p>
        </div>

        {/* Medium Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
          {styles.map((style) => {
            // Live price from pricing config or style starting price
            const activePrice = currentPricing.basePrices[style.type] || style.startingPrice;

            return (
              <div
                key={style.type}
                id={`style-card-${style.type}`}
                onClick={() => handleCardClick(style)}
                className={`group bg-white rounded-2xl overflow-hidden border shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col relative ${
                  isAdmin 
                    ? 'border-amber-300/80 hover:border-amber-500 hover:ring-2 hover:ring-amber-400/40' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Admin Ribbon */}
                {isAdmin && (
                  <div className="absolute top-3 left-3 z-10 bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Edit className="w-3 h-3" />
                    <span>Admin: Edit Photo/Price</span>
                  </div>
                )}

                <div className="relative h-64 w-full overflow-hidden bg-slate-50 flex items-center justify-center">
                  <img
                    src={style.image}
                    alt={style.title}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Photo Replacement Quick Button for Admin */}
                  {isAdmin && (
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="px-4 py-2 rounded-xl bg-white/95 text-slate-900 text-xs font-bold shadow-lg flex items-center gap-2">
                        <Upload className="w-4 h-4 text-blue-600" />
                        <span>Change Photo & Upload</span>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-md text-sky-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-sky-400/30 z-10">
                    {style.tag}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                      {style.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {style.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Starts at</span>
                      <span className="font-mono font-bold text-slate-900 text-base">₹{activePrice}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(style);
                      }}
                      className={`inline-flex items-center gap-1 text-xs font-bold transition-all px-3 py-1.5 rounded-lg ${
                        isAdmin 
                          ? 'bg-amber-100 text-amber-900 hover:bg-amber-200' 
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <span>{isAdmin ? 'Edit Photo & Price' : 'Customize'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Admin Edit Modal */}
      <AdminEditStyleModal
        isOpen={isAdminEditModalOpen}
        onClose={() => {
          setIsAdminEditModalOpen(false);
          setSelectedStyleForEdit(null);
        }}
        styleItem={selectedStyleForEdit}
        pricingConfig={currentPricing}
        onSaveStyle={handleSaveStyleChanges}
        onNavigateToFullAdmin={onNavigateToAdmin}
      />
    </section>
  );
};
