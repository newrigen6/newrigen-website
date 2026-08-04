import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, Calendar, Upload, Package, ClipboardList, Wrench, Calculator,
  Users, Boxes, Settings, ChevronDown, ChevronsUpDown, Search, SlidersHorizontal,
  Plus, HelpCircle, ArrowLeft, Eye, X, Sun, PanelLeftClose, FileText, Building2, Mail, CreditCard,
  Sparkles, XCircle, Tag, Pencil, ChevronRight, Phone, UserPlus, KeyRound, Trash2, SquarePen, ToggleRight,
  LayoutGrid, FilePlus, Bell, ChevronLeft,
  TrendingUp, TrendingDown, Wallet, Landmark, Clock, ArrowDownCircle, Banknote, BarChart3, ShoppingCart,
} from 'lucide-react'

/**
 * Visite guidée de l'application, en lecture seule.
 *
 * Reproduit l'interface réelle de Newrigen (barre latérale sombre, contenu
 * clair, mêmes écrans et mêmes intitulés) avec un jeu de données d'exemple.
 * Rien n'est saisissable : aucun champ de formulaire n'existe dans cette page,
 * elle n'appelle aucun service et ne touche à l'application réelle en rien.
 *
 * Les montants sont ceux que l'application calcule pour ce jeu de données
 * (coût = matériaux + main d'œuvre, marge = prix − coût), afin que la
 * démonstration reste cohérente avec ce que verra un vrai client.
 */

const C = {
  navBg: '#0A0A0F',
  navActif: '#1E212B',
  navTexte: '#8A93A6',
  fond: '#F3F4F6',
  carte: '#FFFFFF',
  bord: '#E5E7EB',
  texte: '#111827',
  sousTexte: '#6B7280',
  teal: '#4DD9D9',
  vert: '#16A34A',
  vertFond: '#DCFCE7',
  rouge: '#DC2626',
  rougeFond: '#FEE2E2',
}

// Menu de la barre latérale. Les entrées portent toutes la même icône de
// document, comme dans l'application ; seuls les intitulés de section ont une
// icône propre. « Bons de Régie » et « Bons d'intervention » sont regroupés
// dans un sous-groupe « BONS », lui aussi repliable.
const MENU = [
  { section: 'ACCUEIL', icon: LayoutGrid, items: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'agenda', label: 'Agenda' },
  ] },
  { section: 'DEVIS', icon: FilePlus, items: [
    { id: 'importer', label: 'Importer' },
  ] },
  { section: 'CHANTIERS', icon: ClipboardList, items: [
    { id: 'saisie', label: 'Saisie Matériaux' },
    { sousSection: 'BONS', icon: SquarePen, items: [
      { id: 'regie', label: 'Bons de Régie' },
      { id: 'intervention', label: "Bons d'intervention" },
    ] },
  ] },
  { section: 'COMPTABILITÉ', icon: Calculator, items: [
    { id: 'comptabilite', label: 'Comptabilité' },
  ] },
  { section: 'GESTION', icon: Settings, items: [
    { id: 'team', label: 'Team' },
    { id: 'produits', label: 'Produits' },
    { id: 'parametres', label: 'Paramètres' },
  ] },
]

// Tous les identifiants d'écran d'une section, sous-groupes compris.
const idsDeSection = (items) =>
  items.flatMap(i => (i.sousSection ? i.items.map(s => s.id) : [i.id]))

const chf = (v) => v.toLocaleString('fr-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' CHF'

// Jeu de données d'exemple. Les coûts et marges correspondent à ce que
// l'application calcule réellement à partir des matériaux et des heures.
const DEVIS = [
  { client: 'Villa Cheseaux', adresse: 'Chemin des Vignes 7, 1958 Uvrier', date: '26.07.2026', montant: 4150, materiaux: 2620, mo: 408, cout: 3028, margeChf: 1122, margePct: 27.0, statut: 'En cours' },
  { client: 'Résidence Les Mélèzes', adresse: 'Route de Sierre 42, 1950 Sion', date: '20.07.2026', montant: 18400, materiaux: 12216, mo: 1009, cout: 13225, margeChf: 5175, margePct: 28.1, statut: 'En cours' },
  { client: 'Hôtel du Cervin', adresse: 'Bahnhofstrasse 4, 3920 Zermatt', date: '06.07.2026', montant: 32750, materiaux: 16142.5, mo: 1108, cout: 17250.5, margeChf: 15499.5, margePct: 47.3, statut: 'Accepté' },
  { client: 'Boulangerie Delacroix', adresse: 'Grand-Rue 18, 1920 Martigny', date: '24.06.2026', montant: 6280, materiaux: 2500, mo: 0, cout: 2500, margeChf: 3780, margePct: 60.2, statut: 'Accepté' },
  { client: 'Garage Praz SA', adresse: 'Zone Industrielle 3, 1963 Vétroz', date: '08.06.2026', montant: 2890, materiaux: 576, mo: 0, cout: 576, margeChf: 2314, margePct: 80.1, statut: 'Terminé' },
]

// ── Briques d'interface communes ───────────────────────────────────────────
function Carte({ children, className = '', ...reste }) {
  return (
    <div className={`rounded-2xl ${className}`} style={{ background: C.carte, border: `1px solid ${C.bord}` }} {...reste}>
      {children}
    </div>
  )
}

function Titre({ eyebrow, titre, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        {eyebrow && <span className="text-[11px] font-bold tracking-widest" style={{ color: C.sousTexte }}>{eyebrow}</span>}
        <h1 className="text-2xl md:text-3xl font-black" style={{ color: C.texte }}>{titre}</h1>
      </div>
      {action}
    </div>
  )
}

function BoutonFactice({ children, principal, petit }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-xl font-bold flex-shrink-0 ${petit ? 'px-3 py-2 text-xs' : 'px-4 py-2.5 text-sm'}`}
      style={principal
        ? { background: C.texte, color: '#fff' }
        : { background: C.carte, color: C.texte, border: `1px solid ${C.bord}` }}
    >
      {children}
    </span>
  )
}

function Pastille({ texte, couleur = C.sousTexte, fond = C.fond }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap" style={{ background: fond, color: couleur }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: couleur }} />{texte}
    </span>
  )
}

function Champ({ label, valeur }) {
  // Volontairement un bloc de texte et non un <input> : la démonstration se
  // regarde, elle ne se remplit pas.
  return (
    <div>
      <p className="text-[11px] font-bold mb-1.5" style={{ color: C.sousTexte }}>{label}</p>
      <div className="px-4 py-2.5 rounded-xl text-sm" style={{ background: C.fond, border: `1px solid ${C.bord}`, color: valeur ? C.texte : C.sousTexte }}>
        {valeur || '—'}
      </div>
    </div>
  )
}

function LigneListe({ titre, sous, droite, pastille }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3.5" style={{ borderTop: `1px solid ${C.bord}` }}>
      <div className="min-w-0">
        <p className="text-sm font-bold truncate" style={{ color: C.texte }}>{titre}</p>
        {sous && <p className="text-xs mt-0.5" style={{ color: C.sousTexte }}>{sous}</p>}
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {pastille}
        {droite && <span className="text-sm font-bold" style={{ color: C.texte }}>{droite}</span>}
      </div>
    </div>
  )
}

// ── Écrans ─────────────────────────────────────────────────────────────────
function EcranDashboard() {
  // La table se trie par date à l'ouverture : ce chevron-là est marqué.
  const COLONNES = ['Nature', 'Client', 'Adresse', 'Date', 'Montant', 'Matériaux', "Main d'œuvre", 'Coût total', 'Marge CHF', 'Marge %', 'Statut', 'Actions']
  return (
    <>
      <Titre eyebrow="RENTABILITÉ" titre="Tableau de bord" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Chiffre d'affaires total", valeur: '64 470,00 CHF', sous: 'Tous devis confondus' },
          { label: 'Devis en cours (2)', valeur: '22 550,00 CHF', sous: 'À facturer' },
          { label: 'Marges réelles cumulées', valeur: '27 890,50 CHF', sous: "Mat. + main d'œuvre déduits" },
          { label: "Marges sous l'objectif (< 15 %)", valeur: '0 devis', sous: 'À surveiller' },
        ].map(s => (
          <Carte key={s.label} className="p-5">
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="text-xs" style={{ color: C.sousTexte }}>{s.label}</span>
              <span className="text-xs flex-shrink-0" style={{ color: C.sousTexte }}>voir</span>
            </div>
            <p className="text-2xl font-black leading-none" style={{ color: s.alerte ? C.rouge : C.texte }}>{s.valeur}</p>
            <p className="text-xs mt-2" style={{ color: C.sousTexte }}>{s.sous}</p>
          </Carte>
        ))}
      </div>

      <Carte className="p-4 mb-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 flex items-center gap-2.5 rounded-xl px-4 py-3 min-w-0" style={{ border: `1px solid ${C.bord}` }}>
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: C.sousTexte }} />
            <span className="text-[15px] truncate" style={{ color: '#B9C0CC' }}>Rechercher un client…</span>
          </div>
          <span className="flex items-center justify-center px-1 flex-shrink-0">
            <SlidersHorizontal className="w-5 h-5" style={{ color: C.sousTexte }} />
          </span>
          {['Tous statuts', 'Toutes marges'].map(f => (
            <span key={f} className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-[15px] flex-shrink-0 sm:min-w-[10rem]" style={{ border: `1px solid ${C.bord}`, color: C.texte }}>
              {f}<ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: C.sousTexte }} />
            </span>
          ))}
        </div>
      </Carte>

      <Carte className="overflow-hidden mb-2">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.bord}` }}>
                {COLONNES.map(c => (
                  <th key={c} className="text-left px-4 py-3 text-[11px] font-bold tracking-wider whitespace-nowrap" style={{ color: C.sousTexte }}>
                    <span className="inline-flex items-center gap-1">
                      {c.toUpperCase()}
                      {c === 'Actions'
                        ? null
                        : c === 'Date'
                          ? <ChevronDown className="w-3 h-3" style={{ color: C.texte }} />
                          : <ChevronsUpDown className="w-3 h-3 opacity-60" />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEVIS.map((d, i) => (
                <tr key={i} style={{ borderBottom: i < DEVIS.length - 1 ? `1px solid ${C.bord}` : 'none' }}>
                  <td className="px-4 py-3"><Pastille texte="Devis" /></td>
                  <td className="px-4 py-3 font-bold whitespace-nowrap" style={{ color: C.texte }}>{d.client}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: C.sousTexte }}>{d.adresse}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: C.texte }}>{d.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-semibold" style={{ color: C.texte }}>{chf(d.montant)}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: C.texte }}>{chf(d.materiaux)}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: C.texte }}>{chf(d.mo)}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-semibold" style={{ color: C.texte }}>{chf(d.cout)}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-semibold" style={{ color: d.margeChf < 0 ? C.rouge : C.vert }}>{chf(d.margeChf)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{
                      color: d.sousObjectif ? C.rouge : C.vert,
                      background: d.sousObjectif ? C.rougeFond : C.vertFond,
                    }}>{d.margePct.toFixed(1)}%</span>
                  </td>
                  <td className="px-4 py-3"><Pastille texte={d.statut} couleur={C.teal} /></td>
                  <td className="px-4 py-3">
                    <Eye className="w-4 h-4" style={{ color: C.sousTexte }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Carte>
      <p className="text-xs" style={{ color: C.sousTexte }}>5 devis · 3 bons de régie</p>
    </>
  )
}

