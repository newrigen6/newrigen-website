/**
 * Les sous-timelines des actes, toutes branchées sur la même source.
 *
 * Chaque fonction reçoit gsap et ScrollTrigger déjà chargés, et rend de quoi
 * se défaire. Rien n'anime avant d'avoir vérifié que l'élément existe : une
 * page en cours de traduction ou un acte retiré ne doit pas casser les autres.
 *
 * Règle commune : on n'anime que `opacity` et `transform`. Tout le reste — une
 * hauteur, une marge, une couleur de fond — force le navigateur à refaire sa
 * mise en page à chaque image, et c'est là que les soixante images par seconde
 * s'effondrent, précisément sur les appareils qu'on veut ménager.
 */

const DUREE = 0.9
const ELAN = 'power3.out'

/**
 * L'entrée des blocs au défilement.
 *
 * Confiée à un observateur d'intersection, et non au moteur de défilement.
 * La différence n'est pas théorique : avec un déclencheur lié au défilement,
 * un visiteur qui arrive directement au milieu de la page — une ancre, un
 * rechargement, une recherche dans la page — saute par-dessus les
 * déclenchements, et les blocs qu'il a franchis restent invisibles pour
 * toujours. Un observateur, lui, signale aussi ce qui est déjà à l'écran au
 * moment où on l'installe : le contenu ne peut pas rester caché.
 *
 * On ne révèle qu'une fois. Rejouer l'entrée en remontant donnerait un site
 * qui clignote dès qu'on relit un paragraphe.
 */
export function revelerBlocs(gsap, ScrollTrigger, racine, { sobre = false } = {}) {
  const cibles = [...racine.querySelectorAll('[data-revele]')]
  if (!cibles.length) return () => {}

  // Sans observateur — navigateur ancien, environnement inhabituel — on ne
  // cache rien du tout. Mieux vaut une page sans animation qu'une page vide.
  if (typeof IntersectionObserver === 'undefined') return () => {}

  const decalage = sobre ? 0 : 28

  // On ne cache jamais rien dans une page que personne ne regarde.
  //
  // Un onglet en arrière-plan ne compose pas : l'observateur d'intersection n'y
  // signale rien, et le rAF ne tourne pas. Si l'on masquait quand même, du
  // texte pourrait rester à opacité zéro sans qu'aucun mécanisme ne vienne le
  // rallumer. Constaté ici même, sur un panneau d'aperçu masqué. On attend donc
  // que la page soit visible pour commencer à cacher quoi que ce soit.
  const creerObservateur = () => new IntersectionObserver((entrees) => {
    for (const entree of entrees) {
      if (!entree.isIntersecting) continue
      const el = entree.target
      observateur.unobserve(el)
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: sobre ? 0.5 : DUREE,
        ease: ELAN,
        // Les enfants d'une même liste entrent l'un après l'autre : c'est ce
        // léger retard qui fait lire une séquence plutôt qu'un bloc.
        delay: Number(el.dataset.retard || 0),
      })
    }
  }, { rootMargin: '0px 0px -12% 0px' })

  let observateur = null
  const armer = () => {
    if (observateur) return
    gsap.set(cibles, { opacity: 0, y: decalage })
    observateur = creerObservateur()
    cibles.forEach(el => observateur.observe(el))
  }

  const surVisibilite = () => { if (document.visibilityState === 'visible') armer() }
  if (document.visibilityState === 'visible') armer()
  else document.addEventListener('visibilitychange', surVisibilite)

  return () => {
    document.removeEventListener('visibilitychange', surVisibilite)
    observateur?.disconnect()
    // On rend visible ce qui ne l'était pas encore : démonter le composant ne
    // doit jamais laisser du texte à opacité zéro derrière soi.
    gsap.set(cibles, { opacity: 1, y: 0 })
  }
}

/**
 * Le titre qui se compose lettre par lettre.
 *
 * Le texte d'origine est conservé sur le conteneur (`aria-label`) et les
 * lettres sont masquées aux technologies d'assistance : sans cela, un lecteur
 * d'écran épellerait « L, e, space, d, e, v, i, s ». On découpe après le
 * premier affichage — le titre est déjà lisible avant que ce code s'exécute.
 */
