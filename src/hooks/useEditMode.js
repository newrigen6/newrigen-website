import { useState, useEffect } from 'react'

// Stockage du contenu éditable
const STORAGE_KEY = 'newrigen-content'

export function getSavedContent() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

export function saveContent(id, value) {
  const all = getSavedContent()
  all[id] = value
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(all)) } catch {}
}

export function useEditMode() {
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    // Raccourci : Ctrl + Shift + E pour activer/désactiver l'édition
    function handleKey(e) {
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        setEditMode(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return { editMode, setEditMode }
}


