import React from 'react';
import { MapPin, Package, ShieldCheck, ArrowRight, Tag } from 'lucide-react';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  key?: string;
  product: Product;
  onViewDetails?: (id: string) => void;
}

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-neutral-100">
        <img
          src={product.images[0] || `https://picsum.photos/seed/${product.category}/400/300`}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded uppercase tracking-wider">
            {product.category}
          </span>
          {product.certifications.length > 0 && (
            <span className="px-2 py-1 bg-amber-500 text-emerald-950 text-[10px] font-bold rounded flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Certified
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-neutral-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center text-emerald-700 font-bold">
            <span className="text-sm">$</span>
            <span className="text-xl">{product.price}</span>
            <span className="text-xs text-neutral-500 font-normal ml-1">/{product.unit}</span>
          </div>
        </div>

        <p className="text-neutral-500 text-sm line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center text-xs text-neutral-600">
            <MapPin className="w-3.5 h-3.5 mr-2 text-emerald-500" />
            <span>{product.location}</span>
          </div>
          <div className="flex items-center text-xs text-neutral-600">
            <Package className="w-3.5 h-3.5 mr-2 text-emerald-500" />
            <span>Min Order: {product.minOrderQuantity} {product.unit}</span>
          </div>
          <div className="flex items-center text-xs text-neutral-600">
            <Tag className="w-3.5 h-3.5 mr-2 text-emerald-500" />
            <span>Exporter: {product.exporterName}</span>
          </div>
        </div>

        <button
          onClick={() => onViewDetails?.(product.id)}
          className="w-full py-3 bg-neutral-900 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center group/btn"
        >
          View Details
          <ArrowRight className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
