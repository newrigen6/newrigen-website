/**
 * Les numéros de téléphone à afficher, dans l'ordre.
 *
 * L'admin en propose deux — Tiago et son associé David — mais le site n'en
 * montrait qu'un : le second était saisissable depuis l'onglet « Site web »
 * sans jamais apparaître nulle part. Un artisan qui appelle le soir et tombe
 * sur une boîte vocale n'essaie pas une deuxième fois ; deux numéros, c'est
 * deux chances de décrocher.
 *
 * Un numéro vide dans la base est écarté : la fusion des surcharges écrase la
 * valeur par défaut, et il ne faut pas afficher un lien `tel:` sans numéro.
 */
export function numerosDeContact(contact) {
  return [contact?.telephone1, contact?.telephone2]
    .map(n => (n == null ? '' : String(n).trim()))
    .filter(Boolean)
    .map(numero => ({ numero, href: `tel:${numero.replace(/\s/g, '')}` }))
}
