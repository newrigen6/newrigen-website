import { useEffect, useState } from 'react'

// Répartition Standard/Premium des modules, pilotée depuis newrigen-admin
// (table module_tiers — même source que l'écran "Répartition modules").
const SUPABASE_URL = 'https://ivrkzjpnxnggvxtjfyuy.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cmt6anBueG5nZ3Z4dGpmeXV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNjI0NDcsImV4cCI6MjA5MzczODQ0N30.e-LuRTJh80kJ-n4vZqrk9iMk8rED_IImlcDHFP3imIY'

// Retourne la liste des modules (hors "parametres") en direct depuis Supabase,
// ou null tant qu'ils ne sont pas chargés / en cas d'échec — le composant appelant
// garde alors sa liste de secours codée en dur.
export function useModuleTiers() {
  const [modules, setModules] = useState(null)

  useEffect(() => {
    let alive = true
    fetch(`${SUPABASE_URL}/rest/v1/module_tiers?select=module_key,tier,label&order=module_key`, {
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
    })
      .then(r => (r.ok ? r.json() : null))
      .then(rows => {
        if (!alive || !Array.isArray(rows) || !rows.length) return
        setModules(rows.filter(r => r.module_key !== 'parametres' && r.label))
      })
      .catch(() => { /* on garde le repli statique */ })
    return () => { alive = false }
  }, [])

  return modules
}
