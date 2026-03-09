/**
 * ClosetCraft — Authentication Service
 *
 * Wraps Supabase Auth for:
 *   - Email / Password sign-in and sign-up
 *   - Apple Sign In (iOS 13+, via expo-apple-authentication)
 *   - Google Sign In (via expo-auth-session, token passed from AuthScreen hook)
 */

import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { supabase } from '../config/supabase';

const isConfigured = () => {
  const url = supabase?.supabaseUrl ?? '';
  return url.startsWith('https://') && !url.includes('YOUR_SUPABASE');
};

// ─── Email / Password ─────────────────────────────────────────────

export async function signUp(email, password) {
  if (!isConfigured()) {
    return { user: null, session: null, error: { message: 'Cloud sync not yet configured.' } };
  }
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { user: data?.user ?? null, session: data?.session ?? null, error };
}

export async function signIn(email, password) {
  if (!isConfigured()) {
    return { user: null, session: null, error: { message: 'Cloud sync not yet configured.' } };
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user: data?.user ?? null, session: data?.session ?? null, error };
}

export async function signOut() {
  if (!isConfigured()) return;
  await supabase.auth.signOut();
}

// ─── Session ──────────────────────────────────────────────────────

export async function getCurrentUser() {
  if (!isConfigured()) return null;
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}

export function onAuthStateChange(callback) {
  if (!isConfigured()) return () => {};
  const { data } = supabase.auth.onAuthStateChange(callback);
  return () => data?.subscription?.unsubscribe?.();
}

// ─── Apple Sign In ────────────────────────────────────────────────

/**
 * Full Apple Sign In flow using expo-apple-authentication.
 * iOS 13+ only. Returns { user, session, error } or { user: null, error: null }
 * if the user cancelled.
 *
 * Prerequisites:
 *   - app.json: ios.usesAppleSignIn = true  ✅
 *   - Supabase dashboard: Authentication → Providers → Apple → enabled
 *   - Supabase Apple config: Service ID + secret key from Apple Developer portal
 */
export async function signInWithApple() {
  if (Platform.OS !== 'ios') {
    return { user: null, error: { message: 'Apple Sign In is only available on iOS.' } };
  }

  try {
    const available = await AppleAuthentication.isAvailableAsync();
    if (!available) {
      return { user: null, error: { message: 'Apple Sign In is not available on this device.' } };
    }

    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      return { user: null, error: { message: 'Apple did not return an identity token.' } };
    }

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken,
    });

    return { user: data?.user ?? null, session: data?.session ?? null, error };
  } catch (err) {
    // ERR_REQUEST_CANCELED = user tapped Cancel — not an error we should surface
    if (err.code === 'ERR_REQUEST_CANCELED') {
      return { user: null, error: null };
    }
    return { user: null, error: { message: err.message ?? 'Apple Sign In failed.' } };
  }
}

// ─── Google Sign In ───────────────────────────────────────────────

/**
 * Accepts the id_token returned by expo-auth-session's Google.useAuthRequest hook
 * (handled in AuthScreen) and passes it to Supabase.
 *
 * Prerequisites:
 *   - Google Cloud Console: OAuth 2.0 Client IDs created for iOS + Android + Web
 *   - Supabase dashboard: Authentication → Providers → Google → enabled
 *   - Client IDs entered in AuthScreen GOOGLE_CLIENT_IDS constants
 */
export async function signInWithGoogleIdToken(idToken) {
  if (!isConfigured()) {
    return { user: null, error: { message: 'Cloud sync not yet configured.' } };
  }
  if (!idToken) {
    return { user: null, error: { message: 'No Google ID token provided.' } };
  }

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: idToken,
  });

  return { user: data?.user ?? null, session: data?.session ?? null, error };
}
