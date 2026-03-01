/**
 * ClosetCraft Phase 3.2 — Cost Estimation Engine
 *
 * Provides real-time cost estimates based on the user's design,
 * material selection, and component counts.
 *
 * All prices are baseline estimates in USD. Actual prices vary by
 * region, retailer, and market conditions.
 */

import { COMPONENTS, MATERIALS } from './constants';

// ─── Pricing Database ─────────────────────────────────────────────

// Base cost per unit (USD) at standard melamine-white material
const BASE_PRICES = {
  'shelf':          13,
  'double-hang':    23,
  'long-hang':      20,
  'drawers-3':      65,
  'drawers-5':      129,
  'shoe-rack':      34,
  'cubbies':        48,
  'basket':         28,
  'hooks':          18,
  'valet-rod':      22,
  'jewelry-tray':   45,
  'hamper':         58,
  'sliding-doors':  180,
  'led-strip':      25,
  'tie-rack':       32,
  'pants-rack':     38,
  'laundry-sorter': 75,
  'safe-lockbox':   95,
  'island-unit':    220,
  'corner-shelf':   42,
};

// Material cost multipliers (applied to base price)
const MATERIAL_MULTIPLIERS = {
  'melamine-white':  1.00,
  'melamine-almond': 1.00,
  'melamine-gray':   1.05,
  'wood-oak':        1.80,
  'wood-walnut':     2.20,
  'wood-maple':      1.60,
  'wood-cherry':     2.00,
  'lam-espresso':    1.30,
  'wire-chrome':     0.70,
  'wire-white':      0.65,
};

// Hardware & fasteners rate (percentage of material subtotal)
const HARDWARE_RATE = 0.07;

// Professional installation range (flat estimate, USD)
const INSTALL_PRO_LOW = 200;
const INSTALL_PRO_HIGH = 400;

// ─── Width-based price scaling ────────────────────────────────────

// Some components scale in price with their width
const WIDTH_SCALABLE = new Set(['shelf', 'double-hang', 'long-hang', 'hooks', 'led-strip', 'sliding-doors']);
const BASE_WIDTH = 24; // inches — the default/base unit width

function getUnitPrice(componentType, material, widthInches) {
  const base = BASE_PRICES[componentType] ?? 20;
  const multiplier = MATERIAL_MULTIPLIERS[material] ?? 1.0;
  let price = base * multiplier;

  // Scale linearly by width for applicable components
  if (WIDTH_SCALABLE.has(componentType) && widthInches && widthInches > 0) {
    price = price * (widthInches / BASE_WIDTH);
  }

  return Math.round(price * 100) / 100;
}

// ─── Public API ───────────────────────────────────────────────────

/**
 * Aggregate components by type, counting duplicates.
 * Returns a Map<type, { count, totalWidth, label }>.
 */
function aggregateComponents(components) {
  const map = new Map();
  for (const comp of components) {
    const type = comp.type;
    if (!map.has(type)) {
      const def = COMPONENTS.find(c => c.id === type);
      map.set(type, { count: 0, totalWidth: 0, label: def?.label ?? type });
    }
    const entry = map.get(type);
    entry.count += 1;
    entry.totalWidth += (comp.w || 0);
  }
  return map;
}

/**
 * Calculate a full cost breakdown for a design.
 *
 * @param {object} design - { components[], material, measurements }
 * @returns {CostBreakdown}
 */
export function calculateCost(design) {
  const { components = [], material = 'melamine-white' } = design;

  const aggregated = aggregateComponents(components);
  const lineItems = [];
  let subtotalMaterials = 0;

  for (const [type, { count, totalWidth, label }] of aggregated) {
    const avgWidth = count > 0 ? totalWidth / count : BASE_WIDTH;
    const unitPrice = getUnitPrice(type, material, avgWidth);
    const totalPrice = Math.round(unitPrice * count * 100) / 100;

    lineItems.push({
      type,
      label,
      quantity: count,
      unitPrice,
      totalPrice,
    });
    subtotalMaterials += totalPrice;
  }

  subtotalMaterials = Math.round(subtotalMaterials * 100) / 100;
  const hardware = Math.round(subtotalMaterials * HARDWARE_RATE * 100) / 100;
  const totalDIY = Math.round((subtotalMaterials + hardware) * 100) / 100;

  return {
    lineItems,
    subtotalMaterials,
    hardware,
    installDIY: 0,
    installProLow: INSTALL_PRO_LOW,
    installProHigh: INSTALL_PRO_HIGH,
    totalDIY,
    totalProLow: Math.round((totalDIY + INSTALL_PRO_LOW) * 100) / 100,
    totalProHigh: Math.round((totalDIY + INSTALL_PRO_HIGH) * 100) / 100,
    materialLabel: MATERIALS.find(m => m.id === material)?.label ?? material,
    disclaimer: 'Prices are estimates based on national averages. Actual costs may vary by region, retailer, and project specifics.',
  };
}

/**
 * Format a price for display, e.g. 309 → "$309.00"
 */
export function formatPrice(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

/**
 * Format a price range, e.g. (200, 400) → "$200–$400"
 */
export function formatPriceRange(low, high) {
  return `$${Math.round(low)}–$${Math.round(high)}`;
}
