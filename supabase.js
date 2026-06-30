// ===============================
// WORKDIN - Supabase Connection
// ===============================

const SUPABASE_URL = "https://dlezopvhwjqsgzwpytbv.supabase.co";

const SUPABASE_KEY = "sb_publishable_fNLwvOPP_gkfgr-DbAKXZQ_igvkFfek";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);