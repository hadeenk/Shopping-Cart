export type ProductCategory = 'All' | 'Audio' | 'Wearables' | 'Desk Setup' | 'Apparel' | 'Accessories';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'One Size';

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  rating: number;
  reviewsCount: number;
  image: string;
  secondaryImage?: string;
  description: string;
  details: string[];
  sizes: ProductSize[];
  colors: string[];
  isAvailable: boolean;
  isFeatured?: boolean;
  badge?: 'Best Seller' | 'New Arrival' | 'Sale' | 'Limited Edition';
}

export interface CartItem {
  cartItemId: string; // unique combo of product id + selected size + selected color
  product: Product;
  quantity: number;
  selectedSize: ProductSize;
  selectedColor: string;
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'name-asc';

export interface FilterState {
  searchQuery: string;
  category: ProductCategory;
  selectedSizes: ProductSize[];
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  sortBy: SortOption;
}

export interface PromoCode {
  code: string;
  discountPercentage: number;
  description: string;
}

export interface OrderDetails {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  customer: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
  };
  placedAt: string;
}
