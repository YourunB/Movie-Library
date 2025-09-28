# 🎬 Movie Library - Angular Final Project

A comprehensive movie discovery and management application built with Angular 20, featuring modern reactive patterns, comprehensive testing, and a full-featured user experience.

## 📋 Project Overview

This project implements a movie library application with user authentication, watchlist management, multi-language support, and a modern dark/light theme system. The application demonstrates advanced Angular patterns including Signals, NgRx state management, and comprehensive testing strategies.

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- Angular CLI 20+
- Firebase project setup
- TMDB API

### Installation

1. Clone the repository
```bash
git clone https://github.com/YourunB/Movie-Library
cd Movie-Library
```

2. Install dependencies
```bash
npm i
```

3. Start the development server
```bash
npm run start
```

4. Run tests
```bash
npm run test
npm run test:e2e
```

5. Build for production
```bash
npm run build
```

## 🏗️ Architecture

The application follows a feature-sliced architecture with clear separation of concerns:

- **`src/app/layouts/`** - Layout components and shared UI
- **`src/app/pages/`** - Page components for different routes
- **`src/app/shared/`** - Shared services, components, and utilities
- **`src/store/`** - NgRx state management
- **`src/models/`** - TypeScript interfaces and types

## 🎯 Key Features

- **Modern Angular Patterns**: Signals, computed values, effects
- **State Management**: NgRx with effects and selectors
- **Authentication**: Firebase Auth with protected routes
- **Internationalization**: Multi-language support (EN, PL, RU)
- **Theming**: Dark/light mode with CSS custom properties
- **Responsive Design**: Mobile-first approach with breakpoint observers
- **Testing**: Comprehensive unit and E2E test coverage
- **Performance**: Lazy loading, image optimization, bundle splitting
- **Accessibility**: ARIA attributes, keyboard navigation
- **Error Handling**: User-friendly error messages and monitoring

## 📊 Total Score: 600+ points

This project demonstrates mastery of modern Angular development practices, comprehensive testing strategies, and production-ready application architecture.

## 🎯 Mandatory Baseline Requirements - ALL MET ✅

| Requirement | Status | Evidence |
|-------------|--------|----------|
| **Angular 20+ with Standalone Components** | ✅ | [Package.json](package.json#25-33) - Angular 20.1.0, [App Config](src/app/app.config.ts) - Standalone components throughout |
| **New Control Flow (@if, @for, @switch)** | ✅ | [Gallery](src/app/pages/gallery/gallery.page.html#7-24) - `@if`, `@for` usage, [SideSlider](src/app/layouts/main-layout/side-slider/side-slider.html#4-34) - `@for` with track functions |
| **Signals Usage** | ✅ | [WatchlistSignalsStore](src/app/shared/services/watchlist-signals.store.ts) - Comprehensive signals implementation |
| **Angular Router with Lazy Loading** | ✅ | [App Routes](src/app/app.routes.ts) - All routes use `loadComponent` |
| **Guards/Resolvers** | ✅ | [AuthGuard](src/app/shared/guards/auth.guard.ts), [MovieResolver](src/store/movie/movie.resolver.ts), [PreUserResolver](src/app/shared/resolvers/signinup.resolver.ts) |
| **TypeScript Strict** | ✅ | [tsconfig.json](tsconfig.json#6) - `"strict": true` with additional strict flags |
| **ESLint Configured** | ✅ | [Angular Config](angular.json#111-119) - ESLint configuration, [Package.json](package.json#62-63) - ESLint dependencies |
| **Tests Exist** | ✅ | [GalleryPage Spec](src/app/pages/gallery/gallery.page.spec.ts), [DashboardEffects Spec](src/store/dashboard/dashboard.effects.spec.ts), E2E tests in `dist/test-out/` |
| **Basic Accessibility** | ✅ | [SignupPage](src/app/pages/signup/signup.page.html#25-29) - ARIA attributes, [SignupPage](src/app/pages/signup/signup.page.html#30) - `cdkFocusInitial` |
| **CI Configuration** | ✅ | [Package.json](package.json#5-11) - Test, lint, build scripts configured |
| **OnPush Strategy** | ✅ | [App Component](src/app/app.ts#32) - `changeDetection: ChangeDetectionStrategy.OnPush`, [PersonPage](src/app/pages/person/person.page.ts#16) - OnPush strategy |
| **inject() Usage** | ✅ | [WatchlistSignalsStore](src/app/shared/services/watchlist-signals.store.ts#10-11) - `inject()` function usage throughout codebase |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request


**Built with ❤️ using Angular 20 and modern web technologies**


## 🚀 Performance Budget & Lighthouse Gains

This project includes a performance optimization pass focused on improving load times, responsiveness, and perceived UX for the `movie/:id` and `about` pages.

### ✅ Key Improvements

- **Lazy image loading**: All `<img>` elements now use native `loading="lazy"` to defer offscreen image loading. This reduces bandwidth usage and improves Largest Contentful Paint (LCP).
- **Virtual scrolling**: The cast list uses `cdk-virtual-scroll-viewport` to render only visible items, minimizing DOM size and improving Total Blocking Time (TBT).
- **Code splitting**: Heavy components are loaded on demand via Angular's `loadComponent`, reducing initial bundle size.
- **Data prefetching**: Movie data is preloaded via route resolver before component initialization, improving perceived responsiveness.

### 📉 Before Optimization
![Lighthouse Before](docs/lighthouse-before.jpg)

### 📈 After Optimization
![Lighthouse After](docs/lighthouse-after.jpg)

> ⚠️ **Note:** API responses depend on VPN connectivity, which may introduce latency during audits. All measurements were taken under VPN conditions, which reflect real-world usage for this project.
