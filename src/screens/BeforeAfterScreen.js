/**
 * ClosetCraft Phase 3.0 — Before & After Photo Mode
 *
 * Lets the user photograph their current closet, then overlay
 * a wireframe of their design to visualise the transformation.
 */

import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  Image, Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Sharing from 'expo-sharing';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { COLORS, COMPONENTS, inToDisplay } from '../utils/constants';
import styles, { SCREEN_W } from './BeforeAfterScreen.styles';

const CANVAS_SCALE = 4;

// ─── Design Overlay SVG ───────────────────────────────────────────

function DesignOverlay({ design, width, height, opacity = 0.6 }) {
  if (!design) return null;
  const { measurements, components = [] } = design;
  const { width: cW = 72, height: cH = 96 } = measurements || {};
  const scaleX = width / cW;
  const scaleY = height / cH;

  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
      {/* Closet frame */}
      <Rect x={0} y={0} width={width} height={height}
        fill="transparent" stroke={COLORS.gold} strokeWidth={2} opacity={opacity} />

      {/* Components */}
      {components.map((comp, i) => {
        const def = COMPONENTS.find(c => c.id === comp.type);
        const color = def?.color ?? '#6b8e9e';
        const xIn = comp.x / CANVAS_SCALE;
        const yIn = comp.y / CANVAS_SCALE;
        const rx = xIn * scaleX;
        const ry = yIn * scaleY;
        const rw = Math.max(comp.w * scaleX - 1, 2);
        const rh = Math.max(comp.h * scaleY - 1, 2);
        if (rx >= width || ry >= height) return null;
        return (
          <Rect key={comp.id ?? i}
            x={rx} y={ry}
            width={Math.min(rw, width - rx)}
            height={Math.min(rh, height - ry)}
            fill={color} fillOpacity={0.25 * opacity}
            stroke={color} strokeOpacity={opacity}
            strokeWidth={1.5} rx={2} />
        );
      })}

      {/* Dimension label */}
      <SvgText
        x={width / 2} y={height - 8}
        fill={COLORS.gold} fontSize={11} textAnchor="middle" opacity={opacity}>
        {inToDisplay(cW)}W × {inToDisplay(cH)}H
      </SvgText>
    </Svg>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────

const MODES = {
  CAMERA: 'camera',
  PREVIEW: 'preview',
};

export default function BeforeAfterScreen({ navigation, route }) {
  const design = route.params?.design ?? null;
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState(MODES.CAMERA);
  const [photoUri, setPhotoUri] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const cameraRef = useRef(null);

  async function handleCapture() {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85 });
      setPhotoUri(photo.uri);
      setMode(MODES.PREVIEW);
      setShowOverlay(false);
    } catch (err) {
      Alert.alert('Error', 'Could not take photo. Please try again.');
    }
  }

  async function handleShare() {
    if (!photoUri) return;
    try {
      const available = await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert('Sharing not available', 'Please save the photo manually.');
        return;
      }
      await Sharing.shareAsync(photoUri, {
        mimeType: 'image/jpeg',
        dialogTitle: 'Share Before & After',
      });
    } catch (err) {
      Alert.alert('Error', 'Could not share image.');
    }
  }

  // Permission not determined
  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.permText}>Checking camera permission…</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Permission denied
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.permIcon}>📷</Text>
          <Text style={styles.permTitle}>Camera Access Needed</Text>
          <Text style={styles.permText}>
            We need camera permission to photograph your closet.
          </Text>
          <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
            <Text style={styles.permBtnText}>Allow Camera Access</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backBtnPlain} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnPlainText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Camera view
  if (mode === MODES.CAMERA) {
    return (
      <View style={styles.container}>
        <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back">
          {/* Guide overlay */}
          <View style={styles.guideFrame} />

          {/* Header */}
          <SafeAreaView>
            <View style={styles.cameraHeader}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cameraHeaderBtn}>
                <Text style={styles.cameraHeaderText}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.cameraTitle}>Before Photo</Text>
              <View style={{ width: 60 }} />
            </View>
          </SafeAreaView>

          {/* Instructions */}
          <View style={styles.cameraInstructions}>
            <Text style={styles.instructionText}>
              Stand back and frame your entire closet opening
            </Text>
          </View>

          {/* Capture button */}
          <View style={styles.cameraFooter}>
            <TouchableOpacity style={styles.captureBtn} onPress={handleCapture}>
              <View style={styles.captureBtnInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  // Preview / Before+After view
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { setMode(MODES.CAMERA); setPhotoUri(null); }} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Retake</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {showOverlay ? '✨ After' : '📷 Before'}
        </Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
          <Text style={styles.shareBtnText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Photo */}
      <View style={styles.photoContainer}>
        <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="contain" />
        {showOverlay && design && (
          <DesignOverlay
            design={design}
            width={SCREEN_W - 32}
            height={(SCREEN_W - 32) * 1.2}
            opacity={0.75}
          />
        )}
      </View>

      {/* Toggle */}
      <View style={styles.toggleContainer}>
        <View style={styles.toggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, !showOverlay && styles.toggleBtnActive]}
            onPress={() => setShowOverlay(false)}
          >
            <Text style={[styles.toggleBtnText, !showOverlay && styles.toggleBtnTextActive]}>
              📷 Before
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, showOverlay && styles.toggleBtnActive]}
            onPress={() => setShowOverlay(true)}
          >
            <Text style={[styles.toggleBtnText, showOverlay && styles.toggleBtnTextActive]}>
              ✨ After
            </Text>
          </TouchableOpacity>
        </View>

        {!design && showOverlay && (
          <Text style={styles.noDesignNote}>
            Open a saved design and tap "Before & After" to see the overlay.
          </Text>
        )}

        <TouchableOpacity style={styles.shareFullBtn} onPress={handleShare}>
          <Text style={styles.shareFullBtnText}>Share Comparison</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
