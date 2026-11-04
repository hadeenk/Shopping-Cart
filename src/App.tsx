import React, { useState, useMemo } from 'react';
import { SAMPLE_PRODUCTS } from './data/products';
import type { FilterState, Product, ProductCategory } from './types';
import { Navbar } from './components/Navbar';
import { Filters } from './components/Filters';
import { ProductGrid } from './components/ProductGrid';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { CheckoutModal } from './components/CheckoutModal';
import { NotificationToast } from './components/NotificationToast';
import { Footer } from './components/Footer';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import './App.css';

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  category: 'All',
  selectedSizes: [],
  minPrice: 0,
  maxPrice: 350,
  inStockOnly: false,
  sortBy: 'featured',
};

export const AppContent: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handleSelectCategory = (cat: ProductCategory) => {
    setFilters((prev) => ({ ...prev, category: cat }));
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return SAMPLE_PRODUCTS.filter((product) => {
      // Search
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesSubtitle = product.subtitle.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        const matchesDescription = product.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSubtitle && !matchesCategory && !matchesDescription) {
          return false;
        }
      }

      // Category
      if (filters.category !== 'All' && product.category !== filters.category) {
        return false;
      }

      // Price
      if (product.price > filters.maxPrice) {
        return false;
      }

      // Sizes
      if (filters.selectedSizes.length > 0) {
        const hasMatchingSize = product.sizes.some((s) =>
          filters.selectedSizes.includes(s)
        );
        if (!hasMatchingSize) return false;
      }

      // In-stock
      if (filters.inStockOnly && !product.isAvailable) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'featured':
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [filters]);

  return (
    <div className="store-layout">
      {/* Top Navigation */}
      <Navbar
        searchQuery={filters.searchQuery}
        onSearchChange={(query) => setFilters((prev) => ({ ...prev, searchQuery: query }))}
        activeCategory={filters.category}
        onSelectCategory={handleSelectCategory}
      />

      {/* Hero Banner Showcase */}
      {filters.category === 'All' && !filters.searchQuery && (
        <section className="hero-banner">
          <div className="hero-content">
            <div className="hero-tag">
              <Zap size={14} className="hero-zap" />
              <span>COLLECTION 2026 // LIMITED DROP</span>
            </div>
            <h1 className="hero-headline">
              Artifacts For The Focused Mind.
            </h1>
            <p className="hero-description">
              Precision audio, horology, machined desktop gear, and pure merino knitwear. Built without compromise for modern innovators.
            </p>
            <div className="hero-actions">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('catalog-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hero-primary-btn"
              >
                <span>Explore Catalog</span>
                <ArrowRight size={18} />
              </button>
              <div className="hero-pill-info">
                <ShieldCheck size={16} />
                <span>Zero Risk • 30-Day Guarantee</span>
              </div>
            </div>
          </div>
          <div className="hero-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80"
              alt="Hero Studio Headphones"
              className="hero-img"
            />
            <div className="hero-floating-card">
              <Sparkles size={16} className="sparkle-pulse" />
              <div>
                <strong>AuraWave Wireless ANC</strong>
                <p>Trending #1 this week</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Storefront Area */}
      <main id="catalog-section" className="main-content-container">
        {/* Active Filters & Sorters */}
        <Filters
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
          totalResults={filteredProducts.length}
        />

        {/* Product Grid */}
        <ProductGrid
          products={filteredProducts}
          onQuickView={(p) => setQuickViewProduct(p)}
          onResetFilters={handleResetFilters}
        />
      </main>

      {/* Interactive Overlays */}
      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <NotificationToast />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
