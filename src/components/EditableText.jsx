import { useRef, useEffect, useState } from 'react'
import { getSavedContent, saveContent } from '../hooks/useEditMode'

/**
 * Composant texte éditable en mode édition.
 * Props :
 *   id        — identifiant unique pour la sauvegarde (ex: "hero-title")
 *   tag       — balise HTML à rendre (default: "span")
 *   className — classes Tailwind
 *   children  — contenu par défaut (si rien de sauvegardé)
 *   editMode  — booléen activant l'édition
 */
export default function EditableText({ id, tag: Tag = 'span', className = '', children, editMode }) {
  const ref = useRef(null)
  const saved = getSavedContent()
  const [content] = useState(saved[id] ?? null)

  // Charge le contenu sauvegardé au montage
  useEffect(() => {
    if (ref.current && content !== null) {
      ref.current.innerHTML = content
    }
  }, [])

  // Active/désactive contenteditable
  useEffect(() => {
    if (!ref.current) return
    ref.current.contentEditable = editMode ? 'true' : 'false'
    if (editMode) {
      ref.current.focus()
    }
  }, [editMode])

  function handleInput() {
    if (ref.current) {
      saveContent(id, ref.current.innerHTML)
    }
  }

  return (
    <Tag
      ref={ref}
      className={`${className} ${editMode ? 'outline-dashed outline-2 outline-[#F97316]/60 outline-offset-2 cursor-text rounded' : ''}`}
      onInput={handleInput}
      suppressContentEditableWarning
    >
      {content === null ? children : undefined}
    </Tag>
  )
}


