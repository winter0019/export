export type UserRole = 'exporter' | 'buyer' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  companyName?: string;
  phoneNumber?: string;
  location?: string;
  verified: boolean;
  createdAt: string;
  // Exporter specific
  companySize?: string;
  certifications?: string[];
  exportExperience?: string;
  // Buyer specific
  preferredPaymentMethods?: string[];
  importExperience?: string;
}

export interface Product {
  id: string;
  exporterId: string;
  exporterName: string;
  title: string;
  description: string;
  category: string;
  price: number;
  unit: string; // e.g., "MT", "kg"
  minOrderQuantity: number;
  availableQuantity: number;
  qualityGrade?: string;
  certifications: string[];
  images: string[];
  location: string;
  status: 'available' | 'sold_out' | 'draft';
  createdAt: string;
}

export interface BuyerRequest {
  id: string;
  buyerId: string;
  buyerName: string;
  title: string;
  description: string;
  category: string;
  targetPrice?: number;
  requiredQuantity: number;
  unit: string;
  qualityRequirements?: string;
  preferredLocation?: string;
  status: 'open' | 'fulfilled' | 'closed';
  createdAt: string;
}

export interface Match {
  id: string;
  buyerRequestId: string;
  productId: string;
  score: number; // 0-100
  breakdown: {
    quantity: number;
    price: number;
    quality: number;
    location: number;
  };
  status: 'pending' | 'contacted' | 'rejected';
  createdAt: string;
}
