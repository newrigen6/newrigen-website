import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { DEFAULT_CONTENT, defaultsPourLangue } from './defaults'
import { useLangue, LANGUE_DEFAUT } from '../i18n'

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
    // Une liste VIDE est un choix explicite de l'admin (« je n'ai pas encore de
    // témoignage »), pas une absence de contenu : il ne faut surtout pas
    // retomber sur le défaut, sinon vider depuis l'admin ne sert à rien.
    temoignages: Array.isArray(over.temoignages) ? over.temoignages : base.temoignages,
    services:    Array.isArray(over.services)    ? over.services    : base.services,
  }
}

const Ctx = createContext(DEFAULT_CONTENT)

// Une ligne site_content par langue : « main » pour le français (historique,
// ne pas renommer), « main-de » / « main-en » / « main-pt » pour les autres.
export const ligneContenu = langue =>
  langue === LANGUE_DEFAUT ? 'main' : `main-${langue}`

function chargerLigne(id) {
  return fetch(`${SUPABASE_URL}/rest/v1/site_content?id=eq.${id}&select=data`, {
    headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
  })
    .then(r => (r.ok ? r.json() : null))
    .then(rows => rows?.[0]?.data ?? null)
    .catch(() => null)
}

export function SiteContentProvider({ children }) {
  const { langue } = useLangue()

  // Socle traduit, disponible immédiatement : le site s'affiche déjà complet
  // dans la bonne langue avant même la réponse de la base.
  const socle = useMemo(() => defaultsPourLangue(langue), [langue])
  const [surcharge, setSurcharge] = useState(null)

  // Prix et coordonnées de contact : toujours ceux de la ligne française
  // « main », quelle que soit la langue affichée. Seule cette ligne est
  // tenue à jour depuis l'admin — les prix ne varient pas avec la langue,
  // et une ligne « main-de »/« main-en »/... absente ne doit jamais faire
  // retomber sur d'anciens montants codés en dur dans defaults.js.
  const [surchargePrincipale, setSurchargePrincipale] = useState(null)

  useEffect(() => {
    let vivant = true
    // On repart des défauts à chaque changement de langue, sinon le contenu
    // de la langue précédente resterait affiché le temps de la requête.
    setSurcharge(null)
    chargerLigne(ligneContenu(langue)).then(data => { if (vivant && data) setSurcharge(data) })
    return () => { vivant = false }
  }, [langue])

  useEffect(() => {
    let vivant = true
    chargerLigne('main').then(data => { if (vivant && data) setSurchargePrincipale(data) })
    return () => { vivant = false }
  }, [])

  const content = useMemo(() => {
    const fusionne = merge(socle, surcharge)
    return {
      ...fusionne,
      prix: surchargePrincipale?.prix ? { ...fusionne.prix, ...surchargePrincipale.prix } : fusionne.prix,
      contact: surchargePrincipale?.contact ? { ...fusionne.contact, ...surchargePrincipale.contact } : fusionne.contact,
    }
  }, [socle, surcharge, surchargePrincipale])

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
