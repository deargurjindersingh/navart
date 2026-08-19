import React from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Palette } from 'lucide-react';
import { OrderConfig, PricingBreakdown } from '../../types';

export interface CartItem {
  id: string;
  config: OrderConfig;
  pricing: PricingBreakdown;
  addedAt: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  onNavigateToConfigurator: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onProceedToCheckout,
  onNavigateToConfigurator,
}) => {
  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => sum + item.pricing.finalTotal, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-900">Your Artwork Cart</h2>
              <span className="text-[11px] text-slate-500 font-medium">Review commission specs</span>
            </div>
          </div>
          <button
            id="btn-close-cart"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/40">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Palette className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-800">Your cart is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Turn your favorite photo into a personalized sketch or portrait to see it in your cart with live pricing.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onNavigateToConfigurator();
                }}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-blue-700 transition-colors"
              >
                Turn Photo Into Art
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 relative group shadow-xs"
              >
                <div className="flex items-start gap-3">
                  {/* Photo thumbnail */}
                  {item.config.sourcePhotos && item.config.sourcePhotos[0] ? (
                    <img
                      src={item.config.sourcePhotos[0].url}
                      alt="Source"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-xs shrink-0">
                      Art
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="font-serif font-bold text-slate-900 text-sm truncate">
                        {item.config.styleName}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {item.pricing.sizeName} • {item.pricing.faceCount} {item.pricing.faceCount === 1 ? 'Face' : 'Faces'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {item.pricing.frameName}
                    </p>

                    <div className="font-mono font-bold text-blue-700 text-sm mt-2">
                      ₹{item.pricing.finalTotal}
                    </div>
                  </div>
                </div>

                {item.pricing.addOnsDetails.length > 0 && (
                  <div className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <strong>Add-ons:</strong> {item.pricing.addOnsDetails.map(a => a.name).join(', ')}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer with Checkout CTA */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-white space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500 uppercase tracking-wider">Subtotal ({items.length} item{items.length > 1 ? 's' : ''})</span>
              <span className="font-mono text-2xl font-bold text-slate-900">₹{totalAmount}</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-blue-900 bg-blue-50 p-2.5 rounded-xl border border-blue-200">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Includes Free Digital Proof & Unlimited Revisions before shipping.</span>
            </div>

            <button
              id="btn-proceed-to-checkout"
              onClick={onProceedToCheckout}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
