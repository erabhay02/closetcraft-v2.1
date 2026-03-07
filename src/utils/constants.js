// ─── Theme Colors ─────────────────────────────────────────────────
export const COLORS = {
  // Primary palette
  bg: '#0f1019',
  bgCard: '#181825',
  bgElevated: '#1e1e30',
  bgOverlay: 'rgba(0,0,0,0.6)',
  
  // Brand
  gold: '#e2b97f',
  goldDark: '#c49a5c',
  goldLight: '#f0d4a8',
  goldMuted: 'rgba(226,185,127,0.15)',
  
  // Accent
  blue: '#6b8e9e',
  green: '#7b9e6b',
  red: '#c45c5c',
  purple: '#9e6b8e',
  
  // Text
  textPrimary: '#f0e6d3',
  textSecondary: '#8899b0',
  textMuted: '#556677',
  
  // Borders
  border: 'rgba(255,255,255,0.06)',
  borderActive: 'rgba(226,185,127,0.4)',
};

// ─── Typography ───────────────────────────────────────────────────
export const FONTS = {
  heading: 'System', // Replace with custom font on native
  body: 'System',
  mono: 'Courier',
};

// ─── Room Types ───────────────────────────────────────────────────
export const ROOM_TYPES = [
  { id: 'primary', label: 'Primary Bedroom', icon: '👑', desc: 'Walk-in or reach-in closet' },
  { id: 'secondary', label: 'Secondary Room', icon: '🚪', desc: 'Standard reach-in closet' },
  { id: 'hallway', label: 'Hallway / Linen', icon: '🏠', desc: 'Narrow utility closet' },
  { id: 'custom', label: 'Custom Space', icon: '✏️', desc: 'Define your own dimensions' },
];

// ─── Closet Types ─────────────────────────────────────────────────
export const CLOSET_TYPES = [
  { id: 'walkin', label: 'Walk-In', minWidth: 60, defaultWidth: 96, defaultDepth: 72, icon: '🚶' },
  { id: 'reachin', label: 'Reach-In', minWidth: 36, defaultWidth: 72, defaultDepth: 24, icon: '📦' },
  { id: 'wardrobe', label: 'Wardrobe', minWidth: 30, defaultWidth: 48, defaultDepth: 24, icon: '🗄️' },
];

// ─── Material Options ─────────────────────────────────────────────
export const MATERIALS = [
  { id: 'melamine-white', label: 'White Melamine', color: '#e8e4de', pattern: 'solid' },
  { id: 'melamine-almond', label: 'Almond Melamine', color: '#d4c5a9', pattern: 'solid' },
  { id: 'melamine-gray', label: 'Slate Gray', color: '#8a8d8f', pattern: 'solid' },
  { id: 'wood-oak', label: 'Natural Oak', color: '#c4a265', pattern: 'wood' },
  { id: 'wood-walnut', label: 'Dark Walnut', color: '#5a3e2b', pattern: 'wood' },
  { id: 'wood-maple', label: 'Maple', color: '#d4a76a', pattern: 'wood' },
  { id: 'wood-cherry', label: 'Cherry', color: '#8b4513', pattern: 'wood' },
  { id: 'lam-espresso', label: 'Espresso Laminate', color: '#3c2415', pattern: 'solid' },
  { id: 'wire-chrome', label: 'Chrome Wire', color: '#c0c0c0', pattern: 'wire' },
  { id: 'wire-white', label: 'White Wire', color: '#f0f0f0', pattern: 'wire' },
];

