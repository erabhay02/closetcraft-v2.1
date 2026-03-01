/**
 * ClosetCraft Phase 3.1 — Share Design Screen
 *
 * Generates a shareable link for a design and provides copy/share actions.
 * The link format is closetcraft.app/d/{designId} — in production this
 * would be resolved by a Supabase edge function or web redirect.
 */

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView,
  Alert, ScrollView,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import { COLORS, inToDisplay, MATERIALS } from '../utils/constants';
import styles from './ShareDesignScreen.styles';

// ─── Helpers ──────────────────────────────────────────────────────

function getShareLink(designId) {
  return `https://closetcraft.app/d/${designId}`;
}

function getMaterialLabel(materialId) {
  return MATERIALS.find(m => m.id === materialId)?.label ?? materialId;
}

// ─── Thumbnail (material color swatch) ───────────────────────────

function DesignThumbnail({ design }) {
  const mat = MATERIALS.find(m => m.id === design.material);
  const color = mat?.color ?? '#c4a265';
  const { width = 72, height = 96 } = design.measurements ?? {};

  return (
    <View style={[styles.thumbnail, { backgroundColor: color + '30', borderColor: color + '60' }]}>
      <View style={[styles.thumbnailSwatch, { backgroundColor: color }]} />
      <View style={styles.thumbnailInfo}>
        <Text style={styles.thumbnailName} numberOfLines={1}>{design.name}</Text>
        <Text style={styles.thumbnailMeta}>
          {inToDisplay(width)}W × {inToDisplay(height)}H
        </Text>
        <Text style={styles.thumbnailMeta}>
          {design.components?.length ?? 0} components · {getMaterialLabel(design.material)}
        </Text>
      </View>
    </View>
  );
}

// ─── Link Row ─────────────────────────────────────────────────────

function LinkRow({ link, onCopy, copied }) {
  return (
    <View style={styles.linkRow}>
      <Text style={styles.linkText} numberOfLines={1} ellipsizeMode="middle">
        {link}
      </Text>
      <TouchableOpacity style={[styles.copyBtn, copied && styles.copyBtnDone]} onPress={onCopy}>
        <Text style={styles.copyBtnText}>{copied ? '✓ Copied' : 'Copy'}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────

export default function ShareDesignScreen({ navigation, route }) {
  const design = route.params?.design ?? {};
  const link = getShareLink(design.id ?? 'preview');
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await Clipboard.setStringAsync(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    const available = await Sharing.isAvailableAsync();
    if (!available) {
      Alert.alert('Copy the link instead', link);
      return;
    }
    const message = `Check out my closet design: ${link}\n\nCreated with ClosetCraft`;
    // Share as a text file so the URL is included
    await Sharing.shareAsync(
      `data:text/plain,${encodeURIComponent(message)}`,
      { mimeType: 'text/plain', dialogTitle: 'Share Design' }
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share Design</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Design card */}
        <DesignThumbnail design={design} />

        {/* Link section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shareable Link</Text>
          <LinkRow link={link} onCopy={handleCopy} copied={copied} />
          <Text style={styles.linkNote}>
            🔗 Anyone with this link can view your design in a browser.
            Link requires cloud sync to work publicly.
          </Text>
        </View>

        {/* Share actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Share Via</Text>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Text style={styles.actionIcon}>📤</Text>
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>System Share Sheet</Text>
              <Text style={styles.actionDesc}>Messages, AirDrop, Email, and more</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={handleCopy}>
            <Text style={styles.actionIcon}>📋</Text>
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Copy Link</Text>
              <Text style={styles.actionDesc}>Paste it anywhere you like</Text>
            </View>
            <Text style={styles.actionArrow}>{copied ? '✓' : '›'}</Text>
          </TouchableOpacity>
        </View>

        {/* Cloud sync note */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>How sharing works</Text>
          <Text style={styles.infoBody}>
            When cloud sync is enabled (Account → Sign In), your designs are
            uploaded automatically and the share link becomes a live interactive
            3D viewer that anyone can open — no app required.
          </Text>
          <Text style={styles.infoBody}>
            Without cloud sync, the link works as a reference but does not load
            design data for recipients.
          </Text>
          <TouchableOpacity
            style={styles.signInPrompt}
            onPress={() => navigation.navigate('Auth')}
          >
            <Text style={styles.signInPromptText}>Enable Cloud Sync →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
