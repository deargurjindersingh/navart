import React, { useState, useRef } from 'react';
import { 
  Folder, 
  FolderPlus, 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Edit, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Search, 
  Filter, 
  Plus, 
  Layers, 
  Sparkles, 
  Tag, 
  FileText, 
  Eye, 
  X,
  Palette,
  ArrowRight,
  HardDrive,
  RefreshCw
} from 'lucide-react';
import { MediaAsset, MediaFolderType, GalleryItem, ComparisonPair, ArtworkType } from '../../types';
import { StorageManager } from '../../utils/storage';

interface MediaFolderManagerProps {
  onAddGalleryItem?: (item: GalleryItem) => void;
  onAddShowcasePair?: (pair: ComparisonPair) => void;
}

const PRESET_FOLDERS: { id: MediaFolderType; label: string; icon: string; description: string }[] = [
  { id: 'gallery', label: 'Gallery Artworks (/gallery)', icon: '🖼️', description: 'Finished handcrafted portraits for customer portfolio' },
  { id: 'showcase', label: 'Before & After Showcases (/showcase)', icon: '🌓', description: 'Customer original reference photos and finished artwork sets' },
  { id: 'styles', label: 'Medium Styles & Samples (/styles)', icon: '🎨', description: 'Technique sample previews for Pencil, Charcoal, Oil, etc.' },
  { id: 'banners', label: 'Hero & Background Banners (/banners)', icon: '🌄', description: 'Header graphics, workshop backgrounds, and marketing visuals' },
  { id: 'artists', label: 'Artist & Staff Avatars (/artists)', icon: '🧑‍🎨', description: 'Master portraitist profile pictures and atelier team photos' },
  { id: 'reviews', label: 'Customer Reviews & Proofs (/reviews)', icon: '💬', description: 'Customer unboxing photos, framed snapshots, and proofs' },
  { id: 'general', label: 'General Assets (/general)', icon: '📁', description: 'Uncategorized studio media and miscellaneous graphics' },
];