// Agenda : barre d'outils en haut, calendrier mensuel avec colonne de numéro
// de semaine à gauche, et panneau « Jour sélectionné » à droite — comme la
// page réelle. Cliquer un jour change le panneau.
const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

function numeroSemaineISO(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const jour = (date.getUTCDay() + 6) % 7
  date.setUTCDate(date.getUTCDate() - jour + 3)
  const premierJeudi = new Date(Date.UTC(date.getUTCFullYear(), 0, 4))
  const decalage = (premierJeudi.getUTCDay() + 6) % 7
  premierJeudi.setUTCDate(premierJeudi.getUTCDate() - decalage + 3)
  return 1 + Math.round((date - premierJeudi) / (7 * 86400000))
}

const capitaliser = (s) => s.charAt(0).toUpperCase() + s.slice(1)

function EcranAgenda() {
  const aujourdhui = new Date()
  const annee = aujourdhui.getFullYear()
  const mois = aujourdhui.getMonth()
  const [jourChoisi, setJourChoisi] = useState(aujourdhui.getDate())

  // Rendez-vous d'exemple, posés sur des jours fixes du mois affiché.
  const RDV = {
    4: [{ h: '08:00', t: 'Les Mélèzes — pose chaudière', c: C.teal }],
    12: [
      { h: '09:30', t: 'Villa Cheseaux — métré', c: '#6366F1' },
      { h: '14:00', t: 'Hôtel du Cervin — contrôle PAC', c: C.teal },
    ],
    18: [{ h: '10:00', t: 'Mme Berger — dépannage', c: '#F59E0B' }],
    25: [{ h: '11:00', t: 'Boulangerie Delacroix — SAV', c: C.teal }],
  }

  const premier = new Date(annee, mois, 1)
  const decalage = (premier.getDay() + 6) % 7
  const nbJours = new Date(annee, mois + 1, 0).getDate()
  const nbJoursPrec = new Date(annee, mois, 0).getDate()

  // Grille complète : jours du mois précédent, du mois, puis du suivant.
  const cellules = []
  for (let i = decalage - 1; i >= 0; i--) cellules.push({ n: nbJoursPrec - i, hors: true })
  for (let j = 1; j <= nbJours; j++) cellules.push({ n: j, hors: false })
  let suivant = 1
  while (cellules.length % 7 !== 0) cellules.push({ n: suivant++, hors: true })

  const semaines = []
  for (let i = 0; i < cellules.length; i += 7) semaines.push(cellules.slice(i, i + 7))

  const dateChoisie = new Date(annee, mois, jourChoisi)
  const libelleJour = capitaliser(dateChoisie.toLocaleDateString('fr-CH', { weekday: 'long' }))
  const libelleMois = capitaliser(dateChoisie.toLocaleDateString('fr-CH', { month: 'long' }))
  const rdvDuJour = RDV[jourChoisi] || []

  return (
    <>
      {/* Barre d'outils */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span className="flex items-center gap-2.5 flex-shrink-0">
          <Calendar className="w-6 h-6" style={{ color: C.texte }} />
          <span className="text-xl font-black" style={{ color: C.texte }}>Agenda</span>
        </span>
        <span className="flex items-center gap-1 p-1 rounded-xl flex-shrink-0" style={{ background: '#EEF1F5' }}>
          <span className="px-4 py-1.5 rounded-lg text-sm font-semibold" style={{ background: '#fff', color: C.texte }}>Mois</span>
          <span className="px-4 py-1.5 rounded-lg text-sm font-semibold" style={{ color: C.sousTexte }}>Année</span>
        </span>
        <span className="flex-1" />
        <span className="flex items-center gap-2 rounded-xl px-4 py-2.5 flex-shrink-0 min-w-[9rem]" style={{ background: C.carte, border: `1px solid ${C.bord}` }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: C.sousTexte }} />
          <span className="text-sm truncate" style={{ color: '#B9C0CC' }}>Recherche…</span>
        </span>
        <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0" style={{ background: C.carte, border: `1px solid ${C.bord}`, color: C.texte }}>
          <Bell className="w-4 h-4" /> Activer les rappels
        </span>
        <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0" style={{ background: C.carte, border: `1px solid ${C.bord}`, color: C.texte }}>
          <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black" style={{ background: '#fff', border: `1px solid ${C.bord}`, color: '#4285F4' }}>G</span>
          Connecter Google Calendar
        </span>
        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold flex-shrink-0" style={{ background: C.navBg, color: '#fff' }}>
          <Plus className="w-4 h-4" /> Nouveau RDV
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Calendrier */}
        <Carte className="flex-1 p-5 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <ChevronLeft className="w-5 h-5" style={{ color: C.sousTexte }} />
            <span className="text-lg font-black" style={{ color: C.texte }}>{libelleMois} {annee}</span>
            <ChevronRight className="w-5 h-5" style={{ color: C.sousTexte }} />
          </div>

          <div className="grid mb-2" style={{ gridTemplateColumns: '36px repeat(7, minmax(0,1fr))' }}>
            <div className="text-center text-[10px] font-bold tracking-wider" style={{ color: C.sousTexte }} title="Numéro de semaine">SEM</div>
            {JOURS.map(j => (
              <div key={j} className="text-center text-[11px] font-bold tracking-wider" style={{ color: C.sousTexte }}>{j.toUpperCase()}</div>
            ))}
          </div>

          {semaines.map((semaine, i) => {
            const refJour = semaine.find(c => !c.hors) || semaine[0]
            const noSemaine = numeroSemaineISO(new Date(annee, mois, refJour.hors ? 1 : refJour.n))
            return (
              <div key={i} className="grid" style={{ gridTemplateColumns: '36px repeat(7, minmax(0,1fr))' }}>
                <div className="flex items-start justify-center pt-3 text-[11px]" style={{ color: '#C7CDD8' }}>{noSemaine}</div>
                {semaine.map((cel, k) => {
                  const choisi = !cel.hors && cel.n === jourChoisi
                  const rdv = cel.hors ? [] : (RDV[cel.n] || [])
                  return (
                    <button
                      key={k}
                      onClick={() => !cel.hors && setJourChoisi(cel.n)}
                      className="text-left p-2 min-h-[76px] rounded-xl transition-colors"
                      style={choisi
                        ? { background: '#EFF6FF', border: `2px solid ${C.navBg}` }
                        : { border: '2px solid transparent' }}
                    >
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-semibold"
                        style={choisi
                          ? { background: C.navBg, color: '#fff' }
                          : { color: cel.hors ? '#C7CDD8' : C.texte }}
                      >
                        {cel.n}
                      </span>
                      <span className="block space-y-1 mt-1">
                        {rdv.map(r => (
                          <span key={r.h} className="block rounded px-1.5 py-0.5 text-[10px] font-medium truncate"
                            style={{ background: `${r.c}22`, color: C.texte, borderLeft: `2px solid ${r.c}` }}
                            title={`${r.h} ${r.t}`}>
                            {r.h} {r.t}
                          </span>
                        ))}
                      </span>
                    </button>
                  )
                })}
              </div>
            )
          })}
        </Carte>

        {/* Panneau du jour sélectionné */}
        <Carte className="w-full lg:w-80 flex-shrink-0 p-5 self-start">
          <p className="text-[11px] font-bold tracking-wider" style={{ color: C.sousTexte }}>
            JOUR SÉLECTIONNÉ · SEMAINE {numeroSemaineISO(dateChoisie)}
          </p>
          <p className="text-lg font-black mt-1 mb-4" style={{ color: C.texte }}>
            {libelleJour}, {jourChoisi} {libelleMois} {annee}
          </p>
          <span className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold mb-5" style={{ background: C.navBg, color: '#fff' }}>
            <Plus className="w-4 h-4" /> Ajouter un RDV
          </span>

          {rdvDuJour.length === 0 ? (
            <div className="flex flex-col items-center text-center py-8">
              <Calendar className="w-9 h-9 mb-3" style={{ color: '#DDE2EA' }} />
              <p className="text-sm" style={{ color: C.sousTexte }}>Aucun rendez-vous ce jour.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {rdvDuJour.map(r => (
                <div key={r.h} className="rounded-xl px-3 py-2.5" style={{ background: `${r.c}12`, borderLeft: `3px solid ${r.c}` }}>
                  <p className="text-sm font-bold" style={{ color: C.texte }}>{r.h}</p>
                  <p className="text-xs mt-0.5" style={{ color: C.sousTexte }}>{r.t}</p>
                </div>
              ))}
            </div>
          )}
        </Carte>
      </div>
    </>
  )
}

