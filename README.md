# 🌿 Lenux Production — Web Application & Admin CMS

> **Official Web Portal and Content Management System for Lenux Production (Pvt) Ltd**  
> Sri Lanka's leading creative advertising and branding partner, specializing in high-quality digital printing, custom signboards, commercial displays, event branding, and comprehensive production solutions.

---

## 🚀 Overview

**Lenux Production** is a full-stack, enterprise-grade web application built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **MongoDB**. It serves a dual purpose:

1. **A modern, high-converting public storefront** presenting the company's services, portfolio, client testimonials, team, career opportunities, and direct quotation requests.
2. **A comprehensive Admin CMS Dashboard** allowing company administrators to manage services, portfolio items, gallery showcases, customer quote inquiries, testimonials, staff profiles, job vacancies, and global company contact configurations in real time.

---

## ✨ Features

### 🌐 1. Public Portal (Client-Facing)

- **🎨 Modern Dynamic Homepage (`/`)**
  - **Hero Section**: High-impact branding banner, primary calls-to-action, and company value propositions.
  - **Services Overview**: Live categorical preview of company capabilities (Signboards, Digital Printing, Event Branding, etc.).
  - **Featured Portfolio Projects**: Curated recent works with direct links to project case studies.
  - **Visual Showcase / Photo Gallery**: Visual gallery preview highlighting recent production outputs.
  - **Trusted By Section**: Interactive carousel showcasing corporate client logos and partners.
  - **Client Testimonials**: Verified client reviews and star ratings with dynamic sliding cards.
  - **Why Choose Us**: Value proposition cards highlighting quality assurance, speed, cost efficiency, and expertise.

- **🛠️ Services Catalog (`/services`)**
  - Category-based tabs and interactive filters.
  - Comprehensive service details, feature highlights, and direct "Request a Quote" integration.

- **📁 Portfolio & Project Showcase (`/portfolio`, `/portfolio/[slug]`)**
  - Filterable project grid categorized by service type.
  - Dynamic single project view (`/portfolio/[slug]`) featuring:
    - High-resolution imagery with interactive Lightbox preview modal.
    - Project scope, client information, category, and completion date.
    - In-context inquiry button to request similar work.

- **🖼️ Visual Gallery (`/gallery`)**
  - Photo gallery featuring finished signage, hoardings, display units, and branding products.
  - Full-screen image preview lightbox with zoom and keyboard navigation.

- **🏢 About Us (`/about`)**
  - Company background, historical milestones, and production capabilities.
  - Dynamic Vision & Mission statements with custom imagery managed via the Admin CMS.

- **👥 Team & Staff Directory (`/team`)**
  - Team profiles displaying designations, bio summaries, photos, and social links.

- **💼 Careers Portal (`/careers`, `/careers/[slug]`)**
  - Active job vacancies listing with role specifications, department, and deadline.
  - Individual job post view (`/careers/[slug]`) with full requirements and application guidelines.

- **📩 Instant Quotation & Contact Hub (`/contact`)**
  - **Quote Request Form**: Interactive form capturing client details, required services, project dimensions, and specifications.
  - **Direct Contact Information**: Synchronized phone numbers, hotline, WhatsApp, email, physical office address, and opening hours.
  - **Google Maps Integration**: Interactive map embed showing office location.
  - **Customer Feedback Submission**: Public modal form allowing clients to submit ratings and reviews.

- **⚡ User Experience & Interactive Enhancements**
  - **Floating WhatsApp Quick-Chat Widget**: Direct one-click WhatsApp chat launcher with pre-filled inquiry text and hover card.
  - **Floating Back-to-Top Button**: Smooth scrolling utility with scroll detection.
  - **Branded Preloader (`LenuxLoader`)**: High-performance loading screen tailored to Lenux branding.
  - **Scroll Animations**: Smooth entrance animations using custom `ScrollReveal` wrappers.

- **🔍 Advanced SEO & Social Sharing**
  - Dynamic OpenGraph (OG) tags with high-res preview images optimized for WhatsApp and Facebook link previews.
  - Twitter / X card integration.
  - Automated `sitemap.xml` generation (`/sitemap.ts`) for search engines.
  - Dynamic `robots.txt` configuration (`/robots.ts`).

---

### 🛡️ 2. Admin Management Dashboard (`/admin`)

- **🔐 Secure Authentication & Access Control**
  - Custom JWT-based authentication with `httpOnly` secure cookies.
  - Next.js edge-compatible middleware (`src/middleware.ts`) safeguarding all `/admin/*` routes from unauthorized access.
  - Automated redirection between login and dashboard based on token validity.

