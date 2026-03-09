/**
 * ClosetCraft v3.0 — App Entry Point
 *
 * Phase 3 adds:
 * - AI Design Wizard (rule-based layout generator)
 * - 10 Starter Templates
 * - Before & After Photo Mode
 * - Cloud Sync via Supabase (scaffolded)
 * - Shareable Design Links
 * - Cost Estimator + Shopping List + Cut List
 * - Auth Screen
 *
 * Tech Stack: React Native + Expo SDK 54, React Navigation v7
 */

import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Text, View, TouchableOpacity, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './utils/constants';

// ─── Screens ──────────────────────────────────────────────────────

// Phase 2.x
import SavedDesignsScreen from './screens/SavedDesignsScreen';
import ARMeasureScreen from './screens/ARMeasureScreen';
import NewDesignScreen from './screens/NewDesignScreen';
import DesignerScreen from './screens/DesignerScreen';

// Phase 3.0 — AI + Templates
import AIWizardScreen from './screens/AIWizardScreen';
import TemplatePickerScreen from './screens/TemplatePickerScreen';
import BeforeAfterScreen from './screens/BeforeAfterScreen';

// Phase 3.1 — Cloud Sync
import AuthScreen from './screens/AuthScreen';
import ShareDesignScreen from './screens/ShareDesignScreen';

// Phase 3.2 — Cost Estimator
import CostEstimateScreen from './screens/CostEstimateScreen';
import ShoppingListScreen from './screens/ShoppingListScreen';
import CutListScreen from './screens/CutListScreen';

// Onboarding
import OnboardingScreen from './screens/OnboardingScreen';

// Component Picker
import ComponentPickerScreen from './screens/ComponentPickerScreen';
import styles from './App.styles';

// ─── Navigation ───────────────────────────────────────────────────

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Shared Component ─────────────────────────────────────────────

function PrimaryButton({ title, onPress, variant = 'primary', style }) {
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.btn,
        isPrimary ? styles.btnPrimary : styles.btnOutline,
        style,
      ]}
      activeOpacity={0.82}
    >
      <Text style={isPrimary ? styles.btnTextPrimary : styles.btnTextOutline}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Tab Icon ─────────────────────────────────────────────────────

function TabIcon({ icon, focused }) {
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{icon}</Text>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────

function HomeScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.homeContent} showsVerticalScrollIndicator={false}>
        <View style={styles.homeHero}>
          <Text style={styles.homeEmoji}>🚪</Text>
          <Text style={styles.homeTitle}>ClosetCraft</Text>
          <Text style={styles.homeSubtitle}>
            Design your perfect closet with AI-powered layouts,
            AR measurement, and built-in cost estimation.
          </Text>
        </View>

        {/* Phase 2 — Standard entry points */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>START FROM SCRATCH</Text>
          <PrimaryButton
            title="📐 New Design (Manual)"
            onPress={() => navigation.navigate('NewDesign')}
          />
          <PrimaryButton
            title="📷 New Design (Camera Measure)"
            variant="outline"
            onPress={() => navigation.navigate('ARMeasure')}
            style={{ marginTop: 10 }}
          />
        </View>

        {/* Phase 3.0 — AI + Templates */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>INTELLIGENT DESIGN</Text>

          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => navigation.navigate('AIWizard')}
            activeOpacity={0.82}
          >
            <Text style={styles.featureCardIcon}>✨</Text>
            <View style={styles.featureCardText}>
              <Text style={styles.featureCardTitle}>AI Designer</Text>
              <Text style={styles.featureCardDesc}>
                Answer 5 quick questions. Get a personalised layout.
              </Text>
            </View>
            <Text style={styles.featureCardArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.featureCard, { marginTop: 10 }]}
            onPress={() => navigation.navigate('TemplatePicker')}
            activeOpacity={0.82}
          >
            <Text style={styles.featureCardIcon}>📋</Text>
            <View style={styles.featureCardText}>
              <Text style={styles.featureCardTitle}>Starter Templates</Text>
              <Text style={styles.featureCardDesc}>
                10 pre-built designs for the most common closet sizes.
              </Text>
            </View>
            <Text style={styles.featureCardArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Version badge */}
        <Text style={styles.versionBadge}>ClosetCraft v3.0</Text>
      </ScrollView>
    </View>
  );
}

