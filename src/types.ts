/**
 * Core Types based on the Custom Art E-Commerce SRS
 */

export type UserRole = 'customer' | 'artist' | 'operations' | 'admin';

export type ArtworkType = 
  | 'pencil'
  | 'charcoal'
  | 'oil_canvas'
  | 'watercolor'
  | 'color_pencil'
  | 'digital_portrait';

export type CanvasSize = 'A4' | 'A3' | 'A2' | 'A1' | 'CANVAS_24X36';

export type PaperMaterial = 
  | 'standard_200gsm' 
  | 'archival_cotton_300gsm' 
  | 'stretched_canvas' 
  | 'wood_panel_board';

export type FrameStyle = 
  | 'none' 
  | 'classic_black_wood' 
  | 'natural_oak' 
  | 'antique_gold' 
  | 'floating_canvas';

export type BackgroundStyle = 
  | 'plain_white' 
  | 'minimal_vignette' 
  | 'detailed_scenic' 
  | 'custom_request';

export type DeliverySpeed = 'standard' | 'express' | 'super_rush';

export type OrderStatus =
  | 'draft'
  | 'submitted'
  | 'payment_pending'
  | 'paid'
  | 'photo_verification'
  | 'artist_assigned'
  | 'in_production'
  | 'preview_uploaded'
  | 'awaiting_customer_approval'
  | 'revision_requested'
  | 'approved'
  | 'quality_check'
  | 'ready_to_ship'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'on_hold';

export interface BoundingBox {
  id: string;
  x: number;      // percentage 0-100
  y: number;      // percentage 0-100
  width: number;  // percentage 0-100
  height: number; // percentage 0-100
  confidence: number;
  label: string;
}

export interface UploadedPhoto {
  id: string;
  url: string;
  fileName: string;
  fileSize: string;
  dimensions?: { width: number; height: number };
  qualityScore: 'excellent' | 'good' | 'fair' | 'low';
  detectedFaces: number;
  boundingBoxes: BoundingBox[];
  uploadedAt: string;
}

export interface OrderConfig {
  artworkType: ArtworkType;
  styleName: string;
  size: CanvasSize;
  facesDetected: number;
  facesConfirmed: number;
  faceCountConfirmedByUser: boolean;
  paperMaterial: PaperMaterial;
  frame: FrameStyle;
  background: BackgroundStyle;
  digitalCopy: boolean;
  timelapseVideo: boolean;
  giftPackaging: boolean;
  authenticityCertificate: boolean;
  deliverySpeed: DeliverySpeed;
  customerNotes: string;
  preferredDeliveryDate?: string;
  sourcePhotos: UploadedPhoto[];
  templateVersion: string;
}

export interface PricingBreakdown {
  baseArtworkPrice: number;
  sizeAdjustment: number;
  sizeName: string;
  faceCharges: number;
  faceCount: number;
  materialAdjustment: number;
  materialName: string;
  frameAdjustment: number;
  frameName: string;
  backgroundAdjustment: number;
  backgroundName: string;
  addOnsTotal: number;
  addOnsDetails: { name: string; price: number }[];
  deliverySurcharge: number;
  deliveryName: string;
  couponDiscount: number;
  couponCode?: string;
  finalTotal: number;
  currency: string;
}

export interface ArtRevision {
  id: string;
  orderId: string;
  versionNo: number;
  requestedBy: string; // 'customer' | 'operations'
  feedback: string;
  attachmentUrl?: string;
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  artistNote?: string;
}

export interface ArtMedia {
  id: string;
  orderId: string;
  type: 'source' | 'preview' | 'final' | 'reference';
  url: string;
  filename: string;
  mimeType: string;
  size: string;
  versionNo?: number;
  watermarkApplied: boolean;
  visibility: 'private' | 'customer_visible' | 'public';
  uploadedBy: string;
  uploadedAt: string;
}

