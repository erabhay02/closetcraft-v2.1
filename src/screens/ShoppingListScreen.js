/**
 * ClosetCraft Phase 3.2 — Shopping List Screen
 *
 * Categorised checklist of all materials needed for a design.
 * Includes retailer deep links and export (PDF / text / share).
 */

import React, { useState, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView,
  SectionList, Alert, ActivityIndicator,
} from 'react-native';
import * as Sharing from 'expo-sharing';
import { COLORS } from '../utils/constants';
import {
  generateShoppingList,
  exportAsPDF,
  shareAsText,
  openInRetailer,
} from '../utils/shoppingList';
import { formatPrice } from '../utils/costEngine';
import styles from './ShoppingListScreen.styles';

// ─── Checkbox Item ────────────────────────────────────────────────

function CheckItem({ item, checked, onToggle }) {
  return (
    <View style={styles.item}>
      <TouchableOpacity
        style={[styles.checkbox, checked && styles.checkboxChecked]}
        onPress={onToggle}
      >
        {checked && <Text style={styles.checkboxMark}>✓</Text>}
      </TouchableOpacity>

      <View style={styles.itemInfo}>
        <Text style={[styles.itemLabel, checked && styles.itemLabelChecked]}>
          {item.qty > 1 ? `${item.qty}× ` : ''}{item.label}
        </Text>
        <Text style={styles.itemMeta}>{item.dimensions} · {item.material}</Text>
      </View>

      <View style={styles.itemRight}>
        <Text style={styles.itemPrice}>{formatPrice(item.estimatedTotal)}</Text>
        <View style={styles.retailerBtns}>
          <TouchableOpacity
            style={styles.retailerBtn}
            onPress={() => openInRetailer(item.label, 'homedepot')}
          >
            <Text style={styles.retailerBtnText}>HD</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.retailerBtn}
            onPress={() => openInRetailer(item.label, 'lowes')}
          >
            <Text style={styles.retailerBtnText}>L's</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Section Header ───────────────────────────────────────────────

function SectionHeader({ title, count }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionCount}>{count} item{count !== 1 ? 's' : ''}</Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────

export default function ShoppingListScreen({ navigation, route }) {
  const design = route.params?.design ?? { components: [], material: 'melamine-white' };

  const categories = useMemo(() => generateShoppingList(design), [design]);
  const [checkedKeys, setCheckedKeys] = useState(new Set());
  const [exporting, setExporting] = useState(false);

  const sections = categories.map(cat => ({
    title: cat.category,
    data: cat.items,
  }));

  const totalEstimate = categories
    .flatMap(c => c.items)
    .reduce((sum, item) => sum + item.estimatedTotal, 0);

  const checkedCount = checkedKeys.size;
  const totalItems = categories.flatMap(c => c.items).length;

  function toggleItem(key) {
    setCheckedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function itemKey(item, categoryTitle) {
    return `${categoryTitle}__${item.type}__${item.dimensions}`;
  }

  async function handleExportPDF() {
    setExporting(true);
    try {
      const uri = await exportAsPDF(categories, design);
      const available = await Sharing.isAvailableAsync();
      if (available) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Shopping List PDF' });
      } else {
        Alert.alert('PDF saved', uri);
      }
    } catch (err) {
      Alert.alert('Export failed', err.message);
    } finally {
      setExporting(false);
    }
  }

  async function handleShareText() {
    try {
      await shareAsText(categories, design);
    } catch (err) {
      Alert.alert('Share failed', err.message);
    }
  }

  function handleCheckAll() {
    const allKeys = categories
      .flatMap(cat => cat.items.map(item => itemKey(item, cat.category)));
    if (checkedCount === totalItems) {
      setCheckedKeys(new Set());
    } else {
      setCheckedKeys(new Set(allKeys));
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping List</Text>
        <TouchableOpacity onPress={handleCheckAll} style={styles.checkAllBtn}>
          <Text style={styles.checkAllText}>
            {checkedCount === totalItems ? 'Uncheck' : 'Check All'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%` }]} />
        </View>
        <Text style={styles.progressText}>{checkedCount}/{totalItems} items</Text>
      </View>

      {/* List */}
      <SectionList
        sections={sections}
        keyExtractor={(item, idx) => `${item.type}-${item.dimensions}-${idx}`}
        renderSectionHeader={({ section }) => (
          <SectionHeader title={section.title} count={section.data.length} />
        )}
        renderItem={({ item, section }) => {
          const key = itemKey(item, section.title);
          return (
            <CheckItem
              item={item}
              checked={checkedKeys.has(key)}
              onToggle={() => toggleItem(key)}
            />
          );
        }}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No components found in this design.</Text>
          </View>
        )}
        ListFooterComponent={() => (
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Estimated Total</Text>
              <Text style={styles.totalValue}>{formatPrice(totalEstimate)}</Text>
            </View>
            <Text style={styles.disclaimer}>
              Prices are estimates. Verify at your local retailer.
            </Text>
          </View>
        )}
      />

      {/* Export bar */}
      <View style={styles.exportBar}>
        <TouchableOpacity
          style={[styles.exportBtn, exporting && styles.exportBtnDisabled]}
          onPress={handleExportPDF}
          disabled={exporting}
        >
          {exporting ? (
            <ActivityIndicator color="#1a1a2e" size="small" />
          ) : (
            <Text style={styles.exportBtnText}>📄 Export PDF</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.exportBtn, styles.exportBtnOutline]} onPress={handleShareText}>
          <Text style={styles.exportBtnOutlineText}>📤 Share Text</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
