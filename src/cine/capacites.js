/**
 * Ce que l'appareil peut supporter — décidé une fois, au chargement.
 *
 * Trois niveaux, et le site doit être bon aux trois. Un artisan qui ouvre le
 * site depuis une cave en 4G sur un téléphone de trois ans est exactement le
 * client qu'on cherche : c'est lui qu'il ne faut pas perdre pour une animation.
 *
 *   'immobile' — le visiteur a demandé qu'on ne bouge rien. On obéit.
 *   'sobre'    — mobile, connexion lente, économie de données, pas de WebGL2 :
 *                des fondus, aucune 3D, aucune vidéo.
 *   'complet'  — la timeline entière, la 3D chargée après coup.
 *
 * Rien n'est réévalué pendant la visite. Basculer d'un mode à l'autre en cours
 * de défilement donnerait un site qui se contredit sous les doigts.
 */

/** Le visiteur a-t-il demandé qu'on limite le mouvement ? */
export function mouvementRefuse() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * WebGL2 disponible ?
 *
 * On crée un contexte pour de bon : la présence de la fonction ne dit rien,
 * certains appareils l'exposent et refusent ensuite de rendre quoi que ce soit.
 * Le contexte est relâché aussitôt — en garder un ouvert pour rien coûte de la
 * mémoire vidéo sur les machines qui en ont le moins.
 */
export function webgl2Disponible() {
  if (typeof document === 'undefined') return false
  try {
    const toile = document.createElement('canvas')
    const ctx = toile.getContext('webgl2')
    if (!ctx) return false
    ctx.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

/** Connexion jugée lente, ou visiteur qui a demandé d'économiser ses données. */
export function connexionMenue() {
  const c = typeof navigator !== 'undefined' ? navigator.connection : null
  if (!c) return false
  if (c.saveData) return true
  return ['slow-2g', '2g', '3g'].includes(c.effectiveType)
}

/** Écran étroit : on parle ici de la place disponible, pas du système. */
export function ecranEtroit() {
  return typeof window !== 'undefined' && window.innerWidth < 900
}

/**
 * Peu de cœurs ou peu de mémoire : une scène 3D y tournerait, mal. Mieux vaut
 * un site net et fixe qu'un site animé à douze images par seconde.
 */
function machineModeste() {
  if (typeof navigator === 'undefined') return false
  const coeurs = navigator.hardwareConcurrency
  const memoire = navigator.deviceMemory
  return (coeurs != null && coeurs <= 4) || (memoire != null && memoire <= 4)
}

export function niveauRendu() {
  if (mouvementRefuse()) return 'immobile'
  if (connexionMenue() || ecranEtroit() || machineModeste() || !webgl2Disponible()) return 'sobre'
  return 'complet'
}
