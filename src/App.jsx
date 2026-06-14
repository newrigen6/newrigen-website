import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Menu, X, Check, ArrowRight, Zap, Brain, Workflow, LineChart, Star, MapPin, Mail, Phone, ChevronRight } from 'lucide-react'

const TEAL_PACKS = '#4DD9D9'

function PacksComparatif() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div data-anim="up" className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL_PACKS }}>Nos packs</span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4 text-white">Standard vs Premium</h2>
          <p className="text-slate-400">Choisissez le pack adapté à votre entreprise.</p>
        </div>
        <div data-anim="tilt" data-delay="100" className="rounded-2xl border overflow-hidden" style={{ borderColor: `${TEAL_PACKS}20` }}>
          <div className="grid grid-cols-3 text-sm font-semibold" style={{ background: `${TEAL_PACKS}12` }}>
            <div className="p-4 text-slate-300">Fonctionnalité</div>
            <div className="p-4 text-center text-white">Standard<br/><span className="font-normal text-slate-400 text-xs">79.-/mois</span></div>
            <div className="p-4 text-center font-bold" style={{ color: TEAL_PACKS }}>Premium<br/><span className="font-normal text-xs" style={{ color: TEAL_PACKS }}>99.-/mois</span></div>
          </div>
          {[
            ['Dashboard', true, true],
            ['Création de devis (manuel)', true, true],
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
            ['🎙️ Devis Vocal (add-on)', '+ 15.-/mois', '+ 15.-/mois'],
          ].map(([feat, std, prem], i) => (
            <div key={feat} className="grid grid-cols-3 text-sm border-t" style={{ borderColor: `${TEAL_PACKS}10`, background: i % 2 === 0 ? 'transparent' : `${TEAL_PACKS}04` }}>
              <div className="p-4 text-slate-300">{feat}</div>
              <div className="p-4 flex items-center justify-center">
                {typeof std === 'string' ? <span className="text-xs font-medium text-slate-400">{std}</span> : std ? <Check className="w-4 h-4" style={{ color: TEAL_PACKS }} /> : <X className="w-4 h-4 text-slate-600" />}
              </div>
              <div className="p-4 flex items-center justify-center">
                {typeof prem === 'string' ? <span className="text-xs font-medium text-slate-400">{prem}</span> : prem ? <Check className="w-4 h-4" style={{ color: TEAL_PACKS }} /> : <X className="w-4 h-4 text-slate-600" />}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link to="/tarifs" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-[#0A0A0F] transition-all" style={{ background: `linear-gradient(135deg, ${TEAL_PACKS}, #3BC8C8)` }}>
            Voir les tarifs complets →
          </Link>
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
    { href: '#temoignages', label: 'Témoignages' },
    { href: '/tarifs', label: 'Tarifs', route: true },
  ]
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0A0A0F]/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm" style={{ background: '#0A0A0F', border: `1.5px solid ${TEAL}`, color: TEAL }}>N</div>
          <span className="font-bold text-lg tracking-tight text-white">Newrigen</span>
          <span className="text-xs hidden md:inline" style={{ color: `${TEAL}99` }}>Automatisation IA pour les PME suisses</span>
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
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: `${TEAL}15` }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: `${TEAL}10` }} />
      <div className="relative max-w-5xl mx-auto px-6 text-center py-32">
        <div data-anim="up" className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8 border" style={{ background: `${TEAL}10`, borderColor: `${TEAL}30`, color: TEAL }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: TEAL }} />
          Automatisation IA pour les PME suisses
        </div>
        <h1 data-anim="up" data-delay="100" className="text-3xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
          Transformez votre{' '}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${TEAL}, #7ee8e8)` }}>entreprise</span>
          {' '}avec<br />l'intelligence{' '}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, #7ee8e8, ${TEAL})` }}>artificielle</span>
        </h1>
        <p data-anim="up" data-delay="200" className="text-sm text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Newrigen automatise vos processus métier grâce à l'IA — conceptions instantanées, workflows intelligents, intégrations sur mesure. Gagnez du temps, réduisez les coûts et concentrez-vous sur ce qui compte vraiment.
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
  { icon: Zap, title: 'Création de devis', desc: 'Créez vos devis manuellement ou par dictée vocale, et importez vos devis existants. Une fois validé, le devis est envoyé automatiquement par e-mail à votre client.', items: ['Saisie manuelle & vocale', 'Import de devis existants', 'Envoi automatique par e-mail'] },
  { icon: Brain, title: 'Intelligence artificielle', desc: "L'IA analyse votre dictée vocale pour construire un devis, trie votre catalogue de produits intelligemment, et lit vos documents importés comme des factures ou devis existants.", items: ['Devis par dictée vocale', 'Triage intelligent du catalogue', 'Lecture de documents (PDF, Excel)'] },
  { icon: LineChart, title: 'Audit & personnalisation', desc: "En plus de notre application, nous sommes prêts à personnaliser l'expérience selon les besoins propres à votre entreprise. Contactez-nous pour voir dans quelle mesure c'est possible.", items: ['Analyse de vos besoins', 'Personnalisation sur mesure', 'Flexibilité selon votre métier'] },
]

