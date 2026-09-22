import { useEffect, useRef } from 'react'

/**
 * Le plan large du héros — un chantier valaisan à l'heure bleue, dessiné.
 *
 * C'était une photo : trois tailles en AVIF et trois en JPEG, 260 Ko pour la
 * plus grande, plus une vignette encodée dans le HTML pour boucher le trou
 * pendant le chargement. Elle est remplacée par un décor construit en CSS et
 * en SVG. La page ne télécharge plus rien pour son fond, et le plus grand
 * élément de la première image devient le titre — ce qui est mesuré est donc
 * ce qu'on veut voir arriver vite.
 *
 * Ce n'est pas un dégradé abstrait pour autant : la charte dit « la nuit bleue
 * du Valais, la lumière turquoise des projecteurs de chantier » (DESIGN.md).
 * On garde donc les deux — une crête de montagne en ombre chinoise, et une
 * lueur de projecteur qui vient d'en bas à gauche, hors champ.
 */

// Un grain très fin, en SVG encodé : il casse le plat numérique des aplats
// sombres, où les dégradés se voient par bandes sur un écran de téléphone.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='b'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23b)' opacity='0.5'/%3E%3C/svg%3E\")"

// Deux crêtes : la lointaine, plus claire, pose la profondeur ; la proche, plus
// sombre, ferme le bas de l'image. `preserveAspectRatio="none"` les laisse
// s'étirer — une montagne étirée reste une montagne, un cercle étiré non.
const CRETE_LOIN = 'M0,300 L90,266 L210,292 L300,212 L392,246 L520,148 L640,198 L742,118 L880,176 L1010,94 L1150,164 L1268,122 L1380,182 L1440,154 L1440,400 L0,400 Z'
const CRETE_PRES = 'M0,352 L150,320 L286,352 L420,298 L556,336 L690,284 L840,330 L986,290 L1140,336 L1300,298 L1440,338 L1440,400 L0,400 Z'

export default function HeroFond({ anime = false }) {
  const calque = useRef(null)

  // Une dérive très lente vers le haut pendant qu'on descend. Uniquement une
  // transformation : animer la position ferait recalculer la mise en page à
  // chaque image, et le héros est justement le moment où il faut être net.
  useEffect(() => {
    if (!anime || !calque.current) return
    const el = calque.current
    const suivre = () => {
      el.style.transform = `translate3d(0, ${Math.min(window.scrollY * 0.14, 120)}px, 0)`
    }
    suivre()
    window.addEventListener('scroll', suivre, { passive: true })
    return () => window.removeEventListener('scroll', suivre)
  }, [anime])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* La nuit, du plus sombre en haut au marine du bas de page. */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #05070A 0%, #08111C 46%, #0E2132 100%)' }}
      />

      {/* Le projecteur de chantier : il éclaire depuis le bas à gauche, hors
          champ. C'est lui qui donne sa couleur à la scène. */}
      <div
        className="absolute"
        style={{
          left: '-12%', bottom: '-28%', width: '78%', height: '86%',
          background: 'radial-gradient(closest-side, rgb(77 217 217 / 0.26), rgb(77 217 217 / 0.07) 58%, transparent 100%)',
          filter: 'blur(14px)',
        }}
      />
      {/* Une seconde lueur, plus froide et plus lointaine, pour que le ciel ne
          soit pas uniforme à droite du titre. */}
      <div
        className="absolute"
        style={{
          right: '-16%', top: '-24%', width: '62%', height: '76%',
          background: 'radial-gradient(closest-side, rgb(60 140 190 / 0.20), transparent 100%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Les crêtes, qui dérivent au défilement. */}
      <div ref={calque} className="absolute inset-x-0 bottom-0 h-[62%] will-change-transform">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          role="presentation"
        >
          <path d={CRETE_LOIN} fill="#0C1B2A" />
          <path d={CRETE_PRES} fill="#060B12" />
        </svg>
      </div>

      {/* Le grain, par-dessus tout le reste. */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: GRAIN, opacity: 0.045, mixBlendMode: 'overlay' }}
      />

      {/* Deux voiles, et ils ne sont pas décoratifs : le texte doit rester
          lisible quelle que soit la largeur de l'écran. */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(90deg, rgb(5 7 10 / 0.88) 0%, rgb(5 7 10 / 0.58) 38%, rgb(5 7 10 / 0.10) 74%, rgb(5 7 10 / 0) 100%)' }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{ background: 'linear-gradient(180deg, transparent 0%, var(--nuit-bas) 100%)' }}
      />
    </div>
  )
}
