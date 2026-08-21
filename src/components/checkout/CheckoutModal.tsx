import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Lock, 
  Truck, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order, OrderConfig, PricingBreakdown, UserProfile } from '../../types';
import { CartItem } from '../cart/CartDrawer';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderPlaced: (newOrders: Order[]) => void;
  currentUser?: UserProfile | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderPlaced,
  currentUser,
}) => {
  const [customerName, setCustomerName] = useState(currentUser?.name || 'Priya Mukherjee');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'priya.m@example.com');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [street, setStreet] = useState('42 Lotus Boulevard, Apt 5B');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [postalCode, setPostalCode] = useState('560001');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'paypal' | 'apple_pay'>('upi');
  const [upiId, setUpiId] = useState('priya@okhdfcbank');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setCustomerName(currentUser.name);
      if (currentUser.email) setCustomerEmail(currentUser.email);
      if (currentUser.phone) setCustomerPhone(currentUser.phone);
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + item.pricing.finalTotal, 0);

  const handlePlaceOrder = () => {
    if (!customerName || !customerEmail || !customerPhone || !street || !city || !postalCode) {
      setErrorMsg('Please complete all required shipping & contact fields.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    setTimeout(() => {
      const now = new Date();
      const generatedOrders: Order[] = cartItems.map((item, idx) => {
        const orderNum = `ART-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        return {
          id: 'ord-' + Date.now() + '-' + idx,
          orderNumber: orderNum,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress: {
            street,
            city,
            state,
            postalCode,
            country: 'India',
          },
          status: 'paid', // Instant verified paid state
          config: item.config,
          pricing: item.pricing,
          paymentMethod,
          paymentStatus: 'paid',
          transactionId: `TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          previews: [],
          revisions: [],
          statusHistory: [
            {
              id: 'sh-' + Date.now(),
              orderId: 'ord-' + Date.now() + '-' + idx,
              fromStatus: 'draft',
              toStatus: 'paid',
              userId: 'customer',
              userName: customerName,
              role: 'customer',
              note: `Order placed and paid (₹${item.pricing.finalTotal}) via ${paymentMethod.toUpperCase()}`,
              createdAt: now.toISOString(),
            },
            {
              id: 'sh-' + (Date.now() + 1),
              orderId: 'ord-' + Date.now() + '-' + idx,
              fromStatus: 'paid',
              toStatus: 'photo_verification',
              userId: 'system',
              userName: 'Automated Operations Verification',
              role: 'operations',
              note: 'High-res source images queued for artist assignment.',
              createdAt: new Date(now.getTime() + 1000).toISOString(),
            }
          ],
          estimatedDeliveryDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          notifications: [
            {
              id: 'notif-' + Date.now(),
              orderId: 'ord-' + Date.now() + '-' + idx,
              channel: 'email',
              template: 'order_confirmed',
              recipient: customerEmail,
              recipientName: customerName,
              subject: `Order Confirmed: ${orderNum} — Artisanal Custom Portrait`,
              content: `Thank you ${customerName}! Your custom portrait order has been received. Our master artist will begin drafting your piece soon.`,
              status: 'sent',
              sentAt: now.toISOString(),
            }
          ],
        };
      });

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // silent fail if confetti unavailable
      }

      setIsProcessing(false);
      onOrderPlaced(generatedOrders);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-slate-900">Secure Checkout</h2>
              <p className="text-xs text-slate-500">256-Bit Encrypted Payment Processing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Customer Contact & Shipping Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>1. Contact & Shipping Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                  placeholder="e.g. Priya Mukherjee"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Email for Proof Approval *</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                  placeholder="priya@example.com"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Phone / WhatsApp Number *</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Postal PIN Code *</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                  placeholder="560001"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Delivery Street Address *</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                  placeholder="House/Apt Number, Building, Street name"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">City *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                  placeholder="Bengaluru"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">State / Province</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                  placeholder="Karnataka"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>2. Payment Method</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'upi', label: 'UPI / QR Code', icon: QrCode },
                { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                { id: 'paypal', label: 'PayPal / Int.', icon: Lock },
                { id: 'apple_pay', label: 'Apple Pay', icon: Sparkles },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    id={`pay-method-${m.id}`}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      paymentMethod === m.id
                        ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-400 font-bold text-blue-950 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-blue-600" />
                    <span className="text-xs">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="text-[11px] font-semibold text-slate-700 block">Enter UPI Virtual Payment Address (VPA)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-white"
                  placeholder="username@okhdfcbank"
                />
                <p className="text-[10px] text-slate-500">Supports Google Pay, PhonePe, Paytm, BHIM</p>
              </div>
            )}
          </div>

          {/* Section 3: Summary Breakdown */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2 text-xs">
            <div className="flex justify-between font-bold text-slate-900">
              <span>Items Total ({cartItems.length} commission{cartItems.length > 1 ? 's' : ''}):</span>
              <span className="font-mono text-base text-blue-900">₹{totalAmount}</span>
            </div>
            <p className="text-[10px] text-slate-600 leading-relaxed">
              * Payment is held securely in escrow until you personally approve the artist preview proof.
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            Back to Cart
          </button>

          <button
            id="btn-confirm-place-order"
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-white" />
                <span>Processing Encrypted Payment...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-sky-200" />
                <span>Pay ₹{totalAmount} & Place Art Order</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
