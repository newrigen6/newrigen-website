// Genere la liste des textes modifiables du site pour l'admin, depuis la copie
// meme du site : les identifiants ne peuvent pas diverger par faute de frappe.
import { FR, PREFIXE_SURCHARGE } from '../src/cine/contenu.js'
import { writeFileSync } from 'node:fs'

const SECTIONS = {
  nav:       'Menu',
  hero:      'Accueil — le héros',
  probleme:  'Accueil — le problème',
  produit:   'Accueil — le logiciel',
  fonctions: 'Accueil — les fonctions',
  sites:     'Accueil — l’offre sites internet',
  confiance: 'Accueil — la confiance',
  offre:     'Accueil — les tarifs',
  pageSites: 'Page « Sites internet »',
  pied:      'Pied de page',
}
const NOMS = {
  oeil: 'Surtitre', titre: 'Titre', titre1: 'Titre, 1re ligne', titre2: 'Titre, 2e ligne',
  intro: 'Introduction', ctaPrincipal: 'Bouton principal', ctaSecondaire: 'Bouton secondaire',
  mention: 'Mention sous les boutons', cta: 'Bouton', prix: 'Texte sur le prix', texte: 'Texte',
  chiffre: 'Chiffre', libelle: 'Légende', nom: 'Nom', pour: 'Pour qui', detail: 'Détail',
  parMois: 'Suffixe du prix', etiquetteMiseEnAvant: 'Étiquette du pack mis en avant',
  logiciel: 'Lien « logiciel »', sites: 'Lien « sites internet »', tarifs: 'Lien « tarifs »',
  connexion: 'Lien « connexion »', essai: 'Bouton « essai »', baseline: 'Phrase sous le logo',
  contact: 'Titre « nous joindre »', mentions: 'Lien mentions légales', confidentialite: 'Lien confidentialité',
  cgv: 'Lien CGV', ctaAppeler: 'Bouton « appeler »', ctaEcrire: 'Bouton « écrire »',
  faitOeil: '« Ce qu’on fait » — surtitre', faitTitre: '« Ce qu’on fait » — titre',
  etapesOeil: 'Étapes — surtitre', etapesTitre: 'Étapes — titre',
  preuveOeil: 'Preuve — surtitre', preuveTitre: 'Preuve — titre', preuveTexte: 'Preuve — texte',
  prixOeil: 'Prix — surtitre', prixTitre: 'Prix — titre',
  contactTitre: 'Encadré contact — titre', contactTexte: 'Encadré contact — texte',
}
const LISTES = { preuves: 'Preuve', points: 'Point', etapes: 'Étape', liste: 'Fonction', packs: 'Pack' }
const TECHNIQUES = new Set(['cle', 'miseEnAvant'])

const champs = []
const parcourir = (valeur, chemin) => {
  if (typeof valeur === 'string') {
    const cle = chemin.at(-1)
    if (TECHNIQUES.has(cle)) return
    const morceaux = []
    for (let i = 1; i < chemin.length; i++) {
      const pas = chemin[i]
      if (/^\d+$/.test(pas)) {
        const liste = chemin[i - 1]
        morceaux[morceaux.length - 1] = `${LISTES[liste] || liste} ${Number(pas) + 1}`
      } else if (LISTES[pas] && /^\d+$/.test(chemin[i + 1] || '')) {
        morceaux.push(LISTES[pas])
      } else {
        morceaux.push(NOMS[pas] || pas)
      }
    }
    champs.push({
      id: PREFIXE_SURCHARGE + chemin.join('.'),
      section: SECTIONS[chemin[0]] || chemin[0],
      label: morceaux.join(' · '),
      defaut: valeur,
      long: valeur.length > 70,
    })
    return
  }
  if (Array.isArray(valeur)) valeur.forEach((v, i) => parcourir(v, [...chemin, String(i)]))
  else if (valeur && typeof valeur === 'object') for (const [k, v] of Object.entries(valeur)) parcourir(v, [...chemin, k])
}
for (const [k, v] of Object.entries(FR)) if (SECTIONS[k]) parcourir(v, [k])

const sortie = process.argv[2]
const entete = `// FICHIER GENERE — ne pas modifier a la main.
// Source : newrigen-website/src/cine/contenu.js, via scripts/generer-champs-admin.mjs.
// Relancer le script apres tout ajout de texte au site :
//   node scripts/generer-champs-admin.mjs ../newrigen/src/components/champsSiteCine.js
`
writeFileSync(sortie, `${entete}\nexport const CHAMPS_SITE_CINE = ${JSON.stringify(champs, null, 2)}\n`)
console.log(`${champs.length} champs ecrits dans ${sortie}`)
const parSection = champs.reduce((a, c) => ({ ...a, [c.section]: (a[c.section] || 0) + 1 }), {})
for (const [s, n] of Object.entries(parSection)) console.log(`  ${String(n).padStart(3)}  ${s}`)
