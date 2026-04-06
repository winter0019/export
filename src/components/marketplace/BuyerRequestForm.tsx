import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShoppingBag, DollarSign, MapPin, Tag, FileText, Plus, X, Brain } from 'lucide-react';
import { PRODUCT_CATEGORIES, UNITS, CHINESE_PROVINCES } from '@/constants';
import { cn } from '@/lib/utils';

const requestSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  targetPrice: z.number().optional(),
  requiredQuantity: z.number().min(1, "Quantity must be at least 1"),
  unit: z.string().min(1, "Please select a unit"),
  preferredLocation: z.string().optional(),
  qualityRequirements: z.string().optional(),
});

type RequestFormValues = z.infer<typeof requestSchema>;

export default function BuyerRequestForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      unit: 'MT',
      requiredQuantity: 10,
    }
  });

  const onSubmit = async (data: RequestFormValues) => {
    console.log('Submitting sourcing request:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('Sourcing request posted! Our AI matching engine is now scanning for suppliers.');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden">
      <div className="bg-emerald-900 px-8 py-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-3xl font-bold tracking-tight">Post Sourcing Request</h2>
            <div className="px-2 py-0.5 bg-emerald-800 text-emerald-300 text-[10px] font-bold rounded-full flex items-center gap-1 border border-emerald-700">
              <Brain className="w-3 h-3" />
              AI MATCHING ENABLED
            </div>
          </div>
          <p className="text-emerald-100">Tell us what you need, and we'll find the best Nigerian exporters for you.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
        {/* Basic Info */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Requirement Details
          </h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Request Title</label>
              <input
                {...register('title')}
                className={cn(
                  "w-full px-4 py-3 bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all",
                  errors.title ? "border-red-300" : "border-neutral-200"
                )}
                placeholder="e.g., Sourcing 100 MT of Dried Hibiscus for Shanghai Port"
              />
              {errors.title && <p className="mt-1 text-xs text-red-500 font-medium">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Detailed Specifications</label>
              <textarea
                {...register('description')}
                rows={4}
                className={cn(
                  "w-full px-4 py-3 bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all",
                  errors.description ? "border-red-300" : "border-neutral-200"
                )}
                placeholder="Describe your quality requirements, moisture levels, packaging needs, etc..."
              />
              {errors.description && <p className="mt-1 text-xs text-red-500 font-medium">{errors.description.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Category</label>
              <select
                {...register('category')}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select Category</option>
                {PRODUCT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-red-500 font-medium">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Delivery Province (China)</label>
              <select
                {...register('preferredLocation')}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select Province</option>
                {CHINESE_PROVINCES.map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <hr className="border-neutral-100" />

        {/* Quantity & Price */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            Quantity & Target Price
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Required Quantity</label>
              <input
                type="number"
                {...register('requiredQuantity', { valueAsNumber: true })}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.requiredQuantity && <p className="mt-1 text-xs text-red-500 font-medium">{errors.requiredQuantity.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Unit</label>
              <select
                {...register('unit')}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {UNITS.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Target Price (USD/Unit)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  {...register('targetPrice', { valueAsNumber: true })}
                  className="w-full pl-8 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-grow py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Post Sourcing Request
              </>
            )}
          </button>
          <button
            type="button"
            className="px-8 py-4 bg-white border border-neutral-200 text-neutral-600 font-bold rounded-2xl hover:bg-neutral-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
