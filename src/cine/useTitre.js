import { useEffect } from 'react'

/**
 * Titre et description de la page courante.
 *
 * Le site est une application d'une seule page : sans cela, `/sites-internet`
 * partagerait le titre et la description de l'accueil. Deux pages qui se
 * présentent pareil se concurrencent dans les résultats de recherche au lieu de
 * s'ajouter — et l'onglet du navigateur ne dit plus où l'on est.
 *
 * On remet la valeur d'origine en sortant : sinon, revenir à l'accueil
 * garderait le titre de la page qu'on vient de quitter.
 */
export function useTitre(titre, description) {
  useEffect(() => {
    const balise = document.querySelector('meta[name="description"]')
    const titrePrecedent = document.title
    const descriptionPrecedente = balise?.getAttribute('content')

    if (titre) document.title = titre
    if (description && balise) balise.setAttribute('content', description)

    return () => {
      document.title = titrePrecedent
      if (balise && descriptionPrecedente != null) balise.setAttribute('content', descriptionPrecedente)
    }
  }, [titre, description])
}
