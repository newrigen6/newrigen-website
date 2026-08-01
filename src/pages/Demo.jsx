import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, Calendar, FileText, Upload, HardHat, Package, ClipboardList,
  Wrench, Calculator, Users, Boxes, Settings, ChevronDown, Search, SlidersHorizontal,
  ChevronsUpDown, Plus, Trash2, X, Send, CheckCircle2, HelpCircle, ArrowLeft,
} from 'lucide-react'

// Reproduction fidèle du vrai visuel de l'application (capture d'écran du
// Dashboard réel : sidebar sombre + contenu clair, cartes plates, vraie
// table de données) — pas une réinterprétation "neumorphique" comme la
// première version.
const C = {
  sidebarBg: '#0A0A10',
  sidebarActive: '#1B1E27',
  sidebarText: '#8A93A6',
  mainBg: '#F5F6F8',
  card: '#FFFFFF',
  border: '#E7E9EE',
  text: '#12141A',
  sub: '#8A93A6',
  teal: '#4DD9D9',
  green: '#16A34A',
  greenBg: '#DCFCE7',
  red: '#DC2626',
  redBg: '#FEE2E2',
}

const NAV = [
  {
    section: 'ACCUEIL', ouvert: true, items: [
      { label: 'Dashboard', icon: LayoutDashboard, actif: true, id: 'dashboard' },
      { label: 'Agenda', icon: Calendar, actif: false },
    ],
  },
  { section: 'DEVIS', items: [{ label: 'Importer', icon: Upload, actif: false }] },
  {
    section: 'CHANTIERS', items: [
      { label: 'Saisie Matériaux', icon: Package, actif: false },
      { label: 'Bons de Régie', icon: ClipboardList, actif: false },
      { label: "Bons d'intervention", icon: Wrench, actif: false },
    ],
  },
  { section: 'COMPTABILITÉ', items: [{ label: 'Comptabilité', icon: Calculator, actif: false }] },
  {
    section: 'GESTION', items: [
      { label: 'Team', icon: Users, actif: false },
      { label: 'Produits', icon: Boxes, actif: false },
      { label: 'Paramètres', icon: Settings, actif: false },
    ],
  },
]

const DEVIS_EXEMPLE = [
  { nature: 'Devis', client: 'Resort Spa', adresse: 'Avenue de la Gare 12', date: '02.06.2026', montant: 282.39, materiaux: 345.92, mainOeuvre: 0, cout: 345.92, margeChf: -63.53, margePct: -22.5, statut: 'En cours' },
  { nature: 'Devis', client: 'Hugo Clair', adresse: 'Rue du Quartier 19', date: '15.04.2026', montant: 20589.18, materiaux: 172.96, mainOeuvre: 120, cout: 292.96, margeChf: 20296.22, margePct: 98.6, statut: 'En cours' },
  { nature: 'Devis', client: 'Müller Sanitaire SA', adresse: 'Chemin des Vignes 4', date: '28.03.2026', montant: 4850, materiaux: 2100, mainOeuvre: 980, cout: 3080, margeChf: 1770, margePct: 36.5, statut: 'Accepté' },
]