- **📊 Central Analytics Dashboard (`/admin`)**
  - Real-time stat metrics (Total Services, Portfolio Projects, Gallery Images, Total Quotes, New Quotes, Clients, Approved Reviews, Staff).
  - Quick action shortcuts to add new services, projects, or staff members.
  - Recent Quote Requests summary table with quick status badges.

- **⚙️ Complete Content Management Modules**
  - **Services Management (`/admin/services`)**: Create, update, reorder, or deactivate services and service categories.
  - **Portfolio Manager (`/admin/portfolio`)**: Publish projects, manage slugs, upload multiple project images, and toggle "Featured on Homepage".
  - **Gallery Manager (`/admin/gallery`)**: Upload production images, organize sort orders, and toggle homepage visibility.
  - **Client Logos Manager (`/admin/client-logos`)**: Manage corporate partner logos displayed in the "Trusted By" carousel.
  - **Staff & Team Manager (`/admin/staff`)**: Manage leadership and team member profiles, designations, and images.
  - **Careers Manager (`/admin/careers`)**: Post and manage job openings, set job requirements, deadlines, and active status.
  - **Quote Requests Manager (`/admin/quotes`)**: Track inquiries with lifecycle statuses (`Pending`, `Contacted`, `In Progress`, `Completed`, `Rejected`).
  - **Feedback Moderation (`/admin/feedback`)**: Review client feedback submissions with approve/reject toggles before public display.
  - **Site Settings & Contact Info (`/admin/settings`)**: Edit company details, branding logo, vision/mission statements, phone numbers, WhatsApp, email, address, operating hours, and social media URLs.

- **☁️ Cloud Image Management**
  - Seamless image uploads powered by **Cloudinary API** (`/api/upload`) supporting services, portfolio images, logos, and gallery items.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, Server Actions, API Routes) |
