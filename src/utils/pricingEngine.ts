import { OrderConfig, PricingBreakdown, PricingConfig, Coupon } from '../types';
import { DEFAULT_PRICING_CONFIG } from '../data/initialData';

export function calculateOrderPrice(
  config: Partial<OrderConfig>,
  pricingConfig: PricingConfig = DEFAULT_PRICING_CONFIG,
  appliedCoupon?: Coupon | null
): PricingBreakdown {
  const artworkType = config.artworkType || 'pencil';
  const basePrice = pricingConfig.basePrices[artworkType] || 999;

  // Size
  const size = config.size || 'A4';
  const sizeAdjustment = pricingConfig.sizeSurcharges[size] || 0;
  const sizeNameMap: Record<string, string> = {
    A4: 'A4 (8.3 × 11.7 in)',
    A3: 'A3 (11.7 × 16.5 in)',
    A2: 'A2 (16.5 × 23.4 in)',
    A1: 'A1 (23.4 × 33.1 in)',
    CANVAS_24X36: '24 × 36 in Masterpiece Canvas',
  };

  // Face calculation (SRS Section 11: Face 1 included; face 2+ = ₹500 each)
  const faceCount = Math.max(1, config.facesConfirmed || config.facesDetected || 1);
  const extraFaces = Math.max(0, faceCount - 1);
  const faceCharges = extraFaces * pricingConfig.additionalFacePrice;

  // Material
  const material = config.paperMaterial || 'standard_200gsm';
  const materialAdjustment = pricingConfig.materialSurcharges[material] || 0;
  const materialNameMap: Record<string, string> = {
    standard_200gsm: 'Standard 200gsm Acid-Free Fine Paper',
    archival_cotton_300gsm: 'Archival 300gsm 100% Cotton Rag',
    stretched_canvas: 'Hand-Stretched Belgian Linen Canvas',
    wood_panel_board: 'Birch Wood Panel Board',
  };

  // Frame
  const frame = config.frame || 'none';
  const frameAdjustment = pricingConfig.frameSurcharges[frame] || 0;
  const frameNameMap: Record<string, string> = {
    none: 'No Frame (Rolled in Protective Tube)',
    classic_black_wood: 'Classic Matte Black Solid Wood Frame',
    natural_oak: 'Natural Scandinavian Oak Wood Frame',
    antique_gold: 'Vintage Gold Leaf Ornate Frame',
    floating_canvas: 'Deep Floating Canvas Frame',
  };

  // Background
  const background = config.background || 'plain_white';
  const backgroundAdjustment = pricingConfig.backgroundSurcharges[background] || 0;
  const backgroundNameMap: Record<string, string> = {
    plain_white: 'Clean Studio Plain White / Gradient',
    minimal_vignette: 'Soft Artistic Vignette & Color Splash',
    detailed_scenic: 'Detailed Scenic Background',
    custom_request: 'Custom Fantasy / Landmark Backdrop',
  };

  // Add-ons
  const addOnsDetails: { name: string; price: number }[] = [];
  let addOnsTotal = 0;

  if (config.digitalCopy) {
    const price = pricingConfig.addOnPrices.digitalCopy;
    addOnsDetails.push({ name: 'Ultra-HD 300DPI Digital Artwork Copy', price });
    addOnsTotal += price;
  }

  if (config.timelapseVideo) {
    const price = pricingConfig.addOnPrices.timelapseVideo;
    addOnsDetails.push({ name: '4K Timelapse Video of Artist Creation', price });
    addOnsTotal += price;
  }

  if (config.giftPackaging) {
    const price = pricingConfig.addOnPrices.giftPackaging;
    addOnsDetails.push({ name: 'Luxury Wax-Sealed Gift Box & Ribbon', price });
    addOnsTotal += price;
  }

  if (config.authenticityCertificate) {
    const price = pricingConfig.addOnPrices.authenticityCertificate;
    addOnsDetails.push({ name: 'Hand-Signed Certificate of Authenticity', price });
    addOnsTotal += price;
  }

  // Delivery
  const delivery = config.deliverySpeed || 'standard';
  const deliverySurcharge = pricingConfig.deliverySurcharges[delivery] || 0;
  const deliveryNameMap: Record<string, string> = {
    standard: 'Standard Insured Delivery (7-10 Days)',
    express: 'Express Priority Courier (3-5 Days)',
    super_rush: '48-Hour Studio Rush Production',
  };

  // Subtotal before discounts
  const subtotal = 
    basePrice +
    sizeAdjustment +
    faceCharges +
    materialAdjustment +
    frameAdjustment +
    backgroundAdjustment +
    addOnsTotal +
    deliverySurcharge;

  // Coupon Discount
  let couponDiscount = 0;
  let couponCodeApplied: string | undefined = undefined;

  if (appliedCoupon && appliedCoupon.isActive) {
    if (subtotal >= appliedCoupon.minOrderValue) {
      if (appliedCoupon.discountType === 'percentage') {
        couponDiscount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      } else {
        couponDiscount = Math.min(subtotal, appliedCoupon.discountValue);
      }
      couponCodeApplied = appliedCoupon.code;
    }
  }

  const finalTotal = Math.max(0, subtotal - couponDiscount);

  return {
    baseArtworkPrice: basePrice,
    sizeAdjustment,
    sizeName: sizeNameMap[size] || size,
    faceCharges,
    faceCount,
    materialAdjustment,
    materialName: materialNameMap[material] || material,
    frameAdjustment,
    frameName: frameNameMap[frame] || frame,
    backgroundAdjustment,
    backgroundName: backgroundNameMap[background] || background,
    addOnsTotal,
    addOnsDetails,
    deliverySurcharge,
    deliveryName: deliveryNameMap[delivery] || delivery,
    couponDiscount,
    couponCode: couponCodeApplied,
    finalTotal,
    currency: pricingConfig.currency,
  };
}