function chf(v) {
  return v.toLocaleString('fr-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' CHF'
}

function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 flex-shrink-0" style={{ background: C.sidebarBg }}>
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded flex items-center justify-center font-black text-xs flex-shrink-0" style={{ background: C.teal, color: '#0A0A0F' }}>N</div>
          <span className="font-black text-sm tracking-wide text-white">NEWRIGEN</span>
        </Link>
      </div>

      <div className="mx-4 mb-4 flex items-center justify-between rounded-xl bg-white px-3 py-2.5">
        <span className="font-bold text-sm" style={{ color: C.text }}>T&D</span>
        <ChevronsUpDown className="w-3.5 h-3.5" style={{ color: C.sub }} />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-4">
        {NAV.map(section => (
          <div key={section.section}>
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-[11px] font-bold tracking-wider" style={{ color: section.ouvert ? C.teal : C.sidebarText }}>{section.section}</span>
              <ChevronDown className="w-3 h-3" style={{ color: section.ouvert ? C.teal : C.sidebarText }} />
            </div>
            <div className="space-y-0.5 mt-0.5">
              {section.items.map(item => (
                <div
                  key={item.label}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium"
                  style={item.actif ? { background: C.sidebarActive, color: '#fff' } : { color: C.sidebarText }}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4">
        <Link to="/" className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium" style={{ color: C.sidebarText }}>
          <ArrowLeft className="w-3.5 h-3.5" /> Retour au site
        </Link>
      </div>
    </aside>
  )
}

function StatCard({ label, value, sub, alerte }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs" style={{ color: C.sub }}>{label}</span>
        <span className="text-xs flex-shrink-0" style={{ color: C.sub }}>voir</span>
      </div>
      <p className="text-2xl font-black" style={{ color: alerte ? C.red : C.text }}>{value}</p>
      <p className="text-xs mt-1" style={{ color: C.sub }}>{sub}</p>
    </div>
  )
}

const COLONNES = ['Nature', 'Client', 'Adresse', 'Date', 'Montant', 'Matériaux', "Main d'œuvre", 'Coût total', 'Marge CHF', 'Marge %', 'Statut']

function EcranDashboard() {
  return (
    <>
      <span className="text-xs font-semibold tracking-wider" style={{ color: C.sub }}>RENTABILITÉ</span>
      <h1 className="text-3xl font-black mb-6" style={{ color: C.text }}>Tableau de bord</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Chiffre d'affaires total" value="25 721,57 CHF" sub="Tous devis confondus" />
        <StatCard label="Devis en cours (3)" value="25 721,57 CHF" sub="À facturer" />
        <StatCard label="Marges réelles cumulées" value="22 002,69 CHF" sub="Mat. + main d'œuvre déduits" />
        <StatCard label="Marges sous l'objectif (< 15 %)" value="1 devis" sub="À surveiller" alerte />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 flex items-center gap-2 rounded-xl px-4 py-2.5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: C.sub }} />
          <span className="text-sm" style={{ color: C.sub }}>Rechercher un client…</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <SlidersHorizontal className="w-4 h-4" style={{ color: C.sub }} />
        </div>
        <div className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm" style={{ background: C.card, border: `1px solid ${C.border}`, color: C.sub }}>Tous statuts</div>
        <div className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm" style={{ background: C.card, border: `1px solid ${C.border}`, color: C.sub }}>Toutes marges</div>
      </div>

      <div className="rounded-2xl overflow-hidden mb-2" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {COLONNES.map(c => (
                  <th key={c} className="text-left px-4 py-3 text-[11px] font-bold tracking-wider whitespace-nowrap" style={{ color: C.sub }}>
                    <span className="inline-flex items-center gap-1">{c.toUpperCase()}<ChevronsUpDown className="w-3 h-3" /></span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEVIS_EXEMPLE.map((d, i) => (
                <tr key={i} style={{ borderBottom: i < DEVIS_EXEMPLE.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: C.mainBg, color: C.sub }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.sub }} />{d.nature}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold whitespace-nowrap" style={{ color: C.text }}>{d.client}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: C.sub }}>{d.adresse}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: C.text }}>{d.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: C.text }}>{chf(d.montant)}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: C.text }}>{chf(d.materiaux)}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: C.text }}>{chf(d.mainOeuvre)}</td>
                  <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: C.text }}>{chf(d.cout)}</td>
                  <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: d.margeChf < 0 ? C.red : C.green }}>{chf(d.margeChf)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: d.margePct < 0 ? C.red : C.green, background: d.margePct < 0 ? C.redBg : C.greenBg }}>
                      {d.margePct > 0 ? '+' : ''}{d.margePct}%
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: C.mainBg, color: C.sub }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.teal }} />{d.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs" style={{ color: C.sub }}>{DEVIS_EXEMPLE.length} devis · 0 bons de régie</p>
    </>
  )
}

