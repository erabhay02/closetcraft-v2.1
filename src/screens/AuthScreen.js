/**
 * ClosetCraft Phase 3.1 — Authentication Screen
 *
 * Email/password sign in and sign up. Apple and Google sign-in
 * are stubbed and show a "coming soon" message until native setup.
 */

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  SafeAreaView, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { COLORS } from '../utils/constants';
import { signIn, signUp, signInWithApple, signInWithGoogle } from '../services/authService';
import styles from './AuthScreen.styles';

// ─── Helper ───────────────────────────────────────────────────────

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Social Button ────────────────────────────────────────────────

function SocialButton({ icon, label, onPress, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.socialBtn, disabled && styles.btnDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
    >
      <Text style={styles.socialIcon}>{icon}</Text>
      <Text style={styles.socialLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────

export default function AuthScreen({ navigation }) {
  const [mode, setMode] = useState('signIn'); // 'signIn' | 'signUp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isSignUp = mode === 'signUp';

  function validate() {
    if (!email.trim()) return 'Please enter your email address.';
    if (!isValidEmail(email.trim())) return 'Please enter a valid email address.';
    if (!password) return 'Please enter a password.';
    if (isSignUp && password.length < 6) return 'Password must be at least 6 characters.';
    if (isSignUp && password !== confirmPassword) return "Passwords don't match.";
    return null;
  }

  async function handleSubmit() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setLoading(true);

    const fn = isSignUp ? signUp : signIn;
    const { user, error: authError } = await fn(email.trim(), password);
    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    Alert.alert(
      isSignUp ? 'Account Created!' : 'Signed In',
      isSignUp
        ? 'Welcome to ClosetCraft! Your designs will now sync across devices.'
        : `Welcome back! Syncing your designs…`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  }

  async function handleApple() {
    const { error: appleError } = await signInWithApple();
    if (appleError) Alert.alert('Apple Sign In', appleError.message);
  }

  async function handleGoogle() {
    const { error: googleError } = await signInWithGoogle();
    if (googleError) Alert.alert('Google Sign In', googleError.message);
  }

  function toggleMode() {
    setMode(m => m === 'signIn' ? 'signUp' : 'signIn');
    setError('');
    setConfirmPassword('');
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Text>
            <Text style={styles.subtitle}>
              {isSignUp
                ? 'Sync your designs across all your devices'
                : 'Welcome back to ClosetCraft'}
            </Text>
          </View>

          {/* Error message */}
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder={isSignUp ? 'At least 6 characters' : '••••••••'}
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {isSignUp && (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Re-enter password"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry
                  editable={!loading}
                />
              </View>
            )}
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#1a1a2e" />
            ) : (
              <Text style={styles.submitBtnText}>
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Toggle mode */}
          <TouchableOpacity style={styles.toggleBtn} onPress={toggleMode} disabled={loading}>
            <Text style={styles.toggleText}>
              {isSignUp
                ? 'Already have an account? '
                : "Don't have an account? "}
              <Text style={styles.toggleLink}>
                {isSignUp ? 'Sign In' : 'Create Account'}
              </Text>
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social */}
          <View style={styles.socialRow}>
            <SocialButton icon="🍎" label="Apple" onPress={handleApple} disabled={loading} />
            <SocialButton icon="G" label="Google" onPress={handleGoogle} disabled={loading} />
          </View>

          {/* Continue without account */}
          <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.skipText}>Continue without account</Text>
          </TouchableOpacity>

          {/* Cloud sync info */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Cloud Sync Benefits</Text>
            {[
              '✓ Access designs on any device',
              '✓ Never lose a saved design',
              '✓ Share designs with collaborators',
            ].map(item => (
              <Text key={item} style={styles.infoItem}>{item}</Text>
            ))}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
