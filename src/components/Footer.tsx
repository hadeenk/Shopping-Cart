import React from 'react';
import { Sparkles, ShieldCheck, Truck, RefreshCw, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-wrapper">
      {/* Trust Banner */}
      <div className="trust-banner-bar">
        <div className="trust-grid-container">
          <div className="trust-card">
            <Truck size={24} className="trust-icon" />
            <div>
              <h4>Free Express Shipping</h4>
              <p>On all domestic orders over $99</p>
            </div>
          </div>

          <div className="trust-card">
            <RefreshCw size={24} className="trust-icon" />
            <div>
              <h4>30-Day Effortless Returns</h4>
              <p>No questions asked return policy</p>
            </div>
          </div>

          <div className="trust-card">
            <ShieldCheck size={24} className="trust-icon" />
            <div>
              <h4>2-Year Full Hardware Warranty</h4>
              <p>Craftsmanship guaranteed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-main-container">
        <div className="footer-brand-col">
          <div className="footer-logo">
            <Sparkles size={20} className="footer-sparkle" />
            <span>AURORA STORE</span>
          </div>
          <p className="footer-bio">
            Engineered tools, ergonomic desk objects, and artisanal wearables crafted for modern creators, developers, and thinkers.
          </p>
          <div className="newsletter-box">
            <input
              type="email"
              placeholder="Enter your email for 15% off..."
              className="newsletter-input"
            />
            <button type="button" className="newsletter-btn">
              Join
            </button>
          </div>
        </div>

        <div className="footer-links-group">
          <div className="footer-col">
            <h5>Categories</h5>
            <ul>
              <li><a href="#audio">Audio & Spatial Acoustics</a></li>
              <li><a href="#wearables">Precision Watches</a></li>
              <li><a href="#desk">Keyboards & Workspace</a></li>
              <li><a href="#apparel">Merino & Heavyweight Knit</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Company</h5>
            <ul>
              <li><a href="#about">About Aurora</a></li>
              <li><a href="#sustainability">Sustainable Craft</a></li>
              <li><a href="#press">Editorial Press</a></li>
              <li><a href="#careers">Careers</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Customer Care</h5>
            <ul>
              <li><a href="#shipping">Shipping & Tracking</a></li>
              <li><a href="#returns">Exchange Portal</a></li>
              <li><a href="#warranty">Warranty Claims</a></li>
              <li><a href="#contact">Concierge Support</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="footer-bottom-content">
          <span>© {new Date().getFullYear()} AURORA STORE INC. All rights reserved.</span>
          <div className="footer-bottom-links">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
          <div className="built-with">
            <span>Crafted with</span>
            <Heart size={14} className="heart-icon" fill="currentColor" />
            <span>using React & TypeScript</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
