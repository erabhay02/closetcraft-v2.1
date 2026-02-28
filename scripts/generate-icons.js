/**
 * generate-icons.js
 * 
 * Generates all required app icon sizes for iOS and Android
 * from a single 1024x1024 source icon.
 * 
 * Usage:
 *   node scripts/generate-icons.js
 * 
 * Prerequisites:
 *   npm install sharp
 * 
 * Or use Expo's built-in icon generation:
 *   Just provide a 1024x1024 icon.png in the assets folder
 *   and Expo will auto-generate all sizes during build.
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SOURCE_ICON = path.join(__dirname, '..', 'assets', 'icon-source.png');
const OUTPUT_DIR = path.join(__dirname, '..', 'assets', 'generated-icons');

// All required sizes
const SIZES = {
  // iOS
  'ios-20@2x.png': 40,
  'ios-20@3x.png': 60,
  'ios-29@2x.png': 58,
  'ios-29@3x.png': 87,
  'ios-40@2x.png': 80,
  'ios-40@3x.png': 120,
  'ios-60@2x.png': 120,
  'ios-60@3x.png': 180,
  'ios-76@2x.png': 152,
  'ios-83.5@2x.png': 167,
  'ios-1024.png': 1024,
  
  // Android
  'android-mdpi.png': 48,
  'android-hdpi.png': 72,
  'android-xhdpi.png': 96,
  'android-xxhdpi.png': 144,
  'android-xxxhdpi.png': 192,
  'android-playstore.png': 512,
  
  // Expo
  'icon.png': 1024,
  'adaptive-icon.png': 1024,
  'favicon.png': 48,
  'splash-icon.png': 200,
};

async function generateIcons() {
  if (!fs.existsSync(SOURCE_ICON)) {
    console.log('⚠️  No source icon found at assets/icon-source.png');
    console.log('   Creating a placeholder icon...');
    
    // Generate a simple placeholder icon
    const svg = `
      <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1a1a2e"/>
            <stop offset="100%" style="stop-color:#0f3460"/>
          </linearGradient>
        </defs>
        <rect width="1024" height="1024" rx="180" fill="url(#bg)"/>
        
        <!-- Closet outline -->
        <rect x="280" y="200" width="464" height="624" rx="20" fill="none" 
              stroke="#e2b97f" stroke-width="24"/>
        
        <!-- Shelves -->
        <line x1="304" y1="400" x2="720" y2="400" stroke="#e2b97f" stroke-width="12" stroke-linecap="round"/>
        <line x1="304" y1="540" x2="720" y2="540" stroke="#e2b97f" stroke-width="12" stroke-linecap="round"/>
        <line x1="304" y1="680" x2="720" y2="680" stroke="#e2b97f" stroke-width="12" stroke-linecap="round"/>
        
        <!-- Hanging rod -->
        <line x1="360" y1="280" x2="660" y2="280" stroke="#c49a5c" stroke-width="10" stroke-linecap="round"/>
        
        <!-- Hangers -->
        <path d="M420 280 L420 260 Q420 240 440 240 L480 240 Q500 240 500 260 L500 280" 
              fill="none" stroke="#c49a5c" stroke-width="6" stroke-linecap="round"/>
        <path d="M530 280 L530 260 Q530 240 550 240 L590 240 Q610 240 610 260 L610 280" 
              fill="none" stroke="#c49a5c" stroke-width="6" stroke-linecap="round"/>
      </svg>
    `;
    
    await sharp(Buffer.from(svg)).png().toFile(SOURCE_ICON);
    console.log('   ✅ Placeholder icon created\n');
  }

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('Generating icons from', SOURCE_ICON);
  console.log('Output directory:', OUTPUT_DIR);
  console.log('');

  for (const [filename, size] of Object.entries(SIZES)) {
    const outputPath = path.join(OUTPUT_DIR, filename);
    await sharp(SOURCE_ICON)
      .resize(size, size, { fit: 'contain', background: { r: 26, g: 26, b: 46, alpha: 1 } })
      .png()
      .toFile(outputPath);
    console.log(`  ✅ ${filename} (${size}×${size})`);
  }

  console.log(`\n✅ Generated ${Object.keys(SIZES).length} icons`);
  console.log('\nNext steps:');
  console.log('  1. Copy icon.png and adaptive-icon.png to /assets/');
  console.log('  2. Run: eas build --platform all');
}

generateIcons().catch(console.error);
