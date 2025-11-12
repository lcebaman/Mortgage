// Supabase config and client (optional)
window.Supa = (() => {
  const SUPABASE_URL = "https://risvmiegnmuroiuxbngw.supabase.co";      // e.g. https://abcd.supabase.co
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpc3ZtaWVnbm11cm9pdXhibmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDU4ODksImV4cCI6MjA3ODUyMTg4OX0.Mo6NAYaJHeIzS_xfAu9a-6SyITPYc9Xg2f_H0vZ19-U";

  const hasCreds = !!(SUPABASE_URL && SUPABASE_ANON_KEY);
  const sb = (window.supabase && hasCreds)
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

  return { sb, hasCreds, SUPABASE_URL, SUPABASE_ANON_KEY };
})();
