import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  CreditCard,
  MapPin,
  CheckCircle,
  Lock,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import type { OrderDetails } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { items, subtotal, discount, shipping, tax, total, clearCart } = useCart();

  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [formData, setFormData] = useState({
    fullName: 'Alex Vance',
    email: 'alex.vance@example.com',
    address: '742 Evergreen Terrace',
    city: 'San Francisco',
    zipCode: '94107',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '888',
  });
  const [completedOrder, setCompletedOrder] = useState<OrderDetails | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
      setStep('shipping');
      setCompletedOrder(null);
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  // Fallback for browsers that do not yet support closedby="any"
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isInside =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.width;

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

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const order: OrderDetails = {
        orderId: 'AUR-' + Math.floor(100000 + Math.random() * 900000),
        items: [...items],
        subtotal,
        discount,
        shipping,
        tax,
        total,
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
        },
        placedAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setCompletedOrder(order);
      setIsProcessing(false);
      setStep('confirmation');
      clearCart();

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
        });
      } catch {
        // graceful if canvas unsupported
      }
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className="modern-dialog checkout-dialog"
      aria-labelledby="checkout-dialog-title"
      {...({ closedby: 'any' } as any)}
    >
      <div className="checkout-container">
        {/* Header */}
        <header className="checkout-header">
          <div className="checkout-title-wrap">
            <Lock size={18} className="lock-icon" />
            <h2 id="checkout-dialog-title">Secure Express Checkout</h2>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="dialog-close-btn"
            aria-label="Close checkout"
          >
            <X size={20} />
          </button>
        </header>

        {/* Stepper indicator */}
        {step !== 'confirmation' && (
          <div className="checkout-stepper">
            <div className={`step-node ${step === 'shipping' ? 'active' : 'completed'}`}>
              <div className="node-circle">1</div>
              <span>Shipping</span>
            </div>
            <div className="step-connector" />
            <div className={`step-node ${step === 'payment' ? 'active' : ''}`}>
              <div className="node-circle">2</div>
              <span>Payment</span>
            </div>
          </div>
        )}

        {/* STEP 1: Shipping Form */}
        {step === 'shipping' && (
          <form onSubmit={handleShippingSubmit} className="checkout-form">
            <div className="form-group-grid">
              <div className="form-field full-width">
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Jane Doe"
                />
              </div>

              <div className="form-field full-width">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jane@example.com"
                />
              </div>

              <div className="form-field full-width">
                <label>Shipping Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Creative Studio Blvd"
                />
              </div>

              <div className="form-field">
                <label>City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="San Francisco"
                />
              </div>

              <div className="form-field">
                <label>Postal / ZIP Code</label>
                <input
                  type="text"
                  required
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  placeholder="94107"
                />
              </div>
            </div>

            <div className="order-snapshot-bar">
              <div className="snapshot-total">
                <span>Order Total:</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
              <button type="submit" className="checkout-submit-btn">
                <span>Continue to Payment</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Payment Form */}
        {step === 'payment' && (
          <form onSubmit={handlePaymentSubmit} className="checkout-form">
            <div className="mock-payment-banner">
              <ShieldCheck size={20} className="shield-icon" />
              <div>
                <strong>Sandbox / Simulation Mode</strong>
                <p>Card numbers are pre-filled for this test demo. No real charge occurs.</p>
              </div>
            </div>

            <div className="form-group-grid">
              <div className="form-field full-width">
                <label>Card Number</label>
                <div className="card-input-wrapper">
                  <CreditCard size={18} className="card-type-icon" />
                  <input
                    type="text"
                    required
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    placeholder="4242 •••• •••• 4242"
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Expires</label>
                <input
                  type="text"
                  required
                  value={formData.cardExp}
                  onChange={(e) => setFormData({ ...formData, cardExp: e.target.value })}
                  placeholder="MM/YY"
                />
              </div>

              <div className="form-field">
                <label>Security CVC</label>
                <input
                  type="text"
                  required
                  value={formData.cardCvc}
                  onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                  placeholder="123"
                />
              </div>
            </div>

            <div className="checkout-buttons-row">
              <button
                type="button"
                onClick={() => setStep('shipping')}
                className="checkout-back-btn"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                className="checkout-submit-btn"
              >
                {isProcessing ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Pay ${total.toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Order Confirmation */}
        {step === 'confirmation' && completedOrder && (
          <div className="order-confirmation-view">
            <div className="confirmation-badge-icon">
              <CheckCircle size={52} className="check-icon" />
            </div>

            <h3 className="confirmation-title">Payment Confirmed!</h3>
            <p className="confirmation-subtitle">
              Thank you, <strong>{completedOrder.customer.fullName}</strong>. Your order{' '}
              <span className="order-id-tag">#{completedOrder.orderId}</span> has been placed.
            </p>

            <div className="order-receipt-card">
              <div className="receipt-section-title">
                <MapPin size={16} />
                <span>Shipping Destination</span>
              </div>
              <p className="receipt-address">
                {completedOrder.customer.address}, {completedOrder.customer.city},{' '}
                {completedOrder.customer.zipCode}
              </p>

              <div className="receipt-items-list">
                {completedOrder.items.map((item) => (
                  <div key={item.cartItemId} className="receipt-item-row">
                    <div className="receipt-item-left">
                      <img src={item.product.image} alt={item.product.title} />
                      <div>
                        <div className="receipt-item-title">{item.product.title}</div>
                        <div className="receipt-item-meta">
                          Qty: {item.quantity} • Size: {item.selectedSize}
                        </div>
                      </div>
                    </div>
                    <div className="receipt-item-price">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="receipt-total-row">
                <span>Total Paid:</span>
                <strong>${completedOrder.total.toFixed(2)}</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="continue-browsing-btn"
            >
              <ShoppingBag size={18} />
              <span>Back to Store</span>
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
};
