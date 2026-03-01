/**
 * ClosetCraft Phase 3.0 — AI Layout Engine
 *
 * Rule-based layout generator. No API dependency — works fully offline.
 * Follows NKBA closet design guidelines and ergonomic reach zones.
 *
 * Reach zones:
 *   Zone A (floor to 36"): shoe racks, drawers, floor-level items
 *   Zone B (36"–72"):      hanging rods, cubbies — primary ergonomic zone
 *   Zone C (72"–ceiling):  high shelves for seasonal/rarely used items
 */

import { generateId, COMPONENTS } from './constants';

// ─── Constants ────────────────────────────────────────────────────

const CANVAS_SCALE = 4; // px per inch (matches GRID.scale)

// How much width each wardrobe type claims (as fraction of total)
const MIX_RATIOS = {
  hanging: { hanging: 0.65, shelving: 0.25, drawers: 0.10 },
  folded:  { hanging: 0.25, shelving: 0.50, drawers: 0.25 },
  mixed:   { hanging: 0.45, shelving: 0.35, drawers: 0.20 },
};

// Drawer size preference
const DRAWER_CONFIG = {
  minimal:  { unit: 'drawers-3', count: 1 },
  moderate: { unit: 'drawers-5', count: 1 },
  lots:     { unit: 'drawers-5', count: 2 },
};

// Shoe rack allocation (width in inches)
const SHOE_CONFIG = {
  few:       { racks: 1, rackW: 24 },
  moderate:  { racks: 2, rackW: 24 },
  collector: { racks: 3, rackW: 24 },
};

// ─── Helpers ──────────────────────────────────────────────────────

