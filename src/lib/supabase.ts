import { createClient } from '@supabase/supabase-js';

// Use environment variables for Vercel deployment with Vite prefix
// The variables need to be defined in Vercel project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://knifdlfdcevaylhfikok.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_cMbPKRNAhj6SdZLFE5loqA_qMdBZ43_';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
