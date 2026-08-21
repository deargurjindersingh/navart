import { Order, GalleryItem, DynamicFormField, PricingConfig, UserRole, Coupon, ArtAuditLog, UserProfile, MediumStyleItem, ComparisonPair, MediaAsset, HeroSlide, LMSCourse, StudentEnrollment } from '../types';
import { 
  DEFAULT_PRICING_CONFIG, 
  INITIAL_GALLERY_ITEMS, 
  INITIAL_DYNAMIC_FIELDS, 
  INITIAL_ORDERS, 
  INITIAL_COUPONS,
  INITIAL_MEDIUM_STYLES,
  INITIAL_COMPARISON_PAIRS,
  INITIAL_MEDIA_ASSETS,
  INITIAL_HERO_SLIDES,
  INITIAL_LMS_COURSES,
  INITIAL_STUDENT_ENROLLMENTS
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
    avatar: 'https://picsum.photos/seed/1534528741775-53994a69daeb/800/600',
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
    avatar: 'https://picsum.photos/seed/1507003211169-0a1dd7228f2d/800/600',
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
    avatar: 'https://picsum.photos/seed/1500648767791-00dcc994a43e/800/600',
    passwordHash: 'artist123',
    createdAt: '2024-05-10T09:00:00Z',
  },
  {
    id: 'admin-1',
    username: 'ops_lead',
    name: 'Vikram Mehta (Studio Director)',
    email: 'director@artisanalstudio.com',
    role: 'admin',
    avatar: 'https://picsum.photos/seed/1472099645785-5658abf4ff4e/800/600',
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
  MEDIA_ASSETS: 'artisanal_media_assets_v1',
  HERO_SLIDES: 'artisanal_hero_slides_v1',
  LMS_COURSES: 'artisanal_lms_courses_v1',
  STUDENT_ENROLLMENTS: 'artisanal_student_enrollments_v1',
};