// Champ de formulaire de la page d'import : l'apparence d'une zone de saisie,
// sans en être une. Les champs sont montrés vides, comme à l'ouverture.
function ChampImport({ label, obligatoire, valeur, icone: Icone }) {
  return (
    <div>
      <p className="text-[15px] mb-2" style={{ color: C.texte }}>
        {label}{obligatoire && <span style={{ color: C.rouge }}> *</span>}
      </p>
      <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl" style={{ border: `1px solid ${C.bord}`, background: C.carte, minHeight: '3rem' }}>
        <span className="text-[15px] truncate" style={{ color: C.texte }}>{valeur || ' '}</span>
        {Icone && <Icone className="w-5 h-5 flex-shrink-0" style={{ color: C.sousTexte }} />}
      </div>
    </div>
  )
}

function EcranImporter() {
  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <ArrowLeft className="w-6 h-6 flex-shrink-0" style={{ color: C.texte }} />
        <h1 className="text-2xl md:text-3xl font-black" style={{ color: C.texte }}>Importer Devis</h1>
      </div>

      <Carte className="p-6 mb-6">
        <p className="text-[15px] font-semibold mb-4" style={{ color: C.texte }}>Fichier devis (optionnel)</p>
        <div className="rounded-xl px-6 py-12 flex flex-col items-center justify-center text-center" style={{ border: `2px dashed ${C.bord}` }}>
          <Upload className="w-10 h-10 mb-4" style={{ color: C.sousTexte }} />
          <p className="text-lg font-semibold" style={{ color: C.texte }}>Glisser un fichier ici</p>
          <p className="text-[15px] mt-1" style={{ color: C.sousTexte }}>ou cliquer pour parcourir</p>
          <p className="text-sm mt-3" style={{ color: '#B9C0CC' }}>Formats acceptés : .xlsx, .xls, .pdf</p>
        </div>
      </Carte>

      <Carte className="p-6">
        <p className="text-[15px] font-semibold mb-5" style={{ color: C.texte }}>Informations du devis</p>
        <div className="space-y-5">
          <ChampImport label="Nom du client" obligatoire />
          <ChampImport label="Adresse du chantier" />
          <ChampImport label="Email du client" />
          <div className="grid sm:grid-cols-2 gap-5">
            <ChampImport label="Prix total convenu (CHF)" obligatoire />
            <ChampImport label="Date du devis" valeur="04.08.2026" icone={Calendar} />
          </div>
        </div>
      </Carte>
    </>
  )
}

function EcranSaisie() {
  const lignes = [
    { nom: 'Chaudière à pellets 24 kW', unite: 'pcs', qte: 1, prix: 8900, par: 'Marc Fournier' },
    { nom: 'Radiateur acier 600×1200', unite: 'pcs', qte: 8, prix: 285, par: 'Marc Fournier' },
    { nom: 'Tube multicouche 20 mm', unite: 'm', qte: 140, prix: 7.4, par: 'Julien Rossier' },
  ]
  return (
    <>
      <span className="text-[11px] font-bold tracking-widest" style={{ color: C.sousTexte }}>CHANTIER</span>
      <h1 className="text-2xl md:text-3xl font-black mb-6" style={{ color: C.texte }}>Saisie des matériaux</h1>

      {/* Tant qu'aucun chantier n'est choisi, la page réelle n'affiche que ce
          sélecteur. La démonstration part d'un chantier déjà sélectionné,
          sinon il n'y aurait rien à montrer. */}
      <Carte className="p-6 mb-5">
        <p className="text-[15px] mb-3" style={{ color: C.texte }}>Chantier / Devis</p>
        <div className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl" style={{ border: `1px solid ${C.bord}` }}>
          <span className="text-[15px] truncate" style={{ color: C.texte }}>Résidence Les Mélèzes — 2026-014</span>
          <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: C.sousTexte }} />
        </div>
      </Carte>

      {/* Rentabilité du chantier, recalculée à chaque matériau saisi */}
      <Carte className="p-5 mb-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ['Prix devis :', chf(18400), C.texte],
            ['Matériaux :', chf(12216), C.texte],
            ["Main d'œuvre", chf(1009), C.texte],
            ['Marge réelle :', '5 175,00 CHF · 28.1%', C.vert],
          ].map(([l, v, couleur]) => (
            <div key={l}>
              <p className="text-xs" style={{ color: C.sousTexte }}>{l}</p>
              <p className="text-base font-black mt-1" style={{ color: couleur }}>{v}</p>
            </div>
          ))}
        </div>
      </Carte>

      <Carte className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-3.5">
          <p className="text-sm font-bold" style={{ color: C.texte }}>Matériaux utilisés</p>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0" style={{ background: C.navBg, color: '#fff' }}>
            <Plus className="w-3.5 h-3.5" /> Ajouter un matériau
          </span>
        </div>
        {lignes.map(l => (
          <LigneListe key={l.nom} titre={l.nom} sous={`${l.qte} ${l.unite} × ${l.prix.toFixed(2)} TTC · ${l.par}`} droite={chf(l.qte * l.prix)} />
        ))}
        <div className="flex items-center justify-between px-5 py-3.5" style={{ borderTop: `2px solid ${C.bord}`, background: C.fond }}>
          <span className="text-sm font-bold" style={{ color: C.sousTexte }}>Total matériaux</span>
          <span className="text-lg font-black" style={{ color: C.texte }}>{chf(12216)}</span>
        </div>
      </Carte>
    </>
  )
}

