import { Order, GalleryItem, DynamicFormField, PricingConfig, UserRole, Coupon, ArtAuditLog, UserProfile, MediumStyleItem, ComparisonPair } from '../types';
import { 
  DEFAULT_PRICING_CONFIG, 
  INITIAL_GALLERY_ITEMS, 
  INITIAL_DYNAMIC_FIELDS, 
  INITIAL_ORDERS, 
  INITIAL_COUPONS,
  INITIAL_MEDIUM_STYLES,
  INITIAL_COMPARISON_PAIRS 
} from '../data/initialData';

export interface StoredUserAccount extends UserProfile {
  passwordHash: string; // Stored securely for simulation
}

export const INITIAL_USER_ACCOUNTS: StoredUserAccount[] = [
  {
    id: 'usr-client-1',
    username: 'priya_sharma',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    savedAddresses: [
      {
        street: '42 Indiranagar, 12th Main Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        country: 'India'
      }
    ],
    passwordHash: 'password123',
    createdAt: '2025-01-15T10:30:00Z',
  },
  {
    id: 'usr-client-2',
    username: 'rahul_verma',
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    phone: '+91 98123 45678',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    savedAddresses: [
      {
        street: 'Flat 402, Sea Breeze Apts, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
        country: 'India'
      }
    ],
    passwordHash: 'password123',
    createdAt: '2025-02-01T14:15:00Z',
  },
  {
    id: 'art-1',
    username: 'rajesh_master',
    name: 'Rajesh Nair',
    email: 'rajesh.art@artisanalstudio.com',
    role: 'artist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    passwordHash: 'artist123',
    createdAt: '2024-05-10T09:00:00Z',
  },
  {
    id: 'admin-1',
    username: 'ops_lead',
    name: 'Vikram Mehta (Studio Director)',
    email: 'director@artisanalstudio.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    passwordHash: 'admin123',
    createdAt: '2024-01-01T08:00:00Z',
  }
];

const STORAGE_KEYS = {
  ORDERS: 'artisanal_orders_v1',
  GALLERY: 'artisanal_gallery_v1',
  FORM_FIELDS: 'artisanal_fields_v1',
  PRICING: 'artisanal_pricing_v1',
  ROLE: 'artisanal_active_role_v1',
  COUPONS: 'artisanal_coupons_v1',
  AUDIT_LOGS: 'artisanal_audit_logs_v1',
  USERS: 'artisanal_users_v1',
  CURRENT_USER: 'artisanal_current_user_v1',
  STYLES: 'artisanal_styles_v1',
  COMPARISON_PAIRS: 'artisanal_comparison_pairs_v1',
};