// ─── Closet Components ────────────────────────────────────────────
export const COMPONENTS = [
  {
    id: 'shelf',
    label: 'Shelf',
    icon: '📏',
    color: '#B8956A',
    category: 'shelving',
    h: 1,
    defaultW: 24,
    minW: 12,
    maxW: 96,
    description: 'Standard flat shelf for folded items',
    tips: 'Space shelves 10-12" apart for folded clothes, 7-8" for shoes',
  },
  {
    id: 'double-hang',
    label: 'Double Hang Rod',
    icon: '👔',
    color: '#7B9E6B',
    category: 'hanging',
    h: 40,
    defaultW: 24,
    minW: 18,
    maxW: 48,
    description: 'Two hanging rods stacked vertically',
    tips: 'Top rod at 80", bottom at 40". Great for shirts, jackets, folded pants',
  },
  {
    id: 'long-hang',
    label: 'Long Hang Rod',
    icon: '👗',
    color: '#6B8E9E',
    category: 'hanging',
    h: 64,
    defaultW: 24,
    minW: 18,
    maxW: 48,
    description: 'Full-length hanging for dresses and coats',
    tips: 'Rod at 68-72" from floor. Allow 3-4" per garment width',
  },
  {
    id: 'drawers-3',
    label: '3-Drawer Unit',
    icon: '🗃️',
    color: '#9E6B8E',
    category: 'drawers',
    h: 24,
    defaultW: 18,
    minW: 15,
    maxW: 30,
    description: 'Three-drawer stack for small items',
    tips: 'Ideal for socks, underwear, accessories. Place at waist height',
  },
  {
    id: 'drawers-5',
    label: '5-Drawer Unit',
    icon: '🗄️',
    color: '#8E6B9E',
    category: 'drawers',
    h: 40,
    defaultW: 18,
    minW: 15,
    maxW: 30,
    description: 'Five-drawer stack for versatile storage',
    tips: 'Good for folded clothes, linens. Bottom drawers for heavier items',
  },
  {
    id: 'shoe-rack',
    label: 'Shoe Rack',
    icon: '👟',
    color: '#9E8E6B',
    category: 'specialty',
    h: 18,
    defaultW: 24,
    minW: 18,
    maxW: 36,
    description: 'Angled slat shoe display',
    tips: 'Allow 7" per shelf. Angle at 15-20° for easy viewing',
  },
  {
    id: 'cubbies',
    label: 'Cubby Unit',
    icon: '📦',
    color: '#6B9E8E',
    category: 'shelving',
    h: 36,
    defaultW: 24,
    minW: 18,
    maxW: 36,
    description: 'Open compartment storage',
    tips: '12-14" squares work for most items. Use baskets for small things',
  },
  {
    id: 'basket',
    label: 'Pull-Out Basket',
    icon: '🧺',
    color: '#9E7B6B',
    category: 'specialty',
    h: 12,
    defaultW: 18,
    minW: 12,
    maxW: 30,
    description: 'Wire pull-out basket for laundry or accessories',
    tips: 'Great for laundry, scarves, belts. Install on full-extension slides',
  },
  {
    id: 'hooks',
    label: 'Hook Rail',
    icon: '🪝',
    color: '#6B7B9E',
    category: 'specialty',
    h: 4,
    defaultW: 24,
    minW: 12,
    maxW: 48,
    description: 'Wall-mounted hooks for bags and accessories',
    tips: 'Install at 60-65" height. Space hooks 6-8" apart',
  },
  {
    id: 'valet-rod',
    label: 'Valet Rod',
    icon: '🔧',
    color: '#8E9E6B',
    category: 'specialty',
    h: 2,
    defaultW: 14,
    minW: 12,
    maxW: 18,
    description: 'Pull-out rod for outfit planning',
    tips: 'Install at chest height near mirror or dressing area',
  },
  {
    id: 'jewelry-tray',
    label: 'Jewelry Tray',
    icon: '💎',
    color: '#B89E6B',
    category: 'specialty',
    h: 3,
    defaultW: 14,
    minW: 10,
    maxW: 20,
    description: 'Velvet-lined pull-out jewelry organizer',
    tips: 'Install at waist to chest height for easy access',
  },
  {
    id: 'hamper',
    label: 'Tilt-Out Hamper',
    icon: '🧺',
    color: '#7B8E6B',
    category: 'specialty',
    h: 28,
    defaultW: 18,
    minW: 14,
    maxW: 24,
    description: 'Built-in laundry hamper with tilt front',
    tips: 'Place at floor level near closet entrance for convenience',
  },
  // ─── Phase 3 Components ─────────────────────────────────────────
  {
    id: 'sliding-doors',
    label: 'Sliding Doors',
    icon: '🚪',
    color: '#A0B4C8',
    category: 'specialty',
    h: 96,
    defaultW: 72,
    minW: 48,
    maxW: 120,
    description: 'Sliding closet doors (mirror, panel, or glass)',
    tips: 'Doors overlap 2" at center. Allow clearance for door track depth',
  },
  {
    id: 'led-strip',
    label: 'LED Light Strip',
    icon: '💡',
    color: '#FFD580',
    category: 'specialty',
    h: 2,
    defaultW: 24,
    minW: 12,
    maxW: 96,
    description: 'Under-shelf or hanging rod lighting strip',
    tips: 'Install under shelves or above hanging rods for optimal illumination',
  },
  {
    id: 'tie-rack',
    label: 'Tie/Belt Rack',
    icon: '🎀',
    color: '#9E7BAE',
    category: 'specialty',
    h: 16,
    defaultW: 14,
    minW: 10,
    maxW: 20,
    description: 'Pull-out organizer for ties and belts',
    tips: 'Install at chest height for easy access. Holds 20-30 ties per rack',
  },
  {
    id: 'pants-rack',
    label: 'Pants Rack',
    icon: '👖',
    color: '#7B9E7B',
    category: 'hanging',
    h: 36,
    defaultW: 20,
    minW: 14,
    maxW: 28,
    description: 'Pull-out trouser hanger with multiple bars',
    tips: 'Each bar holds 3-4 pairs. Install at waist to chest height',
  },
  {
    id: 'laundry-sorter',
    label: 'Laundry Sorter',
    icon: '🛍️',
    color: '#8E9E7B',
    category: 'specialty',
    h: 40,
    defaultW: 24,
    minW: 20,
    maxW: 36,
    description: 'Multi-bag laundry sorting station',
    tips: 'Place near closet entrance. 2-3 bag configuration for sorting by color',
  },
  {
    id: 'safe-lockbox',
    label: 'Safe/Lockbox',
    icon: '🔒',
    color: '#6B6B7B',
    category: 'specialty',
    h: 14,
    defaultW: 16,
    minW: 12,
    maxW: 24,
    description: 'Built-in safe placeholder for valuables',
    tips: 'Anchor to wall studs. Conceal behind clothing or in a lower shelf',
  },
  {
    id: 'island-unit',
    label: 'Island Unit',
    icon: '🏝️',
    color: '#9E8E6B',
    category: 'shelving',
    h: 36,
    defaultW: 36,
    minW: 24,
    maxW: 60,
    description: 'Center island with drawers for walk-in closets',
    tips: 'Allow 36" clearance on all sides. Great for folded items and accessories',
  },
  {
    id: 'corner-shelf',
    label: 'Corner Shelf',
    icon: '📐',
    color: '#7B8E9E',
    category: 'shelving',
    h: 12,
    defaultW: 24,
    minW: 18,
    maxW: 36,
    description: 'L-shaped corner-optimized shelving unit',
    tips: 'Maximizes dead corner space. Install at any height for folded items',
  },
];

