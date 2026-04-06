import React from 'react';
import { Search, Brain, CheckCircle2, XCircle, ExternalLink, Info, ShoppingBag } from 'lucide-react';
import { Match, Product, BuyerRequest } from '@/types';
import { cn } from '@/lib/utils';

const MOCK_MATCHES: (Match & { product: Product; request: BuyerRequest })[] = [
  {
    id: 'm1',
    buyerRequestId: 'br1',
    productId: 'p1',
    score: 92,
    breakdown: {
      quantity: 95,
      price: 90,
      quality: 100,
      location: 80
    },
    status: 'pending',
    createdAt: new Date().toISOString(),
    product: {
      id: 'p1',
      exporterId: 'exp1',
      exporterName: 'Adebayo Exports Ltd',
      title: 'Premium Dried Hibiscus Flowers',
      description: 'High-quality dried hibiscus flowers...',
      category: 'Hibiscus',
      price: 1200,
      unit: 'MT',
      minOrderQuantity: 10,
      availableQuantity: 100,
      location: 'Kano, Nigeria',
      status: 'available',
      createdAt: '',
      certifications: ['ISO'],
      images: []
    },
    request: {
      id: 'br1',
      buyerId: 'b1',
      buyerName: 'Shanghai Tea Co.',
      title: '100 MT Hibiscus for Export',
      description: 'Looking for high quality hibiscus...',
      category: 'Hibiscus',
      requiredQuantity: 100,
      unit: 'MT',
      status: 'open',
      createdAt: ''
    }
  },
  {
    id: 'm2',
    buyerRequestId: 'br2',
    productId: 'p2',
    score: 78,
    breakdown: {
      quantity: 60,
      price: 85,
      quality: 90,
      location: 70
    },
    status: 'pending',
    createdAt: new Date().toISOString(),
    product: {
      id: 'p2',
      exporterId: 'exp2',
      exporterName: 'Lagos Cocoa Traders',
      title: 'Fermented Cocoa Beans',
      description: 'Main crop fermented cocoa beans...',
      category: 'Cocoa',
      price: 2800,
      unit: 'MT',
      minOrderQuantity: 5,
      availableQuantity: 50,
      location: 'Ondo, Nigeria',
      status: 'available',
      createdAt: '',
      certifications: [],
      images: []
    },
    request: {
      id: 'br2',
      buyerId: 'b2',
      buyerName: 'Beijing Chocolate Factory',
      title: 'Premium Cocoa Beans',
      description: 'Need 50 MT of fermented cocoa...',
      category: 'Cocoa',
      requiredQuantity: 50,
      unit: 'MT',
      status: 'open',
      createdAt: ''
    }
  }
];

export default function MatchesView() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-neutral-900">AI Matching Engine</h1>
            <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full flex items-center gap-1">
              <Brain className="w-3 h-3" />
              POWERED BY AI
            </div>
          </div>
          <p className="text-neutral-500 text-sm">Automated high-quality matches based on your sourcing requirements.</p>
        </div>
      </div>

      <div className="space-y-6">
        {MOCK_MATCHES.map((match) => (
          <div key={match.id} className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 flex flex-col lg:flex-row gap-8">
              {/* Score Section */}
              <div className="flex flex-col items-center justify-center lg:w-48 border-b lg:border-b-0 lg:border-r border-neutral-100 pb-6 lg:pb-0 lg:pr-8">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-neutral-100"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 * (1 - match.score / 100)}
                      className="text-emerald-500 transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-neutral-900">{match.score}%</span>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">Match Score</span>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 w-full">
                  {Object.entries(match.breakdown).map(([key, val]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-[10px] text-neutral-400 uppercase font-bold">{key}</span>
                      <div className="h-1 w-full bg-neutral-100 rounded-full mt-1">
                        <div 
                          className="h-full bg-emerald-400 rounded-full" 
                          style={{ width: `${val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details Section */}
              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-neutral-900">Buyer Request</h3>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900">{match.request.title}</p>
                    <p className="text-xs text-neutral-500 mt-1">Buyer: {match.request.buyerName}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] font-medium rounded">
                        Qty: {match.request.requiredQuantity} {match.request.unit}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-neutral-900">Supplier Product</h3>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900">{match.product.title}</p>
                    <p className="text-xs text-neutral-500 mt-1">Supplier: {match.product.exporterName}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] font-medium rounded">
                        Price: ${match.product.price}/{match.product.unit}
                      </span>
                      <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] font-medium rounded">
                        Loc: {match.product.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Section */}
              <div className="flex flex-col justify-center gap-3 lg:w-48">
                <button className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md shadow-emerald-100 transition-all flex items-center justify-center gap-2">
                  Initiate Contact
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button className="w-full py-2.5 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-600 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                  View Full Details
                  <Info className="w-4 h-4" />
                </button>
                <button className="w-full py-2 text-neutral-400 hover:text-red-500 text-xs font-bold transition-colors">
                  Dismiss Match
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
