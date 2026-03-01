/**
 * ClosetCraft Phase 3.1 — Cloud Sync Service
 *
 * Offline-first sync engine. AsyncStorage is the primary store;
 * Supabase is synced to in the background when online.
 *
 * Conflict resolution: last-write-wins using `updatedAt` timestamp.
 *
 * Table: designs(id, user_id, name, data jsonb, updated_at timestamptz)
 */

import { supabase } from '../config/supabase';
import { loadAllDesigns, saveDesign } from '../store/designStore';
import { SUPABASE_CONFIG } from '../utils/constants';

// ─── Status ───────────────────────────────────────────────────────

let _status = 'idle'; // 'idle' | 'syncing' | 'error' | 'offline'

export function getSyncStatus() {
  return _status;
}

function isConfigured() {
  return SUPABASE_CONFIG.url.startsWith('https://') &&
         !SUPABASE_CONFIG.url.includes('YOUR_SUPABASE');
}

// ─── Upload ───────────────────────────────────────────────────────

/**
 * Push all local designs to Supabase (upsert, keyed by id + user_id).
 * @param {string} userId - Supabase auth user ID
 */
export async function syncToCloud(userId) {
  if (!isConfigured() || !userId) return;
  _status = 'syncing';
  try {
    const designs = await loadAllDesigns();
    if (!designs.length) {
      _status = 'idle';
      return;
    }

    const rows = designs.map(d => ({
      id: d.id,
      user_id: userId,
      name: d.name,
      data: d,
      updated_at: d.updatedAt ?? new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('designs')
      .upsert(rows, { onConflict: 'id' });

    if (error) throw error;
    _status = 'idle';
  } catch (err) {
    console.warn('[SyncService] syncToCloud error:', err.message);
    _status = 'error';
  }
}

// ─── Download ─────────────────────────────────────────────────────

/**
 * Fetch cloud designs and merge with local storage.
 * Last-write-wins: if cloud `updated_at` > local `updatedAt`, cloud wins.
 * @param {string} userId - Supabase auth user ID
 */
export async function fetchFromCloud(userId) {
  if (!isConfigured() || !userId) return;
  _status = 'syncing';
  try {
    const { data: cloudRows, error } = await supabase
      .from('designs')
      .select('id, data, updated_at')
      .eq('user_id', userId);

    if (error) throw error;
    if (!cloudRows?.length) {
      _status = 'idle';
      return;
    }

    const localDesigns = await loadAllDesigns();
    const localMap = new Map(localDesigns.map(d => [d.id, d]));

    for (const row of cloudRows) {
      const cloud = row.data;
      const cloudUpdated = new Date(row.updated_at).getTime();
      const local = localMap.get(row.id);
      const localUpdated = local ? new Date(local.updatedAt ?? 0).getTime() : 0;

      if (!local || cloudUpdated > localUpdated) {
        // Cloud version is newer — save to local store
        await saveDesign({ ...cloud, id: row.id });
      }
    }

    _status = 'idle';
  } catch (err) {
    console.warn('[SyncService] fetchFromCloud error:', err.message);
    _status = 'error';
  }
}

// ─── Full Sync ────────────────────────────────────────────────────

/**
 * Run a full bidirectional sync (upload local → cloud, then download cloud → local).
 * @param {string} userId
 */
export async function fullSync(userId) {
  if (!isConfigured() || !userId) return;
  await syncToCloud(userId);
  await fetchFromCloud(userId);
}
