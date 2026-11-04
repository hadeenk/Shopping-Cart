import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    appliedPromo,
    applyPromo,
    removePromo,
    amountUntilFreeShipping,
    freeShippingProgress,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput);
    setPromoMessage({ text: res.message, error: !res.success });
    if (res.success) {
      setPromoInput('');
    }
  };

  const handleCheckoutClick = () => {
    closeCart();
    onProceedToCheckout();
  };

  return (
    <div className="cart-drawer-overlay" onClick={closeCart}>
      <aside
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
        aria-label="Shopping Cart Drawer"
      >
        {/* Drawer Header */}
        <header className="cart-header">
          <div className="cart-title-row">
            <ShoppingBag size={22} className="cart-header-icon" />
            <h2 className="cart-title">Your Shopping Bag</h2>
            <span className="cart-count-pill">{items.length}</span>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="cart-close-btn"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </header>

        {/* Free Shipping Meter */}
        <div className="shipping-progress-section">
          <div className="shipping-progress-text">
            {amountUntilFreeShipping > 0 ? (
              <>
                Add <strong>${amountUntilFreeShipping.toFixed(2)}</strong> more for{' '}
                <span className="free-shipping-highlight">FREE Express Shipping</span>!
              </>
            ) : (
              <span className="shipping-unlocked-msg">
                <CheckCircle2 size={16} />
                <strong>Congratulations!</strong> You unlocked FREE Express Shipping!
              </span>
            )}
          </div>
          <div className="shipping-progress-bar-track">
            <div
              className="shipping-progress-bar-fill"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="cart-items-scroll-area">
          {items.length === 0 ? (
            <div className="empty-cart-state">
              <div className="empty-cart-icon">
                <ShoppingBag size={48} />
              </div>
              <h3>Your bag is completely empty</h3>
              <p>Explore our curated releases and discover your next daily essential.</p>
              <button type="button" onClick={closeCart} className="continue-shopping-btn">
                <span>Start Shopping</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <ul className="cart-items-list">
              {items.map((item) => (
                <li key={item.cartItemId} className="cart-item-card">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="cart-item-thumb"
                  />

                  <div className="cart-item-info">
                    <div className="cart-item-top">
                      <h4 className="cart-item-title">{item.product.title}</h4>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="cart-item-remove-btn"
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="cart-item-meta">
                      <span className="cart-item-size">Size: {item.selectedSize}</span>
                      <span className="cart-meta-dot">•</span>
                      <span
                        className="cart-color-indicator"
                        style={{ backgroundColor: item.selectedColor }}
                        title={item.selectedColor}
                      />
                    </div>

                    <div className="cart-item-bottom">
                      <div className="cart-quantity-controls">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="qty-btn"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="qty-btn"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <div className="cart-item-pricing">
                        <span className="item-total-price">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="item-unit-price">
                            (${item.product.price.toFixed(2)} each)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer & Checkout Summary */}
        {items.length > 0 && (
          <footer className="cart-footer">
            {/* Promo Code Box */}
            <div className="promo-box-wrapper">
              {appliedPromo ? (
                <div className="applied-promo-chip">
                  <div className="promo-chip-info">
                    <Tag size={14} />
                    <span>
                      <strong>{appliedPromo.code}</strong> (-{appliedPromo.discountPercentage}%)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removePromo}
                    className="remove-promo-btn"
                    title="Remove coupon"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="promo-form">
                  <input
                    type="text"
                    placeholder="Promo code (try AURORA20)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="promo-input"
                  />
                  <button type="submit" className="apply-promo-btn">
                    Apply
                  </button>
                </form>
              )}
              {promoMessage && (
                <div className={`promo-status-msg ${promoMessage.error ? 'error' : 'success'}`}>
                  {promoMessage.text}
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="cart-summary-breakdown">
              <div className="summary-line">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="summary-line discount-line">
                  <span>Promo Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-line">
                <span>Estimated Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="free-shipping-text">FREE</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="summary-line">
                <span>Sales Tax (8.25%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="summary-line grand-total-line">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <div className="cart-action-buttons">
              <button
                type="button"
                onClick={handleCheckoutClick}
                className="checkout-primary-btn"
              >
                <Sparkles size={18} />
                <span>Checkout • ${total.toFixed(2)}</span>
              </button>

              <button
                type="button"
                onClick={clearCart}
                className="clear-cart-text-btn"
              >
                Clear Bag
              </button>
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
};
