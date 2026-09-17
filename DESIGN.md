# Newrigen — système de design

Référence unique pour toutes les pages du site. Une page qui s'en écarte doit
avoir une raison écrite, sinon elle se corrige.

---

## Parti pris

**« Chantier de nuit, précision suisse. »**

Un site sombre et cinématique, mais jamais décoratif pour le plaisir : chaque
effet montre le produit ou rassure. On vend à un patron de 45 ans qui ouvre la
page sur son téléphone, entre deux chantiers. Il doit comprendre en cinq
secondes, et se dire que c'est sérieux.

**Trois adjectifs** qui tranchent chaque décision : **nocturne · précis · rassurant**.

- *Nocturne* — la nuit bleue du Valais, la lumière turquoise des projecteurs de
  chantier. C'est la charte des publications Instagram : le site et le fil ne
  font qu'une marque.
- *Précis* — des chiffres alignés, des filets fins, des grilles nettes. L'esthétique
  d'un devis bien tenu, pas d'une agence de pub.
- *Rassurant* — jamais d'effet qui gêne la lecture, toujours le prix et le
  bouton à portée. Le sérieux se prouve, il ne s'affiche pas.

---

## Palette

Reprise exacte des visuels Instagram. Rien d'inventé.

| Token | Valeur | Rôle |
|---|---|---|
| `--nuit` | `#05070A` | fond haut |
| `--nuit-bas` | `#0E2132` | fond bas du dégradé |
| `--ardoise` | `#172940` | surfaces, cartes |
| `--ardoise-2` | `#21354A` | surfaces surélevées |
| `--turquoise` | `#4DD9D9` | **l'accent unique** — CTA, chiffres clés, filets |
| `--blanc` | `#FFFFFF` | titres |
| `--gris-clair` | `#B8C7D1` | texte courant |
| `--gris` | `#8A9BA8` | texte secondaire |
| `--ambre` | `#F2B85A` | alerte, douleur (acte « le problème ») |
| `--vert` | `#4ACC8C` | payé, confirmé |

**Règles de contraste vérifiées (WCAG AA)**

| Texte | Fond | Rapport |
|---|---|---|
| gris-clair | ardoise | 8.50 ✓ |
| gris | nuit | 7.04 ✓ |
| gris | ardoise | 5.14 ✓ |
| **gris** | **ardoise-2** | **4.38 ✗ — interdit en petit texte** |
| nuit | turquoise (bouton) | 11.76 ✓ |
| turquoise | nuit-bas | 9.55 ✓ |

Le gris est passé de `#7A8C99` à `#8A9BA8` : l'ancien échouait sur les cartes
(4.23). Sur `ardoise-2`, on n'écrit qu'en `gris-clair`.

**Un seul accent.** Le turquoise marque ce qu'on doit regarder ou toucher. Deux
éléments turquoise voisins de même poids, c'est un de trop.

---

## Typographie

| Usage | Police | Pourquoi |
|---|---|---|
| Titres | **Bricolage Grotesque** 700–800 | Une grotesque à caractère, légèrement brute — le trait d'un artisan, pas d'une banque |
| Corps | **Manrope** 400–700 | Géométrique et très lisible en petit, sur un écran de téléphone en plein soleil |

Chargées depuis Google Fonts avec `display=swap` : le texte s'affiche tout de
suite dans la police de secours, puis bascule. On ne fait jamais attendre la
lecture pour une police.

**Échelle** — fluide, en `clamp()` :

| Rôle | Taille |
|---|---|
| H1 | `clamp(2.6rem, 1.6rem + 4.4vw, 5.8rem)`, interligne 1.02, approche −0.035em |
| H2 | `clamp(2rem, 1.4rem + 2.8vw, 4rem)`, interligne 1.05 |
| Intro | `clamp(1.1rem, 1rem + 0.6vw, 1.4rem)` |
| Corps | `clamp(1rem, 0.96rem + 0.2vw, 1.1rem)`, interligne 1.65, max 65ch |
| Surtitre | 0.78rem, capitales, approche 0.22em |

Chiffres (prix, montants, statistiques) en `font-variant-numeric: tabular-nums` :
une colonne de montants doit s'aligner comme sur un devis.

---

## Mise en page

**Aucune section ne répète la mise en page de la précédente.**

| Section | Mise en page |
|---|---|
| Héros | Pleine largeur, photo, texte à gauche, **carte produit flottante** à droite |
| Le problème | Éditorial : grand énoncé, puis **trois chiffres géants séparés par des filets verticaux** |
| Le produit | **Split 55/45** : texte + tablette 3D, puis **frise reliée** en trois étapes |
| Les fonctions | **Défilement horizontal épinglé**, chaque carte avec sa mini-interface |
| Sites internet | **Bento asymétrique** : grand bloc avec cadre de navigateur, petits blocs d'arguments |
| Confiance | **Bandeau pleine largeur centré**, une phrase et trois preuves en ligne |
| Tarifs | Fond clair, **trois colonnes**, celle du milieu mise en avant par le poids, pas par un faux « populaire » |

Largeur de contenu : 1180 px. Gouttière latérale fluide, jamais moins de 20 px.
Respiration verticale : 96–128 px entre sections sur grand écran.

---

## Profondeur

- Dégradé de fond fixe, nuit → marine.
- **Grain** : une texture de bruit très légère sur tout le site, pour casser le
  plat numérique des aplats sombres.
- **Halos** : lueurs turquoise floues, derrière les éléments qu'on veut faire
  remonter — jamais plus d'un par écran.
- Cartes : fond ardoise, **bordure 1 px semi-transparente**, ombre douce en
  deux couches. Verre dépoli (`backdrop-filter`) réservé à l'en-tête et à la
  carte flottante du héros.

---

## Mouvement

- Une seule source : Lenis + GSAP, branchés sur la même horloge.
- On n'anime qu'**opacité** et **transformation**.
- Survol : `translateY(-2px)` + bordure qui s'allume, courbe `cubic-bezier(.22,.61,.36,1)`.
- `prefers-reduced-motion` : aucun mouvement, rien n'est même chargé.
- Mobile, connexion lente, sans WebGL2 : fondus seulement, pas de 3D, pas d'épinglage.

---

## Ce qu'on ne fait jamais

- Un témoignage, une note ou un nombre de clients qu'on ne peut pas prouver.
- Un badge « Populaire » ou « Recommandé » sans donnée derrière.
- Une animation qui retarde la lecture du titre, du prix ou du bouton.
- Du petit texte `gris` sur `ardoise-2`.
- Deux sections consécutives avec la même grille.