export interface ArtAssignment {
  id: string;
  orderId: string;
  artistUserId: string;
  artistName: string;
  artistAvatar: string;
  assignedAt: string;
  dueAt: string;
  status: 'assigned' | 'in_progress' | 'completed';
  notes?: string;
}

export interface StatusHistoryEntry {
  id: string;
  orderId: string;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  userId: string;
  userName: string;
  role: UserRole;
  note: string;
  createdAt: string;
}

export interface ArtNotification {
  id: string;
  orderId: string;
  channel: 'email' | 'whatsapp' | 'sms' | 'in_app';
  template: string;
  recipient: string;
  recipientName: string;
  subject: string;
  content: string;
  status: 'sent' | 'pending' | 'delivered' | 'read';
  sentAt: string;
}

export interface ArtAuditLog {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  entityType: 'order' | 'pricing' | 'form' | 'gallery' | 'assignment' | 'revision';
  entityId: string;
  metadata: Record<string, any>;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  status: OrderStatus;
  config: OrderConfig;
  pricing: PricingBreakdown;
  paymentMethod: 'card' | 'upi' | 'paypal' | 'apple_pay';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  transactionId: string;
  assignment?: ArtAssignment;
  previews: ArtMedia[];
  activePreviewVersion?: number;
  revisions: ArtRevision[];
  statusHistory: StatusHistoryEntry[];
  shippingCarrier?: string;
  trackingNumber?: string;
  estimatedDeliveryDate: string;
  notifications: ArtNotification[];
  staffOverrideReason?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  slug: string;
  categoryId: ArtworkType;
  categoryName: string;
  style: string;
  description: string;
  images: string[];
  beforeImage?: string;
  afterImage: string;
  featured: boolean;
  sortOrder: number;
  startingPrice: number;
  artistName: string;
  faceCount: number;
  mediumDetails: string;
  rating: number;
  reviewCount: number;
  tags: string[];
}

export interface ArtistProfile {
  id: string;
  name: string;
  specialty: string[];
  avatar: string;
  rating: number;
  completedPortraits: number;
  activeOrdersCount: number;
  bio: string;
  averageTurnaroundDays: number;
}

export interface DynamicFormField {
  id: string;
  fieldKey: string;
  label: string;
  helpText: string;
  type: 'radio' | 'dropdown' | 'checkbox' | 'multi_select' | 'number' | 'image_upload' | 'text' | 'textarea' | 'date' | 'info';
  required: boolean;
  sortOrder: number;
  active: boolean;
  affectsPrice: boolean;
  categoryDependency?: ArtworkType[];
  options?: {
    key: string;
    label: string;
    priceAdjustment: number;
    description?: string;
    isDefault?: boolean;
    imagePreview?: string;
  }[];
  minNumeric?: number;
  maxNumeric?: number;
  conditionRule?: {
    dependsOnField: string;
    conditionValue: string | boolean | number;
    action: 'show' | 'hide' | 'require';
  };
}

export interface PricingConfig {
  basePrices: Record<ArtworkType, number>;
  sizeSurcharges: Record<CanvasSize, number>;
  additionalFacePrice: number; // ₹500 / $10 each beyond 1st face
  materialSurcharges: Record<PaperMaterial, number>;
  frameSurcharges: Record<FrameStyle, number>;
  backgroundSurcharges: Record<BackgroundStyle, number>;
  addOnPrices: {
    digitalCopy: number;
    timelapseVideo: number;
    giftPackaging: number;
    authenticityCertificate: number;
  };
  deliverySurcharges: Record<DeliverySpeed, number>;
  currency: string;
  currencySymbol: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  description: string;
  applicableCategories?: ArtworkType[];
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  savedAddresses?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  }[];
  createdAt: string;
}

export interface MediumStyleItem {
  type: ArtworkType;
  title: string;
  description: string;
  startingPrice: number;
  image: string;
  tag: string;
  details?: string;
}

export interface ComparisonPair {
  id: string;
  title: string;
  medium: string;
  artist: string;
  originalImage: string;
  artImage: string;
  description: string;
  faceCount: string;
}

