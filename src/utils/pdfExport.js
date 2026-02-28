/**
 * PDF Export Utility
 * Generates a professional PDF of the closet design with measurements,
 * component list, and layout diagram using expo-print
 */
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { COMPONENTS, MATERIALS, inToDisplay } from './constants';

/**
 * Generate HTML for the design PDF
 */
function generateDesignHTML(design) {
  const { name, measurements, material, components, roomType, closetType } = design;
  const materialDef = MATERIALS.find(m => m.id === material) || MATERIALS[0];
  
  // Count components
  const componentCounts = {};
  components.forEach(c => {
    if (!componentCounts[c.type]) componentCounts[c.type] = { count: 0, items: [] };
    componentCounts[c.type].count++;
    componentCounts[c.type].items.push(c);
  });

  // Generate SVG layout diagram
  const svgW = 500;
  const svgH = Math.round((measurements.height / measurements.width) * svgW);
  const scaleX = svgW / (measurements.width * 4); // 4 = GRID.scale
  const scaleY = svgH / (measurements.height * 4);

  const componentSVGs = components.map(c => {
    const compDef = COMPONENTS.find(cc => cc.id === c.type);
    const x = c.x * scaleX;
    const y = c.y * scaleY;
    const w = c.w * 4 * scaleX;
    const h = c.h * 4 * scaleY;
    return `
      <rect x="${x}" y="${y}" width="${w}" height="${h}" 
        fill="${compDef?.color || '#888'}33" stroke="${compDef?.color || '#888'}" stroke-width="1.5" rx="3"/>
      <text x="${x + w/2}" y="${y + h/2 + 4}" text-anchor="middle" 
        font-size="10" fill="#333" font-weight="600">${compDef?.label || c.type}</text>
      <text x="${x + w/2}" y="${y + h/2 + 16}" text-anchor="middle" 
        font-size="8" fill="#666">${inToDisplay(c.w)}×${inToDisplay(c.h)}</text>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, 'Helvetica Neue', sans-serif; color: #2c2c2c; padding: 40px; }
    
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; border-bottom: 3px solid #c49a5c; padding-bottom: 20px; }
    .logo { font-size: 28px; font-weight: 800; color: #1a1a2e; letter-spacing: -0.5px; }
    .logo-sub { font-size: 12px; color: #888; font-weight: 400; margin-top: 2px; }
    .date { font-size: 11px; color: #888; text-align: right; }
    
    .design-name { font-size: 22px; font-weight: 700; color: #1a1a2e; margin-bottom: 6px; }
    .design-meta { font-size: 13px; color: #666; margin-bottom: 24px; }
    
    .section { margin-bottom: 28px; }
    .section-title { font-size: 13px; font-weight: 700; color: #c49a5c; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 14px; }
    
    .dims-grid { display: flex; gap: 16px; }
    .dim-card { flex: 1; background: #f7f4ef; border-radius: 10px; padding: 16px; text-align: center; }
    .dim-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
    .dim-value { font-size: 26px; font-weight: 800; color: #1a1a2e; margin-top: 4px; }
    
    .material-badge { display: inline-flex; align-items: center; gap: 8px; background: #f7f4ef; border-radius: 8px; padding: 8px 16px; margin-bottom: 20px; }
    .material-swatch { width: 20px; height: 20px; border-radius: 4px; border: 1px solid #ddd; }
    .material-name { font-size: 13px; font-weight: 600; color: #333; }
    
    .diagram { text-align: center; margin: 20px 0; }
    .diagram svg { border: 2px solid #e8e4de; border-radius: 8px; background: #faf8f5; }
    
    .comp-table { width: 100%; border-collapse: collapse; }
    .comp-table th { text-align: left; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; padding: 8px 12px; border-bottom: 2px solid #e8e4de; }
    .comp-table td { padding: 10px 12px; border-bottom: 1px solid #f0ede8; font-size: 13px; }
    .comp-icon { font-size: 18px; }
    .comp-name { font-weight: 600; color: #1a1a2e; }
    .comp-dims { color: #888; font-size: 12px; }
    .comp-count { font-weight: 700; color: #c49a5c; font-size: 16px; text-align: center; }
    
    .tips { background: #f0f4f7; border-radius: 10px; padding: 18px; border-left: 4px solid #6b8e9e; }
    .tips-title { font-size: 13px; font-weight: 700; color: #6b8e9e; margin-bottom: 10px; }
    .tips-text { font-size: 12px; color: #555; line-height: 1.7; }
    
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e8e4de; font-size: 10px; color: #aaa; text-align: center; }
    
    @media print {
      body { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">🏠 ClosetCraft</div>
      <div class="logo-sub">Custom Closet Design</div>
    </div>
    <div class="date">
      Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}<br/>
      Design ID: ${design.id || 'N/A'}
    </div>
  </div>

  <div class="design-name">${name || 'Untitled Design'}</div>
  <div class="design-meta">
    ${roomType ? roomType.charAt(0).toUpperCase() + roomType.slice(1) + ' Room' : ''} 
    ${closetType ? '• ' + closetType.charAt(0).toUpperCase() + closetType.slice(1) + ' Closet' : ''}
    • ${components.length} component${components.length !== 1 ? 's' : ''}
  </div>

  <div class="section">
    <div class="section-title">Dimensions</div>
    <div class="dims-grid">
      <div class="dim-card">
        <div class="dim-label">Width</div>
        <div class="dim-value">${inToDisplay(measurements.width)}</div>
      </div>
      <div class="dim-card">
        <div class="dim-label">Height</div>
        <div class="dim-value">${inToDisplay(measurements.height)}</div>
      </div>
      <div class="dim-card">
        <div class="dim-label">Depth</div>
        <div class="dim-value">${inToDisplay(measurements.depth)}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Material</div>
    <div class="material-badge">
      <div class="material-swatch" style="background-color: ${materialDef.color};"></div>
      <span class="material-name">${materialDef.label}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Layout Diagram</div>
    <div class="diagram">
      <svg width="${svgW}" height="${Math.min(svgH, 400)}" viewBox="0 0 ${svgW} ${svgH}">
        <!-- Wall outline -->
        <rect x="0" y="0" width="${svgW}" height="${svgH}" fill="#faf8f5" stroke="#c49a5c" stroke-width="2" rx="4"/>
        
        <!-- Grid lines every foot -->
        ${Array.from({ length: Math.floor(measurements.width / 12) }, (_, i) => 
          `<line x1="${(i + 1) * 12 * 4 * scaleX}" y1="0" x2="${(i + 1) * 12 * 4 * scaleX}" y2="${svgH}" stroke="#e8e4de" stroke-width="0.5"/>`
        ).join('')}
        ${Array.from({ length: Math.floor(measurements.height / 12) }, (_, i) => 
          `<line x1="0" y1="${(i + 1) * 12 * 4 * scaleY}" x2="${svgW}" y2="${(i + 1) * 12 * 4 * scaleY}" stroke="#e8e4de" stroke-width="0.5"/>`
        ).join('')}
        
        <!-- Components -->
        ${componentSVGs}
        
        <!-- Dimension labels -->
        <text x="${svgW / 2}" y="${svgH + 16}" text-anchor="middle" font-size="11" fill="#c49a5c" font-weight="600">
          ${inToDisplay(measurements.width)}
        </text>
      </svg>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Component List</div>
    <table class="comp-table">
      <thead>
        <tr>
          <th></th>
          <th>Component</th>
          <th>Dimensions</th>
          <th>Qty</th>
        </tr>
      </thead>
      <tbody>
        ${Object.entries(componentCounts).map(([type, data]) => {
          const compDef = COMPONENTS.find(c => c.id === type);
          return `
            <tr>
              <td class="comp-icon">${compDef?.icon || '📦'}</td>
              <td class="comp-name">${compDef?.label || type}</td>
              <td class="comp-dims">${data.items.map(i => `${inToDisplay(i.w)} × ${inToDisplay(i.h)}`).join(', ')}</td>
              <td class="comp-count">${data.count}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="tips">
      <div class="tips-title">💡 Installation Tips</div>
      <div class="tips-text">
        • Always locate and mark wall studs before installation. Use a stud finder for accuracy.<br/>
        • Level all horizontal components with a 4-foot level.<br/>
        • Pre-drill holes to prevent splitting, especially in melamine and laminate materials.<br/>
        • Start installation from the top and work down to maintain alignment.<br/>
        • Leave ½" clearance from walls for ventilation and easy cleaning.<br/>
        • Verify all measurements on-site before cutting any materials.
      </div>
    </div>
  </div>

  <div class="footer">
    Generated by ClosetCraft v2.0 • For reference only — verify all measurements before purchasing materials
  </div>
</body>
</html>
  `;
}

/**
 * Export design as PDF
 */
export async function exportDesignPDF(design) {
  try {
    const html = generateDesignHTML(design);
    
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });
    
    return uri;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

/**
 * Share the generated PDF
 */
export async function shareDesignPDF(design) {
  try {
    const uri = await exportDesignPDF(design);
    
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: `${design.name || 'ClosetCraft'} Design`,
        UTI: 'com.adobe.pdf',
      });
    }
    
    return uri;
  } catch (error) {
    console.error('Error sharing PDF:', error);
    throw error;
  }
}

/**
 * Print the design directly
 */
export async function printDesign(design) {
  try {
    const html = generateDesignHTML(design);
    await Print.printAsync({ html });
  } catch (error) {
    console.error('Error printing:', error);
    throw error;
  }
}
