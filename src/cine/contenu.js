/**
 * Toute la copie du site cinématique, à un seul endroit.
 *
 * Le site existant sert quatre langues et laisse l'admin surcharger ses textes.
 * On ne casse ni l'un ni l'autre : le français est écrit ici, les autres langues
 * y retombent tant qu'elles ne sont pas traduites — un site en français vaut
 * mieux qu'un site à moitié en anglais — et les prix continuent de venir de
 * l'admin, jamais d'une valeur figée dans une page.
 *
 * Deux offres cohabitent, et l'ordre compte. Depuis le 20.09.2026, la création
 * de sites internet est l'offre principale : c'est elle qui occupe la page
 * d'accueil, et elle s'adresse à TOUS les commerces — coiffure, restaurant,
 * onglerie, garage, bâtiment. Le logiciel de devis reste vendu, sur sa propre
 * page, au seul métier pour lequel il est fait.
 *
 * Les deux entonnoirs ne se mélangent pas : un site se chiffre après une
 * conversation, le logiciel se souscrit seul à prix affiché.
 */

export const FR = {
  marque: 'Newrigen',

  nav: {
    sites: 'Sites internet',
    logiciel: 'Logiciel devis',
    tarifs: 'Tarifs',
    connexion: 'Connexion',
    essai: 'Essai gratuit',
    devis: 'Demander un devis',
  },

  // ══ LA PAGE D'ACCUEIL — création de sites internet ══════════════════════
  // Le récit est celui de la publicité du 18.09 : on vous cherche, on ne vous
  // trouve pas… puis ils vous appellent. Même histoire à l'écran et en vidéo.
  site: {
    oeil: 'Création de sites internet',
    titre1: 'On vous cherche.',
    titre2: 'On ne vous trouve pas.',
    intro: 'On crée le site qui vous rend visible : rapide sur téléphone, trouvable sur Google, et écrit pour donner envie de vous appeler. Pour les commerces et les indépendants d’ici.',
    // Sous le titre : un mot, puis les numéros. Le prix, la preuve et la façon
    // de travailler ont chacun leur section plus bas — les répéter ici noyait
    // le seul geste qu'on attend du visiteur : appeler.
    ctaContact: 'Contactez-nous',

    // Trois situations, pas des statistiques : on ne cite aucun chiffre qu'on
    // ne pourrait pas prouver.
    problemeOeil: 'Aujourd’hui',
    problemeTitre: 'Introuvable,\nou pire : mal trouvé',
    problemeIntro: 'Quelqu’un cherche votre métier dans votre région, ce soir, sur son téléphone. S’il ne tombe pas sur vous, il tombe sur un concurrent.',
    problemePoints: [
      { titre: 'Pas de site', texte: 'On vous cherche par votre nom, on ne trouve rien. Le doute suffit à faire passer au suivant.' },
      { titre: 'Une page figée', texte: 'Une page Facebook ou Instagram dont la dernière publication date de deux ans. Ce n’est plus possible !' },
      { titre: 'Illisible sur mobile', texte: 'Un ancien site qu’il faut agrandir avec ses doigts tant les écritures sont illisibles, et où les liens ne fonctionnent pas. Changer cela !' },
    ],

    faitOeil: 'Les essentiels',
    faitTitre: '4 choses',
    points: [
      'Un prix ferme et devisé, avant de commencer',
      'Les textes et les images de votre choix',
      'Aucun abonnement nécessaire',
      'Nous gardons la proximité du Valais en vous rencontrant',
    ],

    pourQuiOeil: 'Pour qui',
    pourQuiTitre: 'Tous les commerces',
    pourQuiIntro: 'Si vos clients vous cherchent sur leur téléphone, vous avez besoin d’un site. Le métier ne change rien à cela.',
    metiers: ['Coiffure et esthétique', 'Restaurant et café', 'Onglerie et institut', 'Garage et carrosserie', 'Artisans du bâtiment', 'Santé et thérapies', 'Commerce de proximité', 'Indépendants et services'],

    etapesOeil: 'Comment ça se passe',
    etapesTitre: 'De la première discussion\nà la mise en ligne',
    etapes: [
      { titre: 'Nous nous rencontrons', texte: 'En présentiel ou au téléphone, pour définir vos besoins.' },
      { titre: 'Le prix', texte: 'Le prix est ferme et devisé. Pas de supplément découvert en cours de route.' },
      { titre: 'La création', texte: 'Nous créons votre site, puis nous vous le montrons pour avoir votre avis.' },
      { titre: 'La publication', texte: 'Nous publions votre site web afin de vous faire connaître.' },
    ],

    preuveOeil: 'La preuve',
    preuveTitre: 'Vous êtes dessus',
    preuveTexte: 'Ce site est le nôtre, écrit et dessiné par nous. Jugez la vitesse, la lisibilité sur votre téléphone et le soin des détails — sans qu’on ait à vous montrer un portfolio.',

    // Le renvoi vers le logiciel : discret, et seulement pour ceux que ça
    // concerne. Mis en avant, il brouillerait l'offre principale.
    logicielOeil: 'Aussi',
    logicielTitre: 'Vous êtes dans le bâtiment ?',
    logicielTexte: 'On édite aussi Newrigen, un logiciel suisse de devis, de suivi de chantier et de facturation QR pour les entreprises du bâtiment.',
    logicielCta: 'Voir le logiciel',

    prixOeil: 'Le prix',
    prixTitre: 'Sur demande,\nparce que ça dépend de vous',
    prixTexte: 'Le prix dépend de ce qu’il vous faut : une page qui vous rend joignable, ou un site complet avec vos réalisations. On en discute, on vous chiffre, vous décidez.',
    contactTitre: 'Parlons de votre site',
    contactTexte: 'Un appel suffit pour savoir ce qu’il vous faut.',
  },

  // ══ LA PAGE DU LOGICIEL ═════════════════════════════════════════════════

  // ── Acte 1 — le héros ────────────────────────────────────────────────────
  // Visible dès la première image, avant toute animation : ce que c'est, pour
  // qui, et par où commencer. Le cinéma vient après la promesse.
  hero: {
    oeil: 'Logiciel suisse pour les métiers du bâtiment',
    titre1: 'Le devis part',
    titre2: 'avant la camionnette',
    intro: 'Chiffrez sur le chantier à partir de vos propres prix, suivez les heures de vos employés, facturez avec le QR suisse. Fait en Valais, pour les artisans d’ici.',
    ctaPrincipal: 'Essayer gratuitement',
    ctaSecondaire: 'Voir les fonctions',
    mention: '1 mois offert · sans engagement',
    // Trois preuves vérifiables, rien d'autre : pas de note, pas de nombre de
    // clients qu'on ne pourrait pas montrer.
    preuves: ['Fait en Valais', 'Hébergé en Suisse', 'QR-facture conforme'],
  },

  // ── Acte 2 — le problème ─────────────────────────────────────────────────
  probleme: {
    oeil: 'Le soir',
    titre: 'La journée finit\nquand les papiers finissent',
    intro: 'Vous rentrez à dix-neuf heures. Le devis promis attend, les heures de la semaine sont sur un carnet dans la camionnette, et la facture du fournisseur est passée sous une pile.',
    points: [
      { chiffre: '3 jours', libelle: 'de retard sur un devis, et le client a signé ailleurs' },
      { chiffre: '2 heures', libelle: 'd’administratif par semaine, au minimum, en général le dimanche' },
      { chiffre: '1 facture', libelle: 'oubliée, et c’est la marge du chantier qui part' },
    ],
  },

  // ── Acte 3 — le produit ──────────────────────────────────────────────────
  produit: {
    oeil: 'Le logiciel',
    titre: 'Vos prix, votre écran,\ndevant le client',
    intro: 'Votre catalogue est déjà dans l’application. Vous montez le devis poste par poste pendant la visite, et vous l’envoyez avant d’avoir rangé le mètre.',
    etapes: [
      { titre: 'Vous prenez les mesures', texte: 'Les postes sortent de votre propre catalogue, aux prix que vous avez fixés.' },
      { titre: 'Le total se calcule', texte: 'TVA, rabais, acompte : le compte est juste sans que vous ayez à le refaire.' },
      { titre: 'Le devis part', texte: 'Un PDF à votre nom, avec votre logo, envoyé depuis le chantier.' },
    ],
  },

  // ── Acte 4 — les fonctions ───────────────────────────────────────────────
  fonctions: {
    oeil: 'Ce que ça fait',
    titre: 'Quatre choses,\nfaites correctement',
    liste: [
      {
        cle: 'devis',
        titre: 'Devis et catalogue',
        texte: 'Vos prix enregistrés une fois, réutilisés partout. Vos anciens devis PDF sont relus et repris — vous ne ressaisissez rien.',
      },
      {
        cle: 'chantier',
        titre: 'Chantiers et équipe',
        texte: 'Vous affectez vos employés à un chantier ; chacun retrouve le sien sur son téléphone. Leurs heures tombent au bon endroit, sans que personne ne recopie.',
      },
      {
        cle: 'facture',
        titre: 'Factures et encaissements',
        texte: 'La QR-facture suisse conforme, numérotée dans l’ordre. Le relevé de votre banque pointe les factures payées, dans les deux sens.',
      },
      {
        cle: 'marge',
        titre: 'Marge en direct',
        texte: 'Matériaux, heures, factures fournisseurs : tout se déduit du devis. Vous voyez ce que le chantier vous laisse pendant les travaux, pas six mois après.',
      },
    ],
  },

  // ── Acte 5 — le renvoi vers l'offre principale ───────────────────────────
  // Le visiteur du logiciel est un artisan : il a souvent besoin d'un site
  // aussi. Le renvoi est court — cette page-ci vend le logiciel.
  sites: {
    oeil: 'Et aussi',
    titre: 'Votre entreprise\nn’a pas de site ?',
    intro: 'C’est notre autre métier. On crée des sites pour les commerces et les indépendants d’ici — celui que vous êtes en train de lire, c’est nous.',
    points: [
      'Écrit et dessiné sur mesure, pas un modèle rempli',
      'Rapide sur un téléphone en 4G, parce que c’est là qu’on vous lira',
      'Trouvable sur Google pour votre métier et votre région',
      'Vous modifiez vos textes vous-même, sans nous rappeler',
    ],
    prix: 'Le prix dépend de ce qu’il vous faut. On en discute, on vous chiffre, vous décidez.',
    cta: 'Voir l’offre',
  },

  // ── Acte 6 — la confiance ────────────────────────────────────────────────
  confiance: {
    oeil: 'D’ici',
    titre: 'Vos données restent\nen Suisse, et chez vous',
    points: [
      { titre: 'Hébergement suisse', texte: 'Vos devis, vos clients et vos prix ne quittent pas le pays.' },
      { titre: 'Cloisonné par entreprise', texte: 'Aucune autre entreprise ne peut lire vos dossiers. La séparation est faite dans la base, pas à l’écran.' },
      { titre: 'Vous partez quand vous voulez', texte: 'Vos données s’exportent. Pas d’engagement, pas de reprise en otage.' },
    ],
  },

  // ── Acte 7 — la conversion ───────────────────────────────────────────────
  // Fond clair, plus de 3D, plus rien à regarder que le prix et le bouton.
  offre: {
    oeil: 'Tarifs',
    // « Sans carte bancaire » était faux : la page Tarifs demande une empreinte
    // bancaire à l'inscription. Promettre l'inverse à la dernière étape, c'est
    // perdre le client au moment précis où il allait signer.
    titre: 'Un mois offert,\nsans engagement',
    intro: 'Vous essayez avec vos vrais chantiers. Si ça ne vous sert pas, vous arrêtez sans rien devoir.',
    // Le paquet mis en avant l'est par son usage, jamais par une popularité
    // qu'on ne peut pas prouver.
    miseEnAvant: 'standard',
    etiquetteMiseEnAvant: 'Pour une équipe',
    packs: [
      { cle: 'solo',     nom: 'Solo',     pour: 'Vous travaillez seul',        detail: 'Devis, factures, comptabilité. Sans gestion d’employés.' },
      { cle: 'standard', nom: 'Standard', pour: 'Jusqu’à 5 employés',          detail: 'Tout Solo, plus les heures, les chantiers et le rapport mensuel.' },
      { cle: 'premium',  nom: 'Premium',  pour: 'Toutes les fonctions',        detail: 'Tout Standard, plus l’envoi postal des factures et le sur-mesure.' },
    ],
    parMois: '/ mois',
    ctaPrincipal: 'Commencer l’essai',
    ctaSecondaire: 'Voir le détail des packs',
  },

  pied: {
    baseline: 'Sites internet pour les commerces d’ici, et un logiciel de devis pour le bâtiment.',
    contact: 'Nous joindre',
    mentions: 'Mentions légales',
    confidentialite: 'Confidentialité',
    cgv: 'CGV',
  },
}

