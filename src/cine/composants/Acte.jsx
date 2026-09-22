/**
 * Un acte : une section pleine largeur, avec son rythme vertical.
 *
 * Le `data-acte` n'est décoratif qu'en apparence — c'est l'accroche par laquelle
 * la timeline maîtresse viendra brancher ses sous-timelines à l'étape C. Le
 * poser dès maintenant évite d'avoir à retoucher le balisage une fois qu'il est
 * relu et indexé.
 */
export function Acte({ id, premier = false, fond = null, children }) {
  return (
    <section
      id={id}
      data-acte={id}
      className={`relative ${premier
        // Sur grand écran le héros occupe la hauteur d'écran — `svh` et non
        // `vh`, sinon un téléphone couché cacherait le bouton sous la barre du
        // navigateur. Sur téléphone il ne la force plus : son contenu tient en
        // 520 px, le reste était du vide, et l'écran ne laissait rien deviner
        // de la section suivante — rien n'invitait à faire défiler.
        ? 'flex items-center pt-24 pb-14 md:min-h-[100svh] md:pt-28 md:pb-20'
        : 'py-14 md:py-28'}`}
    >
      {fond}
      <div className="cine-conteneur relative">{children}</div>
    </section>
  )
}

/** Le surtitre et son filet turquoise — la signature reprise des visuels. */
export function Oeil({ texte }) {
  return (
    <>
      <p className="cine-oeil">{texte}</p>
      <span className="cine-filet mt-3" aria-hidden="true" />
    </>
  )
}
