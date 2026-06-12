import { useState } from 'react'
import { motion } from 'framer-motion'

export default function CTASection() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const subject = encodeURIComponent(`Demande de contact — ${form.company || form.name}`)
    const body = encodeURIComponent(
      `Nom: ${form.name}\nEmail: ${form.email}\nEntreprise: ${form.company}\n\nMessage:\n${form.message}`
    )
    window.location.href = `mailto:newrigen6@gmail.com?subject=${subject}&body=${body}`
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-white/5 border border-[#F97316]/20 focus:border-[#F97316]/60 focus:outline-none focus:ring-1 focus:ring-[#F97316]/40 text-white placeholder:text-slate-500 text-sm transition-colors'

  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1F0A00]/60 via-[#1F0A00]/40 to-transparent" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FB923C]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass rounded-3xl p-10 md:p-14 border border-[#F97316]/20 text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F97316]/10 border border-[#F97316]/30 text-sm text-[#F97316] font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Audit gratuit — Réponse sous 24h
          </div>

          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Prêt à automatiser votre
            <br />
            <span className="gradient-text">entreprise ?</span>
          </h2>

          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Remplissez le formulaire ci-dessous — nous vous répondons sous 24h pour
            un audit gratuit de vos processus, sans engagement.
          </p>

          {/* Formulaire fonctionnel — envoie via mailto: */}
          <form onSubmit={handleSubmit} className="text-left max-w-lg mx-auto space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  Nom *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Jean Dupont"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="jean@entreprise.ch"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                Entreprise
              </label>
              <input
                type="text"
                name="company"
                placeholder="Ma Société SA"
                value={form.company}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                Votre besoin *
              </label>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Décrivez brièvement votre besoin ou le processus que vous souhaitez automatiser..."
                value={form.message}
                onChange={handleChange}
                className={inputClass + ' resize-none'}
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl font-bold text-base bg-gradient-to-r from-[#F97316] to-[#FB923C] text-gray-900 hover:opacity-90 transition-all duration-200 shadow-lg shadow-[#F97316]/25 hover:-translate-y-0.5 active:translate-y-0"
            >
              {sent ? '✓ Vérifiez votre appli mail !' : 'Envoyer ma demande →'}
            </button>

            <p className="text-xs text-slate-600 text-center pt-1">
              Aucun spam. Vos données restent confidentielles.
            </p>
          </form>

          {/* Contacts directs */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 pt-8 border-t border-[#F97316]/10">
            <a href="mailto:newrigen6@gmail.com" className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#F97316] transition-colors">
              📧 newrigen6@gmail.com
            </a>
            <a href="tel:+41793246593" className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#F97316] transition-colors">
              📞 079 324 65 93
            </a>
            <a href="tel:+41798733791" className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#F97316] transition-colors">
              📞 079 873 37 91
            </a>
            <span className="flex items-center gap-2 text-sm text-slate-400">
              📍 Suisse romande &amp; alémanique
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


