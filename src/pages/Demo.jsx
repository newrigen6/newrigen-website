import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, Calendar, Upload, Package, ClipboardList, Wrench, Calculator,
  Users, Boxes, Settings, ChevronDown, Search, SlidersHorizontal, ChevronsUpDown,
  Plus, X, Send, CheckCircle2, HelpCircle, ArrowLeft, FileUp, UserPlus, Bell, Shield,
} from 'lucide-react'

// Reproduction fidele du vrai visuel de l'application (capture d'ecran du
// Dashboard reel : sidebar sombre + contenu clair, cartes plates, vraie
// table de donnees). Toute la navigation est cliquable, mais aucun champ
// n'est modifiable nulle part : c'est une visite guidee, pas un vrai
// formulaire — rien ne peut jamais etre saisi ni enregistre.
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
  { section: 'ACCUEIL', items: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
  ] },
  { section: 'DEVIS', items: [
    { id: 'importer', label: 'Importer', icon: Upload },
  ] },
  { section: 'CHANTIERS', items: [
    { id: 'materiaux', label: 'Saisie Matériaux', icon: Package },
    { id: 'regie', label: 'Bons de Régie', icon: ClipboardList },
    { id: 'intervention', label: "Bons d'intervention", icon: Wrench },
  ] },
  { section: 'COMPTABILITÉ', items: [
    { id: 'compta', label: 'Comptabilité', icon: Calculator },
  ] },
  { section: 'GESTION', items: [
    { id: 'team', label: 'Team', icon: Users },
    { id: 'produits', label: 'Produits', icon: Boxes },
    { id: 'parametres', label: 'Paramètres', icon: Settings },
  ] },
]

const DEVIS_EXEMPLE = [
  { nature: 'Devis', client: 'Resort Spa', adresse: 'Avenue de la Gare 12', date: '02.06.2026', montant: 282.39, materiaux: 345.92, mainOeuvre: 0, cout: 345.92, margeChf: -63.53, margePct: -22.5, statut: 'En cours' },
  { nature: 'Devis', client: 'Hugo Clair', adresse: 'Rue du Quartier 19', date: '15.04.2026', montant: 20589.18, materiaux: 172.96, mainOeuvre: 120, cout: 292.96, margeChf: 20296.22, margePct: 98.6, statut: 'En cours' },
  { nature: 'Devis', client: 'Müller Sanitaire SA', adresse: 'Chemin des Vignes 4', date: '28.03.2026', montant: 4850, materiaux: 2100, mainOeuvre: 980, cout: 3080, margeChf: 1770, margePct: 36.5, statut: 'Accepté' },
]

function chf(v) {
  return v.toLocaleString('fr-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' CHF'
}

// ── Petits blocs réutilisés par les écrans "aperçu" ─────────────────────────
function Carte({ children, className = '' }) {
  return <div className={`rounded-2xl p-5 ${className}`} style={{ background: C.card, border: `1px solid ${C.border}` }}>{children}</div>
}
function Entete({ eyebrow, titre }) {
  return (
    <>
      <span className="text-xs font-semibold tracking-wider" style={{ color: C.sub }}>{eyebrow}</span>
      <h1 className="text-3xl font-black mb-6" style={{ color: C.text }}>{titre}</h1>
    </>
  )
}
function Ligne({ titre, sous, droite, badge }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
      <div className="min-w-0">
        <p className="text-sm font-bold truncate" style={{ color: C.text }}>{titre}</p>
        {sous && <p className="text-xs" style={{ color: C.sub }}>{sous}</p>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {badge && <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: C.mainBg, color: C.sub }}>{badge}</span>}
        {droite && <span className="text-sm font-semibold" style={{ color: C.text }}>{droite}</span>}
      </div>
    </div>
  )
}
function Bouton({ children, onClick, primaire }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2.5 rounded-xl font-bold text-sm flex-shrink-0"
      style={primaire ? { background: C.teal, color: '#0A0A0F' } : { background: C.card, color: C.text, border: `1px solid ${C.border}` }}
    >
      {children}
    </button>
  )
}

