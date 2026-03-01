/**
 * ClosetCraft Phase 3.0 — Template Picker Screen
 *
 * Browse and preview 10 pre-built closet designs. Users can filter by
 * closet type, tap to see a full preview, and load into the designer.
 */

import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, Modal, ScrollView,
} from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { COLORS, COMPONENTS, inToDisplay } from '../utils/constants';
import { TEMPLATES } from '../data/templates';
import styles, { SCREEN_W, CARD_W } from './TemplatePickerScreen.styles';

const CANVAS_SCALE = 4;

// ─── Filter Chips ─────────────────────────────────────────────────

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'walkin', label: 'Walk-in' },
  { id: 'reachin', label: 'Reach-in' },
  { id: 'wardrobe', label: 'Wardrobe' },
];

function FilterChips({ active, onPress }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}
      contentContainerStyle={styles.filterContent}>
      {FILTERS.map(f => (
        <TouchableOpacity
          key={f.id}
          style={[styles.chip, active === f.id && styles.chipActive]}
          onPress={() => onPress(f.id)}
        >
          <Text style={[styles.chipText, active === f.id && styles.chipTextActive]}>
            {f.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// ─── Mini Diagram ─────────────────────────────────────────────────

function MiniDiagram({ template, width, height }) {
  const { measurements, components } = template;
  const dims = measurements;
  const scaleX = width / dims.width;
  const scaleY = height / dims.height;

  return (
    <Svg width={width} height={height}>
      <Rect x={0} y={0} width={width} height={height}
        fill="rgba(255,255,255,0.03)" stroke={COLORS.border} strokeWidth={1} rx={4} />
      {components.map((comp, i) => {
        const def = COMPONENTS.find(c => c.id === comp.type);
        const color = def?.color ?? '#6b8e9e';
        const xIn = comp.x / CANVAS_SCALE;
        const yIn = comp.y / CANVAS_SCALE;
        const rx = xIn * scaleX;
        const ry = yIn * scaleY;
        const rw = Math.max(comp.w * scaleX - 1, 1);
        const rh = Math.max(comp.h * scaleY - 1, 1);
        if (rx >= width || ry >= height) return null;
        return (
          <Rect key={comp.id ?? i}
            x={rx} y={ry}
            width={Math.min(rw, width - rx)}
            height={Math.min(rh, height - ry)}
            fill={color} opacity={0.72} rx={1} />
        );
      })}
    </Svg>
  );
}

// ─── Template Card ────────────────────────────────────────────────

function TemplateCard({ template, onPress }) {
  const { measurements } = template;
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(template)} activeOpacity={0.82}>
      <View style={styles.cardDiagram}>
        <MiniDiagram template={template} width={CARD_W - 24} height={100} />
      </View>
      <Text style={styles.cardName} numberOfLines={2}>{template.name}</Text>
      <Text style={styles.cardSize}>
        {inToDisplay(measurements.width)}W × {inToDisplay(measurements.height)}H
      </Text>
      <Text style={styles.cardCount}>{template.components.length} components</Text>
    </TouchableOpacity>
  );
}

// ─── Preview Modal ────────────────────────────────────────────────

function PreviewModal({ template, visible, onClose, onUse }) {
  if (!template) return null;
  const { measurements, components } = template;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <SafeAreaView style={styles.modal}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.modalClose}>
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle} numberOfLines={1}>{template.name}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.modalContent}>
          {/* Large diagram */}
          <View style={styles.modalDiagram}>
            <MiniDiagram template={template} width={SCREEN_W - 48} height={220} />
          </View>

          {/* Details */}
          <View style={styles.detailRow}>
            {[
              { label: 'Width', value: inToDisplay(measurements.width) },
              { label: 'Height', value: inToDisplay(measurements.height) },
              { label: 'Depth', value: inToDisplay(measurements.depth) },
            ].map(({ label, value }) => (
              <View key={label} style={styles.detailCard}>
                <Text style={styles.detailValue}>{value}</Text>
                <Text style={styles.detailLabel}>{label}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.templateDesc}>{template.description}</Text>

          {/* Tags */}
          <View style={styles.tags}>
            {template.tags.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Component list */}
          <Text style={styles.compListTitle}>Components ({components.length})</Text>
          {(() => {
            const counts = {};
            components.forEach(c => {
              const def = COMPONENTS.find(d => d.id === c.type);
              const label = def?.label ?? c.type;
              counts[label] = (counts[label] ?? 0) + 1;
            });
            return Object.entries(counts).map(([label, count]) => (
              <View key={label} style={styles.compRow}>
                <Text style={styles.compLabel}>{label}</Text>
                <Text style={styles.compQty}>×{count}</Text>
              </View>
            ));
          })()}
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.useBtn} onPress={() => onUse(template)}>
            <Text style={styles.useBtnText}>Use This Template →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────

export default function TemplatePickerScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [preview, setPreview] = useState(null);

  const filtered = useMemo(() => {
    return TEMPLATES.filter(t => {
      const matchesType = filter === 'all' || t.closetType === filter;
      const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [search, filter]);

  function handleUseTemplate(template) {
    setPreview(null);
    navigation.navigate('Designer', {
      design: {
        name: template.name,
        roomType: 'primary',
        closetType: template.closetType,
        measurements: template.measurements,
        material: template.material,
        components: [...template.components],
      },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Templates</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search templates..."
          placeholderTextColor={COLORS.textMuted}
        />
      </View>

      {/* Filters */}
      <FilterChips active={filter} onPress={setFilter} />

      {/* Grid */}
      <FlatList
        data={filtered}
        keyExtractor={t => t.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item }) => (
          <TemplateCard template={item} onPress={setPreview} />
        )}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No templates match your search</Text>
          </View>
        )}
      />

      {/* Preview Modal */}
      <PreviewModal
        template={preview}
        visible={!!preview}
        onClose={() => setPreview(null)}
        onUse={handleUseTemplate}
      />
    </SafeAreaView>
  );
}
