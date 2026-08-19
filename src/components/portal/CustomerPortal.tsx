import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Palette, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Eye, 
  Download, 
  MessageSquare, 
  FileText, 
  Layers, 
  ZoomIn, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award,
  Search,
  User,
  Key,
  LogIn
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order, OrderStatus, ArtRevision, UserProfile } from '../../types';

interface CustomerPortalProps {
  orders: Order[];
  onApproveProof: (orderId: string, versionNo: number) => void;
  onRequestRevision: (orderId: string, feedback: string) => void;
  onNavigateToConfigurator: () => void;
  currentUser?: UserProfile | null;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  orders,
  onApproveProof,
  onRequestRevision,
  onNavigateToConfigurator,
  currentUser,
  onOpenAuth,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders.length > 0 ? orders[0].id : ''
  );
  
  // Revision Modal State
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [revisionError, setRevisionError] = useState('');
  const [activeProofZoom, setActiveProofZoom] = useState(false);

  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;
    const q = searchQuery.toLowerCase();
    return orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.config.styleName.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q)
    );
  }, [orders, searchQuery]);

  const selectedOrder = filteredOrders.find((o) => o.id === selectedOrderId) || filteredOrders[0] || orders[0];

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'awaiting_customer_approval':
        return { label: 'Proof Ready for Approval', color: 'bg-blue-100 text-blue-900 border-blue-300 font-bold animate-pulse' };
      case 'revision_requested':
        return { label: 'Revision in Progress', color: 'bg-purple-100 text-purple-900 border-purple-300' };
      case 'in_production':
        return { label: 'Artist Handcrafting', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' };
      case 'shipped':
        return { label: 'In Transit / Shipped', color: 'bg-sky-100 text-sky-900 border-sky-300' };
      case 'completed':
      case 'delivered':
        return { label: 'Delivered & Complete', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'approved':
      case 'quality_check':
      case 'ready_to_ship':
        return { label: 'Approved • Framing & QC', color: 'bg-teal-100 text-teal-900 border-teal-300' };
      default:
        return { label: 'Photo Verification', color: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  const handleApprove = (orderId: string, versionNo: number) => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}
    onApproveProof(orderId, versionNo);
  };

  const handleSubmitRevision = () => {
    if (!revisionFeedback.trim() || revisionFeedback.trim().length < 10) {
      setRevisionError('Please provide specific feedback (min 10 characters) for your artist.');
      return;
    }
    if (selectedOrder) {
      onRequestRevision(selectedOrder.id, revisionFeedback.trim());
      setRevisionFeedback('');
      setRevisionError('');
      setIsRevisionModalOpen(false);
    }
  };

  const workflowSteps: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'paid', label: 'Order Confirmed', desc: 'Payment captured securely' },
    { status: 'photo_verification', label: 'Photo Verified', desc: 'Clarity & face count checked' },
    { status: 'artist_assigned', label: 'Artist Assigned', desc: 'Assigned to master atelier artist' },
    { status: 'in_production', label: 'In Production', desc: 'Handcrafted on archival paper' },
    { status: 'awaiting_customer_approval', label: 'Proof Approval', desc: 'Customer reviews watermarked proof' },
    { status: 'quality_check', label: 'Quality Check & Frame', desc: 'Framed with shatterproof acrylic' },
    { status: 'shipped', label: 'Dispatched & Shipped', desc: 'Tracking active with courier' },
    { status: 'completed', label: 'Delivered', desc: 'Cherished heirloom in home' },
  ];

  const getStepState = (orderStatus: OrderStatus, stepStatus: OrderStatus) => {
    const statusOrder: OrderStatus[] = [
      'submitted', 'paid', 'photo_verification', 'artist_assigned', 'in_production',
      'preview_uploaded', 'awaiting_customer_approval', 'revision_requested',
      'approved', 'quality_check', 'ready_to_ship', 'shipped', 'delivered', 'completed'
    ];
    const currentIndex = statusOrder.indexOf(orderStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="py-8 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 animate-fadeIn">
      
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-blue-800 font-bold text-xs uppercase tracking-widest bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full">
            Client Portal & Proof Studio
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
            My Orders & Proof Approvals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your handcrafted digital proofs, request free adjustments, or track shipping.
          </p>
        </div>

        <button
          onClick={onNavigateToConfigurator}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Palette className="w-4 h-4 text-sky-200" />
          <span>Turn Photo Into Art</span>
        </button>
      </div>

      {/* Client Account Credentials & Security Status Bar */}
      <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{currentUser.name}</span>
                  <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                    @{currentUser.username}
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Password Protected
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                  <span>{currentUser.email}</span>
                  {currentUser.phone && (
                    <>
                      <span>•</span>
                      <span>{currentUser.phone}</span>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-800">Guest Order Tracking</div>
                <div className="text-[11px] text-slate-500">Sign in with username & password to sync all commissions across devices.</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!currentUser && onOpenAuth && (
            <button
              id="btn-portal-signin"
              onClick={() => onOpenAuth('signin')}
              className="px-3.5 py-2 bg-slate-900 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-blue-400" />
              <span>Sign In with Password</span>
            </button>
          )}

          {/* Quick Search / Filter Bar */}
          <div className="relative min-w-[200px] flex-1 md:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order # or Style..."
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto">
          <Palette className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-serif text-xl font-bold text-slate-900">No active orders yet</h3>
          <p className="text-xs text-slate-500 mt-1">When you place an order, your real-time tracking and proof review appear right here.</p>
          <button
            onClick={onNavigateToConfigurator}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-sm"
          >
            Turn Your First Photo Into Art
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-6 xl:gap-8 items-start">
          
          {/* Left: Orders List Selection Bar */}
          <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              Your Orders ({filteredOrders.length})
            </h3>

            {filteredOrders.map((order) => {
              const badge = getStatusBadge(order.status);
              const isSelected = order.id === selectedOrder?.id;
              return (
                <div
                  key={order.id}
                  id={`order-list-item-${order.id}`}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-white border-blue-600 ring-2 ring-blue-400 shadow-md'
                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {order.config.sourcePhotos && order.config.sourcePhotos[0] ? (
                      <img
                        src={order.config.sourcePhotos[0].url}
                        alt="Order Thumbnail"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <Palette className="w-6 h-6" />
                      </div>
                    )}

                    <div>
                      <div className="font-mono text-xs font-bold text-slate-900">
                        {order.orderNumber}
                      </div>
                      <div className="text-[11px] font-serif text-slate-600 truncate max-w-[140px]">
                        {order.config.styleName}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="font-mono font-bold text-xs text-slate-800 mt-2">
                      ₹{order.pricing.finalTotal}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Order Detail & Interactive Proof Approval Center */}
          {selectedOrder && (
            <div className="lg:col-span-8 xl:col-span-8 2xl:col-span-9 space-y-6">
              
              {/* Order Status Hero Card */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Order Overview</span>
                    <h2 className="font-mono text-xl font-bold text-slate-900 flex items-center gap-2">
                      <span>{selectedOrder.orderNumber}</span>
                      <span className={`text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(selectedOrder.status).color}`}>
                        {getStatusBadge(selectedOrder.status).label}
                      </span>
                    </h2>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-[10px] text-slate-400 uppercase">Est. Delivery</div>
                    <div className="font-semibold text-xs text-slate-800">{selectedOrder.estimatedDeliveryDate}</div>
                  </div>
                </div>

                {/* Interactive Order Lifecycle Progress Bar */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Handcrafting Progress Timeline:
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    {workflowSteps.map((step, idx) => {
                      const state = getStepState(selectedOrder.status, step.status);
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border text-xs transition-all ${
                            state === 'completed'
                              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium'
                              : state === 'current'
                              ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-400 text-blue-950 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            {state === 'completed' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : state === 'current' ? (
                              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                            )}
                            <span className="truncate">{step.label}</span>
                          </div>
                          <p className="text-[10px] opacity-75 line-clamp-1">{step.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Shipping & Carrier Tracking */}
                {selectedOrder.shippingCarrier && selectedOrder.trackingNumber && (
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Truck className="w-6 h-6 text-blue-600 shrink-0" />
                      <div>
                        <div className="text-xs font-bold">Shipped with {selectedOrder.shippingCarrier}</div>
                        <div className="font-mono text-xs text-blue-800">
                          Tracking #: <strong>{selectedOrder.trackingNumber}</strong>
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold bg-white px-3 py-1.5 rounded-xl border border-blue-200 shadow-xs text-blue-900">
                      Live Courier Dispatched
                    </span>
                  </div>
                )}

              </div>

              {/* ARTIST PROOF APPROVAL & REVISION WORKFLOW */}
              {selectedOrder.previews && selectedOrder.previews.length > 0 && (
                <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-blue-500 shadow-md space-y-6">
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                        <h3 className="font-serif font-bold text-slate-900 text-xl">
                          Artist Digital Proof (v{selectedOrder.activePreviewVersion || 1})
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Uploaded by Master Artist {selectedOrder.assignment?.artistName || 'Elena Rostova'}
                      </p>
                    </div>

                    <span className="text-xs font-mono font-bold bg-slate-900 text-sky-300 px-3 py-1 rounded-full">
                      Proof Review Stage
                    </span>
                  </div>

                  {/* Proof Image Display with Watermark & Zoom Lightbox */}
                  <div className="relative rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center max-h-[440px] border border-slate-800">
                    <img
                      src={selectedOrder.previews[selectedOrder.previews.length - 1].url}
                      alt="Artist Handcrafted Proof"
                      className={`max-h-[440px] w-full object-contain transition-transform duration-300 ${
                        activeProofZoom ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
                      }`}
                      onClick={() => setActiveProofZoom(!activeProofZoom)}
                    />

                    {/* Watermark notice */}
                    {selectedOrder.previews[selectedOrder.previews.length - 1].watermarkApplied && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                        <span className="font-serif font-extrabold text-white/25 text-3xl sm:text-5xl -rotate-24 uppercase tracking-widest">
                          Artisanal Proof Preview
                        </span>
                      </div>
                    )}

                    {/* Zoom button */}
                    <button
                      onClick={() => setActiveProofZoom(!activeProofZoom)}
                      className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>{activeProofZoom ? 'Reset Zoom' : 'Inspect Details (Zoom)'}</span>
                    </button>
                  </div>

                  {/* Actions: 1-Click Approve OR Request Revision */}
                  {selectedOrder.status === 'awaiting_customer_approval' ? (
                    <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-center sm:text-left">
                        <div className="font-serif font-bold text-slate-900 text-base">
                          Do you love this portrait proof?
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Approving locks this artwork and initiates framing, packaging & insured delivery.
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        <button
                          id="btn-request-free-revision"
                          onClick={() => setIsRevisionModalOpen(true)}
                          className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 transition-all flex items-center justify-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
                          <span>Request Free Revision</span>
                        </button>

                        <button
                          id="btn-approve-proof"
                          onClick={() => handleApprove(selectedOrder.id, selectedOrder.activePreviewVersion || 1)}
                          className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve & Send to Frame</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Proof Version {selectedOrder.activePreviewVersion || 1} has been approved by customer.</span>
                      </div>

                      {selectedOrder.config.digitalCopy && (
                        <a
                          href={selectedOrder.previews[selectedOrder.previews.length - 1].url}
                          target="_blank"
                          rel="noreferrer"
                          download="artisanal_high_res_digital_artwork.jpg"
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Ultra-HD Digital Copy</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Revisions History Log */}
                  {selectedOrder.revisions && selectedOrder.revisions.length > 0 && (
                    <div className="space-y-2 pt-3 border-t border-slate-100">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                        Revision History Log:
                      </span>
                      {selectedOrder.revisions.map((rev) => (
                        <div key={rev.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                          <div className="flex items-center justify-between text-slate-500 font-mono text-[10px]">
                            <span>Revision #{rev.versionNo} Requested</span>
                            <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-slate-800 italic">"{rev.feedback}"</p>
                          {rev.artistNote && (
                            <p className="text-purple-800 font-medium">Artist update: {rev.artistNote}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* Order Specifications Snapshot */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-slate-900 text-lg">
                  Artwork Specifications Snapshot
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Medium</span>
                    <strong className="text-slate-900">{selectedOrder.config.styleName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Size & Format</span>
                    <strong className="text-slate-900">{selectedOrder.pricing.sizeName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Subjects / Faces</span>
                    <strong className="text-slate-900">{selectedOrder.pricing.faceCount} Person(s)</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Framing Style</span>
                    <strong className="text-slate-900">{selectedOrder.pricing.frameName}</strong>
                  </div>
                </div>

                {selectedOrder.config.customerNotes && (
                  <div className="text-xs bg-blue-50/50 p-3.5 rounded-xl border border-blue-200/60 text-slate-800">
                    <strong className="text-slate-900 block mb-1">Your Instructions to the Artist:</strong>
                    <p className="italic">{selectedOrder.config.customerNotes}</p>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}

      {/* Revision Request Modal */}
      {isRevisionModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-fadeIn">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-purple-600" />
                <h3 className="font-serif font-bold text-slate-900 text-lg">Request Free Artist Revision</h3>
              </div>
              <button
                onClick={() => setIsRevisionModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Unlimited revisions are 100% free. Please let your master artist know specifically which adjustments you would like (e.g. hair shading, facial contour, background tone).
            </p>

            {revisionError && (
              <div className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                {revisionError}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Specific Revision Notes *</label>
              <textarea
                rows={4}
                value={revisionFeedback}
                onChange={(e) => setRevisionFeedback(e.target.value)}
                placeholder="e.g. Please darken the eye iris contrast slightly and soften the jawline shadow as per the original photo..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-500 bg-slate-50"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsRevisionModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                id="btn-submit-revision-feedback"
                onClick={handleSubmitRevision}
                className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-md transition-all"
              >
                Submit Revision Request to Artist
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
