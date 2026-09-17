import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSiteContent } from '../content/SiteContent'
import { useContenu } from './useContenu'
import './tokens.css'

/**
 * Le cadre du site cinématique : la nuit en fond, l'en-tête, le pied.
 *
 * Le fond est posé ici, une fois. Chaque acte se contente de dessiner par-dessus
 * — sinon deux sections voisines finissent par ne plus avoir tout à fait le même
 * noir, et la couture se voit.
 */
export default function CineLayout() {
  const t = useContenu()
  const contenu = useSiteContent()
  const [defile, setDefile] = useState(false)
  const [menuOuvert, setMenuOuvert] = useState(false)
  const { pathname } = useLocation()

  // Changer de page referme le menu : sinon il reste ouvert par-dessus la page
  // d'arrivée, et le visiteur croit que le lien n'a rien fait.
  useEffect(() => { setMenuOuvert(false) }, [pathname])

  // Menu ouvert : la page dessous ne défile plus, et Échap le referme.
  useEffect(() => {
    if (!menuOuvert) return
    const avant = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.lenis?.stop()
    const echap = (e) => { if (e.key === 'Escape') setMenuOuvert(false) }
    window.addEventListener('keydown', echap)
    return () => {
      document.body.style.overflow = avant
      window.lenis?.start()
      window.removeEventListener('keydown', echap)
    }
  }, [menuOuvert])

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
          defile || menuOuvert ? 'bg-[rgb(5_7_10_/_0.86)] backdrop-blur-md border-b border-[var(--filet)]' : ''
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
            <span className="text-lg tracking-[0.12em]" style={{ fontFamily: 'var(--police-titre)' }}>NEWRIGEN</span>
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
            <Link to="/tarifs" className="hidden sm:inline-flex cine-bouton cine-bouton--plein !min-h-0 !py-2.5 !px-5 !text-sm">
              {t.nav.essai}
            </Link>

            {/* Le menu du téléphone. Avant, la navigation était simplement
                masquée sous 768 px : sur mobile, rien ne menait aux sites
                internet ni aux tarifs — soit la moitié des visiteurs. */}
            <button
              type="button"
              onClick={() => setMenuOuvert(o => !o)}
              aria-expanded={menuOuvert}
              aria-controls="menu-mobile"
              aria-label={menuOuvert ? 'Fermer le menu' : 'Ouvrir le menu'}
              className="md:hidden grid place-items-center w-11 h-11 rounded-full border border-[var(--filet-fort)] text-white"
            >
              <span aria-hidden="true" className="relative block w-5 h-3">
                <span className={`absolute left-0 w-5 h-[2px] rounded bg-current transition-transform duration-300 ${menuOuvert ? 'top-[5px] rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 top-[5px] w-5 h-[2px] rounded bg-current transition-opacity duration-200 ${menuOuvert ? 'opacity-0' : ''}`} />
                <span className={`absolute left-0 w-5 h-[2px] rounded bg-current transition-transform duration-300 ${menuOuvert ? 'top-[5px] -rotate-45' : 'top-[10px]'}`} />
              </span>
            </button>
          </div>
        </div>

        {menuOuvert && (
          <nav
            id="menu-mobile"
            aria-label="Navigation mobile"
            className="md:hidden border-t border-[var(--filet)] bg-[rgb(5_7_10_/_0.96)] backdrop-blur-md"
          >
            <div className="cine-conteneur py-6 flex flex-col">
              {[
                { to: '/', label: t.nav.logiciel, end: true },
                { to: '/sites-internet', label: t.nav.sites },
                { to: '/tarifs', label: t.nav.tarifs },
              ].map(l => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `py-4 border-b border-[var(--filet)] text-2xl font-bold ${isActive ? 'text-[var(--turquoise)]' : 'text-white'}`}
                  style={{ fontFamily: 'var(--police-titre)' }}
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="mt-6 grid gap-3">
                <Link to="/tarifs" className="cine-bouton cine-bouton--plein w-full">{t.nav.essai}</Link>
                <a href="https://app.newrigen.ch" className="cine-bouton cine-bouton--fantome w-full">{t.nav.connexion}</a>
              </div>
            </div>
          </nav>
        )}
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
