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
    fetch(`${SUPABASE_URL}/rest/v1/module_tiers?select=module_key,tier,label,label_site&order=module_key`, {
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
    })
      .then(r => (r.ok ? r.json() : null))
      .then(rows => {
        if (!alive || !Array.isArray(rows) || !rows.length) return
        // `label_site` prime quand il est renseigné : il permet de nommer un
        // module autrement ici que dans l'application (onglet « Site web » de
        // l'admin). Laissé vide, on reprend le nom de l'application.
        setModules(
          rows
            .filter(r => r.module_key !== 'parametres' && (r.label_site || r.label))
            .map(r => ({ ...r, label: (r.label_site || '').trim() || r.label }))
        )
      })
      .catch(() => { /* on garde le repli statique */ })
    return () => { alive = false }
  }, [])

  return modules
}

/**
 * Les fonctions listées pour un pack.
 *
 * Une seule fonction pour toutes les pages qui affichent les packs : l'accueil
 * en listait une version figée dans le dictionnaire pendant que la page Tarifs
 * lisait la répartition réelle des modules — les deux avaient fini par
 * annoncer des choses différentes au même visiteur.
 *
 * Standard et Premium viennent de `module_tiers`, pilotée depuis l'admin :
 * c'est la seule liste qui fait foi. Ses libellés y sont saisis en français,
 * donc dans les autres langues on retombe sur le dictionnaire traduit. Solo
 * n'a pas de répartition par module : sa liste vit dans le dictionnaire.
 *
 * @param {string} cle        'solo' | 'standard' | 'premium'
 * @param {object} o
 * @param {Array|null} o.modules   retour de `useModuleTiers()`, null si pas chargé
 * @param {string} o.langue        langue courante
 * @param {Function} o.traduire    le `t` de `useT()`
 */
export function fonctionsDuPack(cle, { modules, langue, traduire }) {
  // Le dictionnaire s'arrête au premier trou : les clés vont de f1 à fN.
  const duDictionnaire = () => {
    const liste = []
    for (let n = 1; n <= 20; n++) {
      const k = `tarifs.${cle}.f${n}`
      const v = traduire(k)
      if (!v || v === k) break
      liste.push(v)
    }
    return liste
  }

  if (!modules || langue !== 'fr' || cle === 'solo') return duDictionnaire()

  if (cle === 'standard') {
    const l = modules.filter(m => m.tier === 'standard').map(m => m.label)
    return l.length ? l : duDictionnaire()
  }
  if (cle === 'premium') {
    const l = modules.filter(m => m.tier === 'premium').map(m => m.label)
    return l.length ? ['Tout le Pack Standard', ...l] : duDictionnaire()
  }
  return duDictionnaire()
}
