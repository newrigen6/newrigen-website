import { useEffect, useRef } from 'react'

/**
 * Le plan large du héros — un chantier valaisan à l'heure bleue.
 *
 * C'est l'élément le plus grand de la première image, donc celui que le
 * navigateur mesure pour le LCP. Il est chargé sans retard et avec priorité :
 * différer l'image du héros pour « gagner du poids » revient à retarder
 * exactement ce que la mesure regarde.
 *
 * AVIF d'abord, JPEG derrière. Le même plan pèse 46 Ko en AVIF contre 254 en
 * JPEG à 1920 : c'est le rapport qui justifie la balise `<picture>` plutôt
 * qu'une simple `<img>`.
 *
 * Une vignette de vingt-quatre pixels, encodée dans le HTML, occupe la place en
 * attendant. Elle ajoute un kilo-octet et supprime le trou noir — sur une 4G de
 * chantier, ce trou dure assez longtemps pour qu'on referme l'onglet.
 */

const AMORCE = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAADQAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgADQAYAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMADg4ODg4OFw4OFyEXFxchLSEhISEtOS0tLS0tOUQ5OTk5OTlERERERERERFJSUlJSUmBgYGBga2tra2tra2tra//bAEMBERISGxkbLxkZL3BMPkxwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcP/dAAQAAv/aAAwDAQACEQMRAD8A5mIWKJveQfQdary3itkWkfAGSW/wqlGCe9WlBA5OR6GunmbRztJEUstyiKXC4cZBx2qt583t+VW2fAwoAqLc3+RU69xr0P/Z'

export default function HeroFond({ anime = false }) {
  const image = useRef(null)

  // Une dérive très lente vers le haut pendant qu'on descend. Uniquement une
  // transformation : animer la position ferait recalculer la mise en page à
  // chaque image, et le héros est justement le moment où il faut être net.
  useEffect(() => {
    if (!anime || !image.current) return
    const el = image.current
    let brut = 0
    const suivre = () => {
      brut = window.scrollY
      el.style.transform = `translate3d(0, ${Math.min(brut * 0.14, 120)}px, 0) scale(1.06)`
    }
    suivre()
    window.addEventListener('scroll', suivre, { passive: true })
    return () => window.removeEventListener('scroll', suivre)
  }, [anime])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        ref={image}
        className="absolute inset-0 will-change-transform"
        style={{
          backgroundImage: `url(${AMORCE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scale(1.06)',
        }}
      >
        <picture>
          <source
            type="image/avif"
            srcSet="/media/hero-640.avif 640w, /media/hero-1280.avif 1280w, /media/hero-1920.avif 1920w"
            sizes="100vw"
          />
          <img
            src="/media/hero-1280.jpg"
            srcSet="/media/hero-640.jpg 640w, /media/hero-1280.jpg 1280w, /media/hero-1920.jpg 1920w"
            sizes="100vw"
            alt=""
            width="2752"
            height="1536"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(1.28) saturate(1.1)' }}
          />
        </picture>
      </div>

      {/* Deux voiles, et ils ne sont pas décoratifs : le texte doit rester
          lisible quelle que soit la largeur de l'écran, y compris quand le
          cadrage déplace la montagne claire derrière le titre. */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(90deg, rgb(5 7 10 / 0.92) 0%, rgb(5 7 10 / 0.66) 36%, rgb(5 7 10 / 0.12) 72%, rgb(5 7 10 / 0) 100%)' }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{ background: 'linear-gradient(180deg, transparent 0%, var(--nuit-bas) 100%)' }}
      />
    </div>
  )
}
