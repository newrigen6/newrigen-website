import { useState, useEffect, useRef } from 'react'
import { Check, X, Loader2, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { track } from '@vercel/analytics'
import { pixel } from '../lib/pixelMeta'
import { useSiteContent } from '../content/SiteContent'
import { useT, useLangue } from '../i18n'
import SelecteurLangue from '../components/SelecteurLangue'
import { useModuleTiers, fonctionsDuPack } from '../content/moduleTiers'
import { montant } from '../lib/montant'
import { numerosDeContact } from '../cine/telephones'
// La page Tarifs vivait hors de la charte : ses propres couleurs, et Inter
// comme police. Les jetons du site lui donnent ses vraies polices, son fond
// et ses classes — c'est la meme marque des deux cotes du clic.
import '../cine/tokens.css'
import './tarifs.css'

const TEAL = '#4DD9D9'

// Le pack mis en avant. C'est celui que l'accueil met deja en avant
// (`offre.miseEnAvant` dans contenu.js) : les deux pages doivent designer le
// meme, sinon elles se contredisent a deux clics d'ecart.
const PACK_EN_AVANT = 'standard'

// Libellés dans le dictionnaire (tarifs.<id>.*) ; ici seuls l'identifiant et
// les prix de repli. La liste des fonctions vient de `fonctionsDuPack`.
const plans = [
  { id: 'solo',     priceMensuel: 17.90, priceAnnuel: 179 },
  { id: 'standard', priceMensuel: 49,   priceAnnuel: 539 },
  { id: 'premium',  priceMensuel: 89,   priceAnnuel: 979 },
]

function CheckoutModal({ plan, interval, onClose }) {
  const t = useT()
  const [form, setForm] = useState({ nom: '', contact: '', email: '', telephone: '', npa: '', ville: '' })
  const [employes, setEmployes] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { prix } = useSiteContent()
  // Le pack Premium inclut les employés illimités : aucun siège supplémentaire
  // n'est facturé (même règle que la fonction create-checkout).
  // Solo : une personne, toujours. Le champ est masque, mais l'etat pourrait
  // valoir davantage si l'on a change de pack en cours de route.
  const employesEnvoyes = plan.id === 'solo' ? 1 : employes
  const extra = plan.id === 'premium' || plan.id === 'solo'
    ? 0
    : Math.max(0, employes - 5)
  const extraCoutMensuel = extra * (prix.employe_sup_mensuel ?? 5)
  const extraCoutAnnuel = extra * (prix.employe_sup_annuel ?? 60)

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
          employes: employesEnvoyes,
          entreprise: form,
          trial: true,
        }),
      })
      const data = await res.json()
      if (data?.error) {
        setError(data.error)
      } else if (data?.url) {
        track('checkout_stripe', { pack: plan.id, interval })
        // InitiateCheckout : le signal principal donne a Meta. Il arrive assez
        // souvent pour que l'algorithme apprenne, contrairement a l'abonnement
        // conclu qui reste rare au debut.
        pixel('InitiateCheckout', {
          content_name: plan.id, content_category: interval,
          value: interval === 'annuel' ? plan.priceAnnuel : plan.priceMensuel,
          currency: 'CHF',
        })
        window.location.href = data.url
      } else {
        setError(t('checkout.erreur.inattendue'))
      }
    } catch {
      setError(t('checkout.erreur.reseau'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0F1723] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
          <div>
            <h2 className="font-bold text-white text-lg">Commencer avec {t(`tarifs.${plan.id}.nom`)}</h2>
            <p className="text-sm mt-0.5" style={{ color: TEAL }}>
              {t('accueil.packs.moisGratuit')} {t('tarifs.puisCourt')}{' '}
              {interval === 'annuel'
                ? `${montant(plan.priceAnnuel)}/an`
                : `${montant(plan.priceMensuel)}/mois`}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">{t('checkout.entreprise')}</label>
              <input name="nom" required value={form.nom} onChange={handleChange}
                placeholder={t('checkout.entreprise.exemple')}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#4DD9D9]/50" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">{t('checkout.contact')}</label>
              <input name="contact" required value={form.contact} onChange={handleChange}
                placeholder={t('checkout.contact.exemple')}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#4DD9D9]/50" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">{t('checkout.email')}</label>
            <input name="email" type="email" required value={form.email} onChange={handleChange}
              placeholder={t('checkout.email.exemple')}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#4DD9D9]/50" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-xs text-slate-400 mb-1">{t('checkout.npa')}</label>
              <input name="npa" value={form.npa} onChange={handleChange}
                placeholder="1200"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#4DD9D9]/50" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1">{t('checkout.ville')}</label>
              <input name="ville" value={form.ville} onChange={handleChange}
                placeholder={t('checkout.ville.exemple')}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#4DD9D9]/50" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">{t('checkout.telephone')}</label>
            <input name="telephone" value={form.telephone} onChange={handleChange}
              placeholder="+41 79 000 00 00"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#4DD9D9]/50" />
          </div>

          {plan.id === 'solo' ? (
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
              <p className="text-sm text-white">{t('checkout.soloUnePersonne')}</p>
              <p className="text-xs text-slate-500 mt-1">{t('checkout.soloEmbauche')}</p>
            </div>
          ) : (
            <div>
              <label className="block text-xs text-slate-400 mb-1">{t('checkout.employes')}</label>
              <input
                type="number" min="1" max="50" required
                value={employes}
                onChange={e => setEmployes(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#4DD9D9]/50"
              />
              <p className="text-xs text-slate-500 mt-1">5 employés inclus dans le pack</p>
            </div>
          )}

          {extra > 0 && (
            <div className="rounded-xl border p-3 text-sm space-y-1" style={{ borderColor: `${TEAL}40`, background: `${TEAL}08` }}>
              <p className="font-semibold" style={{ color: TEAL }}>
                {extra} employé{extra > 1 ? 's' : ''} supplémentaire{extra > 1 ? 's' : ''}
              </p>
              <div className="flex justify-between text-slate-300">
                <span>Pack {plan.name}</span>
                <span>{interval === 'annuel' ? `${montant(plan.priceAnnuel)}/an` : `${montant(plan.priceMensuel)}/mois`}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>{extra} × 5.-{interval === 'annuel' ? ' × 12 mois' : '/mois'}</span>
                <span>{interval === 'annuel' ? `${extraCoutAnnuel}.-/an` : `${extraCoutMensuel}.-/mois`}</span>
              </div>
              <div className="flex justify-between font-bold text-white border-t border-white/10 pt-1 mt-1">
                <span>{t('checkout.total')}</span>
                <span>
                  {interval === 'annuel'
                    ? `${montant(plan.priceAnnuel + extraCoutAnnuel)}/an`
                    : `${montant(plan.priceMensuel + extraCoutMensuel)}/mois`}
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
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />{t('checkout.chargement')}</> : t('checkout.continuer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Tarifs() {
  const t = useT()
  const { langue } = useLangue()
  const [interval, setInterval] = useState('mensuel')
  const [selected, setSelected] = useState(null)

  // Le curseur du sélecteur se cale sur l'onglet actif. On le mesure plutôt
  // que de le calculer : la largeur des libellés change d'une langue à
  // l'autre, et « Annuel » porte en plus sa pastille « 1 mois offert ».
  const ongletMensuel = useRef(null)
  const ongletAnnuel = useRef(null)
  const [curseur, setCurseur] = useState({ x: 0, l: 0 })

  useEffect(() => {
    const actif = interval === 'annuel' ? ongletAnnuel.current : ongletMensuel.current
    if (!actif) return
    const placer = () => setCurseur({ x: actif.offsetLeft - 4, l: actif.offsetWidth })
    placer()
    // Les polices arrivent après le premier rendu : sans ce second passage,
    // le curseur garde la largeur mesurée dans la police de secours.
    const surPolices = () => placer()
    document.fonts?.ready.then(surPolices)
    window.addEventListener('resize', placer)
    return () => window.removeEventListener('resize', placer)
  }, [interval])
  const { prix, contact } = useSiteContent()
  const liveModules = useModuleTiers()

  // Prix + fonctionnalités pilotés depuis l'admin (repli sur les valeurs codées en dur
  // tant que Supabase n'a pas répondu, ou en cas d'échec)
  // La liste des fonctions vient de `fonctionsDuPack`, partagée avec l'accueil :
  // les deux pages ne peuvent plus annoncer des packs différents.
  const livePlans = plans.map(p => ({
    ...p,
    priceMensuel: prix[`${p.id}_mensuel`] ?? p.priceMensuel,
    priceAnnuel:  prix[`${p.id}_annuel`]  ?? p.priceAnnuel,
    features: fonctionsDuPack(p.id, { modules: liveModules, langue, traduire: t }),
  }))

  return (
    <div className="tarifs-page min-h-screen text-white">
      {/* Nav simple */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0F]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm" style={{ background: '#0A0A0F', border: `1.5px solid ${TEAL}`, color: TEAL }}>N</div>
            <span className="font-bold text-white">Newrigen</span>
          </Link>
          <div className="flex items-center gap-3">
            <SelecteurLangue />
            <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">{t('nav.retour')}</Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-24 px-6">
        {/* Élargi depuis l'ajout du troisième pack : trois cartes dans 896 px
            n'auraient laissé que 280 px chacune. */}
        <div className="max-w-6xl mx-auto">

          {/* L'en-tête : titre à gauche, sélecteur à droite, sur une ligne.
              Il était centré en pile — la mise en page que prend n'importe
              quelle page de tarifs. Aligné à gauche, il suit la lecture et
              laisse le sélecteur à portée du pouce, contre les cartes. */}
          <div className="grid lg:grid-cols-[1.25fr_auto] gap-10 lg:gap-16 items-end mb-14">
            <div className="tarifs-entre">
              <p className="cine-oeil">{t('tarifs.eyebrow')}</p>
              <span className="cine-filet mt-3" aria-hidden="true" />
              <h1 className="cine-h1 mt-6 whitespace-pre-line">{t('tarifs.titre')}</h1>
              <p className="cine-intro mt-6">{t('tarifs.soustitre')}</p>
              <p className="mt-6 inline-flex items-center gap-2.5 text-sm text-[var(--gris-clair)]">
                <span aria-hidden="true" className="cine-pastille" />
                {t('tarifs.essai')}
              </p>
            </div>

            {/* Un seul curseur qui glisse, plutôt que deux boutons qui
                s'allument : on voit le choix se déplacer. */}
            <div className="tarifs-entre" data-retard="1">
              <div className="tarifs-bascule" role="group" aria-label={t('tarifs.eyebrow')}>
                <span
                  className="tarifs-bascule__pastille"
                  aria-hidden="true"
                  style={{ transform: `translateX(${curseur.x}px)`, width: curseur.l }}
                />
                <button
                  ref={ongletMensuel}
                  type="button"
                  onClick={() => setInterval('mensuel')}
                  aria-pressed={interval === 'mensuel'}
                >
                  {t('tarifs.mensuel')}
                </button>
                <button
                  ref={ongletAnnuel}
                  type="button"
                  onClick={() => setInterval('annuel')}
                  aria-pressed={interval === 'annuel'}
                >
                  {t('tarifs.annuel')}
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={interval === 'annuel'
                      ? { background: 'rgb(5 7 10 / 0.18)', color: 'var(--nuit)' }
                      : { background: `${TEAL}22`, color: TEAL }}
                  >
                    {t('tarifs.unMoisOffert')}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Les trois packs payants, en trois colonnes, celui du milieu mis en
              avant par le poids — c'est ce que demande DESIGN.md, et c'est déjà
              le pack que l'accueil met en avant. Le sur-mesure descend en
              bandeau : il n'a pas de prix, et le loger dans une colonne de prix
              obligeait à écrire « Sur devis » en turquoise, où il entrait en
              concurrence avec les vrais montants. */}
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {livePlans.map((plan, i) => {
              const enAvant = plan.id === PACK_EN_AVANT
              const prix = interval === 'annuel' ? plan.priceAnnuel : plan.priceMensuel
              const periode = interval === 'annuel' ? t('tarifs.periode.an') : t('tarifs.periode.mois')
              return (
                <div
                  key={plan.id}
                  data-retard={i + 1}
                  className={`tarifs-carte tarifs-entre relative rounded-2xl p-8 border flex flex-col ${enAvant ? 'md:-mt-5 md:pb-12' : ''}`}
                  style={{
                    background: enAvant ? `${TEAL}0E` : `${TEAL}04`,
                    borderColor: enAvant ? `${TEAL}55` : `${TEAL}20`,
                  }}
                >
                  {/* Pas d'étiquette « le plus populaire » : on ne peut pas le
                      prouver. La mise en avant tient au relief, au cadre plus
                      net et au seul bouton plein de la page. */}
                  <h2 className="text-2xl font-black text-white mb-1">{t(`tarifs.${plan.id}.nom`)}</h2>
                  <p className="text-slate-400 text-sm mb-7">{t(`tarifs.${plan.id}.desc`)}</p>

                  {/* Le prix réel en grand. Avant, c'était « 0.– » qui occupait
                      cette place : identique sur les trois cartes, donc le plus
                      gros élément de la page n'y distinguait rien, pendant que
                      le montant qui décide était barré en petit gris. Le mois
                      offert redevient ce qu'il est — une promotion à côté. */}
                  <div className="flex items-baseline gap-2 tarifs-prix" key={interval}>
                    <span className="cine-titre text-5xl text-white cine-chiffres">{montant(prix)}</span>
                    <span className="text-slate-400 text-sm">/{periode}</span>
                  </div>
                  <p className="mt-3">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: `${TEAL}22`, color: TEAL }}
                    >
                      {t('accueil.packs.moisGratuit')}
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 mt-3 mb-7">{t(`tarifs.${plan.id}.extra`)}</p>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                        <Check className="w-4 h-4 flex-shrink-0" style={{ color: TEAL }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Un seul bouton plein sur la page : celui du pack mis en
                      avant. Trois boutons pleins côte à côte ne désignent rien. */}
                  <button
                    onClick={() => {
                      track('pack_choisi', { pack: plan.id, interval })
                      pixel('ViewContent', { content_name: plan.id, content_category: interval })
                      setSelected(plan)
                    }}
                    className="w-full py-4 rounded-xl font-bold text-sm transition-all border"
                    style={enAvant
                      ? { background: `linear-gradient(135deg, ${TEAL}, #3BC8C8)`, color: '#0A0A0F', borderColor: 'transparent' }
                      : { background: 'transparent', color: '#fff', borderColor: `${TEAL}55` }}
                  >
                    {t('tarifs.commencerEssai')}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Le sur-mesure : un bandeau, pas une colonne. Il se chiffre après
              discussion et passe par le contact, pas par le tunnel de paiement. */}
          <div
            className="mt-6 rounded-2xl border p-8 grid lg:grid-cols-[1fr_1.1fr] gap-8 items-center"
            style={{ background: `${TEAL}04`, borderColor: `${TEAL}20` }}
          >
            <div>
              <h2 className="text-2xl font-black text-white mb-1">{t('tarifs.surmesure.nom')}</h2>
              <p className="text-slate-400 text-sm">{t('tarifs.surmesure.desc')}</p>
              <p className="text-2xl font-black mt-4" style={{ color: TEAL }}>{t('tarifs.surmesure.prix')}</p>
              <p className="text-xs text-slate-500 mt-1">{t('tarifs.surmesure.mention')}</p>
              {/* « /#contact » ne menait nulle part : cette ancre n'existe que
                  sur l'ancienne page. La zone de contact s'appelle « devis ». */}
              <Link to="/#devis"
                onClick={() => track('pack_choisi', { pack: 'surmesure', interval: 'sur-devis' })}
                className="inline-block mt-6 px-7 py-4 rounded-xl font-bold text-sm transition-all border"
                style={{ background: 'transparent', color: '#fff', borderColor: `${TEAL}55` }}>
                {t('tarifs.surmesure.cta')}
              </Link>
            </div>
            <ul className="grid sm:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map(n => (
                <li key={n} className="flex items-start gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: TEAL }} />
                  {t(`tarifs.surmesure.f${n}`)}
                </li>
              ))}
            </ul>
          </div>

          {/* Option add-on */}
          <div className="mt-12 rounded-2xl border p-6" style={{ borderColor: `${TEAL}30`, background: `${TEAL}06` }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base font-black text-white">🎙️ {t('tarifs.vocal.titre')}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${TEAL}20`, color: TEAL }}>{t('tarifs.addon')}</span>
                </div>
                <p className="text-slate-400 text-sm">{t('tarifs.vocal.description')}</p>
                <ul className="mt-2 space-y-1">
                  {[1, 2, 3].map(n => (
                    <li key={n} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-3 h-3 flex-shrink-0" style={{ color: TEAL }} />{t(`tarifs.vocal.${n}`)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-black" style={{ color: TEAL }}>15.-</p>
                <p className="text-slate-400 text-xs">{t('tarifs.chfMois')}</p>
                <p className="text-slate-500 text-xs mt-1">ou 180.-/an</p>
              </div>
            </div>
          </div>

          {/* Note bas */}
          <p className="text-center text-slate-500 text-sm mt-8">
            {t('tarifs.questions')}{' '}
            <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors" style={{ color: TEAL }}>
              {contact.email}
            </a>
            {numerosDeContact(contact).map(({ numero, href }) => (
              <span key={numero}>
                {' · '}
                <a href={href} className="hover:text-white transition-colors" style={{ color: TEAL }}>{numero}</a>
              </span>
            ))}
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
