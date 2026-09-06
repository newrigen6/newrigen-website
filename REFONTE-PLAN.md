# Refonte cinématique — audit et plan

Étape 0. Aucun code écrit. Trois blocages à lever avant de commencer.

---

## 1. Ce qu'il y a aujourd'hui

**Stack** : React 18 + Vite 5 + Tailwind 3, React Router 7, déployé sur Vercel.
Neuf dépendances de production, aucune librairie d'animation. Build actuel :
**1.06 s**, bundle très léger.

**Structure**

| Fichier | Rôle |
|---|---|
| `src/App.jsx` (642 l.) | Page d'accueil complète + routes + composants inline |
| `src/pages/Tarifs.jsx` | Tunnel d'inscription et paiement — **le chemin de conversion** |
| `src/pages/Merci.jsx`, `Legal.jsx` | Retour Stripe, pages juridiques |
| `src/i18n/dictionaries.js` (1476 l.) | FR / DE / EN / PT |
| `src/content/SiteContent.jsx` | **Contenu piloté depuis l'admin** (table `site_content`) |
| `src/content/defaults.js` | Prix et contenu de repli |

**Design actuel** : fond sombre `#0A0A0F`, accent turquoise `#4DD9D9`. La charte
turquoise est partagée avec l'application et les visuels Instagram — c'est
l'identité de la marque, pas une décoration.

---

## 2. Le blocage principal : une autre refonte est déjà là

La branche courante s'appelle **`redesign-papier`** et contient une refonte
complète, **non commitée et non suivie par git** :

- `src/redesign/` — 15 fichiers TypeScript, dont une page d'accueil de 474 lignes
- Une direction artistique opposée : **fond crème `#F3EFE6`, encre, accent vert
  sarcelle profond `#0F6F6C`, typographie serif Newsreader** — éditorial, papier,
  calme
- 4 dépendances ajoutées (radix, cva, clsx, tailwind-merge)
- `App.jsx` déjà recâblé : la nouvelle page prend `/`, l'ancienne est repoussée
  sur `/ancien`

**Ce travail n'existe nulle part ailleurs que sur ce disque.** Un `git checkout`
malheureux ou une nouvelle branche mal prise l'efface. Avant toute chose, il faut
le committer sur `redesign-papier`, ne serait-ce que pour pouvoir y revenir.

Et il faut trancher : **papier clair ou cinématique sombre**. Les deux ne peuvent
pas occuper `/`. Ce n'est pas un détail esthétique, c'est le choix de ce que
Newrigen a l'air d'être.

Deux choses que la version papier perd et qu'il faudra réintégrer dans tous les
cas : elle n'affiche **aucun contenu venant de l'admin** (`site_content`), donc
plus moyen de modifier ses textes ou ses prix sans redéployer.

---

## 3. Les deux serveurs MCP demandés ne sont pas utilisables tels quels

**Figma — siège « View ».** Le compte `newrigen` est sur une équipe *starter*
avec un siège en **lecture seule**. Créer un fichier, y construire un design
system et maquetter douze écrans demande un siège Éditeur. En l'état, l'étape 1
ne peut pas s'exécuter.

*Deux issues* : passer un siège en Éditeur, ou concevoir directement en code —
tokens CSS et composants versionnés, ce qui a l'avantage de supprimer d'office
le risque de divergence entre la maquette et le site.

**Higgsfield — 130 crédits, plan basic.** Le storyboard demande une séquence
vidéo maîtresse en quatre plans, trois objets 3D, des textures 4K et leurs
upscales. C'est un volume que 130 crédits ne couvriront pas. Il faut soit
recharger, soit **prioriser** : je propose de produire d'abord le seul plan qui
compte, le héros, et de juger sur pièce avant de dépenser le reste.

---

## 4. Deux points du brief à confirmer

**Le prix.** Le brief dit « 69 CHF/mois » et demande de l'afficher en acte 6.
La grille réelle est **Solo 17.90, Standard 49, Premium 89** — remise à jour
lundi dernier, précisément parce que le site annonçait un prix que Stripe ne
prélevait pas. Aucun palier à 69. Je n'écrirai pas ce chiffre sans ton accord.

