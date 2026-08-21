import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { HowItWorks } from './components/home/HowItWorks';
import { StyleShowcase } from './components/home/StyleShowcase';
import { BeforeAfterSlider } from './components/home/BeforeAfterSlider';
import { CustomerReviews } from './components/home/CustomerReviews';
import { GalleryView } from './components/gallery/GalleryView';
import { ArtworkConfigurator } from './components/configurator/ArtworkConfigurator';
import { CustomerPortal } from './components/portal/CustomerPortal';
import { ArtistWorkspace } from './components/artist/ArtistWorkspace';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentLMSView } from './components/lms/StudentLMSView';
import { CartDrawer, CartItem } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { AuthModal } from './components/auth/AuthModal';
import { StorageManager } from './utils/storage';
import { 
  Order, 
  OrderStatus, 
  PricingConfig, 
  DynamicFormField, 
  GalleryItem, 
  UserRole,
  ArtAuditLog,
  ArtworkType,
  OrderConfig,
  PricingBreakdown,
  UserProfile
} from './types';
import { DEFAULT_PRICING_CONFIG, INITIAL_ORDERS, INITIAL_GALLERY_ITEMS } from './data/initialData';

export function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<'home' | 'gallery' | 'configurator' | 'lms' | 'portal' | 'artist' | 'admin'>('home');
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');

  // Pre-selected style when moving from Home/Gallery to Configurator
  const [configuratorPresetStyle, setConfiguratorPresetStyle] = useState<ArtworkType>('pencil');

  // Database State
  const [orders, setOrders] = useState<Order[]>([]);
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(DEFAULT_PRICING_CONFIG);
  const [formFields, setFormFields] = useState<DynamicFormField[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<ArtAuditLog[]>([]);

  // Cart & Checkout State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => prev?.message === message ? null : prev);
    }, 4500);
  };

  // Load from StorageManager on initial mount
  useEffect(() => {
    setOrders(StorageManager.getOrders());
    setPricingConfig(StorageManager.getPricingConfig());
    setFormFields(StorageManager.getFormFields());
    setGalleryItems(StorageManager.getGalleryItems());
    setAuditLogs(StorageManager.getAuditLogs());
    setCurrentUser(StorageManager.getCurrentUser());
  }, []);

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    if (user.role === 'artist') {
      setCurrentTab('artist');
    } else if (user.role === 'admin' || user.role === 'operations') {
      setCurrentTab('admin');
    } else {
      setCurrentTab('portal');
    }
  };

  const handleLogout = () => {
    StorageManager.logoutUser();
    setCurrentUser(null);
    setCurrentRole('customer');
  };

  // Sync back to storage on updates
  const handleSaveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    StorageManager.saveOrders(newOrders);
  };

  const handleSavePricing = (newConfig: PricingConfig) => {
    setPricingConfig(newConfig);
    StorageManager.savePricingConfig(newConfig);
  };

  const handleSaveGallery = (newGallery: GalleryItem[]) => {
    setGalleryItems(newGallery);
    StorageManager.saveGalleryItems(newGallery);
  };

  // Add Item to Cart from Configurator
  const handleAddToCart = (config: OrderConfig, pricing: PricingBreakdown) => {
    const newItem: CartItem = {
      id: 'cart-' + Date.now(),
      config,
      pricing,
      addedAt: new Date().toISOString(),
    };
    setCartItems((prev) => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Orders created via Checkout
  const handleOrderPlaced = (newCreatedOrders: Order[]) => {
    const updated = [...newCreatedOrders, ...orders];
    handleSaveOrders(updated);
    setCartItems([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setCurrentTab('portal'); // Navigate customer directly to portal
  };

  // Customer: Approve Proof
  const handleApproveProof = (orderId: string, versionNo: number) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const now = new Date().toISOString();
        return {
          ...o,
          status: 'quality_check' as OrderStatus,
          updatedAt: now,
          statusHistory: [
            ...o.statusHistory,
            {
              id: 'sh-' + Date.now(),
              orderId: o.id,
              fromStatus: o.status,
              toStatus: 'approved' as OrderStatus,
              userId: 'customer',
              userName: o.customerName,
              role: 'customer' as UserRole,
              note: `Customer approved preview proof version #${versionNo}. Initiating framing & quality inspection.`,
              createdAt: now,
            }
          ]
        };
      }
      return o;
    });
    handleSaveOrders(updated);
    showToast('✅ Proof approved successfully! Order moved to quality check & framing.', 'success');
  };

  // Customer: Request Revision
  const handleRequestRevision = (orderId: string, feedback: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const now = new Date().toISOString();
        const nextRevVersion = (o.revisions?.length || 0) + 1;
        const newRevision = {
          id: 'rev-' + Date.now(),
          orderId: o.id,
          versionNo: nextRevVersion,
          feedback,
          requestedAt: now,
          createdAt: now,
          status: 'pending' as const,
        };
        return {
          ...o,
          status: 'revision_requested' as OrderStatus,
          updatedAt: now,
          revisions: [...(o.revisions || []), newRevision],
          statusHistory: [
            ...o.statusHistory,
            {
              id: 'sh-' + Date.now(),
              orderId: o.id,
              fromStatus: o.status,
              toStatus: 'revision_requested' as OrderStatus,
              userId: 'customer',
              userName: o.customerName,
              role: 'customer' as UserRole,
              note: `Customer requested revision #${nextRevVersion}: "${feedback}"`,
              createdAt: now,
            }
          ]
        };
      }
      return o;
    });
    handleSaveOrders(updated);
    showToast('🔄 Revision requested. Artist notified with your feedback.', 'info');
  };

  // Artist: Upload Watermarked Proof
  const handleUploadArtistProof = (orderId: string, previewUrl: string, note?: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const now = new Date().toISOString();
        const nextVer = (o.activePreviewVersion || 0) + 1;
        const newPreview = {
          id: 'prev-' + Date.now(),
          orderId: o.id,
          versionNo: nextVer,
          url: previewUrl,
          watermarkApplied: true,
          customerVisible: true,
          status: 'pending' as const,
          uploadedAt: now,
          artistNotes: note,
        };
        return {
          ...o,
          status: 'awaiting_customer_approval' as OrderStatus,
          activePreviewVersion: nextVer,
          updatedAt: now,
          previews: [...(o.previews || []), newPreview],
          statusHistory: [
            ...o.statusHistory,
            {
              id: 'sh-' + Date.now(),
              orderId: o.id,
              fromStatus: o.status,
              toStatus: 'awaiting_customer_approval' as OrderStatus,
              userId: 'artist-1',
              userName: o.assignment?.artistName || 'Elena Rostova',
              role: 'artist' as UserRole,
              note: note ? `Proof #${nextVer} uploaded: "${note}"` : `Proof #${nextVer} uploaded with watermark.`,
              createdAt: now,
            }
          ]
        };
      }
      return o;
    });
    handleSaveOrders(updated);
    showToast('🎨 New artwork proof successfully uploaded by artist! Customer notified instantly.', 'success');
  };

  // Admin: Assign Artist
  const handleAssignArtist = (orderId: string, artistId: string, artistName: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const now = new Date().toISOString();
        return {
          ...o,
          status: 'in_production' as OrderStatus,
          updatedAt: now,
          assignment: {
            id: 'asg-' + Date.now(),
            orderId: o.id,
            artistId,
            artistName,
            assignedAt: now,
            assignedBy: 'Admin Ops',
            dueAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'assigned' as const,
          },
          statusHistory: [
            ...o.statusHistory,
            {
              id: 'sh-' + Date.now(),
              orderId: o.id,
              fromStatus: o.status,
              toStatus: 'in_production' as OrderStatus,
              userId: 'admin-1',
              userName: 'Admin Operations',
              role: 'operations' as UserRole,
              note: `Assigned to master artist ${artistName}. Moved to production queue.`,
              createdAt: now,
            }
          ]
        };
      }
      return o;
    });
    handleSaveOrders(updated);
    showToast(`📌 Order assigned to ${artistName} and moved to production queue.`, 'success');
  };

  // Admin: Staff Override of Face Count (SRS Section 12)
  const handleOverrideFaces = (orderId: string, confirmedFaces: number, reason: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const now = new Date().toISOString();
        return {
          ...o,
          pricing: {
            ...o.pricing,
            faceCount: confirmedFaces,
          },
          statusHistory: [
            ...o.statusHistory,
            {
              id: 'sh-' + Date.now(),
              orderId: o.id,
              fromStatus: o.status,
              toStatus: o.status,
              userId: 'admin-1',
              userName: 'Admin Operations',
              role: 'operations' as UserRole,
              note: `Staff photo audit verified ${confirmedFaces} faces. Reason: ${reason}`,
              createdAt: now,
            }
          ]
        };
      }
      return o;
    });
    handleSaveOrders(updated);
    showToast(`⚖️ Face count verified (${confirmedFaces} faces). Pricing updated.`, 'success');
  };

  // Admin: Dispatch Shipping
  const handleDispatchShipping = (orderId: string, carrier: string, trackingNum: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const now = new Date().toISOString();
        return {
          ...o,
          status: 'shipped' as OrderStatus,
          shippingCarrier: carrier,
          trackingNumber: trackingNum,
          updatedAt: now,
          statusHistory: [
            ...o.statusHistory,
            {
              id: 'sh-' + Date.now(),
              orderId: o.id,
              fromStatus: o.status,
              toStatus: 'shipped' as OrderStatus,
              userId: 'admin-1',
              userName: 'Operations Dispatch',
              role: 'operations' as UserRole,
              note: `Shipped via ${carrier} (Tracking #: ${trackingNum}). SMS & Email tracking link dispatched to customer.`,
              createdAt: now,
            }
          ]
        };
      }
      return o;
    });
    handleSaveOrders(updated);
    showToast(`📦 Order shipped via ${carrier} (Tracking: ${trackingNum})!`, 'success');
  };

  // Admin: Add Gallery Item
  const handleAddGalleryItem = (newItem: GalleryItem) => {
    const updated = [newItem, ...galleryItems];
    handleSaveGallery(updated);
  };

  // Reset Demo Data
  const handleResetData = () => {
    StorageManager.resetAllToDefault();
    setOrders(INITIAL_ORDERS);
    setPricingConfig(DEFAULT_PRICING_CONFIG);
    setGalleryItems(INITIAL_GALLERY_ITEMS);
  };

  const handleStartCommissionFromStyle = (style: ArtworkType) => {
    setConfiguratorPresetStyle(style);
    setCurrentTab('configurator');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top Universal Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <div>
            <HeroSection
              onStartCustomOrder={() => {
                setConfiguratorPresetStyle('pencil');
                setCurrentTab('configurator');
              }}
              onExploreGallery={() => setCurrentTab('gallery')}
            />
            <StyleShowcase
              onSelectStyle={handleStartCommissionFromStyle}
              currentRole={currentRole}
              currentUser={currentUser}
              pricingConfig={pricingConfig}
              onUpdatePricingConfig={handleSavePricing}
              onNavigateToAdmin={(tab) => {
                setCurrentRole('admin');
                setCurrentTab('admin');
              }}
            />
            <BeforeAfterSlider
              onStartConfigurator={(style) => {
                if (style) setConfiguratorPresetStyle(style as ArtworkType);
                setCurrentTab('configurator');
              }}
            />
            <HowItWorks
              onStartConfiguring={() => setCurrentTab('configurator')}
            />
            <CustomerReviews />
          </div>
        )}

        {currentTab === 'gallery' && (
          <GalleryView
            items={galleryItems}
            onCommissionStyle={handleStartCommissionFromStyle}
            currentRole={currentRole}
            onNavigateToAdmin={() => setCurrentTab('admin')}
          />
        )}

        {currentTab === 'configurator' && (
          <ArtworkConfigurator
            pricingConfig={pricingConfig}
            initialStyle={configuratorPresetStyle}
            onAddToCart={handleAddToCart}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {currentTab === 'lms' && (
          <StudentLMSView
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentTab === 'portal' && (
          <CustomerPortal
            orders={currentUser && currentUser.role === 'customer'
              ? orders.filter(o => o.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
              : orders
            }
            onApproveProof={handleApproveProof}
            onRequestRevision={handleRequestRevision}
            onNavigateToConfigurator={() => setCurrentTab('configurator')}
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentTab === 'artist' && (
          <ArtistWorkspace
            orders={orders}
            onUploadPreviewProof={handleUploadArtistProof}
            onUpdateOrderStatus={(orderId, status, note) => {
              const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
              handleSaveOrders(updated);
            }}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            orders={orders}
            pricingConfig={pricingConfig}
            formFields={formFields}
            galleryItems={galleryItems}
            auditLogs={auditLogs}
            onUpdatePricingConfig={handleSavePricing}
            onUpdateOrderStatus={(orderId, status, note) => {
              const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
              handleSaveOrders(updated);
            }}
            onAssignArtist={handleAssignArtist}
            onOverrideFaceCount={handleOverrideFaces}
            onDispatchShipping={handleDispatchShipping}
            onAddGalleryItem={handleAddGalleryItem}
            onUpdateGalleryItem={(updatedItem) => {
              const updated = galleryItems.map(i => i.id === updatedItem.id ? updatedItem : i);
              handleSaveGallery(updated);
            }}
            onDeleteGalleryItem={(id) => {
              const updated = galleryItems.filter(i => i.id !== id);
              handleSaveGallery(updated);
            }}
            onResetDemoData={handleResetData}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onNavigateToConfigurator={() => {
          setIsCartOpen(false);
          setCurrentTab('configurator');
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderPlaced={handleOrderPlaced}
        currentUser={currentUser}
      />

      {/* Auth Modal (Sign In / Register with Username & Password) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />

      {/* Footer */}
      <Footer
        onNavigate={(tab) => setCurrentTab(tab as any)}
        onRoleSelect={(role) => {
          setCurrentRole(role);
          if (role === 'artist') setCurrentTab('artist');
          else if (role === 'operations' || role === 'admin') setCurrentTab('admin');
          else setCurrentTab('portal');
        }}
      />

      {/* Toast Notification System */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
          <div className={`px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 text-xs font-bold ${
            toast.type === 'success' ? 'bg-emerald-900 text-white border-emerald-700' :
            toast.type === 'info' ? 'bg-blue-900 text-white border-blue-700' :
            'bg-rose-900 text-white border-rose-700'
          }`}>
            <span className="text-base">
              {toast.type === 'success' ? '✨' : toast.type === 'info' ? '💬' : '⚠️'}
            </span>
            <span>{toast.message}</span>
            <button 
              onClick={() => setToast(null)}
              className="ml-3 opacity-70 hover:opacity-100 text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
