/**
 * ClosetCraft Phase 3.0 — AI Design Wizard
 *
 * A 5-question wizard that collects the user's wardrobe profile,
 * then generates 2-3 optimised layout options via the rule-based engine.
 */

import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  SafeAreaView, Animated,
} from 'react-native';
import { COLORS } from '../utils/constants';
import { generateLayouts, WIZARD_QUESTIONS } from '../utils/aiLayoutEngine';
import LayoutPreview from '../components/LayoutPreview';
import styles from './AIWizardScreen.styles';


// ─── Progress Bar ─────────────────────────────────────────────────

function ProgressBar({ step, total }) {
  const progress = (step / total) * 100;
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${progress}%` }]} />
    </View>
  );
}

// ─── Question Card ────────────────────────────────────────────────

function QuestionCard({ question, currentAnswer, onAnswer }) {
  return (
    <View style={styles.questionCard}>
      <Text style={styles.questionText}>{question.question}</Text>
      {question.hint ? (
        <Text style={styles.questionHint}>{question.hint}</Text>
      ) : null}
      <View style={styles.optionsContainer}>
        {question.options.map(opt => {
          const isSelected = currentAnswer === opt.value ||
            (typeof opt.value === 'boolean' && currentAnswer === opt.value);
          return (
            <TouchableOpacity
              key={String(opt.value)}
              style={[styles.optionBtn, isSelected && styles.optionBtnSelected]}
              onPress={() => onAnswer(opt.value)}
              activeOpacity={0.8}
            >
              <Text style={styles.optionIcon}>{opt.icon}</Text>
              <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                {opt.label}
              </Text>
              {isSelected && (
                <View style={styles.optionCheck}>
                  <Text style={styles.optionCheckText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────

const TOTAL_QUESTIONS = WIZARD_QUESTIONS.length;
const DEFAULT_ANSWERS = {
  users: 'single',
  wardrobeMix: 'mixed',
  shoeCount: 'moderate',
  accessories: false,
  drawerAmount: 'moderate',
};

export default function AIWizardScreen({ navigation, route }) {
  const measurements = route.params?.measurements ?? { width: 72, height: 96, depth: 24 };
  const closetType = route.params?.closetType ?? 'reachin';

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ ...DEFAULT_ANSWERS });
  const [layouts, setLayouts] = useState([]);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  function answer(questionId, value) {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }

  function animateTransition(callback) {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setTimeout(callback, 150);
  }

  function handleNext() {
    if (step < TOTAL_QUESTIONS - 1) {
      animateTransition(() => setStep(s => s + 1));
    } else {
      // Generate layouts
      const generated = generateLayouts(measurements, answers);
      setLayouts(generated);
      setSelectedLayout(generated[0]);
      animateTransition(() => setShowResults(true));
    }
  }

  function handleBack() {
    if (showResults) {
      animateTransition(() => setShowResults(false));
    } else if (step > 0) {
      animateTransition(() => setStep(s => s - 1));
    } else {
      navigation.goBack();
    }
  }

  function handleUseLayout() {
    if (!selectedLayout) return;
    navigation.navigate('Designer', {
      design: {
        name: `AI Layout — ${selectedLayout.name}`,
        roomType: 'primary',
        closetType,
        measurements,
        material: 'melamine-white',
        components: selectedLayout.components,
      },
    });
  }

  const currentQuestion = WIZARD_QUESTIONS[step];
  const currentAnswer = answers[currentQuestion?.id];
  const canProceed = currentAnswer !== undefined && currentAnswer !== null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Designer</Text>
        <View style={{ width: 60 }} />
      </View>

      {!showResults ? (
        <>
          {/* Progress */}
          <View style={styles.progressContainer}>
            <ProgressBar step={step + 1} total={TOTAL_QUESTIONS} />
            <Text style={styles.progressLabel}>
              Question {step + 1} of {TOTAL_QUESTIONS}
            </Text>
          </View>

          {/* Question */}
          <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <QuestionCard
                question={currentQuestion}
                currentAnswer={currentAnswer}
                onAnswer={(val) => answer(currentQuestion.id, val)}
              />
            </ScrollView>
          </Animated.View>

          {/* Next Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.nextBtn, !canProceed && styles.nextBtnDisabled]}
              onPress={handleNext}
              disabled={!canProceed}
            >
              <Text style={styles.nextBtnText}>
                {step < TOTAL_QUESTIONS - 1 ? 'Next →' : 'Generate Layouts ✨'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        /* Results — layout comparison */
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>✨ Your Personalised Layouts</Text>
              <Text style={styles.resultsSubtitle}>
                Based on your wardrobe profile. Pick a starting point and customise from there.
              </Text>
            </View>

            <LayoutPreview
              layouts={layouts}
              closetDims={measurements}
              onSelect={setSelectedLayout}
              selectedId={selectedLayout?.id}
            />

            <View style={styles.resultsFooter}>
              <TouchableOpacity
                style={[styles.useBtn, !selectedLayout && styles.useBtnDisabled]}
                onPress={handleUseLayout}
                disabled={!selectedLayout}
              >
                <Text style={styles.useBtnText}>Start Designing →</Text>
              </TouchableOpacity>

              <Text style={styles.resultsDisclaimer}>
                You can adjust, add, or remove any component in the designer.
              </Text>
            </View>
          </ScrollView>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}
