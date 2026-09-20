import { contenuPourLangue, FR } from './contenu.js'

let echecs = 0
const verifier = (nom, ok, detail = '') => {
  if (ok) console.log(`  ok  ${nom}`)
  else { echecs++; console.log(`ECHEC  ${nom}${detail ? ` — ${detail}` : ''}`) }
}

verifier('sans surcharge, le contenu d’origine est rendu tel quel',
  contenuPourLangue('fr', null) === FR)

const c = contenuPourLangue('fr', {
  'cine.hero.titre1': 'Le devis file',
  'cine.probleme.points.2.chiffre': '1 oubli',
  'cine.site.etapes.0.titre': 'On boit un café',
})
verifier('un texte simple est remplacé', c.hero.titre1 === 'Le devis file', c.hero.titre1)
verifier('un texte dans une liste est remplacé', c.probleme.points[2].chiffre === '1 oubli')
verifier('un texte de l’accueil sites est remplacé', c.site.etapes[0].titre === 'On boit un café')
verifier('les textes voisins ne bougent pas', c.hero.titre2 === FR.hero.titre2 && c.probleme.points[1].chiffre === FR.probleme.points[1].chiffre)
verifier('l’original n’est jamais modifié', FR.hero.titre1 === 'Le devis part', FR.hero.titre1)

const vide = contenuPourLangue('fr', { 'cine.hero.titre1': '   ', 'cine.hero.intro': '' })
verifier('un champ vidé dans l’admin rend le texte d’origine', vide.hero.titre1 === FR.hero.titre1 && vide.hero.intro === FR.hero.intro)

const piege = contenuPourLangue('fr', {
  'hero-title': 'ancienne page',
  'cine.hero.inexistant': 'fantome',
  'cine.probleme.points': 'une phrase à la place de la liste',
  'cine.probleme.points.9.chiffre': 'hors limites',
  'cine.offre.packs.0.cle': 'premium',
})
verifier('les clés de l’ancienne page sont ignorées', piege.hero.titre1 === FR.hero.titre1)
verifier('une clé inconnue ne crée pas de branche', !('inexistant' in piege.hero))
verifier('une liste ne peut pas être remplacée par une phrase', Array.isArray(piege.probleme.points) && piege.probleme.points.length === 3)
verifier('un indice hors limites ne crée pas d’élément', piege.probleme.points.length === 3)
verifier('la clé technique d’un pack ne se réécrit pas', piege.offre.packs[0].cle === 'solo', piege.offre.packs[0].cle)
const technique = contenuPourLangue('fr', { 'cine.offre.miseEnAvant': 'premium', 'cine.fonctions.liste.0.cle': 'x' })
verifier('le pack mis en avant ne se réécrit pas', technique.offre.miseEnAvant === 'standard')
verifier('la clé d’une fonction ne se réécrit pas', technique.fonctions.liste[0].cle === 'devis')

console.log(echecs ? `\n${echecs} échec(s).` : '\nTous les essais passent.')
process.exit(echecs ? 1 : 0)
