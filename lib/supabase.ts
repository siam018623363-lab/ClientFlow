
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabaseUrl = 'https://vevxljagsswqwflwewig.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZldnhsamFnc3N3cXdmbHdld2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NDczNjQsImV4cCI6MjA4NTUyMzM2NH0.MwVvMdcO5Kq84X0Rjnd8JewnJcFHMlYD0K_yhCHmmcI';

// Optimized client for browser environment
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
