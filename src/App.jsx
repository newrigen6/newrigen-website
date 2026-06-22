import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Menu, X, Check, ArrowRight, Zap, Brain, Workflow, LineChart, Star, MapPin, Mail, Phone, ChevronRight } from 'lucide-react'

const TEAL_PACKS = '#4DD9D9'

const homePlans = [
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

function PacksComparatif() {
  const [interval, setInterval] = useState('mensuel')
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div data-anim="up" className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL_PACKS }}>Nos packs</span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4 text-white">Standard vs Premium</h2>
          <p className="text-slate-400">Choisissez le pack adapté à votre entreprise.</p>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-sm font-semibold" style={{ background: `${TEAL_PACKS}15`, color: TEAL_PACKS, border: `1px solid ${TEAL_PACKS}40` }}>
            <span>🎁</span> 1 mois d'essai gratuit
          </div>
        </div>
        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <button onClick={() => setInterval('mensuel')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${interval === 'mensuel' ? 'text-[#0A0A0F]' : 'text-slate-400 border border-white/10'}`}
            style={interval === 'mensuel' ? { background: `linear-gradient(135deg, ${TEAL_PACKS}, #3BC8C8)` } : {}}>
            Mensuel
            <span className="text-xs px-2 py-0.5 rounded-full font-bold ml-1" style={interval === 'mensuel' ? { background: 'rgba(0,0,0,0.25)', color: '#0A0A0F' } : { background: `${TEAL_PACKS}20`, color: TEAL_PACKS }}>1 mois offert</span>
          </button>
          <button onClick={() => setInterval('annuel')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${interval === 'annuel' ? 'text-[#0A0A0F]' : 'text-slate-400 border border-white/10'}`}
            style={interval === 'annuel' ? { background: `linear-gradient(135deg, ${TEAL_PACKS}, #3BC8C8)` } : {}}>
            Annuel
            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={interval === 'annuel' ? { background: 'rgba(0,0,0,0.25)', color: '#0A0A0F' } : { background: `${TEAL_PACKS}20`, color: TEAL_PACKS }}>1 mois offert</span>
          </button>
        </div>
        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {homePlans.map(plan => (
            <div key={plan.id} className="rounded-2xl p-8 border flex flex-col" style={{
              background: plan.highlight ? `${TEAL_PACKS}08` : `${TEAL_PACKS}04`,
              borderColor: plan.highlight ? TEAL_PACKS : `${TEAL_PACKS}20`,
              boxShadow: plan.highlight ? `0 0 40px ${TEAL_PACKS}15` : 'none',
            }}>
              {plan.highlight && (
                <div className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full self-start mb-4 text-[#0A0A0F]" style={{ background: TEAL_PACKS }}>
                  Recommandé
                </div>
              )}
              <h2 className="text-2xl font-black text-white mb-1">{plan.name}</h2>
              <p className="text-slate-400 text-sm mb-5">{plan.desc}</p>
              <div className="mb-1">
                <span className="text-2xl font-bold line-through text-slate-600 mr-2">
                  {interval === 'annuel' ? plan.priceAnnuel : plan.priceMensuel}.-
                </span>
                <span className="text-sm font-bold px-2 py-0.5 rounded-full text-[#0A0A0F]" style={{ background: TEAL_PACKS }}>1 mois gratuit</span>
              </div>
              <div className="mb-2 mt-1">
                <span className="text-5xl font-black" style={{ color: TEAL_PACKS }}>0.-</span>
                <span className="text-slate-400 text-sm ml-2">le 1er mois</span>
              </div>
              <p className="text-xs text-slate-500 mb-1">Puis {interval === 'annuel' ? plan.priceAnnuel : plan.priceMensuel}.- CHF/{interval === 'annuel' ? 'an' : 'mois'} — {plan.extra}</p>
              <p className="text-xs mb-6" style={{ color: TEAL_PACKS }}>Sans engagement sur 1 mois</p>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
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
                Commencer l'essai gratuit →
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
import ConsentGate from './components/ConsentGate'

const TEAL = '#4DD9D9'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  const links = [
    { href: '#services', label: 'Services' },
    { href: '#comparatif', label: 'Comparatif' },
    { href: '#processus', label: 'Comment ça marche' },
    { href: '/tarifs', label: 'Tarifs', route: true },
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
        <Link to="/tarifs" className="hidden md:block px-5 py-2.5 rounded-xl text-sm font-semibold text-[#0A0A0F] transition-all duration-200 shadow-lg" style={{ background: `linear-gradient(135deg, ${TEAL}, #3BC8C8)`, boxShadow: `0 0 20px ${TEAL}40` }}>
          S'abonner
        </Link>
        <div className="md:hidden flex items-center gap-2">
          <Link to="/tarifs" className="px-4 py-2 rounded-xl text-xs font-semibold text-[#0A0A0F]" style={{ background: `linear-gradient(135deg, ${TEAL}, #3BC8C8)` }}>S'abonner</Link>
          <button className="text-white" onClick={() => setOpen(v => !v)}>{open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-[#0A0A0F]/95 backdrop-blur border-b border-white/10 px-6 py-4 space-y-3">
          {links.map(l => l.route
            ? <Link key={l.href} to={l.href} onClick={() => setOpen(false)} className="block text-slate-300 hover:text-white py-1">{l.label}</Link>
            : <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-slate-300 hover:text-white py-1">{l.label}</a>
          )}
          <Link to="/tarifs" onClick={() => setOpen(false)} className="block text-center py-2.5 rounded-xl font-semibold text-[#0A0A0F]" style={{ background: TEAL }}>S'abonner</Link>
        </div>
      )}
    </nav>
  )
}

function Hero() {
  return (
    <section id="hero" className="relative flex items-center justify-center overflow-hidden pt-24">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: `${TEAL}15` }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: `${TEAL}10` }} />
      <div className="relative max-w-5xl mx-auto px-6 text-center py-16">
        <h1 data-anim="up" data-delay="100" className="text-3xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
          Transformez votre{' '}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${TEAL}, #7ee8e8)` }}>entreprise</span>
          {' '}avec<br />l'intelligence{' '}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, #7ee8e8, ${TEAL})` }}>artificielle</span>
        </h1>
        <p data-anim="up" data-delay="200" className="text-sm text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Centralisez toute votre activité sur une seule plateforme — gagnez des heures sur vos tâches administratives, suivez vos chiffres en temps réel et pilotez votre entreprise depuis une application claire et intuitive.
        </p>
        <div data-anim="up" data-delay="300" className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#contact" className="px-8 py-4 rounded-xl font-bold text-[#0A0A0F] text-sm transition-all duration-200" style={{ background: `linear-gradient(135deg, ${TEAL}, #3BC8C8)`, boxShadow: `0 0 30px ${TEAL}40` }}>
            Demande d'audit
          </a>
        </div>
      </div>
    </section>
  )
}

const services = [
  { icon: LineChart, title: 'Vision claire en temps réel', desc: "Suivez l'activité de votre entreprise à tout moment grâce à des tableaux de bord intuitifs. Chiffres clés, tendances et indicateurs de performance disponibles en un coup d'œil.", items: ['Tableaux de bord en temps réel', 'Indicateurs clés de performance', 'Suivi de l\'activité au quotidien'] },
  { icon: Brain, title: 'Centraliser l\'information', desc: "Regroupez tous vos documents, clients, devis et factures en un seul endroit. Fini les fichiers éparpillés — tout est accessible, organisé et synchronisé depuis une unique plateforme.", items: ['Données clients & documents unifiés', 'Accès centralisé en tout lieu', 'Synchronisation automatique'] },
  { icon: Zap, title: 'Gain de temps', desc: "Automatisez vos tâches administratives répétitives : création de devis, envoi de factures, relances clients. Concentrez-vous sur votre cœur de métier, l'application s'occupe du reste.", items: ['Automatisation des tâches répétitives', 'Envoi automatique par e-mail', 'Relances clients intégrées'] },
]

function Services() {
  return (
    <section id="services" className="py-24 px-6 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${TEAL}08 0%, transparent 70%)` }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div data-anim="up" className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>Nos services</span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4">Tout ce dont votre entreprise a besoin</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Des solutions IA clés en main, conçues pour optimiser votre temps.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {services.map(({ icon: Icon, title, desc, items: sItems }, i) => (
            <div
              key={title}
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
                {sItems.map(item => (
                  <div key={item} className="flex items-center gap-2.5 text-sm">
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

const rows = [
  ['Création de devis', 'Word / Excel — long et répétitif', 'Saisie manuelle, vocale ou import'],
  ['Envoi au client', 'Email manuel à chaque fois', 'Envoi automatique depuis l\'app'],
  ['Catalogue de produits', 'Liste statique, peu pratique', 'Catalogue structuré avec marges et prix'],
  ['Suivi des heures', 'Feuille papier ou Excel', 'Saisie numérique par les employés'],
  ['Facturation', 'Logiciel séparé ou papier', 'Facturation QR suisse intégrée'],
  ['Gestion des employés', 'Tableaux éparpillés', 'Interface centralisée'],
  ['Signature des documents', 'Impression, signature, scan', 'Signature électronique intégrée'],
  ['Bons de régie', 'Papier avec signature client', 'Numérique avec signature client (Premium)'],
]

function Comparatif() {
  return (
    <section id="comparatif" className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <div data-anim="up" className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>Comparatif</span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4">Travaillez autrement.</h2>
          <p className="text-slate-400">Découvrez ce que vos concurrents font déjà différemment.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Colonne SANS */}
          <div data-anim="up" data-delay="100" className="rounded-2xl border border-red-500/20 overflow-hidden" style={{ background: 'rgba(239,68,68,0.04)' }}>
            <div className="flex items-center gap-3 px-6 py-4 border-b border-red-500/20" style={{ background: 'rgba(239,68,68,0.08)' }}>
              <span className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold text-sm">✗</span>
              <span className="font-bold text-red-400 text-sm uppercase tracking-widest">Sans Newrigen</span>
            </div>
            <ul className="divide-y divide-red-500/10">
              {rows.map(([feat, before]) => (
                <li key={feat} className="px-5 py-2.5">
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
              <span className="font-bold text-sm uppercase tracking-widest" style={{ color: TEAL }}>Avec Newrigen</span>
            </div>
            <ul className="divide-y" style={{ borderColor: `${TEAL}10` }}>
              {rows.map(([feat, , after]) => (
                <li key={feat} className="px-5 py-2.5" style={{ borderColor: `${TEAL}10` }}>
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

const steps = [
  { n: '01', title: 'Inscription', desc: "Choisissez l'offre adaptée à vos besoins et créez votre compte en quelques minutes. Nous vous guidons pour démarrer sur les bonnes bases.", items: ['Choix de l\'offre', 'Création du compte', 'Accompagnement personnalisé'] },
  { n: '02', title: 'Configuration', desc: "Paramétrez votre espace de travail : ajoutez vos employés, configurez vos signatures électroniques, votre catalogue et vos préférences.", items: ['Ajout des employés', 'Signatures électroniques', 'Catalogue & préférences'] },
  { n: '03', title: 'Gain de temps', desc: "En saisissant vos données une seule fois, vous pouvez générer en quelques secondes des PDF prêts à l'envoi — devis, factures et rapports.", items: ['Export PDF prêt à l\'envoi', 'Mise en page professionnelle', 'Moins de ressaisie'] },
]

function Processus() {
  return (
    <section id="processus" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div data-anim="up" className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>Notre processus</span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4">Opérationnel en 3 étapes.</h2>
          <p className="text-slate-400">Une mise en place rapide, sans prise de tête.</p>
        </div>
        <div className="space-y-6">
          {steps.map(({ n, title, desc, items }, i) => (
            <div key={n} data-anim="up" data-delay={String(i * 200)} className="flex gap-6 rounded-2xl p-6 border" style={{ background: `${TEAL}06`, borderColor: `${TEAL}18` }}>
              <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm" style={{ background: `${TEAL}20`, color: TEAL }}>
                {n}
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold uppercase tracking-widest mb-1 block" style={{ color: `${TEAL}80` }}>ÉTAPE {n}</span>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm mb-3 leading-relaxed">{desc}</p>
                <ul className="flex flex-wrap gap-2">
                  {items.map(item => (
                    <li key={item} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full" style={{ background: `${TEAL}12`, color: TEAL }}>
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

function Temoignages() { return null }

function Contact() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-5 gap-6 items-stretch">
          {/* Carte infos — 2/5 */}
          <div className="md:col-span-2 rounded-2xl p-8 flex flex-col justify-between" style={{ background: `${TEAL}10`, border: `1px solid ${TEAL}25` }}>
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>Réponse au plus vite</span>
              <h2 className="text-2xl font-black mt-3 mb-3 text-white leading-snug">
                Une expérience <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${TEAL}, #7ee8e8)` }}>sur mesure</span> pour votre entreprise
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">Vous êtes adhérent Newrigen et souhaitez personnaliser votre expérience ? Nous étudions ensemble ce qui est possible. Audit inclus pour nos clients.</p>
            </div>
            <div className="mt-8 space-y-3 text-sm">
              <a href="mailto:newrigen6@gmail.com" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: TEAL }} />newrigen6@gmail.com
              </a>
              <a href="tel:+41798733791" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: TEAL }} />079 873 37 91
              </a>
              <a href="tel:+41793246593" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: TEAL }} />079 324 65 93
              </a>
              <span className="flex items-center gap-3 text-slate-300">
                <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: TEAL }} />Suisse romande et alémanique
              </span>
            </div>
          </div>
          {/* Carte formulaire — 3/5 */}
          <div className="md:col-span-3 rounded-2xl p-8 flex flex-col justify-center" style={{ background: '#0F1318', border: '1px solid rgba(255,255,255,0.06)' }}>
            {sent ? (
              <div className="flex flex-col items-center gap-4 text-center py-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: `${TEAL}20` }}>
                  <Check className="w-8 h-8" style={{ color: TEAL }} />
                </div>
                <p className="font-bold text-white text-xl">Message envoyé !</p>
                <p className="text-slate-400 text-sm">Nous vous répondons sous 24h.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-black text-white mb-1">Prendre contact</h3>
                <p className="text-slate-400 text-sm mb-8">Entrez votre email et nous vous recontactons rapidement.</p>
                <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="space-y-3">
                  <input
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="votre@email.ch"
                    className="w-full px-4 py-3.5 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                  <button type="submit" className="w-full py-3.5 rounded-xl font-bold text-sm text-[#0A0A0F]" style={{ background: `linear-gradient(135deg, ${TEAL}, #3BC8C8)` }}>
                    Prendre contact →
                  </button>
                </form>
                <p className="text-slate-600 text-xs mt-4">En soumettant ce formulaire, vous acceptez notre politique de confidentialité. Pas de spam.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm" style={{ background: '#0A0A0F', border: `1.5px solid ${TEAL}`, color: TEAL }}>N</div>
              <span className="font-bold text-white">Newrigen</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">Agence d'automatisation IA spécialisée pour les PME suisses. Nous transformons vos processus métier grâce à l'intelligence artificielle.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Services</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {['Création de devis', 'Intelligence artificielle', 'Audit & personnalisation'].map(s => (
                <li key={s}><a href="#services" className="hover:text-white transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Entreprise</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {[['#processus', 'Comment ça marche'], ['#contact', 'Contact'], ['/tarifs', 'Tarifs']].map(([h, l]) => (
                <li key={l}><a href={h} className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <span>© 2026 Newrigen. Tous droits réservés. · Siège social en Suisse</span>
          <span>🇨🇭 Fabriqué en Suisse</span>
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
        <Temoignages />
        <PacksComparatif />
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
          <Route path="/merci" element={<Merci />} />
        </Routes>
      </BrowserRouter>
    </ConsentGate>
  )
}
