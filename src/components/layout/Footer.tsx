import React from 'react';
import { Palette, Shield, Sparkles, Truck, RefreshCw, Heart, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types';

interface FooterProps {
  setActiveTab?: (tab: string) => void;
  onNavigate?: (tab: string) => void;
  onRoleSelect?: (role: UserRole) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onNavigate, onRoleSelect }) => {
  const handleNav = (tab: string) => {
    if (onNavigate) onNavigate(tab);
    if (setActiveTab) setActiveTab(tab);
  };

  const handleRole = (role: UserRole) => {
    if (onRoleSelect) onRoleSelect(role);
    else handleNav(role === 'artist' ? 'artist' : role === 'admin' ? 'admin' : 'portal');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        
        {/* Trust Value Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800 text-center sm:text-left">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 shadow-xs">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Unlimited Free Revisions</h4>
              <p className="text-xs text-slate-400 mt-1">We don't print or ship until you 100% love your digital preview proof.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 shadow-xs">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">100% Money-Back Guarantee</h4>
              <p className="text-xs text-slate-400 mt-1">Full refund if your artwork doesn't exceed your expectations.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 shadow-xs">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">100+ Years Archival Quality</h4>
              <p className="text-xs text-slate-400 mt-1">Heavyweight cotton rag, acid-free papers & lightfast artist pigments.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 shadow-xs">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Insured Express Shipping</h4>
              <p className="text-xs text-slate-400 mt-1">Secure shock-proof wooden framing packaging with live tracking.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm shadow-blue-600/30">
                <Palette className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-wide">
                NAVI ART STUDIO
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Handcrafting timeless personal portraits, pencil sketches, and oil masterpieces from your favorite memories. Built to museum archival standards.
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-400 pt-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Over 14,500+ happy commissions completed worldwide
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Artwork Styles</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => handleNav('configurator')} className="hover:text-blue-400 transition-colors">
                  Pencil Portrait Sketches
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('configurator')} className="hover:text-blue-400 transition-colors">
                  Charcoal Chiaroscuro
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('configurator')} className="hover:text-blue-400 transition-colors">
                  Oil on Stretched Canvas
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('configurator')} className="hover:text-blue-400 transition-colors">
                  Watercolor Washes
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('configurator')} className="hover:text-blue-400 transition-colors">
                  Pet & Animal Memorials
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('configurator')} className="hover:text-blue-400 transition-colors">
                  Multi-Photo Family Merges
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Client Care</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => handleNav('portal')} className="hover:text-blue-400 transition-colors">
                  Track My Order & Proofs
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('gallery')} className="hover:text-blue-400 transition-colors">
                  Browse Public Portfolio
                </button>
              </li>
              <li><span className="hover:text-slate-300 cursor-pointer">Framing & Sizing Guide</span></li>
              <li><span className="hover:text-slate-300 cursor-pointer">Photo Quality Guidelines</span></li>
              <li><span className="hover:text-slate-300 cursor-pointer">Corporate & Wedding Gifts</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Atelier Portal</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => handleRole('artist')} className="text-indigo-400 hover:text-indigo-300 font-medium">
                  Artist Studio Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => handleRole('admin')} className="text-blue-400 hover:text-blue-300 font-medium">
                  Operations & Pricing CMS
                </button>
              </li>
              <li className="pt-2 text-slate-500 text-[11px]">
                Progressive Web App (PWA) enabled for offline and mobile installation.
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} Artisanal Custom Art E-Commerce Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            Handcrafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for art collectors & memories
          </div>
        </div>

      </div>
    </footer>
  );
};