**bexio.** Le brief le positionne en concurrent. Mais David a livré samedi
l'**import bexio**, et la publication Instagram prévue dit « vous êtes sur
bexio ? on reprend tout ». Se dire l'alternative à bexio tout en promettant d'en
reprendre les données envoie deux messages contraires. Vertuoza, oui. bexio, je
le traiterais comme une passerelle.

---

## 5. Ce que je garde, ce que je remplace

**Gardé intact**
- `/tarifs`, `/merci` — le tunnel qui encaisse. On n'y touche pas dans cette
  refonte : une animation ratée sur la page d'accueil coûte de l'effet, une
  régression sur le paiement coûte des clients.
- Les quatre langues, et le contenu piloté depuis l'admin.
- Les URL indexées et le `sitemap.xml`.
- L'accent turquoise `#4DD9D9`, commun à l'app, au site et aux publications.

**Remplacé**
- La page d'accueil, entièrement.
- `App.jsx` découpé : il mélange aujourd'hui routes, page et composants.

**Ajouté** — trois dépendances, et leur coût assumé :

| Paquet | Poids gzip approx. | Chargement |
|---|---|---|
| `gsap` + ScrollTrigger | ~50 Ko | avec la page |
| `lenis` | ~5 Ko | avec la page |
| `@react-three/fiber` + `drei` + `three` | **~160 Ko** | **différé, après le premier rendu** |

Three.js seul dépasse la moitié du budget initial. Il ne doit donc jamais entrer
dans le paquet de départ : la 3D se charge après que le héros est affiché, et
seulement sur les appareils qui la supporteront.

---

## 6. Les risques, nommés

**Le référencement.** Le site vend. Il est indexé sur « logiciel devis artisan
suisse » et consorts. Une page où le texte vit dans une timeline peut perdre son
`h1`, ses titres hiérarchisés, ou n'être lisible qu'après exécution du script.
*Parade* : tout le texte reste en HTML sémantique, rendu au premier octet,
au-dessus du canvas. La 3D est décorative — `aria-hidden`.

**Le LCP.** Objectif < 2.5 s en 4G. Le héros affiche une image poster
immédiatement ; la vidéo et la 3D arrivent après. Mesuré, pas supposé.

**La conversion, le vrai risque.** Un artisan de 50 ans sur un chantier, en 4G,
qui doit scroller trois écrans avant de comprendre ce que fait le logiciel, part.
*Parade* : le titre, la phrase d'explication et le bouton d'essai sont visibles
**dès la première image**, avant toute animation. Le cinéma vient après la
promesse, jamais avant.

**Le poids des médias.** Une séquence scrubbable en qualité correcte pèse vite
plusieurs mégaoctets. Budget fixé : **< 1.5 Mo initial**, le reste par acte, et
un plancher de qualité plutôt qu'un plafond de poids.

**Safari.** Le scrub vidéo y est notoirement saccadé. Prévu dès le départ :
séquence d'images WebP numérotées en repli, décidée à l'exécution.

---

## 7. Le plan, acte par acte

**Préalable (avant tout code)** — committer `redesign-papier` pour ne rien
perdre, puis créer `refonte-cinematique` à partir de `main`.

| Étape | Contenu | Vérification |
|---|---|---|
| A | Tokens, typo, grille, composants de base en CSS | build + capture |
| B | Squelette HTML sémantique complet, **sans une seule animation** | lisible sans JS, Lighthouse de référence |
| C | Lenis + timeline maîtresse GSAP, actes 1-2 | 60 fps M1 |
| D | Scrub vidéo héros + repli séquence d'images | LCP mesuré en 4G simulée |
| E | Scène 3D différée, actes 3-4 | poids du paquet, fps mobile |
| F | Actes 5-6, retour au calme, conversion | tunnel `/tarifs` non régressé |
| G | Repli mobile, `prefers-reduced-motion`, sans WebGL2 | les trois modes vérifiés |

