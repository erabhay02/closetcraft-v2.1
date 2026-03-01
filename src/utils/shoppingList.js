/**
 * ClosetCraft Phase 3.2 — Shopping List Generator
 *
 * Generates a categorised shopping list from a design and provides
 * export functions (text, PDF) and retailer deep links.
 */

import { Linking } from 'react-native';
import { print } from 'expo-print';
import * as Sharing from 'expo-sharing';
import { COMPONENTS, MATERIALS, inToDisplay } from './constants';
import { formatPrice } from './costEngine';

// ─── Component → category mapping ────────────────────────────────

const TYPE_CATEGORY = {
  'shelf':          'Shelving',
  'cubbies':        'Shelving',
  'corner-shelf':   'Shelving',
  'island-unit':    'Shelving',
  'double-hang':    'Hanging',
  'long-hang':      'Hanging',
  'pants-rack':     'Hanging',
  'drawers-3':      'Drawers',
  'drawers-5':      'Drawers',
  'shoe-rack':      'Specialty',
  'basket':         'Specialty',
  'hooks':          'Specialty',
  'valet-rod':      'Specialty',
  'jewelry-tray':   'Specialty',
  'hamper':         'Specialty',
  'sliding-doors':  'Specialty',
  'led-strip':      'Specialty',
  'tie-rack':       'Specialty',
  'laundry-sorter': 'Specialty',
  'safe-lockbox':   'Specialty',
};

const CATEGORY_ORDER = ['Hanging', 'Shelving', 'Drawers', 'Specialty', 'Hardware'];

// Base prices (kept in sync with costEngine.js)
const BASE_PRICES = {
  'shelf': 13, 'double-hang': 23, 'long-hang': 20, 'drawers-3': 65,
  'drawers-5': 129, 'shoe-rack': 34, 'cubbies': 48, 'basket': 28,
  'hooks': 18, 'valet-rod': 22, 'jewelry-tray': 45, 'hamper': 58,
  'sliding-doors': 180, 'led-strip': 25, 'tie-rack': 32,
  'pants-rack': 38, 'laundry-sorter': 75, 'safe-lockbox': 95,
  'island-unit': 220, 'corner-shelf': 42,
};

const MATERIAL_MULTIPLIERS = {
  'melamine-white': 1.0, 'melamine-almond': 1.0, 'melamine-gray': 1.05,
  'wood-oak': 1.8, 'wood-walnut': 2.2, 'wood-maple': 1.6, 'wood-cherry': 2.0,
  'lam-espresso': 1.3, 'wire-chrome': 0.7, 'wire-white': 0.65,
};

// ─── Helpers ──────────────────────────────────────────────────────

function getUnitPrice(type, material) {
  const base = BASE_PRICES[type] ?? 20;
  const mult = MATERIAL_MULTIPLIERS[material] ?? 1.0;
  return Math.round(base * mult * 100) / 100;
}

function getDimLabel(comp) {
  const w = comp.w ? `${comp.w}"W` : '';
  const def = COMPONENTS.find(c => c.id === comp.type);
  const h = def?.h ? `${def.h}"H` : '';
  return [w, h].filter(Boolean).join(' × ');
}

// ─── Public API ───────────────────────────────────────────────────

/**
 * Generate a categorized shopping list from a design.
 *
 * @param {object} design - { components[], material }
 * @returns {ShoppingCategory[]}
 */
export function generateShoppingList(design) {
  const { components = [], material = 'melamine-white' } = design;
  const materialLabel = MATERIALS.find(m => m.id === material)?.label ?? material;

  // Aggregate by type
  const byType = new Map();
  for (const comp of components) {
    const type = comp.type;
    if (!byType.has(type)) byType.set(type, { comps: [], type });
    byType.get(type).comps.push(comp);
  }

  // Build items
  const itemsByCategory = {};
  for (const cat of CATEGORY_ORDER) {
    itemsByCategory[cat] = [];
  }

  for (const [type, { comps }] of byType) {
    const def = COMPONENTS.find(c => c.id === type);
    const category = TYPE_CATEGORY[type] ?? 'Specialty';
    const unitPrice = getUnitPrice(type, material);

    // Group by width (same width = same SKU, different widths = separate items)
    const byWidth = new Map();
    for (const comp of comps) {
      const w = comp.w ?? def?.defaultW ?? 24;
      if (!byWidth.has(w)) byWidth.set(w, 0);
      byWidth.set(w, byWidth.get(w) + 1);
    }

    for (const [width, qty] of byWidth) {
      itemsByCategory[category].push({
        type,
        label: def?.label ?? type,
        qty,
        dimensions: `${width}"W${def?.h ? ` × ${def.h}"H` : ''}`,
        material: materialLabel,
        estimatedPrice: unitPrice,
        estimatedTotal: Math.round(unitPrice * qty * 100) / 100,
      });
    }
  }

  // Add hardware line
  const totalMaterials = Object.values(itemsByCategory)
    .flat()
    .reduce((sum, item) => sum + item.estimatedTotal, 0);
  itemsByCategory['Hardware'].push({
    type: 'hardware',
    label: 'Hardware & Fasteners',
    qty: 1,
    dimensions: 'Assorted',
    material: 'Various',
    estimatedPrice: Math.round(totalMaterials * 0.07 * 100) / 100,
    estimatedTotal: Math.round(totalMaterials * 0.07 * 100) / 100,
  });

  // Build final array, skip empty categories
  return CATEGORY_ORDER
    .filter(cat => itemsByCategory[cat].length > 0)
    .map(cat => ({ category: cat, items: itemsByCategory[cat] }));
}

