import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const rows = [
  { feature: 'Temps de traitement des devis', without: '2-3 jours', with: 'Moins de 5 minutes', highlight: true },
  { feature: 'Erreurs de saisie manuelle', without: 'Fréquentes', with: 'Quasi nulles', highlight: false },
  { feature: 'Disponibilité du service', without: 'Heures de bureau', with: '24h/24, 7j/7', highlight: true },
  { feature: 'Coût des processus administratifs', without: 'Élevé', with: 'Réduit de 60%', highlight: false },
  { feature: 'Relances clients automatiques', without: '✗', with: '✓', highlight: true },
  { feature: 'Intégration CRM/ERP', without: 'Manuelle', with: 'Automatique', highlight: false },
  { feature: 'Rapports et tableaux de bord', without: 'Manuels', with: 'Temps réel', highlight: true },
  { feature: 'Scalabilité', without: 'Limitée par les RH', with: 'Illimitée', highlight: false },
]

export default function ComparisonGrid() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="comparatif" className="py-24 px-6 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1F0A00]/20 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-[#F97316] text-sm font-semibold uppercase tracking-widest mb-3 block">
            Comparatif
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Avant vs après Newrigen
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Voyez concrètement l'impact de l'automatisation IA sur votre quotidien.
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="glass rounded-2xl overflow-hidden border border-[#F97316]/15"
        >
          {/* Table header */}
          <div className="grid grid-cols-3 bg-[#1A0900]/40 border-b border-[#F97316]/15">
            <div className="px-6 py-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Fonctionnalité
            </div>
            <div className="px-6 py-4 text-sm font-semibold text-red-400 uppercase tracking-wider text-center border-l border-[#F97316]/15">
              ✗ Sans Newrigen
            </div>
            <div className="px-6 py-4 text-sm font-semibold text-emerald-400 uppercase tracking-wider text-center border-l border-[#F97316]/15">
              ✓ Avec Newrigen
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <motion.div
              key={row.feature}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={`grid grid-cols-3 border-b border-[#F97316]/10 last:border-0 ${
                row.highlight ? 'bg-[#1A0900]/20' : ''
              } hover:bg-[#1A0900]/30 transition-colors group`}
            >
              <div className="px-6 py-4 text-sm text-slate-300 font-medium flex items-center">
                {row.feature}
              </div>
              <div className="px-6 py-4 text-sm text-red-400/80 text-center border-l border-[#F97316]/10 flex items-center justify-center">
                {row.without}
              </div>
              <div className="px-6 py-4 text-sm text-emerald-400 font-semibold text-center border-l border-[#F97316]/10 flex items-center justify-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs flex-shrink-0">✓</span>
                {row.with !== '✓' ? row.with : ''}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-[#F97316] to-[#FB923C] hover:from-[#F97316]/90 hover:to-[#FB923C]/90 text-gray-900 font-bold transition-all duration-200 shadow-lg shadow-[#F97316]/20 hover:-translate-y-0.5"
          >
            Commencer ma transformation →
          </button>
        </motion.div>
      </div>
    </section>
  )
}


