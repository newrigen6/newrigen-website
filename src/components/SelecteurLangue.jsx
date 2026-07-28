import { useState, useRef, useEffect } from 'react'
import { LANGUES, useLangue } from '../i18n'

// Sélecteur de langue. Volontairement discret dans la barre de navigation :
// un visiteur qui arrive déjà dans sa langue (détection navigateur) n'a rien
// à faire, il sert surtout à corriger la détection.
export default function SelecteurLangue({ pleineLargeur = false }) {
  const { langue, setLangue, t } = useLangue()
  const [ouvert, setOuvert] = useState(false)
  const ref = useRef(null)

  // Fermer au clic à l'extérieur — sinon le menu reste ouvert derrière le
  // contenu quand on scrolle.
  useEffect(() => {
    if (!ouvert) return
    const clic = e => { if (!ref.current?.contains(e.target)) setOuvert(false) }
    document.addEventListener('mousedown', clic)
    return () => document.removeEventListener('mousedown', clic)
  }, [ouvert])

  const active = LANGUES.find(l => l.code === langue) ?? LANGUES[0]

  return (
    <div ref={ref} className={`relative ${pleineLargeur ? 'w-full' : ''}`}>
      <button
        type="button"
        onClick={() => setOuvert(o => !o)}
        aria-label={t('nav.langue')}
        aria-expanded={ouvert}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white border border-slate-700 hover:border-[#F97316]/50 transition-colors ${pleineLargeur ? 'w-full justify-center' : ''}`}
      >
        <span aria-hidden="true">{active.drapeau}</span>
        <span className="uppercase tracking-wide">{active.code}</span>
      </button>

      {ouvert && (
        <div className={`absolute right-0 mt-2 py-1 rounded-xl glass border border-[#F97316]/20 shadow-xl z-50 min-w-[10rem] ${pleineLargeur ? 'left-0' : ''}`}>
          {LANGUES.map(l => (
            <button
              key={l.code}
              type="button"
              onClick={() => { setLangue(l.code); setOuvert(false) }}
              className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left transition-colors ${
                l.code === langue ? 'text-[#F97316] font-semibold' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span aria-hidden="true">{l.drapeau}</span>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