/**
 * Export shopping list as plain text.
 */
export function exportAsText(categories, design) {
  const name = design?.name ?? 'My Closet';
  const date = new Date().toLocaleDateString();
  const lines = [
    `CLOSETCRAFT SHOPPING LIST`,
    `Design: ${name}`,
    `Date: ${date}`,
    '',
  ];

  let grandTotal = 0;
  for (const { category, items } of categories) {
    lines.push(`── ${category.toUpperCase()} ──`);
    for (const item of items) {
      const price = formatPrice(item.estimatedTotal);
      lines.push(`  ${item.qty}× ${item.label} (${item.dimensions}) ......... ${price}`);
      grandTotal += item.estimatedTotal;
    }
    lines.push('');
  }

  lines.push(`ESTIMATED TOTAL (DIY): ${formatPrice(grandTotal)}`);
  lines.push('');
  lines.push('Prices are estimates. Verify at your local retailer.');
  return lines.join('\n');
}

/**
 * Export shopping list as PDF and return the file URI.
 */
export async function exportAsPDF(categories, design) {
  const name = design?.name ?? 'My Closet';
  const date = new Date().toLocaleDateString();
  let grandTotal = 0;

  const rows = categories.map(({ category, items }) => {
    const itemRows = items.map(item => {
      grandTotal += item.estimatedTotal;
      return `
        <tr>
          <td>${item.qty}</td>
          <td>${item.label}</td>
          <td>${item.dimensions}</td>
          <td>${item.material}</td>
          <td style="text-align:right">${formatPrice(item.estimatedPrice)}</td>
          <td style="text-align:right">${formatPrice(item.estimatedTotal)}</td>
        </tr>`;
    }).join('');

    return `
      <tr class="cat-header">
        <td colspan="6">${category}</td>
      </tr>
      ${itemRows}`;
  }).join('');

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: sans-serif; color: #222; padding: 24px; }
  h1 { font-size: 22px; color: #8b6434; }
  h2 { font-size: 14px; color: #555; font-weight: normal; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
  th { background: #f5f0ea; text-align: left; padding: 6px 8px; border-bottom: 2px solid #d4b896; }
  td { padding: 5px 8px; border-bottom: 1px solid #eee; }
  .cat-header td { background: #faf6f0; font-weight: bold; color: #8b6434;
                   padding: 8px 8px 4px; border-top: 1px solid #d4b896; }
  .total-row td { font-weight: bold; border-top: 2px solid #d4b896; padding-top: 8px; }
  .disclaimer { font-size: 10px; color: #888; margin-top: 20px; }
</style>
</head>
<body>
  <h1>ClosetCraft Shopping List</h1>
  <h2>${name} &nbsp;·&nbsp; ${date}</h2>
  <table>
    <thead>
      <tr>
        <th>Qty</th><th>Item</th><th>Dimensions</th>
        <th>Material</th><th style="text-align:right">Unit</th>
        <th style="text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
      <tr class="total-row">
        <td colspan="5">ESTIMATED TOTAL (DIY)</td>
        <td style="text-align:right">${formatPrice(grandTotal)}</td>
      </tr>
    </tbody>
  </table>
  <p class="disclaimer">Prices are estimates based on national averages. Actual costs may vary by region, retailer, and market conditions.</p>
</body>
</html>`;

  const { uri } = await print({ html, base64: false });
  return uri;
}

/**
 * Share the shopping list as a text file via the system share sheet.
 */
export async function shareAsText(categories, design) {
  const text = exportAsText(categories, design);
  await Sharing.shareAsync('data:text/plain,' + encodeURIComponent(text), {
    mimeType: 'text/plain',
    dialogTitle: 'Share Shopping List',
  });
}

/**
 * Open a retailer search for an item.
 * @param {string} itemLabel - component label
 * @param {'homedepot'|'lowes'} retailer
 */
export function openInRetailer(itemLabel, retailer) {
  const query = encodeURIComponent(`closet ${itemLabel}`);
  const urls = {
    homedepot: `https://www.homedepot.com/s/${query}`,
    lowes: `https://www.lowes.com/search?searchTerm=${query}`,
  };
  const url = urls[retailer];
  if (url) Linking.openURL(url);
}