| **UI Library** | [React 19](https://react.dev) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com), Custom Brand Colors & Bahnschrift Typography |
| **Icons** | [Lucide React](https://lucide.dev) |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) with [Mongoose ODM](https://mongoosejs.com) |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, HTTP-only Cookies |
| **Media & Storage** | [Cloudinary](https://cloudinary.com) |
| **Language** | [TypeScript](https://www.typescriptlang.org) |

---

## 📂 Project Structure

```text
lenux-production/
├── public/                       # Static public assets (images, logos, favicon)
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (public)/             # Public client-facing routes
│   │   │   ├── about/            # About Us page
│   │   │   ├── careers/          # Job listings & detail pages
│   │   │   ├── contact/          # Contact details & quote form
│   │   │   ├── gallery/          # Visual showcase gallery
│   │   │   ├── portfolio/        # Filterable portfolio & [slug] case studies
│   │   │   ├── services/         # Services catalog & filters
│   │   │   ├── team/             # Team / Staff directory
│   │   │   └── page.tsx          # Dynamic Homepage
│   │   ├── admin/                # Secure Admin CMS Dashboard
│   │   │   ├── careers/          # Manage job vacancies
│   │   │   ├── client-logos/     # Manage partner logos
│   │   │   ├── feedback/         # Moderate reviews & feedback
│   │   │   ├── gallery/          # Manage visual showcase
│   │   │   ├── login/            # Admin authentication login page
│   │   │   ├── portfolio/        # Manage projects & case studies
│   │   │   ├── quotes/           # Review & process quote requests
│   │   │   ├── services/         # Manage services & categories
│   │   │   ├── settings/         # Company info, logo, vision & social links
│   │   │   ├── staff/            # Manage team member profiles
│   │   │   ├── layout.tsx        # Admin sidebar & header layout
│   │   │   └── page.tsx          # Admin analytics dashboard
│   │   ├── api/                  # API Route Handlers
│   │   │   ├── admin/            # Admin statistics & management APIs
│   │   │   ├── auth/             # Login, verify, and logout endpoints
│   │   │   ├── feedback/         # Feedback submission & approval APIs
│   │   │   ├── quotes/           # Quote request submission APIs
│   │   │   ├── seed/             # Initial Super Admin seeder
│   │   │   ├── services/         # Services data API
│   │   │   ├── staff/            # Staff data API
│   │   │   └── upload/           # Cloudinary image upload handler
│   │   ├── globals.css           # Global Tailwind CSS definitions
│   │   ├── layout.tsx            # Global Root Layout with dynamic metadata
│   │   ├── not-found.tsx         # Custom 404 page
│   │   ├── robots.ts             # Search engine crawler directives
│   │   └── sitemap.ts            # Dynamic XML sitemap generator
│   ├── components/               # Reusable React components
│   │   ├── ContactQuoteForm.tsx  # Quote submission form
│   │   ├── FeedbackForm.tsx      # Customer feedback modal & form
│   │   ├── Footer.tsx            # Global public footer
│   │   ├── GlobalFloatingActions.tsx # WhatsApp launcher & Back-to-Top
│   │   ├── Header.tsx            # Navigation bar with mobile drawer
│   │   ├── HomeFeaturedGallery.tsx # Homepage gallery showcase
│   │   ├── LenuxLoader.tsx       # Branded preloader
│   │   ├── PortfolioGallery.tsx  # Interactive portfolio grid
│   │   ├── ProjectImageLightbox.tsx # Fullscreen lightbox viewer
│   │   ├── ScrollReveal.tsx      # Viewport scroll animations
│   │   ├── ServicesCatalog.tsx   # Categorized services grid
│   │   ├── ServicesFilterSection.tsx # Filter & tab controls
│   │   ├── StaffCard.tsx         # Team member profile cards
│   │   ├── TestimonialsSection.tsx # Dynamic client testimonials carousel
│   │   ├── TrustedBySection.tsx  # Corporate partners logo bar
│   │   └── VisualGallery.tsx     # Photo gallery with modal viewer
│   ├── lib/                      # Core utility libraries
│   │   ├── cloudinary.ts         # Cloudinary configuration
│   │   ├── db.ts                 # MongoDB connection handler
│   │   └── slugify.ts            # URL slug generator utility
│   ├── middleware.ts             # Admin authentication route protection
│   └── models/                   # Mongoose Database Models
│       ├── Admin.ts              # Admin user accounts & roles
│       ├── ClientLogo.ts         # Partner/client logos
│       ├── ContactInformation.ts # Global company settings & contact details
│       ├── Feedback.ts           # Customer testimonials & ratings
│       ├── Gallery.ts            # Showcase photo items
│       ├── JobVacancy.ts         # Career job postings
│       ├── Portfolio.ts          # Portfolio projects & case studies
│       ├── QuoteRequest.ts       # Quotation submissions & statuses
│       ├── Service.ts            # Individual service items
│       ├── ServiceCategory.ts   # Service categories
│       └── Staff.ts              # Team member records
├── .env.local                    # Local environment variables (do not commit)
├── next.config.ts                # Next.js configuration (Cloudinary remotePatterns)
├── tailwind.config.ts            # Custom theme, brand palette & fonts
├── tsconfig.json                 # TypeScript compiler configuration
└── package.json                  # Dependencies & scripts
```

---

## ⚙️ Getting Started

### 1. Prerequisites
- **Node.js** (v18.18.0 or higher recommended)
- **npm** / **yarn** / **pnpm**
- A **MongoDB Atlas** database cluster (or local MongoDB)
- A **Cloudinary** account for image hosting

---

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd lenux-production
npm install
```

---

### 3. Environment Variables Configuration

Create a `.env.local` file in the project root with the following configuration:

```env
# Site URLs
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# MongoDB Database Connection String
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.ujgznnp.mongodb.net/lenux-db?retryWrites=true&w=majority"

# JWT Authentication
JWT_SECRET="your_strong_jwt_secret_key_here"
JWT_EXPIRES_IN="7d"

# Cloudinary Storage Configuration
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
NEXT_PUBLIC_CLOUDINARY_FOLDER="lenux"
```

---

### 4. Database Seeding (First-Time Admin Setup)

To create the initial Super Admin account, start the application and visit the seed endpoint once in your browser:

```http
GET http://localhost:3000/api/seed
```

This will automatically create the initial admin user in your database if one does not already exist.

---

### 5. Running the Application

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
- **Public Website**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
npm run start
```

---

## 🎨 Brand Design System

Lenux Production uses a distinct green & dark industrial design system configured in `tailwind.config.ts`:

| Token | Hex Code | Usage |
| :--- | :--- | :--- |
| `lenux-deep` | `#064e3b` | Dark green headers, primary sidebars, dark footers |
| `lenux-dark` | `#065f46` | Secondary green surfaces, hover states |
| `lenux-emerald` | `#10b981` | Accent buttons, active tabs, highlight icons |
| `lenux-soft` | `#d1fae5` | Soft badges, subtle background tints |
| `lenux-charcoal` | `#1f2937` | High-contrast body typography |
| `lenux-darkGray` | `#374151` | Secondary typography & subtitles |
| `lenux-offWhite` | `#f9fafb` | Section backgrounds & admin workspace canvas |

---

## 📄 License

This software is proprietary and confidential to **Lenux Production (Pvt) Ltd**. All rights reserved.
