import { motion, AnimatePresence } from 'framer-motion'

/**
 * Barre flottante visible uniquement en mode édition.
 * Permet de sauvegarder, annuler ou quitter.
 */
export default function EditBar({ editMode, setEditMode }) {
  function resetAll() {
    if (confirm('Remettre tous les textes par défaut ?')) {
      localStorage.removeItem('newrigen-content')
      window.location.reload()
    }
  }

  return (
    <AnimatePresence>
      {editMode && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl"
          style={{ background: 'rgba(17,24,39,0.95)', border: '1px solid rgba(77,217,217,0.4)', backdropFilter: 'blur(16px)' }}
        >
          <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
          <span className="text-sm font-semibold text-white">Mode édition actif</span>
          <span className="text-xs text-slate-400 hidden sm:inline">— Cliquez sur n'importe quel texte pour le modifier</span>

          <div className="flex gap-2 ml-3">
            <button
              onClick={resetAll}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white border border-slate-600 hover:border-slate-400 transition-colors"
            >
              Réinitialiser
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#F97316] text-gray-900 hover:bg-[#F97316]/90 transition-colors"
            >
              ✓ Terminer
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


