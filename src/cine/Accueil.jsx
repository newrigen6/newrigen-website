import { Link } from 'react-router-dom'
import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { useLangue } from '../i18n'
import { useSiteContent } from '../content/SiteContent'
import { montant } from '../lib/montant'
import { contenuPourLangue } from './contenu'
import { Acte, Oeil } from './composants/Acte'
import { useTimelineMaitresse } from './useTimelineMaitresse'
import {
  revelerBlocs, composerTitre, parallaxeSouris, epinglerFonctions, leverLeJour,
} from './animations'

// La 3D n'entre jamais dans le paquet de départ : elle pèse à elle seule plus
// que tout le reste du site. Elle est demandée après le premier affichage, et
// seulement si l'appareil a de quoi la faire tourner.
const Scene3D = lazy(() => import('./Scene3D'))

/**
 * La page d'accueil — sept actes.
 *
 * Tout ce qu'on lit est du HTML sémantique, écrit avant toute animation. La
 * timeline se branche dessus ; elle n'est jamais la condition pour que la page
 * soit lisible. Si le script ne se charge pas — vieux téléphone, 4G qui tombe,
 * bloqueur — il reste une page de vente correcte.
 */
export default function Accueil() {
  const { langue } = useLangue()
  const t = contenuPourLangue(langue)
  const { prix } = useSiteContent()
  const { niveau, pret, ancre } = useTimelineMaitresse()

  const page = useRef(null)
  const titre = useRef(null)
  const calque3d = useRef(null)
  const sectionFonctions = useRef(null)
  const voile = useRef(null)
  const conversion = useRef(null)

  // La progression du héros, partagée avec la scène 3D par une référence :
  // la passer en état ferait re-rendre React soixante fois par seconde pour
  // déplacer un objet que trois.js sait déplacer tout seul.
  const progression = useRef(0)
  const [scene3dVoulue, setScene3dVoulue] = useState(false)

  useEffect(() => {
    if (!pret || !page.current) return
    const { gsap, trigger: ScrollTrigger } = ancre.current
    if (!gsap || !ScrollTrigger) return

    const sobre = niveau === 'sobre'
    const defaire = [
      revelerBlocs(gsap, ScrollTrigger, page.current, { sobre }),
    ]

    if (!sobre) {
      defaire.push(composerTitre(gsap, titre.current))
      defaire.push(parallaxeSouris(gsap, calque3d.current))
      defaire.push(epinglerFonctions(gsap, ScrollTrigger, sectionFonctions.current))
      defaire.push(leverLeJour(gsap, ScrollTrigger, voile.current, conversion.current))

      // La progression du héros, lue par la scène 3D.
      const suivi = ScrollTrigger.create({
        trigger: page.current.querySelector('#hero'),
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => { progression.current = self.progress },
      })
      defaire.push(() => suivi.kill())
    }

    ScrollTrigger.refresh()
    return () => defaire.forEach(f => f?.())
  }, [pret, niveau, ancre])

  // La scène 3D n'est demandée qu'une fois la page posée et le navigateur au
  // repos : la charger pendant le premier affichage retarderait précisément ce
  // qu'elle est censée mettre en valeur.
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

  return (
    <div ref={page}>
      {/* ── Acte 1 — le héros ────────────────────────────────────────────── */}
      <Acte id="hero" premier>
        <div className="relative">
          {/* La scène est décorative : elle ne porte aucune information que le
              texte ne dise déjà, et reste donc invisible aux lecteurs d'écran. */}
          {niveau === 'complet' && (
            <div
              ref={calque3d}
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-24 hidden lg:block w-[520px] h-[560px] opacity-90"
              style={{ perspective: '1200px' }}
            >
              {scene3dVoulue && (
                <Suspense fallback={null}>
                  <Scene3D progression={progression} />
                </Suspense>
              )}
            </div>
          )}

          <div className="max-w-3xl relative">
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
          </div>
        </div>
      </Acte>

      {/* ── Acte 2 — le problème ─────────────────────────────────────────── */}
      <Acte id="probleme">
        <div data-revele>
          <Oeil texte={t.probleme.oeil} />
          <h2 className="cine-h2 mt-6 whitespace-pre-line">{t.probleme.titre}</h2>
          <p className="cine-intro mt-6">{t.probleme.intro}</p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-3">
          {t.probleme.points.map((p, i) => (
            <li key={p.chiffre} className="cine-carte p-6" data-revele data-retard={i * 0.09}>
              <p className="text-3xl font-extrabold tracking-tight text-[var(--ambre)]">{p.chiffre}</p>
              <p className="mt-2 text-sm text-[var(--gris-clair)] leading-relaxed">{p.libelle}</p>
            </li>
          ))}
        </ul>
      </Acte>

      {/* ── Acte 3 — le produit ──────────────────────────────────────────── */}
      <Acte id="produit">
        <div data-revele>
          <Oeil texte={t.produit.oeil} />
          <h2 className="cine-h2 mt-6 whitespace-pre-line">{t.produit.titre}</h2>
          <p className="cine-intro mt-6">{t.produit.intro}</p>
        </div>

        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {t.produit.etapes.map((e, i) => (
            <li key={e.titre} className="cine-carte p-6" data-revele data-retard={i * 0.09}>
              <span
                aria-hidden="true"
                className="grid place-items-center w-9 h-9 rounded-full bg-[var(--ardoise-2)] text-[var(--turquoise)] font-bold"
              >
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-bold text-white">{e.titre}</h3>
              <p className="mt-1.5 text-sm text-[var(--gris-clair)] leading-relaxed">{e.texte}</p>
            </li>
          ))}
        </ol>
      </Acte>

      {/* ── Acte 4 — les fonctions ───────────────────────────────────────── */}
      {/* Épinglé et horizontal sur grand écran ; simple liste ailleurs. Sur un
          téléphone, épingler confisque le geste vertical — le seul que le
          visiteur connaisse — et il n'a plus de moyen d'en sortir. */}
      <section
        id="fonctions"
        data-acte="fonctions"
        ref={sectionFonctions}
        className={horizontal
          ? 'min-h-[100svh] flex items-center overflow-hidden py-20'
          : 'py-20 md:py-28'}
      >
        <div className="cine-conteneur w-full">
          <div data-revele>
            <Oeil texte={t.fonctions.oeil} />
            <h2 className="cine-h2 mt-6 whitespace-pre-line">{t.fonctions.titre}</h2>
          </div>

          <div
            data-piste={horizontal ? 'oui' : undefined}
            className={horizontal
              ? 'mt-12 flex gap-5 w-max will-change-transform'
              : 'mt-12 grid gap-4 md:grid-cols-2'}
          >
            {t.fonctions.liste.map((f, i) => (
              <article
                key={f.cle}
                className={`cine-carte p-7 ${horizontal ? 'w-[min(78vw,420px)] flex-shrink-0' : ''}`}
                data-revele={horizontal ? undefined : true}
                data-retard={i * 0.08}
              >
                <h3 className="text-xl font-bold text-white">{f.titre}</h3>
                <p className="mt-2.5 text-[var(--gris-clair)] leading-relaxed">{f.texte}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Acte 5 — la seconde offre ────────────────────────────────────── */}
      {/* Deux offres, deux entonnoirs : le logiciel se vend seul à prix affiché,
          un site se chiffre après une conversation. */}
      <Acte id="sites">
        <div className="cine-carte p-8 md:p-12 border-[var(--filet-fort)]" data-revele>
          <Oeil texte={t.sites.oeil} />
          <h2 className="cine-h2 mt-6 whitespace-pre-line">{t.sites.titre}</h2>
          <p className="cine-intro mt-6">{t.sites.intro}</p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 max-w-3xl">
            {t.sites.points.map(p => (
              <li key={p} className="flex items-start gap-2.5 text-[var(--gris-clair)]">
                <span aria-hidden="true" className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--turquoise)] flex-shrink-0" />
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-[var(--gris-clair)] max-w-2xl leading-relaxed">{t.sites.prix}</p>

          <Link to="/sites-internet" className="cine-bouton cine-bouton--plein mt-8">
            {t.sites.cta}
          </Link>
        </div>
      </Acte>

      {/* ── Acte 6 — la confiance ────────────────────────────────────────── */}
      <Acte id="confiance">
        <div data-revele>
          <Oeil texte={t.confiance.oeil} />
          <h2 className="cine-h2 mt-6 whitespace-pre-line">{t.confiance.titre}</h2>
        </div>

        <dl className="mt-12 grid gap-4 md:grid-cols-3">
          {t.confiance.points.map((p, i) => (
            <div key={p.titre} className="cine-carte p-6" data-revele data-retard={i * 0.09}>
              <dt className="text-lg font-bold text-white">{p.titre}</dt>
              <dd className="mt-2 text-sm text-[var(--gris-clair)] leading-relaxed">{p.texte}</dd>
            </div>
          ))}
        </dl>
      </Acte>

      {/* ── Acte 7 — la conversion ───────────────────────────────────────── */}
      {/* Le jour se lève : la nuit se retire, il ne reste que le prix. Arrivé
          ici, le visiteur a décidé de regarder combien ça coûte — plus rien ne
          doit bouger devant lui. */}
      <div
        ref={voile}
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-white pointer-events-none opacity-0"
      />
      <section
        id="offre"
        ref={conversion}
        className="mt-24 bg-white text-[#0B1220] py-20 md:py-28"
      >
        <div className="cine-conteneur">
          <p className="cine-oeil !text-[#5A6B7A]">{t.offre.oeil}</p>
          <span className="cine-filet mt-3 !bg-[#0F8F8F]" aria-hidden="true" />
          <h2 className="cine-h2 mt-6 !text-[#0B1220] whitespace-pre-line">{t.offre.titre}</h2>
          <p className="cine-intro mt-6 !text-[#4A5A68]">{t.offre.intro}</p>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {t.offre.packs.map(p => (
              <article key={p.cle} className="rounded-2xl border border-[#E2E8ED] p-7 bg-[#F8FAFB]">
                <h3 className="text-xl font-extrabold tracking-tight">{p.nom}</h3>
                <p className="mt-1 text-sm text-[#5A6B7A]">{p.pour}</p>
                <p className="mt-6 text-4xl font-black tracking-tight">
                  {montant(prix?.[`${p.cle}_mensuel`])}
                  <span className="ml-1.5 text-base font-medium text-[#5A6B7A]">{t.offre.parMois}</span>
                </p>
                <p className="mt-4 text-sm text-[#4A5A68] leading-relaxed">{p.detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-3">
            <Link to="/tarifs" className="cine-bouton !bg-[#0B1220] !text-white hover:!bg-[#1B2A3A]">
              {t.offre.ctaPrincipal}
            </Link>
            <Link to="/tarifs" className="cine-bouton !border-[#CBD6DE] !text-[#0B1220] hover:!border-[#0B1220]">
              {t.offre.ctaSecondaire}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
