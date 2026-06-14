import { useState, useEffect } from 'react'
import { Shield, X, ChevronDown } from 'lucide-react'

const TEAL = '#4DD9D9'
const STORAGE_KEY = 'newrigen-consent-v1'

const politique = [
  {
    titre: '1. Responsable du traitement',
    texte: `Newrigen (ci-après "nous", "notre", "nos") est responsable du traitement de vos données personnelles. Siège social en Suisse. Contact : newrigen6@gmail.com — Tél. 079 873 37 91 / 079 324 65 93.`,
  },
  {
    titre: '2. Données collectées',
    texte: `Nous collectons uniquement les données que vous nous fournissez volontairement via nos formulaires de contact : nom, adresse e-mail, nom de l'entreprise et description de votre besoin. Aucune donnée sensible n'est collectée.`,
  },
  {
    titre: '3. Finalités du traitement',
    texte: `Vos données sont utilisées exclusivement pour : répondre à vos demandes de contact ou de devis, vous envoyer des informations relatives à nos services (sur demande expresse), améliorer la qualité de nos prestations. Nous ne vendons, ne louons et ne cédons jamais vos données à des tiers.`,
  },
  {
    titre: '4. Base légale',
    texte: `Le traitement repose sur votre consentement explicite (art. 6 al. 1 lit. a RGPD / LPD suisse) et sur notre intérêt légitime à répondre à vos demandes commerciales (art. 6 al. 1 lit. f RGPD).`,
  },
  {
    titre: '5. Durée de conservation',
    texte: `Vos données sont conservées pendant la durée nécessaire au traitement de votre demande, et au maximum 3 ans à compter du dernier contact, conformément aux obligations légales suisses.`,
  },
  {
    titre: '6. Cookies et technologies de suivi',
    texte: `Notre site utilise uniquement des cookies techniques strictement nécessaires au bon fonctionnement du site (mémorisation de votre consentement). Aucun cookie publicitaire ou de tracking tiers n'est utilisé sans votre accord.`,
  },
  {
    titre: '7. Sécurité des données',
    texte: `Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou destruction. Nos données sont hébergées sur des serveurs situés dans l'Union Européenne.`,
  },
  {
    titre: '8. Vos droits',
    texte: `Conformément au RGPD et à la LPD, vous disposez des droits suivants : accès à vos données, rectification, effacement ("droit à l'oubli"), limitation du traitement, portabilité, opposition. Pour exercer ces droits, contactez-nous à newrigen6@gmail.com. Vous disposez également du droit d'introduire une réclamation auprès de l'autorité de protection des données compétente.`,
  },
  {
    titre: '9. Transferts internationaux',
    texte: `Vos données peuvent être transférées et traitées dans des pays offrant un niveau de protection adéquat reconnu par la Suisse ou l'UE. Tout transfert hors de ces zones est encadré par des garanties appropriées (clauses contractuelles types).`,
  },
  {
    titre: '10. Modifications de la politique',
    texte: `Nous nous réservons le droit de modifier cette politique à tout moment. En cas de modification substantielle, nous vous en informerons via notre site. La date de dernière mise à jour est indiquée ci-dessous.`,
  },
]

export default function ConsentGate({ children }) {
  const [accepted, setAccepted] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    try {
      const val = localStorage.getItem(STORAGE_KEY)
      setAccepted(val === 'true')
    } catch {
      setAccepted(false)
    }
  }, [])

  function handleScroll(e) {
    const el = e.currentTarget
    setScrolled(el.scrollTop + el.clientHeight >= el.scrollHeight - 20)
  }

  function accept() {
    try { localStorage.setItem(STORAGE_KEY, 'true') } catch {}
    setAccepted(true)
  }

  function refuse() {
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
    setAccepted(false)
  }

  if (accepted === null) return null
  if (accepted) {
    return (
      <>
        {children}
        <button
          onClick={refuse}
          title="Retirer mon consentement"
          className="fixed bottom-4 left-4 z-50 text-xs text-slate-600 hover:text-slate-400 transition-colors underline"
        >
          Politique de confidentialité
        </button>
      </>
    )
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0A0A0F] flex items-center justify-center p-4">
      {/* Glow décoratif */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: `${TEAL}10` }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: `${TEAL}08` }} />

      <div className="relative w-full max-w-2xl flex flex-col rounded-2xl border overflow-hidden shadow-2xl" style={{ borderColor: `${TEAL}30`, maxHeight: '90vh' }}>

        {/* Header */}
        <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b" style={{ background: '#0E0E16', borderColor: `${TEAL}20` }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${TEAL}20` }}>
              <Shield className="w-4 h-4" style={{ color: TEAL }} />
            </div>
            <div>
              <h1 className="font-black text-white text-lg leading-tight">Politique de confidentialité</h1>
              <p className="text-xs text-slate-500">Newrigen · Dernière mise à jour : juin 2026</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mt-3">
            Avant d'accéder au site, veuillez lire et accepter notre politique de confidentialité. Nous nous engageons à protéger vos données personnelles conformément au <strong className="text-white">RGPD</strong> et à la <strong className="text-white">LPD suisse</strong>.
          </p>
        </div>

        {/* Contenu scrollable */}
        <div
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-2"
          style={{ background: '#0A0A0F' }}
        >
          {politique.map(({ titre, texte }, i) => (
            <div key={i} className="rounded-xl border overflow-hidden" style={{ borderColor: `${TEAL}15` }}>
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
                style={{ background: expanded === i ? `${TEAL}10` : `${TEAL}06` }}
              >
                <span className="text-sm font-semibold text-white">{titre}</span>
                <ChevronDown
                  className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
                  style={{ color: TEAL, transform: expanded === i ? 'rotate(180deg)' : 'none' }}
                />
              </button>
              {expanded === i && (
                <div className="px-4 py-3 text-sm text-slate-400 leading-relaxed border-t" style={{ borderColor: `${TEAL}10`, background: '#0D0D15' }}>
                  {texte}
                </div>
              )}
            </div>
          ))}

          <div className="pt-2 pb-1 text-center">
            <p className="text-xs text-slate-600">
              En cliquant sur "Accepter", vous consentez au traitement de vos données tel que décrit ci-dessus.
            </p>
          </div>
        </div>

        {/* Footer — boutons */}
        <div className="flex-shrink-0 px-6 py-4 border-t flex flex-col sm:flex-row gap-3" style={{ background: '#0E0E16', borderColor: `${TEAL}20` }}>
          <button
            onClick={accept}
            className="flex-1 py-3 rounded-xl font-bold text-sm text-[#0A0A0F] transition-all duration-200 hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${TEAL}, #3BC8C8)`, boxShadow: `0 0 20px ${TEAL}40` }}
          >
            ✓ Accepter et accéder au site
          </button>
          <button
            onClick={() => window.location.href = 'about:blank'}
            className="flex-1 py-3 rounded-xl font-semibold text-sm text-slate-400 border border-white/10 hover:border-white/20 hover:text-white transition-all duration-200"
          >
            Refuser
          </button>
        </div>
      </div>
    </div>
  )
}
