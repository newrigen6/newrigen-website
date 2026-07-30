import { useState, useRef, useEffect } from 'react'
import { LANGUES, useLangue } from '../i18n'

// Petits drapeaux en SVG plutôt qu'en emoji : Windows n'a pas de police
// affichant les drapeaux emoji (🇫🇷 etc.) et retombe sur le code pays en
// texte brut, ce qui rendait le sélecteur illisible pour une bonne partie
// des visiteurs.
const DRAPEAUX_SVG = {
  fr: (
    <svg viewBox="0 0 24 16" className="w-full h-full">
      <rect width="8" height="16" fill="#0055A4" />
      <rect x="8" width="8" height="16" fill="#FFFFFF" />
      <rect x="16" width="8" height="16" fill="#EF4135" />
    </svg>
  ),
  de: (
    <svg viewBox="0 0 24 16" className="w-full h-full">
      <rect width="24" height="16" fill="#FFCE00" />
      <rect width="24" height="10.67" fill="#DD0000" />
      <rect width="24" height="5.33" fill="#000000" />
    </svg>
  ),
  en: (
    <svg viewBox="0 0 24 16" className="w-full h-full">
      <rect width="24" height="16" fill="#00247D" />
      <path d="M0,0 L24,16 M24,0 L0,16" stroke="#FFFFFF" strokeWidth="3" />
      <path d="M0,0 L24,16 M24,0 L0,16" stroke="#CF142B" strokeWidth="1.2" />
      <path d="M12,0 V16 M0,8 H24" stroke="#FFFFFF" strokeWidth="5" />
      <path d="M12,0 V16 M0,8 H24" stroke="#CF142B" strokeWidth="3" />
    </svg>
  ),
  pt: (
    <svg viewBox="0 0 24 16" className="w-full h-full">
      <rect width="24" height="16" fill="#FF0000" />
      <rect width="9.6" height="16" fill="#046A38" />
      <circle cx="9.6" cy="8" r="3.2" fill="#FFCC00" stroke="#FFFFFF" strokeWidth="0.5" />
    </svg>
  ),
  it: (
    <svg viewBox="0 0 24 16" className="w-full h-full">
      <rect width="8" height="16" fill="#009246" />
      <rect x="8" width="8" height="16" fill="#FFFFFF" />
      <rect x="16" width="8" height="16" fill="#CE2B37" />
    </svg>
  ),
}

function Drapeau({ code }) {
  return (
    <span className="inline-block w-5 h-[14px] rounded-[3px] overflow-hidden border border-white/15 flex-shrink-0" aria-hidden="true">
      {DRAPEAUX_SVG[code]}
    </span>
  )
}

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
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white border border-slate-700 hover:border-[#4DD9D9]/50 transition-colors ${pleineLargeur ? 'w-full justify-center' : ''}`}
      >
        <Drapeau code={active.code} />
        <span className="uppercase tracking-wide">{active.code}</span>
      </button>

      {ouvert && (
        <div className={`absolute right-0 mt-2 py-1 rounded-xl bg-[#0A0A0F]/95 backdrop-blur-md border border-[#4DD9D9]/20 shadow-xl z-50 min-w-[10rem] ${pleineLargeur ? 'left-0' : ''}`}>
          {LANGUES.map(l => (
            <button
              key={l.code}
              type="button"
              onClick={() => { setLangue(l.code); setOuvert(false) }}
              className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left transition-colors ${
                l.code === langue ? 'text-[#4DD9D9] font-semibold' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Drapeau code={l.code} />
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