export function composerTitre(gsap, titre, { delaiMaxMs = 600 } = {}) {
  if (!titre || titre.dataset.compose === 'oui') return () => {}

  // Le titre est peint bien avant que GSAP arrive. Si l'écart est trop grand,
  // le composer reviendrait à le faire disparaître sous les yeux du visiteur
  // pour le réécrire : un clignotement, pas une animation. Passé ce délai on
  // renonce à l'effet et on garde le titre tel qu'il est déjà lisible.
  if (performance.now() > delaiMaxMs) return () => {}

  const texteOrigine = titre.textContent.replace(/\s+/g, ' ').trim()
  titre.setAttribute('aria-label', texteOrigine)
  titre.dataset.compose = 'oui'

  const lettres = []
  const decouper = (noeud) => {
    for (const enfant of [...noeud.childNodes]) {
      if (enfant.nodeType === Node.TEXT_NODE) {
        const morceaux = document.createDocumentFragment()
        // On découpe d'abord en mots, et chaque mot devient une boîte qui ne
        // se coupe pas. Sans cela, chaque lettre devenant une boîte à part, le
        // navigateur se croit autorisé à passer à la ligne entre deux lettres :
        // « camionnett / e ». Le titre est l'endroit où cela se voit le plus.
        for (const mot of enfant.textContent.split(/(\s+)/)) {
          if (mot === '') continue
          if (/^\s+$/.test(mot)) { morceaux.appendChild(document.createTextNode(' ')); continue }
          const boite = document.createElement('span')
          boite.setAttribute('aria-hidden', 'true')
          boite.style.display = 'inline-block'
          boite.style.whiteSpace = 'nowrap'
          for (const c of mot) {
            const span = document.createElement('span')
            span.textContent = c
            span.style.display = 'inline-block'
            span.style.willChange = 'transform, opacity'
            boite.appendChild(span)
            lettres.push(span)
          }
          morceaux.appendChild(boite)
        }
        enfant.replaceWith(morceaux)
      } else if (enfant.nodeType === Node.ELEMENT_NODE && enfant.tagName !== 'BR') {
        decouper(enfant)
      }
    }
  }
  decouper(titre)

  const tl = gsap.timeline()
  tl.from(lettres, {
    opacity: 0,
    y: '0.35em',
    rotateX: -55,
    duration: 0.62,
    ease: 'power3.out',
    // Le tout doit être fini avant qu'on ait eu le temps de scroller : un titre
    // qui se compose encore quand le visiteur est déjà plus bas est un défaut,
    // pas un effet.
    stagger: { each: 0.022, from: 'start' },
    onComplete: () => lettres.forEach(l => { l.style.willChange = 'auto' }),
  })

  return () => tl.kill()
}

/**
 * La parallaxe à la souris — trois degrés, pas un de plus.
 *
 * Au-delà, l'image poursuit le curseur et donne mal au cœur sur un grand écran.
 * On suit le pointeur en douceur plutôt que de coller à sa position : un
 * mouvement de souris brusque ne doit pas secouer la page.
 */
export function parallaxeSouris(gsap, calque, { amplitude = 3 } = {}) {
  if (!calque || window.matchMedia('(pointer: coarse)').matches) return () => {}

  const rx = gsap.quickTo(calque, 'rotationY', { duration: 0.8, ease: 'power3.out' })
  const ry = gsap.quickTo(calque, 'rotationX', { duration: 0.8, ease: 'power3.out' })

  const suivre = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2
    const y = (e.clientY / window.innerHeight - 0.5) * 2
    rx(x * amplitude)
    ry(-y * amplitude)
  }

  window.addEventListener('pointermove', suivre, { passive: true })
  return () => {
    window.removeEventListener('pointermove', suivre)
    gsap.set(calque, { rotationX: 0, rotationY: 0 })
  }
}

/**
 * L'acte des fonctions, épinglé et défilant à l'horizontale.
 *
 * Réservé au grand écran avec pointeur fin. Sur un téléphone, épingler une
 * section confisque le geste vertical — le seul que l'utilisateur connaisse —
 * et il n'a plus aucun moyen de deviner comment sortir. La liste reste alors
 * une liste verticale ordinaire, ce qui se lit très bien.
 */
export function epinglerFonctions(gsap, ScrollTrigger, section) {
  if (!section) return () => {}
  const piste = section.querySelector('[data-piste]')
  if (!piste) return () => {}

  const distance = () => Math.max(0, piste.scrollWidth - section.clientWidth)
  if (distance() <= 0) return () => {}

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${distance() + window.innerHeight * 0.6}`,
      pin: true,
      scrub: 0.8,
      // La longueur dépend de la largeur : sans recalcul, une rotation d'écran
      // laisse la piste s'arrêter au milieu.
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  })
  tl.to(piste, { x: () => -distance(), ease: 'none' })

  return () => { tl.scrollTrigger?.kill(); tl.kill() }
}

/**
 * Le fond qui s'éclaircit à l'approche de la conversion.
 *
 * C'est la bascule de l'acte 7 : la nuit se retire, la page devient blanche, et
 * il ne reste que le prix. On anime l'opacité d'un voile plutôt que la couleur
 * du corps — une couleur de fond animée repeint tout l'écran à chaque image.
 */
export function leverLeJour(gsap, ScrollTrigger, voile, declencheur) {
  if (!voile || !declencheur) return () => {}
  gsap.set(voile, { opacity: 0 })
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: declencheur,
      start: 'top bottom',
      end: 'top 40%',
      scrub: true,
    },
  })
  tl.to(voile, { opacity: 1, ease: 'none' })
  return () => { tl.scrollTrigger?.kill(); tl.kill() }
}
