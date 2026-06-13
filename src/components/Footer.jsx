import { useRef, useState } from 'react'

export default function Footer() {
  const [logo, setLogo] = useState(() => { try { return localStorage.getItem('newrigen-logo') || null } catch { return null } })
  const fileRef = useRef(null)

  function handleLogoUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target.result
      setLogo(dataUrl)
      try { localStorage.setItem('newrigen-logo', dataUrl) } catch {}
    }
    reader.readAsDataURL(file)
  }

  function scrollTo(href) {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[#F97316]/10 bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto px-6 py-14">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <div
              className="cursor-pointer group inline-flex items-center gap-2 mb-4"
              onClick={() => fileRef.current?.click()}
              title="Cliquer pour changer le logo"
            >
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              {logo ? (
                <img src={logo} alt="Newrigen" className="h-8 object-contain" />
              ) : (
                <>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-[#FB923C] flex items-center justify-center text-white font-bold text-sm">
                    N
                  </div>
                  <span className="font-bold text-lg text-white">Newrigen</span>
                </>
              )}
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Agence d'automatisation IA spécialisée pour les PME suisses. Nous transformons
              vos processus métier en workflows intelligents et performants.
            </p>
            <a
              href="mailto:newrigen6@gmail.com"
              className="inline-flex items-center gap-2 mt-4 text-sm text-[#F97316] hover:text-[#F97316] transition-colors"
            >
              📧 newrigen6@gmail.com
            </a>
            <div className="flex flex-col gap-1 mt-2">
              <a href="tel:+41793246593" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">
                📞 079 324 65 93
              </a>
              <a href="tel:+41798733791" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">
                📞 079 873 37 91
              </a>
            </div>
            <div className="flex gap-3 mt-4">
              {/* Réseaux sociaux — remplacer les liens */}
              {/* Ajouter vos vrais liens réseaux sociaux ici */}
              {[
                { label: 'LinkedIn', icon: 'in', href: 'https://linkedin.com/company/newrigen' },
                { label: 'Twitter/X', icon: '𝕏', href: 'https://x.com/newrigen' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg glass border border-[#F97316]/20 flex items-center justify-center text-slate-400 hover:text-white hover:border-[#F97316]/40 transition-all text-xs font-bold"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Services</h4>
            <ul className="space-y-2.5">
              {[
                'Automatisation de devis',
                'Intégration IA',
                'Workflows n8n',
                'Conseil digital',
              ].map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    onClick={(e) => { e.preventDefault(); scrollTo('#services') }}
                    className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Entreprise</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Notre processus', href: '#processus' },
                { label: 'Témoignages', href: '#temoignages' },
                { label: 'Contact', href: '#contact' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollTo(link.href) }}
                    className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="mailto:newrigen6@gmail.com?subject=Mentions légales"
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Mentions légales
                </a>
              </li>
              <li>
                <a
                  href="mailto:newrigen6@gmail.com?subject=Politique de confidentialité"
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Politique de confidentialité
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#F97316]/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600">
            © {currentYear} Newrigen. Tous droits réservés. · Siège social en Suisse
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-600">🇨🇭 Made in Switzerland</span>
            <span className="text-xs text-slate-600">·</span>
            <span className="text-xs text-slate-600">TVA CHE-XXX.XXX.XXX</span>
          </div>
        </div>
      </div>
    </footer>
  )
}