function mkComp(type, label, xIn, yIn, wIn, hIn) {
  const def = COMPONENTS.find(c => c.id === type) || {};
  return {
    id: generateId(),
    type,
    label,
    x: Math.round(xIn) * CANVAS_SCALE,
    y: Math.round(yIn) * CANVAS_SCALE,
    w: Math.round(wIn),
    h: hIn ?? def.h ?? 12,
  };
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Calculate the % of wall area covered by placed components.
 */
function calculateEfficiency(components, dims) {
  const wallArea = dims.width * dims.height;
  if (wallArea === 0) return 0;
  const usedArea = components.reduce((sum, c) => sum + (c.w * c.h), 0);
  return Math.round(clamp((usedArea / wallArea) * 100, 0, 98));
}

/**
 * Fill vertical space above a component up to the ceiling with shelves.
 * Returns shelf components stacked from `startY` to `dims.height`.
 */
function fillWithShelves(x, startY, w, totalHeight, label = 'Shelf') {
  const shelves = [];
  let y = startY;
  const spacing = 14; // 14" between shelves
  while (y + spacing <= totalHeight - 4) {
    shelves.push(mkComp('shelf', label, x, y, w, 1));
    y += spacing;
  }
  return shelves;
}

// ─── Layout Builders ──────────────────────────────────────────────

/**
 * Build a balanced "Efficiency" layout: maximise storage density.
 * Left zone: double hang + upper shelves
 * Mid zone: drawers + shoe rack
 * Right zone: long hang or shelving tower
 */
function buildEfficiencyLayout(dims, profile) {
  const { width, height } = dims;
  const components = [];

  const drawCfg = DRAWER_CONFIG[profile.drawerAmount];
  const shoeCfg = SHOE_CONFIG[profile.shoeCount];

  // Widths
  const drawerW = 18 * drawCfg.count;
  const shoeW = shoeCfg.rackW * shoeCfg.racks;
  const rightW = clamp(width * 0.35, 18, 48);
  const leftW = width - drawerW - rightW;

  // Left: double hang + upper shelves
  components.push(mkComp('double-hang', 'Double Hang', 0, 0, leftW, 40));
  components.push(...fillWithShelves(0, 40, leftW, height));

  // Mid: drawers stacked, shoe rack below
  for (let i = 0; i < drawCfg.count; i++) {
    const def = COMPONENTS.find(c => c.id === drawCfg.unit);
    components.push(mkComp(drawCfg.unit, i === 0 ? 'Drawers' : 'Drawers 2',
      leftW + i * 18, 0, 18, def.h));
    const stackTop = def.h;
    for (let j = 0; j < shoeCfg.racks; j++) {
      components.push(mkComp('shoe-rack', 'Shoes', leftW + i * 18, stackTop + j * 18, 18, 18));
    }
    components.push(...fillWithShelves(leftW + i * 18, stackTop + shoeCfg.racks * 18, 18, height));
  }

  // Right: long hang or tower
  if (profile.wardrobeMix === 'hanging') {
    components.push(mkComp('long-hang', 'Long Hang', leftW + drawerW, 0, rightW, 64));
    components.push(...fillWithShelves(leftW + drawerW, 64, rightW, height));
  } else {
    components.push(...fillWithShelves(leftW + drawerW, 0, rightW, height));
  }

  // Accessories
  if (profile.accessories) {
    components.push(mkComp('hooks', 'Hooks', 0, height - 4, clamp(width * 0.4, 12, 48), 4));
    components.push(mkComp('jewelry-tray', 'Jewelry', leftW + drawerW, height - 4, 14, 3));
  }

  return components;
}

/**
 * Build a "Balanced" layout: equal mix of hanging and folded storage.
 */
function buildBalancedLayout(dims, profile) {
  const { width, height } = dims;
  const components = [];

  const leftW = Math.floor(width * 0.4);
  const midW = Math.floor(width * 0.3);
  const rightW = width - leftW - midW;
  const drawCfg = DRAWER_CONFIG[profile.drawerAmount];
  const shoeCfg = SHOE_CONFIG[profile.shoeCount];

  // Left: double hang + shelves below
  components.push(mkComp('double-hang', 'Double Hang', 0, 0, leftW, 40));
  components.push(...fillWithShelves(0, 40, leftW, height));

  // Mid: long hang
  components.push(mkComp('long-hang', 'Long Hang', leftW, 0, midW, 64));
  components.push(...fillWithShelves(leftW, 64, midW, height));

  // Right: drawers + shoe + shelves
  const def = COMPONENTS.find(c => c.id === drawCfg.unit);
  components.push(mkComp(drawCfg.unit, 'Drawers', leftW + midW, 0, rightW, def.h));
  let rightY = def.h;
  for (let j = 0; j < shoeCfg.racks && rightW >= 18; j++) {
    components.push(mkComp('shoe-rack', 'Shoes', leftW + midW, rightY, rightW, 18));
    rightY += 18;
  }
  components.push(...fillWithShelves(leftW + midW, rightY, rightW, height));

  if (profile.accessories) {
    components.push(mkComp('valet-rod', 'Valet Rod', leftW, height - 6, 14, 2));
  }

  return components;
}

/**
 * Build a "Maximum Hanging" layout: prioritise long-hang and double-hang.
 */
function buildMaxHangingLayout(dims, profile) {
  const { width, height } = dims;
  const components = [];

  const drawerW = 18;
  const hanging1 = Math.floor((width - drawerW) * 0.55);
  const hanging2 = width - drawerW - hanging1;

  // Two hanging zones
  components.push(mkComp('double-hang', 'Double Hang', 0, 0, hanging1, 40));
  components.push(...fillWithShelves(0, 40, hanging1, height));

  components.push(mkComp('long-hang', 'Long Hang', hanging1, 0, hanging2, 64));
  components.push(...fillWithShelves(hanging1, 64, hanging2, height));

  // Narrow drawer tower on the right
  const def = COMPONENTS.find(c => c.id === 'drawers-3');
  components.push(mkComp('drawers-3', 'Drawers', hanging1 + hanging2, 0, drawerW, def.h));

  const shoeCfg = SHOE_CONFIG[profile.shoeCount];
  let rightY = def.h;
  if (width - (hanging1 + hanging2) >= 18) {
    components.push(mkComp('shoe-rack', 'Shoes', hanging1 + hanging2, rightY, drawerW, 18));
    rightY += 18;
  }
  components.push(...fillWithShelves(hanging1 + hanging2, rightY, drawerW, height));

  if (profile.accessories) {
    components.push(mkComp('hooks', 'Hooks', 0, height - 4, hanging1, 4));
  }

  // Extra pants rack for couple/family
  if (profile.users !== 'single' && hanging2 >= 18) {
    components.push(mkComp('pants-rack', 'Pants Rack', hanging1, height - 8, 20, 4));
  }

  return components;
}

// ─── Public API ───────────────────────────────────────────────────

/**
 * Generate 3 layout options for a given closet and user profile.
 *
 * @param {object} closetDims  - { width, height, depth } in inches
 * @param {object} profile     - user preferences (see WIZARD_QUESTIONS)
 * @returns {LayoutOption[]}   - array of 3 layout options
 */
export function generateLayouts(closetDims, profile) {
  const dims = {
    width: clamp(closetDims.width || 72, 24, 240),
    height: clamp(closetDims.height || 96, 72, 120),
    depth: closetDims.depth || 24,
  };

  const layouts = [
    {
      id: generateId(),
      name: 'Efficiency',
      description: 'Maximises storage density. Best for smaller closets or those who need every inch.',
      variant: 'efficiency',
      components: buildEfficiencyLayout(dims, profile),
    },
    {
      id: generateId(),
      name: 'Balanced',
      description: 'Equal mix of hanging space and shelving. Great for a versatile wardrobe.',
      variant: 'balanced',
      components: buildBalancedLayout(dims, profile),
    },
    {
      id: generateId(),
      name: 'Max Hanging',
      description: 'Prioritises hanging rods. Ideal for large wardrobes with many garments.',
      variant: 'max-hanging',
      components: buildMaxHangingLayout(dims, profile),
    },
  ];

  // Attach efficiency scores
  layouts.forEach(layout => {
    layout.efficiencyScore = calculateEfficiency(layout.components, dims);
  });

  return layouts;
}

/**
 * Wizard question definitions.
 * Each has: id, question, options array (each with value + label).
 */
export const WIZARD_QUESTIONS = [
  {
    id: 'users',
    question: 'Who will use this closet?',
    hint: 'We\'ll optimise the layout for your household',
    options: [
      { value: 'single', label: 'Just me', icon: '🧍' },
      { value: 'couple', label: 'Two people', icon: '👫' },
      { value: 'family', label: 'Family', icon: '👨‍👩‍👧' },
    ],
  },
  {
    id: 'wardrobeMix',
    question: "What's your wardrobe mix?",
    hint: 'This determines the hanging vs. shelf ratio',
    options: [
      { value: 'hanging', label: 'Mostly hanging', icon: '👗' },
      { value: 'mixed', label: '50/50 mix', icon: '⚖️' },
      { value: 'folded', label: 'Mostly folded', icon: '👕' },
    ],
  },
  {
    id: 'shoeCount',
    question: 'How many shoes do you have?',
    hint: "We'll size the shoe storage accordingly",
    options: [
      { value: 'few', label: 'Few (under 10 pairs)', icon: '👟' },
      { value: 'moderate', label: 'Moderate (10–30)', icon: '👠' },
      { value: 'collector', label: 'Collector (30+)', icon: '👑' },
    ],
  },
  {
    id: 'accessories',
    question: 'Need a dedicated accessories area?',
    hint: 'Belts, scarves, jewelry, bags',
    options: [
      { value: true, label: 'Yes please', icon: '💎' },
      { value: false, label: 'Not needed', icon: '✕' },
    ],
  },
  {
    id: 'drawerAmount',
    question: 'How much drawer space?',
    hint: 'Drawers are great for folded items, socks, and undies',
    options: [
      { value: 'minimal', label: 'Minimal', icon: '📦' },
      { value: 'moderate', label: 'Moderate', icon: '🗃️' },
      { value: 'lots', label: 'Lots', icon: '🗄️' },
    ],
  },
];
