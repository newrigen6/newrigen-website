import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const steps = [
  {
    number: '01',
    icon: '🔍',
    title: 'Audit & analyse',
    description:
      'Nous commençons par un audit gratuit de vos processus métier pour identifier les tâches chronophages et les opportunités d\'automatisation à fort impact.',
    details: ['Réunion de découverte (60 min)', 'Analyse de vos outils actuels', 'Rapport d\'opportunités gratuit'],
  },
  {
    number: '02',
    icon: '⚙️',
    title: 'Conception & développement',
    description:
      'Nos experts conçoivent et développent vos automatisations sur mesure — workflows n8n, agents IA, intégrations API — en collaboration étroite avec vos équipes.',
    details: ['Prototype en 5 jours ouvrables', 'Tests et validations', 'Documentation complète'],
  },
  {
    number: '03',
    icon: '🚀',
    title: 'Déploiement & suivi',
    description:
      'Mise en production progressive, formation de vos équipes et monitoring continu. Vous gardez le contrôle, nous gérons la technique.',
    details: ['Déploiement sans interruption', 'Formation de votre équipe', 'Support et optimisation continus'],
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="processus" className="py-24 px-6 relative grid-bg">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-[#F97316] text-sm font-semibold uppercase tracking-widest mb-3 block">
            Notre processus
          </span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Un processus simple et transparent, de l'idée au déploiement en quelques semaines.
          </p>
        </motion.div>

        {/* Timeline */}
        <div ref={ref} className="relative">

          {/* Vertical line (desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#F97316]/50 via-[#FB923C]/30 to-transparent -translate-x-1/2" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`lg:grid lg:grid-cols-2 lg:gap-16 items-center ${i % 2 === 1 ? 'lg:[direction:rtl]' : ''}`}
              >
                {/* Card */}
                <div className={`lg:[direction:ltr] ${i % 2 === 1 ? 'lg:text-right' : ''}`}>
                  <div className="glass rounded-2xl p-8 border border-[#F97316]/15 glow-hover hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center text-2xl flex-shrink-0">
                        {step.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#F97316] tracking-widest mb-1">ÉTAPE {step.number}</div>
                        <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">{step.description}</p>
                        <ul className="space-y-1.5">
                          {step.details.map((d) => (
                            <li key={d} className="flex items-center gap-2 text-sm text-slate-300">
                              <span className="text-[#F97316]">→</span> {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center dot (desktop) */}
                <div className="hidden lg:flex items-center justify-center relative">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.5 }}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-[#F97316] to-[#FB923C] flex items-center justify-center text-white font-black text-lg shadow-lg shadow-[#F97316]/25 z-10"
                  >
                    {step.number}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