// ─── Component Categories ─────────────────────────────────────────
export const CATEGORIES = [
  { id: 'all', label: 'All', icon: '📋' },
  { id: 'hanging', label: 'Hanging', icon: '👔' },
  { id: 'shelving', label: 'Shelving', icon: '📏' },
  { id: 'drawers', label: 'Drawers', icon: '🗃️' },
  { id: 'specialty', label: 'Specialty', icon: '⭐' },
];

// ─── AR Measurement Config ────────────────────────────────────────
export const AR_CONFIG = {
  minDistance: 6,        // minimum measurable distance in inches
  maxDistance: 300,      // maximum measurable distance in inches
  accuracyThreshold: 2,  // acceptable accuracy in inches
  calibrationPoints: 3,  // number of calibration taps needed
  guidelineColor: '#e2b97f',
};

// ─── Design Grid ──────────────────────────────────────────────────
export const GRID = {
  scale: 4,              // pixels per inch on designer canvas
  snapSize: 4,           // snap to 4px (1 inch) grid
  majorGridEvery: 12,    // major gridline every 12 inches (1 foot)
};

// ─── Storage Keys ─────────────────────────────────────────────────
export const STORAGE_KEYS = {
  designs: 'closetcraft_designs',
  settings: 'closetcraft_settings',
  onboarded: 'closetcraft_onboarded',
  lastDesign: 'closetcraft_last_design',
};

// ─── Helper Functions ─────────────────────────────────────────────
export const inToDisplay = (inches) => {
  const ft = Math.floor(inches / 12);
  const inc = Math.round(inches % 12);
  if (ft > 0 && inc > 0) return `${ft}'${inc}"`;
  if (ft > 0) return `${ft}'0"`;
  return `${inc}"`;
};

export const inToCm = (inches) => (inches * 2.54).toFixed(1);
export const cmToIn = (cm) => (cm / 2.54);
export const generateId = () => Math.random().toString(36).substr(2, 9);
export const snapToGrid = (val, grid = GRID.snapSize) => Math.round(val / grid) * grid;

// ─── Supabase Config (Phase 3.1) ──────────────────────────────────
// Replace these placeholder values with your real Supabase project credentials
export const SUPABASE_CONFIG = {
  url: 'https://iahfiwvrgfivtgujeecu.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhaGZpd3ZyZ2ZpdnRndWplZWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MDgwMTAsImV4cCI6MjA4NjE4NDAxMH0.sBYdp1qUQeLOAiRQNaqIujRaB3ugEelJn06HuLookgs',
};