export const MediaFolderManager: React.FC<MediaFolderManagerProps> = ({
  onAddGalleryItem,
  onAddShowcasePair,
}) => {
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(() => StorageManager.getMediaAssets());
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedAssetId, setCopiedAssetId] = useState<string | null>(null);
  
  // Custom Folders
  const [customFolders, setCustomFolders] = useState<string[]>(['wedding', 'pets', 'vintage_restorations']);
  const [newFolderName, setNewFolderName] = useState('');
  const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTargetFolder, setUploadTargetFolder] = useState<string>('gallery');
  const [uploadName, setUploadName] = useState('');
  const [uploadImageUrl, setUploadImageUrl] = useState('');
  const [uploadTags, setUploadTags] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview Modal
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);

  // Edit Modal State
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);

  // Import / Export State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const importFileInputRef = useRef<HTMLInputElement>(null);

  // Filtered Assets
  const filteredAssets = mediaAssets.filter((asset) => {
    if (selectedFolder !== 'all' && asset.folder !== selectedFolder) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = asset.name.toLowerCase().includes(q);
      const matchesFolder = asset.folder.toLowerCase().includes(q);
      const matchesTags = asset.tags?.some(t => t.toLowerCase().includes(q));
      const matchesDesc = asset.description?.toLowerCase().includes(q);
      if (!matchesName && !matchesFolder && !matchesTags && !matchesDesc) return false;
    }
    return true;
  });

  const handleCopyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedAssetId(asset.id);
    setTimeout(() => setCopiedAssetId(null), 2500);
  };

  const handleCreateCustomFolder = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newFolderName.trim().toLowerCase().replace(/\s+/g, '_');
    if (!clean || customFolders.includes(clean)) return;
    setCustomFolders([...customFolders, clean]);
    setSelectedFolder(clean);
    setNewFolderName('');
    setIsAddFolderModalOpen(false);
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WEBP, SVG).');
      return;
    }
    setUploadFile(file);
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
    setUploadName(file.name.replace(/\.[^/.]+$/, ''));
    
    // Store clean folder path reference instead of base64
    const folderPath = `/images/${uploadTargetFolder}/${cleanName}`;
    setUploadImageUrl(folderPath);

    // Use object URL temporarily for immediate modal preview
    const objectUrl = URL.createObjectURL(file);
    // We can also store/display objectUrl temporarily if needed
  };

  const handleSaveUploadedAsset = () => {
    if (!uploadImageUrl.trim()) {
      alert('Please upload an image file or provide a valid Image URL.');
      return;
    }
    const newAsset: MediaAsset = {
      id: `asset-${Date.now()}`,
      name: uploadName.trim() ? `${uploadName.trim()}.jpg` : `photo_${Date.now()}.jpg`,
      url: uploadImageUrl,
      folder: uploadTargetFolder,
      fileSize: uploadFile ? `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.5 MB',
      dimensions: '2400 x 3200 px',
      uploadedAt: new Date().toISOString(),
      tags: uploadTags.split(',').map(t => t.trim()).filter(Boolean),
      description: uploadDescription.trim() || 'Uploaded media asset stored in folder /' + uploadTargetFolder,
    };
    const updated = [newAsset, ...mediaAssets];
    setMediaAssets(updated);
    StorageManager.saveMediaAssets(updated);
    setIsUploadModalOpen(false);
    setUploadName('');
    setUploadImageUrl('');
    setUploadTags('');
    setUploadDescription('');
    setUploadFile(null);
  };

  const handleDeleteAsset = (id: string) => {
    const updated = mediaAssets.filter(a => a.id !== id);
    setMediaAssets(updated);
    StorageManager.saveMediaAssets(updated);
  };

  const handleSaveEditedAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;
    const updated = mediaAssets.map(a => a.id === editingAsset.id ? editingAsset : a);
    setMediaAssets(updated);
    StorageManager.saveMediaAssets(updated);
    setEditingAsset(null);
  };

  // Export Complete Studio Catalog + Media Folders
  const handleExportJSON = () => {
    const jsonStr = StorageManager.exportCompleteCatalogJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `artisan_studio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImportJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const res = StorageManager.importCompleteCatalogJSON(e.target.result as string);
        if (res.success) {
          setImportStatus('✅ Restored successfully! Reloading...');
          setTimeout(() => window.location.reload(), 1200);
        } else {
          setImportStatus('❌ ' + res.message);
        }
      }
    };
    reader.readAsText(file);
  };

  // Quick Action: Send to Gallery CMS
  const handleSendToGallery = (asset: MediaAsset) => {
    if (!onAddGalleryItem) {
      alert('Gallery item creation active in Gallery CMS tab.');
      return;
    }
    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: asset.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      slug: asset.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      categoryId: (asset.tags?.[0] as ArtworkType) || 'pencil',
      categoryName: (asset.tags?.[0] || 'pencil').toUpperCase(),
      style: 'Classical Atelier Handcraft',
      description: asset.description || 'Handcrafted portrait piece curated from studio media folder.',
      images: [asset.url],
      afterImage: asset.url,
      featured: true,
      sortOrder: 1,
      startingPrice: 1499,
      artistName: 'Elena Rostova',
      faceCount: 1,
      mediumDetails: 'Archival Cotton Canvas',
      rating: 5.0,
      reviewCount: 1,
      tags: asset.tags || ['Handmade', 'Portrait'],
    };
    onAddGalleryItem(newItem);
    alert(`🎉 Added "${newItem.title}" from folder /${asset.folder} to Public Gallery CMS!`);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-fadeIn">
      
      {/* Header & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1.5">
            <HardDrive className="w-3.5 h-3.5 text-indigo-600" />
            Organized Media Asset & Folder Storage
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Studio Media Folders & Asset CMS
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Store and organize all artwork photos across dedicated folders (`/gallery`, `/showcase`, `/styles`, `/banners`). Export & restore backups so your custom photos are never lost when re-publishing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Backup & Restore (JSON)</span>
          </button>

          <button
            onClick={() => {
              setUploadTargetFolder(selectedFolder === 'all' ? 'gallery' : selectedFolder);
              setIsUploadModalOpen(true);
            }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photo to Folder</span>
          </button>
        </div>
      </div>

      {/* Folders Navigation Bar & Filters */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Folder className="w-4 h-4 text-blue-600" />
            Storage Directories & Folders
          </span>

          <button
            onClick={() => setIsAddFolderModalOpen(true)}
            className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Custom Folder</span>
          </button>
        </div>

        {/* Folder Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedFolder('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
              selectedFolder === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <span>📁 All Files</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-mono font-bold">
              {mediaAssets.length}
            </span>
          </button>

          {PRESET_FOLDERS.map((folder) => {
            const count = mediaAssets.filter(a => a.folder === folder.id).length;
            const isSelected = selectedFolder === folder.id;
            return (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <span>{folder.icon}</span>
                <span>{folder.label.split(' ')[0]}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}

          {customFolders.map((cFolder) => {
            const count = mediaAssets.filter(a => a.folder === cFolder).length;
            const isSelected = selectedFolder === cFolder;
            return (
              <button
                key={cFolder}
                onClick={() => setSelectedFolder(cFolder)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-200'
                }`}
              >
                <span>📁</span>
                <span>/{cFolder}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${isSelected ? 'bg-purple-700 text-white' : 'bg-purple-200 text-purple-800'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Asset Count Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search filename, folder, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{filteredAssets.length}</span> assets in folder <span className="font-mono text-blue-700 font-bold">/{selectedFolder}</span>
        </div>
      </div>

      {/* Assets Grid */}
      {filteredAssets.length === 0 ? (
        <div className="py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Folder className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-700 text-sm">No photos found in folder /{selectedFolder}</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Upload your custom photos into this directory or choose another folder from the tabs above.
          </p>
          <button
            onClick={() => {
              setUploadTargetFolder(selectedFolder === 'all' ? 'gallery' : selectedFolder);
              setIsUploadModalOpen(true);
            }}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photo Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Image Frame Preview */}
              <div className="relative aspect-4/3 bg-slate-900 overflow-hidden flex items-center justify-center">
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-full object-contain pointer-events-none group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Folder Tag Badge */}
                <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-lg font-mono font-bold flex items-center gap-1">
                  <Folder className="w-3 h-3 text-sky-400" />
                  <span>/{asset.folder}</span>
                </div>

                {/* Dimensions Badge */}
                {asset.dimensions && (
                  <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-md text-slate-300 text-[10px] px-2 py-1 rounded-lg font-mono">
                    {asset.dimensions}
                  </div>
                )}

                {/* Quick Hover Action Bar */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                  <button
                    onClick={() => setPreviewAsset(asset)}
                    className="p-2.5 rounded-xl bg-white/90 hover:bg-white text-slate-900 transition-transform hover:scale-110 shadow-lg"
                    title="View Full Resolution"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopyUrl(asset)}
                    className="p-2.5 rounded-xl bg-white/90 hover:bg-white text-slate-900 transition-transform hover:scale-110 shadow-lg"
                    title="Copy Image URL"
                  >
                    {copiedAssetId === asset.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleSendToGallery(asset)}
                    className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-transform hover:scale-110 shadow-lg"
                    title="Add to Gallery Portfolio CMS"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Asset Metadata & Footer */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs font-mono truncate" title={asset.name}>
                    {asset.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                    {asset.description || 'Studio media photo.'}
                  </p>

                  {/* Tags */}
                  {asset.tags && asset.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {asset.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-slate-400">
                    {asset.fileSize || '1.5 MB'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingAsset(asset)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Metadata & Folder"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAsset(asset.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete from Folder"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-fadeIn my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-lg">Upload Photo to Folder</h3>
                  <p className="text-xs text-slate-500">Save custom photo into organized studio directories</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target Folder Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Target Directory / Folder</label>
              <select
                value={uploadTargetFolder}
                onChange={(e) => setUploadTargetFolder(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {PRESET_FOLDERS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.icon} /{f.id} — {f.label}
                  </option>
                ))}
                {customFolders.map((cf) => (
                  <option key={cf} value={cf}>
                    📁 /{cf} — Custom Folder
                  </option>
                ))}
              </select>
            </div>

            {/* Drag and Drop Dropzone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                isDragOver 
                  ? 'border-blue-500 bg-blue-50/60' 
                  : uploadImageUrl 
                    ? 'border-emerald-300 bg-emerald-50/40' 
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
              />

              {uploadImageUrl ? (
                <div className="space-y-3">
                  <div className="h-32 w-full rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
                    <img src={uploadImageUrl} alt="Preview" className="h-full w-full object-contain" />
                  </div>
                  <div className="text-xs text-emerald-700 font-bold flex items-center justify-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Image Selected: {uploadName || 'custom_upload.jpg'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="text-xs text-blue-600 hover:underline font-bold"
                  >
                    Change photo
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="text-xs font-bold text-slate-700">
                    Click to browse or drag & drop photo here
                  </div>
                  <p className="text-[11px] text-slate-400">
                    High-res JPEG, PNG, WEBP supported
                  </p>
                </div>
              )}
            </div>

            {/* Direct Image URL input */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Or Paste Direct Image Web URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={uploadImageUrl}
                onChange={(e) => setUploadImageUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Filename / Title</label>
                <input
                  type="text"
                  placeholder="e.g. classical_portrait_v1"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  placeholder="pencil, portrait, anniversary"
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Description / Notes</label>
              <textarea
                rows={2}
                placeholder="Details about this artwork piece or photo..."
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveUploadedAsset}
                disabled={!uploadImageUrl.trim()}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
              >
                Save into /{uploadTargetFolder}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE CUSTOM FOLDER MODAL */}
      {isAddFolderModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form 
            onSubmit={handleCreateCustomFolder}
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-fadeIn"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-purple-600" />
                <h3 className="font-serif font-bold text-slate-900 text-lg">Create Custom Folder</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddFolderModalOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 text-slate-400 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Folder Name / Path</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">/</span>
                <input
                  type="text"
                  placeholder="e.g. portraits, wedding_2026, pets"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Names are automatically formatted to lowercase alphanumeric.</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddFolderModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newFolderName.trim()}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Create Directory
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT ASSET MODAL */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form 
            onSubmit={handleSaveEditedAsset}
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-fadeIn"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-600" />
                <h3 className="font-serif font-bold text-slate-900 text-lg">Edit Asset Metadata</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingAsset(null)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 text-slate-400 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Asset Filename</label>
              <input
                type="text"
                value={editingAsset.name}
                onChange={(e) => setEditingAsset({ ...editingAsset, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Target Folder</label>
              <select
                value={editingAsset.folder}
                onChange={(e) => setEditingAsset({ ...editingAsset, folder: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {PRESET_FOLDERS.map((f) => (
                  <option key={f.id} value={f.id}>
                    /{f.id} — {f.label}
                  </option>
                ))}
                {customFolders.map((cf) => (
                  <option key={cf} value={cf}>
                    /{cf} — Custom
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Image URL</label>
              <input
                type="text"
                value={editingAsset.url}
                onChange={(e) => setEditingAsset({ ...editingAsset, url: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
              <textarea
                rows={2}
                value={editingAsset.description || ''}
                onChange={(e) => setEditingAsset({ ...editingAsset, description: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingAsset(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FULLSCREEN PREVIEW MODAL */}
      {previewAsset && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewAsset(null)}
        >
          <div 
            className="bg-slate-900 text-white rounded-3xl p-6 max-w-3xl w-full border border-slate-800 shadow-2xl space-y-4 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold text-sky-400 uppercase">/{previewAsset.folder}</span>
                <h3 className="font-bold text-base">{previewAsset.name}</h3>
              </div>
              <button
                onClick={() => setPreviewAsset(null)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-[440px] w-full rounded-2xl bg-black flex items-center justify-center overflow-hidden">
              <img src={previewAsset.url} alt={previewAsset.name} className="max-h-full max-w-full object-contain" />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-400 font-mono">
                Size: {previewAsset.fileSize || '1.5 MB'} | Dimensions: {previewAsset.dimensions || '2400 x 3200 px'}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyUrl(previewAsset)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedAssetId === previewAsset.id ? 'Copied!' : 'Copy URL'}</span>
                </button>
                <button
                  onClick={() => {
                    handleSendToGallery(previewAsset);
                    setPreviewAsset(null);
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Use in Gallery Portfolio CMS</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BACKUP & RESTORE MODAL (JSON EXPORT / IMPORT) */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 space-y-6 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-lg">Studio Backup & Asset Portability</h3>
                  <p className="text-xs text-slate-500">Prevent losing custom photos when re-publishing or switching devices</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsExportModalOpen(false);
                  setImportStatus(null);
                }}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Export Section */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-blue-950 flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-600" />
                  Export All Photos & Studio Catalog (.JSON)
                </h4>
                <span className="text-[10px] font-mono bg-blue-200 text-blue-900 px-2 py-0.5 rounded font-bold">
                  {mediaAssets.length} Assets
                </span>
              </div>
              <p className="text-xs text-blue-800">
                Downloads a single portable `.json` file containing all folder media assets, gallery portfolio artworks, before/after showcases, dynamic pricing rules, and styles.
              </p>
              <button
                onClick={handleExportJSON}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Studio Backup Package (.JSON)</span>
              </button>
            </div>

            {/* Import Section */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-3">
              <h4 className="font-bold text-sm text-emerald-950 flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-600" />
                Restore Studio from Backup (.JSON)
              </h4>
              <p className="text-xs text-emerald-800">
                Upload your saved `.json` backup file to immediately restore all custom photos, folders, and catalog settings on this device or published domain.
              </p>
              
              <input
                ref={importFileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleImportJSON(e.target.files[0]);
                }}
              />

              <button
                onClick={() => importFileInputRef.current?.click()}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload & Restore Studio (.JSON)</span>
              </button>

              {importStatus && (
                <div className="p-2.5 rounded-xl bg-white border border-emerald-200 text-xs font-medium text-center">
                  {importStatus}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsExportModalOpen(false);
                  setImportStatus(null);
                }}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
