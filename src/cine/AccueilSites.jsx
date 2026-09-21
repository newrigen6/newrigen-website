import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useSiteContent } from '../content/SiteContent'
import { useContenu } from './useContenu'
import { Acte, Oeil } from './composants/Acte'
import { CadreNavigateur } from './composants/Vignettes'
import { useTimelineMaitresse } from './useTimelineMaitresse'
import { revelerBlocs, composerTitre, leverLeJour } from './animations'
import { numerosDeContact } from './telephones'

/**
 * La page d'accueil — la création de sites internet.
 *
 * C'est l'offre principale depuis le 20.09.2026, et elle s'adresse à tous les
 * commerces, pas au seul bâtiment. Le logiciel de devis garde sa page ; il est
 * renvoyé d'ici en une ligne, sans disputer la place à l'offre qui vend.
 *
 * Le récit suit celui de la publicité : on vous cherche, on ne vous trouve
 * pas… puis ils vous appellent. Une même histoire à l'écran et en vidéo se
 * reconnaît ; deux histoires différentes se contredisent.
 *
 * Aucun portfolio, aucun témoignage : on n'en a pas et on n'en invente pas.
 * La preuve, c'est la page qu'on est en train de lire.
 */
export default function AccueilSites() {
  const t = useContenu()
  const s = t.site
  const { contact } = useSiteContent()
  const { niveau, pret, ancre } = useTimelineMaitresse()

  const page = useRef(null)
  const titre = useRef(null)
  const voile = useRef(null)
  const devis = useRef(null)

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
    ScrollTrigger.refresh()
    return () => defaire.forEach(f => f?.())
  }, [pret, niveau, ancre])

  // Deux numéros : celui de Tiago et celui de David, présentés à l'identique.
  // Aucun des deux n'est « le bon » — on appelle celui qu'on veut.
  const numeros = numerosDeContact(contact)
  const mailto = contact?.email ? `mailto:${contact.email}?subject=Site%20internet` : null

  return (
    <div ref={page}>
      {/* ── Héros ──────────────────────────────────────────────────────────
          Texte à gauche, cadre de navigateur à droite. Le téléphone d'abord :
          c'est sur un téléphone qu'on cherche un commerce, le soir. */}
      <Acte id="accueil" premier>
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center">
          <div>
            <Oeil texte={s.oeil} />
            <h1 ref={titre} className="cine-h1 mt-6">
              {s.titre1}{' '}
              <br />
              <span className="text-white">{s.titre2}</span>
            </h1>
            <p className="cine-intro mt-7">{s.intro}</p>

            {/* Les deux numéros, à poids égal : celui qui appelle le soir veut
                une deuxième chance de tomber sur quelqu'un. */}
            {numeros.length > 0 && (
              <div className="mt-10">
                <p className="cine-oeil">{s.ctaContact}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {numeros.map(({ numero, href }) => (
                    <a key={numero} href={href} className="cine-bouton cine-bouton--plein">
                      {numero}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative hidden md:block">
            <div className="cine-halo -top-24 -right-10" aria-hidden="true" />
            <CadreNavigateur className="relative lg:rotate-[1.5deg]" />
          </div>
        </div>
      </Acte>

      {/* ── Le problème ────────────────────────────────────────────────────
          Trois situations, pas des statistiques : on ne cite aucun chiffre
          qu'on ne pourrait pas prouver. */}
      <section id="probleme" data-acte="probleme" className="relative py-24 md:py-32">
        <div className="cine-conteneur">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-end" data-revele>
            <div>
              <Oeil texte={s.problemeOeil} />
              <h2 className="cine-h2 mt-6 whitespace-pre-line">{s.problemeTitre}</h2>
            </div>
            <p className="cine-intro lg:pb-2">{s.problemeIntro}</p>
          </div>

          <dl className="mt-16 grid sm:grid-cols-3 border-t border-[var(--filet-fort)]">
            {s.problemePoints.map((p, i) => (
              <div
                key={p.titre}
                data-revele
                data-retard={i * 0.1}
                className={`pt-8 pb-2 sm:pr-8 ${i > 0 ? 'sm:pl-8 sm:border-l border-[var(--filet)] border-t sm:border-t-0 mt-6 sm:mt-0' : ''}`}
              >
                <dt className="cine-titre text-2xl md:text-3xl text-[var(--ambre)]">{p.titre}</dt>
                <dd className="mt-3 text-[var(--gris-clair)] leading-relaxed max-w-[32ch]">{p.texte}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Ce qu'on fait ──────────────────────────────────────────────────
          Liste numérotée, titre collant à gauche. */}
      <section className="relative py-24 md:py-32">
        <div className="cine-conteneur grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20">
          <div data-revele className="lg:sticky lg:top-28 self-start">
            <Oeil texte={s.faitOeil} />
            <h2 className="cine-h2 mt-6 whitespace-pre-line">{s.faitTitre}</h2>
          </div>

          <ol className="divide-y divide-[var(--filet)] border-y border-[var(--filet)]">
            {s.points.map((p, i) => (
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

      {/* ── Pour qui ───────────────────────────────────────────────────────
          L'offre a été élargie à tous les commerces : il faut que chacun s'y
          reconnaisse, sinon un coiffeur pense que ce n'est pas pour lui. */}
      <Acte id="pour-qui">
        <div data-revele className="max-w-3xl">
          <Oeil texte={s.pourQuiOeil} />
          <h2 className="cine-h2 mt-6 whitespace-pre-line">{s.pourQuiTitre}</h2>
          <p className="cine-intro mt-6">{s.pourQuiIntro}</p>
        </div>

        <ul className="mt-12 flex flex-wrap gap-3">
          {s.metiers.map((m, i) => (
            <li
              key={m}
              data-revele
              data-retard={i * 0.04}
              className="rounded-full border border-[var(--filet-fort)] px-5 py-2.5 text-[var(--gris-clair)]"
            >
              {m}
            </li>
          ))}
        </ul>
      </Acte>

      {/* ── Les étapes ─────────────────────────────────────────────────── */}
      <Acte id="etapes">
        <div data-revele className="max-w-2xl">
          <Oeil texte={s.etapesOeil} />
          <h2 className="cine-h2 mt-6 whitespace-pre-line">{s.etapesTitre}</h2>
        </div>

        {/* Cinq etapes : cinq colonnes sur grand ecran, sinon la cinquieme
            carte se retrouverait seule sur une deuxieme rangee. */}
        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {s.etapes.map((e, i) => (
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

      {/* ── Le logiciel, en passant ─────────────────────────────────────────
          Une seule ligne, et seulement pour ceux que ça concerne. */}
      <Acte id="logiciel">
        <div className="cine-carte p-8 md:p-10 flex flex-col lg:flex-row lg:items-center gap-8" data-revele>
          <div className="lg:flex-1">
            <p className="cine-oeil">{s.logicielOeil}</p>
            <h2 className="cine-titre text-2xl md:text-3xl text-white mt-3">{s.logicielTitre}</h2>
            <p className="mt-3 text-[var(--gris-clair)] leading-relaxed max-w-[60ch]">{s.logicielTexte}</p>
          </div>
          <Link to="/logiciel" className="cine-bouton cine-bouton--fantome flex-shrink-0">
            {s.logicielCta}
          </Link>
        </div>
      </Acte>

      {/* ── Le prix ─────────────────────────────────────────────────────────
          Il se discute : on le dit franchement plutôt que d'afficher un
          « dès X.– » qui n'engagerait à rien et décevrait à la première visite. */}
      <div ref={voile} aria-hidden="true" className="fixed inset-0 -z-10 bg-[#F4F7F9] pointer-events-none opacity-0" />
      <section id="devis" ref={devis} className="mt-10 bg-[#F4F7F9] text-[#0B1220] py-24 md:py-32">
        <div className="cine-conteneur grid lg:grid-cols-2 gap-10 items-end">
          <div>
            <p className="cine-oeil !text-[#5A6B7A]">{s.prixOeil}</p>
            <span className="cine-filet mt-3 !bg-[#0F8F8F]" aria-hidden="true" />
            <h2 className="cine-h2 mt-6 !text-[#0B1220] whitespace-pre-line">{s.prixTitre}</h2>
            <p className="cine-intro mt-6 !text-[#4A5A68]">{s.prixTexte}</p>
          </div>

          <div className="rounded-[1.5rem] bg-[#0B1220] text-white p-8 md:p-10">
            <p className="cine-titre text-2xl">{s.contactTitre}</p>
            <p className="mt-2 text-[var(--gris-clair)]">{s.contactTexte}</p>
            <div className="mt-8 grid gap-3">
              {/* Les trois moyens de joindre, presentes a l'identique : aucun
                  n'est « le bon », on prend celui qui arrange. */}
              {numeros.map(({ numero, href }) => (
                <a key={numero} href={href} className="cine-bouton cine-bouton--fantome w-full">
                  {numero}
                </a>
              ))}
              {mailto && (
                <a href={mailto} className="cine-bouton cine-bouton--fantome w-full">{contact.email}</a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
