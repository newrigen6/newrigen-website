import { motion } from 'framer-motion'
import { useEdit } from '../App'
import EditableText from './EditableText'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
}
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function Hero() {
  const editMode = useEdit()

  function scrollTo(href) {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FB923C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1A0900]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div variants={container} initial="hidden" animate="show">

          {/* Badge */}
          <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#F97316]/30 text-sm text-[#F97316] font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
            <EditableText id="hero-badge" editMode={editMode}>
              Automatisation IA pour les PME suisses
            </EditableText>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={item} className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-6">
            <EditableText id="hero-title" tag="span" editMode={editMode}>
              Transformez votre{' '}
              <span className="gradient-text">entreprise</span>
              <br />
              avec l'intelligence
              <br />
              <span className="gradient-text">artificielle</span>
            </EditableText>
          </motion.h1>

          {/* Subtext */}
          <motion.p variants={item} className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            <EditableText id="hero-subtext" editMode={editMode}>
              Newrigen automatise vos processus métier grâce à l'IA — devis instantanés,
              workflows intelligents, intégrations sur mesure. Gagnez du temps, réduisez
              les coûts et concentrez-vous sur ce qui compte vraiment.
            </EditableText>
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => !editMode && scrollTo('#contact')}
              className="px-8 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-[#F97316] to-[#FB923C] text-gray-900 transition-all duration-200 shadow-xl shadow-[#F97316]/25 hover:shadow-[#F97316]/35 hover:-translate-y-0.5 active:translate-y-0"
            >
              <EditableText id="hero-cta1" editMode={editMode}>Demander un devis gratuit</EditableText>
            </button>
            <button
              onClick={() => !editMode && scrollTo('#services')}
              className="px-8 py-4 rounded-xl font-semibold text-base glass border border-slate-600 hover:border-[#F97316]/50 text-slate-200 hover:text-white transition-all duration-200 hover:-translate-y-0.5"
            >
              <EditableText id="hero-cta2" editMode={editMode}>Voir nos services →</EditableText>
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div variants={item} className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { id: 'stat1', value: '3×', label: 'Plus rapide' },
              { id: 'stat2', value: '60%', label: 'Économies de temps' },
              { id: 'stat3', value: '100%', label: 'Made in Switzerland' },
            ].map((stat) => (
              <div key={stat.id} className="text-center">
                <div className="text-xl md:text-2xl font-black gradient-text">
                  <EditableText id={`hero-${stat.id}-value`} editMode={editMode}>{stat.value}</EditableText>
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">
                  <EditableText id={`hero-${stat.id}-label`} editMode={editMode}>{stat.label}</EditableText>
                </div>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </div>

      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
        <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-[#F97316]" />
        </div>
      </motion.div>
    </section>
  )
}


