// Pixel Meta (Facebook / Instagram).
//
// A quoi ca sert : sans lui, une campagne « clients » est aveugle. Meta ne
// saurait pas qui s'est abonne, donc ne pourrait ni optimiser la diffusion ni
// dire ce qu'a coute une inscription. Avec lui, Meta apprend a reconnaitre les
// artisans qui achetent et va chercher les suivants.
//
// Deux garde-fous :
//  1. Le pixel ne se charge QUE si le visiteur a accepte le bandeau — c'est du
//     suivi publicitaire, il tombe sous le consentement (RGPD / LPD).
//  2. Sans identifiant configure, tout est neutralise. Le site tourne
//     exactement comme avant, aucune erreur.
//
// L'identifiant se met dans la variable d'environnement VITE_META_PIXEL_ID
// (Vercel → Settings → Environment Variables). Ce n'est pas un secret : il est
// visible dans la page de toute facon.

const ID = import.meta.env.VITE_META_PIXEL_ID

let charge = false

/// Charge le script du pixel, une seule fois. Appelee apres acceptation.
export function demarrerPixel() {
  if (!ID || charge || typeof window === 'undefined') return
  charge = true

  /* eslint-disable */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
  (window,document,'script','https://connect.facebook.net/en_US/fbevents.js')
  /* eslint-enable */

  window.fbq('init', ID)
  window.fbq('track', 'PageView')
}

/// Envoie un evenement standard Meta. Sans effet si le pixel n'est pas charge
/// (identifiant absent, ou consentement refuse).
export function pixel(evenement, parametres) {
  if (!charge || typeof window === 'undefined' || !window.fbq) return
  window.fbq('track', evenement, parametres)
}

/// Le visiteur retire son consentement : on cesse d'emettre. Le script deja
/// charge ne peut pas etre retire de la page, mais plus rien ne part.
export function arreterPixel() {
  charge = false
}