/**
 * La copie dans la langue demandée, avec les textes modifiés depuis l'admin.
 *
 * Tant que les traductions ne sont pas faites, on rend le français plutôt qu'un
 * texte à trous : un visiteur allemand lit un site cohérent en français, ce qui
 * vaut mieux qu'un site allemand où une section sur trois est vide.
 *
 * Les surcharges arrivent de `site_content.texts`, sous des clés préfixées
 * `cine.` qui reprennent le chemin du texte : `cine.hero.titre1`,
 * `cine.probleme.points.0.chiffre`. Le préfixe les sépare des quatre champs de
 * l'ancienne page, qui partagent le même dictionnaire.
 *
 * Un champ laissé vide dans l'admin rend le texte d'origine : vider une case ne
 * doit jamais vider la page.
 */
export const PREFIXE_SURCHARGE = 'cine.'

export function contenuPourLangue(langue, surcharges = null) {
  const traductions = { fr: FR }
  const base = traductions[langue] || FR
  if (!surcharges) return base

  const copie = structuredClone(base)
  for (const [cle, valeur] of Object.entries(surcharges)) {
    if (!cle.startsWith(PREFIXE_SURCHARGE)) continue
    if (valeur == null || String(valeur).trim() === '') continue
    appliquer(copie, cle.slice(PREFIXE_SURCHARGE.length).split('.'), String(valeur))
  }
  return copie
}

/**
 * Pose une valeur au bout d'un chemin — mais seulement si ce chemin existe déjà
 * et y mène à un texte. Une clé périmée ou mal formée dans la base ne doit ni
 * créer de branche fantôme, ni remplacer une liste entière par une phrase.
 */
// Des chaînes qui ne sont pas des textes : `cle` choisit le prix et la vignette
// d'une carte, `miseEnAvant` désigne le pack mis en avant. Réécrites depuis la
// base, elles casseraient silencieusement l'affichage des tarifs.
const CLES_TECHNIQUES = new Set(['cle', 'miseEnAvant'])

function appliquer(objet, chemin, valeur) {
  if (chemin.some(pas => CLES_TECHNIQUES.has(pas))) return
  let noeud = objet
  for (let i = 0; i < chemin.length - 1; i++) {
    const pas = Array.isArray(noeud) ? Number(chemin[i]) : chemin[i]
    if (noeud == null || typeof noeud !== 'object' || !(pas in noeud)) return
    noeud = noeud[pas]
  }
  const dernier = Array.isArray(noeud) ? Number(chemin.at(-1)) : chemin.at(-1)
  if (noeud && typeof noeud === 'object' && typeof noeud[dernier] === 'string') {
    noeud[dernier] = valeur
  }
}
