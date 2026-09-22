import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSiteContent } from '../content/SiteContent'
import { useContenu } from './useContenu'
import { numerosDeContact } from './telephones'
import './tokens.css'

/** Hauteur de l'en-tête fixe, qui recouvrirait le haut de la section visée. */
const hauteurEntete = () => (window.innerWidth >= 1024 ? 80 : 64)

/**
 * Amène la page sur une ancre, d'où qu'on vienne.
 *
 * Deux raisons de ne pas s'en remettre au navigateur. React Router ne défile
 * pas vers le fragment d'une URL : arriver sur « /#devis » depuis une autre
 * page laissait le visiteur en haut de la page d'accueil. Et Lenis a pris la
 * main sur le défilement, si bien qu'un simple saut d'ancre ne se voit pas.
 *
 * `immediat` sert à l'arrivée depuis une autre page. Une glissade douce y est
 * avalée : changer de page détruit l'instance Lenis de la page quittée, en
 * plein milieu de son animation. Le saut sec est aussi ce qu'on attend d'une
 * navigation — la glissade est réservée au clic sur la page où l'on est déjà.
 *
 * Dans les deux cas la cible peut n'être pas encore montée, et sa position
 * bouger encore une fois montée (images, sections révélées au défilement) :
 * on repointe à chaque image jusqu'à y être, et on renonce au bout de deux
 * secondes plutôt que de tourner indéfiniment.
 */
function allerAlAncre(id, { immediat = false } = {}) {
  const limite = performance.now() + 2000
  const pas = () => {
    const cible = document.getElementById(id)
    if (!cible) {
      if (performance.now() < limite) requestAnimationFrame(pas)
      return
    }
    const y = Math.max(0, cible.getBoundingClientRect().top + window.scrollY - hauteurEntete())
    if (Math.abs(window.scrollY - y) < 4) return
    if (window.lenis) window.lenis.scrollTo(y, immediat ? { immediate: true } : undefined)
    else window.scrollTo({ top: y, behavior: immediat ? 'auto' : 'smooth' })
    if (immediat && performance.now() < limite) requestAnimationFrame(pas)
  }
  requestAnimationFrame(pas)
}

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
  const { pathname, hash } = useLocation()

  // Changer de page referme le menu : sinon il reste ouvert par-dessus la page
  // d'arrivée, et le visiteur croit que le lien n'a rien fait.
  useEffect(() => { setMenuOuvert(false) }, [pathname])

  // Arrivée sur « /#devis » depuis les tarifs ou la page logiciel : c'est ici
  // qu'on rejoint la section, React Router s'arrêtant au changement d'adresse.
  useEffect(() => {
    if (hash) allerAlAncre(hash.slice(1), { immediat: true })
  }, [pathname, hash])

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
          <Link to="/" className="flex items-center gap-2.5 min-h-11 font-extrabold tracking-tight text-white">
            <span
              aria-hidden="true"
              className="grid place-items-center w-8 h-8 rounded-lg bg-[var(--turquoise)] text-[var(--nuit)] text-lg font-black"
            >
              N
            </span>
            <span className="text-lg tracking-[0.12em]" style={{ fontFamily: 'var(--police-titre)' }}>NEWRIGEN</span>
          </Link>

          {/* Seuil a 1024 px et non 768 : « Logiciel de gestion d'entreprise »
              est long, et la barre horizontale debordait sur les tablettes et
              les petits portables. En dessous, c'est le menu du telephone. */}
          <nav aria-label="Navigation principale" className="hidden lg:flex items-center gap-1">
            <NavLink to="/" end className={lienNav}>{t.nav.sites}</NavLink>
            <NavLink to="/logiciel" className={lienNav}>{t.nav.logiciel}</NavLink>
            <NavLink to="/tarifs" className={lienNav}>{t.nav.tarifs}</NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="https://app.newrigen.ch"
              className="hidden sm:inline-flex cine-bouton cine-bouton--fantome !min-h-0 !py-2 !px-4 !text-sm"
            >
              {t.nav.connexion}
            </a>
            {/* Le bouton d'en-tete sert l'offre principale : un devis de
                site, pas l'essai du logiciel. La zone de contact n'existe que
                sur la page des sites internet — d'ou l'adresse absolue, qui
                ramene depuis la page logiciel comme depuis les tarifs. */}
            <Link
              to="/#devis"
              onClick={() => { if (pathname === '/') allerAlAncre('devis') }}
              className="hidden sm:inline-flex cine-bouton cine-bouton--plein !min-h-0 !py-2.5 !px-5 !text-sm"
            >
              {t.nav.devis}
            </Link>

            {/* Le menu du téléphone — et desormais aussi des tablettes, le
                seuil etant passe a 1024 px. Avant, la navigation était
                simplement masquée aux petites largeurs : rien ne menait aux
                sites internet ni aux tarifs — soit la moitié des visiteurs. */}
            <button
              type="button"
              onClick={() => setMenuOuvert(o => !o)}
              aria-expanded={menuOuvert}
              aria-controls="menu-mobile"
              aria-label={menuOuvert ? 'Fermer le menu' : 'Ouvrir le menu'}
              className="lg:hidden grid place-items-center w-11 h-11 rounded-full border border-[var(--filet-fort)] text-white"
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
            className="lg:hidden border-t border-[var(--filet)] bg-[rgb(5_7_10_/_0.96)] backdrop-blur-md"
          >
            <div className="cine-conteneur py-6 flex flex-col">
              {[
                { to: '/', label: t.nav.sites, end: true },
                { to: '/logiciel', label: t.nav.logiciel },
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
                <Link
                  to="/#devis"
                  onClick={() => {
                    setMenuOuvert(false)
                    if (pathname === '/') requestAnimationFrame(() => allerAlAncre('devis'))
                  }}
                  className="cine-bouton cine-bouton--plein w-full"
                >
                  {t.nav.devis}
                </Link>
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
              <p><a className="cine-lien-pied" href={`mailto:${contenu.contact.email}`}>{contenu.contact.email}</a></p>
            )}
            {numerosDeContact(contenu.contact).map(({ numero, href }) => (
              <p key={numero}><a className="cine-lien-pied" href={href}>{numero}</a></p>
            ))}
          </div>

          <nav aria-label="Informations légales" className="text-sm">
            <p className="cine-oeil mb-3">Informations</p>
            <p><Link className="cine-lien-pied" to="/mentions-legales">{t.pied.mentions}</Link></p>
            <p><Link className="cine-lien-pied" to="/confidentialite">{t.pied.confidentialite}</Link></p>
            <p><Link className="cine-lien-pied" to="/cgv">{t.pied.cgv}</Link></p>
          </nav>
        </div>

        <div className="cine-conteneur pb-10 text-xs text-[var(--gris)]">
          © {new Date().getFullYear()} {t.marque} · Conthey, Valais · Hébergé en Suisse
        </div>
      </footer>
    </>
  )
}
