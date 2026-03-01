/**
 * ClosetCraft Phase 3.1 — Authentication Service
 *
 * Wraps Supabase Auth. All methods are safe to call when Supabase
 * is not yet configured — they return { user: null, error } gracefully.
 *
 * Apple Sign In & Google Sign In stubs require native setup:
 *   - expo-apple-authentication (iOS only)
 *   - @react-native-google-signin/google-signin
 */

import { supabase } from '../config/supabase';

const isConfigured = () => {
  const url = supabase?.supabaseUrl ?? '';
  return url.startsWith('https://') && !url.includes('YOUR_SUPABASE');
};

// ─── Email / Password ─────────────────────────────────────────────

/**
 * Create a new account.
 * @returns {{ user, session, error }}
 */
export async function signUp(email, password) {
  if (!isConfigured()) {
    return { user: null, session: null, error: { message: 'Cloud sync not yet configured. See src/config/supabase.js for setup instructions.' } };
  }
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { user: data?.user ?? null, session: data?.session ?? null, error };
}

/**
 * Sign in with email and password.
 * @returns {{ user, session, error }}
 */
export async function signIn(email, password) {
  if (!isConfigured()) {
    return { user: null, session: null, error: { message: 'Cloud sync not yet configured. See src/config/supabase.js for setup instructions.' } };
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user: data?.user ?? null, session: data?.session ?? null, error };
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  if (!isConfigured()) return;
  await supabase.auth.signOut();
}

// ─── Session ──────────────────────────────────────────────────────

/**
 * Get the currently signed-in user (or null).
 */
export async function getCurrentUser() {
  if (!isConfigured()) return null;
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}

/**
 * Subscribe to auth state changes.
 * @param {function} callback - called with (event, session)
 * @returns {function} unsubscribe
 */
export function onAuthStateChange(callback) {
  if (!isConfigured()) return () => {};
  const { data } = supabase.auth.onAuthStateChange(callback);
  return () => data?.subscription?.unsubscribe?.();
}

// ─── Social Sign-In Stubs ─────────────────────────────────────────

/**
 * Apple Sign In — requires expo-apple-authentication (iOS only).
 * Returns an error until native setup is complete.
 */
export async function signInWithApple() {
  console.warn('[ClosetCraft] Apple Sign In requires native setup. See: https://docs.expo.dev/versions/latest/sdk/apple-authentication/');
  return { user: null, error: { message: 'Apple Sign In requires additional native setup. Coming soon!' } };
}

/**
 * Google Sign In — requires @react-native-google-signin/google-signin.
 * Returns an error until native setup is complete.
 */
export async function signInWithGoogle() {
  console.warn('[ClosetCraft] Google Sign In requires native setup. See: https://react-native-google-signin.github.io/');
  return { user: null, error: { message: 'Google Sign In requires additional native setup. Coming soon!' } };
}
