# ClosetCraft — App Store & Google Play Submission Checklist

## Accounts (One-time Setup)

| Item | Cost | Status |
|---|---|---|
| Apple Developer Program | $99/year | Enroll at developer.apple.com |
| Google Play Developer Account | $25 one-time | Register at play.google.com/console |
| Expo EAS Account | Free | `eas login` with your expo.dev account |

---

## Critical Fixes Before Building

### ✅ 1. App version
`app.json` updated to `1.0.0` — done.

### ✅ 2. Supabase credentials
Real credentials are in `src/utils/constants.js` — done.

### ✅ 3. Remove the "in" social button
Removed. AuthScreen now shows only Apple (iOS) and Google buttons.

### ✅ 4. Social sign-in implemented
- **Apple**: Full implementation via `expo-apple-authentication` → `supabase.auth.signInWithIdToken`. iOS-only, hidden on Android.
- **Google**: Full implementation via `expo-auth-session/providers/google` → `supabase.auth.signInWithIdToken`.

#### ⬜ 4a. Supabase — enable Apple provider
1. Supabase Dashboard → Authentication → Providers → Apple → **Enable**
2. developer.apple.com → Certificates → Identifiers → `com.closetcraft.app` → Sign In with Apple → **Configure** → add your Supabase callback URL
3. Create a **Services ID** (`com.closetcraft.app.service`) and a **private key** with Sign In with Apple
4. Paste Service ID + private key into Supabase Apple provider settings

