/**
 * Met un prix en forme à la suisse : « 49.- » pour un montant rond,
 * « 17.90 » dès qu'il y a des centimes.
 *
 * Partagé entre la page d'accueil et la page Tarifs, qui affichent les mêmes
 * packs : dupliquer la règle laisserait fatalement l'une des deux afficher un
 * « 17.9.- » le jour où un prix cesse d'être rond.
 */
export const montant = (n) => (Number.isInteger(Number(n)) ? `${Number(n)}.-` : Number(n).toFixed(2))
