import { Link, NavLink, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useLangue } from '../i18n'
import { useSiteContent } from '../content/SiteContent'
import { contenuPourLangue } from './contenu'
import './tokens.css'

/**
 * Le cadre du site cinématique : la nuit en fond, l'en-tête, le pied.
 *
 * Le fond est posé ici, une fois. Chaque acte se contente de dessiner par-dessus
 * — sinon deux sections voisines finissent par ne plus avoir tout à fait le même
 * noir, et la couture se voit.
 */
export default function CineLayout() {
  const { langue } = useLangue()
  const t = contenuPourLangue(langue)
  const contenu = useSiteContent()
  const [defile, setDefile] = useState(false)

  // L'en-tête ne s'opacifie qu'une fois qu'on a quitté le haut : posée sur le
  // héros dès la première image, une barre opaque mangerait le plan large.
  useEffect(() => {
    const surveiller = () => setDefile(window.scrollY > 24)
    surveiller()
    window.addEventListener('scroll', surveiller, { passive: true })
    return () => window.removeEventListener('scroll', surveiller)
  }, [])

  const lienNav = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'text-[var(--turquoise)]' : 'text-[var(--gris-clair)] hover:text-white'
    }`

  return (
    <>
      <div className="cine-fond" aria-hidden="true" />

      <a className="cine-evitement" href="#contenu">Aller au contenu</a>

      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          defile ? 'bg-[rgb(5_7_10_/_0.82)] backdrop-blur border-b border-[var(--filet)]' : ''
        }`}
      >
        <div className="cine-conteneur flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2.5 font-extrabold tracking-tight text-white">
            <span
              aria-hidden="true"
              className="grid place-items-center w-8 h-8 rounded-lg bg-[var(--turquoise)] text-[var(--nuit)] text-lg font-black"
            >
              N
            </span>
            <span className="text-lg tracking-[0.12em]">NEWRIGEN</span>
          </Link>

          <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={lienNav}>{t.nav.logiciel}</NavLink>
            <NavLink to="/sites-internet" className={lienNav}>{t.nav.sites}</NavLink>
            <NavLink to="/tarifs" className={lienNav}>{t.nav.tarifs}</NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="https://app.newrigen.ch"
              className="hidden sm:inline-flex cine-bouton cine-bouton--fantome !min-h-0 !py-2 !px-4 !text-sm"
            >
              {t.nav.connexion}
            </a>
            <Link to="/tarifs" className="cine-bouton cine-bouton--plein !min-h-0 !py-2.5 !px-5 !text-sm">
              {t.nav.essai}
            </Link>
          </div>
        </div>
      </header>

      <main id="contenu">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--filet)] mt-24">
        <div className="cine-conteneur py-12 grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="flex items-center gap-2.5 font-extrabold tracking-tight text-white">
              <span
                aria-hidden="true"
                className="grid place-items-center w-7 h-7 rounded-md bg-[var(--turquoise)] text-[var(--nuit)] text-base font-black"
              >
                N
              </span>
              NEWRIGEN
            </p>
            <p className="mt-3 text-sm text-[var(--gris)] max-w-xs">{t.pied.baseline}</p>
          </div>

          <div className="text-sm">
            <p className="cine-oeil mb-3">{t.pied.contact}</p>
            {contenu.contact?.email && (
              <p><a className="text-[var(--gris-clair)] hover:text-white" href={`mailto:${contenu.contact.email}`}>{contenu.contact.email}</a></p>
            )}
            {contenu.contact?.telephone1 && (
              <p><a className="text-[var(--gris-clair)] hover:text-white" href={`tel:${String(contenu.contact.telephone1).replace(/\s/g, '')}`}>{contenu.contact.telephone1}</a></p>
            )}
          </div>

          <nav aria-label="Informations légales" className="text-sm space-y-1.5">
            <p className="cine-oeil mb-3">Informations</p>
            <p><Link className="text-[var(--gris-clair)] hover:text-white" to="/mentions-legales">{t.pied.mentions}</Link></p>
            <p><Link className="text-[var(--gris-clair)] hover:text-white" to="/confidentialite">{t.pied.confidentialite}</Link></p>
            <p><Link className="text-[var(--gris-clair)] hover:text-white" to="/cgv">{t.pied.cgv}</Link></p>
          </nav>
        </div>

        <div className="cine-conteneur pb-10 text-xs text-[var(--gris)]">
          © {new Date().getFullYear()} {t.marque} · Conthey, Valais · Hébergé en Suisse
        </div>
      </footer>
    </>
  )
}