L'étape B est la plus importante et la moins spectaculaire : **le site doit être
bon avant d'être beau**. Si la timeline ne se charge jamais, il doit rester une
page de vente correcte.

Commits atomiques par acte, `npm run verifier` à chaque fois, preview Vercel à la
fin avec les scores Lighthouse avant/après.

---

## 8. Ce dont j'ai besoin pour démarrer

1. **Papier ou cinématique ?** Il y a une refonte complète déjà écrite, dans une
   direction opposée. Je ne l'écrase pas sans que tu l'aies tranché.
2. **Figma** : tu passes un siège en Éditeur, ou je conçois en code ?
3. **Le prix affiché** : 49, 17.90, ou autre chose — mais pas 69.
4. **bexio** : concurrent ou passerelle ?

Réponds à ces quatre points et j'enchaîne sur l'étape A sans plus rien demander.

---

## 9. Décisions du 06.09.2026, et ce qui est fait

**Réponses** : cinématique ; carte blanche (donc conçu en code, pas dans Figma) ;
prix 17.90 / 49 / 89 ; bexio en passerelle. **Et une offre de plus** : la
création de sites internet, prix sur demande.

### La seconde offre change la nature du projet

Le site ne vend plus un produit mais deux, et ils ne se vendent pas pareil : le
logiciel se souscrit seul à prix affiché, un site se chiffre après une
conversation. Deux entonnoirs, donc deux boutons qui ne se mélangent jamais.

Cela donne surtout sa justification commerciale à toute la refonte : **le site
cinématique est la vitrine de l'activité création de sites**. Un artisan qui
demande « vous faites des sites ? » n'a besoin d'aucun portfolio, il est dessus.
D'où une exigence de performance non négociable : un site vitrine lent ne vend
pas des sites.

Retenu : un acte dédié sur l'accueil, et une page `/sites-internet`. Sans
formulaire — un artisan qui veut un site appelle, et un téléphone qui marche
vaut mieux qu'une boîte que personne ne surveille.

### Direction artistique

**Reprise exacte de la charte des quinze publications Instagram** : nuit
`#05070A` → marine `#0E2132`, turquoise `#4DD9D9`, ardoise, ambre, vert. Rien
d'inventé — le fil Instagram et le site deviennent un seul système visuel.

**Aucune police web**, décision de performance assumée : sur une 4G de chantier,
une fonte distante coûte un aller-retour sur le chemin critique du premier
affichage, pour un gain presque nul en gras serré.

### Fait — actes A et B

| | |
|---|---|
| Refonte papier | commitée sur `redesign-papier`, rien n'est perdu |
| Branche | `refonte-cinematique`, partie de `main` |
| Tokens | `src/cine/tokens.css` — palette, échelle fluide, boutons, focus, `prefers-reduced-motion` |
| Squelette | 7 actes sur `/`, 4 sur `/sites-internet`, zéro animation |
| Sémantique | 1 `h1`, 6 `h2`, header/main/footer, 2 nav étiquetées, lien d'évitement |
| Préservé | `/tarifs`, `/merci`, les 4 langues, le contenu piloté par l'admin |

**Mesures** : **115 Ko gzip** au chargement initial (0.94 HTML + 6.8 CSS +
107.6 JS), 10 requêtes, build 1.0 s. Sur un budget de 1.5 Mo, il reste de quoi
faire — pas de quoi gaspiller.

### Deux points restés ouverts

**Le rendu sans JavaScript.** Le brief demande un contenu indexable sans JS. Le
site est une application d'une seule page — c'était déjà le cas avant, donc ce
n'est pas une régression, mais l'exigence n'est pas remplie. La remplir demande
un prégénérateur. C'est une étape à part entière, pas un réglage.

**Les traductions.** La copie est en français ; les trois autres langues y
retombent proprement. Un site cohérent en français vaut mieux qu'un site
allemand troué. À reprendre quand la copie sera figée — la traduire avant, ce
serait la traduire deux fois.
