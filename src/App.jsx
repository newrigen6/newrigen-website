import { useState, useEffect } from 'react'
import { Menu, X, Check, ArrowRight, Zap, Brain, Workflow, LineChart, Star, MapPin, Mail, Phone, ChevronRight } from 'lucide-react'

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
  ]
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0A0A0F]/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: `linear-gradient(135deg, ${TEAL}, #3BC8C8)` }}>N</div>
          <span className="font-bold text-lg tracking-tight text-white">Newrigen</span>
          <span className="text-xs hidden md:inline" style={{ color: `${TEAL}99` }}>Automatisation IA pour les PME suisses</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => <a key={l.href} href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors font-medium">{l.label}</a>)}
        </div>
        <a href="#contact" className="hidden md:block px-5 py-2.5 rounded-xl text-sm font-semibold text-[#0A0A0F] transition-all duration-200 shadow-lg" style={{ background: `linear-gradient(135deg, ${TEAL}, #3BC8C8)`, boxShadow: `0 0 20px ${TEAL}40` }}>
          Demander un devis
        </a>
        <button className="md:hidden text-white" onClick={() => setOpen(v => !v)}>{open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
      </div>
      {open && (
        <div className="md:hidden bg-[#0A0A0F]/95 backdrop-blur border-b border-white/10 px-6 py-4 space-y-3">
          {links.map(l => <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-slate-300 hover:text-white py-1">{l.label}</a>)}
          <a href="#contact" onClick={() => setOpen(false)} className="block text-center py-2.5 rounded-xl font-semibold text-[#0A0A0F]" style={{ background: TEAL }}>Demander un devis</a>
        </div>
      )}
    </nav>
  )
}

function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: `${TEAL}15` }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: `${TEAL}10` }} />
      <div className="relative max-w-5xl mx-auto px-6 text-center py-32">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8 border" style={{ background: `${TEAL}10`, borderColor: `${TEAL}30`, color: TEAL }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: TEAL }} />
          Automatisation IA pour les PME suisses
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
          Transformez votre{' '}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${TEAL}, #7ee8e8)` }}>entreprise</span>
          {' '}avec<br />l'intelligence{' '}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, #7ee8e8, ${TEAL})` }}>artificielle</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Newrigen automatise vos processus métier grâce à l'IA — conceptions instantanées, workflows intelligents, intégrations sur mesure. Gagnez du temps, réduisez les coûts et concentrez-vous sur ce qui compte vraiment.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a href="#contact" className="px-8 py-4 rounded-xl font-bold text-[#0A0A0F] text-sm transition-all duration-200" style={{ background: `linear-gradient(135deg, ${TEAL}, #3BC8C8)`, boxShadow: `0 0 30px ${TEAL}40` }}>
            Demander un devis gratuit
          </a>
          <a href="#services" className="px-8 py-4 rounded-xl font-semibold text-white text-sm border border-white/20 hover:border-white/40 transition-all duration-200 flex items-center justify-center gap-2">
            Voir nos services <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-center">
          {[['60%', 'Économies de temps'], ['100%', 'Fabriqué en Suisse'], ['+20', 'PME accompagnées']].map(([v, l]) => (
            <div key={l}>
              <div className="text-3xl font-black" style={{ color: TEAL }}>{v}</div>
              <div className="text-xs text-slate-400 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const services = [
  { icon: Zap, title: 'Automatisation de devis', desc: 'Générez des devis professionnels en quelques secondes grâce à nos agents IA. Plus besoin de saisie manuelle.', items: ['Génération instantanée', 'Modèles personnalisés', 'Export PDF automatique'] },
  { icon: Brain, title: 'Intégration IA', desc: "Connectez l'intelligence artificielle à vos outils existants — CRM, ERP, comptabilité. Une intégration fluide et rapide.", items: ['Connexion CRM/ERP', 'API sur mesure', 'Formation incluse'] },
  { icon: Workflow, title: 'Flux de travail n8n', desc: 'Automatisez vos tâches répétitives avec des workflows puissants. Relances clients, synchronisation de données.', items: ['Workflows no-code', 'Relances automatiques', 'Synchronisation temps réel'] },
  { icon: LineChart, title: 'Conseil numérique', desc: "Un accompagnement stratégique pour identifier les opportunités d'automatisation dans votre entreprise.", items: ['Audit gratuit', 'Feuille de route', 'Suivi mensuel'] },
]

function Services() {
  return (
    <section id="services" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>Nos services</span>
          <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">Tout ce dont votre PME a besoin</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Des solutions IA clés en main, conçues spécifiquement pour les entreprises suisses.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {services.map(({ icon: Icon, title, desc, items }) => (
            <div key={title} className="rounded-2xl p-6 border transition-all duration-200 hover:border-[#4DD9D9]/40 group" style={{ background: `${TEAL}08`, borderColor: `${TEAL}20` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${TEAL}20` }}>
                <Icon className="w-5 h-5" style={{ color: TEAL }} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">{desc}</p>
              <ul className="space-y-2">
                {items.map(item => (
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
  ['Temps de traitement des devis', '2-3 jours', 'Moins de 5 minutes'],
  ['Erreurs de saisie manuelle', 'Fréquentes', 'Quasi nulles'],
  ['Disponibilité du service', 'Heures de bureau', '24h/24, 7j/7'],
  ['Coût des processus administratifs', 'Élevé', 'Réduit de 60%'],
  ['Relances clients automatiques', 'Manuelle', 'Automatique'],
  ['Intégration CRM/ERP', 'Manuelle', 'Automatique'],
  ['Rapports et tableaux de bord', 'Manuels', 'Temps réel'],
  ['Scalabilité', 'Limitée par les RH', 'Illimitée'],
]

function Comparatif() {
  return (
    <section id="comparatif" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>Comparatif</span>
          <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">Avant vs après Newrigen</h2>
          <p className="text-slate-400">Voyez concrètement l'impact de l'automatisation IA sur votre quotidien.</p>
        </div>
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: `${TEAL}20` }}>
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
          <a href="#contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-[#0A0A0F] text-sm" style={{ background: `linear-gradient(135deg, ${TEAL}, #3BC8C8)` }}>
            Commencer ma transformation <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

const steps = [
  { n: '01', title: 'Audit et analyse', desc: "Nous commençons par un audit gratuit de vos processus métier pour identifier les tâches chronophages et les opportunités d'automatisation.", items: ["Analyse des processus existants", "Identification des gains potentiels", "Rapport d'audit détaillé"] },
  { n: '02', title: 'Conception et développement', desc: "Nos experts conçoivent et développent vos automatisations sur mesure — workflows n8n, agents IA, intégrations API.", items: ['Développement sur mesure', 'Tests et validations', 'Documentation complète'] },
  { n: '03', title: 'Déploiement et suivi', desc: "Mise en production progressive, formation de vos équipes et suivi continu. Vous gardez le contrôle, nous gérons la technique.", items: ['Déploiement progressif', 'Formation des équipes', 'Support mensuel inclus'] },
]

function Processus() {
  return (
    <section id="processus" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>Notre processus</span>
          <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">Comment ça marche ?</h2>
          <p className="text-slate-400">Un processus simple et transparent, de l'idée au déploiement en quelques semaines.</p>
        </div>
        <div className="space-y-6">
          {steps.map(({ n, title, desc, items }) => (
            <div key={n} className="flex gap-6 rounded-2xl p-6 border" style={{ background: `${TEAL}06`, borderColor: `${TEAL}18` }}>
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

const testimonials = [
  { text: 'Newrigen a automatisé notre processus de conception en totalité. Ce qui prenait 2 jours se fait maintenant en 5 minutes. ROI incroyable dès le premier mois.', name: 'Sophie Müller', role: 'Directrice, Müller Sanitaire SA', city: 'Genève' },
  { text: "Les workflows n8n qu'ils ont mis en place ont éliminé 90% de nos tâches administratives répétitives. Notre équipe peut enfin se concentrer sur la vraie valeur ajoutée.", name: 'Pierre Favre', role: 'Fondateur, Favre Construction', city: 'Lausanne' },
  { text: "Service irréprochable, équipe réactive et solutions qui fonctionnent vraiment. Notre intégration CRM est parfaite. Je recommande à tous les chefs d'entreprise suisses.", name: 'Anna Keller', role: 'CEO, Keller Traiteur', city: 'Zurich' },
]

function Temoignages() {
  return (
    <section id="temoignages" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>Témoignages</span>
          <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">Ce que disent nos clients</h2>
          <p className="text-slate-400">Des PME suisses qui ont déjà franchi le cap de l'automatisation IA.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {testimonials.map(({ text, name, role, city }) => (
            <div key={name} className="rounded-2xl p-6 border flex flex-col" style={{ background: `${TEAL}06`, borderColor: `${TEAL}18` }}>
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" style={{ color: TEAL }} />)}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-4">"{text}"</p>
              <div>
                <p className="font-semibold text-white text-sm">{name}</p>
                <p className="text-slate-500 text-xs">{role}</p>
                <p className="text-xs mt-1 flex items-center gap-1" style={{ color: TEAL }}><MapPin className="w-3 h-3" />{city}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
          {['🇨🇭 Basé en Suisse', '🔒 Conforme au RGPD', '⚡ Assistance réactive', '💼 +20 PME accompagnées'].map(b => (
            <span key={b} className="px-4 py-2 rounded-full border" style={{ borderColor: `${TEAL}20`, background: `${TEAL}08` }}>{b}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>Audit gratuit — Réponse sous 24h</span>
        <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">
          Prêt à automatiser votre <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${TEAL}, #7ee8e8)` }}>entreprise ?</span>
        </h2>
        <p className="text-slate-400 mb-8">Rejoignez les PME suisses qui font confiance à Newrigen. Offre d'audit gratuit sans engagement.</p>
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
          <a href="mailto:contact@newrigen.ch" className="flex items-center gap-2 hover:text-white transition-colors"><Mail className="w-4 h-4" style={{ color: TEAL }} />contact@newrigen.ch</a>
          <span className="flex items-center gap-2"><Phone className="w-4 h-4" style={{ color: TEAL }} />+41 XX XXX XX XX</span>
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
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-[#0A0A0F]" style={{ background: TEAL }}>N</div>
              <span className="font-bold text-white">Newrigen</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">Agence d'automatisation IA spécialisée pour les PME suisses. Nous transformons vos processus métier grâce à l'intelligence artificielle.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Services</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {['Automatisation de devis', 'Intégration IA', 'Flux de travail n8n', 'Conseil numérique'].map(s => (
                <li key={s}><a href="#services" className="hover:text-white transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Entreprise</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {[['#processus', 'Notre processus'], ['#temoignages', 'Témoignages'], ['#contact', 'Contact']].map(([h, l]) => (
                <li key={l}><a href={h} className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <span>© 2026 Newrigen. Tous droits réservés. · Siège social en Suisse</span>
          <span>🇨🇭 Fabriqué en Suisse · TVA CHE-XXX.XXX.XXX</span>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Comparatif />
        <Processus />
        <Temoignages />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
