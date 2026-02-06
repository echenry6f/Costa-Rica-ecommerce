// Ticora Store — Supabase client
// Uses supabase-config.js for URL and anon key

let _supabase = null;

function isSupabaseConfigured() {
  return (
    typeof SUPABASE_URL !== 'undefined' &&
    typeof SUPABASE_ANON_KEY !== 'undefined' &&
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('your-project') &&
    !SUPABASE_ANON_KEY.includes('your-anon')
  );
}

function getSupabase() {
  if (_supabase) return _supabase;
  if (!isSupabaseConfigured()) return null;
  if (typeof supabase === 'undefined' || !supabase.createClient) return null;
  _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return _supabase;
}
