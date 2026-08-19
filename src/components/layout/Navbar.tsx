import React, { useState } from 'react';
import { 
  Palette, 
  ShoppingBag, 
  Sparkles, 
  Compass, 
  Layers, 
  ShieldCheck, 
  UserCheck, 
  Sliders, 
  Menu, 
  X, 
  Download,
  Flame,
  ChevronDown,
  User,
  LogOut,
  LogIn,
  UserPlus
} from 'lucide-react';
import { UserRole, UserProfile } from '../../types';

interface NavbarProps {
  currentTab?: string;
  activeTab?: string;
  setCurrentTab?: (tab: string) => void;
  setActiveTab?: (tab: string) => void;
  cartCount: number;
  onOpenCart?: () => void;
  openCart?: () => void;
  currentRole: UserRole;
  setCurrentRole?: (role: UserRole) => void;
  setRole?: (role: UserRole) => void;
  pwaInstallPrompt?: any;
  onInstallPwa?: () => void;
  isPwaInstalled?: boolean;
  currentUser?: UserProfile | null;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  activeTab,
  setCurrentTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  openCart,
  currentRole,
  setCurrentRole,
  setRole,
  pwaInstallPrompt,
  onInstallPwa,
  isPwaInstalled,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const active = currentTab || activeTab || 'home';
  const handleNav = (tab: string) => {
    if (setCurrentTab) setCurrentTab(tab);
    if (setActiveTab) setActiveTab(tab);
  };
  const handleRole = (role: UserRole) => {
    if (setCurrentRole) setCurrentRole(role);
    if (setRole) setRole(role);
  };
  const handleCart = () => {
    if (onOpenCart) onOpenCart();
    else if (openCart) openCart();
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'gallery', label: 'Gallery & Portfolio', icon: Compass },
    { id: 'configurator', label: 'Turn Photo Into Art', icon: Palette, highlight: true },
    { id: 'portal', label: 'My Orders & Proofs', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      {/* Top micro-announcement banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 text-blue-400 font-semibold">
          <Flame className="w-3.5 h-3.5 animate-pulse" /> Free Unlimited Proof Revisions
        </span>
        <span className="hidden sm:inline text-slate-600">•</span>
        <span className="hidden sm:inline text-slate-300">Museum-grade 100% Cotton Canvas & Acid-Free Paper</span>
        <span className="hidden md:inline text-slate-600">•</span>
        <span className="hidden md:inline text-slate-300">Use code <strong className="text-sky-300 font-mono">WELCOME10</strong> for 10% off</span>
      </div>

      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <button 
            id="nav-brand-logo"
            onClick={() => { handleNav('home'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-serif text-2xl font-bold  text-slate-900 group-hover:text-blue-600 transition-colors">
                NAVKAMAL  ART  STUDIO
              </span>
              <span className="block text-[10px] tracking-widest uppercase font-semibold text-slate-500 -mt-1">
                Where Memories Become Art
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-50/80 p-1.5 rounded-2xl border border-slate-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    item.highlight
                      ? isActive
                        ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
                        : 'bg-blue-50 text-blue-900 hover:bg-blue-100/80 border border-blue-200 font-semibold'
                      : isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.highlight && !isActive ? 'text-blue-600' : ''}`} />
                  {item.label}
                  {item.highlight && (
                    <span className="bg-blue-600 text-white text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: User Auth, Role Switcher, PWA Install, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* User Account / Sign In */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="btn-user-profile-menu"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-800 shadow-xs transition-all"
                >
                  {currentUser.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <span className="block font-bold text-slate-900 leading-tight truncate max-w-[100px]">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="block text-[10px] text-slate-500 font-mono">
                      @{currentUser.username}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-2 text-slate-800 animate-fadeIn">
                      <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                        <div className="font-bold text-xs text-slate-900">{currentUser.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                        <div className="inline-flex items-center gap-1 mt-1 text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md font-semibold capitalize">
                          Role: {currentUser.role}
                        </div>
                      </div>

                      <button
                        id="user-menu-my-orders"
                        onClick={() => {
                          handleNav('portal');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 hover:bg-slate-100 transition-colors font-medium text-slate-700"
                      >
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <span>My Orders & Proof Approvals</span>
                      </button>

                      <button
                        id="user-menu-new-commission"
                        onClick={() => {
                          handleNav('configurator');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 hover:bg-slate-100 transition-colors font-medium text-slate-700"
                      >
                        <Palette className="w-4 h-4 text-indigo-600" />
                        <span>Turn Photo Into Art</span>
                      </button>

                      {onLogout && (
                        <div className="pt-1 mt-1 border-t border-slate-100">
                          <button
                            id="user-menu-logout"
                            onClick={() => {
                              onLogout();
                              setUserDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 hover:bg-rose-50 text-rose-600 transition-colors font-medium"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                id="btn-nav-signin"
                onClick={() => onOpenAuth && onOpenAuth('signin')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700 text-xs font-bold transition-all border border-slate-200 hover:border-blue-300 shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Sign In / Register</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}

            {/* Role & Workspace Switcher (Customer, Artist, Ops/Admin) */}
            <div className="relative">
              <button
                id="role-switcher-toggle"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-800 shadow-xs transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="hidden sm:inline text-slate-500">View:</span>
                <span className="font-semibold capitalize text-slate-900">{currentRole}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {roleDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setRoleDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-2 text-slate-800">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Switch Persona (SRS Roles)
                      </p>
                      <p className="text-xs text-slate-600">Explore full workflow from any viewpoint</p>
                    </div>

                    <button
                      id="role-select-customer"
                      onClick={() => {
                        handleRole('customer');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2.5 transition-colors ${
                        currentRole === 'customer' ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200' : 'hover:bg-slate-50'
                      }`}
                    >
                      <UserCheck className="w-4 h-4 text-slate-600" />
                      <div>
                        <div className="font-medium">Customer View</div>
                        <div className="text-[10px] text-slate-500">Gallery, Configurator, Proof Approvals</div>
                      </div>
                    </button>

                    <button
                      id="role-select-artist"
                      onClick={() => {
                        handleRole('artist');
                        handleNav('artist');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2.5 transition-colors mt-1 ${
                        currentRole === 'artist' ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200' : 'hover:bg-slate-50'
                      }`}
                    >
                      <Palette className="w-4 h-4 text-indigo-600" />
                      <div>
                        <div className="font-medium">Artist Workspace</div>
                        <div className="text-[10px] text-slate-500">Upload Previews, Revisions, Notes</div>
                      </div>
                    </button>

                    <button
                      id="role-select-admin"
                      onClick={() => {
                        handleRole('admin');
                        handleNav('admin');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2.5 transition-colors mt-1 ${
                        currentRole === 'admin' ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200' : 'hover:bg-slate-50'
                      }`}
                    >
                      <Sliders className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-medium">Admin & Operations</div>
                        <div className="text-[10px] text-slate-500">Form Builder, Dynamic Pricing, Shipping</div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Cart Trigger Button */}
            <button
              id="nav-cart-btn"
              onClick={handleCart}
              className="relative p-2.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm focus:outline-none"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white font-extrabold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu hamburger */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-xl animate-fadeIn">
          {currentUser ? (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-8 h-8 rounded-full object-cover border border-slate-200" 
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-500">@{currentUser.username}</div>
                </div>
              </div>
              {onLogout && (
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg"
                >
                  Sign Out
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                if (onOpenAuth) onOpenAuth('signin');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 mb-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Create Account</span>
            </button>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  handleNav(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.highlight && (
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    Customizer
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
            <button
              onClick={() => {
                handleNav('artist');
                handleRole('artist');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm bg-indigo-50 text-indigo-900 font-medium flex items-center gap-2"
            >
              <Palette className="w-4 h-4 text-indigo-700" />
              <span>Artist Workspace & Proof Uploader</span>
            </button>

            <button
              onClick={() => {
                handleNav('admin');
                handleRole('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm bg-blue-50 text-blue-900 font-medium flex items-center gap-2"
            >
              <Sliders className="w-4 h-4 text-blue-700" />
              <span>Admin & Dynamic Pricing Control</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