export const StorageManager = {
  // --- COMPARISON PAIRS (Before & After) ---
  getComparisonPairs(): ComparisonPair[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPARISON_PAIRS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.COMPARISON_PAIRS, JSON.stringify(INITIAL_COMPARISON_PAIRS));
        return INITIAL_COMPARISON_PAIRS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_COMPARISON_PAIRS;
    }
  },

  saveComparisonPairs(pairs: ComparisonPair[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPARISON_PAIRS, JSON.stringify(pairs));
    } catch (e) {
      console.error('Failed to save comparison pairs', e);
    }
  },
  // --- USERS & AUTH ---
  getUsers(): StoredUserAccount[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USER_ACCOUNTS));
        return INITIAL_USER_ACCOUNTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_USER_ACCOUNTS;
    }
  },

  saveUsers(users: StoredUserAccount[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users', e);
    }
  },

  getCurrentUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (data) return JSON.parse(data);
      // Default to initial client user for seamless preview
      const defaultUser = INITIAL_USER_ACCOUNTS[0];
      const { passwordHash, ...profile } = defaultUser;
      return profile;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: UserProfile | null): void {
    try {
      if (!user) {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      } else {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      }
    } catch (e) {
      console.error('Failed to set current user', e);
    }
  },

  registerUser(payload: {
    username: string;
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: UserRole;
    address?: { street: string; city: string; state: string; pincode: string; country: string };
  }): { success: boolean; error?: string; user?: UserProfile } {
    const users = this.getUsers();
    
    // Check if username or email is already taken
    const existing = users.find(
      u => u.username.toLowerCase() === payload.username.toLowerCase() || 
           u.email.toLowerCase() === payload.email.toLowerCase()
    );

    if (existing) {
      return { 
        success: false, 
        error: existing.email.toLowerCase() === payload.email.toLowerCase() 
          ? 'An account with this email address already exists. Please sign in.' 
          : 'This username is already taken. Please choose another one.' 
      };
    }

    const newUser: StoredUserAccount = {
      id: 'usr-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      username: payload.username.trim().toLowerCase(),
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone?.trim() || '',
      role: payload.role || 'customer',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      savedAddresses: payload.address ? [payload.address] : [],
      passwordHash: payload.password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);
    
    const { passwordHash, ...profile } = newUser;
    this.setCurrentUser(profile);
    this.setActiveRole(profile.role);
    this.addAuditLog(profile.id, profile.name, profile.role, 'User registered account: ' + profile.email, 'order', profile.id);

    return { success: true, user: profile };
  },

  authenticateUser(identifier: string, password: string): { success: boolean; error?: string; user?: UserProfile } {
    const users = this.getUsers();
    const cleanId = identifier.trim().toLowerCase();
    
    const matched = users.find(
      u => u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId
    );

    if (!matched) {
      return { success: false, error: 'No account found with this username or email address.' };
    }

    if (matched.passwordHash !== password) {
      return { success: false, error: 'Incorrect password. Please try again or check caps lock.' };
    }

    const { passwordHash, ...profile } = matched;
    this.setCurrentUser(profile);
    this.setActiveRole(profile.role);
    this.addAuditLog(profile.id, profile.name, profile.role, 'User signed in successfully: ' + profile.username, 'order', profile.id);

    return { success: true, user: profile };
  },

  logoutUser(): void {
    this.setCurrentUser(null);
  },

  // --- ORDERS ---
  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
        return INITIAL_ORDERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ORDERS;
    }
  },

  saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  },

  saveOrder(order: Order): void {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === order.id);
    if (index >= 0) {
      orders[index] = order;
    } else {
      orders.unshift(order);
    }
    this.saveOrders(orders);
    this.addAuditLog('system', 'System User', 'customer', 'Saved order ' + order.orderNumber, 'order', order.id, { status: order.status });
  },

  // --- GALLERY ---
  getGalleryItems(): GalleryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GALLERY);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(INITIAL_GALLERY_ITEMS));
        return INITIAL_GALLERY_ITEMS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_GALLERY_ITEMS;
    }
  },

  saveGalleryItems(items: GalleryItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save gallery items', e);
    }
  },

  // --- PRICING ---
  getPricingConfig(): PricingConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRICING);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(DEFAULT_PRICING_CONFIG));
        return DEFAULT_PRICING_CONFIG;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_PRICING_CONFIG;
    }
  },

  savePricingConfig(config: PricingConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save pricing config', e);
    }
  },

  // --- MEDIUM & STYLES ---
  getStyles(): MediumStyleItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STYLES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.STYLES, JSON.stringify(INITIAL_MEDIUM_STYLES));
        return INITIAL_MEDIUM_STYLES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_MEDIUM_STYLES;
    }
  },

  saveStyles(styles: MediumStyleItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STYLES, JSON.stringify(styles));
    } catch (e) {
      console.error('Failed to save styles', e);
    }
  },

  updateStyle(style: MediumStyleItem): void {
    try {
      const styles = this.getStyles();
      const index = styles.findIndex(s => s.type === style.type);
      if (index >= 0) {
        styles[index] = style;
      } else {
        styles.push(style);
      }
      this.saveStyles(styles);

      // Also keep basePrices in PricingConfig synced
      const pricing = this.getPricingConfig();
      if (pricing.basePrices && pricing.basePrices[style.type] !== undefined) {
        pricing.basePrices[style.type] = style.startingPrice;
        this.savePricingConfig(pricing);
      }
    } catch (e) {
      console.error('Failed to update style', e);
    }
  },

  // --- FORMS ---
  getFormFields(): DynamicFormField[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FORM_FIELDS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.FORM_FIELDS, JSON.stringify(INITIAL_DYNAMIC_FIELDS));
        return INITIAL_DYNAMIC_FIELDS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_DYNAMIC_FIELDS;
    }
  },

  saveFormFields(fields: DynamicFormField[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FORM_FIELDS, JSON.stringify(fields));
    } catch (e) {
      console.error('Failed to save form fields', e);
    }
  },

  // --- COUPONS ---
  getCoupons(): Coupon[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COUPONS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
        return INITIAL_COUPONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_COUPONS;
    }
  },

  // --- ROLE ---
  getActiveRole(): UserRole {
    try {
      const role = localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole;
      return role || 'customer';
    } catch {
      return 'customer';
    }
  },

  setActiveRole(role: UserRole): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, role);
    } catch (e) {
      console.error('Failed to set role', e);
    }
  },

  // --- AUDIT LOGS ---
  getAuditLogs(): ArtAuditLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  addAuditLog(
    userId: string,
    userName: string,
    role: UserRole,
    action: string,
    entityType: 'order' | 'pricing' | 'form' | 'gallery' | 'assignment' | 'revision',
    entityId: string,
    metadata: Record<string, any> = {}
  ): void {
    const logs = this.getAuditLogs();
    const newLog: ArtAuditLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      userId,
      userName,
      role,
      action,
      entityType,
      entityId,
      metadata,
      createdAt: new Date().toISOString(),
    };
    logs.unshift(newLog);
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 100)));
    } catch (e) {
      console.error('Failed to save audit log', e);
    }
  },

  resetAllToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.GALLERY);
    localStorage.removeItem(STORAGE_KEYS.FORM_FIELDS);
    localStorage.removeItem(STORAGE_KEYS.PRICING);
    localStorage.removeItem(STORAGE_KEYS.COUPONS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    window.location.reload();
  }
};
