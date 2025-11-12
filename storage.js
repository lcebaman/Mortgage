// Persistence helpers: localStorage + Supabase (if configured)
window.Store = (() => {
  const { sb } = window.Supa;

  // localStorage backend
  const STORAGE_KEY = "property-move-configs:v3";
  const lsLoadAll = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const lsSaveAll = (rows) => localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  function lsSaveConfig(name, payload){
    const rows = lsLoadAll();
    const id = crypto.randomUUID();
    rows.push({ id, name, payload, ts: Date.now() });
    lsSaveAll(rows);
    return id;
  }
  function lsListConfigs(){ return lsLoadAll().sort((a,b) => b.ts - a.ts); }
  function lsGetConfig(id){ return lsLoadAll().find(r => r.id === id)?.payload || null; }
  function lsDeleteConfig(id){ lsSaveAll(lsLoadAll().filter(r => r.id !== id)); }

  // Supabase backend (Auth required)
  async function sbSaveConfig(userId, name, payload){
    const { data, error } = await sb.from("configs")
      .insert({ owner_id: userId, name, payload })
      .select().single();
    if(error) throw error;
    return data.id;
  }
  async function sbListConfigs(userId){
    const { data, error } = await sb.from("configs")
      .select("id,name,created_at")
      .eq("owner_id", userId)
      .order("created_at", { ascending:false });
    if(error) throw error;
    return (data || []).map(r => ({ id:r.id, name:r.name, ts:+new Date(r.created_at) }));
  }
  async function sbGetConfig(userId, id){
    const { data, error } = await sb.from("configs")
      .select("payload").eq("id", id).eq("owner_id", userId).single();
    if(error) throw error;
    return data.payload;
  }
  async function sbDeleteConfig(userId, id){
    const { error } = await sb.from("configs")
      .delete().eq("id", id).eq("owner_id", userId);
    if(error) throw error;
  }

  return {
    // local
    lsSaveConfig, lsListConfigs, lsGetConfig, lsDeleteConfig,
    // supabase
    sbSaveConfig, sbListConfigs, sbGetConfig, sbDeleteConfig
  };
})();