// Les deux écrans de bons partagent la même ossature dans l'application :
// onglet « Vue d'ensemble », trio de compteurs, puis la liste des bons.
function EcranBons({ titre, icon: Icone, bons }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <Icone className="w-7 h-7 flex-shrink-0" style={{ color: C.texte }} />
        <h1 className="text-2xl md:text-3xl font-black" style={{ color: C.texte }}>{titre}</h1>
      </div>

      {/* Bascule vue d'ensemble / création, avec le compteur de bons */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-bold" style={{ background: C.navBg, color: '#fff' }}>
          Vue d'ensemble
          <span className="px-2 py-0.5 rounded-md text-xs" style={{ background: 'rgba(255,255,255,0.15)' }}>{bons.length}</span>
        </span>
        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold" style={{ background: '#EEF1F5', color: C.texte }}>
          <Plus className="w-4 h-4" /> Nouveau bon
        </span>
      </div>

      <div className="flex items-center gap-2 rounded-xl px-4 py-3 mb-5" style={{ background: C.carte, border: `1px solid ${C.bord}` }}>
        <Search className="w-4 h-4 flex-shrink-0" style={{ color: C.sousTexte }} />
        <span className="text-sm" style={{ color: '#B9C0CC' }}>Rechercher par client, employé, description…</span>
      </div>

      {bons.length === 0 ? (
        <div className="rounded-2xl px-6 py-16 flex flex-col items-center text-center" style={{ border: `1px dashed ${C.bord}` }}>
          <Icone className="w-10 h-10 mb-4" style={{ color: '#CBD5E1' }} />
          <p className="text-base mb-5" style={{ color: C.sousTexte }}>Aucun bon créé pour l'instant.</p>
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold" style={{ background: '#374151', color: '#fff' }}>
            <Plus className="w-4 h-4" /> Créer un bon
          </span>
        </div>
      ) : (
        <Carte className="overflow-hidden">
          {bons.map((b, i) => (
            <div key={b.titre} className="px-5 py-4" style={{ borderTop: i === 0 ? 'none' : `1px solid ${C.bord}` }}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: C.texte }}>{b.titre}</p>
                  <p className="text-xs mt-0.5" style={{ color: C.sousTexte }}>{b.sous}</p>
                </div>
                {b.confirme
                  ? <Pastille texte="Confirmé" couleur={C.vert} fond={C.vertFond} />
                  : <Pastille texte="En cours" />}
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs">
                <span style={{ color: C.sousTexte }}>
                  {b.heures} h main d'œuvre · <span className="font-semibold" style={{ color: C.texte }}>{chf(b.coutMo)}</span>
                </span>
                <span style={{ color: C.sousTexte }}>
                  {b.nbMateriaux} matériaux · <span className="font-semibold" style={{ color: C.texte }}>{chf(b.coutMat)}</span>
                </span>
              </div>
            </div>
          ))}
        </Carte>
      )}
    </>
  )
}

function EcranRegie() {
  return (
    <EcranBons
      titre="Bons de Régie"
      icon={ClipboardList}
      bons={[
        { titre: 'Résidence Les Mélèzes', sous: 'Marc Fournier · 22.07.2026', heures: '8.0', coutMo: 544, nbMateriaux: 1, coutMat: 84, confirme: true },
        { titre: 'Villa Cheseaux', sous: 'Marc Fournier · 28.07.2026', heures: '6.0', coutMo: 408, nbMateriaux: 0, coutMat: 0, confirme: false },
        { titre: 'Mme Berger — dépannage', sous: 'Julien Rossier · 29.07.2026', heures: '2.5', coutMo: 155, nbMateriaux: 1, coutMat: 62, confirme: true },
      ]}
    />
  )
}

function EcranIntervention() {
  return (
    <EcranBons
      titre="Bons d'intervention"
      icon={Wrench}
      bons={[
        { titre: "Fuite chasse d'eau — Mme Berger", sous: 'Rue de Lausanne 9, 1950 Sion · 29.07.2026', heures: '2.5', coutMo: 155, nbMateriaux: 1, coutMat: 62, confirme: true },
        { titre: 'Contrôle chaudière — Garage Praz SA', sous: 'Zone Industrielle 3, 1963 Vétroz · 08.08.2026', heures: '1.5', coutMo: 93, nbMateriaux: 0, coutMat: 0, confirme: false },
      ]}
    />
  )
}

// Comptabilité : onglets soulignés, sélecteur de période, huit indicateurs
// sur fond coloré puis l'évolution sur douze mois — comme la page réelle.
const ONGLETS_COMPTA = [
  { id: 'vue', label: "Vue d'ensemble", icon: BarChart3 },
  { id: 'clients', label: 'Factures clients', icon: Banknote },
  { id: 'fournisseurs', label: 'Factures fournisseurs', icon: ShoppingCart },
  { id: 'heures', label: "Rapport d'heures", icon: Clock },
  { id: 'extraits', label: 'Extraits bancaires', icon: Landmark },
]

// Cohérent avec les factures du jeu de démonstration : 41 920.- envoyés
// (Cervin, Delacroix, Garage Praz), dont 6 280.- encaissés, et 5 470,50.-
// de factures fournisseurs dont 4 508.- payées.
const INDICATEURS = [
  { label: 'CA facturé', valeur: '41 920,00 CHF', sous: 'Toutes envoyées', icon: TrendingUp, teinte: '#4F46E5', fond: '#EEF2FF' },
  { label: 'CA encaissé', valeur: '6 280,00 CHF', sous: 'Factures payées', icon: Wallet, teinte: '#059669', fond: '#ECFDF5' },
  { label: 'Charges', valeur: '4 508,00 CHF', sous: 'Fournisseurs payés', icon: TrendingDown, teinte: '#DC2626', fond: '#FEF2F2' },
  { label: 'Bénéfice net', valeur: '1 772,00 CHF', sous: 'Encaissé – Charges', icon: Landmark, teinte: '#0D9488', fond: '#F0FDFA' },
  { label: 'À encaisser', valeur: '35 640,00 CHF', sous: 'Factures impayées', icon: Clock, teinte: '#CA8A04', fond: '#FEFCE8' },
  { label: 'À payer', valeur: '962,50 CHF', sous: 'Factures reçues', icon: ArrowDownCircle, teinte: '#EA580C', fond: '#FFF7ED' },
  { label: 'TVA collectée', valeur: '3 044,73 CHF', sous: 'Sur envoyées', icon: Banknote, teinte: '#2563EB', fond: '#EFF6FF' },
  { label: 'Solde TVA', valeur: '2 647,33 CHF', sous: 'À reverser', icon: Banknote, teinte: '#EA580C', fond: '#FFF7ED' },
]

const MOIS_12 = [
  { m: 'sept.', revenus: 0, charges: 0 },
  { m: 'oct.', revenus: 0, charges: 0 },
  { m: 'nov.', revenus: 0, charges: 0 },
  { m: 'déc.', revenus: 0, charges: 0 },
  { m: 'janv.', revenus: 0, charges: 0 },
  { m: 'févr.', revenus: 0, charges: 0 },
  { m: 'mars', revenus: 0, charges: 0 },
  { m: 'avr.', revenus: 0, charges: 0 },
  { m: 'mai', revenus: 0, charges: 4508 },
  { m: 'juin', revenus: 0, charges: 0 },
  { m: 'juil.', revenus: 6280, charges: 962.5 },
  { m: 'août', revenus: 0, charges: 0 },
]

const INDIGO = '#6366F1'
const ROUGE_GRAPH = '#F87171'

