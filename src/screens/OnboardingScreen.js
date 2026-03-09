/**
 * OnboardingScreen — First-run welcome flow
 * 4 slides shown once on fresh install. Saves flag to AsyncStorage on completion.
 */
import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, Animated, Dimensions, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { COLORS, STORAGE_KEYS } from '../utils/constants';

const { width: SCREEN_W } = Dimensions.get('window');

const SLIDES = [
  {
    icon: '🚪',
    title: 'Welcome to ClosetCraft',
    desc: 'Design your perfect closet space with a powerful 2D canvas, drag-and-drop components, and real-time cost tracking.',
    accent: COLORS.gold,
  },
  {
    icon: '✨',
    title: 'AI-Powered Layouts',
    desc: 'Answer 5 quick questions about your wardrobe. Our AI generates 3 optimised layout options in seconds — no design experience needed.',
    accent: '#9e6b8e',
  },
  {
    icon: '📐',
    title: 'Measure with AR',
    desc: 'Point your camera at your closet space and tap to measure. No tape measure required — accurate to within an inch.',
    accent: COLORS.blue,
  },
  {
    icon: '💰',
    title: 'Know the Cost Upfront',
    desc: 'Every component has real pricing. See your total materials cost, get a shopping list, and compare DIY vs professional installation.',
    accent: COLORS.green,
  },
];

// ─── Dot Indicator ────────────────────────────────────────────────

function Dots({ count, current }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: count }).map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.dot,
            i === current
              ? [styles.dotActive, { backgroundColor: SLIDES[current].accent }]
              : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
}

// ─── Slide ────────────────────────────────────────────────────────

function Slide({ slide }) {
  return (
    <View style={styles.slide}>
      <View style={[styles.iconWrapper, { backgroundColor: slide.accent + '20' }]}>
        <Text style={styles.slideIcon}>{slide.icon}</Text>
      </View>
      <Text style={styles.slideTitle}>{slide.title}</Text>
      <Text style={styles.slideDesc}>{slide.desc}</Text>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────

export default function OnboardingScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const isLast = step === SLIDES.length - 1;

  const transition = (nextStep) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 130, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -20, duration: 130, useNativeDriver: true }),
    ]).start(() => {
      setStep(nextStep);
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    });
    Haptics.selectionAsync().catch(() => {});
  };

  const handleNext = () => {
    if (!isLast) {
      transition(step + 1);
    }
  };

  const finish = async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.onboarded, 'true').catch(() => {});
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
  };

  const skip = async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.onboarded, 'true').catch(() => {});
    navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
  };

  const slide = SLIDES[step];

  return (
    <View style={styles.screen}>
      {/* Skip button */}
      {!isLast && (
        <TouchableOpacity style={styles.skipBtn} onPress={skip} activeOpacity={0.7}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Slide content */}
      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <Slide slide={slide} />
      </Animated.View>

      {/* Bottom area */}
      <View style={styles.bottom}>
        <Dots count={SLIDES.length} current={step} />

        {!isLast ? (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.82}>
            <Text style={styles.nextBtnText}>Next  ›</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: COLORS.gold }]}
            onPress={finish}
            activeOpacity={0.82}
          >
            <Text style={[styles.nextBtnText, { color: COLORS.bg }]}>Get Started  →</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 48,
    paddingHorizontal: 32,
  },
  skipBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  skipText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  slide: {
    alignItems: 'center',
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  slideIcon: {
    fontSize: 52,
  },
  slideTitle: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  slideDesc: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
  },
  bottom: {
    gap: 24,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    borderRadius: 4,
    height: 6,
  },
  dotActive: {
    width: 24,
  },
  dotInactive: {
    width: 8,
    backgroundColor: COLORS.bgElevated,
  },
  nextBtn: {
    width: '100%',
    backgroundColor: COLORS.bgElevated,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  nextBtnText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});
