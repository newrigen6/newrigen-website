import { useText } from '../content/SiteContent'

/**
 * Texte du site, éventuellement surchargé depuis l'admin Newrigen
 * (table site_content → data.texts[id]). Sinon, on garde le contenu par défaut.
 * Props :
 *   id        — identifiant unique (ex: "hero-title")
 *   tag       — balise HTML à rendre (default: "span")
 *   className — classes Tailwind
 *   children  — contenu par défaut
 */
export default function EditableText({ id, tag: Tag = 'span', className = '', children }) {
  const override = useText(id, null)
  if (override != null && override !== '') {
    return <Tag className={className}>{override}</Tag>
  }
  return <Tag className={className}>{children}</Tag>
}