#### ⬜ 4b. Google Cloud Console — create OAuth credentials
1. [console.cloud.google.com](https://console.cloud.google.com) → New project → **APIs & Services → OAuth consent screen**
   - User type: External → fill app name, support email, developer email
2. **Credentials → + Create Credentials → OAuth 2.0 Client ID** — create three:
   - **iOS**: Application type = iOS, Bundle ID = `com.closetcraft.app`
   - **Android**: Application type = Android, Package = `com.closetcraft.app`, SHA-1 from `eas credentials`
   - **Web**: Application type = Web (needed for token exchange)
3. Paste the three Client IDs into `src/screens/AuthScreen.js` → `GOOGLE_CLIENT_IDS`
4. Supabase Dashboard → Authentication → Providers → Google → **Enable**, paste Web Client ID + Web Client Secret

#### ⬜ 4c. Get Android SHA-1 fingerprint for Google
```bash
eas credentials --platform android
# Choose production profile → note the SHA-1 fingerprint
# Paste into Google Cloud Console Android OAuth client
```

### ⬜ 5. Host the privacy policy at a real URL
File exists at `assets/store-assets/privacy-policy.html`.
The URL `https://closetcraft.app/privacy` must resolve at submission time.
**Free hosting options:** GitHub Pages, Netlify, Vercel (deploy the HTML file).

---

## Fill in `eas.json`

Replace all placeholder values in `eas.json`:

```json
"submit": {
  "production": {
    "ios": {
      "appleId": "you@email.com",
      "ascAppId": "1234567890",
      "appleTeamId": "XXXXXXXXXX"
    },
    "android": {
      "serviceAccountKeyPath": "./google-play-key.json",
      "track": "internal"
    }
  }
}
```

- **appleId**: Your Apple ID email address
- **ascAppId**: Found in App Store Connect after creating the app listing (format: 10-digit number)
- **appleTeamId**: Found at developer.apple.com → Membership → Team ID (10 chars, e.g. `A1B2C3D4E5`)
- **google-play-key.json**: Downloaded from Google Play Console → Setup → API access → Service account

---

## App Store Connect Setup (iOS)

1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com) → **My Apps → +**
2. Register Bundle ID `com.closetcraft.app` in the [Certificates, IDs & Profiles portal](https://developer.apple.com/account/resources/identifiers/list) first
3. **App Name:** ClosetCraft — Closet Designer
4. **Primary Language:** English (U.S.)
5. Fill in all fields using `APP_STORE_METADATA.md`:
   - Description (full text ready)
   - Keywords: `closet,organizer,design,storage,cabinet,wardrobe,shelving,home,DIY,measure,AR`
   - Support URL (your website or GitHub page)
   - Privacy Policy URL: `https://closetcraft.app/privacy`
6. **Age Rating:** 4+
7. **Data Practices:** No data collected (all local, camera used only on-device)
8. **App Review Information:**
   - Notes: "All features work without login. To test AR: point camera at any wall and tap two points."
   - No demo credentials needed

---

## Google Play Console Setup

1. **Create app** → Package name: `com.closetcraft.app`
2. Fill store listing using `APP_STORE_METADATA.md`:
   - Short description (80 chars max — ready in metadata doc)
   - Full description (ready in metadata doc)
3. **Feature graphic required:** 1024×500px banner (Play Store exclusive — not needed for iOS)
4. **Data safety form:**
   - Camera: used on-device only, not transmitted
   - Local storage: yes (designs saved to device)
   - No data shared with third parties
   - No data collected for tracking
5. **Content rating questionnaire:** select "Not directed at children", no violence/mature content → **Everyone**
6. **Target API level:** SDK 54 targets API 34 (Android 14) automatically — no action needed

---

## Asset Checklist

| Asset | Required Size | Notes |
|---|---|---|
| App Icon | 1024×1024 PNG, **no transparency** | `assets/icon.png` — verify no alpha channel |
| Adaptive Icon (Android foreground) | 1024×1024 PNG, content in centre 66% | `assets/adaptive-icon.png` |
| Splash Screen | 1242×2688px minimum | `assets/splash.png` |
| **iOS Screenshots — 6.7" required** | 1290×2796px, min 3, max 10 | **Not yet created** |
| iOS Screenshots — 6.1" (optional) | 1179×2556px | Optional but recommended |
| **Android Screenshots — phone** | 1080×1920px minimum, min 2 | **Not yet created** |
| **Play Store Feature Graphic** | 1024×500px | **Not yet created** |

### Screenshots to Capture (per `APP_STORE_METADATA.md`)
Run in Simulator (iPhone 15 Pro Max for iOS, Pixel 7 for Android):
1. Home screen — hero shot with "New Design" button visible
2. AR camera measurement in action
3. 2D designer canvas with components placed
4. Component picker / material selector
5. Auth screen showing gradient header
6. Saved Designs screen

**iOS Simulator screenshot shortcut:** `Cmd + S`
**Android Emulator:** Extended Controls → Screenshot

---

## Build & Submit Commands

### Prerequisites
```bash
npm install -g eas-cli
eas login
```

### Production Builds (runs in Expo cloud — no Mac needed for iOS)
```bash
# iOS .ipa
eas build --platform ios --profile production

# Android .aab (recommended over .apk for Play Store)
eas build --platform android --profile production
```

### Test the Build Before Submitting
```bash
# Install on a physical device for final smoke test
# iOS: distribute via TestFlight after build
# Android: download .aab from EAS dashboard and install via adb
```

### Submit to Stores
```bash
# Submit to App Store (requires eas.json filled in)
eas submit --platform ios --profile production

# Submit to Google Play (requires google-play-key.json)
eas submit --platform android --profile production
```

---

## Recommended Submission Order

1. ✅ Remove/fix the "in" social button in AuthScreen
2. ✅ Apple + Google social sign-in implemented
3. ⬜ Host privacy policy HTML at a live URL
4. ⬜ Create Apple Developer account + register bundle ID
5. ⬜ Create Google Play Developer account
6. ⬜ Create app listings in both stores (gets you the `ascAppId`)
7. ⬜ Fill `eas.json` with real credentials
8. ⬜ Download Google Play service account key → save as `google-play-key.json`
9. ⬜ Take screenshots on simulator (iOS 6.7" + Android phone)
10. ⬜ Create Play Store feature graphic (1024×500)
11. ⬜ Verify `assets/icon.png` has no transparency (open in any image editor)
12. ⬜ Run `eas build --platform ios --profile production`
13. ⬜ Run `eas build --platform android --profile production`
14. ⬜ Test both builds on real devices
15. ⬜ Submit via `eas submit` or upload manually via Transporter (iOS) / Play Console (Android)
16. ⬜ Wait for review: Apple ~1–3 days, Google Play ~3–7 days for first submission

---

## Useful Links

- [Expo EAS Build docs](https://docs.expo.dev/build/introduction/)
- [Expo EAS Submit docs](https://docs.expo.dev/submit/introduction/)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Google Play Console](https://play.google.com/console)
- [Apple Certificates Portal](https://developer.apple.com/account/resources/identifiers/list)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy Center](https://play.google.com/about/developer-content-policy/)
