import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Users, Building2, Wallet, Plus, Trash2,
  TrendingUp, Clock, Percent, CheckCircle2, ArrowLeft, Send,
} from 'lucide-react'

// Reproduction légère du design "neumorphique" réel de l'application
// (src/index.css de newrigen-devistrack) — même palette claire, même
// accent turquoise — pour que la démo ressemble vraiment à l'app plutôt
// qu'au site vitrine (sombre).
const NEU = {
  bg: '#e8ecf1',
  dark: '#c8d0da',
  light: '#ffffff',
  text: '#3d4654',
  sub: '#8792a2',
  accent: '#4DD9D9',
}

const raised = { background: NEU.bg, boxShadow: `8px 8px 16px ${NEU.dark}, -8px -8px 16px ${NEU.light}` }
const raisedSm = { background: NEU.bg, boxShadow: `4px 4px 10px ${NEU.dark}, -4px -4px 10px ${NEU.light}` }
const pressed = { background: NEU.bg, boxShadow: `inset 4px 4px 8px ${NEU.dark}, inset -4px -4px 8px ${NEU.light}` }

const DEVIS_EXEMPLE = [
  { client: 'Müller Sanitaire SA', montant: 4850, statut: 'Envoyé', marge: 32 },
  { client: 'Favre Construction', montant: 12300, statut: 'Accepté', marge: 28 },
  { client: 'Keller Traiteur', montant: 2100, statut: 'Brouillon', marge: 41 },
  { client: 'Rossi Toiture Sàrl', montant: 7600, statut: 'Accepté', marge: 24 },
]

const STATUT_STYLE = {
  Envoyé: { color: '#2563EB', bg: '#2563EB18' },
  Accepté: { color: '#10B981', bg: '#10B98118' },
  Brouillon: { color: NEU.sub, bg: `${NEU.sub}18` },
}

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-2xl p-5 flex items-start gap-4" style={raised}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={pressed}>
        <Icon className="w-5 h-5" style={{ color: NEU.accent }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: NEU.sub }}>{label}</p>
        <p className="text-xl font-bold mt-0.5 truncate" style={{ color: NEU.text }}>{value}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: NEU.sub }}>{sub}</p>}
      </div>
    </div>
  )
}

