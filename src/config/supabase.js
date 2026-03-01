/**
 * ClosetCraft Phase 3.1 — Supabase Client
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a project at https://supabase.com
 * 2. Go to Project Settings → API
 * 3. Copy your Project URL and anon/public key
 * 4. Update SUPABASE_CONFIG in src/utils/constants.js:
 *      url: 'https://xxxx.supabase.co'
 *      anonKey: 'eyJhb...'
 *
 * DATABASE SCHEMA (run in Supabase SQL editor):
 *
 *   create table designs (
 *     id          text primary key,
 *     user_id     uuid references auth.users not null,
 *     name        text not null,
 *     data        jsonb not null,
 *     updated_at  timestamptz default now()
 *   );
 *   alter table designs enable row level security;
 *   create policy "Users can manage their own designs"
 *     on designs for all
 *     using (auth.uid() = user_id);
 */

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../utils/constants';

export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

export default supabase;
