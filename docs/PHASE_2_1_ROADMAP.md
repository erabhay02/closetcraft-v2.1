# ClosetCraft — Phase 2.1 Roadmap

## What Phase 2.0 Delivered
- ✅ Complete React Native + Expo project structure
- ✅ Tab navigation (Home, My Designs, Settings)
- ✅ Screen flow: Room → Closet Type → Measurements → Designer → Summary
- ✅ Photo-based camera measurement with reference object calibration
- ✅ 12 closet components across 4 categories
- ✅ 10 material/finish options (Melamine, Wood, Laminate, Wire)
- ✅ Save/Load designs with AsyncStorage
- ✅ PDF export with layout diagram and component list
- ✅ Material picker UI
- ✅ Saved designs management (browse, open, duplicate, delete)
- ✅ 3D preview with rotation
- ✅ Full interactive web prototype for testing in browser
- ✅ Native AR module documentation (ARKit + ARCore bridge)
- ✅ EAS build configuration for iOS and Android

---

## Phase 2.1 Deliverables

### 1. Native AR Spatial Measurement
**Timeline: 2-3 weeks**

Build the native modules documented in `docs/AR_NATIVE_MODULE.md`:

- **iOS (Swift)**: ARKit world tracking with plane detection
  - Real-time surface detection
  - Tap-to-measure with raycast
  - Visual feedback (floating measurement labels in AR view)
  - Accuracy: ±0.5 inches

- **Android (Kotlin)**: ARCore hit testing
  - Same feature parity as iOS
  - Graceful fallback for non-ARCore devices

- **React Native Bridge**: Unified JS API
  ```js
  import { ARBridge } from './utils/arBridge';
  const supported = await ARBridge.isSupported();
  const result = await ARBridge.measurePoint(x, y);
  ```

- **Smart Fallback**: Automatically detect device capability
  - ARKit/ARCore available → native spatial measurement
  - No AR support → photo-based measurement (already built)

### 2. Advanced 3D Preview
**Timeline: 1-2 weeks**

Replace the canvas-based 3D preview with expo-gl + Three.js:

- Real-time 3D rendering with proper lighting
- Pinch-to-zoom, swipe-to-rotate
- Material textures applied to components (wood grain, wire mesh)
- Walk-through mode (first-person camera inside closet)
- Shadow casting for depth perception
- Screenshot/share 3D view

### 3. Enhanced Designer Canvas
**Timeline: 1-2 weeks**

Upgrade the 2D designer with React Native Gesture Handler + Reanimated:

- Native pan/pinch gestures (60fps)
- Two-finger pinch to zoom canvas
- Long-press to duplicate/delete
- Haptic feedback on snap, place, delete
- Undo/redo stack (up to 50 actions)
- Multi-select components (shift-tap)
- Alignment guides (snap to edges of other components)
- Ruler overlay with inch/cm markings

### 4. App Store Submission
**Timeline: 1 week**

**iOS App Store:**
- Generate app icon set (1024×1024 + all sizes)
- Capture screenshots on iPhone 15 Pro Max (6.7") and iPhone SE (4.7")
- Write App Store description and keywords
- Create privacy policy page
- Submit via `eas submit --platform ios`
- Target category: Lifestyle > Home Improvement

**Google Play Store:**
- Generate feature graphic (1024×500)
- Capture screenshots on Pixel 8 and tablet
- Write Play Store listing
- Complete content rating questionnaire
- Submit via `eas submit --platform android`
- Target category: House & Home

### 5. Bonus Features (if time permits)
- Cloud sync (Supabase or Firebase)
- Share designs via link
- Component cost estimator (link to Home Depot/Lowe's APIs)
- Before/after photo comparison
- Design templates (starter layouts for common closet sizes)
- Accessibility audit (VoiceOver, TalkBack support)

---

## Development Setup for Phase 2.1

```bash
# Install native dependencies for AR
npx expo install expo-gl three
npx expo prebuild  # Generate native iOS/Android projects

# iOS AR testing (requires physical device)
npx expo run:ios --device

# Android AR testing (requires physical device)
npx expo run:android --device

# Production builds
eas build --platform all --profile production
```

---

## Architecture Notes

### AR Module Architecture
```
User taps "Camera Measure"
    │
    ├── Check ARBridge.isSupported()
    │     ├── true  → NativeARScreen (ARKit/ARCore)
    │     └── false → PhotoMeasureScreen (already built)
    │
    └── Measurements returned to Designer
```

### Data Flow
```
AsyncStorage (local)
    │
    ├── Designs[]        → SavedDesignsScreen
    ├── Settings{}       → SettingsScreen
    └── LastDesignId     → Auto-resume on app open
```

### File Size Estimates
- iOS IPA: ~25-35 MB (with AR frameworks)
- Android APK: ~20-30 MB (with ARCore)
- Without AR: ~12-18 MB each platform
