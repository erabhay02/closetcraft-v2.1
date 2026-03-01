/**
 * ClosetCraft Phase 3.2 — Cut List Optimizer
 *
 * Generates an optimised cut list from 4'×8' sheet goods
 * using the First Fit Decreasing (FFD) bin-packing algorithm.
 *
 * Only flat panel components (shelves, drawer units, cubbies, etc.)
 * are included. Hardware, rods, and wire components are excluded.
 */

import { generateId, COMPONENTS } from './constants';

// ─── Config ───────────────────────────────────────────────────────

const SHEET_W = 48;  // inches — 4'×8' sheet
const SHEET_H = 96;  // inches

// Component types that require sheet-cut panels
const PANEL_TYPES = new Set([
  'shelf', 'cubbies', 'drawers-3', 'drawers-5',
  'corner-shelf', 'island-unit', 'basket', 'hamper',
  'laundry-sorter',
]);

// Component types to skip (rods, hardware, wire systems, doors)
const SKIP_TYPES = new Set([
  'double-hang', 'long-hang', 'hooks', 'valet-rod', 'jewelry-tray',
  'pants-rack', 'tie-rack', 'led-strip', 'sliding-doors', 'safe-lockbox',
]);

// Materials that use sheet goods (exclude wire systems)
const SHEET_MATERIALS = new Set([
  'melamine-white', 'melamine-almond', 'melamine-gray',
  'wood-oak', 'wood-walnut', 'wood-maple', 'wood-cherry',
  'lam-espresso',
]);

// ─── Panel generation ─────────────────────────────────────────────

/**
 * Determine which panels a component type needs cut.
 * Returns an array of { label, w, h } panel descriptors.
 */
function getPanelsForComponent(comp, material) {
  const def = COMPONENTS.find(c => c.id === comp.type);
  const label = def?.label ?? comp.type;
  const w = comp.w || def?.defaultW || 24;
  const h = comp.h || def?.h || 12;

  switch (comp.type) {
    case 'shelf':
      return [{ label: `${label} (${w}"×${h}")`, w, h: 1.5 }]; // 3/4" thick = 1.5" on cut diagram

    case 'cubbies':
      // Top, bottom, 2 sides, vertical dividers
      return [
        { label: `${label} Top/Bottom`, w, h: 14 },
        { label: `${label} Top/Bottom`, w, h: 14 },
        { label: `${label} Side`, w: 14, h },
        { label: `${label} Side`, w: 14, h },
        { label: `${label} Divider`, w: 14, h: h * 0.48 },
      ];

    case 'drawers-3':
      return [
        { label: 'Drawer Box Side (×6)', w: 14, h: 5 },
        { label: 'Drawer Front (×3)', w, h: 7 },
        { label: `${label} Shell Top/Bot`, w, h: 14 },
        { label: `${label} Shell Side (×2)`, w: 14, h },
      ];

    case 'drawers-5':
      return [
        { label: 'Drawer Box Side (×10)', w: 14, h: 7 },
        { label: 'Drawer Front (×5)', w, h: 7 },
        { label: `${label} Shell Top/Bot`, w, h: 14 },
        { label: `${label} Shell Side (×2)`, w: 14, h },
      ];

    case 'corner-shelf':
      return [
        { label: `${label} Panel (×2)`, w: w * 0.7, h: 14 },
      ];

    case 'island-unit':
      return [
        { label: 'Island Top', w, h: h },
        { label: 'Island Side (×2)', w: 20, h },
        { label: 'Island Shelf (×3)', w: w - 2, h: 16 },
      ];

    case 'basket':
    case 'hamper':
    case 'laundry-sorter':
      return [
        { label: `${label} Frame`, w, h: comp.h ?? 12 },
      ];

    default:
      return [{ label, w, h }];
  }
}

// ─── Bin packing ──────────────────────────────────────────────────

/**
 * Simple guillotine bin-packing: try to place a panel into an
 * available slot in a sheet. Returns the updated sheet, or null.
 */
