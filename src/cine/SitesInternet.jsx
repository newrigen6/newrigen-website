import { useLangue } from '../i18n'
import { useSiteContent } from '../content/SiteContent'
import { contenuPourLangue } from './contenu'
import { Acte, Oeil } from './composants/Acte'
import { useTitre } from './useTitre'

/**
 * L'offre « sites internet ».
 *
 * Le prix se fait sur demande : la page ne vend donc pas un abonnement, elle
 * obtient une conversation. Aucun bouton d'essai ici — il enverrait vers le
 * logiciel et perdrait la demande.
 *
 * Pas de formulaire non plus, pour l'instant : un artisan qui veut un site
 * appelle. Un téléphone et une adresse qui marchent valent mieux qu'un
 * formulaire dont personne ne surveille la boîte.
 */
export default function SitesInternet() {
  const { langue } = useLangue()
  const t = contenuPourLangue(langue)
  const { contact } = useSiteContent()

  useTitre(
    'Création de site internet pour artisans — Newrigen',
    'Sites internet sur mesure pour les entreprises du bâtiment en Valais : rapides sur mobile, trouvables sur Google, modifiables par vous. Devis sur demande.',
  )

  const tel = contact?.telephone1
  const telBrut = tel ? String(tel).replace(/\s/g, '') : null

  return (
    <>
      <Acte id="sites-hero" premier>
        <div className="max-w-4xl">
          <Oeil texte={t.sites.oeil} />
          <h1 className="cine-h1 mt-6">
            Votre métier mérite{' '}
            <br />
            <span className="text-white">mieux qu’une page Facebook</span>
          </h1>
          <p className="cine-intro mt-7">{t.sites.intro}</p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {telBrut && (
              <a href={`tel:${telBrut}`} className="cine-bouton cine-bouton--plein">
                Appeler — {tel}
              </a>
            )}
            {contact?.email && (
              <a href={`mailto:${contact.email}?subject=Site%20internet`} className="cine-bouton cine-bouton--fantome">
                Écrire un message
              </a>
            )}
          </div>
        </div>
      </Acte>

      <Acte id="sites-ce-quon-fait">
        <Oeil texte="Ce qu’on fait" />
        <h2 className="cine-h2 mt-6">Quatre choses,{' '}<br />et on ne promet rien d’autre</h2>

        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {t.sites.points.map(p => (
            <li key={p} className="cine-carte p-7 text-[var(--gris-clair)] leading-relaxed">
              {p}
            </li>
          ))}
        </ul>
      </Acte>

      <Acte id="sites-preuve">
        <div className="cine-carte p-8 md:p-12 border-[var(--filet-fort)]">
          <Oeil texte="La preuve" />
          <h2 className="cine-h2 mt-6">Vous êtes dessus</h2>
          <p className="cine-intro mt-6">
            Ce site est le nôtre, écrit et dessiné par nous. Vous jugez la vitesse,
            la lisibilité sur votre téléphone et le soin des détails sans qu’on ait
            à vous montrer un portfolio.
          </p>
        </div>
      </Acte>

      {/* Le prix se discute : on le dit clairement plutôt que d'afficher un
          « dès X.– » qui n'engagerait à rien et decevrait à la première visite. */}
      <section id="sites-devis" className="mt-24 bg-white text-[#0B1220] py-20 md:py-28">
        <div className="cine-conteneur">
          <p className="cine-oeil !text-[#5A6B7A]">Le prix</p>
          <span className="cine-filet mt-3 !bg-[#0F8F8F]" aria-hidden="true" />
          <h2 className="cine-h2 mt-6 !text-[#0B1220]">Sur demande,{' '}<br />parce que ça dépend de vous</h2>
          <p className="cine-intro mt-6 !text-[#4A5A68]">{t.sites.prix}</p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {telBrut && (
              <a href={`tel:${telBrut}`} className="cine-bouton !bg-[#0B1220] !text-white hover:!bg-[#1B2A3A]">
                {tel}
              </a>
            )}
            {contact?.email && (
              <a
                href={`mailto:${contact.email}?subject=Site%20internet`}
                className="cine-bouton !border-[#CBD6DE] !text-[#0B1220] hover:!border-[#0B1220]"
              >
                {contact.email}
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
