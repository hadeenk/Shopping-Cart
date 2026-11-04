import React, { useEffect, useRef, useState } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Truck, RotateCcw, Check } from 'lucide-react';
import type { Product, ProductSize } from '../types';
import { useCart } from '../context/CartContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState<ProductSize>('One Size');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]);
      setSelectedColor(product.colors[0]);
      setQuantity(1);
      setActiveImage(product.image);
      setIsAdded(false);

      const dialog = dialogRef.current;
      if (dialog && !dialog.open) {
        dialog.showModal();
      }
    } else {
      const dialog = dialogRef.current;
      if (dialog && dialog.open) {
        dialog.close();
      }
    }
  }, [product]);

  // Fallback for browsers that do not yet support closedby="any"
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleBackdropClick = (event: MouseEvent) => {
      // 1. When clicking backdrop, target is the dialog element itself
      if (event.target !== dialog) return;

      // 2. Check if click coordinates fall within dialog's bounding rect
      const rect = dialog.getBoundingClientRect();
      const isInside =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isInside) {
        dialog.close();
      }
    };

    const handleNativeClose = () => {
      onClose();
    };

    if (!('closedBy' in HTMLDialogElement.prototype)) {
      dialog.addEventListener('click', handleBackdropClick);
    }
    dialog.addEventListener('close', handleNativeClose);

    return () => {
      if (!('closedBy' in HTMLDialogElement.prototype)) {
        dialog.removeEventListener('click', handleBackdropClick);
      }
      dialog.removeEventListener('close', handleNativeClose);
    };
  }, [onClose]);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      dialogRef.current?.close();
    }, 1200);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <dialog
      ref={dialogRef}
      className="modern-dialog quickview-dialog"
      aria-labelledby="quickview-title"
      {...({ closedby: 'any' } as any)}
    >
      <div className="quickview-container">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="dialog-close-btn"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        <div className="quickview-grid">
          {/* Gallery Column */}
          <div className="quickview-gallery">
            <div className="quickview-main-image-wrap">
              <img
                src={activeImage}
                alt={product.title}
                className="quickview-main-img"
              />
              {product.badge && (
                <span className="quickview-badge">{product.badge}</span>
              )}
            </div>

            {product.secondaryImage && (
              <div className="quickview-thumbnails">
                <button
                  type="button"
                  className={`thumbnail-btn ${activeImage === product.image ? 'active' : ''}`}
                  onClick={() => setActiveImage(product.image)}
                >
                  <img src={product.image} alt="Thumbnail 1" />
                </button>
                <button
                  type="button"
                  className={`thumbnail-btn ${activeImage === product.secondaryImage ? 'active' : ''}`}
                  onClick={() => setActiveImage(product.secondaryImage!)}
                >
                  <img src={product.secondaryImage} alt="Thumbnail 2" />
                </button>
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="quickview-info">
            <div className="quickview-category">{product.category}</div>
            <h2 id="quickview-title" className="quickview-title">
              {product.title}
            </h2>

            {/* Rating */}
            <div className="quickview-rating-row">
              <div className="stars-cluster">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className={i < Math.floor(product.rating) ? 'star-filled' : 'star-muted'}
                    fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="rating-score">{product.rating}</span>
              <span className="rating-divider">•</span>
              <span className="reviews-text">{product.reviewsCount} verified reviews</span>
            </div>

            {/* Price */}
            <div className="quickview-price-row">
              <span className="qv-current-price">${product.price.toFixed(2)}</span>
              {hasDiscount && (
                <>
                  <span className="qv-original-price">${product.originalPrice?.toFixed(2)}</span>
                  <span className="qv-savings-pill">
                    Save ${(product.originalPrice! - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            <p className="quickview-description">{product.description}</p>

            {/* Key feature list */}
            <ul className="quickview-features-list">
              {product.details.map((detail, idx) => (
                <li key={idx}>
                  <span className="feature-bullet" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>

            {/* Color Swatches */}
            <div className="option-section">
              <div className="option-label">
                <span>Color:</span>
                <span className="option-selected-val">{selectedColor}</span>
              </div>
              <div className="color-swatches-qv">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`qv-color-dot ${selectedColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Color option ${color}`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div className="option-section">
                <div className="option-label">
                  <span>Size / Variant:</span>
                  <span className="option-selected-val">{selectedSize}</span>
                </div>
                <div className="qv-sizes-row">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`qv-size-chip ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Bag */}
            <div className="qv-actions-row">
              <div className="quantity-counter">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="quantity-num">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className={`qv-add-btn ${isAdded ? 'success' : ''}`}
                onClick={handleAddToCart}
                disabled={!product.isAvailable}
              >
                {isAdded ? (
                  <>
                    <Check size={18} />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>Add to Bag • ${(product.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>

            {/* Trust Assurances */}
            <div className="quickview-trust-grid">
              <div className="trust-item">
                <Truck size={16} />
                <span>Free shipping over $99</span>
              </div>
              <div className="trust-item">
                <RotateCcw size={16} />
                <span>30-Day Hassle-Free Returns</span>
              </div>
              <div className="trust-item">
                <ShieldCheck size={16} />
                <span>2-Year Full Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};
