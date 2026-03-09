/**
 * AuthScreen — Sign In / Sign Up
 * Cyan-to-blue gradient header + wave separator matching brand mockup.
 *
 * Social Sign-In:
 *   - Apple: expo-apple-authentication → Supabase signInWithIdToken (iOS only)
 *   - Google: expo-auth-session Google provider → Supabase signInWithIdToken
 *
 * Google Cloud Console setup (one-time):
 *   1. console.cloud.google.com → New project → APIs & Services → OAuth consent screen
 *   2. Credentials → Create OAuth client ID for:
 *        iOS   → Bundle ID: com.closetcraft.app
 *        Android → Package: com.closetcraft.app + SHA-1 fingerprint
 *        Web   → (required for token exchange)
 *   3. Paste the three client IDs into GOOGLE_CLIENT_IDS below
 *   4. Supabase dashboard → Auth → Providers → Google → enable + paste Web client ID & secret
 *
 * Apple setup (one-time):
 *   1. developer.apple.com → Certificates → Identifiers → com.closetcraft.app → Sign In with Apple ✓
 *   2. Supabase dashboard → Auth → Providers → Apple → enable + paste Service ID & private key
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform, Dimensions, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { COLORS, STORAGE_KEYS } from '../utils/constants';
import { signIn, signUp, signInWithApple, signInWithGoogleIdToken } from '../services/authService';

// Required to complete the OAuth redirect back into the app
WebBrowser.maybeCompleteAuthSession();

// ─── Google OAuth Client IDs ──────────────────────────────────────
// Get these from Google Cloud Console → APIs & Services → Credentials
const GOOGLE_CLIENT_IDS = {
  ios: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  android: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  web: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
};

const GOOGLE_CONFIGURED = !GOOGLE_CLIENT_IDS.web.startsWith('YOUR_');

const { width: W, height: H } = Dimensions.get('window');
const HEADER_H = H * 0.34;
const WAVE_EXTRA = 44;

const wavePath = `M 0,${HEADER_H} C ${W * 0.28},${HEADER_H + WAVE_EXTRA} ${W * 0.72},${HEADER_H - WAVE_EXTRA} ${W},${HEADER_H} L ${W},0 L 0,0 Z`;

// ─── Helpers ─────────────────────────────────────────────────────

function Field({ label, ...props }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor={COLORS.textMuted} {...props} />
    </View>
  );
}

function SocialBtn({ label, labelStyle, onPress, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.socialBtn, disabled && { opacity: 0.4 }]}
      onPress={onPress}
      activeOpacity={0.75}
      disabled={disabled}
    >
      <Text style={[styles.socialSymbol, labelStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────

export default function AuthScreen({ navigation }) {
  const [mode, setMode] = useState('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isSignUp = mode === 'signUp';

  // ── Google auth hook ──────────────────────────────────────────
  const [, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
    iosClientId: GOOGLE_CLIENT_IDS.ios,
    androidClientId: GOOGLE_CLIENT_IDS.android,
    webClientId: GOOGLE_CLIENT_IDS.web,
  });

  useEffect(() => {
    if (!googleResponse) return;
    if (googleResponse.type === 'success') {
      const idToken = googleResponse.authentication?.idToken;
      if (!idToken) { setError('Google did not return a sign-in token.'); return; }
      setLoading(true);
      signInWithGoogleIdToken(idToken).then(({ error: e }) => {
        setLoading(false);
        if (e) setError(e.message);
        else completeAuth();
      });
    } else if (googleResponse.type === 'error') {
      setError('Google sign-in failed. Please try again.');
    }
    // type === 'cancel' or 'dismiss' — do nothing
  }, [googleResponse]);

  // ── Helpers ───────────────────────────────────────────────────

  function validate() {
    if (!email.trim()) return 'Please enter your email address.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Invalid email address.';
    if (!password) return 'Please enter a password.';
    if (isSignUp && password.length < 6) return 'Password must be at least 6 characters.';
    if (isSignUp && password !== confirmPassword) return "Passwords don't match.";
    return null;
  }

  async function completeAuth() {
    await AsyncStorage.setItem(STORAGE_KEYS.authDone, 'true').catch(() => {});
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  }

  async function handleSubmit() {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    const fn = isSignUp ? signUp : signIn;
    const { error: authError } = await fn(email.trim(), password);
    setLoading(false);
    if (authError) { setError(authError.message); return; }
    Alert.alert(
      isSignUp ? 'Account Created!' : 'Signed In',
      isSignUp
        ? 'Welcome to ClosetCraft! Designs will sync across devices.'
        : 'Welcome back! Syncing your designs…',
      [{ text: 'OK', onPress: completeAuth }]
    );
  }

  async function handleAppleSignIn() {
    setError('');
    setLoading(true);
    const { error: e } = await signInWithApple();
    setLoading(false);
    if (e) setError(e.message);
    else if (e !== null) completeAuth(); // null error = cancelled, don't proceed
    // if e is null (cancelled), do nothing
  }

  // Handle the case where e is undefined (success) vs null (cancelled)
  async function handleApplePress() {
    setError('');
    setLoading(true);
    const result = await signInWithApple();
    setLoading(false);
    if (result.error) {
      setError(result.error.message);
    } else if (result.user !== null || result.session !== null) {
      // Only complete if we got a user/session back (not a cancellation)
      completeAuth();
    }
    // else: user cancelled (error is null, user is null) — do nothing
  }

  function toggleMode() {
    setMode(m => m === 'signIn' ? 'signUp' : 'signIn');
    setError('');
    setConfirmPassword('');
  }

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* ── Gradient header + wave ── */}
          <View style={styles.headerArea}>
            <Svg width={W} height={HEADER_H + WAVE_EXTRA + 10} style={StyleSheet.absoluteFill}>
              <Defs>
                <LinearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor={COLORS.gradientStart} stopOpacity="1" />
                  <Stop offset="1" stopColor={COLORS.gradientEnd} stopOpacity="1" />
                </LinearGradient>
              </Defs>
              <Path d={wavePath} fill="url(#hg)" />
            </Svg>

            <TouchableOpacity style={styles.closeBtn} onPress={completeAuth} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.headerText}>
              <Text style={styles.greeting}>{isSignUp ? 'Hello,' : 'Welcome Back,'}</Text>
              <Text style={styles.authTitle}>{isSignUp ? 'Sign Up!' : 'Log In!'}</Text>
            </View>
          </View>

          {/* ── Form body ── */}
          <View style={styles.body}>
            {!!error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Field
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <Field
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder={isSignUp ? 'At least 6 characters' : '••••••••'}
              secureTextEntry
              editable={!loading}
            />

            {isSignUp && (
              <Field
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter password"
                secureTextEntry
                editable={!loading}
              />
            )}

            <TouchableOpacity
              style={[styles.submitBtn, loading && { opacity: 0.55 }]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.82}
            >
              {loading
                ? <ActivityIndicator color={COLORS.bg} />
                : <Text style={styles.submitBtnText}>{isSignUp ? 'Sign Up' : 'Log In'}</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity style={styles.toggleBtn} onPress={toggleMode} disabled={loading}>
              <Text style={styles.toggleText}>
                {isSignUp ? 'Already have an account?  ' : "Don't have an account?  "}
                <Text style={styles.toggleLink}>{isSignUp ? 'Log In' : 'Sign Up'}</Text>
              </Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              {/* Apple — iOS only */}
              {Platform.OS === 'ios' && (
                <SocialBtn
                  label=""
                  onPress={handleApplePress}
                  disabled={loading}
                />
              )}
              {/* Google */}
              <SocialBtn
                label="G"
                labelStyle={styles.googleLabel}
                onPress={() => {
                  if (!GOOGLE_CONFIGURED) {
                    Alert.alert('Google Sign In', 'Google Sign In is not configured yet. Please use email/password or continue without an account.');
                    return;
                  }
                  promptGoogleAsync();
                }}
                disabled={loading}
              />
            </View>

            <TouchableOpacity style={styles.continueBtn} onPress={completeAuth} activeOpacity={0.82}>
              <Text style={styles.continueBtnText}>Continue without account</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flexGrow: 1 },

  // Header
  headerArea: {
    height: HEADER_H + WAVE_EXTRA + 10,
    justifyContent: 'flex-end',
    paddingBottom: WAVE_EXTRA + 24,
    paddingHorizontal: 28,
  },
  closeBtn: {
    position: 'absolute',
    top: 54,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  headerText: { marginBottom: 8 },
  greeting: { color: 'rgba(255,255,255,0.82)', fontSize: 17, fontWeight: '500', marginBottom: 2 },
  authTitle: { color: '#fff', fontSize: 38, fontWeight: '800', letterSpacing: -0.5 },

  // Body
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 4, paddingBottom: 48 },
  errorBox: {
    backgroundColor: 'rgba(239,83,80,0.12)', borderRadius: 10,
    padding: 12, marginBottom: 14, borderWidth: 1, borderColor: COLORS.red,
  },
  errorText: { color: COLORS.red, fontSize: 13, lineHeight: 18 },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: {
    color: COLORS.textSecondary, fontSize: 11, fontWeight: '700',
    letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.bgCard, color: COLORS.textPrimary,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14,
    fontSize: 15, borderWidth: 1, borderColor: COLORS.border,
  },

  // Submit
  submitBtn: {
    backgroundColor: COLORS.gold, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
    marginTop: 6, marginBottom: 14,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  submitBtnText: { color: COLORS.bg, fontWeight: '800', fontSize: 16 },

  // Toggle
  toggleBtn: { alignItems: 'center', paddingVertical: 8, marginBottom: 20 },
  toggleText: { color: COLORS.textSecondary, fontSize: 14 },
  toggleLink: { color: COLORS.gold, fontWeight: '700' },

  // Divider
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { color: COLORS.textMuted, fontSize: 12 },

  // Social
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 28 },
  socialBtn: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  socialSymbol: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '800' },
  googleLabel: { color: '#4285F4', fontSize: 20, fontWeight: '900' },

  // Continue without account
  continueBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.borderActive,
  },
  continueBtnText: { color: COLORS.gold, fontWeight: '700', fontSize: 16 },
});
