import { Link } from 'react-router-dom'
import { useLangue } from '../i18n'
import { useSiteContent } from '../content/SiteContent'
import { montant } from '../lib/montant'
import { contenuPourLangue } from './contenu'
import { Acte, Oeil } from './composants/Acte'

/**
 * La page d'accueil — sept actes, aucune animation.
 *
 * C'est l'étape B du plan, et c'est volontairement la moins spectaculaire : le
 * site doit être bon avant d'être beau. Tout ce qu'on lit ici est du HTML
 * sémantique servi au premier octet ; la timeline viendra se brancher dessus
 * sans jamais devenir la condition pour que la page soit lisible.
 *
 * Si le script ne se charge jamais — vieux téléphone, 4G qui tombe, blocage —
 * il reste une page de vente correcte. C'est le seul filet qui vaille.
 */
export default function Accueil() {
  const { langue } = useLangue()
  const t = contenuPourLangue(langue)
  const { prix } = useSiteContent()

  return (
    <>
      {/* ── Acte 1 — le héros ────────────────────────────────────────────── */}
      <Acte id="hero" premier>
        <div className="max-w-4xl">
          <Oeil texte={t.hero.oeil} />
          <h1 className="cine-h1 mt-6">
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
      </Acte>

      {/* ── Acte 2 — le problème ─────────────────────────────────────────── */}
      <Acte id="probleme">
        <Oeil texte={t.probleme.oeil} />
        <h2 className="cine-h2 mt-6 whitespace-pre-line">{t.probleme.titre}</h2>
        <p className="cine-intro mt-6">{t.probleme.intro}</p>

        <ul className="mt-12 grid gap-4 sm:grid-cols-3">
          {t.probleme.points.map(p => (
            <li key={p.chiffre} className="cine-carte p-6">
              <p className="text-3xl font-extrabold tracking-tight text-[var(--ambre)]">{p.chiffre}</p>
              <p className="mt-2 text-sm text-[var(--gris-clair)] leading-relaxed">{p.libelle}</p>
            </li>
          ))}
        </ul>
      </Acte>

      {/* ── Acte 3 — le produit ──────────────────────────────────────────── */}
      <Acte id="produit">
        <Oeil texte={t.produit.oeil} />
        <h2 className="cine-h2 mt-6 whitespace-pre-line">{t.produit.titre}</h2>
        <p className="cine-intro mt-6">{t.produit.intro}</p>

        {/* Les trois temps du devis. L'acte 3 animé fera défiler la tablette au
            même rythme : la liste ordonnée est déjà la timeline, en HTML. */}
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {t.produit.etapes.map((e, i) => (
            <li key={e.titre} className="cine-carte p-6">
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
      <Acte id="fonctions">
        <Oeil texte={t.fonctions.oeil} />
        <h2 className="cine-h2 mt-6 whitespace-pre-line">{t.fonctions.titre}</h2>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {t.fonctions.liste.map(f => (
            <article key={f.cle} className="cine-carte p-7">
              <h3 className="text-xl font-bold text-white">{f.titre}</h3>
              <p className="mt-2.5 text-[var(--gris-clair)] leading-relaxed">{f.texte}</p>
            </article>
          ))}
        </div>
      </Acte>

      {/* ── Acte 5 — la seconde offre ────────────────────────────────────── */}
      {/* Deux offres, deux entonnoirs : le logiciel se vend seul à prix affiché,
          un site se chiffre après une conversation. On ne mélange pas les deux
          boutons, sinon aucun des deux ne se comprend. */}
      <Acte id="sites">
        <div className="cine-carte p-8 md:p-12 border-[var(--filet-fort)]">
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
        <Oeil texte={t.confiance.oeil} />
        <h2 className="cine-h2 mt-6 whitespace-pre-line">{t.confiance.titre}</h2>

        <dl className="mt-12 grid gap-4 md:grid-cols-3">
          {t.confiance.points.map(p => (
            <div key={p.titre} className="cine-carte p-6">
              <dt className="text-lg font-bold text-white">{p.titre}</dt>
              <dd className="mt-2 text-sm text-[var(--gris-clair)] leading-relaxed">{p.texte}</dd>
            </div>
          ))}
        </dl>
      </Acte>

      {/* ── Acte 7 — la conversion ───────────────────────────────────────── */}
      {/* Le fond s'éclaircit et la 3D disparaît : arrivé ici, le visiteur a
          décidé de regarder le prix. Plus rien ne doit bouger devant lui. */}
      <section id="offre" className="mt-24 bg-white text-[#0B1220] py-20 md:py-28">
        <div className="cine-conteneur">
          <p className="cine-oeil !text-[#5A6B7A]">{t.offre.oeil}</p>
          <span className="cine-filet mt-3 !bg-[#0F8F8F]" />
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
            <Link
              to="/tarifs"
              className="cine-bouton !bg-[#0B1220] !text-white hover:!bg-[#1B2A3A]"
            >
              {t.offre.ctaPrincipal}
            </Link>
            <Link
              to="/tarifs"
              className="cine-bouton !border-[#CBD6DE] !text-[#0B1220] hover:!border-[#0B1220]"
            >
              {t.offre.ctaSecondaire}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
