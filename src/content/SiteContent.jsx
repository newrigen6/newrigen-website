import { createContext, useContext, useEffect, useState } from 'react'
import { DEFAULT_CONTENT } from './defaults'

// Contenu du site géré depuis l'admin Newrigen (table site_content).
// Clé anon publique (lecture seule protégée par RLS) — comme tout front Supabase.
const SUPABASE_URL = 'https://ivrkzjpnxnggvxtjfyuy.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cmt6anBueG5nZ3Z4dGpmeXV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNjI0NDcsImV4cCI6MjA5MzczODQ0N30.e-LuRTJh80kJ-n4vZqrk9iMk8rED_IImlcDHFP3imIY'

// Fusion : le contenu de la base écrase les défauts, section par section.
function merge(base, over) {
  if (!over || typeof over !== 'object') return base
  return {
    texts:       { ...base.texts, ...(over.texts || {}) },
    prix:        { ...base.prix, ...(over.prix || {}) },
    contact:     { ...base.contact, ...(over.contact || {}) },
    temoignages: Array.isArray(over.temoignages) && over.temoignages.length ? over.temoignages : base.temoignages,
    services:    Array.isArray(over.services) && over.services.length ? over.services : base.services,
  }
}

const Ctx = createContext(DEFAULT_CONTENT)

export function SiteContentProvider({ children }) {
  // On rend immédiatement avec les défauts (aucun flash de page vide),
  // puis on hydrate avec le contenu de la base.
  const [content, setContent] = useState(DEFAULT_CONTENT)

  useEffect(() => {
    let alive = true
    fetch(`${SUPABASE_URL}/rest/v1/site_content?id=eq.main&select=data`, {
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
    })
      .then(r => (r.ok ? r.json() : null))
      .then(rows => {
        if (!alive || !rows?.[0]?.data) return
        setContent(merge(DEFAULT_CONTENT, rows[0].data))
      })
      .catch(() => { /* on garde les défauts */ })
    return () => { alive = false }
  }, [])

  return <Ctx.Provider value={content}>{children}</Ctx.Provider>
}

export function useSiteContent() {
  return useContext(Ctx)
}

// Raccourci pour une surcharge de texte par id (sinon on garde le défaut fourni).
export function useText(id, fallback) {
  const c = useContext(Ctx)
  return c.texts?.[id] ?? fallback
}
