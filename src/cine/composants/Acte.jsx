/**
 * Un acte : une section pleine largeur, avec son rythme vertical.
 *
 * Le `data-acte` n'est décoratif qu'en apparence — c'est l'accroche par laquelle
 * la timeline maîtresse viendra brancher ses sous-timelines à l'étape C. Le
 * poser dès maintenant évite d'avoir à retoucher le balisage une fois qu'il est
 * relu et indexé.
 */
export function Acte({ id, premier = false, children }) {
  return (
    <section
      id={id}
      data-acte={id}
      className={premier
        // Le héros occupe l'écran sans jamais le dépasser : sur un téléphone
        // couché, `100vh` cacherait le bouton sous la barre du navigateur.
        ? 'min-h-[100svh] flex items-center pt-28 pb-20'
        : 'py-20 md:py-28'}
    >
      <div className="cine-conteneur">{children}</div>
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
