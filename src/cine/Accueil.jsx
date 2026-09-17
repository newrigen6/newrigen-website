import { Link } from 'react-router-dom'
import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { useT } from '../i18n'
import { useSiteContent } from '../content/SiteContent'
import { montant } from '../lib/montant'
import { useContenu } from './useContenu'
import { Acte, Oeil } from './composants/Acte'
import {
  CarteDevis, VignetteDevis, VignetteEquipe, VignetteFacture, VignetteMarge, CadreNavigateur,
} from './composants/Vignettes'
import HeroFond from './HeroFond'
import { useTimelineMaitresse } from './useTimelineMaitresse'
import {
  revelerBlocs, composerTitre, parallaxeSouris, epinglerFonctions, leverLeJour,
} from './animations'

// La 3D n'entre jamais dans le paquet de départ : elle pèse à elle seule plus
// que tout le reste du site. Elle est demandée après le premier affichage, et
// seulement si l'appareil a de quoi la faire tourner.
const Scene3D = lazy(() => import('./Scene3D'))

const VIGNETTES = {
  devis: VignetteDevis,
  chantier: VignetteEquipe,
  facture: VignetteFacture,
  marge: VignetteMarge,
}

/** Une petite coche, pour les preuves et les listes de fonctions. */
function Coche({ className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`w-4 h-4 flex-shrink-0 ${className}`}>
      <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * La page d'accueil — sept actes, et aucun ne reprend la mise en page du
 * précédent (DESIGN.md). Une page où trois sections se suivent avec la même
 * grille de cartes se lit comme une seule longue liste : l'œil décroche.
 *
 * Tout ce qu'on lit est du HTML sémantique, écrit avant toute animation. La
 * timeline se branche dessus ; elle n'est jamais la condition pour que la page
 * soit lisible.
 */
export default function Accueil() {
  const tr = useT()
  const t = useContenu()
  const { prix } = useSiteContent()
  const { niveau, pret, ancre } = useTimelineMaitresse()

  const page = useRef(null)
  const titre = useRef(null)
  const calque3d = useRef(null)
  const sectionProduit = useRef(null)
  const sectionFonctions = useRef(null)
  const voile = useRef(null)
  const conversion = useRef(null)

  // La progression partagée avec la scène 3D passe par une référence : un état
  // ferait re-rendre React soixante fois par seconde pour déplacer un objet
  // que three.js sait déplacer tout seul.
  const progression = useRef(0)
  const [scene3dVoulue, setScene3dVoulue] = useState(false)

  useEffect(() => {
    if (!pret || !page.current) return
    const { gsap, trigger: ScrollTrigger } = ancre.current
    if (!gsap || !ScrollTrigger) return

    const sobre = niveau === 'sobre'
    const defaire = [revelerBlocs(gsap, ScrollTrigger, page.current, { sobre })]

    if (!sobre) {
      defaire.push(composerTitre(gsap, titre.current))
      defaire.push(parallaxeSouris(gsap, calque3d.current))
      defaire.push(epinglerFonctions(gsap, ScrollTrigger, sectionFonctions.current))
      defaire.push(leverLeJour(gsap, ScrollTrigger, voile.current, conversion.current))

      // Le devis de la tablette se remplit pendant qu'on lit comment il se
      // remplit : c'est tout l'intérêt de brancher la 3D sur le défilement.
      const suivi = ScrollTrigger.create({
        trigger: sectionProduit.current || page.current.querySelector('#produit'),
        start: 'top 80%',
        end: 'bottom 40%',
        scrub: true,
        onUpdate: (self) => { progression.current = self.progress },
      })
      defaire.push(() => suivi.kill())
    }

    ScrollTrigger.refresh()
    return () => defaire.forEach(f => f?.())
  }, [pret, niveau, ancre])

  // La scène 3D n'est demandée qu'une fois le navigateur au repos : la charger
  // pendant le premier affichage retarderait ce qu'elle doit mettre en valeur.
  useEffect(() => {
    if (niveau !== 'complet') return
    const lancer = () => setScene3dVoulue(true)
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(lancer, { timeout: 2500 })
      : window.setTimeout(lancer, 1200)
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id)
      else window.clearTimeout(id)
    }
  }, [niveau])

  const horizontal = niveau === 'complet'

  // Les fonctions de chaque pack sont reprises mot pour mot de la page Tarifs,
  // par les mêmes clés de traduction : les deux pages ne peuvent pas diverger,
  // et elles existent déjà dans les cinq langues.
  const fonctionsDuPack = (cle) => {
    const liste = []
    for (let n = 1; n <= 9; n++) {
      const k = `tarifs.${cle}.f${n}`
      const v = tr(k)
      if (v && v !== k) liste.push(v)
    }
    return liste
  }

  return (
    <div ref={page}>
      {/* ── Acte 1 — le héros ─────────────────────────────────────────────
          Pleine largeur, photo ; texte à gauche, carte produit à droite. */}
      <Acte id="hero" premier fond={<HeroFond anime={niveau === 'complet'} />}>
        <div className="grid lg:grid-cols-[1.55fr_1fr] gap-10 items-center">
          <div className="relative">
            <Oeil texte={t.hero.oeil} />
            <h1 ref={titre} className="cine-h1 mt-6">
              {t.hero.titre1}{' '}
              <br />
              <span className="text-white">{t.hero.titre2}</span>
            </h1>
            <p className="cine-intro mt-7">{t.hero.intro}</p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link to="/tarifs" className="cine-bouton cine-bouton--plein">
                {t.hero.ctaPrincipal}
              </Link>
              <a href="#fonctions" className="cine-bouton cine-bouton--fantome">
                {t.hero.ctaSecondaire}
              </a>
            </div>
            <p className="mt-4 text-sm text-[var(--gris)]">{t.hero.mention}</p>

            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--gris-clair)]">
              {t.hero.preuves.map(p => (
                <li key={p} className="flex items-center gap-2">
                  <Coche className="text-[var(--turquoise)]" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* La carte flotte sur la photo, légèrement inclinée : elle montre le
              produit dès la première seconde, là où le texte le décrit. */}
          <div className="hidden lg:flex justify-end">
            <div className="relative">
              <div className="cine-halo -top-24 -left-24" aria-hidden="true" />
              <CarteDevis className="relative rotate-[-2.5deg]" />
            </div>
          </div>
        </div>
      </Acte>

      {/* ── Acte 2 — le problème ──────────────────────────────────────────
          Éditorial : énoncé en deux colonnes, puis trois chiffres géants
          séparés par des filets. Pas une carte. */}
      <section id="probleme" data-acte="probleme" className="relative py-24 md:py-32">
        <div className="cine-conteneur">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-end" data-revele>
            <div>
              <Oeil texte={t.probleme.oeil} />
              <h2 className="cine-h2 mt-6 whitespace-pre-line">{t.probleme.titre}</h2>
            </div>
            <p className="cine-intro lg:pb-2">{t.probleme.intro}</p>
          </div>

          <dl className="mt-16 md:mt-20 grid sm:grid-cols-3 border-t border-[var(--filet-fort)]">
            {t.probleme.points.map((p, i) => (
              <div
                key={p.chiffre}
                data-revele
                data-retard={i * 0.1}
                className={`pt-8 pb-2 sm:pr-8 ${i > 0 ? 'sm:pl-8 sm:border-l border-[var(--filet)]' : ''} ${i > 0 ? 'border-t sm:border-t-0 border-[var(--filet)] mt-6 sm:mt-0' : ''}`}
              >
                <dt className="cine-titre text-[clamp(2.6rem,1.8rem+2.6vw,4rem)] leading-none whitespace-nowrap text-[var(--ambre)] cine-chiffres">
                  {p.chiffre}
                </dt>
                <dd className="mt-4 text-[var(--gris-clair)] leading-relaxed max-w-[28ch]">{p.libelle}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Acte 3 — le produit ───────────────────────────────────────────
          Split 55/45 avec la tablette, puis une frise reliée. */}
      <Acte id="produit">
        <div ref={sectionProduit} className="lg:grid lg:grid-cols-[1.2fr_1fr] lg:gap-12 lg:items-center">
          <div data-revele>
            <Oeil texte={t.produit.oeil} />
            <h2 className="cine-h2 mt-6 whitespace-pre-line">{t.produit.titre}</h2>
            <p className="cine-intro mt-6">{t.produit.intro}</p>
          </div>

          {/* Décorative : le texte dit déjà tout ce que la tablette montre. */}
          {niveau !== 'complet' && (
            <div className="relative hidden lg:flex justify-center" aria-hidden="true">
              <div className="cine-halo -top-16 left-0" />
              <CarteDevis className="relative rotate-[2deg] scale-110" />
            </div>
          )}
          {niveau === 'complet' && (
            <div
              ref={calque3d}
              aria-hidden="true"
              className="relative pointer-events-none hidden lg:block h-[500px] -mr-6"
              style={{ perspective: '1200px' }}
            >
              <div className="cine-halo top-10 left-10" />
              {scene3dVoulue && (
                <Suspense fallback={null}>
                  <Scene3D progression={progression} />
                </Suspense>
              )}
            </div>
          )}
        </div>

        {/* La frise : un fil continu relie les trois temps. Horizontal sur grand
            écran, vertical sur téléphone — la ligne suit toujours la lecture. */}
        <ol className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          <span
            aria-hidden="true"
            className="absolute md:left-0 md:right-0 md:top-[22px] md:h-px md:w-auto left-[22px] top-0 bottom-0 w-px bg-gradient-to-b md:bg-gradient-to-r from-[var(--turquoise)] via-[var(--filet-fort)] to-transparent"
          />
          {t.produit.etapes.map((e, i) => (
            <li key={e.titre} className="relative pl-16 md:pl-0" data-revele data-retard={i * 0.12}>
              <span
                aria-hidden="true"
                className="absolute left-0 md:static grid place-items-center w-11 h-11 rounded-full bg-[var(--nuit)] border border-[var(--turquoise)] text-[var(--turquoise)] font-bold cine-chiffres"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="md:mt-6 cine-titre text-xl text-white">{e.titre}</h3>
              <p className="mt-2 text-[var(--gris-clair)] leading-relaxed max-w-[34ch]">{e.texte}</p>
            </li>
          ))}
        </ol>
      </Acte>

      {/* ── Acte 4 — les fonctions ────────────────────────────────────────
          Épinglé et horizontal sur grand écran ; chaque carte montre un
          fragment de l'interface. Simple liste ailleurs : sur téléphone,
          épingler confisque le seul geste que le visiteur connaisse. */}
      <section
        id="fonctions"
        data-acte="fonctions"
        ref={sectionFonctions}
        className={horizontal
          ? 'relative min-h-[100svh] flex items-center overflow-hidden py-20'
          : 'relative py-24 md:py-32'}
      >
        <div className="cine-conteneur w-full">
          <div data-revele className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Oeil texte={t.fonctions.oeil} />
              <h2 className="cine-h2 mt-6 whitespace-pre-line">{t.fonctions.titre}</h2>
            </div>
            {horizontal && (
              <p className="text-sm text-[var(--gris)] flex items-center gap-2">
                Continuez à défiler
                <span aria-hidden="true" className="inline-block w-8 h-px bg-[var(--gris)]" />
              </p>
            )}
          </div>

          <div
            data-piste={horizontal ? 'oui' : undefined}
            className={horizontal
              ? 'mt-12 flex gap-5 w-max will-change-transform'
              : 'mt-12 grid gap-5 md:grid-cols-2'}
          >
            {t.fonctions.liste.map((f, i) => {
              const Vignette = VIGNETTES[f.cle]
              return (
                <article
                  key={f.cle}
                  className={`cine-carte cine-carte--vivante p-6 flex flex-col ${horizontal ? 'w-[min(80vw,400px)] flex-shrink-0' : ''}`}
                  data-revele={horizontal ? undefined : true}
                  data-retard={i * 0.08}
                >
                  {Vignette && <Vignette />}
                  <p className="mt-6 text-xs font-bold tracking-[0.2em] text-[var(--turquoise)] cine-chiffres">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-2 cine-titre text-2xl text-white">{f.titre}</h3>
                  <p className="mt-3 text-[var(--gris-clair)] leading-relaxed">{f.texte}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Acte 5 — la seconde offre ─────────────────────────────────────
          Bento asymétrique : un grand bloc avec le cadre de navigateur, des
          blocs d'arguments autour. Deux entonnoirs : un site se chiffre après
          une conversation, il n'a pas le bouton d'essai du logiciel. */}
      <Acte id="sites">
        <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr] items-stretch">
          <div className="cine-carte p-8 md:p-10 relative overflow-hidden" data-revele>
            <div className="cine-halo -bottom-40 -right-40" aria-hidden="true" />
            <div className="relative">
              <Oeil texte={t.sites.oeil} />
              <h2 className="cine-h2 mt-6 whitespace-pre-line">{t.sites.titre}</h2>
              <p className="cine-intro mt-6">{t.sites.intro}</p>
              <CadreNavigateur className="mt-10 max-w-[560px]" />
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {t.sites.points.map((p, i) => (
              <div key={p} className="cine-carte cine-carte--vivante p-6 flex items-start gap-5" data-revele data-retard={0.08 + i * 0.07}>
                <span className="cine-titre text-3xl leading-none text-[var(--turquoise)] cine-chiffres">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-white leading-snug pt-1">{p}</p>
              </div>
            ))}

            <div className="flex-1 rounded-[var(--rayon-large)] p-7 flex flex-col justify-between gap-6 bg-[var(--turquoise)] text-[var(--nuit)]" data-revele>
              <p className="font-semibold leading-relaxed">{t.sites.prix}</p>
              <Link
                to="/sites-internet"
                className="self-start cine-bouton !bg-[var(--nuit)] !text-white hover:!bg-[var(--ardoise)]"
              >
                {t.sites.cta}
              </Link>
            </div>
          </div>
        </div>
      </Acte>

      {/* ── Acte 6 — la confiance ─────────────────────────────────────────
          Bandeau centré, une phrase et trois preuves en ligne. Retour au calme
          avant le prix. */}
      <section id="confiance" data-acte="confiance" className="relative py-24 md:py-32 overflow-hidden">
        <div className="cine-halo left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
        <div className="cine-conteneur relative text-center" data-revele>
          <span
            aria-hidden="true"
            className="mx-auto grid place-items-center w-14 h-14 rounded-2xl bg-[#DA291C] shadow-[var(--ombre)]"
          >
            <svg viewBox="0 0 32 32" className="w-7 h-7"><path d="M13 6h6v7h7v6h-7v7h-6v-7H6v-6h7z" fill="#fff" /></svg>
          </span>
          <p className="cine-oeil mt-8">{t.confiance.oeil}</p>
          <h2 className="cine-h2 mt-5 whitespace-pre-line mx-auto max-w-[18ch]">{t.confiance.titre}</h2>

          <dl className="mt-14 grid gap-8 md:grid-cols-3 text-left md:text-center max-w-5xl mx-auto">
            {t.confiance.points.map((p, i) => (
              <div key={p.titre} data-revele data-retard={i * 0.1}>
                <dt className="cine-titre text-xl text-white">{p.titre}</dt>
                <dd className="mt-2 text-[var(--gris-clair)] leading-relaxed">{p.texte}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Acte 7 — la conversion ────────────────────────────────────────
          Le jour se lève : il ne reste que le prix. Le pack du milieu est mis
          en avant par son usage, jamais par une popularité inventée. */}
      <div
        ref={voile}
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-[#F4F7F9] pointer-events-none opacity-0"
      />
      <section
        id="offre"
        ref={conversion}
        className="mt-10 bg-[#F4F7F9] text-[#0B1220] py-24 md:py-32"
      >
        <div className="cine-conteneur">
          <div className="grid lg:grid-cols-2 gap-6 items-end">
            <div>
              <p className="cine-oeil !text-[#5A6B7A]">{t.offre.oeil}</p>
              <span className="cine-filet mt-3 !bg-[#0F8F8F]" aria-hidden="true" />
              <h2 className="cine-h2 mt-6 !text-[#0B1220] whitespace-pre-line">{t.offre.titre}</h2>
            </div>
            <p className="cine-intro !text-[#4A5A68] lg:pb-2">{t.offre.intro}</p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3 items-stretch">
            {t.offre.packs.map(p => {
              const enAvant = p.cle === t.offre.miseEnAvant
              const fonctions = fonctionsDuPack(p.cle)
              return (
                <article
                  key={p.cle}
                  className={`relative flex flex-col rounded-[1.5rem] p-7 md:p-8 ${enAvant
                    ? 'bg-[#0B1220] text-white shadow-[0_30px_60px_-30px_rgb(11_18_32_/_0.6)] md:-my-4 md:py-12'
                    : 'bg-white border border-[#E2E8ED]'}`}
                >
                  {enAvant && (
                    <span className="absolute -top-3 left-7 rounded-full bg-[var(--turquoise)] px-3 py-1 text-xs font-bold text-[var(--nuit)]">
                      {t.offre.etiquetteMiseEnAvant}
                    </span>
                  )}
                  <h3 className="cine-titre text-2xl">{p.nom}</h3>
                  <p className={`mt-1 text-sm ${enAvant ? 'text-[var(--gris-clair)]' : 'text-[#5A6B7A]'}`}>{p.pour}</p>

                  <p className="mt-7 cine-titre text-5xl cine-chiffres">
                    {montant(prix?.[`${p.cle}_mensuel`])}
                    <span className={`ml-1.5 text-base font-medium ${enAvant ? 'text-[var(--gris-clair)]' : 'text-[#5A6B7A]'}`} style={{ fontFamily: 'var(--police-texte)' }}>
                      {t.offre.parMois}
                    </span>
                  </p>

                  <ul className="mt-7 space-y-2.5 text-sm flex-1">
                    {fonctions.map(f => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Coche className={`mt-0.5 ${enAvant ? 'text-[var(--turquoise)]' : 'text-[#0F8F8F]'}`} />
                        <span className={enAvant ? 'text-[var(--gris-clair)]' : 'text-[#4A5A68]'}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/tarifs"
                    className={`mt-8 cine-bouton w-full ${enAvant
                      ? 'cine-bouton--plein'
                      : '!bg-[#0B1220] !text-white hover:!bg-[#1B2A3A]'}`}
                  >
                    {t.offre.ctaPrincipal}
                  </Link>
                </article>
              )
            })}
          </div>

          <p className="mt-10 text-center text-sm text-[#5A6B7A]">
            <Link to="/tarifs" className="underline underline-offset-4 hover:text-[#0B1220]">
              {t.offre.ctaSecondaire}
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
