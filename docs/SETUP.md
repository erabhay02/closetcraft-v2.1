# ClosetCraft — Setup & Deployment Guide

## Overview

ClosetCraft is a cross-platform closet design app built with React Native + Expo.
This guide covers local setup, development, building, and deploying to both app stores.

**Phase 2.0** delivers:
- Enhanced web prototype with materials, save/load, PDF export
- Full React Native project structure with navigation
- Camera-based measurement (photo + reference object calibration)
- Material/finish picker
- Persistent design storage (AsyncStorage)
- PDF export with layout diagrams
- Saved designs management

**Phase 2.1** will add:
- Native ARKit (iOS) and ARCore (Android) spatial measurement
- Real-time 3D preview with Three.js/expo-gl
- App Store & Google Play submission automation

---

## Quick Start

### Prerequisites

1. Node.js 18+ — https://nodejs.org
2. Expo CLI — `npm install -g expo-cli`
3. EAS CLI — `npm install -g eas-cli`
4. Expo Go app on your phone (for development testing)

### Install & Run

```bash
cd closetcraft
npm install
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS).

---

## Project Structure

```
closetcraft/
├── app.json                      # Expo config (permissions, splash, icons)
├── eas.json                      # EAS Build config (dev/preview/production)
├── package.json                  # Dependencies
│
├── src/
│   ├── App.jsx                   # Root: navigation + tab bar
│   │
│   ├── screens/
│   │   ├── ARMeasureScreen.js    # Photo-based camera measurement
│   │   └── SavedDesignsScreen.js # Browse/open/delete saved designs
│   │
│   ├── components/
│   │   └── MaterialPicker.js     # Material selection bottom sheet
│   │
│   ├── utils/
│   │   ├── constants.js          # Colors, components, materials, config
│   │   └── pdfExport.js          # HTML-to-PDF generation + sharing
│   │
│   └── store/
│       └── designStore.js        # AsyncStorage CRUD for designs
│
├── docs/
│   ├── AR_NATIVE_MODULE.md       # ARKit/ARCore native bridge guide
│   └── SETUP.md                  # This file
│
└── web-prototype/
    └── closetcraft-phase2.jsx    # Enhanced web prototype (runs in browser)
```

---

## Development Workflow

### Running on Device

```bash
# iOS Simulator
npx expo start --ios

# Android Emulator
npx expo start --android

# Physical device (scan QR)
npx expo start
```

### Key Dev Commands

```bash
# Install a new Expo package
npx expo install expo-camera

# Check for dependency issues
npx expo doctor

# Clear cache if builds fail
npx expo start --clear
```

---

## Building for App Stores

### 1. Create Expo Account

```bash
npx expo login
# or create at https://expo.dev/signup
```

### 2. Configure EAS

```bash
eas build:configure
```

### 3. Build for iOS

```bash
# Development build (for testing)
eas build --platform ios --profile development

# Production build (for App Store)
eas build --platform ios --profile production
```

Requirements:
- Apple Developer Program ($99/year)
- App Store Connect app entry
- Update `app.json` with your bundle identifier

### 4. Build for Android

```bash
# Development build
eas build --platform android --profile development

# Production build (for Google Play)
eas build --platform android --profile production
```

Requirements:
- Google Play Developer Account ($25 one-time)
- Update `app.json` with your package name

### 5. Submit to Stores

```bash
# iOS
eas submit --platform ios

# Android
eas submit --platform android
```

---

## App Store Preparation Checklist

### iOS App Store
- [ ] App icon (1024×1024 PNG, no transparency)
- [ ] Screenshots for iPhone 6.7" and 6.5"
- [ ] Screenshots for iPad 12.9" (if supporting tablet)
- [ ] App description (max 4000 chars)
- [ ] Keywords (max 100 chars)
- [ ] Privacy policy URL
- [ ] Camera usage description (already in app.json)
- [ ] Age rating: 4+

### Google Play Store
- [ ] App icon (512×512 PNG)
- [ ] Feature graphic (1024×500)
- [ ] Screenshots (min 2, max 8 per device type)
- [ ] Short description (max 80 chars)
- [ ] Full description (max 4000 chars)
- [ ] Privacy policy URL
- [ ] Content rating questionnaire
- [ ] Target audience: General

---

## Camera Measurement: How It Works

The photo-based measurement system works on ALL devices:

1. User selects a reference object of known size (credit card, dollar bill, etc.)
2. User places it against the closet wall and takes a photo
3. User taps both ends of the reference object → app calculates pixels-per-inch
4. User taps pairs of points to measure width, height, and depth
5. Measurements are passed to the designer

Accuracy: ±2-3 inches (sufficient for initial design, recommend tape measure verification)

For devices with ARKit/ARCore support, see `docs/AR_NATIVE_MODULE.md` for native
spatial measurement integration (±0.5 inch accuracy).

---

## PDF Export

The app generates professional PDF design sheets including:
- Closet dimensions with visual cards
- Material selection
- SVG layout diagram with component positions
- Component list with quantities and dimensions
- Installation tips

Uses `expo-print` (HTML → PDF) and `expo-sharing` for sharing.
