/**
 * ClosetCraft Phase 3.0 — Starter Templates
 *
 * 10 pre-built closet designs covering the most common configurations.
 * Components use { id, type, label, x, y, w, h } where x/y are pixels
 * at GRID.scale = 4px/inch, and w/h are in inches.
 */

import { generateId } from '../utils/constants';

// Helper to create a placed component at canvas coordinates
const c = (type, label, xIn, yIn, wIn, hIn) => ({
  id: generateId(),
  type,
  label,
  x: xIn * 4,
  y: yIn * 4,
  w: wIn,
  h: hIn,
});

export const TEMPLATES = [
  // ──────────────────────────────────────────────────────────────────
  // 1. Walk-in 8'×6' His & Hers
  // ──────────────────────────────────────────────────────────────────
  {
    id: 'walkin-8x6-hishers',
    name: "Walk-in 8'×6' His & Hers",
    description: 'Dual-zone walk-in for two people. Left side optimized for hanging, right side with drawers and shelving.',
    closetType: 'walkin',
    measurements: { width: 96, height: 96, depth: 72 },
    material: 'melamine-white',
    tags: ['walk-in', 'couple', 'large'],
    components: [
      // Left side — His (hanging-focused)
      c('double-hang', 'Double Hang', 0, 0, 36, 40),
      c('long-hang', 'Long Hang', 36, 0, 24, 64),
      c('shelf', 'Shelf', 0, 40, 36, 1),
      c('shelf', 'Shelf', 0, 52, 36, 1),
      c('shelf', 'Shelf', 0, 64, 36, 1),
      c('shelf', 'Shelf', 0, 76, 36, 1),
      // Right side — Hers (shelving + drawers)
      c('drawers-5', '5-Drawer', 60, 0, 18, 40),
      c('double-hang', 'Double Hang', 78, 0, 18, 40),
      c('shoe-rack', 'Shoes', 60, 40, 36, 18),
      c('shelf', 'Shelf', 60, 58, 36, 1),
      c('shelf', 'Shelf', 60, 70, 36, 1),
      c('shelf', 'Shelf', 60, 82, 36, 1),
      c('hooks', 'Hooks', 0, 88, 36, 4),
      c('jewelry-tray', 'Jewelry', 60, 88, 14, 3),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // 2. Walk-in 8'×6' Single Luxury
  // ──────────────────────────────────────────────────────────────────
  {
    id: 'walkin-8x6-luxury',
    name: "Walk-in 8'×6' Single Luxury",
    description: 'Spacious single-person walk-in with island, full hanging sections, and dedicated shoe and accessories areas.',
    closetType: 'walkin',
    measurements: { width: 96, height: 96, depth: 72 },
    material: 'wood-oak',
    tags: ['walk-in', 'single', 'luxury', 'large'],
    components: [
      c('long-hang', 'Long Hang', 0, 0, 30, 64),
      c('double-hang', 'Double Hang', 30, 0, 30, 40),
      c('shelf', 'Shelf', 30, 40, 30, 1),
      c('shelf', 'Shelf', 30, 52, 30, 1),
      c('shelf', 'Shelf', 30, 64, 30, 1),
      c('shelf', 'Shelf', 30, 76, 30, 1),
      c('drawers-5', '5-Drawer', 60, 0, 18, 40),
      c('drawers-3', '3-Drawer', 78, 0, 18, 24),
      c('shoe-rack', 'Shoes', 60, 40, 36, 18),
      c('island-unit', 'Island', 24, 40, 36, 36),
      c('shelf', 'Shelf', 0, 64, 30, 1),
      c('shelf', 'Shelf', 0, 76, 30, 1),
      c('shelf', 'Shelf', 0, 88, 30, 1),
      c('jewelry-tray', 'Jewelry', 60, 58, 14, 3),
      c('valet-rod', 'Valet', 74, 58, 14, 2),
      c('hooks', 'Hooks', 60, 72, 36, 4),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // 3. Walk-in 6'×6' Compact Efficient
  // ──────────────────────────────────────────────────────────────────
  {
    id: 'walkin-6x6-compact',
    name: "Walk-in 6'×6' Compact",
    description: 'Efficient use of a smaller walk-in space. Balanced mix of hanging, folded, and shoe storage.',
    closetType: 'walkin',
    measurements: { width: 72, height: 96, depth: 72 },
    material: 'melamine-white',
    tags: ['walk-in', 'compact', 'efficient'],
    components: [
      c('double-hang', 'Double Hang', 0, 0, 30, 40),
      c('long-hang', 'Long Hang', 30, 0, 18, 64),
      c('drawers-5', '5-Drawer', 48, 0, 18, 40),
      c('shelf', 'Shelf', 0, 40, 30, 1),
      c('shelf', 'Shelf', 0, 52, 30, 1),
      c('shelf', 'Shelf', 0, 64, 30, 1),
      c('shelf', 'Shelf', 0, 76, 30, 1),
      c('shoe-rack', 'Shoes', 48, 40, 24, 18),
      c('shelf', 'Shelf', 48, 58, 24, 1),
      c('shelf', 'Shelf', 48, 70, 24, 1),
      c('shelf', 'Shelf', 48, 82, 24, 1),
      c('hooks', 'Hooks', 0, 88, 30, 4),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // 4. Reach-in 6' Standard Bedroom
  // ──────────────────────────────────────────────────────────────────
  {
    id: 'reachin-6ft-standard',
    name: "Reach-in 6' Standard",
    description: 'Classic bedroom reach-in with double hang on left, shelving tower on right, and a full-length section.',
    closetType: 'reachin',
    measurements: { width: 72, height: 96, depth: 24 },
    material: 'melamine-white',
    tags: ['reach-in', 'standard', 'bedroom'],
    components: [
      c('double-hang', 'Double Hang', 0, 0, 30, 40),
      c('shelf', 'Shelf', 0, 40, 30, 1),
      c('shelf', 'Shelf', 0, 52, 30, 1),
      c('shelf', 'Shelf', 0, 64, 30, 1),
      c('shelf', 'Shelf', 0, 76, 30, 1),
      c('long-hang', 'Long Hang', 30, 0, 18, 64),
      c('drawers-3', '3-Drawer', 48, 0, 18, 24),
      c('shelf', 'Shelf', 48, 24, 18, 1),
      c('shelf', 'Shelf', 48, 36, 18, 1),
      c('shelf', 'Shelf', 48, 48, 18, 1),
      c('shelf', 'Shelf', 48, 60, 18, 1),
      c('shelf', 'Shelf', 48, 72, 18, 1),
      c('shelf', 'Shelf', 48, 84, 18, 1),
      c('shelf', 'Top Shelf', 0, 0, 72, 1),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // 5. Reach-in 8' Primary Bedroom
  // ──────────────────────────────────────────────────────────────────
  {
    id: 'reachin-8ft-primary',
    name: "Reach-in 8' Primary",
    description: 'Generous primary bedroom reach-in with double hang zone, tower unit, long hang, and shoe shelf.',
    closetType: 'reachin',
    measurements: { width: 96, height: 96, depth: 24 },
    material: 'melamine-almond',
    tags: ['reach-in', 'primary', 'large'],
    components: [
      c('double-hang', 'Double Hang', 0, 0, 36, 40),
      c('shelf', 'Shelf', 0, 40, 36, 1),
      c('shelf', 'Shelf', 0, 52, 36, 1),
      c('shelf', 'Shelf', 0, 64, 36, 1),
      c('shelf', 'Shelf', 0, 76, 36, 1),
      c('drawers-5', '5-Drawer', 36, 0, 18, 40),
      c('shoe-rack', 'Shoes', 36, 40, 18, 18),
      c('shelf', 'Shelf', 36, 58, 18, 1),
      c('shelf', 'Shelf', 36, 70, 18, 1),
      c('shelf', 'Shelf', 36, 82, 18, 1),
      c('long-hang', 'Long Hang', 54, 0, 24, 64),
      c('shelf', 'Shelf', 54, 64, 24, 1),
      c('shelf', 'Shelf', 54, 76, 24, 1),
      c('shelf', 'Shelf', 54, 88, 24, 1),
      c('cubbies', 'Cubbies', 78, 0, 18, 36),
      c('shelf', 'Shelf', 78, 36, 18, 1),
      c('shelf', 'Shelf', 78, 48, 18, 1),
      c('shelf', 'Shelf', 78, 60, 18, 1),
      c('shelf', 'Shelf', 78, 72, 18, 1),
      c('shelf', 'Shelf', 78, 84, 18, 1),
      c('shelf', 'Top Shelf', 0, 0, 96, 1),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // 6. Reach-in 4' Kids Room
  // ──────────────────────────────────────────────────────────────────
  {
    id: 'reachin-4ft-kids',
    name: "Reach-in 4' Kids",
    description: "Kid-height design with lower hanging rod, cubby storage for toys/shoes, and grow-with-me upper shelf.",
    closetType: 'reachin',
    measurements: { width: 48, height: 96, depth: 24 },
    material: 'melamine-white',
    tags: ['reach-in', 'kids', 'compact'],
    components: [
      // Lower section (kid height)
      c('double-hang', 'Kids Hang', 0, 20, 24, 36),
      c('cubbies', 'Cubbies', 24, 20, 24, 36),
      // Upper section (parent reach)
      c('shelf', 'Shelf', 0, 0, 48, 1),
      c('shelf', 'Shelf', 0, 56, 48, 1),
      c('shelf', 'Shelf', 0, 68, 48, 1),
      c('shelf', 'Shelf', 0, 80, 48, 1),
      c('hooks', 'Hooks', 0, 92, 24, 4),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // 7. Reach-in 3' Hallway / Linen
  // ──────────────────────────────────────────────────────────────────
  {
    id: 'reachin-3ft-hallway',
    name: "Reach-in 3' Hallway/Linen",
    description: 'Narrow utility closet maximized for linen and household storage with adjustable shelving throughout.',
    closetType: 'reachin',
    measurements: { width: 36, height: 96, depth: 24 },
    material: 'melamine-white',
    tags: ['reach-in', 'hallway', 'linen', 'utility'],
    components: [
      c('shelf', 'Linen Shelf', 0, 0, 36, 1),
      c('shelf', 'Linen Shelf', 0, 14, 36, 1),
      c('shelf', 'Linen Shelf', 0, 28, 36, 1),
      c('shelf', 'Towel Shelf', 0, 42, 36, 1),
      c('shelf', 'Towel Shelf', 0, 56, 36, 1),
      c('shelf', 'Supply Shelf', 0, 70, 36, 1),
      c('shelf', 'Supply Shelf', 0, 80, 36, 1),
      c('basket', 'Basket', 0, 88, 30, 8),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // 8. Reach-in 2.5' Coat Closet
  // ──────────────────────────────────────────────────────────────────
  {
    id: 'reachin-25ft-coat',
    name: "Reach-in 2.5' Coat Closet",
    description: 'Compact coat closet with single hang rod for outerwear, upper shelf for hats/bags, and boot space below.',
    closetType: 'reachin',
    measurements: { width: 30, height: 96, depth: 24 },
    material: 'melamine-white',
    tags: ['reach-in', 'coat', 'entry'],
    components: [
      c('shelf', 'Hat/Bag Shelf', 0, 0, 30, 1),
      c('long-hang', 'Coat Hang', 0, 14, 30, 64),
      c('shelf', 'Boot Shelf', 0, 78, 30, 1),
      c('hooks', 'Hooks', 0, 88, 30, 4),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // 9. L-Shaped Walk-in Corner Layout
  // ──────────────────────────────────────────────────────────────────
  {
    id: 'walkin-lshaped-corner',
    name: 'L-Shaped Walk-in Corner',
    description: 'Corner walk-in using two walls efficiently. Hanging on the long wall, shelving/drawers on the short wall.',
    closetType: 'walkin',
    measurements: { width: 96, height: 96, depth: 96 },
    material: 'melamine-gray',
    tags: ['walk-in', 'l-shaped', 'corner'],
    components: [
      // Long wall (bottom of canvas = back wall)
      c('double-hang', 'Double Hang', 0, 0, 36, 40),
      c('long-hang', 'Long Hang', 36, 0, 30, 64),
      c('shelf', 'Shelf', 0, 40, 36, 1),
      c('shelf', 'Shelf', 0, 52, 36, 1),
      c('shelf', 'Shelf', 0, 64, 36, 1),
      c('shelf', 'Shelf', 0, 76, 36, 1),
      // Short wall (right side)
      c('drawers-5', '5-Drawer', 66, 0, 18, 40),
      c('shoe-rack', 'Shoes', 66, 40, 18, 18),
      c('shelf', 'Shelf', 66, 58, 18, 1),
      c('shelf', 'Shelf', 66, 70, 18, 1),
      c('shelf', 'Shelf', 66, 82, 18, 1),
      c('corner-shelf', 'Corner', 66, 0, 24, 12),
      c('hooks', 'Hooks', 84, 40, 12, 4),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // 10. Wardrobe 4' Freestanding
  // ──────────────────────────────────────────────────────────────────
  {
    id: 'wardrobe-4ft-freestanding',
    name: "Wardrobe 4' Freestanding",
    description: 'Space-efficient freestanding wardrobe with hanging section, drawers, and open cubby storage.',
    closetType: 'wardrobe',
    measurements: { width: 48, height: 84, depth: 24 },
    material: 'wood-walnut',
    tags: ['wardrobe', 'freestanding', 'apartment'],
    components: [
      c('shelf', 'Top Shelf', 0, 0, 48, 1),
      c('long-hang', 'Long Hang', 0, 4, 24, 64),
      c('drawers-3', '3-Drawer', 24, 4, 18, 24),
      c('cubbies', 'Cubbies', 24, 28, 18, 36),
      c('shoe-rack', 'Shoes', 0, 68, 24, 12),
      c('shelf', 'Shelf', 24, 64, 24, 1),
      c('shelf', 'Shelf', 24, 76, 24, 1),
    ],
  },
];

export default TEMPLATES;
