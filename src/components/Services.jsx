import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const services = [
  {
    icon: '📋',
    title: 'Automatisation de devis',
    description:
      'Générez des devis professionnels en quelques secondes grâce à nos agents IA. Plus besoin de saisie manuelle — vos données sont analysées et structurées automatiquement.',
    features: ['Génération instantanée', 'Validation automatique', 'Envoi par e-mail'],
    color: 'from-[#F97316]/20 to-[#1F0A00]/5',
    border: 'border-[#F97316]/20',
    iconBg: 'bg-[#F97316]/10',
  },
  {
    icon: '🤖',
    title: 'Intégration IA',
    description:
      'Connectez l\'intelligence artificielle à vos outils existants — CRM, ERP, comptabilité. Une intégration sans friction, adaptée à votre infrastructure.',
    features: ['API sur mesure', 'Compatible tous outils', 'Support 24/7'],
    color: 'from-[#F97316]/15 to-[#1F0A00]/5',
    border: 'border-[#F97316]/20',
    iconBg: 'bg-[#F97316]/10',
  },
  {
    icon: '⚡',
    title: 'Workflows n8n',
    description:
      'Automatisez vos tâches répétitives avec des workflows puissants. Relances clients, synchronisation de données, rapports automatisés — tout fonctionne seul.',
    features: ['Workflows visuels', 'Déclencheurs intelligents', 'Monitoring en temps réel'],
    color: 'from-[#FB923C]/15 to-[#1F0A00]/5',
    border: 'border-[#FB923C]/20',
    iconBg: 'bg-[#FB923C]/10',
  },
  {
    icon: '🎯',
    title: 'Conseil digital',
    description:
      'Un accompagnement stratégique pour identifier les opportunités d\'automatisation dans votre entreprise et définir une roadmap IA réaliste et rentable.',
    features: ['Audit gratuit', 'Roadmap personnalisée', 'ROI garanti'],
    color: 'from-[#EA6C0A]/15 to-[#1F0A00]/5',
    border: 'border-[#EA6C0A]/20',
    iconBg: 'bg-[#EA6C0A]/10',
  },
]

function ServiceCard({ service, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={`relative glass rounded-2xl p-7 border ${service.border} glow-hover cursor-default overflow-hidden group`}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />

      <div className="relative z-10">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${service.iconBg} text-2xl mb-5`}>
          {service.icon}
        </div>

        <h3 className="text-lg font-bold text-white mb-3">{service.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-5">{service.description}</p>

        <ul className="space-y-2">
          {service.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
              <span className="w-4 h-4 rounded-full bg-[#F97316]/20 flex items-center justify-center text-[#F97316] text-xs">✓</span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

export default function Services() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true })

  return (
    <section id="services" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#F97316] text-sm font-semibold uppercase tracking-widest mb-3 block">
            Nos services
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Tout ce dont votre PME a besoin
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Des solutions IA clés en main, conçues spécifiquement pour les entreprises suisses
            qui veulent gagner en efficacité sans complexité inutile.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}


