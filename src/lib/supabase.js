import { createClient } from '@supabase/supabase-js'

// Project ID and anon key from Supabase
const SUPABASE_URL = 'https://kmnjdmaqbicpbtijqzks.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttbmpkbWFxYmljcGJ0aWpxemtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NzkyNTMsImV4cCI6MjA2MTE1NTI1M30.SF0u0KB8J4hzmiy4urXsDKTboGlLtyowmT3Kgy6vmBE'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export default supabase;