// ─── Settings Screen ──────────────────────────────────────────────

function SettingsScreen({ navigation }) {
  const settings = [
    { label: 'Measurement Units', value: 'Inches (Imperial)' },
    { label: 'Default Material', value: 'White Melamine' },
    { label: 'Grid Snap', value: 'On (1" grid)' },
    { label: 'Haptic Feedback', value: 'Enabled' },
    { label: 'Show Design Tips', value: 'Enabled' },
    { label: 'Auto-Save', value: 'Every 30 seconds' },
    { label: 'App Version', value: '3.0.0 (Phase 3)' },
  ];

  return (
    <View style={styles.settingsScreen}>
      <Text style={styles.settingsTitle}>Settings</Text>

      {settings.map((s, i) => (
        <View key={i} style={styles.settingsRow}>
          <Text style={styles.settingsLabel}>{s.label}</Text>
          <Text style={styles.settingsValue}>{s.value}</Text>
        </View>
      ))}

      {/* Cloud Account — navigates to Auth */}
      <TouchableOpacity
        style={[styles.settingsRow, styles.settingsRowTappable]}
        onPress={() => navigation.navigate('Auth')}
      >
        <Text style={styles.settingsLabel}>☁️ Cloud Account</Text>
        <Text style={styles.settingsArrow}>Sign In ›</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Tab Navigator ────────────────────────────────────────────────

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0d1f38',
          borderTopColor: 'rgba(255,255,255,0.08)',
          height: 85,
          paddingBottom: 28,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#00d4f5',
        tabBarInactiveTintColor: '#405570',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Designs"
        component={SavedDesignsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="📐" focused={focused} />,
          tabBarLabel: 'My Designs',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="⚙️" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

// ─── Root App ─────────────────────────────────────────────────────

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.onboarded),
      AsyncStorage.getItem(STORAGE_KEYS.authDone),
    ]).then(([onboarded, authDone]) => {
      if (!onboarded) setInitialRoute('Onboarding');
      else if (!authDone) setInitialRoute('Auth');
      else setInitialRoute('Main');
    }).catch(() => setInitialRoute('Onboarding'));
  }, []);

  if (!initialRoute) return null; // brief splash while checking storage

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#07111f' },
          animation: 'slide_from_right',
        }}
      >
        {/* Onboarding — shown once on fresh install */}
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ animation: 'fade' }} />

        {/* Main tab container */}
        <Stack.Screen name="Main" component={MainTabs} />

        {/* Phase 2 screens */}
        <Stack.Screen name="NewDesign" component={NewDesignScreen} />
        <Stack.Screen name="ARMeasure" component={ARMeasureScreen} />
        <Stack.Screen name="Designer" component={DesignerScreen} />

        {/* Phase 3.0 — AI + Templates */}
        <Stack.Screen name="AIWizard" component={AIWizardScreen} />
        <Stack.Screen name="TemplatePicker" component={TemplatePickerScreen} />
        <Stack.Screen name="BeforeAfter" component={BeforeAfterScreen} />

        {/* Phase 3.1 — Cloud Sync */}
        <Stack.Screen name="Auth" component={AuthScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="ShareDesign" component={ShareDesignScreen} />

        {/* Component Picker */}
        <Stack.Screen name="ComponentPicker" component={ComponentPickerScreen} />

        {/* Phase 3.2 — Cost Estimator */}
        <Stack.Screen name="CostEstimate" component={CostEstimateScreen} />
        <Stack.Screen name="ShoppingList" component={ShoppingListScreen} />
        <Stack.Screen name="CutList" component={CutListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
