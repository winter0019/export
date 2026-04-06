import { Product, BuyerRequest, Match } from '@/types';

export function calculateMatchScore(product: Product, request: BuyerRequest): Match['breakdown'] {
  // 40% quantity, 30% price, 20% quality, 10% location
  
  // Quantity Match (40%)
  // If product has more than or equal to required, 100%. 
  // If less, proportional.
  const quantityScore = product.availableQuantity >= request.requiredQuantity 
    ? 100 
    : (product.availableQuantity / request.requiredQuantity) * 100;

  // Price Match (30%)
  // If no target price, 100%. 
  // If product price <= target price, 100%.
  // If product price > target price, penalize.
  let priceScore = 100;
  if (request.targetPrice) {
    if (product.price <= request.targetPrice) {
      priceScore = 100;
    } else {
      const diff = (product.price - request.targetPrice) / request.targetPrice;
      priceScore = Math.max(0, 100 - (diff * 100));
    }
  }

  // Quality Match (20%)
  // Simple check for now: if category matches, base 80%. 
  // If certifications exist, 100%.
  let qualityScore = 80;
  if (product.certifications.length > 0) {
    qualityScore = 100;
  }

  // Location Match (10%)
  // For now, base 80% if same category.
  const locationScore = 80;

  return {
    quantity: Math.round(quantityScore),
    price: Math.round(priceScore),
    quality: Math.round(qualityScore),
    location: Math.round(locationScore)
  };
}

export function getWeightedTotalScore(breakdown: Match['breakdown']): number {
  return Math.round(
    (breakdown.quantity * 0.4) + 
    (breakdown.price * 0.3) + 
    (breakdown.quality * 0.2) + 
    (breakdown.location * 0.1)
  );
}

export function findMatches(request: BuyerRequest, products: Product[]): Match[] {
  return products
    .filter(p => p.category === request.category && p.status === 'available')
    .map(product => {
      const breakdown = calculateMatchScore(product, request);
      const score = getWeightedTotalScore(breakdown);
      
      return {
        id: `match_${request.id}_${product.id}`,
        buyerRequestId: request.id,
        productId: product.id,
        score,
        breakdown,
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      };
    })
    .filter(match => match.score >= 50) // Only show matches with 50%+ score
    .sort((a, b) => b.score - a.score);
}
