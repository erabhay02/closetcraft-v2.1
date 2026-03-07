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

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Text, View, TouchableOpacity, ScrollView,
} from 'react-native';

// ─── Screens ──────────────────────────────────────────────────────

// Phase 2.x
import SavedDesignsScreen from './screens/SavedDesignsScreen';
import ARMeasureScreen from './screens/ARMeasureScreen';

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

// ─── New Design Screen ────────────────────────────────────────────

function NewDesignScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <View style={styles.designerHeader}>
        <TouchableOpacity style={styles.designerBackBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.designerBackText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.designerHeaderTitle}>New Design</Text>
        <View style={styles.designerBackBtn} />
      </View>
      <ScrollView contentContainerStyle={styles.centeredContent}>
        <Text style={styles.screenDesc}>
          This screen contains the room type selector, closet type picker,
          and manual measurement input — adapted for React Native with native
          gestures and haptic feedback.
        </Text>
        <PrimaryButton
          title="Open Designer →"
          onPress={() => navigation.navigate('Designer', {
            design: {
              name: 'My Closet',
              roomType: 'primary',
              closetType: 'walkin',
              measurements: { width: 96, height: 96, depth: 72 },
              material: 'melamine-white',
              components: [],
            },
          })}
        />
        <View style={{ marginTop: 12 }}>
          <PrimaryButton
            title="📷 Use Camera Instead"
            variant="outline"
            onPress={() => navigation.navigate('ARMeasure', {
              onMeasured: (measurements) => {
                navigation.navigate('Designer', {
                  design: {
                    name: 'Camera Measured Closet',
                    roomType: 'primary',
                    closetType: 'reachin',
                    measurements,
                    material: 'melamine-white',
                    components: [],
                  },
                });
              },
            })}
          />
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Designer Screen ──────────────────────────────────────────────

function DesignerScreen({ navigation, route }) {
  const design = route.params?.design;
  return (
    <View style={[styles.screen, { backgroundColor: '#12121e' }]}>
      <View style={styles.designerHeader}>
        <TouchableOpacity style={styles.designerBackBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.designerBackText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.designerHeaderTitle}>2D Designer</Text>
        <View style={styles.designerBackBtn} />
      </View>
      <ScrollView contentContainerStyle={styles.centeredContent}>
        <Text style={styles.screenDesc}>
          Full drag-and-drop designer canvas with:
        </Text>
        <View style={styles.featureList}>
          {[
            '✓ Native gesture handling (pan, pinch, long-press)',
            '✓ Material/color selection for components',
            '✓ Save & auto-save to device',
            '✓ PDF export with layout diagram',
            '✓ 3D preview with rotation',
            '✓ Undo/redo support',
            '✓ Component snap-to-grid',
          ].map((f, i) => (
            <Text key={i} style={styles.featureItem}>{f}</Text>
          ))}
        </View>

        {design && (
          <View style={styles.designSummary}>
            <Text style={styles.designSummaryTitle}>Current Design</Text>
            <Text style={styles.designSummaryRow}>Name: {design.name}</Text>
            <Text style={styles.designSummaryRow}>Type: {design.closetType}</Text>
            <Text style={styles.designSummaryRow}>
              Size: {design.measurements?.width}"W × {design.measurements?.height}"H × {design.measurements?.depth}"D
            </Text>
            <Text style={styles.designSummaryRow}>
              Components: {design.components?.length ?? 0}
            </Text>
          </View>
        )}

        {/* Add / Edit components */}
        {design && (
          <PrimaryButton
            title="🧩 Add Components"
            onPress={() => navigation.navigate('ComponentPicker', { design })}
            style={{ marginBottom: 4 }}
          />
        )}

        {/* Phase 3 actions — only available once components exist */}
        {design && design.components?.length > 0 ? (
          <View style={{ width: '100%', gap: 10, marginTop: 4 }}>
            <PrimaryButton
              title="💰 Cost Estimate"
              onPress={() => navigation.navigate('CostEstimate', { design })}
            />
            <PrimaryButton
              title="📸 Before & After"
              variant="outline"
              onPress={() => navigation.navigate('BeforeAfter', { design })}
            />
            <PrimaryButton
              title="🔗 Share Design"
              variant="outline"
              onPress={() => navigation.navigate('ShareDesign', { design })}
            />
          </View>
        ) : design ? (
          <Text style={[styles.screenDesc, { textAlign: 'center', color: '#556677', marginTop: 8 }]}>
            Add components above to unlock Cost Estimate, Before & After, and Share.
          </Text>
        ) : null}
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
          backgroundColor: '#181825',
          borderTopColor: 'rgba(255,255,255,0.06)',
          height: 85,
          paddingBottom: 28,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#e2b97f',
        tabBarInactiveTintColor: '#556677',
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
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0f1019' },
          animation: 'slide_from_right',
        }}
      >
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
        <Stack.Screen name="Auth" component={AuthScreen} />
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
