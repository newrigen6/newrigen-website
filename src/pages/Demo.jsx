import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, Calendar, Upload, Package, ClipboardList, Wrench, Calculator,
  Users, Boxes, Settings, ChevronDown, ChevronsUpDown, Search, SlidersHorizontal,
  Plus, HelpCircle, ArrowLeft, Eye, X, Sun, PanelLeftClose, FileText, TrendingUp,
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

const MENU = [
  { section: 'ACCUEIL', items: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
  ] },
  { section: 'DEVIS', items: [
    { id: 'importer', label: 'Importer', icon: Upload },
  ] },
  { section: 'CHANTIERS', items: [
    { id: 'saisie', label: 'Saisie Matériaux', icon: Package },
    { id: 'regie', label: 'Bons de Régie', icon: ClipboardList },
    { id: 'intervention', label: "Bons d'intervention", icon: Wrench },
  ] },
  { section: 'COMPTABILITÉ', items: [
    { id: 'comptabilite', label: 'Comptabilité', icon: Calculator },
  ] },
  { section: 'GESTION', items: [
    { id: 'team', label: 'Team', icon: Users },
    { id: 'produits', label: 'Produits', icon: Boxes },
    { id: 'parametres', label: 'Paramètres', icon: Settings },
  ] },
]

const chf = (v) => v.toLocaleString('fr-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' CHF'

// Jeu de données d'exemple. Les coûts et marges correspondent à ce que
// l'application calcule réellement à partir des matériaux et des heures.
const DEVIS = [
  { client: 'Villa Cheseaux', adresse: 'Chemin des Vignes 7, 1958 Uvrier', date: '26.07.2026', montant: 4150, materiaux: 2620, mo: 408, cout: 3028, margeChf: 1122, margePct: 27.0, statut: 'En cours' },
  { client: 'Résidence Les Mélèzes', adresse: 'Route de Sierre 42, 1950 Sion', date: '20.07.2026', montant: 18400, materiaux: 12216, mo: 1009, cout: 13225, margeChf: 5175, margePct: 28.1, statut: 'En cours', sousObjectif: true },
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
  const COLONNES = ['Nature', 'Client', 'Adresse', 'Date', 'Montant', 'Matériaux', "Main d'œuvre", 'Coût total', 'Marge CHF', 'Marge %', 'Statut']
  return (
    <>
      <Titre eyebrow="RENTABILITÉ" titre="Tableau de bord" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Chiffre d'affaires total", valeur: '64 470,00 CHF', sous: 'Tous devis confondus' },
          { label: 'Devis en cours (2)', valeur: '22 550,00 CHF', sous: 'À facturer' },
          { label: 'Marges réelles cumulées', valeur: '27 890,50 CHF', sous: "Mat. + main d'œuvre déduits" },
          { label: "Marges sous l'objectif (< 30 %)", valeur: '1 devis', sous: 'À surveiller', alerte: true },
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

      <Carte className="p-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 rounded-xl px-4 py-2.5" style={{ background: C.fond }}>
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: C.sousTexte }} />
            <span className="text-sm" style={{ color: C.sousTexte }}>Rechercher un client…</span>
          </div>
          <span className="flex items-center justify-center rounded-xl px-3 py-2.5" style={{ background: C.fond }}>
            <SlidersHorizontal className="w-4 h-4" style={{ color: C.sousTexte }} />
          </span>
          {['Tous statuts', 'Toutes marges'].map(f => (
            <span key={f} className="flex items-center justify-between gap-2 rounded-xl px-4 py-2.5 text-sm min-w-[9rem]" style={{ background: C.fond, color: C.texte }}>
              {f}<ChevronDown className="w-3.5 h-3.5" style={{ color: C.sousTexte }} />
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
                    <span className="inline-flex items-center gap-1">{c.toUpperCase()}<ChevronsUpDown className="w-3 h-3 opacity-60" /></span>
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

function EcranAgenda() {
  const jours = ['Lundi 3', 'Mardi 4', 'Mercredi 5', 'Jeudi 6', 'Vendredi 7']
  const rdv = {
    'Lundi 3': [{ h: '08:00', t: 'Résidence Les Mélèzes', d: 'Pose chaudière' }],
    'Mercredi 5': [{ h: '10:30', t: 'Villa Cheseaux', d: 'Métré salle de bain' }],
    'Jeudi 6': [{ h: '14:00', t: 'Hôtel du Cervin', d: 'Contrôle PAC' }],
    'Vendredi 7': [{ h: '09:00', t: 'Mme Berger', d: 'Dépannage' }],
  }
  return (
    <>
      <Titre titre="Agenda" action={<BoutonFactice principal><Plus className="w-4 h-4" /> Nouveau RDV</BoutonFactice>} />
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: C.texte, color: '#fff' }}>Mois</span>
        <span className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: C.carte, color: C.sousTexte, border: `1px solid ${C.bord}` }}>Année</span>
        <span className="ml-auto text-xs" style={{ color: C.sousTexte }}>Connecter Google Calendar</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {jours.map(j => (
          <Carte key={j} className="p-4 min-h-[150px]">
            <p className="text-[11px] font-bold mb-3 tracking-wide" style={{ color: C.sousTexte }}>{j.toUpperCase()}</p>
            <div className="space-y-2">
              {(rdv[j] || []).map(r => (
                <div key={r.h} className="rounded-lg px-3 py-2" style={{ background: `${C.teal}1A`, borderLeft: `3px solid ${C.teal}` }}>
                  <p className="text-xs font-bold" style={{ color: C.texte }}>{r.h} · {r.t}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: C.sousTexte }}>{r.d}</p>
                </div>
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
      <Titre eyebrow="DEVIS" titre="Importer" />
      <Carte className="p-10 flex flex-col items-center justify-center text-center mb-6" style={{ borderStyle: 'dashed', borderWidth: 2, borderColor: C.bord, background: C.carte }}>
        <Upload className="w-7 h-7 mb-3" style={{ color: C.sousTexte }} />
        <p className="font-bold text-sm mb-1" style={{ color: C.texte }}>Glisser un fichier ici ou cliquer</p>
        <p className="text-xs" style={{ color: C.sousTexte }}>PDF, Excel ou CSV — l'IA lit le document et en extrait les lignes</p>
      </Carte>
      <Carte className="overflow-hidden">
        <p className="px-5 py-3.5 text-sm font-bold" style={{ color: C.texte }}>Derniers imports</p>
        <LigneListe titre="devis_meleze_chauffage.pdf" sous="12 lignes extraites · 20.07.2026" pastille={<Pastille texte="Traité" couleur={C.vert} fond={C.vertFond} />} />
        <LigneListe titre="catalogue_sanitas_2026.xlsx" sous="486 produits · 02.07.2026" pastille={<Pastille texte="Traité" couleur={C.vert} fond={C.vertFond} />} />
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
      <Titre eyebrow="CHANTIER" titre="Saisie des matériaux" action={<BoutonFactice principal><Plus className="w-4 h-4" /> Ajouter</BoutonFactice>} />
      <Carte className="p-5 mb-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Champ label="CHANTIER / DEVIS" valeur="Résidence Les Mélèzes — 2026-014" />
          <Champ label="EMPLOYÉ" valeur="Marc Fournier" />
        </div>
      </Carte>
      <Carte className="overflow-hidden">
        <p className="px-5 py-3.5 text-sm font-bold" style={{ color: C.texte }}>Matériaux saisis sur ce chantier</p>
        {lignes.map(l => (
          <LigneListe key={l.nom} titre={l.nom} sous={`${l.qte} ${l.unite} × ${l.prix.toFixed(2)} · saisi par ${l.par}`} droite={chf(l.qte * l.prix)} />
        ))}
        <div className="flex items-center justify-between px-5 py-3.5" style={{ borderTop: `2px solid ${C.bord}`, background: C.fond }}>
          <span className="text-sm font-bold" style={{ color: C.sousTexte }}>Total matériaux</span>
          <span className="text-lg font-black" style={{ color: C.texte }}>{chf(12216)}</span>
        </div>
      </Carte>
    </>
  )
}

function EcranRegie() {
  return (
    <>
      <Titre eyebrow="CHANTIERS" titre="Bons de Régie" action={<BoutonFactice principal><Plus className="w-4 h-4" /> Nouveau bon</BoutonFactice>} />
      <Carte className="overflow-hidden">
        <LigneListe titre="Résidence Les Mélèzes" sous="Marc Fournier · 8.0 h · 22.07.2026" droite={chf(544)} pastille={<Pastille texte="Signé" couleur={C.vert} fond={C.vertFond} />} />
        <LigneListe titre="Villa Cheseaux" sous="Marc Fournier · 6.0 h · 28.07.2026" droite={chf(408)} pastille={<Pastille texte="En attente de signature" />} />
        <LigneListe titre="Mme Berger — dépannage" sous="Julien Rossier · 2.5 h · 29.07.2026" droite={chf(155)} pastille={<Pastille texte="Signé" couleur={C.vert} fond={C.vertFond} />} />
      </Carte>
      <p className="text-xs mt-3" style={{ color: C.sousTexte }}>
        Le client signe directement sur le téléphone ou la tablette, à la fin de l'intervention.
      </p>
    </>
  )
}

function EcranIntervention() {
  return (
    <>
      <Titre eyebrow="CHANTIERS" titre="Bons d'intervention" action={<BoutonFactice principal><Plus className="w-4 h-4" /> Nouveau bon</BoutonFactice>} />
      <Carte className="overflow-hidden">
        <LigneListe titre="Fuite chasse d'eau — Mme Berger" sous="Rue de Lausanne 9, 1950 Sion · 29.07.2026" pastille={<Pastille texte="Terminé" couleur={C.vert} fond={C.vertFond} />} />
        <LigneListe titre="Contrôle annuel chaudière — Garage Praz SA" sous="Zone Industrielle 3, 1963 Vétroz · 08.08.2026" pastille={<Pastille texte="Planifié" couleur={C.teal} />} />
      </Carte>
    </>
  )
}

function EcranComptabilite() {
  return (
    <>
      <Titre eyebrow="FINANCES" titre="Comptabilité" />
      <div className="rounded-xl px-4 py-3 mb-5 text-sm font-semibold" style={{ background: C.rougeFond, color: C.rouge }}>
        1 facture en retard — 2 890,00 CHF à recouvrer
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { l: 'Encaissé (2026)', v: '6 280,00 CHF', s: '1 facture payée' },
          { l: 'En attente', v: '35 640,00 CHF', s: '2 factures ouvertes' },
          { l: 'Dépenses fournisseurs', v: '5 470,50 CHF', s: '2 factures reçues' },
        ].map(k => (
          <Carte key={k.l} className="p-5">
            <span className="text-xs" style={{ color: C.sousTexte }}>{k.l}</span>
            <p className="text-2xl font-black mt-2 leading-none" style={{ color: C.texte }}>{k.v}</p>
            <p className="text-xs mt-2" style={{ color: C.sousTexte }}>{k.s}</p>
          </Carte>
        ))}
      </div>
      <Carte className="overflow-hidden">
        <p className="px-5 py-3.5 text-sm font-bold" style={{ color: C.texte }}>Factures émises</p>
        <LigneListe titre="2026-0033 · Hôtel du Cervin" sous="Échéance 16.08.2026" droite={chf(32750)} pastille={<Pastille texte="Impayée" />} />
        <LigneListe titre="2026-0031 · Boulangerie Delacroix" sous="Payée le 26.07.2026" droite={chf(6280)} pastille={<Pastille texte="Payée" couleur={C.vert} fond={C.vertFond} />} />
        <LigneListe titre="2026-0028 · Garage Praz SA" sous="En retard de 18 jours · 1 rappel envoyé" droite={chf(2890)} pastille={<Pastille texte="En retard" couleur={C.rouge} fond={C.rougeFond} />} />
      </Carte>
    </>
  )
}

function EcranTeam() {
  const gens = [
    { n: 'Thomas Dubois', r: 'Patron', t: '95.00', h: '—' },
    { n: 'Marc Fournier', r: 'Employé', t: '68.00', h: '31.0 h' },
    { n: 'Julien Rossier', r: 'Employé', t: '62.00', h: '18.0 h' },
  ]
  return (
    <>
      <Titre eyebrow="GESTION" titre="Team" action={<BoutonFactice principal><Plus className="w-4 h-4" /> Ajouter un employé</BoutonFactice>} />
      <Carte className="overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3" style={{ background: C.fond }}>
          <span className="text-[11px] font-bold tracking-wider flex-1" style={{ color: C.sousTexte }}>NOM</span>
          <span className="text-[11px] font-bold tracking-wider w-24" style={{ color: C.sousTexte }}>TAUX/H</span>
          <span className="text-[11px] font-bold tracking-wider w-24 text-right" style={{ color: C.sousTexte }}>CE MOIS</span>
        </div>
        {gens.map(p => (
          <div key={p.n} className="flex items-center gap-3 px-5 py-3.5" style={{ borderTop: `1px solid ${C.bord}` }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: `${C.teal}25`, color: C.texte }}>
              {p.n.split(' ').map(x => x[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: C.texte }}>{p.n}</p>
              <p className="text-xs" style={{ color: C.sousTexte }}>{p.r}</p>
            </div>
            <span className="text-sm w-24" style={{ color: C.texte }}>{p.t}</span>
            <span className="text-sm w-24 text-right font-semibold" style={{ color: C.texte }}>{p.h}</span>
          </div>
        ))}
      </Carte>
    </>
  )
}

function EcranProduits() {
  const produits = [
    { n: 'Chaudière à pellets 24 kW', u: 'pcs', a: 6230, v: 8900, c: 'Chauffage' },
    { n: 'Pompe à chaleur air/eau 16 kW', u: 'pcs', a: 4515, v: 6450, c: 'Chauffage' },
    { n: 'Radiateur acier 600×1200', u: 'pcs', a: 178, v: 285, c: 'Chauffage' },
    { n: 'Chauffe-eau 300 L', u: 'pcs', a: 1288, v: 1840, c: 'Sanitaire' },
    { n: 'Colonne de douche encastrée', u: 'pcs', a: 534, v: 890, c: 'Sanitaire' },
    { n: 'Tube multicouche 20 mm', u: 'm', a: 4.10, v: 7.40, c: 'Tuyauterie' },
    { n: 'Vanne thermostatique', u: 'pcs', a: 27, v: 48, c: 'Tuyauterie' },
  ]
  return (
    <>
      <Titre eyebrow="GESTION" titre="Produits" action={<BoutonFactice principal><Upload className="w-4 h-4" /> Importer un catalogue</BoutonFactice>} />
      <Carte className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: C.fond }}>
                {['Produit', 'Catégorie', 'Unité', 'Prix achat', 'Prix vente', 'Marge'].map(c => (
                  <th key={c} className="text-left px-4 py-3 text-[11px] font-bold tracking-wider whitespace-nowrap" style={{ color: C.sousTexte }}>{c.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {produits.map((p, i) => (
                <tr key={p.n} style={{ borderTop: `1px solid ${C.bord}` }}>
                  <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: C.texte }}>{p.n}</td>
                  <td className="px-4 py-3 whitespace-nowrap"><Pastille texte={p.c} /></td>
                  <td className="px-4 py-3" style={{ color: C.sousTexte }}>{p.u}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: C.sousTexte }}>{p.a.toFixed(2)}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-semibold" style={{ color: C.texte }}>{p.v.toFixed(2)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: C.vert, background: C.vertFond }}>
                      {(((p.v - p.a) / p.v) * 100).toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Carte>
    </>
  )
}

function EcranParametres() {
  return (
    <>
      <Titre eyebrow="GESTION" titre="Paramètres" />
      <div className="grid lg:grid-cols-2 gap-5">
        <Carte className="p-5">
          <p className="text-sm font-bold mb-4" style={{ color: C.texte }}>Entreprise</p>
          <div className="space-y-3">
            <Champ label="RAISON SOCIALE" valeur="Sanitaire & Chauffage Démo Sàrl" />
            <Champ label="ADRESSE" valeur="Rue du Scex 12, 1950 Sion" />
            <Champ label="IBAN (QR-facture)" valeur="CH93 0076 2011 6238 5295 7" />
          </div>
        </Carte>
        <div className="space-y-5">
          <Carte className="p-5">
            <p className="text-sm font-bold mb-1" style={{ color: C.texte }}>Marge cible</p>
            <p className="text-xs mb-4" style={{ color: C.sousTexte }}>
              Sous ce seuil, le devis passe en rouge sur le tableau de bord et une alerte est envoyée.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full" style={{ background: C.fond }}>
                <div className="h-2 rounded-full" style={{ width: '30%', background: C.teal }} />
              </div>
              <span className="text-lg font-black" style={{ color: C.texte }}>30 %</span>
            </div>
          </Carte>
          <Carte className="p-5">
            <p className="text-sm font-bold mb-3" style={{ color: C.texte }}>Signature électronique</p>
            <div className="rounded-xl px-4 py-6 text-center" style={{ background: C.fond, border: `1px dashed ${C.bord}` }}>
              <p className="text-sm italic" style={{ color: C.sousTexte }}>Signature enregistrée</p>
            </div>
            <p className="text-xs mt-3" style={{ color: C.sousTexte }}>Appliquée automatiquement sur les devis, factures et bons de régie.</p>
          </Carte>
        </div>
      </div>
    </>
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
  const Ecran = ECRANS[ecran]

  const navigation = (
    <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-4">
      {MENU.map(section => {
        const actif = section.items.some(i => i.id === ecran)
        return (
          <div key={section.section}>
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-[11px] font-bold tracking-wider" style={{ color: actif ? C.teal : C.navTexte }}>{section.section}</span>
              <ChevronDown className="w-3 h-3" style={{ color: actif ? C.teal : C.navTexte }} />
            </div>
            <div className="space-y-0.5 mt-0.5">
              {section.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setEcran(item.id); setMenuOuvert(false) }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-left transition-colors"
                  style={ecran === item.id ? { background: C.navActif, color: '#fff' } : { color: C.navTexte }}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </button>
              ))}
            </div>
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
