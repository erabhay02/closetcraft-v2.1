/**
 * ClosetCraft Phase 3.0 — Layout Preview Component
 *
 * Renders a horizontal scrollable comparison of AI-generated layout options.
 * Each card shows: name, description, efficiency score, mini 2D SVG diagram.
 */

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
} from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { COLORS, COMPONENTS } from '../utils/constants';
import styles, { CARD_W, DIAGRAM_W, DIAGRAM_H } from './LayoutPreview.styles';


// ─── Mini SVG Diagram ─────────────────────────────────────────────

function MiniDiagram({ components, closetDims }) {
  const { width = 72, height = 96 } = closetDims;
  const scaleX = DIAGRAM_W / width;
  const scaleY = DIAGRAM_H / height;

  // Component color map
  const getColor = (type) => {
    const def = COMPONENTS.find(c => c.id === type);
    return def?.color ?? '#6b8e9e';
  };

  // Convert canvas px coords back to inches
  const CANVAS_SCALE = 4;

  return (
    <Svg width={DIAGRAM_W} height={DIAGRAM_H} style={styles.diagram}>
      {/* Closet boundary */}
      <Rect
        x={0} y={0}
        width={DIAGRAM_W} height={DIAGRAM_H}
        fill="rgba(255,255,255,0.04)"
        stroke={COLORS.border}
        strokeWidth={1}
        rx={2}
      />
      {/* Component rectangles */}
      {components.map((comp, i) => {
        // comp.x and comp.y are in canvas pixels; convert to inches
        const xIn = comp.x / CANVAS_SCALE;
        const yIn = comp.y / CANVAS_SCALE;
        const wIn = comp.w;
        const hIn = comp.h;

        const rx = xIn * scaleX;
        const ry = yIn * scaleY;
        const rw = Math.max(wIn * scaleX - 1, 2);
        const rh = Math.max(hIn * scaleY - 1, 2);

        // Clamp to diagram bounds
        if (rx >= DIAGRAM_W || ry >= DIAGRAM_H) return null;

        return (
          <Rect
            key={comp.id ?? i}
            x={rx}
            y={ry}
            width={Math.min(rw, DIAGRAM_W - rx)}
            height={Math.min(rh, DIAGRAM_H - ry)}
            fill={getColor(comp.type)}
            opacity={0.7}
            rx={1}
          />
        );
      })}
    </Svg>
  );
}

// ─── Efficiency Badge ─────────────────────────────────────────────

function EfficiencyBadge({ score }) {
  const color = score >= 80 ? COLORS.green : score >= 60 ? COLORS.gold : COLORS.blue;
  return (
    <View style={[styles.badge, { backgroundColor: color + '33', borderColor: color }]}>
      <Text style={[styles.badgeText, { color }]}>{score}% efficient</Text>
    </View>
  );
}

// ─── Main Component ───────────────────────────────────────────────

/**
 * @param {object[]} layouts        - Array of LayoutOption from aiLayoutEngine
 * @param {object}   closetDims     - { width, height, depth } in inches
 * @param {function} onSelect       - Called with the chosen LayoutOption
 * @param {string}   selectedId     - ID of the currently selected layout
 */
export default function LayoutPreview({ layouts = [], closetDims = {}, onSelect, selectedId }) {
  return (
    <View>
      <Text style={styles.sectionTitle}>Choose a Layout</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        snapToInterval={CARD_W + 12}
        decelerationRate="fast"
      >
        {layouts.map(layout => {
          const isSelected = layout.id === selectedId;
          return (
            <TouchableOpacity
              key={layout.id}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => onSelect(layout)}
              activeOpacity={0.85}
            >
              {/* Header */}
              <View style={styles.cardHeader}>
                <Text style={styles.layoutName}>{layout.name}</Text>
                <EfficiencyBadge score={layout.efficiencyScore} />
              </View>

              {/* Description */}
              <Text style={styles.layoutDesc} numberOfLines={2}>
                {layout.description}
              </Text>

              {/* Mini diagram */}
              <View style={styles.diagramContainer}>
                <MiniDiagram
                  components={layout.components}
                  closetDims={closetDims}
                />
              </View>

              {/* Component count */}
              <Text style={styles.compCount}>
                {layout.components.length} components
              </Text>

              {/* Select button */}
              <TouchableOpacity
                style={[styles.selectBtn, isSelected && styles.selectBtnActive]}
                onPress={() => onSelect(layout)}
              >
                <Text style={[styles.selectBtnText, isSelected && styles.selectBtnTextActive]}>
                  {isSelected ? '✓ Selected' : 'Use This Layout'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
