/**
 * Toute la copie du site cinématique, à un seul endroit.
 *
 * Le site existant sert quatre langues et laisse l'admin surcharger ses textes.
 * On ne casse ni l'un ni l'autre : le français est écrit ici, les autres langues
 * y retombent tant qu'elles ne sont pas traduites — un site en français vaut
 * mieux qu'un site à moitié en anglais — et les prix continuent de venir de
 * l'admin, jamais d'une valeur figée dans une page.
 *
 * Deux offres cohabitent, et l'ordre compte : le logiciel se vend seul, à prix
 * affiché ; les sites internet se vendent sur mesure, après une conversation.
 * Mélanger les deux entonnoirs perdrait les deux.
 */

export const FR = {
  marque: 'Newrigen',

  nav: {
    logiciel: 'Le logiciel',
    sites: 'Sites internet',
    tarifs: 'Tarifs',
    connexion: 'Connexion',
    essai: 'Essai gratuit',
  },

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
    mention: '1 mois offert · sans carte bancaire',
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

  // ── Acte 5 — la deuxième offre ───────────────────────────────────────────
  // Le site qu'on est en train de regarder est le seul argument dont cette
  // offre a besoin. On le dit franchement au lieu de montrer un portfolio.
  sites: {
    oeil: 'Sites internet',
    titre: 'Et si votre entreprise\nn’a pas de site ?',
    intro: 'On les fait aussi. Celui que vous êtes en train de regarder, c’est nous — c’est le seul exemple qu’on ait besoin de vous montrer.',
    points: [
      'Écrit et dessiné sur mesure, pas un modèle rempli',
      'Rapide sur un téléphone en 4G, parce que c’est là qu’on vous lira',
      'Trouvable sur Google pour votre métier et votre région',
      'Vous pouvez modifier vos textes vous-même, sans nous rappeler',
    ],
    prix: 'Le prix dépend de ce qu’il vous faut : une page qui vous rend joignable, ou un site complet avec vos réalisations. On en discute, on vous chiffre, vous décidez.',
    cta: 'Demander un devis',
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
    titre: 'Un mois offert,\nsans carte bancaire',
    intro: 'Vous essayez avec vos vrais chantiers. Si ça ne vous sert pas, vous arrêtez sans rien devoir.',
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
    baseline: 'Devis, chantiers et facturation pour les artisans suisses.',
    contact: 'Nous joindre',
    mentions: 'Mentions légales',
    confidentialite: 'Confidentialité',
    cgv: 'CGV',
  },
}

/**
 * La copie dans la langue demandée.
 *
 * Tant que les traductions ne sont pas faites, on rend le français plutôt qu'un
 * texte à trous : un visiteur allemand lit un site cohérent en français, ce qui
 * vaut mieux qu'un site allemand où une section sur trois est vide.
 */
export function contenuPourLangue(langue) {
  const traductions = { fr: FR }
  return traductions[langue] || FR
}
