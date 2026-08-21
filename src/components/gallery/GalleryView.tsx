import React, { useState, useMemo } from 'react';
import { Search, Filter, Palette, Star, ArrowUpDown, Sparkles, Image as ImageIcon, Sliders } from 'lucide-react';
import { GalleryItem, ArtworkType } from '../../types';
import { ArtworkDetailModal } from './ArtworkDetailModal';

interface GalleryViewProps {
  items?: GalleryItem[];
  galleryItems?: GalleryItem[];
  onCommissionStyle?: (style: ArtworkType) => void;
  onSelectForCommission?: (item: GalleryItem) => void;
  currentRole?: string;
  onNavigateToAdmin?: () => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  items,
  galleryItems,
  onCommissionStyle,
  onSelectForCommission,
  currentRole,
  onNavigateToAdmin,
}) => {
  const allItems = items || galleryItems || [];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFaceFilter, setSelectedFaceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);

  const handleCommission = (item: GalleryItem) => {
    if (onCommissionStyle) {
      onCommissionStyle((item.categoryId as ArtworkType) || 'pencil');
    } else if (onSelectForCommission) {
      onSelectForCommission(item);
    }
  };

  const categories = [
    { id: 'all', label: 'All Mediums' },
    { id: 'pencil', label: 'Pencil Sketch' },
    { id: 'charcoal', label: 'Charcoal' },
    { id: 'oil_canvas', label: 'Oil on Canvas' },
    { id: 'watercolor', label: 'Watercolor' },
    { id: 'color_pencil', label: 'Color Pencil' },
  ];

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      // Category match
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
        return false;
      }
      // Face filter match
      if (selectedFaceFilter === '1' && item.faceCount !== 1) return false;
      if (selectedFaceFilter === '2' && item.faceCount !== 2) return false;
      if (selectedFaceFilter === '3plus' && item.faceCount < 3) return false;
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesTags = item.tags.some(t => t.toLowerCase().includes(q));
        const matchesArtist = item.artistName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesTags && !matchesArtist) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.startingPrice - b.startingPrice;
      if (sortBy === 'price_high') return b.startingPrice - a.startingPrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.sortOrder - b.sortOrder;
    });
  }, [allItems, selectedCategory, selectedFaceFilter, searchQuery, sortBy]);

  return (
    <div className="py-8 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 animate-fadeIn">
      
      {/* Admin Quick Banner */}
      {(currentRole === 'admin' || currentRole === 'operations') && (
        <div className="mb-8 p-4 rounded-2xl bg-blue-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-800 flex items-center justify-center text-blue-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Admin Gallery CMS Mode Active</h3>
              <p className="text-xs text-blue-200">You can manage portfolio artworks, add new items, or update starting rates.</p>
            </div>
          </div>
          <button
            onClick={onNavigateToAdmin}
            className="px-5 py-2.5 bg-white text-blue-900 rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm"
          >
            Open Admin Gallery CMS
          </button>
        </div>
      )}

      {/* Gallery Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-blue-700 font-bold text-xs uppercase tracking-widest bg-blue-50 border border-blue-200/80 px-3.5 py-1.5 rounded-full">
          Curated Atelier Portfolio
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mt-3">
          Handmade Artwork Gallery
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          Explore past commissioned portraits across charcoal, graphite, watercolor, and oil. Select any artwork to commission a similar custom piece from your own photo.
        </p>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs mb-10 space-y-4">
        
        {/* Search input + Sort options */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="gallery-search-input"
              type="text"
              placeholder="Search portrait style, pet, artist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort:</span>
              <select
                id="gallery-sort-select"
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="py-1.5 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800"
              >
                <option value="featured">Featured Curations</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span>Faces:</span>
              <select
                id="gallery-face-filter-select"
                value={selectedFaceFilter}
                onChange={(e) => setSelectedFaceFilter(e.target.value)}
                className="py-1.5 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800"
              >
                <option value="all">All Subjects</option>
                <option value="1">Single Solo (1 Face)</option>
                <option value="2">Couples (2 Faces)</option>
                <option value="3plus">Family & Groups (3+ Faces)</option>
              </select>
            </div>
          </div>

        </div>

        {/* Medium Categories Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`gallery-cat-pill-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Gallery Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto">
          <Palette className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-slate-900">No artwork found</h3>
          <p className="text-xs text-slate-500 mt-1">Try broadening your search query or reset category filters.</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSelectedFaceFilter('all'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 xl:gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              id={`gallery-card-${item.id}`}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              {/* Artwork Photo & Badges */}
              <div 
                onClick={() => setActiveModalItem(item)}
                className="relative h-80 w-full overflow-hidden bg-slate-50 cursor-pointer flex items-center justify-center"
              >
                <img
                  src={item.afterImage}
                  alt={item.title}
                  className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                />

                {/* Top Badge: Category */}
                <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-slate-200 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-700">
                  {item.categoryName}
                </div>

                {/* Top Right: Face Count */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  {item.faceCount} {item.faceCount === 1 ? 'Face' : 'Faces'}
                </div>

                {/* Quick inspect overlay button */}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-4 py-2 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold rounded-xl shadow-lg">
                    View Full Art Details & Specs
                  </span>
                </div>
              </div>

              {/* Card Meta & Actions */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Artist: <strong className="text-slate-800">{item.artistName}</strong></span>
                    <div className="flex items-center text-amber-500">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="ml-1 font-bold text-slate-800">{item.rating}</span>
                    </div>
                  </div>

                  <h3 
                    onClick={() => setActiveModalItem(item)}
                    className="font-serif font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Starts at</span>
                    <span className="font-mono font-bold text-slate-900 text-base">₹{item.startingPrice}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id={`btn-details-${item.id}`}
                      onClick={() => setActiveModalItem(item)}
                      className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold"
                    >
                      Details
                    </button>
                    <button
                      id={`btn-create-similar-${item.id}`}
                      onClick={() => handleCommission(item)}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                    >
                      Create Art
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Lightbox */}
      <ArtworkDetailModal
        item={activeModalItem}
        onClose={() => setActiveModalItem(null)}
        onCommissionSimilar={(item) => {
          setActiveModalItem(null);
          handleCommission(item);
        }}
      />

    </div>
  );
};
