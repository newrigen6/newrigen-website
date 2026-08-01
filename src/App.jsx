import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Menu, X, Check, ArrowRight, Zap, Brain, Workflow, LineChart, Star, MapPin, Mail, ChevronRight, Instagram, Facebook } from 'lucide-react'
import { useSiteContent } from './content/SiteContent'
import { useModuleTiers } from './content/moduleTiers'
import dashboardScreenshot from './assets/dashboard-screenshot.jpg'
import SelecteurLangue from './components/SelecteurLangue'
import { useT } from './i18n'

const TEAL_PACKS = '#4DD9D9'

function PacksComparatif() {
  const [interval, setInterval] = useState('mensuel')
  const liveModules = useModuleTiers()
  const { prix } = useSiteContent()
  const t = useT()

  const homePlans = [
    {
      id: 'standard',
      name: t('tarifs.standard.nom'),
      desc: t('tarifs.standard.desc'),
      priceMensuel: prix.standard_mensuel,
      priceAnnuel: prix.standard_annuel,
      extra: t('tarifs.standard.extra'),
      highlight: false,
      features: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => t(`tarifs.standard.f${n}`)),
    },
    {
      id: 'premium',
      name: t('tarifs.premium.nom'),
      desc: t('tarifs.premium.desc'),
      priceMensuel: prix.premium_mensuel,
      priceAnnuel: prix.premium_annuel,
      extra: t('tarifs.premium.extra'),
      highlight: true,
      features: [1, 2, 3, 4, 5, 6, 7].map(n => t(`tarifs.premium.f${n}`)),
    },
  ]

  // Fonctionnalités pilotées depuis l'admin (repli sur les listes codées en dur
  // tant que Supabase n'a pas répondu, ou en cas d'échec)
  const livePacks = homePlans.map(p => {
    if (!liveModules) return p
    if (p.id === 'standard') {
      const features = liveModules.filter(m => m.tier === 'standard').map(m => m.label)
      return features.length ? { ...p, features } : p
    }
    if (p.id === 'premium') {
      const premiumOnly = liveModules.filter(m => m.tier === 'premium').map(m => m.label)
      return premiumOnly.length ? { ...p, features: [t('tarifs.premium.f1'), ...premiumOnly] } : p
    }
    return p
  })

  return (
    <section className="py-14 px-6">
      <div className="max-w-4xl mx-auto">
        <div data-anim="up" className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL_PACKS }}>{t('accueil.packs.eyebrow')}</span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4 text-white">{t('accueil.packs.titre')}</h2>
          <p className="text-slate-400">{t('accueil.packs.soustitre')}</p>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-sm font-semibold" style={{ background: `${TEAL_PACKS}15`, color: TEAL_PACKS, border: `1px solid ${TEAL_PACKS}40` }}>
            <span>🎁</span> {t('accueil.packs.essai')}
          </div>
        </div>
        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <button onClick={() => setInterval('mensuel')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${interval === 'mensuel' ? 'text-[#0A0A0F]' : 'text-slate-400 border border-white/10'}`}
            style={interval === 'mensuel' ? { background: `linear-gradient(135deg, ${TEAL_PACKS}, #3BC8C8)` } : {}}>
            {t('tarifs.mensuel')}
            <span className="text-xs px-2 py-0.5 rounded-full font-bold ml-1" style={interval === 'mensuel' ? { background: 'rgba(0,0,0,0.25)', color: '#0A0A0F' } : { background: `${TEAL_PACKS}20`, color: TEAL_PACKS }}>{t('tarifs.unMoisOffert')}</span>
          </button>
          <button onClick={() => setInterval('annuel')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${interval === 'annuel' ? 'text-[#0A0A0F]' : 'text-slate-400 border border-white/10'}`}
            style={interval === 'annuel' ? { background: `linear-gradient(135deg, ${TEAL_PACKS}, #3BC8C8)` } : {}}>
            {t('tarifs.annuel')}
            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={interval === 'annuel' ? { background: 'rgba(0,0,0,0.25)', color: '#0A0A0F' } : { background: `${TEAL_PACKS}20`, color: TEAL_PACKS }}>{t('tarifs.unMoisOffert')}</span>
          </button>
        </div>
        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {livePacks.map(plan => (
            <div key={plan.id} className="rounded-2xl p-8 border flex flex-col" style={{
              background: plan.highlight ? `${TEAL_PACKS}08` : `${TEAL_PACKS}04`,
              borderColor: plan.highlight ? TEAL_PACKS : `${TEAL_PACKS}20`,
              boxShadow: plan.highlight ? `0 0 40px ${TEAL_PACKS}15` : 'none',
            }}>
              {plan.highlight && (
                <div className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full self-start mb-4 text-[#0A0A0F]" style={{ background: TEAL_PACKS }}>
                  {t('accueil.packs.recommande')}
                </div>
              )}
              <h2 className="text-2xl font-black text-white mb-1">{plan.name}</h2>
              <p className="text-slate-400 text-sm mb-5">{plan.desc}</p>
              <div className="mb-1">
                <span className="text-2xl font-bold line-through text-slate-600 mr-2">
                  {interval === 'annuel' ? plan.priceAnnuel : plan.priceMensuel}.-
                </span>
                <span className="text-sm font-bold px-2 py-0.5 rounded-full text-[#0A0A0F]" style={{ background: TEAL_PACKS }}>{t('accueil.packs.moisGratuit')}</span>
              </div>
              <div className="mb-2 mt-1">
                <span className="text-5xl font-black" style={{ color: TEAL_PACKS }}>0.-</span>
                <span className="text-slate-400 text-sm ml-2">{t('accueil.packs.premierMois')}</span>
              </div>
              <p className="text-xs text-slate-500 mb-1">{t('tarifs.puis', { prix: interval === 'annuel' ? plan.priceAnnuel : plan.priceMensuel, periode: interval === 'annuel' ? t('tarifs.periode.an') : t('tarifs.periode.mois'), extra: plan.extra })}</p>
              <p className="text-xs text-slate-500 mb-4">{t('accueil.packs.empreinte')}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                    <Check className="w-4 h-4 flex-shrink-0" style={{ color: TEAL_PACKS }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/tarifs"
                className="block text-center w-full py-4 rounded-xl font-bold text-sm transition-all"
                style={plan.highlight
                  ? { background: `linear-gradient(135deg, ${TEAL_PACKS}, #3BC8C8)`, color: '#0A0A0F' }
                  : { border: `1px solid ${TEAL_PACKS}40`, color: TEAL_PACKS, background: `${TEAL_PACKS}08` }}>
                {t('tarifs.commencerEssai')}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
import Tarifs from './pages/Tarifs'
import Merci from './pages/Merci'
import Demo from './pages/Demo'
import ConsentGate from './components/ConsentGate'
import { MentionsLegales, Confidentialite, CGV } from './pages/Legal'

const TEAL = '#4DD9D9'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const t = useT()
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  const links = [
    { href: '#services', label: t('nav.services') },
    { href: '#comparatif', label: t('nav.comparatif') },
    { href: '#processus', label: t('nav.processus') },
    { href: '/tarifs', label: t('nav.tarifs'), route: true },
    { href: '#contact', label: t('accueil.footer.contactLabel') },
  ]
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0A0A0F]/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm" style={{ background: '#0A0A0F', border: `1.5px solid ${TEAL}`, color: TEAL }}>N</div>
          <span className="font-bold text-lg tracking-tight text-white">Newrigen</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => l.route
            ? <Link key={l.href} to={l.href} className="text-sm text-slate-400 hover:text-white transition-colors font-medium">{l.label}</Link>
            : <a key={l.href} href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors font-medium">{l.label}</a>
          )}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <SelecteurLangue />
          <Link to="/tarifs" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#0A0A0F] transition-all duration-200 shadow-lg" style={{ background: `linear-gradient(135deg, ${TEAL}, #3BC8C8)`, boxShadow: `0 0 20px ${TEAL}40` }}>
            {t('accueil.nav.abonner')}
          </Link>
        </div>
        <div className="md:hidden flex items-center gap-2">
          <SelecteurLangue />
          <Link to="/tarifs" className="px-4 py-2 rounded-xl text-xs font-semibold text-[#0A0A0F]" style={{ background: `linear-gradient(135deg, ${TEAL}, #3BC8C8)` }}>{t('accueil.nav.abonner')}</Link>
          <button className="text-white" onClick={() => setOpen(v => !v)}>{open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-[#0A0A0F]/95 backdrop-blur border-b border-white/10 px-6 py-4 space-y-3">
          {links.map(l => l.route
            ? <Link key={l.href} to={l.href} onClick={() => setOpen(false)} className="block text-slate-300 hover:text-white py-1">{l.label}</Link>
            : <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-slate-300 hover:text-white py-1">{l.label}</a>
          )}
          <Link to="/tarifs" onClick={() => setOpen(false)} className="block text-center py-2.5 rounded-xl text-sm font-semibold text-[#0A0A0F]" style={{ background: TEAL }}>{t('accueil.nav.abonner')}</Link>
        </div>
      )}
    </nav>
  )
}

function Hero() {
  const t = useT()
  return (
    <section id="hero" className="relative flex items-center justify-center overflow-hidden pt-24">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: `${TEAL}15` }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: `${TEAL}10` }} />
      <div className="relative max-w-5xl mx-auto px-6 text-center py-16">
        <h1 data-anim="up" data-delay="100" className="text-3xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
          {t('hero.titre.1')}{' '}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${TEAL}, #7ee8e8)` }}>{t('hero.titre.2')}</span>
          <br />
          {t('hero.titre.3')}{' '}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, #7ee8e8, ${TEAL})` }}>{t('hero.titre.4')}</span>
        </h1>
        <p data-anim="up" data-delay="200" className="text-sm text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          {t('accueil.hero.texte')}
        </p>
        <div data-anim="up" data-delay="300" className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Action principale : l'essai gratuit. Elle menait vers le formulaire
              de contact (« Demande d'audit ») — un visiteur qui voulait juste
              essayer le logiciel n'avait aucun chemin. L'audit reste accessible
              par le lien secondaire. */}
          <Link to="/tarifs" className="px-8 py-4 rounded-xl font-bold text-[#0A0A0F] text-sm transition-all duration-200" style={{ background: `linear-gradient(135deg, ${TEAL}, #3BC8C8)`, boxShadow: `0 0 30px ${TEAL}40` }}>
            {t('accueil.hero.cta')}
          </Link>
          {/* Le bouton « Voir la démo » vivait ici. La visite guidée (/demo)
              n'est pas encore prête : elle reste en place mais sans lien
              depuis le site. Remettre ce bouton, et le lien sur la capture
              ci-dessous, le jour où elle est validée. */}
        </div>
        <div data-anim="up" data-delay="400" className="relative mt-16">
          <div className="absolute inset-x-0 top-4 h-2/3 blur-3xl pointer-events-none" style={{ background: `${TEAL}25` }} />
          <img
            src={dashboardScreenshot}
            alt="Interface de l'application Newrigen — tableau de bord"
            className="relative w-full max-w-2xl mx-auto rounded-xl border shadow-2xl"
            style={{ borderColor: `${TEAL}30` }}
          />
        </div>
      </div>
    </section>
  )
}

const serviceIcons = [LineChart, Brain, Zap]

function Services() {
  const t = useT()
  const services = serviceIcons.map((icon, i) => ({
    icon,
    title: t(`accueil.services.${i + 1}.titre`),
    desc: t(`accueil.services.${i + 1}.desc`),
    items: [1, 2, 3].map(n => t(`accueil.services.${i + 1}.item${n}`)),
  }))
  return (
    <section id="services" className="py-14 px-6 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${TEAL}08 0%, transparent 70%)` }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div data-anim="up" className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>{t('services.eyebrow')}</span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4">{t('accueil.services.titre')}</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">{t('accueil.services.soustitre')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {services.map(({ icon: Icon, title, desc, items: sItems }, i) => (
            <div
              key={i}
              data-anim="up"
              data-delay={String(i * 150)}
              className="group relative rounded-2xl p-7 flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{ background: 'linear-gradient(145deg, #0F1520, #0A0E17)', border: `1px solid ${TEAL}18` }}
            >
              {/* Top glow bar */}
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${TEAL}60, transparent)` }} />
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" style={{ boxShadow: `inset 0 0 40px ${TEAL}08`, border: `1px solid ${TEAL}40` }} />

              {/* Number */}
              <span className="text-6xl font-black mb-4 select-none leading-none" style={{ color: `${TEAL}12` }}>0{i + 1}</span>

              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110" style={{ background: `linear-gradient(135deg, ${TEAL}25, ${TEAL}10)`, border: `1px solid ${TEAL}30` }}>
                <Icon className="w-5 h-5" style={{ color: TEAL }} />
              </div>

              <h3 className="text-lg font-bold mb-3 text-white">{title}</h3>
              <p className="text-slate-500 text-sm mb-5 leading-relaxed flex-1">{desc}</p>

              <div className="space-y-2 pt-4 border-t" style={{ borderColor: `${TEAL}12` }}>
                {sItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: TEAL }} />
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Comparatif() {
  const t = useT()
  const rows = [1, 2, 3, 4, 5, 6, 7, 8].map(n => [
    t(`accueil.comparatif.${n}.feature`),
    t(`accueil.comparatif.${n}.sans`),
    t(`accueil.comparatif.${n}.avec`),
  ])
  return (
    <section id="comparatif" className="py-14 px-6">
      <div className="max-w-2xl mx-auto">
        <div data-anim="up" className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>{t('comparatif.eyebrow')}</span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4">{t('accueil.comparatif.titre')}</h2>
          <p className="text-slate-400">{t('accueil.comparatif.soustitre')}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Colonne SANS */}
          <div data-anim="up" data-delay="100" className="rounded-2xl border border-red-500/20 overflow-hidden" style={{ background: 'rgba(239,68,68,0.04)' }}>
            <div className="flex items-center gap-3 px-6 py-4 border-b border-red-500/20" style={{ background: 'rgba(239,68,68,0.08)' }}>
              <span className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold text-sm">✗</span>
              <span className="font-bold text-red-400 text-sm uppercase tracking-widest">{t('accueil.comparatif.sansLabel')}</span>
            </div>
            <ul className="divide-y divide-red-500/10">
              {rows.map(([feat, before], idx) => (
                <li key={idx} className="px-5 py-2.5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-0.5">{feat}</div>
                  <div className="text-slate-400 text-sm">{before}</div>
                </li>
              ))}
            </ul>
          </div>
          {/* Colonne AVEC */}
          <div data-anim="up" data-delay="200" className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${TEAL}30`, background: `${TEAL}06` }}>
            <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: `${TEAL}20`, background: `${TEAL}12` }}>
              <span className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: `${TEAL}25`, color: TEAL }}>✓</span>
              <span className="font-bold text-sm uppercase tracking-widest" style={{ color: TEAL }}>{t('accueil.comparatif.avecLabel')}</span>
            </div>
            <ul className="divide-y" style={{ borderColor: `${TEAL}10` }}>
              {rows.map(([feat, , after], idx) => (
                <li key={idx} className="px-5 py-2.5" style={{ borderColor: `${TEAL}10` }}>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-0.5">{feat}</div>
                  <div className="text-sm font-semibold" style={{ color: TEAL }}>{after}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function Processus() {
  const t = useT()
  const steps = ['01', '02', '03'].map((n, i) => ({
    n,
    title: t(`accueil.processus.${i + 1}.titre`),
    desc: t(`accueil.processus.${i + 1}.desc`),
    items: [1, 2, 3].map(k => t(`accueil.processus.${i + 1}.item${k}`)),
  }))
  return (
    <section id="processus" className="py-14 px-6">
      <div className="max-w-5xl mx-auto">
        <div data-anim="up" className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>{t('processus.eyebrow')}</span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4">{t('accueil.processus.titre')}</h2>
          <p className="text-slate-400">{t('accueil.processus.soustitre')}</p>
        </div>
        <div className="space-y-6">
          {steps.map(({ n, title, desc, items }, i) => (
            <div key={n} data-anim="up" data-delay={String(i * 200)} className="flex gap-6 rounded-2xl p-6 border" style={{ background: `${TEAL}06`, borderColor: `${TEAL}18` }}>
              <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm" style={{ background: `${TEAL}20`, color: TEAL }}>
                {n}
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold uppercase tracking-widest mb-1 block" style={{ color: `${TEAL}80` }}>{t('processus.etape')} {n}</span>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm mb-3 leading-relaxed">{desc}</p>
                <ul className="flex flex-wrap gap-2">
                  {items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full" style={{ background: `${TEAL}12`, color: TEAL }}>
                      <Check className="w-3 h-3" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Temoignages() {
  const t = useT()
  const { temoignages } = useSiteContent()

  // Aucun témoignage saisi depuis l'admin : on masque toute la section plutôt
  // que d'afficher un titre suivi du vide, et surtout on n'invente rien ici.
  if (!temoignages?.length) return null

  return (
    <section id="temoignages" className="py-14 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4DD9D9]/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div data-anim="up" className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>{t('temoignages.eyebrow')}</span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4">{t('temoignages.titre')}</h2>
          <p className="text-slate-400 max-w-xl mx-auto">{t('temoignages.soustitre')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {temoignages.map((temoin, i) => (
            <div
              key={i}
              data-anim="up"
              data-delay={String(i * 150)}
              className="rounded-2xl p-7 border"
              style={{ background: 'linear-gradient(145deg, #0F1520, #0A0E17)', border: `1px solid ${TEAL}18` }}
            >
              <div className="flex gap-1 mb-5">
                {Array.from({ length: temoin.stars || 5 }).map((_, j) => (
                  <span key={j} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">"{temoin.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: `${TEAL}20`, color: TEAL }}>
                  {temoin.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{temoin.name}</div>
                  <div className="text-xs text-slate-500">{[temoin.role, temoin.location].filter(Boolean).join(' · ')}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const { contact } = useSiteContent()
  const t = useT()
  return (
    <section id="contact" className="py-14 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="grid md:grid-cols-5 gap-6 items-center">
          {/* Carte infos — 2/5 */}
          <div className="md:col-span-2 rounded-2xl p-8 flex flex-col justify-between" style={{ background: `${TEAL}10`, border: `1px solid ${TEAL}25` }}>
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>{t('accueil.contact.eyebrow')}</span>
              <h2 className="text-2xl font-black mt-3 mb-3 text-white leading-snug">
                {t('accueil.contact.titre1')}<span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${TEAL}, #7ee8e8)` }}>{t('accueil.contact.titre2')}</span>{t('accueil.contact.titre3')}
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">{t('accueil.contact.desc')}</p>
            </div>
            <div className="mt-8 space-y-3 text-sm">
              <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: TEAL }} />{contact.email}
              </a>
              <span className="flex items-center gap-3 text-slate-300">
                <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: TEAL }} />{t('contact.region')}
              </span>
            </div>
          </div>
          {/* Carte formulaire — 3/5 */}
          <div className="md:col-span-3 rounded-2xl p-6 flex flex-col justify-center" style={{ background: '#0F1318', border: '1px solid rgba(255,255,255,0.06)' }}>
            {sent ? (
              <div className="flex flex-col items-center gap-4 text-center py-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: `${TEAL}20` }}>
                  <Check className="w-8 h-8" style={{ color: TEAL }} />
                </div>
                <p className="font-bold text-white text-xl">{t('accueil.contact.envoyeTitre')}</p>
                <p className="text-slate-400 text-sm">{t('accueil.contact.envoyeSoustitre')}</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-black text-white mb-1">{t('accueil.contact.formTitre')}</h3>
                <p className="text-slate-400 text-sm mb-8">{t('accueil.contact.formSoustitre')}</p>
                <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="space-y-3">
                  <input
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="votre@email.ch"
                    className="w-full px-4 py-3.5 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                  <button type="submit" className="w-full py-3.5 rounded-xl font-bold text-sm text-[#0A0A0F]" style={{ background: `linear-gradient(135deg, ${TEAL}, #3BC8C8)` }}>
                    {t('accueil.contact.formBouton')}
                  </button>
                </form>
                <p className="text-slate-600 text-xs mt-4">{t('accueil.contact.formMentions')}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const t = useT()
  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm" style={{ background: '#0A0A0F', border: `1.5px solid ${TEAL}`, color: TEAL }}>N</div>
              <span className="font-bold text-white">Newrigen</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">{t('accueil.footer.desc')}</p>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">{t('accueil.footer.servicesLabel')}</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {[t('accueil.footer.s1'), t('accueil.footer.s2'), t('accueil.footer.s3')].map((s, idx) => (
                <li key={idx}><a href="#services" className="hover:text-white transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">{t('accueil.footer.entrepriseLabel')}</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {[['#processus', t('nav.processus')], ['#contact', t('accueil.footer.contactLabel')], ['/tarifs', t('nav.tarifs')]].map(([h, l]) => (
                <li key={h}><a href={h} className="hover:text-white transition-colors">{l}</a></li>
              ))}
              <li><Link to="/mentions-legales" className="hover:text-white transition-colors">{t('legal.mentions')}</Link></li>
              <li><Link to="/confidentialite" className="hover:text-white transition-colors">{t('consent.lien')}</Link></li>
              <li><Link to="/cgv" className="hover:text-white transition-colors">{t('accueil.footer.cgv')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <span>{t('accueil.footer.droits', { annee: 2026 })}</span>
          <span>🇨🇭 {t('accueil.footer.swiss')}</span>
          <div className="ml-auto flex items-center gap-4">
            <a href="https://www.instagram.com/newrigen.app/" target="_blank" rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity" style={{ color: TEAL }} aria-label="Instagram">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61592481936710" target="_blank" rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity" style={{ color: TEAL }} aria-label="Facebook">
              <Facebook className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function Home() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('anim-visible'); obs.unobserve(e.target) } }),
      { threshold: 0.07, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('[data-anim]').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Comparatif />
        <Processus />
        <PacksComparatif />
        <Temoignages />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ConsentGate>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tarifs" element={<Tarifs />} />
          {/* Visite guidée de l'application. Volontairement sans lien depuis
              le site tant qu'elle n'est pas validée : elle reste accessible en
              tapant l'adresse, pour la relire et la corriger. Ne pas supprimer
              en la prenant pour du code mort. */}
          <Route path="/demo" element={<Demo />} />
          <Route path="/merci" element={<Merci />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          <Route path="/cgv" element={<CGV />} />
        </Routes>
      </BrowserRouter>
    </ConsentGate>
  )
}
