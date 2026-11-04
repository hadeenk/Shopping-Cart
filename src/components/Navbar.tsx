import React from 'react';
import { ShoppingBag, Sun, Moon, Search, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import type { ProductCategory } from '../types';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
}

const CATEGORIES: ProductCategory[] = [
  'All',
  'Audio',
  'Wearables',
  'Desk Setup',
  'Apparel',
  'Accessories',
];

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  activeCategory,
  onSelectCategory,
}) => {
  const { totalItemCount, openCart } = useCart();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar-wrapper">
      <div className="announcement-bar">
        <span>✨ Spring Creator Drop: Use code <strong>AURORA20</strong> for 20% off • Free Express Shipping on orders over $99</span>
      </div>

      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="brand-logo" onClick={() => onSelectCategory('All')}>
          <div className="logo-icon-box">
            <Sparkles className="logo-sparkle" size={20} />
          </div>
          <div className="logo-text">
            <span className="brand-title">AURORA</span>
            <span className="brand-tagline">STUDIO STORE</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="search"
            placeholder="Search audio, watches, desk gear, apparel..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
            aria-label="Search products"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="clear-search-btn"
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Actions (Theme & Cart) */}
        <div className="navbar-actions">
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={openCart}
            className="cart-trigger-btn"
            aria-label={`Open shopping cart with ${totalItemCount} items`}
          >
            <div className="cart-icon-wrapper">
              <ShoppingBag size={22} />
              {totalItemCount > 0 && (
                <span className="cart-badge-counter" key={totalItemCount}>
                  {totalItemCount}
                </span>
              )}
            </div>
            <span className="cart-label">Bag</span>
          </button>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <nav className="category-nav-bar" aria-label="Product categories">
        <div className="category-pills-list">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
};
