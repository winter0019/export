import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Package, DollarSign, MapPin, Tag, FileText, Image as ImageIcon, Plus, X } from 'lucide-react';
import { PRODUCT_CATEGORIES, UNITS, NIGERIAN_STATES } from '@/constants';
import { cn } from '@/lib/utils';

const productSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  unit: z.string().min(1, "Please select a unit"),
  minOrderQuantity: z.number().min(1, "Minimum order must be at least 1"),
  availableQuantity: z.number().min(1, "Available quantity must be at least 1"),
  location: z.string().min(1, "Please select a location"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductForm() {
  const [images, setImages] = React.useState<string[]>([]);
  const [certifications, setCertifications] = React.useState<string[]>([]);
  const [newCert, setNewCert] = React.useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      unit: 'MT',
      minOrderQuantity: 1,
      availableQuantity: 10,
    }
  });

  const onSubmit = async (data: ProductFormValues) => {
    console.log('Submitting product:', { ...data, images, certifications });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('Product listed successfully!');
  };

  const addCertification = () => {
    if (newCert.trim()) {
      setCertifications([...certifications, newCert.trim()]);
      setNewCert('');
    }
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden">
      <div className="bg-emerald-900 px-8 py-10 text-white">
        <h2 className="text-3xl font-bold tracking-tight">List New Product</h2>
        <p className="text-emerald-100 mt-2">Provide detailed information to attract high-quality Chinese buyers.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
        {/* Basic Info */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Product Title</label>
              <input
                {...register('title')}
                className={cn(
                  "w-full px-4 py-3 bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all",
                  errors.title ? "border-red-300" : "border-neutral-200"
                )}
                placeholder="e.g., Premium Grade A Dried Hibiscus Flowers"
              />
              {errors.title && <p className="mt-1 text-xs text-red-500 font-medium">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Description</label>
              <textarea
                {...register('description')}
                rows={4}
                className={cn(
                  "w-full px-4 py-3 bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all",
                  errors.description ? "border-red-300" : "border-neutral-200"
                )}
                placeholder="Describe quality, moisture content, packaging, and other specifications..."
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
              <label className="block text-sm font-bold text-neutral-700 mb-2">Origin Location</label>
              <select
                {...register('location')}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select State</option>
                {NIGERIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}, Nigeria</option>
                ))}
              </select>
              {errors.location && <p className="mt-1 text-xs text-red-500 font-medium">{errors.location.message}</p>}
            </div>
          </div>
        </div>

        <hr className="border-neutral-100" />

        {/* Pricing & Quantity */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Pricing & Logistics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Price (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  className="w-full pl-8 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="0.00"
                />
              </div>
              {errors.price && <p className="mt-1 text-xs text-red-500 font-medium">{errors.price.message}</p>}
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
              <label className="block text-sm font-bold text-neutral-700 mb-2">Min Order</label>
              <input
                type="number"
                {...register('minOrderQuantity', { valueAsNumber: true })}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <hr className="border-neutral-100" />

        {/* Certifications & Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Certifications
            </h3>
            <div className="flex gap-2">
              <input
                value={newCert}
                onChange={(e) => setNewCert(e.target.value)}
                className="flex-grow px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g., ISO 9001, NAFDAC"
              />
              <button
                type="button"
                onClick={addCertification}
                className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert, i) => (
                <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-2">
                  {cert}
                  <button onClick={() => removeCertification(i)} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald-600" />
              Product Images
            </h3>
            <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer group">
              <ImageIcon className="w-10 h-10 text-neutral-300 mx-auto mb-2 group-hover:text-emerald-500 transition-colors" />
              <p className="text-sm text-neutral-500">Click to upload or drag and drop</p>
              <p className="text-[10px] text-neutral-400 mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-grow py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 transition-all disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Publish Product Listing"
            )}
          </button>
          <button
            type="button"
            className="px-8 py-4 bg-white border border-neutral-200 text-neutral-600 font-bold rounded-2xl hover:bg-neutral-50 transition-all"
          >
            Save Draft
          </button>
        </div>
      </form>
    </div>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
