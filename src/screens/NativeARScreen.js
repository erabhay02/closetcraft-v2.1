/**
 * NativeARScreen
 *
 * Full-screen AR measurement experience using native ARKit/ARCore.
 * Automatically falls back to the photo-based ARMeasureScreen if
 * native AR is not available.
 *
 * Flow:
 * 1. Check AR support on mount
 * 2. Show scanning UI while planes are detected
 * 3. Guide user through measuring width → height → depth
 * 4. Return measurements to the calling screen
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { COLORS, inToDisplay } from '../utils/constants';
import { checkARSupport, MeasurementFlow } from '../utils/arBridge';

const { width: SW, height: SH } = Dimensions.get('window');

const STEPS = [
  { key: 'width', label: 'Width', icon: '↔️', hint: 'Tap left edge, then right edge of the wall', color: '#e2b97f' },
  { key: 'height', label: 'Height', icon: '↕️', hint: 'Tap the floor, then the ceiling', color: '#6b8e9e' },
  { key: 'depth', label: 'Depth', icon: '↗️', hint: 'Tap the back wall, then the front edge', color: '#7b9e6b' },
];

export default function NativeARScreen({ navigation, route }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [arSupport, setArSupport] = useState(null);
  const [status, setStatus] = useState('checking'); // checking | scanning | measuring | complete
  const [currentStep, setCurrentStep] = useState(0);
  const [pointSet, setPointSet] = useState(false); // whether first point of current measurement is set
  const [measurements, setMeasurements] = useState({ width: 0, height: 0, depth: 0 });
  const [trackingStatus, setTrackingStatus] = useState('initializing');
  const [planesDetected, setPlanesDetected] = useState(0);
  const [confidence, setConfidence] = useState('unknown');
  const flowRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scanAnim = useRef(new Animated.Value(0)).current;

  // Pulse animation for tap indicator
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Scanning sweep animation
  useEffect(() => {
    if (status === 'scanning') {
      const sweep = Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(scanAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
        ])
      );
      sweep.start();
      return () => sweep.stop();
    }
  }, [status]);

  // Check AR support on mount
  useEffect(() => {
    (async () => {
      const support = await checkARSupport();
      setArSupport(support);

      if (!support.arSupported || !support.nativeModuleLoaded) {
        // Redirect to photo-based measurement
        navigation.replace('ARMeasure', route.params);
        return;
      }

      setStatus('scanning');
      startMeasurementFlow();
    })();

    return () => {
      flowRef.current?.stop();
    };
  }, []);

  const startMeasurementFlow = () => {
    const flow = new MeasurementFlow();

    flow.onProgress((step, total, label, hint) => {
      setCurrentStep(step - 1);
      setPointSet(false);
      setStatus('measuring');
    });

    flow.onComplete((m) => {
      setMeasurements(m);
      setStatus('complete');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    });

    flow.onError((err) => {
      console.warn('AR measurement error:', err);
    });

    flow.start().then(() => {
      // Listen for tracking changes
      flow.session.on('tracking', (data) => {
        setTrackingStatus(data.status);
      });

      flow.session.on('plane', () => {
        setPlanesDetected(p => p + 1);
      });
    });

    flowRef.current = flow;
  };

  // Handle screen tap for measurement
  const handleTap = useCallback(async (event) => {
    const { locationX, locationY } = event.nativeEvent;
    if (!flowRef.current || status !== 'measuring') return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const result = await flowRef.current.addPoint(locationX, locationY);

      if (result.status === 'startPointSet') {
        setPointSet(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (result.status === 'measured') {
        setConfidence(result.confidence || 'high');
        const key = STEPS[currentStep].key;
        setMeasurements(m => ({ ...m, [key]: Math.round(result.distanceInches) }));
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [status, currentStep]);

  // ─── Permission Gate ───────────────────────────────────────────
  if (!permission?.granted) {
    return (
      <View style={s.container}>
        <View style={s.center}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>📷</Text>
          <Text style={s.title}>Camera Access Required</Text>
          <Text style={s.subtitle}>
            AR measurement needs your camera to detect walls and surfaces.
          </Text>
          <TouchableOpacity style={s.primaryBtn} onPress={requestPermission}>
            <Text style={s.primaryBtnText}>Grant Camera Access</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ─── Loading ───────────────────────────────────────────────────
  if (status === 'checking' || arSupport === null) {
    return (
      <View style={[s.container, s.center]}>
        <Text style={{ fontSize: 36, marginBottom: 12 }}>🔍</Text>
        <Text style={s.subtitle}>Checking AR capabilities...</Text>
      </View>
    );
  }

  // ─── Results ───────────────────────────────────────────────────
  if (status === 'complete') {
    return (
      <View style={s.container}>
        <View style={s.center}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>✅</Text>
          <Text style={s.title}>Measurements Complete</Text>

          <View style={s.resultsCard}>
            {STEPS.map((step, i) => (
              <View key={step.key} style={s.resultRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 20 }}>{step.icon}</Text>
                  <Text style={s.resultLabel}>{step.label}</Text>
                </View>
                <Text style={[s.resultValue, { color: step.color }]}>
                  {inToDisplay(measurements[step.key])}
                </Text>
              </View>
            ))}
          </View>

          <View style={s.confidenceRow}>
            <Text style={{ fontSize: 12, color: COLORS.textSec }}>
              Confidence: {confidence === 'high' ? '🟢 High' : '🟡 Medium'} — Verify with tape measure
            </Text>
          </View>

          <TouchableOpacity style={s.primaryBtn} onPress={() => {
            if (route.params?.onMeasured) {
              route.params.onMeasured(measurements);
            }
            navigation.goBack();
          }}>
            <Text style={s.primaryBtnText}>Use These Measurements →</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.secondaryBtn} onPress={() => {
            setStatus('scanning');
            setCurrentStep(0);
            setMeasurements({ width: 0, height: 0, depth: 0 });
            startMeasurementFlow();
          }}>
            <Text style={s.secondaryBtnText}>Retake All</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ─── AR Camera View ────────────────────────────────────────────
  const step = STEPS[currentStep] || STEPS[0];

  return (
    <View style={s.container}>
      <CameraView style={StyleSheet.absoluteFill} facing="back">
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleTap}
          style={StyleSheet.absoluteFill}
        >
          {/* Top status bar */}
          <View style={s.topBar}>
            <TouchableOpacity onPress={() => { flowRef.current?.stop(); navigation.goBack(); }}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>✕ Close</Text>
            </TouchableOpacity>
            <View style={s.trackingBadge}>
              <View style={[s.trackingDot, {
                backgroundColor: trackingStatus === 'normal' ? '#4ade80'
                  : trackingStatus === 'limited' ? '#fbbf24' : '#f87171'
              }]} />
              <Text style={s.trackingText}>
                {trackingStatus === 'normal' ? 'Tracking Good'
                  : trackingStatus === 'limited' ? 'Move Slowly'
                  : 'Initializing...'}
              </Text>
            </View>
          </View>

          {/* Scanning overlay */}
          {status === 'scanning' && (
            <View style={s.scanOverlay}>
              <Animated.View style={[s.scanLine, {
                transform: [{ translateY: scanAnim.interpolate({
                  inputRange: [0, 1], outputRange: [0, SH * 0.5]
                })}],
              }]} />
              <Text style={s.scanText}>Scanning for surfaces...</Text>
              <Text style={s.scanSubtext}>
                Point at walls slowly • {planesDetected} surface{planesDetected !== 1 ? 's' : ''} found
              </Text>
            </View>
          )}

          {/* Crosshair */}
          {status === 'measuring' && (
            <Animated.View style={[s.crosshair, { transform: [{ scale: pulseAnim }] }]}>
              <View style={[s.crosshairLine, { width: 24, height: 2 }]} />
              <View style={[s.crosshairLine, { width: 2, height: 24 }]} />
            </Animated.View>
          )}

          {/* Measurement progress */}
          <View style={s.progressBar}>
            {STEPS.map((st, i) => (
              <View key={st.key} style={[
                s.progressStep,
                i < currentStep && s.progressStepDone,
                i === currentStep && s.progressStepActive,
              ]}>
                <Text style={[s.progressIcon, i <= currentStep && { opacity: 1 }]}>{st.icon}</Text>
                <Text style={[s.progressLabel, i === currentStep && { color: st.color }]}>{st.label}</Text>
                {measurements[st.key] > 0 && (
                  <Text style={s.progressValue}>{inToDisplay(measurements[st.key])}</Text>
                )}
              </View>
            ))}
          </View>

          {/* Bottom instruction */}
          <View style={s.bottomBar}>
            <View style={[s.stepIndicator, { backgroundColor: step.color + '30' }]}>
              <Text style={[s.stepLabel, { color: step.color }]}>
                {step.icon} Measuring {step.label}
              </Text>
            </View>
            <Text style={s.hintText}>
              {pointSet
                ? `Now tap the end point for ${step.label.toLowerCase()}`
                : step.hint}
            </Text>
            <Text style={s.stepCount}>
              Step {currentStep + 1} of {STEPS.length}
              {pointSet ? ' • Start point set ✓' : ''}
            </Text>
          </View>
        </TouchableOpacity>
      </CameraView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: COLORS.textSec, textAlign: 'center', lineHeight: 22, marginBottom: 28, maxWidth: 300 },

  primaryBtn: { backgroundColor: COLORS.gold, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 36, width: '100%', alignItems: 'center', marginBottom: 12 },
  primaryBtnText: { color: COLORS.bg, fontSize: 16, fontWeight: '700' },
  secondaryBtn: { paddingVertical: 14, paddingHorizontal: 24, alignItems: 'center' },
  secondaryBtnText: { color: COLORS.textSec, fontSize: 14, fontWeight: '600' },

  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 56, paddingHorizontal: 20, paddingBottom: 12, backgroundColor: 'rgba(0,0,0,0.3)' },
  trackingBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 8, paddingVertical: 4, paddingHorizontal: 10 },
  trackingDot: { width: 8, height: 8, borderRadius: 4 },
  trackingText: { color: '#fff', fontSize: 11, fontWeight: '600' },

  scanOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanLine: { position: 'absolute', left: 20, right: 20, height: 2, backgroundColor: COLORS.gold, opacity: 0.6 },
  scanText: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 4 },
  scanSubtext: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },

  crosshair: { position: 'absolute', top: SH / 2 - 12, left: SW / 2 - 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  crosshairLine: { position: 'absolute', backgroundColor: COLORS.gold, borderRadius: 1 },

  progressBar: { position: 'absolute', top: 110, left: 16, right: 16, flexDirection: 'row', gap: 8 },
  progressStep: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: 10, alignItems: 'center', opacity: 0.5 },
  progressStepDone: { opacity: 1, backgroundColor: 'rgba(123,158,107,0.3)' },
  progressStepActive: { opacity: 1, backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 1, borderColor: 'rgba(226,185,127,0.4)' },
  progressIcon: { fontSize: 18, opacity: 0.4 },
  progressLabel: { color: '#fff', fontSize: 11, fontWeight: '600', marginTop: 2 },
  progressValue: { color: COLORS.gold, fontSize: 13, fontWeight: '700', marginTop: 2, fontVariant: ['tabular-nums'] },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', padding: 20, paddingBottom: 40, alignItems: 'center' },
  stepIndicator: { borderRadius: 8, paddingVertical: 6, paddingHorizontal: 16, marginBottom: 8 },
  stepLabel: { fontSize: 15, fontWeight: '700' },
  hintText: { color: '#fff', fontSize: 14, textAlign: 'center', marginBottom: 4 },
  stepCount: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },

  resultsCard: { width: '100%', backgroundColor: COLORS.bgCard, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border, marginBottom: 16 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  resultLabel: { color: COLORS.textSec, fontSize: 15, fontWeight: '600' },
  resultValue: { fontSize: 24, fontWeight: '700', fontVariant: ['tabular-nums'] },
  confidenceRow: { marginBottom: 20 },
});
