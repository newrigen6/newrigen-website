import { useEffect, useRef, useState } from 'react'
import { niveauRendu } from './capacites'

/**
 * Le défilement du site, et la progression qu'il pilote.
 *
 * Une seule source de mouvement pour toute la page. Chaque acte s'y branche au
 * lieu d'écouter le défilement de son côté — sinon dix écouteurs se disputent
 * la même molette, se déclenchent dans un ordre qui change d'une visite à
 * l'autre, et le film devient un empilement de saccades.
 *
 * Lenis donne l'inertie, sans jamais confisquer la molette : un coup de doigt
 * répond tout de suite, il continue seulement un peu après. Le défilement
 * détourné qui ralentit ou bloque la page est exactement ce qui fait fermer un
 * onglet — surtout à un patron qui cherche un prix.
 *
 * Renvoie `{ niveau, pret }`. En mode immobile, rien n'est chargé du tout : pas
 * de Lenis, pas de GSAP, pas même une importation. Refuser le mouvement doit
 * alléger la page, pas seulement l'immobiliser.
 */
export function useTimelineMaitresse() {
  const [niveau] = useState(niveauRendu)
  const [pret, setPret] = useState(false)
  const ancre = useRef({ lenis: null, gsap: null, trigger: null, image: 0 })

  useEffect(() => {
    if (niveau === 'immobile') return

    let vivant = true
    let arreter = () => {}

    ;(async () => {
      // Chargés à la demande : sur les appareils sobres comme sur les autres,
      // ces cent kilo-octets n'ont rien à faire dans le paquet de départ.
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (!vivant) return

      gsap.registerPlugin(ScrollTrigger)

      const lenis = new Lenis({
        // Assez pour qu'on sente le poids, pas assez pour qu'on attende.
        duration: 1.05,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        // Sur un écran tactile, on laisse le défilement natif : le doigt suit
        // le contenu, et toute inertie ajoutée se sent comme un défaut.
        smoothWheel: true,
        syncTouch: false,
      })

      // Une seule boucle d'animation pour Lenis et GSAP. Deux boucles
      // indépendantes dérivent, et l'écart se voit sur les éléments épinglés.
      const avancer = (temps) => lenis.raf(temps * 1000)
      gsap.ticker.add(avancer)
      gsap.ticker.lagSmoothing(0)
      lenis.on('scroll', ScrollTrigger.update)

      // Exposé volontairement : Lenis prend la main sur le défilement, si bien
      // que `window.scrollTo` ne fait plus rien de visible. Sans cette prise,
      // ni nous ni un outil de mesure ne peut plus amener la page à un endroit
      // précis pour la vérifier — et une page qu'on ne peut pas vérifier finit
      // par n'être vérifiée par personne.
      window.lenis = lenis

      ancre.current = { lenis, gsap, trigger: ScrollTrigger }
      setPret(true)

      arreter = () => {
        gsap.ticker.remove(avancer)
        ScrollTrigger.getAll().forEach(t => t.kill())
        lenis.destroy()
        if (window.lenis === lenis) delete window.lenis
      }
    })()

    return () => { vivant = false; arreter() }
  }, [niveau])

  return { niveau, pret, ancre }
}
