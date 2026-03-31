import { createClient } from '@supabase/supabase-js'

// Use os dados que você pegou lá no painel do Supabase
const supabaseUrl = 'https://knifdlfdcevaylhfikok.supabase.co'
const supabaseAnonKey = 'sb_publishable_cMbPKRNAhj6SdZLFE5loqA_qMdBZ43_'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export default supabase
