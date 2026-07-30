import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { DICT } from './dictionaries'

// Langues proposées. `fr` reste la langue de référence : toute clé absente
// d'une traduction retombe dessus plutôt que d'afficher un identifiant brut.
export const LANGUES = [
  { code: 'fr', label: 'Français',  drapeau: '🇫🇷' },
  { code: 'de', label: 'Deutsch',   drapeau: '🇩🇪' },
  { code: 'en', label: 'English',   drapeau: '🇬🇧' },
  { code: 'pt', label: 'Português', drapeau: '🇵🇹' },
  { code: 'it', label: 'Italiano',  drapeau: '🇮🇹' },
]
export const LANGUE_DEFAUT = 'fr'
const CODES = LANGUES.map(l => l.code)
const CLE_STOCKAGE = 'newrigen-langue'

// Ordre de priorité : choix explicite déjà fait > ?lang= dans l'URL > langue du
// navigateur > français. Le paramètre d'URL permet de partager un lien dans une
// langue précise (utile pour un client alémanique).
function langueInitiale() {
  try {
    const memorisee = localStorage.getItem(CLE_STOCKAGE)
    if (CODES.includes(memorisee)) return memorisee
  } catch { /* navigation privée */ }

  const url = new URLSearchParams(window.location.search).get('lang')
  if (CODES.includes(url)) return url

  for (const nav of navigator.languages || [navigator.language || '']) {
    const court = String(nav).slice(0, 2).toLowerCase()
    if (CODES.includes(court)) return court
  }
  return LANGUE_DEFAUT
}

const Ctx = createContext({ langue: LANGUE_DEFAUT, setLangue: () => {}, t: k => k })

export function LangueProvider({ children }) {
  const [langue, setLangueState] = useState(langueInitiale)

  // `lang` sur <html> : indispensable pour les moteurs de recherche et les
  // lecteurs d'écran, et c'est lui qui déclenche la bonne césure typographique.
  useEffect(() => { document.documentElement.lang = langue }, [langue])

  const setLangue = useCallback(code => {
    if (!CODES.includes(code)) return
    setLangueState(code)
    try { localStorage.setItem(CLE_STOCKAGE, code) } catch { /* ignoré */ }
  }, [])

  // t('cle') ou t('cle', { nom: 'valeur' }) pour les textes à trous.
  const t = useCallback((cle, vars) => {
    const brut = DICT[langue]?.[cle] ?? DICT[LANGUE_DEFAUT][cle]
    if (brut == null) {
      if (import.meta.env.DEV) console.warn(`[i18n] clé manquante : ${cle}`)
      return cle
    }
    if (!vars) return brut
    return Object.entries(vars).reduce(
      (s, [k, v]) => s.replaceAll(`{${k}}`, String(v)), brut)
  }, [langue])

  return <Ctx.Provider value={{ langue, setLangue, t }}>{children}</Ctx.Provider>
}

export function useLangue() {
  return useContext(Ctx)
}

// Raccourci quand seul le texte est utile.
export function useT() {
  return useContext(Ctx).t
}
