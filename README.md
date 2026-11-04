# ⚡ Aurora Store — Next-Gen Shopping Cart Frontend

A minimalist, high-performance shopping cart and modern e-commerce storefront built from the ground up with **React 19**, **TypeScript**, and **Vite 8**. Engineered without external heavy UI component libraries or backends, providing instant responsiveness, offline cart persistence, accessible dialogs, and a seamless checkout simulation.

---

## ✨ Key Features

- **Dynamic Cart Drawer (Slide-Over)**:
  - Add to bag with custom size and color swatch selection.
  - Increment, decrement, and remove items with instant quantity counters.
  - Persistent shopping bag stored in `localStorage` across page reloads.
  - Dynamic **Free Express Shipping Progress Meter** with real-time feedback.
  - Interactive **Promo Code Engine** (`AURORA20`, `WELCOME10`, `VIP30`).
  - Automatic order summary calculation (subtotal, discounts, shipping, tax, grand total).
- **Modern Dialogs & Modals**:
  - Compliant with **Modern Web Guidance** standards: uses native `<dialog>` with `closedby="any"` and click-outside backdrop fallbacks.
  - **Product Quick-View Modal** with secondary image switching, full technical specs, and variant selectors.
  - **Simulated Multi-Step Checkout Modal** (Shipping details → Mock payment → Celebratory confetti animation via `canvas-confetti` + receipt generation).
- **Advanced Filtering & Discovery**:
  - Live instant search across titles, categories, and descriptions.
  - Category navigation tabs ("Audio", "Wearables", "Desk Setup", "Apparel", "Accessories").
  - Multi-faceted filters: Size chips (`XS`, `S`, `M`, `L`, `XL`, `One Size`), interactive Price Range slider, and sorting options (Price Asc/Desc, Ratings, Alphabetical).
- **Dark & Light Mode**:
  - Polished theme toggle persisted to local storage with glassmorphic cards, crisp borders, and subtle glowing accents.
- **Vercel & Production Ready**:
  - Zero-config Vite build producing optimized static bundles.
  - Pre-configured `vercel.json` SPA rewrite rules.

---

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Icons**: `lucide-react`
- **Effects**: `canvas-confetti`
- **Styling**: Modern Vanilla CSS with CSS Variables, container queries, and backdrop filters

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 3. Build for Production
```bash
npm run build
```
This generates the optimized production build in the `dist/` directory.

---

## 🐙 Pushing to GitHub

1. Create a new repository on [GitHub](https://github.com/new) (e.g., `aurora-store`). Do **not** initialize it with a README or `.gitignore`.
2. Link your local repository to GitHub:
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/aurora-store.git
   git branch -M main
   git push -u origin main
   ```

---

## ▲ Deploying to Vercel

### Method A: Deploy via Vercel Web Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** > **"Project"**.
3. Select your GitHub repository (`aurora-store`).
4. Vercel automatically detects **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**. Your application will be live with a free SSL `.vercel.app` domain in seconds!

### Method B: Deploy via Vercel CLI
If you prefer the terminal:
```bash
npm install -g vercel
vercel
```
Follow the interactive prompts and choose default settings.

---

## 🏷 Test Promo Codes

Try these discount codes in the Cart Drawer:
- `AURORA20` — **20% off** entire order
- `WELCOME10` — **10% off** welcome discount
- `VIP30` — **30% off** (requires order subtotal over $150)
