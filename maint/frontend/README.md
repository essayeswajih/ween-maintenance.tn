# Maintenance.com.tn - Frontend

Professional e-commerce and services platform for maintenance, product sales, and specialized services (plumbing, electrical, heating, boiler installation).

## 🌐 Complete Page Structure

### General Pages
- **`/`** - Home page with hero, services showcase, and features
- **`/about`** - About company, mission, team, values
- **`/contact`** - Contact form, location, hours, FAQ
- **`/faq`** - Frequently asked questions with categories
- **`/blog`** - Blog articles and news
- **`/search`** - Product and service search

### E-Commerce
- **`/products`** - Product catalog with filters and categories
- **`/products/[category]`** - Category-specific products
- **`/products/[category]/[slug]`** - Individual product details
- **`/cart`** - Shopping cart with items, quantities, pricing
- **`/checkout`** - Multi-step checkout process
- **`/checkout/shipping`** - Shipping address form
- **`/checkout/payment`** - Payment method selection
- **`/checkout/confirmation`** - Order confirmation

### Services
- **`/services`** - All services overview
- **`/services/[slug]`** - Service category details
- **`/services/request`** - Quote/estimate request form
- **`/services/request/confirmation`** - Quote request confirmation

### User Account
- **`/login`** - Login form
- **`/register`** - Registration form
- **`/forgot-password`** - Password recovery
- **`/account`** - Dashboard with activity and options
- **`/account/profile`** - User profile management
- **`/account/orders`** - Order history
- **`/account/orders/[id]`** - Order details
- **`/account/services`** - Service quotes/interventions
- **`/account/services/[id]`** - Service details
- **`/account/invoices`** - Invoice management
- **`/account/addresses`** - Saved addresses
- **`/account/security`** - Password & security settings

### Admin Dashboard
- **`/admin/dashboard`** - Main dashboard with stats
- **`/admin/products`** - Product management
- **`/admin/services`** - Service management
- **`/admin/orders`** - Order management
- **`/admin/quotes`** - Quote management
- **`/admin/customers`** - Customer management

### Legal & Technical
- **`/legal/privacy-policy`** - Privacy policy
- **`/legal/terms`** - Terms and conditions
- **`/legal/cookies`** - Cookie policy
- **`/404`** - Not found page
- **`/500`** - Server error page

## 🎨 Features

### Design
- **Light & Dark Mode** - Full theme switching with persistence
- **Responsive Design** - Mobile-first approach, works on all devices
- **Professional Color Scheme** - Blue primary (#265c9f), orange accents (#8b5c2e)
- **Modern UI** - Built with shadcn/ui components and Tailwind CSS v4

### Components
- Navigation with theme toggle
- Footer with links and contact info
- Product cards with pricing
- Service cards with details
- User account cards
- Admin statistics dashboard
- Form elements (inputs, selects, textareas)
- Pagination controls

### Functionality
- Category filtering
- Product search
- Shopping cart simulation
- Multi-step checkout
- Quote request forms
- User authentication pages
- Admin dashboard with stats
- Contact forms
- Newsletter signup

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode
- **Language**: TypeScript

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎯 Color System

**Light Mode:**
- Primary: oklch(0.35 0.12 260) - Professional Blue
- Accent: oklch(0.55 0.15 35) - Warm Orange
- Background: oklch(0.99 0.001 0) - White
- Foreground: oklch(0.15 0.02 280) - Dark Blue

**Dark Mode:**
- Primary: oklch(0.65 0.15 260) - Bright Blue
- Accent: oklch(0.75 0.18 35) - Bright Orange
- Background: oklch(0.12 0.01 0) - Dark
- Foreground: oklch(0.95 0.01 0) - Light Gray

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## 📝 Notes

- All pages are fully styled with proper spacing and typography
- Components follow accessibility best practices
- Navigation is intuitive and mobile-friendly
- Forms are structured but not connected to backend
- Admin dashboard shows mock data for demonstration
- All French content can be easily translated
- Ready for backend API integration

## 🔗 Quick Links

- Home: `/`
- Products: `/products`
- Services: `/services`
- Login: `/login`
- Admin: `/admin/dashboard`
- Contact: `/contact`