// ── Écrans ───────────────────────────────────────────────────────────────
function EcranDashboard({ onNouveauDevis }) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <Entete eyebrow="RENTABILITÉ" titre="Tableau de bord" />
        <Bouton primaire onClick={onNouveauDevis}><span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Nouveau devis</span></Bouton>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Chiffre d'affaires total", value: '25 721,57 CHF', sub: 'Tous devis confondus' },
          { label: 'Devis en cours (3)', value: '25 721,57 CHF', sub: 'À facturer' },
          { label: 'Marges réelles cumulées', value: '22 002,69 CHF', sub: "Mat. + main d'œuvre déduits" },
          { label: 'Marges sous l’objectif (< 15 %)', value: '1 devis', sub: 'À surveiller', alerte: true },
        ].map(s => (
          <Carte key={s.label}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs" style={{ color: C.sub }}>{s.label}</span>
              <button className="text-xs flex-shrink-0 hover:underline" style={{ color: C.sub }}>voir</button>
            </div>
            <p className="text-2xl font-black" style={{ color: s.alerte ? C.red : C.text }}>{s.value}</p>
            <p className="text-xs mt-1" style={{ color: C.sub }}>{s.sub}</p>
          </Carte>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 flex items-center gap-2 rounded-xl px-4 py-2.5 cursor-text" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: C.sub }} />
          <span className="text-sm" style={{ color: C.sub }}>Rechercher un client…</span>
        </div>
        <button className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <SlidersHorizontal className="w-4 h-4" style={{ color: C.sub }} />
        </button>
        <button className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm" style={{ background: C.card, border: `1px solid ${C.border}`, color: C.sub }}>Tous statuts</button>
        <button className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm" style={{ background: C.card, border: `1px solid ${C.border}`, color: C.sub }}>Toutes marges</button>
      </div>

      <div className="rounded-2xl overflow-hidden mb-2" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {['Nature', 'Client', 'Adresse', 'Date', 'Montant', 'Matériaux', "Main d'œuvre", 'Coût total', 'Marge CHF', 'Marge %', 'Statut'].map(c => (
                  <th key={c} className="text-left px-4 py-3 text-[11px] font-bold tracking-wider whitespace-nowrap cursor-pointer select-none" style={{ color: C.sub }}>
                    <span className="inline-flex items-center gap-1">{c.toUpperCase()}<ChevronsUpDown className="w-3 h-3" /></span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEVIS_EXEMPLE.map((d, i) => (
                <tr key={i} className="cursor-pointer hover:bg-black/[0.02]" style={{ borderBottom: i < DEVIS_EXEMPLE.length - 1 ? `1px solid ${C.border}` : 'none' }}>
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

function EcranAgenda() {
  const jours = ['Lun 3', 'Mar 4', 'Mer 5', 'Jeu 6', 'Ven 7']
  const rdv = { 'Lun 3': ['08:00 Resort Spa — pose carrelage'], 'Mer 5': ['10:30 Hugo Clair — devis sur place'], 'Ven 7': ['14:00 Müller Sanitaire — visite chantier'] }
  return (
    <>
      <Entete eyebrow="PLANNING" titre="Agenda" />
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {jours.map(j => (
          <Carte key={j} className="min-h-[140px]">
            <p className="text-xs font-bold mb-3" style={{ color: C.sub }}>{j.toUpperCase()}</p>
            <div className="space-y-2">
              {(rdv[j] || []).map(r => (
                <div key={r} className="text-xs font-medium px-2.5 py-2 rounded-lg cursor-pointer" style={{ background: `${C.teal}15`, color: C.text }}>{r}</div>
              ))}
            </div>
          </Carte>
        ))}
      </div>
    </>
  )
}

function EcranImporter() {
  return (
    <>
      <Entete eyebrow="DEVIS" titre="Importer" />
      <Carte className="flex flex-col items-center justify-center text-center py-14 mb-6 cursor-pointer">
        <FileUp className="w-8 h-8 mb-3" style={{ color: C.teal }} />
        <p className="font-bold text-sm mb-1" style={{ color: C.text }}>Glissez vos devis existants ici</p>
        <p className="text-xs" style={{ color: C.sub }}>Excel, PDF — l'IA extrait automatiquement les lignes</p>
      </Carte>
      <Carte>
        <p className="text-sm font-bold mb-1" style={{ color: C.text }}>Récemment importés</p>
        <Ligne titre="devis_favre_construction.pdf" sous="Importé le 29.07.2026" badge="Traité" />
        <Ligne titre="catalogue_2026.xlsx" sous="Importé le 12.07.2026" badge="Traité" />
      </Carte>
    </>
  )
}

function EcranMateriaux() {
  return (
    <>
      <Entete eyebrow="CHANTIERS" titre="Saisie Matériaux" />
      <Carte>
        <Ligne titre="Carrelage grès cérame 60×60" sous="Resort Spa · 42 m²" droite="1 260.- CHF" />
        <Ligne titre="Colle carrelage 25kg" sous="Resort Spa · 8 sacs" droite="184.- CHF" />
        <Ligne titre="Robinetterie mitigeur" sous="Hugo Clair · 3 unités" droite="540.- CHF" />
      </Carte>
    </>
  )
}

function EcranRegie() {
  return (
    <>
      <Entete eyebrow="CHANTIERS" titre="Bons de Régie" />
      <Carte>
        <Ligne titre="Resort Spa" sous="4h30 · Signé par le client" badge="Clôturé" />
        <Ligne titre="Hugo Clair" sous="2h15 · En attente de signature" badge="En cours" />
      </Carte>
    </>
  )
}

function EcranIntervention() {
  return (
    <>
      <Entete eyebrow="CHANTIERS" titre="Bons d'intervention" />
      <Carte>
        <Ligne titre="Fuite robinetterie — Hugo Clair" sous="Intervention urgente · 15.04.2026" badge="Terminé" />
        <Ligne titre="Contrôle chaudière — Müller Sanitaire" sous="Planifiée · 08.08.2026" badge="À venir" />
      </Carte>
    </>
  )
}

function EcranCompta() {
  return (
    <>
      <Entete eyebrow="FINANCES" titre="Comptabilité" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Carte><span className="text-xs" style={{ color: C.sub }}>CA facturé (2026)</span><p className="text-2xl font-black mt-2" style={{ color: C.text }}>184 320.- CHF</p></Carte>
        <Carte><span className="text-xs" style={{ color: C.sub }}>TVA due</span><p className="text-2xl font-black mt-2" style={{ color: C.text }}>14 205.- CHF</p></Carte>
        <Carte><span className="text-xs" style={{ color: C.sub }}>Factures impayées</span><p className="text-2xl font-black mt-2" style={{ color: C.red }}>3</p></Carte>
      </div>
      <Carte>
        <Ligne titre="Facture #2026-041 — Resort Spa" sous="Échéance 15.08.2026" badge="Payée" droite="4 850.- CHF" />
        <Ligne titre="Facture #2026-042 — Hugo Clair" sous="Échéance 22.08.2026" badge="En attente" droite="20 589.- CHF" />
      </Carte>
    </>
  )
}

function EcranTeam() {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <Entete eyebrow="GESTION" titre="Team" />
        <Bouton><span className="flex items-center gap-2"><UserPlus className="w-4 h-4" /> Inviter</span></Bouton>
      </div>
      <Carte>
        {[{ n: 'Tiago D.', r: 'Administrateur' }, { n: 'Sophie M.', r: 'Employée' }, { n: 'Pierre F.', r: 'Employé' }].map(p => (
          <div key={p.n} className="flex items-center gap-3 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: `${C.teal}20`, color: C.text }}>
              {p.n.split(' ').map(x => x[0]).join('')}
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: C.text }}>{p.n}</p>
              <p className="text-xs" style={{ color: C.sub }}>{p.r}</p>
            </div>
          </div>
        ))}
      </Carte>
    </>
  )
}

function EcranProduits() {
  return (
    <>
      <Entete eyebrow="GESTION" titre="Produits" />
      <Carte>
        <Ligne titre="Carrelage grès cérame 60×60" sous="Matériau" droite="30.- CHF/m²" />
        <Ligne titre="Mitigeur cuisine" sous="Robinetterie" droite="180.- CHF" />
        <Ligne titre="Heure main d'œuvre" sous="Service" droite="85.- CHF/h" />
      </Carte>
    </>
  )
}

function EcranParametres() {
  return (
    <>
      <Entete eyebrow="GESTION" titre="Paramètres" />
      <Carte className="mb-4">
        <p className="text-sm font-bold mb-3" style={{ color: C.text }}>Notifications</p>
        {[{ icon: Bell, label: 'Alerte marge sous objectif' }, { icon: Shield, label: 'Connexions suspectes' }].map(o => (
          <div key={o.label} className="flex items-center justify-between py-2.5" style={{ borderBottom: `1px solid ${C.border}` }}>
            <span className="flex items-center gap-2.5 text-sm" style={{ color: C.text }}><o.icon className="w-4 h-4" style={{ color: C.sub }} />{o.label}</span>
            <div className="w-9 h-5 rounded-full flex items-center px-0.5 cursor-pointer" style={{ background: C.teal }}>
              <div className="w-4 h-4 rounded-full bg-white ml-auto" />
            </div>
          </div>
        ))}
      </Carte>
      <Carte>
        <p className="text-sm font-bold mb-1" style={{ color: C.text }}>Signature électronique</p>
        <p className="text-xs" style={{ color: C.sub }}>Utilisée automatiquement sur vos devis et bons de régie.</p>
      </Carte>
    </>
  )
}

const ECRANS = {
  dashboard: EcranDashboard, agenda: EcranAgenda, importer: EcranImporter, materiaux: EcranMateriaux,
  regie: EcranRegie, intervention: EcranIntervention, compta: EcranCompta, team: EcranTeam,
  produits: EcranProduits, parametres: EcranParametres,
}

// ── Aperçu "Nouveau devis" : lecture seule, rien n'est saisissable ──────────
function ApercuNouveauDevis({ onClose }) {
  const [envoye, setEnvoye] = useState(false)
  const lignes = [
    { desc: 'Carrelage grès cérame 60×60', qte: 42, prix: 30 },
    { desc: "Pose et main d'œuvre", qte: 8, prix: 85 },
  ]
  const total = lignes.reduce((s, l) => s + l.qte * l.prix, 0)

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
              Dans la vraie application, le client recevrait ce devis par e-mail immédiatement, prêt à signer.
            </p>
            <Bouton primaire onClick={onClose}>Fermer</Bouton>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-black text-lg" style={{ color: C.text }}>Nouveau devis</h2>
              <button onClick={onClose}><X className="w-5 h-5" style={{ color: C.sub }} /></button>
            </div>
            <p className="text-xs mb-5" style={{ color: C.sub }}>Aperçu — dans l'application, ce formulaire se remplit librement.</p>

            <label className="block text-xs font-bold mb-1.5" style={{ color: C.sub }}>CLIENT</label>
            <div className="w-full px-4 py-2.5 rounded-xl text-sm mb-4" style={{ background: C.mainBg, border: `1px solid ${C.border}`, color: C.text }}>
              Resort Spa
            </div>

            <label className="block text-xs font-bold mb-1.5" style={{ color: C.sub }}>LIGNES DU DEVIS</label>
            <div className="space-y-2 mb-4">
              {lignes.map(l => (
                <div key={l.desc} className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl" style={{ background: C.mainBg, border: `1px solid ${C.border}` }}>
                  <span className="flex-1 truncate" style={{ color: C.text }}>{l.desc}</span>
                  <span style={{ color: C.sub }}>{l.qte} ×</span>
                  <span className="font-semibold" style={{ color: C.text }}>{l.prix}.-</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between rounded-xl px-4 py-3 mb-5" style={{ background: C.mainBg }}>
              <span className="text-sm font-bold" style={{ color: C.sub }}>Total</span>
              <span className="text-xl font-black" style={{ color: C.text }}>{chf(total)}</span>
            </div>

            <Bouton primaire onClick={() => setEnvoye(true)}>
              <span className="flex items-center justify-center gap-2 w-full"><Send className="w-4 h-4" /> Envoyer le devis</span>
            </Bouton>
          </>
        )}
      </div>
    </div>
  )
}

export default function Demo() {
  const [ecran, setEcran] = useState('dashboard')
  const [modalOuvert, setModalOuvert] = useState(false)
  const Ecran = ECRANS[ecran]

  return (
    <div className="min-h-screen flex" style={{ background: C.mainBg }}>
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0" style={{ background: C.sidebarBg }}>
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center font-black text-xs flex-shrink-0" style={{ background: C.teal, color: '#0A0A0F' }}>N</div>
            <span className="font-black text-sm tracking-wide text-white">NEWRIGEN</span>
          </Link>
        </div>

        <div className="mx-4 mb-4 flex items-center justify-between rounded-xl bg-white px-3 py-2.5 cursor-pointer">
          <span className="font-bold text-sm" style={{ color: C.text }}>T&D</span>
          <ChevronsUpDown className="w-3.5 h-3.5" style={{ color: C.sub }} />
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-4">
          {NAV.map(section => (
            <div key={section.section}>
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-[11px] font-bold tracking-wider" style={{ color: section.items.some(i => i.id === ecran) ? C.teal : C.sidebarText }}>{section.section}</span>
                <ChevronDown className="w-3 h-3" style={{ color: section.items.some(i => i.id === ecran) ? C.teal : C.sidebarText }} />
              </div>
              <div className="space-y-0.5 mt-0.5">
                {section.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setEcran(item.id)}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-left transition-colors"
                    style={ecran === item.id ? { background: C.sidebarActive, color: '#fff' } : { color: C.sidebarText }}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {item.label}
                  </button>
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

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="px-4 md:px-8 py-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs md:text-sm text-center" style={{ background: C.sidebarBg, color: '#fff' }}>
          <span>🎬 Démonstration avec des données d'exemple — tout est cliquable, rien ne peut être saisi ni enregistré</span>
          <Link to="/tarifs" className="font-bold underline" style={{ color: C.teal }}>
            Essayer gratuitement pendant 30 jours →
          </Link>
        </div>

        {/* Onglets mobile (la sidebar est cachée sous lg) */}
        <div className="flex lg:hidden gap-2 px-4 pt-4 overflow-x-auto">
          {NAV.flatMap(s => s.items).map(item => (
            <button
              key={item.id}
              onClick={() => setEcran(item.id)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
              style={ecran === item.id ? { background: C.sidebarBg, color: '#fff' } : { background: C.card, color: C.sub, border: `1px solid ${C.border}` }}
            >
              <item.icon className="w-3.5 h-3.5" /> {item.label}
            </button>
          ))}
        </div>

        <main className="flex-1 p-4 md:p-8">
          <Ecran onNouveauDevis={() => setModalOuvert(true)} />
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

      {modalOuvert && <ApercuNouveauDevis onClose={() => setModalOuvert(false)} />}
    </div>
  )
}
