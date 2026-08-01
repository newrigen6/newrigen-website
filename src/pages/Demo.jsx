import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, Calendar, Upload, Package, ClipboardList, Wrench, Calculator,
  Users, Boxes, Settings, ChevronDown, ChevronsUpDown, Search, SlidersHorizontal,
  Plus, HelpCircle, ArrowLeft, Eye, X, Sun, PanelLeftClose, FileText, Building2, Mail, CreditCard,
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

// Agenda : grille mensuelle avec colonne de numéro de semaine, en-têtes
// Lun→Dim, et le panneau « Prochains RDVs » — comme la page réelle.
const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

function EcranAgenda() {
  const aujourdhui = new Date()
  const annee = aujourdhui.getFullYear()
  const mois = aujourdhui.getMonth()
  const premier = new Date(annee, mois, 1)
  const decalage = (premier.getDay() + 6) % 7 // Lundi = 0
  const nbJours = new Date(annee, mois + 1, 0).getDate()
  const nomMois = premier.toLocaleDateString('fr-CH', { month: 'long', year: 'numeric' })

  // Rendez-vous d'exemple, posés sur des jours fixes du mois affiché
  const RDV = {
    4: [{ h: '08:00', t: 'Les Mélèzes — pose chaudière', c: C.teal }],
    9: [{ h: '10:30', t: 'Villa Cheseaux — métré', c: '#6366F1' }],
    12: [{ h: '14:00', t: 'Hôtel du Cervin — contrôle PAC', c: C.teal }],
    18: [{ h: '09:00', t: 'Mme Berger — dépannage', c: '#F59E0B' }, { h: '15:30', t: 'Garage Praz — devis', c: '#6366F1' }],
    23: [{ h: '11:00', t: 'Boulangerie Delacroix — SAV', c: C.teal }],
  }

  const cellules = []
  for (let i = 0; i < decalage; i++) cellules.push(null)
  for (let j = 1; j <= nbJours; j++) cellules.push(j)
  while (cellules.length % 7 !== 0) cellules.push(null)
  const semaines = []
  for (let i = 0; i < cellules.length; i += 7) semaines.push(cellules.slice(i, i + 7))

  const numeroSemaine = (indexSemaine) => {
    const ref = new Date(annee, mois, 1 + indexSemaine * 7)
    const debut = new Date(annee, 0, 1)
    return Math.ceil(((ref - debut) / 86400000 + debut.getDay() + 1) / 7)
  }

  const prochains = [
    { d: '18', m: nomMois.slice(0, 3), h: '09:00', t: 'Mme Berger — dépannage', l: 'Rue de Lausanne 9, Sion' },
    { d: '18', m: nomMois.slice(0, 3), h: '15:30', t: 'Garage Praz SA — devis', l: 'Zone Industrielle 3, Vétroz' },
    { d: '23', m: nomMois.slice(0, 3), h: '11:00', t: 'Boulangerie Delacroix — SAV', l: 'Grand-Rue 18, Martigny' },
  ]

  return (
    <>
      <Titre titre="Agenda" action={<BoutonFactice principal><Plus className="w-4 h-4" /> Nouveau RDV</BoutonFactice>} />

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: C.texte, color: '#fff' }}>Mois</span>
        <span className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: C.carte, color: C.sousTexte, border: `1px solid ${C.bord}` }}>Année</span>
        <span className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: C.carte, color: C.texte, border: `1px solid ${C.bord}` }}>Aujourd'hui</span>
        <span className="text-sm font-bold capitalize ml-1" style={{ color: C.texte }}>{nomMois}</span>
        <span className="ml-auto text-xs" style={{ color: C.sousTexte }}>Connecter Google Calendar</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Carte className="lg:col-span-2 p-4">
          {/* En-têtes : colonne « Sem » puis Lun→Dim */}
          <div className="grid mb-1" style={{ gridTemplateColumns: '34px repeat(7, minmax(0,1fr))' }}>
            <div className="text-center text-[10px] font-semibold py-2 uppercase tracking-wide" style={{ color: C.sousTexte }} title="Numéro de semaine">Sem</div>
            {JOURS.map(j => (
              <div key={j} className="text-center text-[11px] font-semibold py-2 uppercase tracking-wide" style={{ color: C.sousTexte }}>{j}</div>
            ))}
          </div>

          {semaines.map((semaine, i) => (
            <div key={i} className="grid gap-1 mb-1" style={{ gridTemplateColumns: '34px repeat(7, minmax(0,1fr))' }}>
              <div className="flex items-center justify-center text-[10px] font-semibold" style={{ color: C.sousTexte }}>{numeroSemaine(i)}</div>
              {semaine.map((jour, k) => (
                <div
                  key={k}
                  className="rounded-lg p-1.5 min-h-[74px]"
                  style={{
                    background: jour ? C.carte : 'transparent',
                    border: `1px solid ${jour ? C.bord : 'transparent'}`,
                  }}
                >
                  {jour && (
                    <>
                      <div className="text-[11px] font-semibold mb-1" style={{ color: C.sousTexte }}>{jour}</div>
                      <div className="space-y-1">
                        {(RDV[jour] || []).map(r => (
                          <div key={r.h} className="rounded px-1.5 py-1 text-[10px] font-medium leading-tight truncate"
                            style={{ background: `${r.c}22`, color: C.texte, borderLeft: `2px solid ${r.c}` }}
                            title={`${r.h} ${r.t}`}>
                            {r.h} {r.t}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
          <p className="text-[11px] mt-2" style={{ color: C.sousTexte }}>
            Double-cliquez sur un jour pour ajouter un rendez-vous
          </p>
        </Carte>

        <Carte className="overflow-hidden self-start">
          <p className="px-5 py-3.5 text-sm font-bold" style={{ color: C.texte }}>Prochains RDVs</p>
          {prochains.map((r, i) => (
            <div key={i} className="flex items-start gap-3 px-5 py-3" style={{ borderTop: `1px solid ${C.bord}` }}>
              <div className="text-center flex-shrink-0 w-9">
                <p className="text-base font-black leading-none" style={{ color: C.texte }}>{r.d}</p>
                <p className="text-[10px] uppercase" style={{ color: C.sousTexte }}>{r.m}</p>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate" style={{ color: C.texte }}>{r.h} · {r.t}</p>
                <p className="text-[11px] mt-0.5 truncate" style={{ color: C.sousTexte }}>{r.l}</p>
              </div>
            </div>
          ))}
        </Carte>
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
      <Titre eyebrow="CHANTIER" titre="Saisie des matériaux" action={<BoutonFactice principal><Plus className="w-4 h-4" /> Ajouter un matériau</BoutonFactice>} />

      <Carte className="p-5 mb-5">
        <Champ label="CHANTIER / DEVIS" valeur="Résidence Les Mélèzes — 2026-014" />
      </Carte>

      {/* Bandeau de rentabilité du chantier, comme dans l'application */}
      <Carte className="p-5 mb-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ['Prix devis :', chf(18400), C.texte],
            ['Matériaux :', chf(12216), C.texte],
            ["Main d'œuvre", chf(1009), C.texte],
            ['Marge réelle :', '5 175,00 CHF · 28.1%', C.rouge],
          ].map(([l, v, couleur]) => (
            <div key={l}>
              <p className="text-xs" style={{ color: C.sousTexte }}>{l}</p>
              <p className="text-base font-black mt-1" style={{ color: couleur }}>{v}</p>
            </div>
          ))}
        </div>
      </Carte>

      <Carte className="overflow-hidden">
        <p className="px-5 py-3.5 text-sm font-bold" style={{ color: C.texte }}>Matériaux utilisés</p>
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
function EcranBons({ titre, bons, total, confirmes, enCours }) {
  return (
    <>
      <Titre titre={titre} action={<BoutonFactice principal><Plus className="w-4 h-4" /> Nouveau bon</BoutonFactice>} />

      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: C.texte, color: '#fff' }}>Vue d'ensemble</span>
        <span className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: C.carte, color: C.sousTexte, border: `1px solid ${C.bord}` }}>Créer un bon</span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        {[['Total bons', total], ['Confirmés', confirmes], ['En cours', enCours]].map(([l, v]) => (
          <Carte key={l} className="p-5">
            <span className="text-xs" style={{ color: C.sousTexte }}>{l}</span>
            <p className="text-2xl font-black mt-2 leading-none" style={{ color: C.texte }}>{v}</p>
          </Carte>
        ))}
      </div>

      <Carte className="overflow-hidden">
        {bons.map(b => (
          <div key={b.titre} className="px-5 py-4" style={{ borderTop: `1px solid ${C.bord}` }}>
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
    </>
  )
}

function EcranRegie() {
  return (
    <EcranBons
      titre="Bons de Régie"
      total="3" confirmes="2" enCours="1"
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
      total="2" confirmes="1" enCours="1"
      bons={[
        { titre: "Fuite chasse d'eau — Mme Berger", sous: 'Rue de Lausanne 9, 1950 Sion · 29.07.2026', heures: '2.5', coutMo: 155, nbMateriaux: 1, coutMat: 62, confirme: true },
        { titre: 'Contrôle chaudière — Garage Praz SA', sous: 'Zone Industrielle 3, 1963 Vétroz · 08.08.2026', heures: '1.5', coutMo: 93, nbMateriaux: 0, coutMat: 0, confirme: false },
      ]}
    />
  )
}

function EcranComptabilite() {
  return (
    <>
      <Titre eyebrow="FINANCES" titre="Comptabilité" />
      <div className="rounded-xl px-4 py-3 mb-5" style={{ background: C.rougeFond }}>
        <p className="text-sm font-semibold" style={{ color: C.rouge }}>1 facture en retard — 2 890,00 CHF à recouvrer</p>
        <p className="text-xs mt-0.5" style={{ color: C.rouge, opacity: 0.8 }}>Cliquez pour les voir et relancer vos clients</p>
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
    { n: 'Marc Fournier', c: 'marc@demo.ch · 079 000 00 01', t: '68.00', actif: true },
    { n: 'Julien Rossier', c: 'julien@demo.ch · 079 000 00 02', t: '62.00', actif: true },
    { n: 'Thomas Dubois', c: 'demo@newrigen.ch', t: '95.00', actif: true, soi: true },
  ]
  return (
    <>
      <Titre titre="Team" action={<BoutonFactice principal><Plus className="w-4 h-4" /> Ajouter un employé</BoutonFactice>} />

      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: C.texte, color: '#fff' }}>Vue d'ensemble</span>
        <span className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: C.carte, color: C.sousTexte, border: `1px solid ${C.bord}` }}>Détail par chantier</span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        {[['Heures', '49.0', 'heures travaillées'], ['Rapports', '6', 'ce mois'], ['Chantiers', '4', 'en cours']].map(([l, v, s]) => (
          <Carte key={l} className="p-5">
            <span className="text-xs" style={{ color: C.sousTexte }}>{l}</span>
            <p className="text-2xl font-black mt-2 leading-none" style={{ color: C.texte }}>{v}</p>
            <p className="text-xs mt-2" style={{ color: C.sousTexte }}>{s}</p>
          </Carte>
        ))}
      </div>

      <Carte className="overflow-hidden mb-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: C.fond }}>
                {['Employé', 'Contact', 'Taux/h', 'Statut', 'Actions'].map(c => (
                  <th key={c} className="text-left px-4 py-3 text-[11px] font-bold tracking-wider whitespace-nowrap" style={{ color: C.sousTexte }}>{c.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gens.map(p => (
                <tr key={p.n} style={{ borderTop: `1px solid ${C.bord}` }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0" style={{ background: `${C.teal}25`, color: C.texte }}>
                        {p.n.split(' ').map(x => x[0]).join('')}
                      </span>
                      <span className="font-bold whitespace-nowrap" style={{ color: C.texte }}>
                        {p.n}
                        {p.soi && <span className="ml-2 text-[10px] font-medium" style={{ color: C.sousTexte }}>Mon compte terrain</span>}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: C.sousTexte }}>{p.c}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-semibold" style={{ color: C.texte }}>{p.t}</td>
                  <td className="px-4 py-3"><Pastille texte="Actif" couleur={C.vert} fond={C.vertFond} /></td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: C.sousTexte }}>Modifier · Réinitialiser</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Carte>

      <Carte className="overflow-hidden">
        <div className="flex items-start justify-between gap-3 p-5 pb-3">
          <div>
            <p className="text-sm font-bold" style={{ color: C.texte }}>Comptables / Fiduciaires</p>
            <p className="text-xs mt-0.5" style={{ color: C.sousTexte }}>Accès lecture seule aux documents financiers</p>
          </div>
          <BoutonFactice petit>Ajouter un comptable</BoutonFactice>
        </div>
        <LigneListe titre="Fiduciaire Valais SA" sous="compta@fiduciaire-vs.ch" pastille={<Pastille texte="Comptable" />} />
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
      <Titre
        titre="Catalogue de produits"
        action={<span className="flex flex-wrap gap-2 justify-end">
          <BoutonFactice petit><Upload className="w-3.5 h-3.5" /> Importer un catalogue</BoutonFactice>
          <BoutonFactice petit principal><Plus className="w-3.5 h-3.5" /> Ajouter un produit</BoutonFactice>
        </span>}
      />
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex-1 min-w-[12rem] flex items-center gap-2 rounded-xl px-4 py-2.5" style={{ background: C.carte, border: `1px solid ${C.bord}` }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: C.sousTexte }} />
          <span className="text-sm" style={{ color: C.sousTexte }}>Rechercher un produit…</span>
        </div>
        <BoutonFactice petit>Auto-catégoriser</BoutonFactice>
        <span className="text-xs" style={{ color: C.sousTexte }}>{produits.length} produits</span>
      </div>
      <Carte className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: C.fond }}>
                {['Produit', 'Catégorie', 'Unité', 'Prix', 'Marge'].map(c => (
                  <th key={c} className="text-left px-4 py-3 text-[11px] font-bold tracking-wider whitespace-nowrap" style={{ color: C.sousTexte }}>{c.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {produits.map(p => (
                <tr key={p.n} style={{ borderTop: `1px solid ${C.bord}` }}>
                  <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: C.texte }}>{p.n}</td>
                  <td className="px-4 py-3 whitespace-nowrap" title="Cliquer la catégorie pour la changer"><Pastille texte={p.c} /></td>
                  <td className="px-4 py-3" style={{ color: C.sousTexte }}>{p.u}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-semibold" style={{ color: C.texte }}>{p.v.toFixed(2)} CHF</span>
                    <span className="text-xs ml-2" style={{ color: C.sousTexte }}>achat {p.a.toFixed(2)}</span>
                  </td>
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
                <FauxChamp valeur="30" etroit />
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
