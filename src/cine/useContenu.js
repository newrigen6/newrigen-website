import { useMemo } from 'react'
import { useLangue } from '../i18n'
import { useSiteContent } from '../content/SiteContent'
import { contenuPourLangue } from './contenu'

/**
 * La copie du site cinématique, dans la langue courante, avec les textes
 * modifiés depuis l'onglet « Site web » de l'admin.
 *
 * Les textes d'origine s'affichent tout de suite ; ceux de l'admin les
 * remplacent dès que la base a répondu. Aucune page n'attend la base pour être
 * lisible.
 */
export function useContenu() {
  const { langue } = useLangue()
  const { texts } = useSiteContent()
  return useMemo(() => contenuPourLangue(langue, texts), [langue, texts])
}