function GraphiqueDouzeMois() {
  const max = Math.max(...MOIS_12.flatMap(m => [m.revenus, m.charges]), 1)
  const H = 150
  return (
    <Carte className="p-6">
      <p className="text-base font-bold mb-6" style={{ color: C.texte }}>Évolution sur 12 mois</p>
      <div className="flex items-end gap-2 overflow-x-auto" style={{ height: H + 30 }}>
        {MOIS_12.map(mois => (
          <div key={mois.m} className="flex-1 min-w-[34px] flex flex-col items-center justify-end gap-1" style={{ height: H + 30 }}>
            <div className="flex items-end gap-1" style={{ height: H }}>
              <div
                className="w-2.5 rounded-t"
                style={{ height: Math.max(mois.revenus ? 3 : 0, (mois.revenus / max) * H), background: INDIGO }}
                title={`Revenus encaissés : ${chf(mois.revenus)}`}
              />
              <div
                className="w-2.5 rounded-t"
                style={{ height: Math.max(mois.charges ? 3 : 0, (mois.charges / max) * H), background: ROUGE_GRAPH }}
                title={`Charges payées : ${chf(mois.charges)}`}
              />
            </div>
            <span className="text-[10px] whitespace-nowrap" style={{ color: C.sousTexte }}>{mois.m}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-5 mt-4">
        <span className="inline-flex items-center gap-2 text-sm" style={{ color: C.texte }}>
          <span className="w-3 h-3 rounded-sm" style={{ background: INDIGO }} /> Revenus encaissés
        </span>
        <span className="inline-flex items-center gap-2 text-sm" style={{ color: C.texte }}>
          <span className="w-3 h-3 rounded-sm" style={{ background: ROUGE_GRAPH }} /> Charges payées
        </span>
      </div>
    </Carte>
  )
}

function EcranComptabilite() {
  const [onglet, setOnglet] = useState('vue')
  const [periode, setPeriode] = useState('Année')

  return (
    <>
      <span className="text-[11px] font-bold tracking-widest" style={{ color: C.sousTexte }}>FINANCES</span>
      <h1 className="text-2xl md:text-3xl font-black mb-6" style={{ color: C.texte }}>Comptabilité</h1>

      {/* Onglets soulignés */}
      <div className="flex items-center gap-7 overflow-x-auto mb-6" style={{ borderBottom: `1px solid ${C.bord}` }}>
        {ONGLETS_COMPTA.map(o => {
          const actif = onglet === o.id
          return (
            <button
              key={o.id}
              onClick={() => setOnglet(o.id)}
              className="flex items-center gap-2 pb-3 text-[15px] font-semibold whitespace-nowrap flex-shrink-0"
              style={{
                color: actif ? C.texte : C.sousTexte,
                borderBottom: `2px solid ${actif ? C.texte : 'transparent'}`,
                marginBottom: '-1px',
              }}
            >
              <o.icon className="w-4 h-4" />{o.label}
            </button>
          )
        })}
      </div>

      {onglet === 'vue' ? (
        <>
          {/* Période */}
          <Carte className="p-4 mb-5">
            <div className="flex flex-wrap items-center gap-2">
              {['Mois', 'Trimestre', 'Année', 'Personnalisée'].map(p => (
                <button
                  key={p}
                  onClick={() => setPeriode(p)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold"
                  style={periode === p
                    ? { background: C.navBg, color: '#fff' }
                    : { background: '#F3F4F6', color: C.texte }}
                >
                  {p}
                </button>
              ))}
              <span className="ml-auto text-sm" style={{ color: C.sousTexte }}>Année 2026</span>
            </div>
          </Carte>

          {/* Indicateurs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
            {INDICATEURS.map(k => (
              <div key={k.label} className="rounded-2xl p-5" style={{ background: k.fond, border: `1px solid ${k.teinte}22` }}>
                <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: k.teinte }}>
                  <k.icon className="w-4 h-4 flex-shrink-0" />{k.label}
                </span>
                <p className="text-2xl font-black mt-2 leading-none" style={{ color: k.teinte }}>{k.valeur}</p>
                <p className="text-xs mt-2" style={{ color: C.sousTexte }}>{k.sous}</p>
              </div>
            ))}
          </div>

          <GraphiqueDouzeMois />
        </>
      ) : (
        <Carte className="overflow-hidden">
          {onglet === 'clients' && (
            <>
              <LigneListe titre="2026-0033 · Hôtel du Cervin" sous="Échéance 16.08.2026" droite={chf(32750)} pastille={<Pastille texte="Impayée" />} />
              <LigneListe titre="2026-0031 · Boulangerie Delacroix" sous="Payée le 26.07.2026" droite={chf(6280)} pastille={<Pastille texte="Payée" couleur={C.vert} fond={C.vertFond} />} />
              <LigneListe titre="2026-0028 · Garage Praz SA" sous="En retard de 18 jours · 1 rappel envoyé" droite={chf(2890)} pastille={<Pastille texte="En retard" couleur={C.rouge} fond={C.rougeFond} />} />
            </>
          )}
          {onglet === 'fournisseurs' && (
            <>
              <LigneListe titre="SF-88214 · Sanitas Trösch SA" sous="Fournitures · payée le 20.07.2026" droite={chf(4508)} pastille={<Pastille texte="Payée" couleur={C.vert} fond={C.vertFond} />} />
              <LigneListe titre="TL-4417 · Tobler Systèmes" sous="Fournitures · échéance 19.08.2026" droite={chf(962.5)} pastille={<Pastille texte="À payer" />} />
            </>
          )}
          {onglet === 'heures' && (
            <>
              <LigneListe titre="Marc Fournier" sous="Juillet 2026 · 31.0 h" droite={chf(2108)} />
              <LigneListe titre="Julien Rossier" sous="Juillet 2026 · 18.0 h" droite={chf(1116)} />
            </>
          )}
          {onglet === 'extraits' && (
            <LigneListe titre="Relevé BCVs · juillet 2026" sous="Importé le 01.08.2026 · 14 écritures" pastille={<Pastille texte="Rapproché" couleur={C.vert} fond={C.vertFond} />} />
          )}
        </Carte>
      )}
    </>
  )
}

// Team : titre « Vue d'ensemble », deux onglets pleine largeur (Employés /
// Comptable · Fiduciaire), une barre d'outils, puis le tableau avec sa
// colonne d'actions — comme la page réelle.
const EMPLOYES_DEMO = [
  { initiales: 'MF', nom: 'Marc Fournier', email: 'marc@demo.ch', tel: '079 000 00 01', taux: '68,00 CHF' },
  { initiales: 'JR', nom: 'Julien Rossier', email: 'julien@demo.ch', tel: '079 000 00 02', taux: '62,00 CHF' },
  { initiales: 'TD', nom: 'Thomas Dubois', email: 'demo@newrigen.ch', tel: null, taux: '95,00 CHF' },
]

const COMPTABLES_DEMO = [
  { initiales: 'FV', nom: 'Fiduciaire Valais SA', email: 'compta@fiduciaire-vs.ch', tel: '027 000 99 99', taux: '—' },
]

function TableauPersonnes({ gens }) {
  return (
    <Carte className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.bord}` }}>
              {['Employé', 'Contact', 'Taux/h', 'Statut', 'Actions'].map(c => (
                <th key={c} className="text-left px-5 py-3.5 text-[11px] font-bold tracking-wider whitespace-nowrap" style={{ color: C.sousTexte }}>
                  {c.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gens.map((p, i) => (
              <tr key={p.nom} style={{ borderTop: i === 0 ? 'none' : `1px solid ${C.bord}` }}>
                <td className="px-5 py-4">
                  <span className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: C.navBg, color: '#fff' }}>
                      {p.initiales[0]}
                    </span>
                    <span className="font-semibold whitespace-nowrap" style={{ color: C.texte }}>{p.initiales}</span>
                    <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: C.sousTexte }} />
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="flex items-center gap-2 whitespace-nowrap" style={{ color: C.texte }}>
                    <Mail className="w-4 h-4 flex-shrink-0" style={{ color: C.sousTexte }} />{p.email}
                  </span>
                  <span className="flex items-center gap-2 mt-1 whitespace-nowrap" style={{ color: C.sousTexte }}>
                    <Phone className="w-4 h-4 flex-shrink-0" />{p.tel || '—'}
                  </span>
                </td>
                <td className="px-5 py-4 font-bold whitespace-nowrap" style={{ color: C.texte }}>{p.taux}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap" style={{ background: C.vertFond, color: C.vert }}>
                    <ToggleRight className="w-3.5 h-3.5" /> Actif
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="flex items-center gap-3" style={{ color: C.sousTexte }}>
                    <SquarePen className="w-4 h-4" />
                    <KeyRound className="w-4 h-4" />
                    <Trash2 className="w-4 h-4" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Carte>
  )
}

function EcranTeam() {
  const [onglet, setOnglet] = useState('employes')
  const gens = onglet === 'employes' ? EMPLOYES_DEMO : COMPTABLES_DEMO

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-black mb-6" style={{ color: C.texte }}>Vue d'ensemble</h1>

      {/* Onglets pleine largeur */}
      <div className="flex items-center gap-1 p-1.5 rounded-xl mb-5" style={{ background: '#EEF1F5' }}>
        {[
          { id: 'employes', label: 'Employés', icon: Users },
          { id: 'comptables', label: 'Comptable / Fiduciaire', icon: Calculator },
        ].map(o => {
          const actif = onglet === o.id
          return (
            <button
              key={o.id}
              onClick={() => setOnglet(o.id)}
              className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors"
              style={actif
                ? { background: '#fff', color: C.texte, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
                : { color: C.sousTexte }}
            >
              <o.icon className="w-4 h-4 flex-shrink-0" />
              {o.label}
            </button>
          )
        })}
      </div>

      {/* Barre d'outils */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex items-center gap-2 rounded-xl px-4 py-2.5 flex-1 min-w-[10rem]" style={{ background: C.carte, border: `1px solid ${C.bord}` }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: C.sousTexte }} />
        </div>
        <span className="text-sm font-medium px-3 py-2 rounded-lg flex-shrink-0" style={{ background: '#EEF1F5', color: C.sousTexte }}>
          {gens.length} {onglet === 'employes' ? (gens.length > 1 ? 'employés' : 'employé') : (gens.length > 1 ? 'comptables' : 'comptable')}
        </span>
        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold flex-shrink-0" style={{ background: C.navBg, color: '#fff' }}>
          <UserPlus className="w-4 h-4" /> {onglet === 'employes' ? 'Ajouter un employé' : 'Ajouter un comptable'}
        </span>
        {onglet === 'employes' && (
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold flex-shrink-0" style={{ background: '#EEF2FF', color: '#4F46E5' }}>
            <UserPlus className="w-4 h-4" /> Mon compte terrain
          </span>
        )}
      </div>

      <TableauPersonnes gens={gens} />
    </>
  )
}

// Catalogue de produits : carte d'import en haut (choix du fichier,
// auto-catégorisation, déchargement, ajout manuel), puis la liste défilante
// avec son compteur — comme la page réelle. Ce n'est pas un tableau.
const PRODUITS_DEMO = [
  { n: 'Carottage de dalle au moyen de foreuse mécanique avec mèche circulaire 100mm', u: 'Prestation', prix: 172.96 },
  { n: 'Carottage de dalle au moyen de foreuse mécanique avec mèche circulaire 120mm', u: 'Prestation', prix: 172.96 },
  { n: 'Carottage de dalle au moyen de foreuse mécanique avec mèche circulaire 150mm', u: 'Prestation', prix: 216.20 },
  { n: "M123 – CHAUFFAGE – DANFOSS RA-N Vanne 3/4 '' à thermostat", u: 'pcs', prix: 48.00, achat: 27.00 },
  { n: 'Chaudière à pellets 24 kW — rendement 94%', u: 'pcs', prix: 8900.00, achat: 6230.00 },
  { n: 'Pompe à chaleur air/eau 16 kW', u: 'pcs', prix: 6450.00, achat: 4515.00 },
  { n: 'Ballon tampon 800 L avec isolation', u: 'pcs', prix: 2180.00, achat: 1526.00 },
  { n: 'Radiateur acier 600×1200 — blanc RAL 9010', u: 'pcs', prix: 285.00, achat: 178.00 },
  { n: 'Chauffe-eau 300 L classe énergétique B', u: 'pcs', prix: 1840.00, achat: 1288.00 },
  { n: 'Colonne de douche encastrée thermostatique', u: 'pcs', prix: 890.00, achat: 534.00 },
  { n: 'Tube multicouche 20 mm — couronne 50 m', u: 'm', prix: 7.40, achat: 4.10 },
  { n: 'Pose et raccordement sanitaire', u: 'Prestation', prix: 95.00 },
]

function BoutonCatalogue({ icon: Icon, children, couleur }) {
  return (
    <span
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold flex-shrink-0"
      style={{ background: '#fff', border: `1px solid ${couleur ? `${couleur}55` : C.bord}`, color: couleur || C.texte }}
    >
      <Icon className="w-4 h-4" />{children}
    </span>
  )
}

function EcranProduits() {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-7 h-7 flex-shrink-0" style={{ color: C.texte }} />
        <h1 className="text-2xl md:text-3xl font-black" style={{ color: C.texte }}>Catalogue de produits</h1>
      </div>

      {/* Import du catalogue */}
      <Carte className="p-6 mb-5">
        <p className="text-[11px] font-bold tracking-wider mb-3" style={{ color: C.sousTexte }}>IMPORTER UN CATALOGUE</p>
        <BoutonCatalogue icon={Upload}>Choisir un fichier</BoutonCatalogue>
        <p className="text-sm mt-3" style={{ color: C.sousTexte }}>
          CSV, Excel (.xlsx/.xls), ODS, TXT — colonnes : Produit, Unité, Prix HT, TVA, Prix TTC
        </p>
        <div className="flex flex-wrap gap-3 pt-4 mt-4" style={{ borderTop: `1px solid ${C.bord}` }}>
          <BoutonCatalogue icon={Sparkles} couleur="#6366F1">Auto-catégoriser</BoutonCatalogue>
          <BoutonCatalogue icon={XCircle} couleur={C.rouge}>Décharger</BoutonCatalogue>
        </div>
        <div className="pt-4 mt-4" style={{ borderTop: `1px solid ${C.bord}` }}>
          <BoutonCatalogue icon={Plus} couleur={C.vert}>Ajouter un produit</BoutonCatalogue>
        </div>
      </Carte>

      {/* Liste des produits */}
      <Carte className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3" style={{ background: '#F9FAFB', borderBottom: `1px solid ${C.bord}` }}>
          <span className="text-sm font-bold tracking-wide" style={{ color: C.texte }}>{PRODUITS_DEMO.length} PRODUITS</span>
          <span className="inline-flex items-center gap-1.5 text-sm" style={{ color: C.sousTexte }}>
            <Tag className="w-4 h-4" /> Cliquer la catégorie pour la changer
          </span>
        </div>

        <div className="p-4 pb-2">
          <div className="flex items-center gap-2 rounded-lg px-4 py-2.5" style={{ background: '#F8FAFC', border: `1px solid ${C.bord}` }}>
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: C.sousTexte }} />
            <span className="text-sm" style={{ color: '#B9C0CC' }}>Rechercher un produit…</span>
          </div>
        </div>

        <div className="max-h-[26rem] overflow-y-auto">
          {PRODUITS_DEMO.map((p, i) => (
            <div key={p.n} className="flex items-start justify-between gap-4 px-5 py-4" style={{ borderTop: i === 0 ? 'none' : `1px solid ${C.bord}` }}>
              <div className="min-w-0">
                <p className="text-[15px] leading-snug" style={{ color: C.texte }}>{p.n}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-sm" style={{ color: C.sousTexte }}>Unité</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md" style={{ background: '#EDE9FE', color: '#7C3AED' }}>{p.u}</span>
                  <span className="text-xs px-2.5 py-1 rounded-md" style={{ background: '#fff', border: `1px solid ${C.bord}`, color: C.sousTexte }}>
                    {p.achat != null ? `achat ${p.achat.toFixed(2)}` : 'achat —'}
                  </span>
                </div>
              </div>
              <span className="flex items-center gap-2 flex-shrink-0 pt-0.5">
                <span className="text-[15px] font-bold whitespace-nowrap" style={{ color: C.texte }}>{p.prix.toFixed(2)} CHF</span>
                <Pencil className="w-4 h-4" style={{ color: C.sousTexte }} />
              </span>
            </div>
          ))}
        </div>
      </Carte>
    </>
  )
}

// Paramètres : quatre onglets (Entreprise, Documents, Emails, Abonnement),
// un en-tête de section à icône, puis une carte dont chaque ligne porte son
// propre bouton « Enregistrer » — comme la page réelle.
const ONGLETS_PARAM = [
  { id: 'entreprise', label: 'Entreprise', icon: Building2 },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'emails', label: 'Emails', icon: Mail },
  { id: 'abonnement', label: 'Abonnement', icon: CreditCard },
]

function EnTeteSection({ icon: Icon, titre, sous }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: C.navBg }}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0 pt-0.5">
        <p className="font-bold" style={{ color: C.texte }}>{titre}</p>
        <p className="text-sm mt-0.5" style={{ color: C.sousTexte }}>{sous}</p>
      </div>
    </div>
  )
}

// Faux champ : l'apparence d'une zone de saisie, sans en être une.
function FauxChamp({ valeur, placeholder, etroit }) {
  return (
    <div
      className={`px-4 py-2.5 rounded-lg text-sm ${etroit ? 'w-24' : 'flex-1'}`}
      style={{
        background: '#F8FAFC',
        border: `1px solid ${C.bord}`,
        color: valeur ? C.texte : '#B9C0CC',
        fontFamily: placeholder ? 'ui-monospace, monospace' : 'inherit',
      }}
    >
      {valeur || placeholder}
    </div>
  )
}

function BoutonEnregistrer({ inactif }) {
  return (
    <span
      className="px-5 py-2.5 rounded-lg text-sm font-bold flex-shrink-0"
      style={inactif
        ? { background: '#CBD5E1', color: '#F8FAFC' }
        : { background: C.navBg, color: '#fff' }}
    >
      Enregistrer
    </span>
  )
}

function LigneParam({ label, description, children }) {
  return (
    <div className="px-6 py-5" style={{ borderTop: `1px solid ${C.bord}` }}>
      <p className="text-[11px] font-bold tracking-wider mb-1" style={{ color: C.sousTexte }}>{label}</p>
      {description && <p className="text-sm mb-3 leading-relaxed" style={{ color: '#9CA3AF' }}>{description}</p>}
      <div className={description ? '' : 'mt-2'}>{children}</div>
    </div>
  )
}

function EcranParametres() {
  const [onglet, setOnglet] = useState('entreprise')

  return (
    <div className="max-w-2xl mx-auto w-full">
      <h1 className="text-3xl font-black" style={{ color: C.texte }}>Paramètres</h1>
      <p className="text-sm mt-1 mb-6" style={{ color: C.sousTexte }}>Configurez votre compte et vos préférences</p>

      {/* Onglets */}
      <div className="flex items-center gap-1 p-1.5 rounded-xl mb-6 overflow-x-auto" style={{ background: '#EEF1F5' }}>
        {ONGLETS_PARAM.map(o => {
          const actif = onglet === o.id
          return (
            <button
              key={o.id}
              onClick={() => setOnglet(o.id)}
              className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors"
              style={actif
                ? { background: '#fff', color: C.texte, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
                : { color: C.sousTexte }}
            >
              <o.icon className="w-4 h-4 flex-shrink-0" />
              {o.label}
            </button>
          )
        })}
      </div>

      {onglet === 'entreprise' && (
        <>
          <EnTeteSection icon={Building2} titre="Mon entreprise"
            sous="Informations de base affichées dans l'application et sur vos documents" />
          <Carte className="overflow-hidden">
            <LigneParam label="NOM DE L'ENTREPRISE">
              <div className="flex items-center gap-3">
                <FauxChamp valeur="Sanitaire & Chauffage Démo Sàrl" />
                <BoutonEnregistrer />
              </div>
            </LigneParam>
            <LigneParam
              label="MARGE CIBLE"
              description="Votre objectif de marge. C'est le seul chiffre utilisé : il colore les marges partout dans l'application — dashboard, devis, saisie et suivi de chantier. Vert dès que l'objectif est atteint, orange en dessous, rouge si le chantier perd de l'argent. Ajustable chantier par chantier."
            >
              <div className="flex items-center gap-3">
                <FauxChamp valeur="15" etroit />
                <span className="text-sm" style={{ color: C.sousTexte }}>%</span>
                <BoutonEnregistrer />
              </div>
            </LigneParam>
            <LigneParam label="IBAN" description="Affiché sur les factures PDF avec le QR de paiement">
              <div className="flex items-center gap-3">
                <FauxChamp valeur="CH93 0076 2011 6238 5295 7" />
                <BoutonEnregistrer />
              </div>
            </LigneParam>
            <LigneParam label="COULEUR PRINCIPALE" description="Utilisée sur vos devis et factures PDF">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg flex-shrink-0" style={{ background: '#1F2937', border: `1px solid ${C.bord}` }} />
                <FauxChamp valeur="#1F2937" />
                <span className="text-sm font-medium flex-shrink-0" style={{ color: C.sousTexte }}>Défaut</span>
              </div>
            </LigneParam>
          </Carte>
        </>
      )}

      {onglet === 'documents' && (
        <>
          <EnTeteSection icon={FileText} titre="Signature et timbre"
            sous="Appliqués automatiquement sur vos devis, factures et bons de régie" />
          <Carte className="overflow-hidden">
            <LigneParam label="SIGNATURE" description="Utilisez la souris ou le doigt pour signer">
              <div className="rounded-lg px-4 py-8 text-center mb-3" style={{ background: '#F8FAFC', border: `1px dashed ${C.bord}` }}>
                <span className="text-2xl italic" style={{ color: C.sousTexte, fontFamily: 'cursive' }}>Thomas Dubois</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <BoutonFactice petit>Dessiner</BoutonFactice>
                <BoutonFactice petit>Importer une image</BoutonFactice>
                <span className="text-xs self-center" style={{ color: C.vert }}>Signature enregistrée</span>
              </div>
            </LigneParam>
            <LigneParam label="TIMBRE DE L'ENTREPRISE" description="PNG, JPG ou SVG — fond transparent recommandé">
              <div className="rounded-lg px-4 py-8 text-center mb-3" style={{ background: '#F8FAFC', border: `1px dashed ${C.bord}` }}>
                <span className="text-sm" style={{ color: C.sousTexte }}>Timbre enregistré</span>
              </div>
              <BoutonFactice petit>Changer l'image</BoutonFactice>
            </LigneParam>
            <LigneParam label="ANNEXE AUX DEVIS" description="PDF joint automatiquement à chaque envoi de devis">
              <div className="flex items-center gap-3">
                <FauxChamp valeur="conditions_generales.pdf" />
                <BoutonFactice petit>Remplacer</BoutonFactice>
              </div>
            </LigneParam>
          </Carte>
        </>
      )}

      {onglet === 'emails' && (
        <>
          <EnTeteSection icon={Mail} titre="Messages et alertes"
            sous="Textes envoyés à vos clients et adresses qui reçoivent les alertes" />
          <Carte className="overflow-hidden">
            <LigneParam label="MESSAGE — ENVOI DE DEVIS" description="Texte inclus dans chaque email d'envoi de devis">
              <div className="flex items-start gap-3">
                <FauxChamp valeur="Bonjour, veuillez trouver ci-joint notre devis. Nous restons à disposition pour toute question. Cordialement." />
                <BoutonEnregistrer />
              </div>
            </LigneParam>
            <LigneParam label="MESSAGE — ENVOI DE FACTURES" description="Texte inclus dans chaque email d'envoi de facture">
              <div className="flex items-start gap-3">
                <FauxChamp valeur="Bonjour, veuillez trouver ci-joint votre facture. Cordialement." />
                <BoutonEnregistrer />
              </div>
            </LigneParam>
            <LigneParam label="EMAIL RAPPELS DE PAIEMENT" description="Adresse qui reçoit les relances de factures impayées">
              <div className="flex items-center gap-3">
                <FauxChamp valeur="contact@demo.ch" />
                <BoutonEnregistrer />
              </div>
            </LigneParam>
            <LigneParam label="EMAIL ALERTE MARGE FAIBLE" description="Prévenu dès qu'un chantier passe sous l'objectif de marge">
              <div className="flex items-center gap-3">
                <FauxChamp valeur="contact@demo.ch" />
                <BoutonEnregistrer />
              </div>
            </LigneParam>
          </Carte>
        </>
      )}

      {onglet === 'abonnement' && (
        <>
          <EnTeteSection icon={CreditCard} titre="Mon abonnement"
            sous="Offre, sièges employés et consommation" />
          <Carte className="overflow-hidden">
            <div className="grid grid-cols-3 gap-3 p-6">
              {[['Offre', 'Premium'], ['Facturation', 'Annuelle'], ['Expiration', '02.12.2026']].map(([l, v]) => (
                <div key={l} className="rounded-xl px-3 py-3 text-center" style={{ background: '#F8FAFC' }}>
                  <p className="text-[11px]" style={{ color: C.sousTexte }}>{l}</p>
                  <p className="text-sm font-bold mt-1" style={{ color: C.texte }}>{v}</p>
                </div>
              ))}
            </div>
            <LigneParam label="SIÈGES EMPLOYÉS" description="Employés inclus dans votre offre">
              <div className="flex items-center gap-3">
                <FauxChamp valeur="3 employés sur 5 inclus" />
                <BoutonFactice petit>Modifier</BoutonFactice>
              </div>
            </LigneParam>
            <LigneParam label="DEVIS VOCAL IA">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: C.texte }}>Dictez vos devis, l'IA les structure</span>
                <Pastille texte="Activé" couleur={C.vert} fond={C.vertFond} />
              </div>
            </LigneParam>
            <LigneParam label="CRÉDITS IA" description="Crédits utilisés ce mois">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 h-2 rounded-full" style={{ background: '#F8FAFC' }}>
                  <div className="h-2 rounded-full" style={{ width: '28%', background: C.teal }} />
                </div>
                <span className="text-sm font-bold flex-shrink-0" style={{ color: C.texte }}>4,20 / 15,00 CHF</span>
              </div>
            </LigneParam>
            <LigneParam label="COURRIERS POSTAUX" description="Devis et factures envoyés par la poste">
              <div className="grid grid-cols-3 gap-3">
                {[['Ce mois', '2'], ['Coût du mois', '4,40 CHF'], ['Total cumulé', '38,60 CHF']].map(([l, v]) => (
                  <div key={l} className="rounded-xl px-3 py-3 text-center" style={{ background: '#F8FAFC' }}>
                    <p className="text-[11px]" style={{ color: C.sousTexte }}>{l}</p>
                    <p className="text-sm font-bold mt-1" style={{ color: C.texte }}>{v}</p>
                  </div>
                ))}
              </div>
            </LigneParam>
          </Carte>
        </>
      )}
    </div>
  )
}

