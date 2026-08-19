import React, { useState, useRef, useEffect } from 'react';
import { 
  Palette, 
  Upload, 
  Users, 
  Sparkles, 
  Check, 
  Eye, 
  ChevronRight, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Info, 
  Truck, 
  Clock, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { 
  ArtworkType, 
  CanvasSize, 
  PaperMaterial, 
  FrameStyle, 
  BackgroundStyle, 
  DeliverySpeed, 
  OrderConfig, 
  PricingBreakdown, 
  PricingConfig, 
  Coupon, 
  UploadedPhoto, 
  BoundingBox 
} from '../../types';
import { calculateOrderPrice } from '../../utils/pricingEngine';
import { INITIAL_COUPONS } from '../../data/initialData';

interface ArtworkConfiguratorProps {
  initialStyle?: ArtworkType;
  pricingConfig: PricingConfig;
  activeCoupons?: Coupon[];
  onAddToCart: (config: OrderConfig, pricing: PricingBreakdown) => void;
  onOpenCart?: () => void;
}

const SAMPLE_TEST_PHOTOS = [
  {
    name: 'Family Portrait (2 Faces)',
    url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80',
    detectedFaces: 2,
    boxes: [
      { id: 'b1', x: 28, y: 15, width: 28, height: 35, confidence: 0.98, label: 'Subject 1 (Person)' },
      { id: 'b2', x: 55, y: 20, width: 26, height: 34, confidence: 0.96, label: 'Subject 2 (Person)' },
    ]
  },
  {
    name: 'Solo Smile (1 Face)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    detectedFaces: 1,
    boxes: [
      { id: 'b1', x: 30, y: 18, width: 42, height: 48, confidence: 0.99, label: 'Subject 1 (Face)' },
    ]
  },
  {
    name: 'Cherished Pet (1 Subject)',
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    detectedFaces: 1,
    boxes: [
      { id: 'b1', x: 25, y: 15, width: 50, height: 55, confidence: 0.97, label: 'Subject 1 (Golden Retriever)' },
    ]
  }
];

export const ArtworkConfigurator: React.FC<ArtworkConfiguratorProps> = ({
  initialStyle = 'pencil',
  pricingConfig,
  activeCoupons = INITIAL_COUPONS,
  onAddToCart,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [artworkType, setArtworkType] = useState<ArtworkType>(initialStyle);
  const [size, setSize] = useState<CanvasSize>('A3');
  const [paperMaterial, setPaperMaterial] = useState<PaperMaterial>('archival_cotton_300gsm');
  const [frame, setFrame] = useState<FrameStyle>('classic_black_wood');
  const [background, setBackground] = useState<BackgroundStyle>('plain_white');
  const [digitalCopy, setDigitalCopy] = useState<boolean>(true);
  const [timelapseVideo, setTimelapseVideo] = useState<boolean>(false);
  const [giftPackaging, setGiftPackaging] = useState<boolean>(false);
  const [authenticityCertificate, setAuthenticityCertificate] = useState<boolean>(true);
  const [deliverySpeed, setDeliverySpeed] = useState<DeliverySpeed>('standard');
  const [customerNotes, setCustomerNotes] = useState<string>('');
  
  // Photo & Face Detection State
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState<boolean>(false);
  const [facesDetected, setFacesDetected] = useState<number>(1);
  const [facesConfirmed, setFacesConfirmed] = useState<number>(1);
  const [showFaceBoxes, setShowFaceBoxes] = useState<boolean>(true);
  const [couponCodeInput, setCouponCodeInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update initial style if prop changes
  useEffect(() => {
    if (initialStyle) {
      setArtworkType(initialStyle);
      if (initialStyle === 'oil_canvas') {
        setPaperMaterial('stretched_canvas');
        setFrame('floating_canvas');
      }
    }
  }, [initialStyle]);

  // Construct current configuration
  const currentConfig: OrderConfig = {
    artworkType,
    styleName: artworkType === 'pencil' ? 'Pencil Sketch (Graphite)' :
               artworkType === 'charcoal' ? 'Charcoal Masterpiece' :
               artworkType === 'watercolor' ? 'Watercolor Dreams' :
               artworkType === 'oil_canvas' ? 'Oil on Canvas' :
               artworkType === 'color_pencil' ? 'Polychromos Color Pencil' : 'Digital Portrait + Print',
    size,
    facesDetected,
    facesConfirmed,
    faceCountConfirmedByUser: true,
    paperMaterial,
    frame,
    background,
    digitalCopy,
    timelapseVideo,
    giftPackaging,
    authenticityCertificate,
    deliverySpeed,
    customerNotes,
    sourcePhotos: uploadedPhotos,
    templateVersion: 'v1.2',
  };

  // Calculate live authoritative price breakdown
  const priceBreakdown = calculateOrderPrice(currentConfig, pricingConfig, appliedCoupon);

  // Handle simulated photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      processNewPhoto(previewUrl, file.name, `${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    }
  };

  const processNewPhoto = (url: string, fileName: string, fileSize: string) => {
    setIsAnalyzingPhoto(true);
    setValidationError('');

    setTimeout(() => {
      const detected = Math.floor(Math.random() * 2) + 1;
      const boxes: BoundingBox[] = [
        { id: 'b1', x: 30, y: 22, width: 36, height: 42, confidence: 0.97, label: 'Subject 1 (Face Detected)' },
      ];
      if (detected > 1) {
        boxes.push({ id: 'b2', x: 60, y: 28, width: 30, height: 38, confidence: 0.95, label: 'Subject 2 (Face Detected)' });
      }

      const newPhoto: UploadedPhoto = {
        id: 'photo-' + Date.now(),
        url,
        fileName,
        fileSize,
        qualityScore: 'excellent',
        detectedFaces: detected,
        boundingBoxes: boxes,
        uploadedAt: new Date().toISOString(),
      };

      setUploadedPhotos([newPhoto]);
      setFacesDetected(detected);
      setFacesConfirmed(detected);
      setIsAnalyzingPhoto(false);
    }, 900);
  };

  const handleSelectSamplePhoto = (sample: typeof SAMPLE_TEST_PHOTOS[0]) => {
    setIsAnalyzingPhoto(true);
    setTimeout(() => {
      const newPhoto: UploadedPhoto = {
        id: 'photo-' + Date.now(),
        url: sample.url,
        fileName: sample.name.toLowerCase().replace(/\s+/g, '_') + '.jpg',
        fileSize: '4.8 MB',
        qualityScore: 'excellent',
        detectedFaces: sample.detectedFaces,
        boundingBoxes: sample.boxes,
        uploadedAt: new Date().toISOString(),
      };
      setUploadedPhotos([newPhoto]);
      setFacesDetected(sample.detectedFaces);
      setFacesConfirmed(sample.detectedFaces);
      setIsAnalyzingPhoto(false);
    }, 600);
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponCodeInput.trim()) return;
    const found = activeCoupons.find(c => c.code.toUpperCase() === couponCodeInput.trim().toUpperCase());
    if (found) {
      if (found.minOrderValue > priceBreakdown.finalTotal) {
        setCouponError(`Min order of ₹${found.minOrderValue} required for this coupon.`);
      } else {
        setAppliedCoupon(found);
        setCouponCodeInput('');
      }
    } else {
      setCouponError('Invalid coupon code. Try WELCOME10 or PORTRAIT500');
    }
  };

  const validateAndProceed = (targetStep: number) => {
    setValidationError('');
    if (currentStep === 2 && targetStep > 2 && uploadedPhotos.length === 0) {
      setValidationError('Please upload at least one photograph or choose a sample photo to continue.');
      return;
    }
    setCurrentStep(targetStep);
  };

  const handleFinalAddToCart = () => {
    if (uploadedPhotos.length === 0) {
      setCurrentStep(2);
      setValidationError('Photo upload is required to submit your custom commission.');
      return;
    }
    onAddToCart(currentConfig, priceBreakdown);
  };

  return (
    <div className="py-8 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 animate-fadeIn">
      
      {/* Configurator Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold uppercase tracking-wider mb-2">
          <Palette className="w-3.5 h-3.5 text-blue-600" />
          Live Custom Art Engine
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
          Turn Your Photo Into Art
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Transform your cherished memories into handcrafted bespoke artwork with live pricing, instant preview proofs, and guaranteed satisfaction.
        </p>
      </div>

      {/* Stepper Progress Tabs */}
      <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-xs mb-8 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[620px]">
          {[
            { num: 1, label: 'Medium & Style' },
            { num: 2, label: 'Photo & Faces' },
            { num: 3, label: 'Size & Canvas' },
            { num: 4, label: 'Custom Framing' },
            { num: 5, label: 'Backdrop & Add-ons' },
            { num: 6, label: 'Review & Cart' },
          ].map((s) => (
            <button
              key={s.num}
              id={`config-step-tab-${s.num}`}
              onClick={() => validateAndProceed(s.num)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentStep === s.num
                  ? 'bg-slate-900 text-white shadow-xs ring-2 ring-blue-500'
                  : currentStep > s.num
                  ? 'text-blue-900 bg-blue-50 hover:bg-blue-100/80 border border-blue-200'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                currentStep === s.num ? 'bg-blue-500 text-white' : currentStep > s.num ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {currentStep > s.num ? '✓' : s.num}
              </span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Configurator Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Step Forms */}
        <div className="lg:col-span-7 xl:col-span-7 2xl:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          
          {validationError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* STEP 1: MEDIUM & STYLE SELECTION */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900">
                  Step 1: Choose Artwork Medium
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Each medium is handcrafted from scratch by a specialized atelier artist.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    id: 'pencil',
                    title: 'Pencil Sketch (Graphite)',
                    desc: 'Timeless black & white tonal shading on Fabriano cotton paper.',
                    price: pricingConfig.basePrices.pencil,
                    badge: 'Most Popular',
                  },
                  {
                    id: 'charcoal',
                    title: 'Charcoal Masterpiece',
                    desc: 'Deep velvety matte blacks with high-contrast conté highlights.',
                    price: pricingConfig.basePrices.charcoal,
                    badge: 'Chiaroscuro',
                  },
                  {
                    id: 'watercolor',
                    title: 'Watercolor Dreams',
                    desc: 'Soft fluid washes, botanical accents, and delicate hues.',
                    price: pricingConfig.basePrices.watercolor,
                    badge: 'Luminous',
                  },
                  {
                    id: 'oil_canvas',
                    title: 'Oil on Canvas',
                    desc: 'Heirloom impasto textures on stretched Belgian canvas.',
                    price: pricingConfig.basePrices.oil_canvas,
                    badge: 'Museum Heirloom',
                  },
                  {
                    id: 'color_pencil',
                    title: 'Polychromos Color Pencil',
                    desc: 'Layered rich color pencil details with lifelike skin tones.',
                    price: pricingConfig.basePrices.color_pencil,
                    badge: 'Vivid Colors',
                  },
                  {
                    id: 'digital_portrait',
                    title: 'Digital Portrait + Archival Print',
                    desc: 'Hand-painted digitally and printed on heavy cotton rag.',
                    price: pricingConfig.basePrices.digital_portrait,
                    badge: 'Fast Turnaround',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    id={`medium-option-${item.id}`}
                    onClick={() => {
                      setArtworkType(item.id as ArtworkType);
                      if (item.id === 'oil_canvas') {
                        setPaperMaterial('stretched_canvas');
                      }
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      artworkType === item.id
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-400 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif font-bold text-slate-900 text-sm">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                        {item.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 uppercase font-medium">Base Price</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">₹{item.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: PHOTO UPLOAD & AI FACE DETECTION */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900">
                  Step 2: Upload Photo & Face Count
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Upload your photo for automatic face count analysis. You can manually adjust or confirm the face count below.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/60 hover:bg-blue-50/30 rounded-3xl p-8 text-center cursor-pointer transition-all group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload-input"
                />

                <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-600 group-hover:scale-110 flex items-center justify-center mx-auto mb-3 transition-transform">
                  <Upload className="w-7 h-7" />
                </div>

                <h3 className="font-serif font-bold text-slate-900 text-base">
                  Click to Upload or Drag & Drop Photo
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Supports JPG, PNG, WEBP up to 25MB • Smartphone photos welcomed
                </p>
              </div>

              {/* Quick Sample Photos Selector */}
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                  Or test with high-resolution sample photos:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {SAMPLE_TEST_PHOTOS.map((sample, idx) => (
                    <button
                      key={idx}
                      id={`sample-photo-btn-${idx}`}
                      onClick={() => handleSelectSamplePhoto(sample)}
                      className="p-2 rounded-xl border border-slate-200 hover:border-blue-500 bg-white text-left transition-all text-xs flex items-center gap-2 group"
                    >
                      <img src={sample.url} alt={sample.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="truncate">
                        <div className="font-semibold text-slate-800 truncate">{sample.name}</div>
                        <div className="text-[10px] text-blue-700 font-medium">{sample.detectedFaces} Subject{sample.detectedFaces > 1 ? 's' : ''}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Uploaded Photo Preview & AI Face Inspector */}
              {isAnalyzingPhoto ? (
                <div className="p-8 rounded-2xl bg-slate-900 text-white text-center space-y-3">
                  <Sparkles className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
                  <div className="font-serif font-bold text-base">Analyzing Photo Clarity & Detecting Faces...</div>
                  <p className="text-xs text-slate-400">Scanning subject contours, resolution metrics, and lighting balance.</p>
                </div>
              ) : uploadedPhotos.length > 0 && (
                <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 space-y-4">
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold">Image Resolution: 300DPI Excellent</span>
                    </div>
                    <button
                      onClick={() => setShowFaceBoxes(!showFaceBoxes)}
                      className="text-[11px] text-sky-300 hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      {showFaceBoxes ? 'Hide Face Boxes' : 'Show Face Boxes'}
                    </button>
                  </div>

                  {/* Interactive Photo with Detected Bounding Boxes */}
                  <div className="relative rounded-2xl overflow-hidden bg-black max-h-[300px] flex items-center justify-center">
                    <img
                      src={uploadedPhotos[0].url}
                      alt="Uploaded Source"
                      className="max-h-[300px] w-full object-contain"
                    />

                    {showFaceBoxes && uploadedPhotos[0].boundingBoxes.map((box) => (
                      <div
                        key={box.id}
                        className="absolute border-2 border-blue-400 bg-blue-500/20 rounded-md pointer-events-none transition-all shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                        style={{
                          left: `${box.x}%`,
                          top: `${box.y}%`,
                          width: `${box.width}%`,
                          height: `${box.height}%`,
                        }}
                      >
                        <span className="absolute -top-6 left-0 bg-slate-900 text-sky-300 text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                          {box.label} ({Math.round(box.confidence * 100)}%)
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Face Count Confirmation */}
                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="font-bold text-sm">Confirmed Face / Subject Count</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Detected: <strong className="text-white">{facesDetected}</strong> • 1st face included; +₹500 for each additional person or pet.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                      <button
                        id="btn-decrement-face-count"
                        onClick={() => setFacesConfirmed(Math.max(1, facesConfirmed - 1))}
                        disabled={facesConfirmed <= 1}
                        className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-mono font-bold text-sky-300 text-base min-w-[20px] text-center">
                        {facesConfirmed}
                      </span>
                      <button
                        id="btn-increment-face-count"
                        onClick={() => setFacesConfirmed(facesConfirmed + 1)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* STEP 3: SIZE & MATERIAL */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900">
                  Step 3: Dimensions & Surface
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Select your portrait dimensions and fine art archival surface.
                </p>
              </div>

              {/* Size Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Canvas Size:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'A4', label: 'A4 Size (8.3 × 11.7 in)', sub: 'Ideal for desks, bedrooms, 1 face', price: 0 },
                    { key: 'A3', label: 'A3 Size (11.7 × 16.5 in)', sub: 'Best seller! Great for 1-2 faces', price: pricingConfig.sizeSurcharges.A3 },
                    { key: 'A2', label: 'A2 Size (16.5 × 23.4 in)', sub: 'Statement gallery wall size', price: pricingConfig.sizeSurcharges.A2 },
                    { key: 'A1', label: 'A1 Size (23.4 × 33.1 in)', sub: 'Grand feature display for living rooms', price: pricingConfig.sizeSurcharges.A1 },
                    { key: 'CANVAS_24X36', label: '24 × 36 in Masterpiece', sub: 'Large format family heirloom canvas', price: pricingConfig.sizeSurcharges.CANVAS_24X36 },
                  ].map((s) => (
                    <button
                      key={s.key}
                      id={`size-option-${s.key}`}
                      onClick={() => setSize(s.key as CanvasSize)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        size === s.key
                          ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-400 font-semibold shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">{s.label}</span>
                        <span className="font-mono text-xs text-slate-700">
                          {s.price === 0 ? 'Included' : `+₹${s.price}`}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">{s.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Surface Material */}
              <div className="pt-4 border-t border-slate-200">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Paper / Canvas Material:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'standard_200gsm', label: 'Standard 200gsm Acid-Free Fine Paper', sub: 'Smooth fine art surface', price: 0 },
                    { key: 'archival_cotton_300gsm', label: 'Archival 300gsm 100% Cotton Rag', sub: 'Museum grade, 100+ year permanence', price: pricingConfig.materialSurcharges.archival_cotton_300gsm },
                    { key: 'stretched_canvas', label: 'Hand-Stretched Belgian Linen Canvas', sub: 'Mounted on solid pinewood bars', price: pricingConfig.materialSurcharges.stretched_canvas },
                    { key: 'wood_panel_board', label: 'Smooth Birch Wood Panel Board', sub: 'Solid natural wooden mount', price: pricingConfig.materialSurcharges.wood_panel_board },
                  ].map((m) => (
                    <button
                      key={m.key}
                      id={`material-option-${m.key}`}
                      onClick={() => setPaperMaterial(m.key as PaperMaterial)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        paperMaterial === m.key
                          ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-400 font-semibold shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">{m.label}</span>
                        <span className="font-mono text-xs text-slate-700">
                          {m.price === 0 ? 'Included' : `+₹${m.price}`}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">{m.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CUSTOM FRAMING */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900">
                  Step 4: Select Custom Framing
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Arrives ready-to-hang with shatterproof acrylic glass and hanging brackets.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    key: 'none',
                    label: 'No Frame (Safely Rolled)',
                    desc: 'Shipped in heavy protective cardboard tube.',
                    price: 0,
                  },
                  {
                    key: 'classic_black_wood',
                    label: 'Classic Matte Black Wood',
                    desc: 'Sleek minimalist modern solid pine wood frame.',
                    price: pricingConfig.frameSurcharges.classic_black_wood,
                  },
                  {
                    key: 'natural_oak',
                    label: 'Natural Scandinavian Oak',
                    desc: 'Warm organic natural wood grain finish.',
                    price: pricingConfig.frameSurcharges.natural_oak,
                  },
                  {
                    key: 'antique_gold',
                    label: 'Vintage Gold Leaf Baroque',
                    desc: 'Ornate classical gilded finish for legacy portraits.',
                    price: pricingConfig.frameSurcharges.antique_gold,
                  },
                  {
                    key: 'floating_canvas',
                    label: 'Deep Floating Canvas Frame',
                    desc: 'Modern gallery style with 1/4" recessed shadow gap.',
                    price: pricingConfig.frameSurcharges.floating_canvas,
                  },
                ].map((f) => (
                  <button
                    key={f.key}
                    id={`frame-option-${f.key}`}
                    onClick={() => setFrame(f.key as FrameStyle)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      frame === f.key
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-400 font-semibold shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 text-xs">{f.label}</span>
                      <span className="font-mono text-xs text-slate-800">
                        {f.price === 0 ? 'Included' : `+₹${f.price}`}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">{f.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: BACKGROUND & ADD-ONS */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900">
                  Step 5: Background & Add-ons
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Fine-tune your background environment and bespoke collector add-ons.
                </p>
              </div>

              {/* Background complexity */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Background Style:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'plain_white', label: 'Clean Studio Plain White / Gradient', sub: 'Keeps focus 100% on the facial expressions', price: 0 },
                    { key: 'minimal_vignette', label: 'Soft Artistic Vignette & Color Splash', sub: 'Subtle watercolor or charcoal halo around subjects', price: pricingConfig.backgroundSurcharges.minimal_vignette },
                    { key: 'detailed_scenic', label: 'Detailed Scenic Background', sub: 'Captures gardens, architecture, or beach scenery', price: pricingConfig.backgroundSurcharges.detailed_scenic },
                    { key: 'custom_request', label: 'Custom Fantasy / Landmark Backdrop', sub: 'Artist will paint a custom requested scene', price: pricingConfig.backgroundSurcharges.custom_request },
                  ].map((bg) => (
                    <button
                      key={bg.key}
                      id={`bg-option-${bg.key}`}
                      onClick={() => setBackground(bg.key as BackgroundStyle)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        background === bg.key
                          ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-400 font-semibold shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">{bg.label}</span>
                        <span className="font-mono text-xs text-slate-700">
                          {bg.price === 0 ? 'Included' : `+₹${bg.price}`}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">{bg.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Add-ons Checkboxes */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Collector Add-ons & Keepsakes:
                </label>

                <div
                  onClick={() => setDigitalCopy(!digitalCopy)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    digitalCopy ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-400' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${digitalCopy ? 'bg-blue-600 text-white' : 'border border-slate-300'}`}>
                      {digitalCopy && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Ultra-HD 300DPI Digital Copy</div>
                      <div className="text-[10px] text-slate-500">Delivered digitally for desktop wallpapers & phone lockscreens</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-800">+₹{pricingConfig.addOnPrices.digitalCopy}</span>
                </div>

                <div
                  onClick={() => setTimelapseVideo(!timelapseVideo)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    timelapseVideo ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-400' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${timelapseVideo ? 'bg-blue-600 text-white' : 'border border-slate-300'}`}>
                      {timelapseVideo && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">4K Artist Timelapse Video of Creation</div>
                      <div className="text-[10px] text-slate-500">60-second edited video showing your artwork being hand-drawn</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-800">+₹{pricingConfig.addOnPrices.timelapseVideo}</span>
                </div>

                <div
                  onClick={() => setGiftPackaging(!giftPackaging)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    giftPackaging ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-400' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${giftPackaging ? 'bg-blue-600 text-white' : 'border border-slate-300'}`}>
                      {giftPackaging && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Luxury Wax-Sealed Gift Box & Ribbon</div>
                      <div className="text-[10px] text-slate-500">Black velvet presentation box with personalized wax seal</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-800">+₹{pricingConfig.addOnPrices.giftPackaging}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: DELIVERY SPEED & SPECIAL ARTIST INSTRUCTIONS */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900">
                  Step 6: Delivery Speed & Artist Notes
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Tell the artist about specific expressions or merged photos, and choose turnaround.
                </p>
              </div>

              {/* Delivery Speed Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Delivery & Production Speed:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'standard', label: 'Standard Delivery', time: '7-10 Business Days', price: 0 },
                    { key: 'express', label: 'Express Priority', time: '3-5 Business Days', price: pricingConfig.deliverySurcharges.express },
                    { key: 'super_rush', label: '48-Hour Studio Rush', time: 'Guaranteed 2-3 Days', price: pricingConfig.deliverySurcharges.super_rush },
                  ].map((d) => (
                    <button
                      key={d.key}
                      id={`delivery-speed-${d.key}`}
                      onClick={() => setDeliverySpeed(d.key as DeliverySpeed)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        deliverySpeed === d.key
                          ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-400 font-semibold shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1 text-slate-900 font-bold text-xs mb-1">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>{d.label}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">{d.time}</div>
                      <div className="font-mono text-xs font-bold text-blue-700 mt-2">
                        {d.price === 0 ? 'Free Shipping' : `+₹${d.price}`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes to Artist */}
              <div className="pt-4 border-t border-slate-200">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Custom Notes for Master Artist:
                </label>
                <textarea
                  id="artist-notes-input"
                  rows={3}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g. Please capture the warm smile from photo 1, merge my grandfather from photo 2, and add a subtle sepia tone..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                ></textarea>
              </div>

            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                id="btn-config-prev"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 6 ? (
              <button
                id="btn-config-next"
                onClick={() => validateAndProceed(currentStep + 1)}
                className="px-7 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="btn-config-add-to-cart"
                onClick={handleFinalAddToCart}
                className="px-8 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-sm font-bold shadow-xl transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Add Custom Artwork to Cart</span>
              </button>
            )}
          </div>

        </div>

        {/* Right Column: Authoritative Live Price Breakdown Card */}
        <div className="lg:col-span-5 xl:col-span-5 2xl:col-span-4 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm sticky top-24 space-y-5">
          
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-serif font-bold text-slate-900 text-lg">
                Price Calculation
              </h3>
              <p className="text-[11px] text-slate-500">Live authoritative invoice breakdown</p>
            </div>
            <span className="text-xs bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-full font-bold">
              {currentConfig.styleName.split(' ')[0]}
            </span>
          </div>

          {/* Configuration Specs Summary */}
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Base Medium ({currentConfig.styleName})</span>
              <span className="font-mono font-medium text-slate-900">₹{priceBreakdown.baseArtworkPrice}</span>
            </div>

            {priceBreakdown.sizeAdjustment > 0 && (
              <div className="flex justify-between">
                <span>Size Upgrade ({size})</span>
                <span className="font-mono font-medium text-slate-900">+₹{priceBreakdown.sizeAdjustment}</span>
              </div>
            )}

            {priceBreakdown.faceCharges > 0 && (
              <div className="flex justify-between">
                <span>Additional Faces ({priceBreakdown.faceCount - 1} extra @ ₹{pricingConfig.additionalFacePrice})</span>
                <span className="font-mono font-medium text-slate-900">+₹{priceBreakdown.faceCharges}</span>
              </div>
            )}

            {priceBreakdown.materialAdjustment > 0 && (
              <div className="flex justify-between">
                <span>Material Upgrade</span>
                <span className="font-mono font-medium text-slate-900">+₹{priceBreakdown.materialAdjustment}</span>
              </div>
            )}

            {priceBreakdown.frameAdjustment > 0 && (
              <div className="flex justify-between">
                <span>Custom Framing</span>
                <span className="font-mono font-medium text-slate-900">+₹{priceBreakdown.frameAdjustment}</span>
              </div>
            )}

            {priceBreakdown.backgroundAdjustment > 0 && (
              <div className="flex justify-between">
                <span>Background Upgrade</span>
                <span className="font-mono font-medium text-slate-900">+₹{priceBreakdown.backgroundAdjustment}</span>
              </div>
            )}

            {priceBreakdown.addOnsDetails.map((addon, idx) => (
              <div key={idx} className="flex justify-between text-slate-600">
                <span>+ {addon.name}</span>
                <span className="font-mono">+₹{addon.price}</span>
              </div>
            ))}

            {priceBreakdown.deliverySurcharge > 0 && (
              <div className="flex justify-between">
                <span>{priceBreakdown.deliveryName}</span>
                <span className="font-mono font-medium text-slate-900">+₹{priceBreakdown.deliverySurcharge}</span>
              </div>
            )}

            {priceBreakdown.couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Coupon ({priceBreakdown.couponCode})</span>
                <span className="font-mono">-₹{priceBreakdown.couponDiscount}</span>
              </div>
            )}
          </div>

          {/* Coupon Input Box */}
          <div className="pt-3 border-t border-slate-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Promo Code (e.g. WELCOME10)"
                value={couponCodeInput}
                onChange={(e) => setCouponCodeInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono uppercase bg-slate-50"
              />
              <button
                id="btn-apply-coupon"
                onClick={handleApplyCoupon}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Apply
              </button>
            </div>
            {couponError && (
              <div className="text-[11px] text-rose-600 mt-1">{couponError}</div>
            )}
            {appliedCoupon && (
              <div className="text-[11px] text-emerald-600 mt-1 font-medium flex items-center gap-1">
                <Check className="w-3 h-3" /> Coupon applied: {appliedCoupon.description}
              </div>
            )}
          </div>

          {/* Final Total Bar */}
          <div className="pt-4 border-t border-slate-200 flex items-baseline justify-between">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Authoritative Total</span>
              <span className="font-mono text-3xl font-extrabold text-slate-900">
                ₹{priceBreakdown.finalTotal}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-emerald-700 font-semibold block">Includes GST & Insured Transit</span>
              <span className="text-[10px] text-slate-400">Unlimited Proof Revisions</span>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200/70 space-y-1.5 text-[11px] text-blue-950">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Satisfaction Guarantee</span>
            </div>
            <p className="text-slate-600 text-[10px] leading-relaxed">
              We never print or ship until you approve the watermarked digital proof created by your artist.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