function tryPlace(sheet, panel) {
  // Sort slots: prefer tightest fit
  const slots = [...sheet.freeSlots].sort((a, b) => (a.w * a.h) - (b.w * b.h));

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    // Try normal orientation
    if (panel.w <= slot.w && panel.h <= slot.h) {
      const cut = { label: panel.label, x: slot.x, y: slot.y, w: panel.w, h: panel.h, rotated: false };
      const newSlots = splitSlot(slot, panel.w, panel.h, slot.x, slot.y);
      const updatedSlots = [...sheet.freeSlots.filter(s => s !== slot), ...newSlots];
      return { ...sheet, cuts: [...sheet.cuts, cut], freeSlots: updatedSlots };
    }
    // Try rotated
    if (panel.h <= slot.w && panel.w <= slot.h) {
      const cut = { label: panel.label, x: slot.x, y: slot.y, w: panel.h, h: panel.w, rotated: true };
      const newSlots = splitSlot(slot, panel.h, panel.w, slot.x, slot.y);
      const updatedSlots = [...sheet.freeSlots.filter(s => s !== slot), ...newSlots];
      return { ...sheet, cuts: [...sheet.cuts, cut], freeSlots: updatedSlots };
    }
  }
  return null;
}

/**
 * After placing a panel (pw×ph) at (px, py) in a slot,
 * split the remaining free space into up to 2 new slots.
 */
function splitSlot(slot, pw, ph, px, py) {
  const result = [];
  // Right of placed panel
  if (slot.w - pw > 2) {
    result.push({ x: px + pw, y: py, w: slot.w - pw, h: slot.h });
  }
  // Below placed panel
  if (slot.h - ph > 2) {
    result.push({ x: px, y: py + ph, w: pw, h: slot.h - ph });
  }
  return result;
}

function newSheet() {
  return {
    id: generateId(),
    cuts: [],
    freeSlots: [{ x: 0, y: 0, w: SHEET_W, h: SHEET_H }],
  };
}

// ─── Public API ───────────────────────────────────────────────────

/**
 * Generate a cut list for a design.
 *
 * @param {object} design - { components[], material }
 * @returns {CutList}
 */
export function generateCutList(design) {
  const { components = [], material = 'melamine-white' } = design;

  // Only process designs with sheet-good materials
  if (!SHEET_MATERIALS.has(material)) {
    return {
      panels: [],
      sheets: [],
      totalSheets: 0,
      wastePercent: 0,
      notApplicable: true,
      reason: 'Cut list is only available for melamine, wood, and laminate materials.',
    };
  }

  // Collect all panels
  const allPanels = [];
  for (const comp of components) {
    if (SKIP_TYPES.has(comp.type)) continue;
    const panels = getPanelsForComponent(comp, material);
    allPanels.push(...panels);
  }

  if (allPanels.length === 0) {
    return { panels: [], sheets: [], totalSheets: 0, wastePercent: 0 };
  }

  // Sort by area descending (FFD)
  const sorted = [...allPanels].sort((a, b) => (b.w * b.h) - (a.w * a.h));

  // Pack into sheets
  const sheets = [];
  for (const panel of sorted) {
    let placed = false;
    for (let i = 0; i < sheets.length; i++) {
      const result = tryPlace(sheets[i], panel);
      if (result) {
        sheets[i] = result;
        placed = true;
        break;
      }
    }
    if (!placed) {
      const sheet = newSheet();
      const result = tryPlace(sheet, panel);
      sheets.push(result ?? sheet); // result should always succeed on fresh sheet
    }
  }

  // Calculate waste
  const totalArea = sheets.length * SHEET_W * SHEET_H;
  const usedArea = allPanels.reduce((sum, p) => sum + p.w * p.h, 0);
  const wastePercent = totalArea > 0
    ? Math.round(((totalArea - usedArea) / totalArea) * 100)
    : 0;

  // Panel summary (deduplicate labels)
  const panelSummary = new Map();
  for (const p of allPanels) {
    const key = `${p.label}__${p.w}__${p.h}`;
    if (!panelSummary.has(key)) {
      panelSummary.set(key, { label: p.label, width: p.w, height: p.h, qty: 0 });
    }
    panelSummary.get(key).qty += 1;
  }

  return {
    panels: Array.from(panelSummary.values()),
    sheets: sheets.map(s => ({ id: s.id, cuts: s.cuts })),
    totalSheets: sheets.length,
    wastePercent,
    sheetDims: { w: SHEET_W, h: SHEET_H },
  };
}
