import { useState } from 'react'
import { Check, X, Loader2, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const TEAL = '#4DD9D9'

const plans = [
  {
    id: 'standard',
    name: 'Pack Standard',
    desc: 'Pour les PME de 1 à 5 employés',
    priceMensuel: 79,
    priceAnnuel: 790,
    extra: '+5.-/mois par employé supplémentaire',
    highlight: false,
    features: [
      'Dashboard temps réel',
      'Devis illimités avec marge',
      'Import devis (Excel / PDF)',
      'Catalogue produits',
      'Soumissions en ligne',
      'Saisie des heures',
      'Facturation QR suisse',
      'Gestion des employés (jusqu\'à 5)',
      'Signature électronique',
    ],
  },
  {
    id: 'premium',
    name: 'Pack Premium',
    desc: 'Tout inclus + fonctionnalités avancées',
    priceMensuel: 99,
    priceAnnuel: 990,
    extra: 'Employés illimités inclus',
    highlight: true,
    features: [
      'Tout le Pack Standard',
      'Agenda & planning',
      'Bons de régie avec signature client',
      'Accès fiduciaire / comptable',
      'Pré-comptabilité',
      'Extraits bancaires',
      'Support prioritaire',
    ],
  },
]

function CheckoutModal({ plan, interval, onClose }) {
  const [form, setForm] = useState({ nom: '', contact: '', email: '', telephone: '', npa: '', ville: '' })
  const [employes, setEmployes] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const extra = Math.max(0, employes - 5)
  const extraCoutMensuel = extra * 5
  const extraCoutAnnuel = extra * 60

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('https://ivrkzjpnxnggvxtjfyuy.supabase.co/functions/v1/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pack: plan.id,
          interval: interval === 'annuel' ? 'annuel' : 'mensuel',
          employes,
          entreprise: form,
        }),
      })
      const data = await res.json()
      if (data?.error) {
        setError(data.error)
      } else if (data?.url) {
        window.location.href = data.url
      } else {
        setError('Réponse inattendue. Veuillez réessayer.')
      }
    } catch {
      setError('Erreur réseau. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0F1723] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
          <div>
            <h2 className="font-bold text-white text-lg">Commencer avec {plan.name}</h2>
            <p className="text-sm mt-0.5" style={{ color: TEAL }}>
              {interval === 'annuel'
                ? `${plan.priceAnnuel}.-/an — 2 mois offerts`
                : `${plan.priceMensuel}.-/mois`}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Entreprise *</label>
              <input name="nom" required value={form.nom} onChange={handleChange}
                placeholder="Müller SA"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#4DD9D9]/50" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Contact *</label>
              <input name="contact" required value={form.contact} onChange={handleChange}
                placeholder="Jean Dupont"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#4DD9D9]/50" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Email *</label>
            <input name="email" type="email" required value={form.email} onChange={handleChange}
              placeholder="contact@entreprise.ch"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#4DD9D9]/50" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-xs text-slate-400 mb-1">NPA</label>
              <input name="npa" value={form.npa} onChange={handleChange}
                placeholder="1200"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#4DD9D9]/50" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Ville</label>
              <input name="ville" value={form.ville} onChange={handleChange}
                placeholder="Genève"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#4DD9D9]/50" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Téléphone</label>
            <input name="telephone" value={form.telephone} onChange={handleChange}
              placeholder="+41 79 000 00 00"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#4DD9D9]/50" />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Nombre d'employés *</label>
            <input
              type="number" min="1" max="50" required
              value={employes}
              onChange={e => setEmployes(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#4DD9D9]/50"
            />
            <p className="text-xs text-slate-500 mt-1">5 employés inclus dans le pack</p>
          </div>

          {extra > 0 && (
            <div className="rounded-xl border p-3 text-sm space-y-1" style={{ borderColor: `${TEAL}40`, background: `${TEAL}08` }}>
              <p className="font-semibold" style={{ color: TEAL }}>
                {extra} employé{extra > 1 ? 's' : ''} supplémentaire{extra > 1 ? 's' : ''}
              </p>
              <div className="flex justify-between text-slate-300">
                <span>Pack {plan.name}</span>
                <span>{interval === 'annuel' ? `${plan.priceAnnuel}.-/an` : `${plan.priceMensuel}.-/mois`}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>{extra} × 5.-{interval === 'annuel' ? ' × 12 mois' : '/mois'}</span>
                <span>{interval === 'annuel' ? `${extraCoutAnnuel}.-/an` : `${extraCoutMensuel}.-/mois`}</span>
              </div>
              <div className="flex justify-between font-bold text-white border-t border-white/10 pt-1 mt-1">
                <span>Total</span>
                <span>
                  {interval === 'annuel'
                    ? `${plan.priceAnnuel + extraCoutAnnuel}.-/an`
                    : `${plan.priceMensuel + extraCoutMensuel}.-/mois`}
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-950/50 border border-red-800/50 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl text-sm text-slate-400 border border-white/10 hover:border-white/20 transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-[#0A0A0F] transition-all"
              style={{ background: loading ? '#4DD9D980' : `linear-gradient(135deg, ${TEAL}, #3BC8C8)` }}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Chargement…</> : 'Continuer vers le paiement →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Tarifs() {
  const [interval, setInterval] = useState('mensuel')
  const [selected, setSelected] = useState(null)

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Nav simple */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0F]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-[#0A0A0F]" style={{ background: TEAL }}>N</div>
            <span className="font-bold text-white">Newrigen</span>
          </Link>
          <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">← Retour</Link>
        </div>
      </nav>

      <div className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>Tarifs</span>
            <h1 className="text-4xl md:text-6xl font-black mt-3 mb-4">Simple et transparent</h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Choisissez le pack adapté à votre PME. Sans frais cachés.
            </p>
          </div>

          {/* Toggle mensuel / annuel */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <button
              onClick={() => setInterval('mensuel')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${interval === 'mensuel' ? 'text-[#0A0A0F]' : 'text-slate-400 hover:text-white border border-white/10'}`}
              style={interval === 'mensuel' ? { background: `linear-gradient(135deg, ${TEAL}, #3BC8C8)` } : {}}
            >
              Mensuel
            </button>
            <button
              onClick={() => setInterval('annuel')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${interval === 'annuel' ? 'text-[#0A0A0F]' : 'text-slate-400 hover:text-white border border-white/10'}`}
              style={interval === 'annuel' ? { background: `linear-gradient(135deg, ${TEAL}, #3BC8C8)` } : {}}
            >
              Annuel
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${interval === 'annuel' ? 'bg-[#0A0A0F]/20 text-[#0A0A0F]' : 'text-[#4DD9D9]'}`}
                style={interval !== 'annuel' ? { background: `${TEAL}20` } : {}}>
                2 mois offerts
              </span>
            </button>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-2xl p-8 border flex flex-col"
                style={{
                  background: plan.highlight ? `${TEAL}08` : `${TEAL}04`,
                  borderColor: plan.highlight ? TEAL : `${TEAL}20`,
                  boxShadow: plan.highlight ? `0 0 40px ${TEAL}15` : 'none',
                }}
              >
                {plan.highlight && (
                  <div className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full self-start mb-4 text-[#0A0A0F]"
                    style={{ background: TEAL }}>
                    Recommandé
                  </div>
                )}

                <h2 className="text-2xl font-black text-white mb-1">{plan.name}</h2>
                <p className="text-slate-400 text-sm mb-6">{plan.desc}</p>

                <div className="mb-2">
                  <span className="text-5xl font-black" style={{ color: TEAL }}>
                    {interval === 'annuel' ? plan.priceAnnuel : plan.priceMensuel}.-
                  </span>
                  <span className="text-slate-400 text-sm ml-2">
                    CHF/{interval === 'annuel' ? 'an' : 'mois'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-6">{plan.extra}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: TEAL }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelected(plan)}
                  className="w-full py-4 rounded-xl font-bold text-sm transition-all"
                  style={plan.highlight
                    ? { background: `linear-gradient(135deg, ${TEAL}, #3BC8C8)`, color: '#0A0A0F', boxShadow: `0 0 20px ${TEAL}40` }
                    : { border: `1px solid ${TEAL}40`, color: TEAL, background: `${TEAL}08` }
                  }
                >
                  Choisir ce pack →
                </button>
              </div>
            ))}
          </div>

          {/* Tableau comparatif */}
          <div className="mt-16">
            <h2 className="text-2xl font-black text-white text-center mb-8">Comparatif détaillé</h2>
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: `${TEAL}20` }}>
              <div className="grid grid-cols-3 text-sm font-semibold" style={{ background: `${TEAL}12` }}>
                <div className="p-4 text-slate-300">Fonctionnalité</div>
                <div className="p-4 text-center text-white">Standard</div>
                <div className="p-4 text-center font-bold" style={{ color: TEAL }}>Premium</div>
              </div>
              {[
                ['Dashboard', true, true],
                ['Création de devis (manuel & vocal)', true, true],
                ['Import de devis (Excel / PDF)', true, true],
                ['Catalogue de produits', true, true],
                ['Soumissions en ligne', true, true],
                ['Saisie des heures', true, true],
                ['Facturation QR suisse', true, true],
                ['Gestion des employés (jusqu\'à 5)', true, true],
                ['Signature électronique', true, true],
                ['Agenda & planning', false, true],
                ['Bons de régie avec signature client', false, true],
                ['Accès fiduciaire / comptable', false, true],
                ['Pré-comptabilité', false, true],
                ['Rapport d\'heures', false, true],
                ['Employés illimités', false, true],
              ].map(([feat, std, prem], i) => (
                <div key={feat} className="grid grid-cols-3 text-sm border-t" style={{ borderColor: `${TEAL}10`, background: i % 2 === 0 ? 'transparent' : `${TEAL}04` }}>
                  <div className="p-4 text-slate-300">{feat}</div>
                  <div className="p-4 flex items-center justify-center">
                    {std ? <Check className="w-4 h-4" style={{ color: TEAL }} /> : <X className="w-4 h-4 text-slate-600" />}
                  </div>
                  <div className="p-4 flex items-center justify-center">
                    {prem ? <Check className="w-4 h-4" style={{ color: TEAL }} /> : <X className="w-4 h-4 text-slate-600" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Note bas */}
          <p className="text-center text-slate-500 text-sm mt-8">
            Questions ? Écrivez-nous à{' '}
            <a href="mailto:newrigen6@gmail.com" className="hover:text-white transition-colors" style={{ color: TEAL }}>
              newrigen6@gmail.com
            </a>
          </p>
        </div>
      </div>

      {selected && (
        <CheckoutModal
          plan={selected}
          interval={interval}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