export const StorageManager = {
  // --- LMS COURSES ---
  getLMSCourses(): LMSCourse[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LMS_COURSES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.LMS_COURSES, JSON.stringify(INITIAL_LMS_COURSES));
        return INITIAL_LMS_COURSES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_LMS_COURSES;
    }
  },

  saveLMSCourses(courses: LMSCourse[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LMS_COURSES, JSON.stringify(courses));
    } catch (e) {
      console.error('Failed to save LMS courses', e);
    }
  },

  saveLMSCourse(course: LMSCourse): void {
    const courses = this.getLMSCourses();
    const index = courses.findIndex(c => c.id === course.id);
    if (index >= 0) {
      courses[index] = course;
    } else {
      courses.unshift(course);
    }
    this.saveLMSCourses(courses);
    this.addAuditLog('admin', 'Admin User', 'admin', `Saved LMS course: ${course.title}`, 'order', course.id);
  },

  deleteLMSCourse(courseId: string): void {
    const courses = this.getLMSCourses().filter(c => c.id !== courseId);
    this.saveLMSCourses(courses);
    this.addAuditLog('admin', 'Admin User', 'admin', `Deleted LMS course ID ${courseId}`, 'order', courseId);
  },

  // --- STUDENT ENROLLMENTS & LEDGERS ---
  getStudentEnrollments(): StudentEnrollment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENT_ENROLLMENTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.STUDENT_ENROLLMENTS, JSON.stringify(INITIAL_STUDENT_ENROLLMENTS));
        return INITIAL_STUDENT_ENROLLMENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_STUDENT_ENROLLMENTS;
    }
  },

  saveStudentEnrollments(enrollments: StudentEnrollment[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENT_ENROLLMENTS, JSON.stringify(enrollments));
    } catch (e) {
      console.error('Failed to save student enrollments', e);
    }
  },

  enrollStudent(student: UserProfile, course: LMSCourse): StudentEnrollment {
    const enrollments = this.getStudentEnrollments();
    const existing = enrollments.find(e => e.studentId === student.id && e.courseId === course.id);
    if (existing) return existing;

    const newEnrollment: StudentEnrollment = {
      id: `enr-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      courseId: course.id,
      courseTitle: course.title,
      enrolledAt: new Date().toISOString(),
      progressPercent: 0,
      feeTotal: course.price,
      feePaid: course.price, // Default paid instantly on enrollment for smooth simulation
      feeStatus: 'Paid',
      ledger: [
        {
          id: `led-${Date.now()}-1`,
          date: new Date().toISOString().split('T')[0],
          description: `Course Enrolled: ${course.title}`,
          debit: course.price,
          credit: 0,
          balance: course.price,
          status: 'Pending'
        },
        {
          id: `led-${Date.now()}-2`,
          date: new Date().toISOString().split('T')[0],
          description: `Fee Payment Received (Online/UPI)`,
          debit: 0,
          credit: course.price,
          balance: 0,
          status: 'Paid'
        }
      ]
    };

    const updated = [newEnrollment, ...enrollments];
    this.saveStudentEnrollments(updated);
    this.addAuditLog(student.id, student.name, student.role, `Enrolled in course: ${course.title}`, 'order', newEnrollment.id);
    return newEnrollment;
  },

  recordStudentPayment(enrollmentId: string, amount: number, note: string): void {
    const enrollments = this.getStudentEnrollments();
    const updated = enrollments.map(enr => {
      if (enr.id === enrollmentId) {
        const newPaid = enr.feePaid + amount;
        const balanceRemaining = Math.max(0, enr.feeTotal - newPaid);
        const newStatus = balanceRemaining === 0 ? 'Paid' : (newPaid > 0 ? 'Partial' : 'Pending');
        const newEntry = {
          id: `led-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          description: note || 'Fee Payment Recorded',
          debit: 0,
          credit: amount,
          balance: balanceRemaining,
          status: 'Paid' as const
        };
        return {
          ...enr,
          feePaid: newPaid,
          feeStatus: newStatus as any,
          ledger: [newEntry, ...enr.ledger]
        };
      }
      return enr;
    });
    this.saveStudentEnrollments(updated);
  },
  // --- HERO SLIDES ---
  getHeroSlides(): HeroSlide[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HERO_SLIDES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(INITIAL_HERO_SLIDES));
        return INITIAL_HERO_SLIDES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_HERO_SLIDES;
    }
  },

  saveHeroSlides(slides: HeroSlide[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(slides));
    } catch (e) {
      console.error('Failed to save hero slides', e);
    }
  },

  saveHeroSlide(slide: HeroSlide): void {
    const slides = this.getHeroSlides();
    const index = slides.findIndex(s => s.id === slide.id);
    if (index >= 0) {
      slides[index] = slide;
    } else {
      slides.unshift(slide);
    }
    this.saveHeroSlides(slides);
    this.addAuditLog('admin', 'Admin User', 'admin', `Saved hero slider slide: ${slide.title}`, 'order', slide.id);
  },

  deleteHeroSlide(slideId: string): void {
    const slides = this.getHeroSlides().filter(s => s.id !== slideId);
    this.saveHeroSlides(slides);
    this.addAuditLog('admin', 'Admin User', 'admin', `Deleted hero slider slide ID ${slideId}`, 'order', slideId);
  },

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
      avatar: 'https://picsum.photos/seed/defaultavatar/200/200',
      savedAddresses: payload.address ? [payload.address] : [],
      passwordHash: payload.password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);

    const profile: UserProfile = {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      avatar: newUser.avatar,
      savedAddresses: newUser.savedAddresses,
      createdAt: newUser.createdAt,
    };

    this.addAuditLog('system', newUser.name, 'customer', `User registered account: ${profile.email}`, 'order', profile.id);

    return { success: true, user: profile };
  },

  updateUserRole(userId: string, newRole: UserRole): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return false;
    user.role = newRole;
    this.saveUsers(users);
    this.addAuditLog('admin', 'Admin User', 'admin', `Updated user ${user.username} role to ${newRole}`, 'order', userId);
    return true;
  },

  resetUserPassword(userId: string, newPassword: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return false;
    user.passwordHash = newPassword;
    this.saveUsers(users);
    this.addAuditLog('admin', 'Admin User', 'admin', `Reset password for user ${user.username}`, 'order', userId);
    return true;
  },

  createUserByAdmin(payload: {
    username: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
  }): { success: boolean; error?: string } {
    const users = this.getUsers();
    const existing = users.find(
      u => u.username.toLowerCase() === payload.username.toLowerCase() || 
           u.email.toLowerCase() === payload.email.toLowerCase()
    );
    if (existing) {
      return { success: false, error: 'Username or email already exists.' };
    }
    const newUser: StoredUserAccount = {
      id: 'usr-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      username: payload.username.trim().toLowerCase(),
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone?.trim() || '',
      role: payload.role,
      avatar: 'https://picsum.photos/seed/1534528741775-53994a69daeb/800/600',
      passwordHash: payload.password,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    this.saveUsers(users);
    this.addAuditLog('admin', 'Admin User', 'admin', `Created new user ${newUser.username} with role ${newUser.role}`, 'order', newUser.id);
    return { success: true };
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

  // --- MEDIA ASSETS (Folder Storage) ---
  getMediaAssets(): MediaAsset[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEDIA_ASSETS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.MEDIA_ASSETS, JSON.stringify(INITIAL_MEDIA_ASSETS));
        return INITIAL_MEDIA_ASSETS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_MEDIA_ASSETS;
    }
  },

  saveMediaAssets(assets: MediaAsset[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MEDIA_ASSETS, JSON.stringify(assets));
    } catch (e) {
      console.error('Failed to save media assets', e);
    }
  },

  addMediaAsset(asset: MediaAsset): void {
    const assets = this.getMediaAssets();
    const updated = [asset, ...assets];
    this.saveMediaAssets(updated);
  },

  deleteMediaAsset(id: string): void {
    const assets = this.getMediaAssets();
    const updated = assets.filter(a => a.id !== id);
    this.saveMediaAssets(updated);
  },

  // --- COMPLETE STUDIO EXPORT & IMPORT (Permanent Backup Across Devices & Re-publish) ---
  exportCompleteCatalogJSON(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      orders: this.getOrders(),
      gallery: this.getGalleryItems(),
      styles: this.getStyles(),
      comparisonPairs: this.getComparisonPairs(),
      pricing: this.getPricingConfig(),
      mediaAssets: this.getMediaAssets(),
      coupons: this.getCoupons(),
      formFields: this.getFormFields(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importCompleteCatalogJSON(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString);
      if (data.orders) this.saveOrders(data.orders);
      if (data.gallery) this.saveGalleryItems(data.gallery);
      if (data.styles) this.saveStyles(data.styles);
      if (data.comparisonPairs) this.saveComparisonPairs(data.comparisonPairs);
      if (data.pricing) this.savePricingConfig(data.pricing);
      if (data.mediaAssets) this.saveMediaAssets(data.mediaAssets);
      if (data.coupons) this.saveCoupons(data.coupons);
      if (data.formFields) this.saveFormFields(data.formFields);
      return { success: true, message: 'Studio data and folder assets restored successfully!' };
    } catch (e: any) {
      return { success: false, message: 'Invalid JSON format: ' + (e.message || 'Parse error') };
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
    localStorage.removeItem(STORAGE_KEYS.STYLES);
    localStorage.removeItem(STORAGE_KEYS.COMPARISON_PAIRS);
    localStorage.removeItem(STORAGE_KEYS.MEDIA_ASSETS);
    window.location.reload();
  }
};
