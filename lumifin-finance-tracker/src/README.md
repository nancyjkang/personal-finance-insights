# Lumifin Finance Tracker - Source Code Structure

This document outlines the source code organization for the Lumifin Personal Finance Tracker.

## 📁 Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   └── favicon.ico        # App icon
├── components/            # Reusable React components
│   ├── ui/               # Basic UI components (Button, Input, Card, etc.)
│   ├── layout/           # Layout components (Header, Footer, Navigation)
│   └── forms/            # Form components (TransactionForm, FilterForm)
├── lib/                  # Utility libraries and configurations
│   ├── auth/            # Authentication logic (NextAuth config)
│   ├── google/          # Google APIs integration (Sheets API)
│   └── utils/           # Helper functions and utilities
└── types/               # TypeScript type definitions
    ├── index.ts         # Main types (Transaction, User, etc.)
    ├── auth.ts          # Authentication types
    └── google.ts        # Google API types
```

## 🏗️ Architecture Overview

### Components Layer
- **UI Components**: Reusable, styled components following design system
- **Layout Components**: Header, footer, navigation, and page layouts
- **Form Components**: Transaction forms, filters, and data entry

### Business Logic Layer
- **Auth**: NextAuth.js configuration and authentication helpers
- **Google**: Google Sheets API integration and data fetching
- **Utils**: Helper functions for formatting, validation, and utilities

### Data Layer
- **Types**: TypeScript definitions for type safety
- **Constants**: App-wide constants and configuration

## 🎯 Key Features Support

### Google Sheets Integration
- Location: `src/lib/google/`
- Purpose: Connect to user's Google Sheets for transaction data

### Authentication
- Location: `src/lib/auth/`
- Purpose: Secure user authentication via Google OAuth

### Transaction Management
- Location: `src/components/forms/` + `src/types/`
- Purpose: Display, filter, and manage financial transactions

### Monthly Reports
- Location: `src/lib/utils/` + `src/types/`
- Purpose: Generate financial reports and analytics

## 🔧 Development Guidelines

1. **Type Safety**: All components and functions should be properly typed
2. **Reusability**: UI components should be generic and reusable
3. **Separation of Concerns**: Keep business logic separate from UI components
4. **Error Handling**: Implement proper error boundaries and validation
5. **Performance**: Use React best practices (memo, callback, etc.)

## 📦 Dependencies

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type safety and developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **NextAuth.js**: Authentication solution
- **Google APIs**: Sheets API integration

## 🚀 Getting Started

1. Copy environment variables: `cp .env.example .env.local`
2. Configure Google OAuth credentials
3. Install dependencies: `npm install`
4. Run development server: `npm run dev`

## 🧪 Quality Assurance

- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier for consistent code style
- **Type Checking**: TypeScript strict mode enabled
- **Build Verification**: Production build testing