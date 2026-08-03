import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useT } from '../i18n'
import { pixel } from '../lib/pixelMeta'

const TEAL = '#4DD9D9'

export default function Merci() {
  const t = useT()
  const signale = useRef(false)

  // L'abonnement est conclu : c'est LE resultat que la campagne doit produire.
  // Le garde-fou evite de le compter deux fois si React remonte le composant
  // (mode strict en developpement, retour arriere du navigateur).
  useEffect(() => {
    if (signale.current) return
    signale.current = true
    pixel('Purchase', { currency: 'CHF', value: 49 })
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: `${TEAL}20` }}>
          <Check className="w-10 h-10" style={{ color: TEAL }} />
        </div>
        <h1 className="text-4xl font-black mb-4">{t('merci.titre')}</h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-2">
          {t('merci.soustitre')}
        </p>
        <p className="text-slate-400 leading-relaxed mb-8">
          Vous allez recevoir un email avec vos accès à l'application d'ici quelques minutes.{' '}
          <span className="text-slate-500">(Vérifiez vos spams si nécessaire.)</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://app.newrigen.ch/login"
            className="px-8 py-4 rounded-xl font-bold text-sm text-[#0A0A0F] transition-all"
            style={{ background: `linear-gradient(135deg, ${TEAL}, #3BC8C8)`, boxShadow: `0 0 20px ${TEAL}40` }}
          >
            {t('merci.cta')}
          </a>
          <Link
            to="/"
            className="px-8 py-4 rounded-xl font-semibold text-sm text-slate-300 border border-white/10 hover:border-white/20 transition-colors"
          >
            {t('merci.retour')}
          </Link>
        </div>
      </div>
    </div>
  )
}
