import React from 'react';
import { Search, Filter, SlidersHorizontal, ChevronDown, Check, X } from 'lucide-react';
import ProductCard from '../ProductCard';
import { Product } from '@/types';
import { PRODUCT_CATEGORIES, NIGERIAN_STATES } from '@/constants';
import { cn } from '@/lib/utils';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    exporterId: 'exp1',
    exporterName: 'Adebayo Exports Ltd',
    title: 'Premium Dried Hibiscus Flowers',
    description: 'High-quality dried hibiscus flowers, moisture < 10%, deep red color, suitable for tea and food coloring.',
    category: 'Hibiscus',
    price: 1200,
    unit: 'MT',
    minOrderQuantity: 10,
    availableQuantity: 100,
    qualityGrade: 'Grade A',
    certifications: ['ISO 9001', 'NAFDAC'],
    images: ['https://picsum.photos/seed/hibiscus/400/300'],
    location: 'Kano, Nigeria',
    status: 'available',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    exporterId: 'exp2',
    exporterName: 'Lagos Cocoa Traders',
    title: 'Fermented Cocoa Beans',
    description: 'Main crop fermented cocoa beans, well-dried, high fat content, perfect for premium chocolate production.',
    category: 'Cocoa',
    price: 2800,
    unit: 'MT',
    minOrderQuantity: 5,
    availableQuantity: 50,
    qualityGrade: 'Premium',
    certifications: ['Fairtrade'],
    images: ['https://picsum.photos/seed/cocoa/400/300'],
    location: 'Ondo, Nigeria',
    status: 'available',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    exporterId: 'exp3',
    exporterName: 'Northern Soy Connect',
    title: 'Non-GMO Yellow Soybeans',
    description: 'Organic non-GMO yellow soybeans, high protein content, cleaned and sorted for export.',
    category: 'Soybean',
    price: 850,
    unit: 'MT',
    minOrderQuantity: 20,
    availableQuantity: 500,
    qualityGrade: 'Standard',
    certifications: [],
    images: ['https://picsum.photos/seed/soybean/400/300'],
    location: 'Kaduna, Nigeria',
    status: 'available',
    createdAt: new Date().toISOString()
  }
];

export default function MarketplaceView() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedState, setSelectedState] = React.useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesState = !selectedState || product.location.includes(selectedState);
    return matchesSearch && matchesCategory && matchesState;
  });

  return (
    <div className="space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Global Marketplace</h1>
          <p className="text-neutral-500 text-sm">Browse verified agricultural products from Nigerian exporters.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-grow md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "p-2 border rounded-xl transition-all flex items-center gap-2 px-4 text-sm font-medium",
              isFilterOpen ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {isFilterOpen && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  !selectedCategory ? "bg-emerald-600 text-white shadow-md" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                )}
              >
                All
              </button>
              {PRODUCT_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    selectedCategory === cat ? "bg-emerald-600 text-white shadow-md" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Origin State</label>
            <select
              value={selectedState || ''}
              onChange={(e) => setSelectedState(e.target.value || null)}
              className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All States</option>
              {NIGERIAN_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end justify-end">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedState(null);
                setSearchQuery('');
              }}
              className="text-xs font-bold text-neutral-400 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-neutral-300">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-neutral-300" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-1">No products found</h3>
            <p className="text-neutral-500 text-sm">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
}
