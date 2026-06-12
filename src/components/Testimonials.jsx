import { motion } from 'framer-motion'
import { useEdit } from '../App'
import EditableText from './EditableText'

// Remplacer par de vrais témoignages
const testimonials = [
  {
    name: 'Sophie Müller',
    role: 'Directrice, Müller Sanitaire SA',
    location: 'Genève',
    avatar: 'SM',
    stars: 5,
    text: 'Newrigen a automatisé notre processus de devis en totalité. Ce qui prenait 2 jours se fait maintenant en 5 minutes. Un investissement qui s\'est amorti en 3 semaines !',
    color: 'from-[#F97316] to-[#EA6C0A]',
  },
  {
    name: 'Pierre Favre',
    role: 'Fondateur, Favre Construction',
    location: 'Lausanne',
    avatar: 'PF',
    stars: 5,
    text: 'Les workflows n8n qu\'ils ont mis en place ont éliminé 90% de nos tâches administratives répétitives. Mon équipe peut enfin se concentrer sur les chantiers.',
    color: 'from-orange-500 to-purple-500',
  },
  {
    name: 'Anna Keller',
    role: 'CEO, Keller Traiteur',
    location: 'Zurich',
    avatar: 'AK',
    stars: 5,
    text: 'Service irréprochable, équipe réactive et solutions qui fonctionnent vraiment. Notre intégration CRM est maintenant entièrement automatisée. Je recommande vivement.',
    color: 'from-blue-500 to-orange-500',
  },
]

export default function Testimonials() {
  const editMode = useEdit()
  return (
    <section id="temoignages" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-950/10 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-[#F97316] text-sm font-semibold uppercase tracking-widest mb-3 block">
            Témoignages
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Ce que disent nos clients
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Des PME suisses qui ont déjà franchi le cap de l'automatisation IA.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="glass rounded-2xl p-7 border border-[#F97316]/15 glow-hover"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <span key={j} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                "<EditableText id={`testi-${i}-text`} editMode={editMode}>{t.text}</EditableText>"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  <EditableText id={`testi-${i}-avatar`} editMode={editMode}>{t.avatar}</EditableText>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    <EditableText id={`testi-${i}-name`} editMode={editMode}>{t.name}</EditableText>
                  </div>
                  <div className="text-xs text-slate-500">
                    <EditableText id={`testi-${i}-role`} editMode={editMode}>{t.role} · {t.location}</EditableText>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-14 flex flex-wrap justify-center gap-6 items-center"
        >
          {['🇨🇭 Basé en Suisse', '🔒 RGPD compliant', '⚡ Support réactif', '💼 +20 PME accompagnées'].map((badge) => (
            <div key={badge} className="glass px-5 py-2.5 rounded-full border border-[#F97316]/15 text-sm text-slate-400 font-medium">
              {badge}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}


