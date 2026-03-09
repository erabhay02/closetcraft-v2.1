/**
 * NewDesignScreen — Step-by-step design setup
 * Step 1: Room type → Step 2: Closet type → Step 3: Measurements → Step 4: Name & Material
 */
import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, TextInput,
  Animated, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { ROOM_TYPES, CLOSET_TYPES, MATERIALS, COLORS, generateId } from '../utils/constants';
import styles from './NewDesignScreen.styles';

const STEPS = ['Room', 'Closet', 'Size', 'Details'];

// ─── Step Indicator ──────────────────────────────────────────────

function StepIndicator({ current, total }) {
  return (
    <View style={styles.stepRow}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[styles.stepDot, i === current && styles.stepDotActive, i < current && styles.stepDotDone]}
        />
      ))}
    </View>
  );
}

// ─── Step 1 — Room Type ──────────────────────────────────────────

function RoomTypeStep({ value, onChange }) {
  return (
    <View>
      <Text style={styles.stepTitle}>What type of room?</Text>
      <Text style={styles.stepSubtitle}>This helps us suggest the best layout</Text>
      <View style={styles.typeGrid}>
        {ROOM_TYPES.map(room => (
          <TouchableOpacity
            key={room.id}
            style={[styles.typeCard, value === room.id && styles.typeCardActive]}
            onPress={() => { onChange(room.id); Haptics.selectionAsync().catch(() => {}); }}
            activeOpacity={0.75}
          >
            <Text style={styles.typeCardIcon}>{room.icon}</Text>
            <Text style={styles.typeCardLabel}>{room.label}</Text>
            <Text style={styles.typeCardDesc}>{room.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─── Step 2 — Closet Type ────────────────────────────────────────

function ClosetTypeStep({ value, onChange }) {
  return (
    <View>
      <Text style={styles.stepTitle}>Closet configuration?</Text>
      <Text style={styles.stepSubtitle}>Affects default dimensions and layout options</Text>
      {CLOSET_TYPES.map(type => (
        <TouchableOpacity
          key={type.id}
          style={[styles.closetCard, value === type.id && styles.closetCardActive]}
          onPress={() => { onChange(type.id); Haptics.selectionAsync().catch(() => {}); }}
          activeOpacity={0.75}
        >
          <Text style={styles.closetCardIcon}>{type.icon}</Text>
          <View style={styles.closetCardText}>
            <Text style={[styles.closetCardLabel, value === type.id && styles.closetCardLabelActive]}>
              {type.label}
            </Text>
            <Text style={styles.closetCardHint}>
              Typical: {Math.round(type.defaultWidth / 12)}' wide × {Math.round(type.defaultDepth / 12)}' deep
            </Text>
          </View>
          <View style={[styles.closetCardRadio, value === type.id && styles.closetCardRadioActive]}>
            {value === type.id && <View style={styles.closetCardRadioDot} />}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Step 3 — Measurements ───────────────────────────────────────

function MeasurementsStep({ measurements, onChange }) {
  const fields = [
    { key: 'width', label: 'Width', unit: '"', hint: 'Left to right' },
    { key: 'height', label: 'Height', unit: '"', hint: 'Floor to ceiling' },
    { key: 'depth', label: 'Depth', unit: '"', hint: 'Front to back' },
  ];

  return (
    <View>
      <Text style={styles.stepTitle}>Closet dimensions</Text>
      <Text style={styles.stepSubtitle}>Enter measurements in inches (e.g. 96 = 8 feet)</Text>
      {fields.map(field => (
        <View key={field.key} style={styles.inputRow}>
          <View style={styles.inputHeader}>
            <Text style={styles.inputLabel}>{field.label}</Text>
            <Text style={styles.inputHint}>{field.hint}</Text>
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={String(measurements[field.key] ?? '')}
              onChangeText={v => {
                const num = parseInt(v, 10);
                if (!isNaN(num) && num > 0) onChange({ ...measurements, [field.key]: num });
                else if (v === '') onChange({ ...measurements, [field.key]: '' });
              }}
              keyboardType="number-pad"
              returnKeyType="done"
              maxLength={4}
              placeholderTextColor={COLORS.textMuted}
              placeholder="0"
            />
            <Text style={styles.inputUnit}>{field.unit}</Text>
          </View>
        </View>
      ))}
      <View style={styles.measureTip}>
        <Text style={styles.measureTipText}>
          📐 Tip: Use our AR camera measurement for precise results — tap "Camera Measure" on Home.
        </Text>
      </View>
    </View>
  );
}

// ─── Step 4 — Name & Material ─────────────────────────────────────

function DetailsStep({ name, material, onNameChange, onMaterialChange }) {
  return (
    <View>
      <Text style={styles.stepTitle}>Name & finish</Text>
      <Text style={styles.stepSubtitle}>Give your design a name and choose the default material</Text>

      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Design Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={onNameChange}
          placeholder="e.g. Master Closet"
          placeholderTextColor={COLORS.textMuted}
          returnKeyType="done"
          maxLength={40}
        />
      </View>

      <Text style={[styles.inputLabel, { marginBottom: 12 }]}>Default Material</Text>
      <View style={styles.materialList}>
        {MATERIALS.map(mat => (
          <TouchableOpacity
            key={mat.id}
            style={[styles.materialItem, material === mat.id && styles.materialItemActive]}
            onPress={() => { onMaterialChange(mat.id); Haptics.selectionAsync().catch(() => {}); }}
            activeOpacity={0.75}
          >
            <View style={[styles.materialSwatch, { backgroundColor: mat.color }]}>
              {mat.pattern === 'wire' && (
                <>
                  <View style={styles.wireLineH} />
                  <View style={[styles.wireLineH, { top: '40%' }]} />
                  <View style={[styles.wireLineH, { top: '70%' }]} />
                </>
              )}
            </View>
            <Text style={[styles.materialLabel, material === mat.id && styles.materialLabelActive]} numberOfLines={2}>
              {mat.label}
            </Text>
            {material === mat.id && <Text style={styles.materialCheck}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────

export default function NewDesignScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [roomType, setRoomType] = useState('primary');
  const [closetType, setClosetType] = useState('walkin');
  const [measurements, setMeasurements] = useState({ width: 96, height: 96, depth: 72 });
  const [name, setName] = useState('My Closet');
  const [material, setMaterial] = useState('melamine-white');

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const goToStep = (next) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
    setTimeout(() => setStep(next), 100);
  };

  const handleNext = () => {
    if (step === 0 && !roomType) return Alert.alert('Select a room type to continue');
    if (step === 1 && !closetType) return Alert.alert('Select a closet type to continue');
    if (step === 2) {
      const w = Number(measurements.width);
      const h = Number(measurements.height);
      const d = Number(measurements.depth);
      if (!w || !h || !d || w < 12 || h < 24 || d < 6) {
        return Alert.alert('Invalid Measurements', 'Please enter valid dimensions (min: 12"W, 24"H, 6"D).');
      }
      setMeasurements({ width: w, height: h, depth: d });

      // Auto-set a sensible default closet type dimensions
      const ctDef = CLOSET_TYPES.find(c => c.id === closetType);
      if (name === 'My Closet' && ctDef) setName(`${ctDef.label} Closet`);
    }
    goToStep(step + 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  const handleStart = () => {
    if (!name.trim()) return Alert.alert('Enter a name for your design');
    navigation.navigate('Designer', {
      design: {
        id: generateId(),
        name: name.trim(),
        roomType,
        closetType,
        measurements: {
          width: Number(measurements.width),
          height: Number(measurements.height),
          depth: Number(measurements.depth),
        },
        material,
        components: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  const renderStep = () => {
    switch (step) {
      case 0: return <RoomTypeStep value={roomType} onChange={setRoomType} />;
      case 1: return <ClosetTypeStep value={closetType} onChange={setClosetType} />;
      case 2: return <MeasurementsStep measurements={measurements} onChange={setMeasurements} />;
      case 3: return (
        <DetailsStep
          name={name}
          material={material}
          onNameChange={setName}
          onMaterialChange={setMaterial}
        />
      );
      default: return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => step > 0 ? goToStep(step - 1) : navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.headerBtnText}>{step > 0 ? '‹ Back' : '✕'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Design</Text>
        <Text style={styles.stepCounter}>{STEPS[step]}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <StepIndicator current={step} total={STEPS.length} />

        <Animated.View style={{ opacity: fadeAnim }}>
          {renderStep()}
        </Animated.View>

        {/* Navigation buttons */}
        <View style={styles.navRow}>
          {step < STEPS.length - 1 ? (
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.82}>
              <Text style={styles.nextBtnText}>Next  ›</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.startBtn} onPress={handleStart} activeOpacity={0.82}>
              <Text style={styles.startBtnText}>Start Designing  →</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
