/**
 * Petites interfaces illustratives — des fragments du produit, dessinés en HTML.
 *
 * Elles montrent au lieu de promettre, comme les publications Instagram. Ce ne
 * sont pas des captures d'écran : du texte réel, net à toutes les tailles, et
 * qui ne pèse rien. Toutes sont décoratives — le texte qui les accompagne dit
 * déjà ce qu'elles montrent — donc invisibles aux lecteurs d'écran.
 */

const ligne = 'flex items-baseline justify-between gap-4 py-2.5 border-b border-[var(--filet)] last:border-0'

/** Le devis du héros : quelques postes, un total, un statut. */
// La largeur etait figee a 340 px : un telephone de 375 px n'offre que 333 px
// entre les gouttieres, la carte debordait donc — et c'est pour cela qu'elle
// avait fini masquee sur mobile. Elle s'adapte maintenant a la place offerte.
export function CarteDevis({ className = '' }) {
  return (
    <div aria-hidden="true" className={`cine-verre rounded-[1.4rem] p-6 w-full max-w-[340px] ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-[0.7rem] font-bold tracking-[0.2em] text-[var(--gris-clair)]">DEVIS 2026-0042</p>
        <span className="rounded-full bg-[var(--turquoise)] px-2.5 py-1 text-[0.68rem] font-bold text-[var(--nuit)]">Envoyé</span>
      </div>
      <p className="mt-2 text-lg font-bold text-white" style={{ fontFamily: 'var(--police-titre)' }}>
        Villa Martin — Saxon
      </p>
      <div className="mt-4 text-sm cine-chiffres">
        {[['Crépi façade nord', '1 240.–'], ['Fenêtres PVC (x3)', '2 850.–'], ['Pose et main-d’œuvre', '980.–']].map(([nom, prix]) => (
          <div key={nom} className={ligne}>
            <span className="text-[var(--gris-clair)]">{nom}</span>
            <span className="font-semibold text-white">{prix}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-baseline justify-between cine-chiffres">
        <span className="text-sm text-[var(--gris)]">Total TTC</span>
        <span className="text-2xl font-extrabold text-[var(--turquoise)]" style={{ fontFamily: 'var(--police-titre)' }}>
          CHF 5 070.–
        </span>
      </div>
    </div>
  )
}

/** Devis et catalogue : des postes qui sortent du catalogue. */
export function VignetteDevis() {
  return (
    <div aria-hidden="true" className="rounded-xl bg-[rgb(5_7_10_/_0.6)] border border-[var(--filet)] p-4 text-[0.8rem] cine-chiffres">
      {[['Carrelage 60×60', '84.–/m²'], ['Chape ciment', '42.–/m²'], ['Joint époxy', '18.–/m²']].map(([nom, prix]) => (
        <div key={nom} className="flex justify-between py-1.5">
          <span className="text-[var(--gris-clair)]">{nom}</span>
          <span className="font-semibold text-[var(--turquoise)]">{prix}</span>
        </div>
      ))}
    </div>
  )
}

/** Chantiers et équipe : les employés affectés. */
export function VignetteEquipe() {
  return (
    <div aria-hidden="true" className="rounded-xl bg-[rgb(5_7_10_/_0.6)] border border-[var(--filet)] p-4">
      <p className="text-[0.7rem] font-bold tracking-[0.18em] text-[var(--gris)]">VILLA MARTIN</p>
      <div className="mt-3 flex -space-x-2">
        {['JM', 'PF', 'LC'].map(i => (
          <span key={i} className="grid place-items-center w-9 h-9 rounded-full bg-[var(--ardoise-2)] border-2 border-[var(--ardoise)] text-[0.72rem] font-bold text-[var(--turquoise)]">
            {i}
          </span>
        ))}
        <span className="grid place-items-center w-9 h-9 rounded-full border-2 border-dashed border-[var(--filet-fort)] text-[var(--gris-clair)] text-sm">+</span>
      </div>
      <p className="mt-3 text-[0.8rem] text-[var(--gris-clair)] cine-chiffres">124 h saisies cette semaine</p>
    </div>
  )
}

/** Factures et encaissements : un QR, un statut payé. */
export function VignetteFacture() {
  // Un motif régulier plutôt qu'un vrai QR : on n'imprime pas un code qu'un
  // visiteur pourrait scanner et qui ne mènerait nulle part.
  const cases = Array.from({ length: 49 }, (_, i) => (i * 7 + (i % 5) * 3) % 3 !== 0)
  return (
    <div aria-hidden="true" className="rounded-xl bg-[rgb(5_7_10_/_0.6)] border border-[var(--filet)] p-4 flex items-center gap-4">
      <div className="grid grid-cols-7 gap-[2px] w-16 h-16 p-1.5 rounded-md bg-white flex-shrink-0">
        {cases.map((plein, i) => <span key={i} className={plein ? 'bg-[var(--nuit)]' : ''} />)}
      </div>
      <div className="min-w-0">
        <p className="text-[0.8rem] text-[var(--gris-clair)] cine-chiffres">Facture 2026-0114</p>
        <p className="mt-0.5 text-base font-bold text-white cine-chiffres">CHF 5 070.00</p>
        <span className="mt-1.5 inline-block rounded-full bg-[rgb(74_204_140_/_0.16)] px-2 py-0.5 text-[0.68rem] font-bold text-[var(--vert)]">
          Payée · relevé du 14.08
        </span>
      </div>
    </div>
  )
}

/** Marge en direct : le chiffré contre le réel. */
export function VignetteMarge() {
  return (
    <div aria-hidden="true" className="rounded-xl bg-[rgb(5_7_10_/_0.6)] border border-[var(--filet)] p-4 cine-chiffres">
      <div className="flex justify-between text-[0.8rem]">
        <span className="text-[var(--gris-clair)]">Chiffré</span>
        <span className="font-semibold text-white">18 400.–</span>
      </div>
      <div className="mt-1.5 h-2 rounded-full bg-[rgb(255_255_255_/_0.12)]" />
      <div className="mt-3 flex justify-between text-[0.8rem]">
        <span className="text-[var(--gris-clair)]">Coûts réels</span>
        <span className="font-semibold text-white">12 880.–</span>
      </div>
      <div className="mt-1.5 h-2 rounded-full bg-[rgb(255_255_255_/_0.06)]">
        <div className="h-2 w-[70%] rounded-full bg-[var(--ambre)]" />
      </div>
      <p className="mt-3 text-right text-sm font-extrabold text-[var(--vert)]">Marge 30 %</p>
    </div>
  )
}

/**
 * Un cadre de navigateur — pour l'offre « sites internet ». Il contient une
 * miniature du site lui-même : l'argument de l'offre, c'est la page qu'on lit.
 */
export function CadreNavigateur({ className = '' }) {
  return (
    <div aria-hidden="true" className={`rounded-2xl overflow-hidden border border-[var(--filet-fort)] bg-[var(--nuit)] shadow-[var(--ombre-haute)] ${className}`}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--filet)] bg-[var(--ardoise)]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-3 flex-1 rounded-md bg-[var(--nuit)] px-3 py-1 text-[0.72rem] text-[var(--gris)] truncate">
          votre-entreprise.ch
        </span>
      </div>
      <div className="relative p-7 min-h-[230px] bg-[radial-gradient(ellipse_at_80%_20%,rgb(77_217_217_/_0.18),transparent_55%),linear-gradient(180deg,#05070A,#0E2132)]">
        <span className="block w-20 h-2 rounded bg-[var(--gris)] opacity-60" />
        <span className="mt-4 block w-10 h-[3px] rounded bg-[var(--turquoise)]" />
        <p className="mt-4 text-2xl leading-tight font-extrabold text-[var(--turquoise)]" style={{ fontFamily: 'var(--police-titre)' }}>
          Votre entreprise,
        </p>
        <p className="text-2xl leading-tight font-extrabold text-white" style={{ fontFamily: 'var(--police-titre)' }}>
          trouvable sur Google
        </p>
        <span className="mt-4 block w-3/4 h-2 rounded bg-[var(--gris-clair)] opacity-30" />
        <span className="mt-2 block w-2/3 h-2 rounded bg-[var(--gris-clair)] opacity-30" />
        <span className="mt-5 inline-block rounded-full bg-[var(--turquoise)] px-4 py-2 text-[0.72rem] font-bold text-[var(--nuit)]">
          Demander un devis
        </span>
      </div>
    </div>
  )
}
