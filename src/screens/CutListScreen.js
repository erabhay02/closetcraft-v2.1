/**
 * ClosetCraft Phase 3.2 — Cut List Screen
 *
 * Shows an optimised cut layout for 4'×8' sheet goods,
 * with a visual SVG diagram per sheet and a printable panel list.
 */

import React, { useMemo } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView,
  ScrollView, Alert,
} from 'react-native';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';
import { print } from 'expo-print';
import { COLORS, MATERIALS } from '../utils/constants';
import { generateCutList } from '../utils/cutListOptimizer';
import styles from './CutListScreen.styles';

// ─── Sheet Diagram ────────────────────────────────────────────────

const DIAGRAM_W = 280;
const DIAGRAM_H = DIAGRAM_W * (96 / 48); // maintain 4'×8' ratio → 560, but cap it

const SHEET_W = 48;
const SHEET_H = 96;

// Distinct colours for cuts
const CUT_COLORS = [
  '#B8956A', '#7B9E6B', '#6B8E9E', '#9E6B8E', '#8E9E6B',
  '#6B9E8E', '#9E8E6B', '#9E7B6B', '#6B7B9E', '#8E6B9E',
];

function SheetDiagram({ sheet, sheetIndex }) {
  const dW = DIAGRAM_W;
  const dH = Math.min(DIAGRAM_W * (SHEET_H / SHEET_W), 400);
  const scaleX = dW / SHEET_W;
  const scaleY = dH / SHEET_H;

  return (
    <View style={styles.sheetDiagram}>
      <Text style={styles.sheetLabel}>Sheet {sheetIndex + 1}</Text>
      <Svg width={dW} height={dH} style={styles.svg}>
        {/* Sheet background */}
        <Rect x={0} y={0} width={dW} height={dH}
          fill="rgba(255,255,255,0.04)" stroke={COLORS.border} strokeWidth={1.5} />

        {/* Grid lines (every foot = 12") */}
        {[12, 24, 36].map(in_ => (
          <Line key={`v${in_}`}
            x1={in_ * scaleX} y1={0} x2={in_ * scaleX} y2={dH}
            stroke={COLORS.border + '80'} strokeWidth={0.5} strokeDasharray="4,4" />
        ))}
        {[12, 24, 36, 48, 60, 72, 84].map(in_ => (
          <Line key={`h${in_}`}
            x1={0} y1={in_ * scaleY} x2={dW} y2={in_ * scaleY}
            stroke={COLORS.border + '80'} strokeWidth={0.5} strokeDasharray="4,4" />
        ))}

        {/* Cuts */}
        {sheet.cuts.map((cut, i) => {
          const color = CUT_COLORS[i % CUT_COLORS.length];
          const rx = cut.x * scaleX;
          const ry = cut.y * scaleY;
          const rw = Math.max(cut.w * scaleX - 1, 2);
          const rh = Math.max(cut.h * scaleY - 1, 2);
          const textX = rx + rw / 2;
          const textY = ry + rh / 2;

          return (
            <React.Fragment key={i}>
              <Rect x={rx} y={ry} width={rw} height={rh}
                fill={color} fillOpacity={0.25}
                stroke={color} strokeOpacity={0.8}
                strokeWidth={1.5} rx={2} />
              {rw > 24 && rh > 10 ? (
                <SvgText
                  x={textX} y={textY}
                  fill={color} fontSize={Math.min(rw * 0.12, 10)}
                  textAnchor="middle" alignmentBaseline="middle"
                  opacity={0.9}>
                  {cut.label.split(' ')[0]}
                </SvgText>
              ) : null}
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

// ─── Panel List ───────────────────────────────────────────────────

function PanelRow({ panel, index }) {
  const color = CUT_COLORS[index % CUT_COLORS.length];
  return (
    <View style={styles.panelRow}>
      <View style={[styles.panelColorDot, { backgroundColor: color }]} />
      <Text style={styles.panelLabel} numberOfLines={1}>{panel.label}</Text>
      <Text style={styles.panelDims}>{panel.width}"×{panel.height}"</Text>
      <Text style={styles.panelQty}>×{panel.qty}</Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────

export default function CutListScreen({ navigation, route }) {
  const design = route.params?.design ?? { components: [], material: 'melamine-white' };

  const cutList = useMemo(() => generateCutList(design), [design]);

  async function handlePrint() {
    const mat = MATERIALS.find(m => m.id === design.material)?.label ?? design.material;
    let panelRows = cutList.panels.map(p =>
      `<tr><td>${p.label}</td><td>${p.width}"</td><td>${p.height}"</td><td>${p.qty}</td></tr>`
    ).join('');

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<style>
  body{font-family:sans-serif;color:#222;padding:24px}
  h1{font-size:20px;color:#8b6434}
  .meta{color:#666;font-size:13px;margin-bottom:20px}
  .summary{background:#f5f0ea;border-radius:8px;padding:14px;margin-bottom:20px}
  table{width:100%;border-collapse:collapse;font-size:12px}
  th{background:#f5f0ea;text-align:left;padding:6px 8px;border-bottom:2px solid #d4b896}
  td{padding:5px 8px;border-bottom:1px solid #eee}
  .disclaimer{font-size:10px;color:#888;margin-top:20px}
</style>
</head>
<body>
<h1>ClosetCraft Cut List</h1>
<div class="meta">${design.name ?? 'My Closet'} · Material: ${mat}</div>
<div class="summary">
  <strong>${cutList.totalSheets}</strong> sheet${cutList.totalSheets !== 1 ? 's' : ''} of 4'×8' ·
  Estimated waste: <strong>${cutList.wastePercent}%</strong>
</div>
<table>
  <thead><tr><th>Panel</th><th>Width</th><th>Height</th><th>Qty</th></tr></thead>
  <tbody>${panelRows}</tbody>
</table>
<p class="disclaimer">This cut list is optimised for minimal waste. Verify all dimensions before cutting. Add ⅛" kerf allowance for saw blade width.</p>
</body>
</html>`;

    try {
      await print({ html });
    } catch (err) {
      Alert.alert('Print failed', err.message);
    }
  }

  // Not applicable (wire systems, etc.)
  if (cutList.notApplicable) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cut List</Text>
          <View style={{ width: 60 }} />
        </View>
        <View style={styles.centered}>
          <Text style={styles.notApplicableIcon}>📋</Text>
          <Text style={styles.notApplicableTitle}>Not Applicable</Text>
          <Text style={styles.notApplicableText}>{cutList.reason}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cut List</Text>
        <TouchableOpacity onPress={handlePrint} style={styles.printBtn}>
          <Text style={styles.printBtnText}>Print</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{cutList.totalSheets}</Text>
            <Text style={styles.summaryLabel}>Sheets (4'×8')</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{cutList.wastePercent}%</Text>
            <Text style={styles.summaryLabel}>Waste</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{cutList.panels.length}</Text>
            <Text style={styles.summaryLabel}>Panel Types</Text>
          </View>
        </View>

        {/* Sheet diagrams */}
        {cutList.sheets.map((sheet, i) => (
          <SheetDiagram key={sheet.id} sheet={sheet} sheetIndex={i} />
        ))}

        {/* Panel list */}
        <View style={styles.panelSection}>
          <Text style={styles.panelSectionTitle}>All Panels</Text>
          {cutList.panels.map((panel, i) => (
            <PanelRow key={`${panel.label}-${i}`} panel={panel} index={i} />
          ))}
        </View>

        {/* Kerf tip */}
        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>💡 Cutting Tips</Text>
          <Text style={styles.tipText}>
            Add ⅛" (3mm) kerf allowance per cut for saw blade width.
            Cut panels 1-2mm oversize and sand/trim to final dimension.
          </Text>
          <Text style={styles.tipText}>
            For wood materials, mark grain direction before cutting.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
