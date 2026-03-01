/**
 * ClosetCraft Phase 3.2 — Cost Estimate Screen
 *
 * Displays a full cost breakdown for a design.
 * Toggles between DIY and Professional installation totals.
 */

import React, { useState, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView,
  ScrollView,
} from 'react-native';
import { COLORS } from '../utils/constants';
import { calculateCost, formatPrice, formatPriceRange } from '../utils/costEngine';
import styles from './CostEstimateScreen.styles';

// ─── Section header ───────────────────────────────────────────────

function SectionHeader({ title }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );
}

// ─── Line Item Row ────────────────────────────────────────────────

function LineItemRow({ item }) {
  return (
    <View style={styles.lineRow}>
      <Text style={styles.lineLabel}>
        {item.quantity > 1 ? `${item.quantity}× ` : ''}{item.label}
      </Text>
      <Text style={styles.linePrice}>{formatPrice(item.totalPrice)}</Text>
    </View>
  );
}

// ─── Total Row ────────────────────────────────────────────────────

function TotalRow({ label, value, isMain }) {
  return (
    <View style={[styles.totalRow, isMain && styles.totalRowMain]}>
      <Text style={[styles.totalLabel, isMain && styles.totalLabelMain]}>{label}</Text>
      <Text style={[styles.totalValue, isMain && styles.totalValueMain]}>{value}</Text>
    </View>
  );
}

// ─── Install Toggle ───────────────────────────────────────────────

function InstallToggle({ value, onChange }) {
  return (
    <View style={styles.toggle}>
      {['diy', 'professional'].map(opt => (
        <TouchableOpacity
          key={opt}
          style={[styles.toggleOption, value === opt && styles.toggleOptionActive]}
          onPress={() => onChange(opt)}
        >
          <Text style={[styles.toggleOptionText, value === opt && styles.toggleOptionTextActive]}>
            {opt === 'diy' ? '🔨 DIY' : '👷 Professional'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────

export default function CostEstimateScreen({ navigation, route }) {
  const design = route.params?.design ?? { components: [], material: 'melamine-white' };
  const [installType, setInstallType] = useState('diy');

  const breakdown = useMemo(() => calculateCost(design), [design]);

  const totalDisplay = installType === 'diy'
    ? formatPrice(breakdown.totalDIY)
    : formatPriceRange(breakdown.totalProLow, breakdown.totalProHigh);

  const isWoodOrLaminate = design.material && !design.material.startsWith('wire-');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cost Estimate</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Install type toggle */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Installation Type</Text>
          <InstallToggle value={installType} onChange={setInstallType} />
          <Text style={styles.installNote}>
            {installType === 'diy'
              ? 'DIY cost assumes you do the installation yourself.'
              : 'Professional install estimate: $200–$400 for a typical closet.'}
          </Text>
        </View>

        {/* Materials breakdown */}
        <View style={styles.card}>
          <SectionHeader title={`MATERIALS · ${breakdown.materialLabel}`} />

          {breakdown.lineItems.length === 0 ? (
            <Text style={styles.emptyText}>No components in this design yet.</Text>
          ) : (
            breakdown.lineItems.map((item, i) => (
              <LineItemRow key={item.type + i} item={item} />
            ))
          )}

          <View style={styles.divider} />
          <TotalRow label="Subtotal — Materials" value={formatPrice(breakdown.subtotalMaterials)} />
          <TotalRow label="Hardware & Fasteners" value={formatPrice(breakdown.hardware)} />
        </View>

        {/* Installation */}
        <View style={styles.card}>
          <SectionHeader title="INSTALLATION" />
          <TotalRow
            label={installType === 'diy' ? 'DIY (self-install)' : 'Professional Install'}
            value={installType === 'diy' ? '$0.00' : formatPriceRange(breakdown.installProLow, breakdown.installProHigh)}
          />
        </View>

        {/* Grand total */}
        <View style={[styles.card, styles.totalCard]}>
          <TotalRow
            label={installType === 'diy' ? 'TOTAL (DIY)' : 'TOTAL (Professional)'}
            value={totalDisplay}
            isMain
          />
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>{breakdown.disclaimer}</Text>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('ShoppingList', { design })}
          >
            <Text style={styles.actionBtnText}>🛒 View Shopping List</Text>
          </TouchableOpacity>

          {isWoodOrLaminate && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnOutline]}
              onPress={() => navigation.navigate('CutList', { design })}
            >
              <Text style={styles.actionBtnTextOutline}>📋 Cut List (for DIY)</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
