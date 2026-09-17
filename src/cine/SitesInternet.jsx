import { useEffect, useRef } from 'react'
import { useSiteContent } from '../content/SiteContent'
import { useContenu } from './useContenu'
import { Acte, Oeil } from './composants/Acte'
import { CadreNavigateur } from './composants/Vignettes'
import { useTitre } from './useTitre'
import { useTimelineMaitresse } from './useTimelineMaitresse'
import { revelerBlocs, composerTitre, leverLeJour } from './animations'

/**
 * L'offre « sites internet ».
 *
 * Le prix se fait sur demande : la page ne vend pas un abonnement, elle obtient
 * une conversation. Aucun bouton d'essai ici — il enverrait vers le logiciel et
 * perdrait la demande.
 *
 * Pas de portfolio : on n'en a pas à montrer, et on n'en invente pas. L'exemple,
 * c'est la page elle-même.
 */
export default function SitesInternet() {
  const t = useContenu()
  const ps = t.pageSites
  const { contact } = useSiteContent()
  const { niveau, pret, ancre } = useTimelineMaitresse()

  const page = useRef(null)
  const titre = useRef(null)
  const voile = useRef(null)
  const devis = useRef(null)

  useTitre(
    'Création de site internet pour artisans — Newrigen',
    'Sites internet sur mesure pour les entreprises du bâtiment en Valais : rapides sur mobile, trouvables sur Google, modifiables par vous. Devis sur demande.',
  )

  useEffect(() => {
    if (!pret || !page.current) return
    const { gsap, trigger: ScrollTrigger } = ancre.current
    if (!gsap || !ScrollTrigger) return

    const sobre = niveau === 'sobre'
    const defaire = [revelerBlocs(gsap, ScrollTrigger, page.current, { sobre })]
    if (!sobre) {
      defaire.push(composerTitre(gsap, titre.current))
      defaire.push(leverLeJour(gsap, ScrollTrigger, voile.current, devis.current))
    }
    return () => defaire.forEach(f => f?.())
  }, [pret, niveau, ancre])

  const tel = contact?.telephone1
  const telBrut = tel ? String(tel).replace(/\s/g, '') : null

  return (
    <div ref={page}>
      {/* Héros : texte à gauche, le cadre de navigateur à droite. */}
      <Acte id="sites-hero" premier>
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-14 items-center">
          <div>
            <Oeil texte={t.sites.oeil} />
            <h1 ref={titre} className="cine-h1 mt-6">
              {ps.titre1}{' '}
              <br />
              <span className="text-white">{ps.titre2}</span>
            </h1>
            <p className="cine-intro mt-7">{t.sites.intro}</p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              {telBrut && (
                <a href={`tel:${telBrut}`} className="cine-bouton cine-bouton--plein">
                  {ps.ctaAppeler} — {tel}
                </a>
              )}
              {contact?.email && (
                <a href={`mailto:${contact.email}?subject=Site%20internet`} className="cine-bouton cine-bouton--fantome">
                  {ps.ctaEcrire}
                </a>
              )}
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="cine-halo -top-20 -right-10" aria-hidden="true" />
            <CadreNavigateur className="relative lg:rotate-[1.5deg]" />
          </div>
        </div>
      </Acte>

      {/* Ce qu'on fait : liste numérotée en deux colonnes, sans cartes. */}
      <section className="relative py-24 md:py-32">
        <div className="cine-conteneur grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20">
          <div data-revele className="lg:sticky lg:top-28 self-start">
            <Oeil texte={ps.faitOeil} />
            <h2 className="cine-h2 mt-6 whitespace-pre-line">{ps.faitTitre}</h2>
          </div>

          <ol className="divide-y divide-[var(--filet)] border-y border-[var(--filet)]">
            {t.sites.points.map((p, i) => (
              <li key={p} className="flex gap-6 py-7" data-revele data-retard={i * 0.08}>
                <span className="cine-titre text-3xl text-[var(--turquoise)] cine-chiffres w-12 flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-lg md:text-xl text-white leading-snug pt-1">{p}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Comment ça se passe : quatre étapes en frise. */}
      <Acte id="sites-etapes">
        <div data-revele className="max-w-2xl">
          <Oeil texte={ps.etapesOeil} />
          <h2 className="cine-h2 mt-6 whitespace-pre-line">{ps.etapesTitre}</h2>
        </div>

        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ps.etapes.map((e, i) => (
            <li key={e.titre} className="cine-carte cine-carte--vivante p-6" data-revele data-retard={i * 0.08}>
              <span className="text-xs font-bold tracking-[0.2em] text-[var(--turquoise)] cine-chiffres">
                ÉTAPE {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 cine-titre text-xl text-white">{e.titre}</h3>
              <p className="mt-2 text-sm text-[var(--gris-clair)] leading-relaxed">{e.texte}</p>
            </li>
          ))}
        </ol>
      </Acte>

      {/* La preuve : bandeau centré. */}
      <section className="relative py-24 md:py-28 overflow-hidden">
        <div className="cine-halo left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
        <div className="cine-conteneur relative text-center" data-revele>
          <p className="cine-oeil">{ps.preuveOeil}</p>
          <h2 className="cine-h2 mt-5">{ps.preuveTitre}</h2>
          <p className="cine-intro mt-6 mx-auto">{ps.preuveTexte}</p>
        </div>
      </section>

      {/* Le prix se discute : on le dit franchement plutôt qu'afficher un
          « dès X.– » qui n'engagerait à rien et décevrait à la première visite. */}
      <div ref={voile} aria-hidden="true" className="fixed inset-0 -z-10 bg-[#F4F7F9] pointer-events-none opacity-0" />
      <section id="sites-devis" ref={devis} className="mt-10 bg-[#F4F7F9] text-[#0B1220] py-24 md:py-32">
        <div className="cine-conteneur grid lg:grid-cols-2 gap-10 items-end">
          <div>
            <p className="cine-oeil !text-[#5A6B7A]">{ps.prixOeil}</p>
            <span className="cine-filet mt-3 !bg-[#0F8F8F]" aria-hidden="true" />
            <h2 className="cine-h2 mt-6 !text-[#0B1220] whitespace-pre-line">{ps.prixTitre}</h2>
            <p className="cine-intro mt-6 !text-[#4A5A68]">{t.sites.prix}</p>
          </div>

          <div className="rounded-[1.5rem] bg-[#0B1220] text-white p-8 md:p-10">
            <p className="cine-titre text-2xl">{ps.contactTitre}</p>
            <p className="mt-2 text-[var(--gris-clair)]">{ps.contactTexte}</p>
            <div className="mt-8 grid gap-3">
              {telBrut && (
                <a href={`tel:${telBrut}`} className="cine-bouton cine-bouton--plein w-full">{tel}</a>
              )}
              {contact?.email && (
                <a href={`mailto:${contact.email}?subject=Site%20internet`} className="cine-bouton cine-bouton--fantome w-full">
                  {contact.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
