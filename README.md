# UBIQ Entertainment - African Content Streaming Platform

A modern, Netflix-inspired streaming platform built specifically for African content. Built with Next.js 14, TypeScript, Redux Toolkit, and shadcn/ui.

## 🚀 Features

- **Authentication System**: Complete auth flow with login, register, password reset, email verification, and 2FA
- **Profile Management**: Multiple user profiles with kids mode, customizable avatars, and preferences
- **Content Discovery**: Browse movies, shows, skits, and more with categories, search, and recommendations
- **Video Playback**: Custom Video.js player with HLS streaming, quality selection, subtitles, and progress tracking
- **Watchlist & Favorites**: Save and organize content across profiles
- **Continue Watching**: Resume playback from where you left off
- **Subscription Management**: Stripe-powered billing with multiple plan tiers
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **African Design Elements**: Custom color palette and branding inspired by African culture

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- npm or yarn
- Git

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd ubiq-ent-front
```

### 2. Install dependencies

```bash
npm install
```

This will install all required packages:
- **@reduxjs/toolkit** & **react-redux**: State management
- **axios**: HTTP client
- **js-cookie**: Cookie management
- **react-hook-form** & **yup** & **@hookform/resolvers**: Form handling and validation
- **video.js** & **@videojs/http-streaming**: Video playback
- **framer-motion**: Animations
- **embla-carousel-react**: Carousels
- **@stripe/stripe-js** & **@stripe/react-stripe-js**: Payment processing
- **date-fns**: Date utilities
- **clsx** & **tailwind-merge**: Utility functions

### 3. Initialize shadcn/ui

```bash
npx shadcn@latest init
```

Then install required components:

```bash
npx shadcn@latest add button input form card dialog dropdown-menu select tabs toast avatar badge checkbox label radio-group separator skeleton slider switch textarea tooltip
```

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
NEXT_PUBLIC_ADMIN_BASE_URL=https://your-api-domain.com/admin

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

# App Configuration
NEXT_PUBLIC_APP_NAME=UBIQ Entertainment
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Video Configuration
NEXT_PUBLIC_VIDEO_BASE_URL=https://your-api-domain.com/storage/videos
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
ubiq-ent-front/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # Authentication pages
│   ├── (main)/                   # Main application pages
│   ├── (account)/                # Account pages
│   ├── pricing/                  # Pricing plans
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── auth/                     # Auth components
│   ├── content/                  # Content components
│   ├── layout/                   # Layout components
│   └── player/                   # Video player components
├── store/
│   ├── slices/                   # Redux slices
│   ├── hooks.ts                  # Custom Redux hooks
│   ├── index.ts                  # Store configuration
│   └── Provider.tsx              # Redux Provider
├── services/                     # API service layers
├── lib/
│   ├── api-client.ts             # Axios configuration
│   ├── utils.ts                  # Utility functions
│   └── validations.ts            # Yup schemas
└── public/
    └── logo.png                  # Application logo
```

## 📚 Key Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Redux Toolkit**: State management
- **React Hook Form**: Form handling
- **Yup**: Schema validation
- **Tailwind CSS**: Utility-first CSS
- **shadcn/ui**: Component library
- **Video.js**: Video player
- **Stripe**: Payment processing
- **Framer Motion**: Animations

## 📧 Support

For support, email: support@ubiq-entertainment.com

---

Built with ❤️ for African content creators and viewers.