const ECRANS = {
  dashboard: EcranDashboard,
  agenda: EcranAgenda,
  importer: EcranImporter,
  saisie: EcranSaisie,
  regie: EcranRegie,
  intervention: EcranIntervention,
  comptabilite: EcranComptabilite,
  team: EcranTeam,
  produits: EcranProduits,
  parametres: EcranParametres,
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function Demo() {
  const [ecran, setEcran] = useState('dashboard')
  const [menuOuvert, setMenuOuvert] = useState(false)
  const [bandeauReduit, setBandeauReduit] = useState(false)
  // Sections repliables de la barre latérale. On mémorise celles qui sont
  // fermées : par défaut tout est ouvert, comme à la première connexion.
  const [replieees, setRepliees] = useState({})
  const Ecran = ECRANS[ecran]

  const basculerSection = (nom) =>
    setRepliees(prec => ({ ...prec, [nom]: !prec[nom] }))

  // Une entrée de menu : toujours la même icône de document, comme dans
  // l'application. `decale` sert aux entrées d'un sous-groupe.
  const entree = (item, decale) => (
    <button
      key={item.id}
      onClick={() => { setEcran(item.id); setMenuOuvert(false) }}
      className={`w-full flex items-center gap-2.5 py-2 rounded-lg text-sm font-medium text-left transition-colors ${decale ? 'pl-6 pr-2.5' : 'px-2.5'}`}
      style={ecran === item.id ? { background: C.navActif, color: '#fff' } : { color: C.navTexte }}
    >
      <FileText className="w-4 h-4 flex-shrink-0" />
      {item.label}
    </button>
  )

  const chevron = (ouvert, couleur) => (
    /* Deux icônes plutôt qu'une rotation CSS : la feuille de style du site
       force `transform: none !important` sur ses éléments animés, ce qui
       neutralisait la rotation du chevron. */
    ouvert
      ? <ChevronDown className="w-3 h-3 flex-shrink-0" style={{ color: couleur }} />
      : <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: couleur }} />
  )

  const navigation = (
    <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-4">
      {MENU.map(section => {
        const actif = idsDeSection(section.items).includes(ecran)
        const ouverte = replieees[section.section] !== true
        const couleur = actif ? C.teal : C.navTexte
        return (
          <div key={section.section}>
            <button
              onClick={() => basculerSection(section.section)}
              className="w-full flex items-center justify-between gap-2 px-2 py-1"
            >
              <span className="flex items-center gap-2 min-w-0">
                <section.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: couleur }} />
                <span className="text-[11px] font-bold tracking-wider truncate" style={{ color: couleur }}>{section.section}</span>
              </span>
              {chevron(ouverte, couleur)}
            </button>

            {ouverte && (
              <div className="space-y-0.5 mt-0.5">
                {section.items.map(item => {
                  if (!item.sousSection) return entree(item, false)

                  const sousActif = item.items.some(s => s.id === ecran)
                  const sousOuvert = replieees[item.sousSection] !== true
                  const sousCouleur = sousActif ? C.teal : C.navTexte
                  return (
                    <div key={item.sousSection}>
                      <button
                        onClick={() => basculerSection(item.sousSection)}
                        className="w-full flex items-center justify-between gap-2 px-2.5 py-2"
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <item.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: sousCouleur }} />
                          <span className="text-[11px] font-bold tracking-wider truncate" style={{ color: sousCouleur }}>{item.sousSection}</span>
                        </span>
                        {chevron(sousOuvert, sousCouleur)}
                      </button>
                      {sousOuvert && (
                        <div className="space-y-0.5">
                          {item.items.map(s => entree(s, true))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )

  const enTeteLaterale = (
    <>
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded flex items-center justify-center font-black text-[11px] flex-shrink-0" style={{ background: C.teal, color: '#0A0A0F' }}>N</div>
          <span className="font-black text-sm tracking-wide text-white">NEWRIGEN</span>
        </div>
        <div className="flex items-center gap-2">
          <Sun className="w-3.5 h-3.5" style={{ color: C.navTexte }} />
          <PanelLeftClose className="w-3.5 h-3.5" style={{ color: C.navTexte }} />
        </div>
      </div>
      <div className="mx-4 mb-4 flex items-center justify-between rounded-xl bg-white px-3 py-2.5">
        <span className="font-bold text-sm" style={{ color: C.texte }}>S&C</span>
        <ChevronsUpDown className="w-3.5 h-3.5" style={{ color: C.sousTexte }} />
      </div>
    </>
  )

  return (
    <div className="min-h-screen flex" style={{ background: C.fond }}>
      {/* Barre latérale — bureau */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0" style={{ background: C.navBg }}>
        {enTeteLaterale}
        {navigation}
        <div className="p-4">
          <Link to="/" className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium hover:text-white transition-colors" style={{ color: C.navTexte }}>
            <ArrowLeft className="w-3.5 h-3.5" /> Retour au site
          </Link>
        </div>
      </aside>

      {/* Barre latérale — mobile */}
      {menuOuvert && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex flex-col" style={{ background: C.navBg }}>
            {enTeteLaterale}
            {navigation}
          </div>
          <button className="flex-1" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setMenuOuvert(false)} aria-label="Fermer le menu" />
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Bandeau démonstration */}
        <div className="px-4 md:px-8 py-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs md:text-sm text-center" style={{ background: C.navBg, color: '#fff' }}>
          <span>Démonstration de l'application, avec des données d'exemple</span>
          <Link to="/tarifs" className="font-bold underline" style={{ color: C.teal }}>
            Essayer 30 jours gratuitement →
          </Link>
        </div>

        {/* Barre du haut — mobile */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3" style={{ background: C.navBg }}>
          <button onClick={() => setMenuOuvert(true)} className="text-white" aria-label="Ouvrir le menu">
            <LayoutDashboard className="w-5 h-5" />
          </button>
          <span className="font-black text-sm tracking-wide text-white">NEWRIGEN</span>
          <Link to="/" className="ml-auto text-xs" style={{ color: C.navTexte }}>Retour au site</Link>
        </div>

        <main className="flex-1 p-4 md:p-8 min-w-0">
          <Ecran />
        </main>
      </div>

      {/* Rappel : on regarde une démonstration */}
      {bandeauReduit ? (
        <button
          onClick={() => setBandeauReduit(false)}
          className="fixed bottom-5 left-5 z-40 flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold shadow-lg"
          style={{ background: C.navBg, color: '#fff' }}
        >
          <Eye className="w-3.5 h-3.5" /> Démo
        </button>
      ) : (
        <div className="fixed bottom-5 left-5 z-40 max-w-[min(20rem,calc(100vw-2.5rem))] rounded-2xl shadow-2xl overflow-hidden" style={{ background: C.navBg }}>
          <div className="flex items-start gap-3 p-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <Eye className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white leading-tight">Aperçu de l'application</p>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: C.navTexte }}>
                Naviguez librement entre les écrans. C'est une présentation :
                les données sont fictives et rien ne s'y saisit.
              </p>
              <Link
                to="/tarifs"
                className="mt-3 block text-center py-2 rounded-xl text-xs font-bold"
                style={{ background: C.teal, color: '#0A0A0F' }}
              >
                Essayer avec mes données
              </Link>
            </div>
            <button onClick={() => setBandeauReduit(true)} className="flex-shrink-0" style={{ color: C.navTexte }} aria-label="Réduire">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bouton d'aide, comme dans l'application */}
      <span className="fixed bottom-6 right-5 z-30 w-11 h-11 rounded-full shadow-lg flex items-center justify-center" style={{ background: '#2563EB' }}>
        <HelpCircle className="w-5 h-5 text-white" />
      </span>
    </div>
  )
}