function DonutChart() {
  const segments = [
    { label: 'Matériaux', value: 12400, color: '#F59E0B' },
    { label: "Main d'œuvre", value: 8200, color: '#6366F1' },
    { label: 'Marge brute', value: 6150, color: NEU.accent },
  ]
  const total = segments.reduce((s, d) => s + d.value, 0)
  const size = 140, cx = 70, cy = 70, r = 50, sw = 22
  const circ = 2 * Math.PI * r
  let cum = 0
  return (
    <div className="flex items-center gap-5 flex-wrap">
      <svg width={size} height={size} className="flex-shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={NEU.dark} strokeWidth={sw} opacity="0.4" />
        {segments.map((seg, i) => {
          const pct = seg.value / total
          const startAngle = cum * 360 - 90
          cum += pct
          return (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth={sw}
              strokeDasharray={`${pct * circ} ${circ}`} transform={`rotate(${startAngle} ${cx} ${cy})`} />
          )
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" fill={NEU.text} fontSize="10" fontWeight="700">CHF</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill={NEU.sub} fontSize="9">{(total / 1000).toFixed(1)}k</text>
      </svg>
      <div className="space-y-2.5 flex-1 min-w-[140px]">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0" style={{ background: seg.color }} />
            <div className="min-w-0">
              <p className="text-xs font-medium" style={{ color: NEU.text }}>{seg.label}</p>
              <p className="text-xs" style={{ color: NEU.sub }}>{seg.value.toLocaleString('fr-CH')}.- · {((seg.value / total) * 100).toFixed(0)}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EcranDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="CA du mois" value="26 850.-" sub="+18% vs mois dernier" />
        <StatCard icon={Clock} label="Devis en attente" value="7" sub="3 depuis 5 jours" />
        <StatCard icon={Percent} label="Marge moyenne" value="31%" sub="Objectif : 30%" />
        <StatCard icon={CheckCircle2} label="Chantiers actifs" value="5" sub="2 se terminent cette semaine" />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 rounded-2xl p-5" style={raised}>
          <p className="text-sm font-bold mb-4" style={{ color: NEU.text }}>Répartition des coûts</p>
          <DonutChart />
        </div>

        <div className="lg:col-span-3 rounded-2xl p-5" style={raised}>
          <p className="text-sm font-bold mb-4" style={{ color: NEU.text }}>Derniers devis</p>
          <div className="space-y-2">
            {DEVIS_EXEMPLE.map((d, i) => (
              <div key={i} className="flex items-center justify-between gap-3 rounded-xl px-4 py-3" style={raisedSm}>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: NEU.text }}>{d.client}</p>
                  <p className="text-xs" style={{ color: NEU.sub }}>Marge {d.marge}%</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ color: STATUT_STYLE[d.statut].color, background: STATUT_STYLE[d.statut].bg }}>
                    {d.statut}
                  </span>
                  <span className="text-sm font-bold w-20 text-right" style={{ color: NEU.text }}>{d.montant.toLocaleString('fr-CH')}.-</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function EcranNouveauDevis() {
  const [client, setClient] = useState('')
  const [lignes, setLignes] = useState([{ desc: '', qte: 1, prix: 0 }])
  const [envoye, setEnvoye] = useState(false)

  const total = useMemo(() => lignes.reduce((s, l) => s + (Number(l.qte) || 0) * (Number(l.prix) || 0), 0), [lignes])

  function majLigne(i, champ, valeur) {
    setLignes(prev => prev.map((l, idx) => (idx === i ? { ...l, [champ]: valeur } : l)))
  }
  function ajouterLigne() {
    setLignes(prev => [...prev, { desc: '', qte: 1, prix: 0 }])
  }
  function supprimerLigne(i) {
    setLignes(prev => prev.filter((_, idx) => idx !== i))
  }

  if (envoye) {
    return (
      <div className="rounded-2xl p-10 flex flex-col items-center text-center gap-3" style={raised}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={pressed}>
          <CheckCircle2 className="w-7 h-7" style={{ color: NEU.accent }} />
        </div>
        <p className="font-bold text-lg" style={{ color: NEU.text }}>Devis envoyé ! (démo)</p>
        <p className="text-sm max-w-sm" style={{ color: NEU.sub }}>
          Dans la vraie application, {client || 'votre client'} recevrait ce devis par e-mail immédiatement, prêt à signer.
        </p>
        <button onClick={() => { setEnvoye(false); setClient(''); setLignes([{ desc: '', qte: 1, prix: 0 }]) }}
          className="mt-2 text-sm font-semibold px-4 py-2 rounded-xl" style={{ ...raisedSm, color: NEU.accent }}>
          Recommencer
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl p-6" style={raised}>
      <p className="text-sm font-bold mb-4" style={{ color: NEU.text }}>Nouveau devis</p>

      <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: NEU.sub }}>Client</label>
      <input
        value={client} onChange={e => setClient(e.target.value)} placeholder="Nom du client"
        className="w-full px-4 py-3 rounded-xl text-sm mb-5 focus:outline-none"
        style={{ ...pressed, color: NEU.text }}
      />

      <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: NEU.sub }}>Lignes du devis</p>
      <div className="space-y-2 mb-4">
        {lignes.map((l, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={l.desc} onChange={e => majLigne(i, 'desc', e.target.value)} placeholder="Description (ex: Pose de carrelage)"
              className="flex-1 min-w-0 px-3 py-2.5 rounded-xl text-sm focus:outline-none" style={{ ...pressed, color: NEU.text }}
            />
            <input
              type="number" min="0" value={l.qte} onChange={e => majLigne(i, 'qte', e.target.value)}
              className="w-16 px-2 py-2.5 rounded-xl text-sm text-center focus:outline-none" style={{ ...pressed, color: NEU.text }}
            />
            <input
              type="number" min="0" value={l.prix} onChange={e => majLigne(i, 'prix', e.target.value)} placeholder="Prix"
              className="w-24 px-2 py-2.5 rounded-xl text-sm text-right focus:outline-none" style={{ ...pressed, color: NEU.text }}
            />
            {lignes.length > 1 && (
              <button onClick={() => supprimerLigne(i)} className="p-2 flex-shrink-0" style={{ color: NEU.sub }}>
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button onClick={ajouterLigne} className="text-xs font-semibold flex items-center gap-1.5 mb-6" style={{ color: NEU.accent }}>
        <Plus className="w-3.5 h-3.5" /> Ajouter une ligne
      </button>

      <div className="flex items-center justify-between rounded-xl px-4 py-3 mb-5" style={pressed}>
        <span className="text-sm font-semibold" style={{ color: NEU.sub }}>Total</span>
        <span className="text-xl font-black" style={{ color: NEU.text }}>{total.toLocaleString('fr-CH')}.- CHF</span>
      </div>

      <button
        onClick={() => setEnvoye(true)}
        className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
        style={{ background: NEU.accent, color: '#0A0A0F' }}
      >
        <Send className="w-4 h-4" /> Envoyer le devis
      </button>
    </div>
  )
}

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, actif: true },
  { id: 'devis', label: 'Nouveau devis', icon: FileText, actif: true },
  { id: 'employes', label: 'Employés', icon: Users, actif: false },
  { id: 'chantiers', label: 'Chantiers', icon: Building2, actif: false },
  { id: 'factures', label: 'Factures', icon: Wallet, actif: false },
]

export default function Demo() {
  const [ecran, setEcran] = useState('dashboard')

  return (
    <div className="min-h-screen" style={{ background: NEU.bg }}>
      {/* Bandeau démo */}
      <div className="sticky top-0 z-50 px-4 py-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs md:text-sm text-center" style={{ background: '#0A0A0F', color: '#fff' }}>
        <span>🎬 Démonstration avec des données d'exemple — rien n'est enregistré</span>
        <Link to="/tarifs" className="font-bold underline" style={{ color: NEU.accent }}>
          Essayer gratuitement pendant 30 jours →
        </Link>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 flex-shrink-0 p-4 gap-1 min-h-[calc(100vh-40px)]" style={{ background: NEU.bg }}>
          <Link to="/" className="flex items-center gap-2 px-2 py-3 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ background: '#0A0A0F', color: NEU.accent }}>N</div>
            <span className="font-bold text-sm" style={{ color: NEU.text }}>Newrigen</span>
          </Link>
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => item.actif && setEcran(item.id)}
              disabled={!item.actif}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all"
              style={ecran === item.id ? pressed : {}}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" style={{ color: ecran === item.id ? NEU.accent : NEU.sub }} />
              <span style={{ color: ecran === item.id ? NEU.text : NEU.sub }}>{item.label}</span>
              {!item.actif && <span className="ml-auto text-[10px]" style={{ color: NEU.sub }}>bientôt</span>}
            </button>
          ))}
          <div className="mt-auto pt-4">
            <Link to="/" className="flex items-center gap-2 px-3 py-2 text-xs font-medium" style={{ color: NEU.sub }}>
              <ArrowLeft className="w-3.5 h-3.5" /> Retour au site
            </Link>
          </div>
        </aside>

        {/* Contenu */}
        <main className="flex-1 min-w-0 p-4 md:p-8">
          {/* Onglets mobile */}
          <div className="flex md:hidden gap-2 mb-5 overflow-x-auto">
            {NAV.filter(n => n.actif).map(item => (
              <button
                key={item.id}
                onClick={() => setEcran(item.id)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
                style={ecran === item.id ? { ...pressed, color: NEU.text } : { ...raisedSm, color: NEU.sub }}
              >
                <item.icon className="w-3.5 h-3.5" /> {item.label}
              </button>
            ))}
          </div>

          <h1 className="text-xl font-black mb-5" style={{ color: NEU.text }}>
            {ecran === 'dashboard' ? 'Vue d’ensemble' : 'Nouveau devis'}
          </h1>

          {ecran === 'dashboard' ? <EcranDashboard /> : <EcranNouveauDevis />}
        </main>
      </div>
    </div>
  )
}
