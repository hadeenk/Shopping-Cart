import React, { useState } from 'react';
import { Star, Eye, ShoppingBag, Check } from 'lucide-react';
import type { Product, ProductSize } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, selectedColor, 1);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1500);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <article
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage */}
      <div className="product-image-container" onClick={() => onQuickView(product)}>
        <img
          src={isHovered && product.secondaryImage ? product.secondaryImage : product.image}
          alt={product.title}
          className="product-main-img"
          loading="lazy"
        />

        {/* Badges */}
        <div className="product-badge-group">
          {product.badge && (
            <span className={`product-badge badge-${product.badge.toLowerCase().replace(/\s+/g, '-')}`}>
              {product.badge}
            </span>
          )}
          {hasDiscount && (
            <span className="product-badge badge-sale-percent">-{discountPercent}%</span>
          )}
        </div>

        {/* Hover Action Overlay */}
        <div className="product-overlay-actions">
          <button
            type="button"
            className="quick-view-btn"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            title="Quick view product details"
          >
            <Eye size={16} />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Meta Info */}
      <div className="product-content">
        <div className="product-category-row">
          <span className="product-category-tag">{product.category}</span>
          <div className="product-rating">
            <Star size={14} className="star-icon" fill="currentColor" />
            <span className="rating-value">{product.rating}</span>
            <span className="reviews-count">({product.reviewsCount})</span>
          </div>
        </div>

        <h3 className="product-title" onClick={() => onQuickView(product)} title={product.title}>
          {product.title}
        </h3>
        <p className="product-subtitle">{product.subtitle}</p>

        {/* Color Swatches */}
        <div className="product-options-row">
          <div className="color-swatches" aria-label="Available colors">
            {product.colors.map((color) => (
              <button
                key={color}
                type="button"
                className={`color-swatch-dot ${selectedColor === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColor(color);
                }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>

          {/* Size Selector */}
          {product.sizes.length > 1 && (
            <div className="size-selector-compact">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`size-chip-compact ${selectedSize === size ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price & Add to Cart */}
        <div className="product-footer-row">
          <div className="price-stack">
            <span className="current-price">${product.price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="original-price">${product.originalPrice?.toFixed(2)}</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={`add-to-cart-btn ${isAddedRecently ? 'added-success' : ''}`}
            disabled={!product.isAvailable}
          >
            {isAddedRecently ? (
              <>
                <Check size={16} />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
