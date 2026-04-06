import React from 'react';
import { Search, Filter, SlidersHorizontal, ChevronDown, Check, X } from 'lucide-react';
import ProductCard from '../ProductCard';
import { Product } from '@/types';
import { PRODUCT_CATEGORIES, NIGERIAN_STATES } from '@/constants';
import { cn } from '@/lib/utils';

import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function MarketplaceView() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedState, setSelectedState] = React.useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  React.useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesState = !selectedState || product.location.includes(selectedState);
    return matchesSearch && matchesCategory && matchesState;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
            <ProductCard 
              key={product.id} 
              product={product} 
              onViewDetails={() => setSelectedProduct(product)}
            />
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

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95">
            <div className="md:w-1/2 h-64 md:h-auto relative bg-neutral-100">
              <img
                src={selectedProduct.images[0]}
                alt={selectedProduct.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 left-4 p-2 bg-white/80 hover:bg-white rounded-full text-neutral-900 md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="md:w-1/2 p-8 overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-wider mb-2 inline-block">
                    {selectedProduct.category}
                  </span>
                  <h2 className="text-2xl font-bold text-neutral-900">{selectedProduct.title}</h2>
                </div>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 hover:bg-neutral-100 rounded-full text-neutral-400 hidden md:block"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center text-emerald-700 font-bold text-3xl mb-6">
                <span className="text-xl mr-1">$</span>
                {selectedProduct.price}
                <span className="text-sm text-neutral-500 font-normal ml-2">per {selectedProduct.unit}</span>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 mb-2 uppercase tracking-wider">Description</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{selectedProduct.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase">Min Order</p>
                    <p className="text-sm font-bold text-neutral-900">{selectedProduct.minOrderQuantity} {selectedProduct.unit}</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase">Location</p>
                    <p className="text-sm font-bold text-neutral-900">{selectedProduct.location}</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase">Exporter</p>
                    <p className="text-sm font-bold text-neutral-900">{selectedProduct.exporterName}</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase">Status</p>
                    <p className="text-sm font-bold text-emerald-600 capitalize">{selectedProduct.status}</p>
                  </div>
                </div>

                {selectedProduct.certifications.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 mb-2 uppercase tracking-wider">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.certifications.map((cert, i) => (
                        <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full border border-amber-100 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-6 flex gap-3">
                  <button className="flex-grow py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 transition-all">
                    Contact Exporter
                  </button>
                  <button className="px-6 py-4 bg-white border border-neutral-200 text-neutral-600 font-bold rounded-2xl hover:bg-neutral-50 transition-all">
                    Inquiry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