function EcranNouveauDevis({ onClose }) {
  const [client, setClient] = useState('')
  const [lignes, setLignes] = useState([{ desc: '', qte: 1, prix: 0 }])
  const [envoye, setEnvoye] = useState(false)
  const total = useMemo(() => lignes.reduce((s, l) => s + (Number(l.qte) || 0) * (Number(l.prix) || 0), 0), [lignes])

  function majLigne(i, champ, valeur) {
    setLignes(prev => prev.map((l, idx) => (idx === i ? { ...l, [champ]: valeur } : l)))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(10,10,15,0.5)' }}>
      <div className="w-full max-w-lg rounded-2xl p-6" style={{ background: C.card }}>
        {envoye ? (
          <div className="flex flex-col items-center text-center gap-3 py-6">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: C.greenBg }}>
              <CheckCircle2 className="w-7 h-7" style={{ color: C.green }} />
            </div>
            <p className="font-black text-lg" style={{ color: C.text }}>Devis envoyé ! (démo)</p>
            <p className="text-sm max-w-sm" style={{ color: C.sub }}>
              Dans la vraie application, {client || 'votre client'} recevrait ce devis par e-mail immédiatement, prêt à signer.
            </p>
            <button onClick={onClose} className="mt-2 text-sm font-bold px-5 py-2.5 rounded-xl" style={{ background: C.teal, color: '#0A0A0F' }}>
              Fermer
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-lg" style={{ color: C.text }}>Nouveau devis</h2>
              <button onClick={onClose}><X className="w-5 h-5" style={{ color: C.sub }} /></button>
            </div>

            <label className="block text-xs font-bold mb-1.5" style={{ color: C.sub }}>CLIENT</label>
            <input value={client} onChange={e => setClient(e.target.value)} placeholder="Nom du client"
              className="w-full px-4 py-2.5 rounded-xl text-sm mb-4 focus:outline-none"
              style={{ background: C.mainBg, border: `1px solid ${C.border}`, color: C.text }} />

            <label className="block text-xs font-bold mb-1.5" style={{ color: C.sub }}>LIGNES DU DEVIS</label>
            <div className="space-y-2 mb-3">
              {lignes.map((l, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={l.desc} onChange={e => majLigne(i, 'desc', e.target.value)} placeholder="Description"
                    className="flex-1 min-w-0 px-3 py-2 rounded-xl text-sm focus:outline-none" style={{ background: C.mainBg, border: `1px solid ${C.border}`, color: C.text }} />
                  <input type="number" min="0" value={l.qte} onChange={e => majLigne(i, 'qte', e.target.value)}
                    className="w-14 px-2 py-2 rounded-xl text-sm text-center focus:outline-none" style={{ background: C.mainBg, border: `1px solid ${C.border}`, color: C.text }} />
                  <input type="number" min="0" value={l.prix} onChange={e => majLigne(i, 'prix', e.target.value)} placeholder="Prix"
                    className="w-20 px-2 py-2 rounded-xl text-sm text-right focus:outline-none" style={{ background: C.mainBg, border: `1px solid ${C.border}`, color: C.text }} />
                  {lignes.length > 1 && (
                    <button onClick={() => setLignes(prev => prev.filter((_, idx) => idx !== i))} className="flex-shrink-0">
                      <Trash2 className="w-4 h-4" style={{ color: C.sub }} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => setLignes(prev => [...prev, { desc: '', qte: 1, prix: 0 }])} className="text-xs font-bold flex items-center gap-1.5 mb-5" style={{ color: C.teal }}>
              <Plus className="w-3.5 h-3.5" /> Ajouter une ligne
            </button>

            <div className="flex items-center justify-between rounded-xl px-4 py-3 mb-4" style={{ background: C.mainBg }}>
              <span className="text-sm font-bold" style={{ color: C.sub }}>Total</span>
              <span className="text-xl font-black" style={{ color: C.text }}>{chf(total)}</span>
            </div>

            <button onClick={() => setEnvoye(true)} className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2" style={{ background: C.teal, color: '#0A0A0F' }}>
              <Send className="w-4 h-4" /> Envoyer le devis
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function Demo() {
  const [modalOuvert, setModalOuvert] = useState(false)

  return (
    <div className="min-h-screen flex" style={{ background: C.mainBg }}>
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="px-4 md:px-8 py-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs md:text-sm text-center" style={{ background: C.sidebarBg, color: '#fff' }}>
          <span>🎬 Démonstration avec des données d'exemple — rien n'est enregistré</span>
          <Link to="/tarifs" className="font-bold underline" style={{ color: C.teal }}>
            Essayer gratuitement pendant 30 jours →
          </Link>
        </div>

        <main className="flex-1 p-4 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-1">
            <div />
            <button
              onClick={() => setModalOuvert(true)}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm"
              style={{ background: C.teal, color: '#0A0A0F' }}
            >
              <Plus className="w-4 h-4" /> Nouveau devis
            </button>
          </div>
          <EcranDashboard />
        </main>
      </div>

      <button
        onClick={() => setModalOuvert(true)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-40"
        style={{ background: C.teal, color: '#0A0A0F' }}
        aria-label="Aide"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {modalOuvert && <EcranNouveauDevis onClose={() => setModalOuvert(false)} />}
    </div>
  )
}
