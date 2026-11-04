import React from 'react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';
import { SearchX, RotateCcw } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onResetFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onQuickView,
  onResetFilters,
}) => {
  if (products.length === 0) {
    return (
      <div className="empty-catalog-state">
        <div className="empty-icon-wrap">
          <SearchX size={44} />
        </div>
        <h3 className="empty-title">No products match your criteria</h3>
        <p className="empty-subtitle">
          Try expanding your price range, clearing your search query, or selecting different size filters.
        </p>
        <button type="button" onClick={onResetFilters} className="empty-reset-btn">
          <RotateCcw size={16} />
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
};
