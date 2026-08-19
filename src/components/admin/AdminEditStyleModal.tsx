import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  DollarSign, 
  Sparkles, 
  Check, 
  Sliders, 
  Tag, 
  RefreshCw, 
  AlertCircle,
  ExternalLink,
  Layers,
  FileText
} from 'lucide-react';
import { MediumStyleItem, PricingConfig, ArtworkType } from '../../types';

interface AdminEditStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  styleItem: MediumStyleItem | null;
  pricingConfig: PricingConfig;
  onSaveStyle: (updatedStyle: MediumStyleItem, updatedPricingConfig?: PricingConfig) => void;
  onNavigateToFullAdmin?: (targetTab?: 'orders' | 'pricing' | 'gallery') => void;
}

export const AdminEditStyleModal: React.FC<AdminEditStyleModalProps> = ({
  isOpen,
  onClose,
  styleItem,
  pricingConfig,
  onSaveStyle,
  onNavigateToFullAdmin,
}) => {
  if (!isOpen || !styleItem) return null;

  const [title, setTitle] = useState(styleItem.title);
  const [description, setDescription] = useState(styleItem.description);
  const [startingPrice, setStartingPrice] = useState<number>(styleItem.startingPrice);
  const [tag, setTag] = useState(styleItem.tag);
  const [imageUrl, setImageUrl] = useState(styleItem.image);
  const [customSurchargeA3, setCustomSurchargeA3] = useState<number>(pricingConfig.sizeSurcharges.A3 || 400);
  const [customSurchargeA2, setCustomSurchargeA2] = useState<number>(pricingConfig.sizeSurcharges.A2 || 900);
  const [customAdditionalFace, setCustomAdditionalFace] = useState<number>(pricingConfig.additionalFacePrice || 500);

  const [isDragOver, setIsDragOver] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, WEBP).');
      return;
    }
    setUploadLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageUrl(e.target.result as string);
        setUploadLoading(false);
      }
    };
    reader.onerror = () => {
      setUploadLoading(false);
      alert('Failed to read the image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSave = () => {
    const updatedStyle: MediumStyleItem = {
      ...styleItem,
      title: title.trim() || styleItem.title,
      description: description.trim() || styleItem.description,
      startingPrice: Number(startingPrice) || styleItem.startingPrice,
      tag: tag.trim() || styleItem.tag,
      image: imageUrl.trim() || styleItem.image,
    };

    const updatedPricing: PricingConfig = {
      ...pricingConfig,
      basePrices: {
        ...pricingConfig.basePrices,
        [styleItem.type]: Number(startingPrice) || styleItem.startingPrice,
      },
      sizeSurcharges: {
        ...pricingConfig.sizeSurcharges,
        A3: Number(customSurchargeA3),
        A2: Number(customSurchargeA2),
      },
      additionalFacePrice: Number(customAdditionalFace),
    };

    onSaveStyle(updatedStyle, updatedPricing);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  // Sample quick photo presets
  const samplePresets: { label: string; url: string }[] = [
    { label: 'Pencil Studio', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80' },
    { label: 'Charcoal Noir', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80' },
    { label: 'Watercolor Splash', url: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80' },
    { label: 'Oil Canvas Impasto', url: 'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?auto=format&fit=crop&w=800&q=80' },
    { label: 'Color Pencil Fine', url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80' },
    { label: 'Digital Archival', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-sky-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/30 text-sky-200 px-2 py-0.5 rounded-md border border-blue-400/30">
                  Admin Medium Customizer
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  #{styleItem.type}
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
                Edit Photo & Pricing: {styleItem.title}
              </h2>
            </div>
          </div>

          <button
            id="btn-close-admin-style-modal"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {saveSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Changes published live! New photo and starting price of <strong>₹{startingPrice}</strong> are now active on the storefront and configurator.
              </span>
            </div>
          )}

          {/* Section 1: Photo Upload & Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>1. Style Showcase Photo & Artwork Cover</span>
              </label>
              <span className="text-[11px] text-slate-500">
                Recommended 800x600 or high-res square
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {/* Preview Box */}
              <div className="md:col-span-5 relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 aspect-4/3 group">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-md text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-400/30">
                  {tag || 'Active Badge'}
                </div>
                <div className="absolute bottom-2.5 left-2.5 bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded-lg border border-slate-700">
                  ₹{startingPrice}
                </div>
              </div>

              {/* Upload & Dropzone Controls */}
              <div className="md:col-span-7 space-y-3">
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-2 ${
                    isDragOver 
                      ? 'border-blue-500 bg-blue-50/50' 
                      : 'border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-slate-100/60'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      {uploadLoading ? 'Uploading image...' : 'Click to Upload or Drag & Drop Photo'}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Upload any JPG, PNG, or WEBP photo from your computer
                    </p>
                  </div>
                </div>

                {/* Direct Image URL input */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Or paste direct Image Web URL:
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                    Quick Sample Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {samplePresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImageUrl(preset.url)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-800 text-slate-700 text-[10px] font-medium border border-slate-200 transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing Configuration */}
          <div className="pt-5 border-t border-slate-200 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>2. Pricing Architecture & Base Rates</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Base Price */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <label className="text-xs font-bold text-slate-900 block">
                  Base Starting Price (1 Face + Proof)
                </label>
                <p className="text-[11px] text-slate-500">
                  Displayed on "Starts at" card & base configurator rate
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="font-mono text-base font-bold text-slate-500">₹</span>
                  <input
                    id="admin-style-starting-price-input"
                    type="number"
                    min="100"
                    step="50"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-base font-bold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Additional Face surcharge */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <label className="text-xs font-bold text-slate-900 block">
                  Per Additional Face Rate
                </label>
                <p className="text-[11px] text-slate-500">
                  Charge for Face 2, Face 3, etc. (SRS Sec 11)
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="font-mono text-base font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={customAdditionalFace}
                    onChange={(e) => setCustomAdditionalFace(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-base font-bold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Size Surcharges Snapshot */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <label className="text-xs font-bold text-slate-900 block">
                  Size Surcharge (A3 / A2)
                </label>
                <p className="text-[11px] text-slate-500">
                  Canvas dimension upgrades
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold">A3 Surcharge</span>
                    <input
                      type="number"
                      value={customSurchargeA3}
                      onChange={(e) => setCustomSurchargeA3(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded-lg border border-slate-300 font-mono text-xs font-bold text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold">A2 Surcharge</span>
                    <input
                      type="number"
                      value={customSurchargeA2}
                      onChange={(e) => setCustomSurchargeA2(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded-lg border border-slate-300 font-mono text-xs font-bold text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Title, Tag & Description */}
          <div className="pt-5 border-t border-slate-200 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-indigo-600" />
              <span>3. Medium Name, Highlight Tag & Copy</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Medium Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Card Highlight Badge Tag
                </label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. Most Popular, High Contrast, Heirloom"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Craft Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-5 sm:p-6 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          {onNavigateToFullAdmin ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigateToFullAdmin('pricing');
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Full Atelier Admin Console</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
            >
              Cancel
            </button>

            <button
              id="btn-admin-save-style-changes"
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save & Publish Live</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
