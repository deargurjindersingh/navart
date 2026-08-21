import React, { useState, useEffect, useRef } from 'react';
import { 
  Sliders, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  RefreshCw, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Sparkles, 
  Image as ImageIcon, 
  Search, 
  Clock,
  Layers,
  Save,
  Palette,
  Send,
  MessageSquare,
  FileCheck,
  Upload,
  X,
  FileImage,
  Folder,
  GraduationCap,
  FileText
} from 'lucide-react';
import { 
  Order, 
  OrderStatus, 
  PricingConfig, 
  DynamicFormField, 
  GalleryItem, 
  ArtworkType, 
  ArtAuditLog,
  ArtistProfile,
  MediumStyleItem,
  ComparisonPair,
  HeroSlide,
  LMSCourse,
  StudentEnrollment,
  UserRole
} from '../../types';
import { INITIAL_ARTISTS } from '../../data/initialData';
import { StorageManager, StoredUserAccount } from '../../utils/storage';
import { AdminEditStyleModal } from './AdminEditStyleModal';
import { MediaFolderManager } from './MediaFolderManager';

interface AdminDashboardProps {
  orders: Order[];
  pricingConfig: PricingConfig;
  formFields: DynamicFormField[];
  galleryItems: GalleryItem[];
  auditLogs: ArtAuditLog[];
  onUpdatePricingConfig: (newConfig: PricingConfig) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus, note: string) => void;
  onAssignArtist: (orderId: string, artistId: string, artistName: string) => void;
  onOverrideFaceCount: (orderId: string, confirmedFaces: number, reason: string) => void;
  onDispatchShipping: (orderId: string, carrier: string, trackingNum: string) => void;
  onAddGalleryItem: (item: GalleryItem) => void;
  onUpdateGalleryItem?: (item: GalleryItem) => void;
  onDeleteGalleryItem?: (id: string) => void;
  onResetDemoData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  pricingConfig,
  formFields,
  galleryItems,
  auditLogs,
  onUpdatePricingConfig,
  onUpdateOrderStatus,
  onAssignArtist,
  onOverrideFaceCount,
  onDispatchShipping,
  onAddGalleryItem,
  onUpdateGalleryItem,
  onDeleteGalleryItem,
  onResetDemoData,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'orders' | 'pricing' | 'showcase' | 'gallery' | 'folders' | 'logs' | 'users'>('orders');
  const [adminUsers, setAdminUsers] = useState<StoredUserAccount[]>(() => StorageManager.getUsers());
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('customer');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [editingUserPasswordId, setEditingUserPasswordId] = useState<string | null>(null);
  const [newResetPassword, setNewResetPassword] = useState('');
  const [userMsg, setUserMsg] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  
  // Pricing Form State
  const [editablePricing, setEditablePricing] = useState<PricingConfig>(pricingConfig);
  const [pricingSavedMessage, setPricingSavedMessage] = useState(false);
  const [adminStyles, setAdminStyles] = useState<MediumStyleItem[]>(() => StorageManager.getStyles());
  const [activeEditingStyle, setActiveEditingStyle] = useState<MediumStyleItem | null>(null);

  // Dispatch & Assign Form State
  const [selectedArtistId, setSelectedArtistId] = useState(INITIAL_ARTISTS[0].id);
  const [shippingCarrier, setShippingCarrier] = useState('BlueDart Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [faceOverrideCount, setFaceOverrideCount] = useState<number>(2);
  const [faceOverrideReason, setFaceOverrideReason] = useState('Staff verified: 2 distinct human faces in source photo.');

  // New Gallery Item Modal State
  const [isAddGalleryModalOpen, setIsAddGalleryModalOpen] = useState(false);
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState<ArtworkType>('pencil');
  const [newGalleryPrice, setNewGalleryPrice] = useState(1499);
  const [newGalleryImage, setNewGalleryImage] = useState('');
  const [newGalleryDesc, setNewGalleryDesc] = useState('Handcrafted tonal graphite sketch on 300gsm cotton.');
  const [galleryFileName, setGalleryFileName] = useState<string>('');
  const [galleryUploadLoading, setGalleryUploadLoading] = useState(false);
  const [galleryIsDragOver, setGalleryIsDragOver] = useState(false);
  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Edit Gallery Item State
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [editGalleryTitle, setEditGalleryTitle] = useState('');
  const [editGalleryCategory, setEditGalleryCategory] = useState<ArtworkType>('pencil');
  const [editGalleryPrice, setEditGalleryPrice] = useState(1499);
  const [editGalleryImage, setEditGalleryImage] = useState('');
  const [editGalleryDesc, setEditGalleryDesc] = useState('');

  const handleOpenEditGalleryModal = (item: GalleryItem) => {
    setEditingGalleryItem(item);
    setEditGalleryTitle(item.title);
    setEditGalleryCategory((item.categoryId as ArtworkType) || 'pencil');
    setEditGalleryPrice(item.startingPrice);
    setEditGalleryImage(item.afterImage);
    setEditGalleryDesc(item.description);
  };

  const handleSaveEditedGalleryItem = () => {
    if (!editingGalleryItem || !editGalleryTitle.trim() || !onUpdateGalleryItem) return;
    const updated: GalleryItem = {
      ...editingGalleryItem,
      title: editGalleryTitle,
      categoryId: editGalleryCategory,
      categoryName: editGalleryCategory.replace(/_/g, ' ').toUpperCase(),
      startingPrice: Number(editGalleryPrice),
      afterImage: editGalleryImage,
      images: [editGalleryImage],
      description: editGalleryDesc,
    };
    onUpdateGalleryItem(updated);
    setEditingGalleryItem(null);
  };

  const handleDeleteGallery = (id: string) => {
    if (onDeleteGalleryItem) {
      onDeleteGalleryItem(id);
    }
  };

  // Before & After Showcase Manager State
  const [comparisonPairs, setComparisonPairs] = useState<ComparisonPair[]>(() => StorageManager.getComparisonPairs());
  const [showcaseSaveMessage, setShowcaseSaveMessage] = useState<string | null>(null);
  const [gallerySaveMessage, setGallerySaveMessage] = useState<string | null>(null);

  const handleSaveShowcaseState = () => {
    StorageManager.saveComparisonPairs(comparisonPairs);
    setShowcaseSaveMessage('✅ Showcase state successfully saved to storage! Use Backup & Restore in Media Folders tab for published links.');
    setTimeout(() => setShowcaseSaveMessage(null), 5000);
  };

  const handleSaveGalleryState = () => {
    StorageManager.saveGalleryItems(galleryItems);
    setGallerySaveMessage('✅ Gallery state successfully saved to storage! Use Backup & Restore in Media Folders tab for published links.');
    setTimeout(() => setGallerySaveMessage(null), 5000);
  };

  // Hero Slider CMS Manager State
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => StorageManager.getHeroSlides());
  const [heroSaveMessage, setHeroSaveMessage] = useState<string | null>(null);
  const [isAddHeroModalOpen, setIsAddHeroModalOpen] = useState(false);
  const [editingHeroSlideId, setEditingHeroSlideId] = useState<string | null>(null);
  const [heroTitle, setHeroTitle] = useState('');
  const [heroArtist, setHeroArtist] = useState('');
  const [heroMedium, setHeroMedium] = useState('');
  const [heroPaintedImage, setHeroPaintedImage] = useState('');
  const [heroOriginalPhoto, setHeroOriginalPhoto] = useState('');
  const [heroOriginalLabel, setHeroOriginalLabel] = useState('Customer Photo');
  const [heroPaintedFileName, setHeroPaintedFileName] = useState('');
  const [heroOriginalFileName, setHeroOriginalFileName] = useState('');
  const heroPaintedInputRef = useRef<HTMLInputElement>(null);
  const heroOriginalInputRef = useRef<HTMLInputElement>(null);

  const handleHeroImageUpload = (file: File, type: 'painted' | 'original') => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        if (type === 'painted') {
          setHeroPaintedImage(result);
          setHeroPaintedFileName(file.name);
        } else {
          setHeroOriginalPhoto(result);
          setHeroOriginalFileName(file.name);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAddHeroModal = () => {
    setEditingHeroSlideId(null);
    setHeroTitle('');
    setHeroArtist('');
    setHeroMedium('');
    setHeroPaintedImage('');
    setHeroOriginalPhoto('');
    setHeroOriginalLabel('Customer Photo');
    setHeroPaintedFileName('');
    setHeroOriginalFileName('');
    setIsAddHeroModalOpen(true);
  };

  const handleOpenEditHeroSlide = (slide: HeroSlide) => {
    setEditingHeroSlideId(slide.id);
    setHeroTitle(slide.title);
    setHeroArtist(slide.artist);
    setHeroMedium(slide.medium);
    setHeroPaintedImage(slide.paintedImage);
    setHeroOriginalPhoto(slide.originalPhoto);
    setHeroOriginalLabel(slide.originalLabel || 'Customer Photo');
    setHeroPaintedFileName('');
    setHeroOriginalFileName('');
    setIsAddHeroModalOpen(true);
  };

  // LMS & Student Ledger State
  const [lmsCourses, setLmsCourses] = useState<LMSCourse[]>(() => StorageManager.getLMSCourses());
  const [studentEnrollments, setStudentEnrollments] = useState<StudentEnrollment[]>(() => StorageManager.getStudentEnrollments());
  const [lmsSaveMessage, setLmsSaveMessage] = useState<string | null>(null);
  const [isAddLMSModalOpen, setIsAddLMSModalOpen] = useState(false);
  const [lmsTitle, setLmsTitle] = useState('');
  const [lmsDesc, setLmsDesc] = useState('');
  const [lmsInstructor, setLmsInstructor] = useState('Master Artist Rajesh Nair');
  const [lmsCategory, setLmsCategory] = useState('Drawing & Sketching');
  const [lmsLevel, setLmsLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'>('Beginner');
  const [lmsDuration, setLmsDuration] = useState('6 Weeks');
  const [lmsPrice, setLmsPrice] = useState(4999);
  const [lmsImage, setLmsImage] = useState('https://picsum.photos/seed/1582561424760-0321d75e81fa/800/600');
  const [lmsImageFileName, setLmsImageFileName] = useState('');
  const lmsImageInputRef = useRef<HTMLInputElement>(null);

  const [lmsLessons, setLmsLessons] = useState<Array<{
    id: string;
    title: string;
    duration: string;
    description: string;
    videoUrl: string;
    videoFileName: string;
    pdfUrl: string;
    pdfFileName: string;
  }>>([
    { id: 'l-1', title: 'Introduction & Foundations', duration: '45 mins', description: 'Core principles and material introduction.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', videoFileName: '', pdfUrl: '', pdfFileName: '' }
  ]);

  const handleLMSImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const res = e.target?.result as string;
      if (res) {
        setLmsImage(res);
        setLmsImageFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLMSLessonVideoUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const res = e.target?.result as string;
      if (res) {
        const updated = [...lmsLessons];
        updated[index].videoUrl = res;
        updated[index].videoFileName = file.name;
        setLmsLessons(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLMSLessonPdfUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const res = e.target?.result as string;
      if (res) {
        const updated = [...lmsLessons];
        updated[index].pdfUrl = res;
        updated[index].pdfFileName = file.name;
        setLmsLessons(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddLMSLessonItem = () => {
    setLmsLessons([
      ...lmsLessons,
      {
        id: `l-${Date.now()}`,
        title: `Lesson ${lmsLessons.length + 1}`,
        duration: '45 mins',
        description: '',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoFileName: '',
        pdfUrl: '',
        pdfFileName: ''
      }
    ]);
  };

  const handleRemoveLMSLessonItem = (index: number) => {
    if (lmsLessons.length === 1) {
      alert('A course must have at least one lesson.');
      return;
    }
    setLmsLessons(lmsLessons.filter((_, idx) => idx !== index));
  };

  const handleSaveLMSCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lmsTitle.trim()) {
      alert('Please enter a course title.');
      return;
    }
    const newCourse: LMSCourse = {
      id: `course-${Date.now()}`,
      title: lmsTitle,
      description: lmsDesc,
      instructor: lmsInstructor,
      category: lmsCategory,
      level: lmsLevel,
      duration: lmsDuration,
      price: Number(lmsPrice) || 4999,
      image: lmsImage,
      imageFileName: lmsImageFileName,
      lessons: lmsLessons.map((l, idx) => ({
        id: l.id || `l-${Date.now()}-${idx}`,
        title: l.title,
        duration: l.duration,
        description: l.description,
        videoUrl: l.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoFileName: l.videoFileName,
        pdfUrl: l.pdfUrl,
        pdfFileName: l.pdfFileName
      }))
    };
    StorageManager.saveLMSCourse(newCourse);
    setLmsCourses(StorageManager.getLMSCourses());
    setIsAddLMSModalOpen(false);
    setLmsTitle('');
    setLmsDesc('');
    setLmsImageFileName('');
    setLmsLessons([{ id: 'l-1', title: 'Introduction & Foundations', duration: '45 mins', description: '', videoUrl: '', videoFileName: '', pdfUrl: '', pdfFileName: '' }]);
    setLmsSaveMessage('✅ New LMS course successfully created with uploaded media & lessons!');
    setTimeout(() => setLmsSaveMessage(null), 4000);
  };

  const handleDeleteLMSCourseItem = (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      StorageManager.deleteLMSCourse(id);
      setLmsCourses(StorageManager.getLMSCourses());
      setLmsSaveMessage('🗑️ Course deleted.');
      setTimeout(() => setLmsSaveMessage(null), 4000);
    }
  };

  const handleRecordFeePayment = (enrId: string) => {
    const amtStr = prompt('Enter payment amount received (₹):', '2500');
    if (!amtStr) return;
    const amt = Number(amtStr);
    if (isNaN(amt) || amt <= 0) {
      alert('Invalid amount');
      return;
    }
    const note = prompt('Enter payment reference note (e.g. UPI txn #12345):', 'Fee installment received') || 'Fee payment';
    StorageManager.recordStudentPayment(enrId, amt, note);
    setStudentEnrollments(StorageManager.getStudentEnrollments());
    setLmsSaveMessage('✅ Fee payment successfully recorded on ledger!');
    setTimeout(() => setLmsSaveMessage(null), 4000);
  };

  const handleSaveHeroState = () => {
    StorageManager.saveHeroSlides(heroSlides);
    setHeroSaveMessage('✅ Hero slider slides successfully saved!');
    setTimeout(() => setHeroSaveMessage(null), 5000);
  };

  const handleSaveHeroSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroTitle.trim() || !heroPaintedImage || !heroOriginalPhoto) {
      alert('Please provide a Title, Painted Artwork Image, and Original Reference Photo.');
      return;
    }

    let updated: HeroSlide[];
    if (editingHeroSlideId) {
      updated = heroSlides.map(s => s.id === editingHeroSlideId ? {
        ...s,
        title: heroTitle,
        artist: heroArtist || 'Master Atelier',
        medium: heroMedium || 'Oil on Canvas',
        paintedImage: heroPaintedImage,
        originalPhoto: heroOriginalPhoto,
        originalLabel: heroOriginalLabel || 'Customer Photo'
      } : s);
      setHeroSaveMessage('✅ Hero slide updated successfully!');
    } else {
      const newSlide: HeroSlide = {
        id: `hero-${Date.now()}`,
        title: heroTitle,
        artist: heroArtist || 'Master Atelier',
        medium: heroMedium || 'Oil on Canvas',
        paintedImage: heroPaintedImage,
        originalPhoto: heroOriginalPhoto,
        originalLabel: heroOriginalLabel || 'Customer Photo',
      };
      updated = [newSlide, ...heroSlides];
      setHeroSaveMessage('✅ New hero slide added successfully!');
    }

    setHeroSlides(updated);
    StorageManager.saveHeroSlides(updated);
    setIsAddHeroModalOpen(false);
    setEditingHeroSlideId(null);
    setTimeout(() => setHeroSaveMessage(null), 4000);
  };

  const handleDeleteHeroSlide = (id: string) => {
    if (confirm('Are you sure you want to delete this hero slider slide?')) {
      const updated = heroSlides.filter(s => s.id !== id);
      setHeroSlides(updated);
      StorageManager.saveHeroSlides(updated);
      setHeroSaveMessage('🗑️ Hero slide deleted.');
      setTimeout(() => setHeroSaveMessage(null), 4000);
    }
  };
  const [isAddCompModalOpen, setIsAddCompModalOpen] = useState(false);
  const [compTitle, setCompTitle] = useState('');
  const [compMedium, setCompMedium] = useState('Oil on Canvas');
  const [compArtist, setCompArtist] = useState('Elena Rostova');
  const [compOriginalImage, setCompOriginalImage] = useState('');
  const [compArtImage, setCompArtImage] = useState('');
  const [compDesc, setCompDesc] = useState('');
  const [compFaceCount, setCompFaceCount] = useState('2 Faces');
  const [compOriginalFileName, setCompOriginalFileName] = useState('');
  const [compArtFileName, setCompArtFileName] = useState('');
  const originalFileInputRef = useRef<HTMLInputElement>(null);
  const artFileInputRef = useRef<HTMLInputElement>(null);

  const handleCompImageUpload = (file: File, type: 'original' | 'art') => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
    const folderPath = `/images/showcase/${type}_${Date.now()}_${cleanName}`;
    if (type === 'original') {
      setCompOriginalImage(folderPath);
      setCompOriginalFileName(file.name);
    } else {
      setCompArtImage(folderPath);
      setCompArtFileName(file.name);
    }
  };

  const handleSaveComparisonPair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compTitle.trim() || !compOriginalImage || !compArtImage) {
      alert('Please provide a Title, Before (Original) Photo, and After (Masterpiece) Image.');
      return;
    }
    const newPair: ComparisonPair = {
      id: `comp-${Date.now()}`,
      title: compTitle,
      medium: compMedium,
      artist: compArtist,
      originalImage: compOriginalImage,
      artImage: compArtImage,
      description: compDesc || 'Custom handcrafted portrait from client photograph.',
      faceCount: compFaceCount,
    };
    const updated = [newPair, ...comparisonPairs];
    setComparisonPairs(updated);
    StorageManager.saveComparisonPairs(updated);
    setIsAddCompModalOpen(false);
    setCompTitle('');
    setCompOriginalImage('');
    setCompArtImage('');
    setCompDesc('');
    setCompOriginalFileName('');
    setCompArtFileName('');
  };

  const handleDeleteComparisonPair = (id: string) => {
    const updated = comparisonPairs.filter(p => p.id !== id);
    setComparisonPairs(updated);
    StorageManager.saveComparisonPairs(updated);
  };

  const handleGalleryImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
    const folderPath = `/images/gallery/${cleanName}`;
    setNewGalleryImage(folderPath);
    setGalleryFileName(file.name);
    setGalleryUploadLoading(false);
  };

  const handleOpenAddGalleryModal = () => {
    setNewGalleryTitle('');
    setNewGalleryCategory('pencil');
    setNewGalleryPrice(1499);
    setNewGalleryImage('https://picsum.photos/seed/1579783902614-a3fb3927b675/800/600');
    setGalleryFileName('');
    setNewGalleryDesc('Handcrafted tonal graphite sketch on 300gsm cotton.');
    setShowUrlFallback(false);
    setIsAddGalleryModalOpen(true);
  };

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  // Calculated Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.pricing.finalTotal : 0), 0);
  const ordersInProduction = orders.filter(o => o.status === 'in_production' || o.status === 'artist_assigned').length;
  const ordersAwaitingApproval = orders.filter(o => o.status === 'awaiting_customer_approval').length;
  const ordersRevision = orders.filter(o => o.status === 'revision_requested').length;
  const ordersReadyToShip = orders.filter(o => o.status === 'approved' || o.status === 'quality_check' || o.status === 'ready_to_ship').length;

  const handleSavePricing = () => {
    onUpdatePricingConfig(editablePricing);
    setPricingSavedMessage(true);
    setTimeout(() => setPricingSavedMessage(false), 3000);
  };

  const handleDispatch = () => {
    if (!trackingNumber.trim()) return;
    onDispatchShipping(selectedOrder.id, shippingCarrier, trackingNumber.trim());
    setTrackingNumber('');
  };

  const handleSaveNewGalleryItem = () => {
    if (!newGalleryTitle.trim()) return;
    const newItem: GalleryItem = {
      id: 'gal-' + Date.now(),
      title: newGalleryTitle,
      slug: newGalleryTitle.toLowerCase().replace(/\s+/g, '-'),
      categoryId: newGalleryCategory,
      categoryName: newGalleryCategory.replace(/_/g, ' ').toUpperCase(),
      style: 'Classical Atelier Handcraft',
      description: newGalleryDesc,
      images: [newGalleryImage],
      afterImage: newGalleryImage,
      featured: true,
      sortOrder: 1,
      startingPrice: Number(newGalleryPrice),
      artistName: 'Elena Rostova',
      faceCount: 1,
      mediumDetails: 'Archival Acid-Free Cotton',
      rating: 5.0,
      reviewCount: 1,
      tags: ['New', 'Featured', newGalleryCategory],
    };
    onAddGalleryItem(newItem);
    setIsAddGalleryModalOpen(false);
    setNewGalleryTitle('');
  };

  return (
    <div className="py-8 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 animate-fadeIn">
      
      {/* Top Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            Operations & Admin Management Console
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Atelier Executive Control Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Order lifecycle orchestration, dynamic pricing engine, gallery CMS, and staff logs.
          </p>
        </div>

        <button
          onClick={onResetDemoData}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 transition-colors self-start sm:self-auto"
        >
          Reset Demo Data
        </button>
      </div>

      {/* KPI Stats Overview Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Revenue</div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-slate-900 mt-1">₹{totalRevenue}</div>
          <div className="text-[10px] text-emerald-600 mt-1 font-medium">Verified Paid</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">In Production</div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-blue-700 mt-1">{ordersInProduction}</div>
          <div className="text-[10px] text-slate-400 mt-1">Active on canvas</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Proof Awaiting</div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-sky-700 mt-1">{ordersAwaitingApproval}</div>
          <div className="text-[10px] text-sky-600 mt-1">Needs client click</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Revisions</div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-purple-900 mt-1">{ordersRevision}</div>
          <div className="text-[10px] text-purple-600 mt-1">Artist working</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Ready to Ship</div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-teal-900 mt-1">{ordersReadyToShip}</div>
          <div className="text-[10px] text-teal-600 mt-1">Framing complete</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Orders</div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-slate-900 mt-1">{orders.length}</div>
          <div className="text-[10px] text-slate-400 mt-1">Lifetime database</div>
        </div>

      </div>

      {/* Admin Module Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-8 overflow-x-auto">
        {[
          { id: 'orders', label: 'Order Workflow & Dispatch', icon: ShoppingBag },
          { id: 'pricing', label: 'Dynamic Pricing Engine (SRS §11/21)', icon: DollarSign },
          { id: 'showcase', label: 'Before & After Showcase Manager', icon: FileImage },
          { id: 'heroslides', label: 'Home Hero Slider CMS', icon: Sparkles },
          { id: 'gallery', label: 'Gallery Portfolio CMS', icon: ImageIcon },
          { id: 'folders', label: 'Media & Folder Assets (CMS)', icon: Folder },
          { id: 'lms', label: '🎓 LMS & Student Ledgers', icon: GraduationCap },
          { id: 'logs', label: 'Notifications & Audit Trail', icon: FileCheck },
          { id: 'users', label: 'User Management & RBAC', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`admin-tab-${tab.id}`}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeAdminTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ORDER WORKFLOW, ARTIST ASSIGNMENT & DISPATCH */}
      {activeAdminTab === 'orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Order List Selector */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              Select Commission to Manage:
            </h3>

            {orders.map((order) => {
              const isSelected = order.id === selectedOrder?.id;
              return (
                <div
                  key={order.id}
                  id={`admin-order-card-${order.id}`}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-white border-blue-600 ring-2 ring-blue-400 shadow-md'
                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-mono text-xs font-bold text-slate-900">{order.orderNumber}</div>
                    <div className="text-xs text-slate-700 font-medium">{order.customerName}</div>
                    <div className="text-[11px] text-slate-500 font-serif">{order.config.styleName}</div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <div className="font-mono text-xs font-bold text-slate-900 mt-1">₹{order.pricing.finalTotal}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Order Actions Panel */}
          {selectedOrder && (
            <div className="lg:col-span-8 space-y-6">
              
              {/* Order Detail Summary Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Manage Order</div>
                    <h2 className="font-serif text-2xl font-bold text-slate-900">
                      {selectedOrder.orderNumber} • {selectedOrder.customerName}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {selectedOrder.customerEmail} • {selectedOrder.customerPhone}
                    </p>
                  </div>

                  <span className="text-xs font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1.5 rounded-full">
                    Status: {selectedOrder.status}
                  </span>
                </div>

                {/* Dispatch & Assign Actions Module */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Action 1: Assign Artist */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-blue-600" />
                      <span>Assign Master Artist</span>
                    </h4>

                    <select
                      value={selectedArtistId}
                      onChange={(e) => setSelectedArtistId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                    >
                      {INITIAL_ARTISTS.map((artist) => (
                        <option key={artist.id} value={artist.id}>
                          {artist.name} ({artist.specialty.join(', ')})
                        </option>
                      ))}
                    </select>

                    <button
                      id="btn-admin-assign-artist"
                      onClick={() => {
                        const artist = INITIAL_ARTISTS.find(a => a.id === selectedArtistId);
                        if (artist) onAssignArtist(selectedOrder.id, artist.id, artist.name);
                      }}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                    >
                      Assign Artist & Set In-Production
                    </button>
                  </div>

                  {/* Action 2: Dispatch Shipping & Tracking Number */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span>Dispatch Shipping Tracking</span>
                    </h4>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Tracking # (e.g. BD-99482910)"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs font-mono bg-white"
                      />
                    </div>

                    <button
                      id="btn-admin-dispatch-shipping"
                      onClick={handleDispatch}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                    >
                      Dispatch with BlueDart & Notify Customer
                    </button>
                  </div>

                </div>

                {/* Face Count Staff Override */}
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-700" />
                    <span>Staff Photo Verification & Face Count Override (SRS §12)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-600 block mb-1">Confirmed Faces</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={faceOverrideCount}
                        onChange={(e) => setFaceOverrideCount(Number(e.target.value))}
                        className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] text-slate-600 block mb-1">Audit Reason for Override</label>
                      <input
                        type="text"
                        value={faceOverrideReason}
                        onChange={(e) => setFaceOverrideReason(e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-300 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <button
                    id="btn-admin-override-faces"
                    onClick={() => onOverrideFaceCount(selectedOrder.id, faceOverrideCount, faceOverrideReason)}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    Confirm & Update Face Pricing Audit
                  </button>
                </div>

                {/* Customer Photo Inspection */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                    Client Uploaded Photo:
                  </span>
                  {selectedOrder.config.sourcePhotos && selectedOrder.config.sourcePhotos[0] && (
                    <img
                      src={selectedOrder.config.sourcePhotos[0].url}
                      alt="Source"
                      className="max-h-60 rounded-2xl object-contain border border-slate-200"
                    />
                  )}
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* TAB 2: DYNAMIC FORM BUILDER & PRICING RULES CMS */}
      {activeAdminTab === 'pricing' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-8 animate-fadeIn">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                Dynamic Pricing Engine & Form Rules CMS
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure base medium rates, size adjustments, face multipliers, and add-ons in real-time.
              </p>
            </div>

            <button
              id="btn-save-pricing-cms"
              onClick={handleSavePricing}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Live Rates</span>
            </button>
          </div>

          {pricingSavedMessage && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Pricing configuration published live to customer configurator and checkout engine!</span>
            </div>
          )}

          {/* Base Medium Prices & Style Visuals */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <span>1. Medium Showcase Photos & Starting Rates (Includes 1 Face + Proof):</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Upload custom photos and set live starting prices for all storefront artistic mediums.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminStyles.map((style) => {
                const medKey = style.type;
                const activePrice = editablePricing.basePrices[medKey] ?? style.startingPrice;

                return (
                  <div 
                    key={style.type} 
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex gap-3 items-start">
                      {/* Image Thumbnail & Upload Button */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0 group">
                        <img
                          src={style.image}
                          alt={style.title}
                          className="w-full h-full object-cover"
                        />
                        <label 
                          className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-[9px] font-bold p-1 text-center"
                          title="Click to upload new photo"
                        >
                          <Upload className="w-4 h-4 mb-0.5" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                const reader = new FileReader();
                                reader.onload = (uploadEvt) => {
                                  if (uploadEvt.target?.result) {
                                    const newImg = uploadEvt.target.result as string;
                                    const updatedStyle = { ...style, image: newImg };
                                    StorageManager.updateStyle(updatedStyle);
                                    setAdminStyles(StorageManager.getStyles());
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                            {style.tag}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {style.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                          {style.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xs font-bold text-slate-500">₹</span>
                        <input
                          type="number"
                          value={activePrice}
                          onChange={(e) => {
                            const newPrice = Number(e.target.value);
                            setEditablePricing({
                              ...editablePricing,
                              basePrices: {
                                ...editablePricing.basePrices,
                                [medKey]: newPrice,
                              }
                            });
                            // Keep style starting price synced
                            const updatedStyle = { ...style, startingPrice: newPrice };
                            StorageManager.updateStyle(updatedStyle);
                            setAdminStyles(StorageManager.getStyles());
                          }}
                          className="w-24 p-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold bg-white text-slate-900"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveEditingStyle(style)}
                        className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 text-[11px] font-bold border border-slate-200 hover:border-blue-200 transition-colors flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Customize</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Multi-Face Increment Rate */}
          <div className="space-y-3 pt-6 border-t border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              2. Additional Face / Subject Rate (SRS Section 11):
            </h3>
            <div className="max-w-xs p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Charge per additional face beyond Face 1:
              </label>
              <div className="flex items-center gap-1">
                <span className="font-mono text-xs text-slate-500">₹</span>
                <input
                  type="number"
                  value={editablePricing.additionalFacePrice}
                  onChange={(e) => {
                    setEditablePricing({
                      ...editablePricing,
                      additionalFacePrice: Number(e.target.value),
                    });
                  }}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs font-mono font-bold bg-white"
                />
              </div>
            </div>
          </div>

          {/* Size Adjustments */}
          <div className="space-y-3 pt-6 border-t border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              3. Size Surcharges:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {Object.keys(editablePricing.sizeSurcharges).map((sizeKey) => {
                const sKey = sizeKey as any;
                return (
                  <div key={sizeKey} className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">{sKey}</label>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs text-slate-500">₹</span>
                      <input
                        type="number"
                        value={editablePricing.sizeSurcharges[sKey]}
                        onChange={(e) => {
                          setEditablePricing({
                            ...editablePricing,
                            sizeSurcharges: {
                              ...editablePricing.sizeSurcharges,
                              [sKey]: Number(e.target.value),
                            }
                          });
                        }}
                        className="w-full p-1.5 rounded-lg border border-slate-300 text-xs font-mono bg-white"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* TAB: BEFORE & AFTER SHOWCASE MANAGER */}
      {activeAdminTab === 'showcase' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-fadeIn">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                Before & After Showcase Manager
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload and manage customer reference photos (Before) and final master artist portraits (After) featured on the homepage hero and comparison slider.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveShowcaseState}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>💾 Save Showcase State</span>
              </button>

              <button
                onClick={() => setIsAddCompModalOpen(true)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Before & After Pair</span>
              </button>
            </div>
          </div>

          {showcaseSaveMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between animate-fadeIn">
              <span>{showcaseSaveMessage}</span>
              <button onClick={() => setShowcaseSaveMessage(null)} className="text-emerald-700 hover:text-emerald-900 font-bold ml-2">✕</button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparisonPairs.map((pair) => (
              <div key={pair.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-300">
                    <img src={pair.originalImage} alt="Before" className="w-full h-full object-contain" />
                    <span className="absolute bottom-1 left-1 bg-black/75 text-[9px] text-white px-1.5 py-0.5 rounded font-mono">Before</span>
                  </div>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-300">
                    <img src={pair.artImage} alt="After" className="w-full h-full object-contain" />
                    <span className="absolute bottom-1 right-1 bg-emerald-800 text-[9px] text-white px-1.5 py-0.5 rounded font-mono">After</span>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">{pair.medium}</span>
                    <h4 className="font-serif font-bold text-slate-900 text-sm truncate">{pair.title}</h4>
                    <p className="text-[11px] text-slate-500">Artist: {pair.artist}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteComparisonPair(pair.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Pair"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comparison Modal */}
          {isAddCompModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-slate-900">Upload Before & After Showcase Pair</h3>
                    <p className="text-xs text-slate-500">Add a new customer photo and master painting pair for the homepage.</p>
                  </div>
                  <button onClick={() => setIsAddCompModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveComparisonPair} className="space-y-5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Masterpiece Title *</label>
                    <input
                      type="text"
                      required
                      value={compTitle}
                      onChange={(e) => setCompTitle(e.target.value)}
                      placeholder="e.g. Royal Wedding Oil Portrait"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Medium / Style</label>
                      <input
                        type="text"
                        value={compMedium}
                        onChange={(e) => setCompMedium(e.target.value)}
                        placeholder="e.g. Oil on Canvas"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Artist Name</label>
                      <input
                        type="text"
                        value={compArtist}
                        onChange={(e) => setCompArtist(e.target.value)}
                        placeholder="e.g. Elena Rostova"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Before Photo Upload / URL */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <label className="block font-bold text-slate-800">1. Before Photo (Customer Reference / Raw Snapshot) *</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="file"
                        ref={originalFileInputRef}
                        onChange={(e) => e.target.files?.[0] && handleCompImageUpload(e.target.files[0], 'original')}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => originalFileInputRef.current?.click()}
                        className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl font-medium text-slate-700 flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4 text-slate-500" />
                        <span>{compOriginalFileName ? 'Change File' : 'Upload From Device'}</span>
                      </button>
                      <span className="text-slate-500 truncate">{compOriginalFileName || 'or paste image URL below'}</span>
                    </div>
                    <input
                      type="url"
                      value={compOriginalImage}
                      onChange={(e) => setCompOriginalImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900"
                    />
                  </div>

                  {/* After Artwork Upload / URL */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <label className="block font-bold text-slate-800">2. After Image (Handcrafted Masterpiece) *</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="file"
                        ref={artFileInputRef}
                        onChange={(e) => e.target.files?.[0] && handleCompImageUpload(e.target.files[0], 'art')}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => artFileInputRef.current?.click()}
                        className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl font-medium text-slate-700 flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4 text-slate-500" />
                        <span>{compArtFileName ? 'Change File' : 'Upload From Device'}</span>
                      </button>
                      <span className="text-slate-500 truncate">{compArtFileName || 'or paste image URL below'}</span>
                    </div>
                    <input
                      type="url"
                      value={compArtImage}
                      onChange={(e) => setCompArtImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={compDesc}
                      onChange={(e) => setCompDesc(e.target.value)}
                      placeholder="Short caption describing the transformation..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsAddCompModalOpen(false)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                    >
                      Save & Publish Showcase
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB: HOME HERO SLIDER CMS */}
      {activeAdminTab === 'heroslides' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-fadeIn">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                Home Hero Slider CMS Manager
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage interactive hero banner slides displayed on the homepage slider (painted masterpiece vs customer reference photo).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveHeroState}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>💾 Save Hero Slides</span>
              </button>

              <button
                onClick={handleOpenAddHeroModal}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Hero Slide</span>
              </button>
            </div>
          </div>

          {heroSaveMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between animate-fadeIn">
              <span>{heroSaveMessage}</span>
              <button onClick={() => setHeroSaveMessage(null)} className="text-emerald-700 hover:text-emerald-900 font-bold ml-2">✕</button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroSlides.map((slide) => (
              <div key={slide.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="relative h-48 rounded-xl overflow-hidden bg-slate-900 border border-slate-300">
                  <img src={slide.paintedImage} alt={slide.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-black/75 text-[10px] text-white px-2 py-0.5 rounded-full font-mono">
                    Slide #{slide.id}
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-purple-700 font-bold uppercase tracking-wider">{slide.medium}</span>
                    <h4 className="font-serif font-bold text-slate-900 text-sm truncate">{slide.title}</h4>
                    <p className="text-[11px] text-slate-500">Artist: {slide.artist}</p>
                    <p className="text-[10px] text-slate-400">Original Label: {slide.originalLabel}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditHeroSlide(slide)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Slide"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteHeroSlide(slide.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add / Edit Hero Slide Modal */}
          {isAddHeroModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-slate-900">
                      {editingHeroSlideId ? 'Edit Home Hero Slide' : 'Add New Home Hero Slide'}
                    </h3>
                    <p className="text-xs text-slate-500">Configure featured masterpiece showcase slide for the homepage hero carousel.</p>
                  </div>
                  <button onClick={() => setIsAddHeroModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveHeroSlide} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Slide Title *</label>
                    <input
                      type="text"
                      required
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      placeholder="e.g. Cherished Family Oil Painting"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Medium / Style</label>
                      <input
                        type="text"
                        value={heroMedium}
                        onChange={(e) => setHeroMedium(e.target.value)}
                        placeholder="e.g. Oil on 100% Linen Canvas"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Artist Name</label>
                      <input
                        type="text"
                        value={heroArtist}
                        onChange={(e) => setHeroArtist(e.target.value)}
                        placeholder="e.g. Master Atelier Elena"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Painted Artwork Image Upload / URL */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <label className="block font-bold text-slate-800">Painted Artwork Image (Masterpiece) *</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="file"
                        ref={heroPaintedInputRef}
                        onChange={(e) => e.target.files?.[0] && handleHeroImageUpload(e.target.files[0], 'painted')}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => heroPaintedInputRef.current?.click()}
                        className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl font-medium text-slate-700 flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4 text-slate-500" />
                        <span>{heroPaintedFileName ? 'Change File' : 'Upload From Device'}</span>
                      </button>
                      <span className="text-slate-500 truncate">{heroPaintedFileName || 'or paste image URL below'}</span>
                    </div>
                    <input
                      type="url"
                      required
                      value={heroPaintedImage}
                      onChange={(e) => setHeroPaintedImage(e.target.value)}
                      placeholder="https://picsum.photos/seed/.../800/600"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900"
                    />
                  </div>

                  {/* Original Reference Photo Upload / URL */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <label className="block font-bold text-slate-800">Original Reference Photo *</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="file"
                        ref={heroOriginalInputRef}
                        onChange={(e) => e.target.files?.[0] && handleHeroImageUpload(e.target.files[0], 'original')}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => heroOriginalInputRef.current?.click()}
                        className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl font-medium text-slate-700 flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4 text-slate-500" />
                        <span>{heroOriginalFileName ? 'Change File' : 'Upload From Device'}</span>
                      </button>
                      <span className="text-slate-500 truncate">{heroOriginalFileName || 'or paste image URL below'}</span>
                    </div>
                    <input
                      type="url"
                      required
                      value={heroOriginalPhoto}
                      onChange={(e) => setHeroOriginalPhoto(e.target.value)}
                      placeholder="https://picsum.photos/seed/.../800/600"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Original Photo Badge Label</label>
                    <input
                      type="text"
                      value={heroOriginalLabel}
                      onChange={(e) => setHeroOriginalLabel(e.target.value)}
                      placeholder="e.g. Customer Photo"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsAddHeroModalOpen(false)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                    >
                      {editingHeroSlideId ? 'Save Changes' : 'Save & Add Hero Slide'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: GALLERY PORTFOLIO CMS */}

      {activeAdminTab === 'gallery' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-fadeIn">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                Gallery & Artwork CMS (SRS Section 20)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage public portfolio, add before/after artwork sets, and configure starting prices.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveGalleryState}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>💾 Save Gallery State</span>
              </button>

              <button
                onClick={handleOpenAddGalleryModal}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Portfolio Artwork</span>
              </button>
            </div>
          </div>

          {gallerySaveMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between animate-fadeIn">
              <span>{gallerySaveMessage}</span>
              <button onClick={() => setGallerySaveMessage(null)} className="text-emerald-700 hover:text-emerald-900 font-bold ml-2">✕</button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3">
                <div className="flex gap-3">
                  <img
                    src={item.afterImage}
                    alt={item.title}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-300 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-blue-700 font-bold uppercase">{item.categoryName}</div>
                    <h4 className="font-serif font-bold text-slate-900 text-sm truncate">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Artist: {item.artistName}</p>
                    <div className="font-mono text-xs font-bold text-slate-900 mt-1">Starting: ₹{item.startingPrice}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEditGalleryModal(item)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-blue-600 font-bold text-xs border border-slate-200 flex items-center gap-1 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteGallery(item.id)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 font-bold text-xs border border-slate-200 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 5: ORGANIZED MEDIA ASSET & FOLDER CMS */}
      {activeAdminTab === 'folders' && (
        <MediaFolderManager
          onAddGalleryItem={onAddGalleryItem}
        />
      )}

      {/* TAB 6: NOTIFICATIONS & AUDIT LOG TRAIL */}
      {activeAdminTab === 'logs' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-fadeIn">
          
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Notification Center & Security Audit Trail
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live inspection of customer WhatsApp/email notifications and system state changes.
            </p>
          </div>

          {/* Audit Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User & Role</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Entity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.slice(0, 15).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-slate-500 text-[10px]">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="p-3 font-medium text-slate-800">
                      {log.userName} <span className="text-[10px] text-slate-500">({log.role})</span>
                    </td>
                    <td className="p-3 text-slate-900 font-semibold">{log.action}</td>
                    <td className="p-3 font-mono text-slate-500 text-[10px]">{log.entityType} #{log.entityId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 7: USER MANAGEMENT & RBAC */}
      {activeAdminTab === 'users' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                User Management & Role-Based Access Control (RBAC)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage client, artist, and admin user accounts, alter roles in real-time, and reset passwords securely.
              </p>
            </div>
            <button
              onClick={() => setIsCreateUserModalOpen(true)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create New User Account</span>
            </button>
          </div>

          {userMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between">
              <span>{userMsg}</span>
              <button onClick={() => setUserMsg(null)} className="font-bold text-emerald-700 hover:text-emerald-900">✕</button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminUsers.map((usr) => (
              <div key={usr.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between space-y-4">
                <div className="flex items-start gap-3">
                  <img src={usr.avatar || 'https://picsum.photos/seed/1534528741775-53994a69daeb/800/600'} alt={usr.name} className="w-12 h-12 rounded-full object-cover border border-slate-300" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-slate-900 truncate">{usr.name}</div>
                    <div className="text-xs text-slate-500 font-mono">@{usr.username}</div>
                    <div className="text-[11px] text-slate-600 truncate">{usr.email}</div>
                    {usr.phone && <div className="text-[11px] text-slate-500 font-mono">{usr.phone}</div>}
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Access Role:</span>
                    <select
                      value={usr.role}
                      onChange={(e) => {
                        const newRole = e.target.value as UserRole;
                        StorageManager.updateUserRole(usr.id, newRole);
                        setAdminUsers(StorageManager.getUsers());
                        setUserMsg(`✅ Updated role for @${usr.username} to ${newRole}`);
                      }}
                      className="p-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white text-slate-800"
                    >
                      <option value="customer">Client (Customer)</option>
                      <option value="artist">Artist</option>
                      <option value="operations">Operations</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-400 font-mono">Created: {new Date(usr.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => {
                        setEditingUserPasswordId(usr.id);
                        setNewResetPassword('');
                      }}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold transition-colors"
                    >
                      🔑 Reset Password
                    </button>
                  </div>

                  {editingUserPasswordId === usr.id && (
                    <div className="mt-3 p-3 bg-white rounded-xl border border-blue-200 space-y-2 animate-fadeIn">
                      <div className="text-[11px] font-bold text-blue-900">Set New Password for @{usr.username}:</div>
                      <input
                        type="text"
                        placeholder="New password (min 6 chars)"
                        value={newResetPassword}
                        onChange={(e) => setNewResetPassword(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                      />
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => setEditingUserPasswordId(null)}
                          className="px-2.5 py-1 text-slate-600 text-[11px] font-bold hover:bg-slate-100 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            if (newResetPassword.length < 6) {
                              alert('Password must be at least 6 characters.');
                              return;
                            }
                            StorageManager.resetUserPassword(usr.id, newResetPassword);
                            setEditingUserPasswordId(null);
                            setUserMsg(`✅ Password successfully reset for @${usr.username}`);
                          }}
                          className="px-3 py-1 bg-blue-600 text-white text-[11px] font-bold rounded hover:bg-blue-700"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Create User Modal */}
          {isCreateUserModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div 
                className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-serif font-bold text-slate-900 text-lg">Create New User Account</h3>
                  <button onClick={() => setIsCreateUserModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ananya Roy"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Username</label>
                    <input
                      type="text"
                      placeholder="e.g. ananya_art"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. ananya@example.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Role</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50"
                    >
                      <option value="customer">Client (Customer)</option>
                      <option value="artist">Artist</option>
                      <option value="operations">Operations</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Phone (Optional)</label>
                    <input
                      type="text"
                      placeholder="+91 9876543210"
                      value={newUserPhone}
                      onChange={(e) => setNewUserPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setIsCreateUserModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!newUserName || !newUsername || !newUserEmail || !newUserPassword) {
                        alert('Please fill in all required user fields.');
                        return;
                      }
                      const res = StorageManager.createUserByAdmin({
                        name: newUserName,
                        username: newUsername,
                        email: newUserEmail,
                        password: newUserPassword,
                        role: newUserRole,
                        phone: newUserPhone,
                      });
                      if (res.success) {
                        setAdminUsers(StorageManager.getUsers());
                        setIsCreateUserModalOpen(false);
                        setUserMsg(`✅ Successfully created account for @${newUsername} with role [${newUserRole}]`);
                        setNewUserName('');
                        setNewUsername('');
                        setNewUserEmail('');
                        setNewUserPassword('');
                        setNewUserPhone('');
                      } else {
                        alert(res.error || 'Failed to create user.');
                      }
                    }}
                    className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add New Gallery Item Modal */}
      {isAddGalleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-fadeIn my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Palette className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-slate-900 text-lg">Add Portfolio Artwork</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddGalleryModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Title</label>
              <input
                type="text"
                placeholder="e.g. Royal Oil Portrait"
                value={newGalleryTitle}
                onChange={(e) => setNewGalleryTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Medium</label>
                <select
                  value={newGalleryCategory}
                  onChange={(e) => setNewGalleryCategory(e.target.value as ArtworkType)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                >
                  <option value="pencil">Pencil Sketch</option>
                  <option value="charcoal">Charcoal</option>
                  <option value="oil_canvas">Oil on Canvas</option>
                  <option value="watercolor">Watercolor</option>
                  <option value="color_pencil">Color Pencil</option>
                  <option value="digital_portrait">Digital Portrait</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Starting Price (₹)</label>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={newGalleryPrice}
                  onChange={(e) => setNewGalleryPrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Image Upload Provision */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>Upload Artwork Image</span>
                </label>
                <span className="text-[10px] text-slate-400 font-medium">
                  JPG, PNG, WEBP supported
                </span>
              </div>

              <input
                ref={galleryFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleGalleryImageUpload(e.target.files[0]);
                  }
                }}
              />

              {newGalleryImage ? (
                /* Preview State with Change/Remove controls */
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0 group">
                    <img
                      src={newGalleryImage}
                      alt="Uploaded artwork"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md w-fit mb-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Image Ready</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {galleryFileName || 'Custom Artwork Photo'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => galleryFileInputRef.current?.click()}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold transition-colors flex items-center gap-1"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Change Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNewGalleryImage('');
                          setGalleryFileName('');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-[11px] font-bold transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty Upload Dropzone */
                <div
                  onDragOver={(e) => { e.preventDefault(); setGalleryIsDragOver(true); }}
                  onDragLeave={() => setGalleryIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setGalleryIsDragOver(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleGalleryImageUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => galleryFileInputRef.current?.click()}
                  className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-1.5 ${
                    galleryIsDragOver
                      ? 'border-blue-500 bg-blue-50/60'
                      : 'border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1 shadow-xs">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    {galleryUploadLoading ? 'Uploading image...' : 'Click to Upload or Drag & Drop Photo'}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Upload any high-resolution portrait or artwork photo from your computer
                  </p>
                </div>
              )}

              {/* Optional URL toggle fallback */}
              <div className="pt-1">
                {!showUrlFallback ? (
                  <button
                    type="button"
                    onClick={() => setShowUrlFallback(true)}
                    className="text-[11px] text-blue-600 hover:underline font-medium"
                  >
                    + Or paste image web link instead
                  </button>
                ) : (
                  <div className="space-y-1 mt-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-600">Image Web URL</label>
                      <button
                        type="button"
                        onClick={() => setShowUrlFallback(false)}
                        className="text-[10px] text-slate-400 hover:text-slate-600"
                      >
                        Hide
                      </button>
                    </div>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={newGalleryImage}
                      onChange={(e) => setNewGalleryImage(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 text-xs font-mono bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
              <textarea
                rows={2}
                value={newGalleryDesc}
                onChange={(e) => setNewGalleryDesc(e.target.value)}
                placeholder="Handcrafted details, paper grain, artist notes..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddGalleryModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNewGalleryItem}
                disabled={!newGalleryTitle.trim() || !newGalleryImage}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Add Artwork
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Gallery Item Modal */}
      {editingGalleryItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-fadeIn my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Edit className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-slate-900 text-lg">Edit Portfolio Artwork</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingGalleryItem(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Title</label>
              <input
                type="text"
                value={editGalleryTitle}
                onChange={(e) => setEditGalleryTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Medium</label>
                <select
                  value={editGalleryCategory}
                  onChange={(e) => setEditGalleryCategory(e.target.value as ArtworkType)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                >
                  <option value="pencil">Pencil Sketch</option>
                  <option value="charcoal">Charcoal</option>
                  <option value="oil_canvas">Oil on Canvas</option>
                  <option value="watercolor">Watercolor</option>
                  <option value="color_pencil">Color Pencil</option>
                  <option value="digital_portrait">Digital Portrait</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Starting Price (₹)</label>
                <input
                  type="number"
                  value={editGalleryPrice}
                  onChange={(e) => setEditGalleryPrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Artwork Image URL</label>
              <input
                type="text"
                value={editGalleryImage}
                onChange={(e) => setEditGalleryImage(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
              <textarea
                rows={2}
                value={editGalleryDesc}
                onChange={(e) => setEditGalleryDesc(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingGalleryItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditedGalleryItem}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: LMS & STUDENT LEDGERS */}
      {activeAdminTab === 'lms' && (
        <div className="space-y-8 animate-fadeIn">
          {lmsSaveMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between">
              <span>{lmsSaveMessage}</span>
              <button onClick={() => setLmsSaveMessage(null)}><X className="w-4 h-4" /></button>
            </div>
          )}

          {/* Courses Manager Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900">Manage Art Academy Masterclasses (LMS)</h3>
                <p className="text-xs text-slate-500 mt-0.5">Create and manage courses, curriculum, fees, and instructor assignments.</p>
              </div>
              <button
                onClick={() => setIsAddLMSModalOpen(true)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Course</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lmsCourses.map((course) => (
                <div key={course.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="relative h-40 rounded-xl overflow-hidden bg-slate-900">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        ₹{course.price.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-bold text-blue-600">{course.category}</span>
                      <span>{course.duration}</span>
                    </div>

                    <h4 className="font-serif font-bold text-slate-900 text-base">{course.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{course.description}</p>
                    <p className="text-[11px] text-slate-500 font-semibold">Instructor: {course.instructor}</p>
                    <p className="text-[11px] font-mono text-slate-500">{course.lessons.length} Lessons Included</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleDeleteLMSCourseItem(course.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Enrollments & Fee Ledgers Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-900">Student Enrollments & Fee Ledgers</h3>
              <p className="text-xs text-slate-500 mt-0.5">Track student course progress, fee clearances, balance dues, and record offline/online payments.</p>
            </div>

            <div className="space-y-4">
              {studentEnrollments.map((enr) => (
                <div key={enr.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-blue-600">ENROLLMENT ID: {enr.id}</span>
                      <h4 className="font-serif font-bold text-slate-900 text-base mt-0.5">{enr.courseTitle}</h4>
                      <p className="text-xs text-slate-600">Student: <strong className="text-slate-900">{enr.studentName}</strong> ({enr.studentEmail})</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Fee Status</span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          enr.feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {enr.feeStatus} (Paid ₹{enr.feePaid} / ₹{enr.feeTotal})
                        </span>
                      </div>

                      <button
                        onClick={() => handleRecordFeePayment(enr.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                      >
                        <DollarSign className="w-4 h-4" />
                        <span>Record Payment</span>
                      </button>
                    </div>
                  </div>

                  {/* Ledger History Table */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 block">Ledger Statement & Payment History:</span>
                    <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 p-2">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                            <th className="p-2.5">Date</th>
                            <th className="p-2.5">Description</th>
                            <th className="p-2.5 text-right">Debit</th>
                            <th className="p-2.5 text-right">Credit</th>
                            <th className="p-2.5 text-right">Balance Due</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {enr.ledger.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                              <td className="p-2.5 font-mono text-slate-600">{item.date}</td>
                              <td className="p-2.5 font-medium text-slate-800">{item.description}</td>
                              <td className="p-2.5 text-right font-mono text-slate-700">{item.debit > 0 ? `₹${item.debit}` : '-'}</td>
                              <td className="p-2.5 text-right font-mono text-emerald-600 font-bold">{item.credit > 0 ? `₹${item.credit}` : '-'}</td>
                              <td className="p-2.5 text-right font-mono font-bold text-slate-900">₹{item.balance}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Add Course Modal */}
          {isAddLMSModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-slate-900">Add New Masterclass Course</h3>
                  <button onClick={() => setIsAddLMSModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveLMSCourseSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Course Title *</label>
                    <input
                      type="text"
                      required
                      value={lmsTitle}
                      onChange={(e) => setLmsTitle(e.target.value)}
                      placeholder="e.g. Advanced Portrait Shading Masterclass"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Category</label>
                      <input
                        type="text"
                        value={lmsCategory}
                        onChange={(e) => setLmsCategory(e.target.value)}
                        placeholder="e.g. Drawing & Sketching"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Instructor</label>
                      <input
                        type="text"
                        value={lmsInstructor}
                        onChange={(e) => setLmsInstructor(e.target.value)}
                        placeholder="e.g. Master Artist Rajesh Nair"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Level</label>
                      <select
                        value={lmsLevel}
                        onChange={(e) => setLmsLevel(e.target.value as any)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 outline-none bg-white text-slate-900 font-medium"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="All Levels">All Levels</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Duration</label>
                      <input
                        type="text"
                        value={lmsDuration}
                        onChange={(e) => setLmsDuration(e.target.value)}
                        placeholder="6 Weeks"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 outline-none text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Price (₹) *</label>
                      <input
                        type="number"
                        required
                        value={lmsPrice}
                        onChange={(e) => setLmsPrice(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 outline-none font-mono text-slate-900 font-bold"
                      />
                    </div>
                  </div>

                  {/* Course Thumbnail Image Upload / URL */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <label className="block font-bold text-slate-800">Course Thumbnail Image *</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="file"
                        ref={lmsImageInputRef}
                        onChange={(e) => e.target.files?.[0] && handleLMSImageUpload(e.target.files[0])}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => lmsImageInputRef.current?.click()}
                        className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl font-medium text-slate-700 flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4 text-slate-500" />
                        <span>{lmsImageFileName ? 'Change File' : 'Upload From Device'}</span>
                      </button>
                      <span className="text-slate-500 truncate">{lmsImageFileName || 'or paste image URL below'}</span>
                    </div>
                    <input
                      type="url"
                      required
                      value={lmsImage}
                      onChange={(e) => setLmsImage(e.target.value)}
                      placeholder="https://picsum.photos/seed/.../800/600"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Course Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={lmsDesc}
                      onChange={(e) => setLmsDesc(e.target.value)}
                      placeholder="Detailed overview of what students will master..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900"
                    />
                  </div>

                  {/* Lessons Builder with Video & PDF Upload */}
                  <div className="space-y-4 pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-slate-900 text-sm">Course Lessons & Media Files</h4>
                        <p className="text-[11px] text-slate-500">Add lessons, upload video files or paste URLs, and attach PDF study guides.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddLMSLessonItem}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold text-xs flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Lesson</span>
                      </button>
                    </div>

                    <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                      {lmsLessons.map((lesson, idx) => (
                        <div key={lesson.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-800">Lesson #{idx + 1}</span>
                            {lmsLessons.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveLMSLessonItem(idx)}
                                className="text-rose-600 hover:text-rose-700 p-1 rounded-lg"
                                title="Remove Lesson"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Lesson Title *</label>
                              <input
                                type="text"
                                required
                                value={lesson.title}
                                onChange={(e) => {
                                  const updated = [...lmsLessons];
                                  updated[idx].title = e.target.value;
                                  setLmsLessons(updated);
                                }}
                                placeholder="e.g. Shading Techniques"
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Duration</label>
                              <input
                                type="text"
                                value={lesson.duration}
                                onChange={(e) => {
                                  const updated = [...lmsLessons];
                                  updated[idx].duration = e.target.value;
                                  setLmsLessons(updated);
                                }}
                                placeholder="45 mins"
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs"
                              />
                            </div>
                          </div>

                          {/* Video Upload / URL */}
                          <div className="space-y-1">
                            <label className="block text-[11px] font-bold text-slate-700">Video Lesson File / URL</label>
                            <div className="flex gap-2 items-center">
                              <label className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl font-medium text-slate-700 text-[11px] cursor-pointer flex items-center gap-1.5">
                                <Upload className="w-3.5 h-3.5 text-slate-500" />
                                <span>{lesson.videoFileName ? 'Change Video' : 'Upload Video'}</span>
                                <input
                                  type="file"
                                  accept="video/*"
                                  className="hidden"
                                  onChange={(e) => e.target.files?.[0] && handleLMSLessonVideoUpload(idx, e.target.files[0])}
                                />
                              </label>
                              <span className="text-[11px] text-slate-500 truncate">{lesson.videoFileName || 'or paste video URL'}</span>
                            </div>
                            <input
                              type="url"
                              value={lesson.videoUrl}
                              onChange={(e) => {
                                const updated = [...lmsLessons];
                                updated[idx].videoUrl = e.target.value;
                                setLmsLessons(updated);
                              }}
                              placeholder="https://www.youtube.com/embed/... or blob URL"
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-[11px] font-mono"
                            />
                          </div>

                          {/* PDF Resource Upload / URL */}
                          <div className="space-y-1">
                            <label className="block text-[11px] font-bold text-slate-700">Resource PDF Guide</label>
                            <div className="flex gap-2 items-center">
                              <label className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl font-medium text-slate-700 text-[11px] cursor-pointer flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-blue-600" />
                                <span>{lesson.pdfFileName ? 'Change PDF' : 'Upload PDF'}</span>
                                <input
                                  type="file"
                                  accept="application/pdf"
                                  className="hidden"
                                  onChange={(e) => e.target.files?.[0] && handleLMSLessonPdfUpload(idx, e.target.files[0])}
                                />
                              </label>
                              <span className="text-[11px] text-slate-500 truncate">{lesson.pdfFileName || 'or paste PDF link'}</span>
                            </div>
                            <input
                              type="url"
                              value={lesson.pdfUrl || ''}
                              onChange={(e) => {
                                const updated = [...lmsLessons];
                                updated[idx].pdfUrl = e.target.value;
                                setLmsLessons(updated);
                              }}
                              placeholder="https://.../worksheet.pdf"
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-[11px] font-mono"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsAddLMSModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                    >
                      Create Course
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Medium Style Customizer Modal */}
      {activeEditingStyle && (
        <AdminEditStyleModal
          isOpen={!!activeEditingStyle}
          onClose={() => setActiveEditingStyle(null)}
          styleItem={activeEditingStyle}
          pricingConfig={editablePricing}
          onSaveStyle={(updatedStyle, updatedPricing) => {
            StorageManager.updateStyle(updatedStyle);
            setAdminStyles(StorageManager.getStyles());
            if (updatedPricing) {
              setEditablePricing(updatedPricing);
              onUpdatePricingConfig(updatedPricing);
            }
            setActiveEditingStyle(null);
          }}
        />
      )}

    </div>
  );
};