function Services() {
  return (
    <section id="services" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div data-anim="up" className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>Nos services</span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4">Tout ce dont votre PME a besoin</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Des solutions IA clés en main, conçues spécifiquement pour les entreprises suisses.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {services.map(({ icon: Icon, title, desc, items: sItems }, i) => (
            <div key={title} data-anim="up" data-delay={String(i * 150)} className="rounded-2xl p-6 border transition-all duration-200 hover:border-[#4DD9D9]/40 group" style={{ background: `${TEAL}08`, borderColor: `${TEAL}20` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${TEAL}20` }}>
                <Icon className="w-5 h-5" style={{ color: TEAL }} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">{desc}</p>
              <ul className="space-y-2">
                {sItems.map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: TEAL }} />
                    {item}
                  </li>
                ))}
              </ul>
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
      <div className="max-w-4xl mx-auto">
        <div data-anim="up" className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>Comparatif</span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4">Avant vs après Newrigen</h2>
          <p className="text-slate-400">Voyez concrètement l'impact de l'automatisation IA sur votre quotidien.</p>
        </div>
        <div data-anim="tilt" data-delay="100" className="rounded-2xl overflow-hidden border" style={{ borderColor: `${TEAL}20` }}>
          <div className="grid grid-cols-3 text-sm font-semibold" style={{ background: `${TEAL}15` }}>
            <div className="p-4 text-slate-300">Fonctionnalité</div>
            <div className="p-4 text-center text-red-400">✗ Sans Newrigen</div>
            <div className="p-4 text-center" style={{ color: TEAL }}>✓ Avec Newrigen</div>
          </div>
          {rows.map(([feat, before, after], i) => (
            <div key={feat} className={`grid grid-cols-3 text-sm border-t ${i % 2 === 0 ? '' : ''}`} style={{ borderColor: `${TEAL}10`, background: i % 2 === 0 ? 'transparent' : `${TEAL}05` }}>
              <div className="p-4 text-slate-300 font-medium">{feat}</div>
              <div className="p-4 text-center text-slate-500">{before}</div>
              <div className="p-4 text-center font-semibold" style={{ color: TEAL }}>{after}</div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/tarifs" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-[#0A0A0F] text-sm" style={{ background: `linear-gradient(135deg, ${TEAL}, #3BC8C8)` }}>
            Commencer ma transformation <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

const steps = [
  { n: '01', title: 'Inscription & configuration', desc: "Créez votre compte, configurez votre catalogue de produits et ajoutez vos employés. Simple et rapide — on vous accompagne si besoin.", items: ['Création de compte', 'Configuration du catalogue', 'Ajout des employés'] },
  { n: '02', title: 'Utilisation au quotidien', desc: "Créez vos devis, saisissez les heures, gérez la facturation et vos employés — tout depuis une seule interface, partout et à tout moment.", items: ['Devis en quelques minutes', 'Saisie des heures simplifiée', 'Facturation intégrée'] },
  { n: '03', title: 'Vous gagnez du temps', desc: "Les devis partent automatiquement par e-mail, les heures sont suivies en temps réel et la facturation est directement intégrée à votre flux de travail.", items: ['Envoi automatique par e-mail', 'Suivi en temps réel', 'Moins d\'administratif'] },
]

function Processus() {
  return (
    <section id="processus" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div data-anim="up" className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>Notre processus</span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4">Comment ça marche ?</h2>
          <p className="text-slate-400">Un processus simple et transparent, de l'idée au déploiement en quelques semaines.</p>
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
      <div data-anim="scale" className="max-w-2xl mx-auto text-center">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>On est à votre écoute — Réponse au plus vite</span>
        <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4">
          Une expérience <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${TEAL}, #7ee8e8)` }}>sur mesure</span> pour votre entreprise
        </h2>
        <p className="text-slate-400 mb-8">Vous êtes adhérent Newrigen et souhaitez personnaliser votre expérience ? Contactez-nous — nous étudions ensemble ce qui est possible pour votre entreprise. Audit inclus pour nos clients.</p>
        {sent ? (
          <div className="py-6 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: `${TEAL}20` }}>
              <Check className="w-7 h-7" style={{ color: TEAL }} />
            </div>
            <p className="font-semibold text-white text-lg">Message envoyé !</p>
            <p className="text-slate-400 text-sm">Nous vous répondons sous 24h.</p>
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="flex gap-3 max-w-md mx-auto mb-4">
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.ch"
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#4DD9D9]/50"
            />
            <button type="submit" className="px-6 py-3 rounded-xl font-bold text-sm text-[#0A0A0F] flex-shrink-0" style={{ background: `linear-gradient(135deg, ${TEAL}, #3BC8C8)` }}>
              Prendre contact →
            </button>
          </form>
        )}
        <p className="text-slate-500 text-xs mb-10">En soumettant ce formulaire, vous acceptez notre politique de confidentialité. Pas de spam.</p>
        <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-400">
          <a href="mailto:newrigen6@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors"><Mail className="w-4 h-4" style={{ color: TEAL }} />newrigen6@gmail.com</a>
          <a href="tel:+41798733791" className="flex items-center gap-2 hover:text-white transition-colors"><Phone className="w-4 h-4" style={{ color: TEAL }} />079 873 37 91</a>
          <a href="tel:+41793246593" className="flex items-center gap-2 hover:text-white transition-colors"><Phone className="w-4 h-4" style={{ color: TEAL }} />079 324 65 93</a>
          <span className="flex items-center gap-2"><MapPin className="w-4 h-4" style={{ color: TEAL }} />Suisse romande et alémanique</span>
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
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('anim-visible')
        else e.target.classList.remove('anim-visible')
      }),
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
