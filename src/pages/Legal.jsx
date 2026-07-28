import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '../i18n'
import { useSiteContent } from '../content/SiteContent'
import SelecteurLangue from '../components/SelecteurLangue'

const TEAL = '#4DD9D9'

// Pas de numéro IDE : Newrigen n'est pas encore inscrite au registre du
// commerce. Mieux vaut ne rien afficher qu'un numéro faux ou un champ à trous.
// À ajouter ici (et dans la rubrique « Éditeur du site ») après l'inscription.
const ENTREPRISE = {
  nom: 'Newrigen',
  adresse: 'Valais, Suisse',
  email: 'newrigen6@gmail.com',
}

function LegalLayout({ title, updated, children }) {
  const t = useT()
  useEffect(() => {
    document.title = `${title} — Newrigen`
    window.scrollTo(0, 0)
    return () => { document.title = 'Newrigen — Automatisation IA pour PME suisses' }
  }, [title])

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-300">
      <nav className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="font-black text-white text-lg">Newrigen</Link>
        <div className="flex items-center gap-3">
          <SelecteurLangue />
          <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">{t('nav.retour')}</Link>
        </div>
      </nav>
      <main className="max-w-3xl mx-auto px-6 pb-24">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{title}</h1>
        <p className="text-xs text-slate-500 mb-4">Dernière mise à jour : {updated}</p>
        {/* Les textes juridiques restent en français : c'est la version qui
            engage Newrigen. On prévient le visiteur plutôt que de le laisser
            devant une page qu'il ne comprend pas. */}
        <p className="text-xs text-slate-400 border border-white/10 rounded-xl px-4 py-3 mb-10">
          {t('legal.francaisSeulement')}
        </p>
        <div className="space-y-8 text-sm leading-relaxed">{children}</div>
      </main>
      <footer className="max-w-3xl mx-auto px-6 pb-10 border-t border-white/5 pt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
        <Link to="/mentions-legales" className="hover:text-slate-300">{t('legal.mentions')}</Link>
        <Link to="/confidentialite" className="hover:text-slate-300">{t('consent.lien')}</Link>
        <Link to="/cgv" className="hover:text-slate-300">CGV</Link>
      </footer>
    </div>
  )
}

function H2({ children }) {
  return <h2 className="text-lg font-bold text-white pt-2" style={{ borderColor: TEAL }}>{children}</h2>
}

export function MentionsLegales() {
  return (
    <LegalLayout title="Mentions légales" updated="28 juillet 2026">
      <section>
        <H2>Éditeur du site</H2>
        <p className="mt-2">
          {ENTREPRISE.nom}<br />
          {ENTREPRISE.adresse}<br />
          Email : <a href={`mailto:${ENTREPRISE.email}`} className="underline hover:text-white">{ENTREPRISE.email}</a>
        </p>
      </section>
      <section>
        <H2>Hébergement</H2>
        <p className="mt-2">
          Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.<br />
          Les données applicatives sont hébergées par Supabase Inc. (infrastructure cloud sécurisée).
        </p>
      </section>
      <section>
        <H2>Propriété intellectuelle</H2>
        <p className="mt-2">
          L'ensemble du contenu de ce site (textes, visuels, logos, marque Newrigen, logiciel DevisTrack) est protégé
          par le droit suisse de la propriété intellectuelle. Toute reproduction, totale ou partielle, sans
          autorisation écrite préalable est interdite.
        </p>
      </section>
      <section>
        <H2>Responsabilité</H2>
        <p className="mt-2">
          Les informations publiées sur ce site sont fournies à titre indicatif et peuvent être modifiées à tout
          moment. Newrigen ne peut être tenue responsable des dommages directs ou indirects résultant de
          l'utilisation du site ou de l'impossibilité d'y accéder.
        </p>
      </section>
    </LegalLayout>
  )
}

export function Confidentialite() {
  return (
    <LegalLayout title="Politique de confidentialité" updated="28 juillet 2026">
      <p>
        La présente politique décrit comment {ENTREPRISE.nom} traite vos données personnelles, conformément à la loi
        fédérale suisse sur la protection des données (nLPD).
      </p>
      <section>
        <H2>Responsable du traitement</H2>
        <p className="mt-2">
          {ENTREPRISE.nom}, {ENTREPRISE.adresse} — contact : <a href={`mailto:${ENTREPRISE.email}`} className="underline hover:text-white">{ENTREPRISE.email}</a>
        </p>
      </section>
      <section>
        <H2>Données collectées</H2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li><strong className="text-white">Formulaires du site</strong> (contact, commande) : nom de l'entreprise, nom du contact, email, téléphone, ville, NPA.</li>
          <li><strong className="text-white">Compte utilisateur</strong> : email, nom, mot de passe (chiffré), rôle, entreprise de rattachement.</li>
          <li><strong className="text-white">Données d'utilisation</strong> : journaux de connexion et d'usage des fonctionnalités, nécessaires au fonctionnement et à la facturation du service.</li>
          <li><strong className="text-white">Données de facturation</strong> : traitées par Stripe ; nous ne stockons aucune donnée de carte bancaire.</li>
        </ul>
      </section>
      <section>
        <H2>Finalités</H2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Fourniture et amélioration du service DevisTrack ;</li>
          <li>Gestion des abonnements, de la facturation et du support ;</li>
          <li>Communications liées au service (email de bienvenue, rappels, informations de compte).</li>
        </ul>
        <p className="mt-2">Aucune donnée n'est vendue à des tiers ni utilisée à des fins publicitaires.</p>
      </section>
      <section>
        <H2>Sous-traitants</H2>
        <p className="mt-2">Nous faisons appel aux prestataires suivants, chacun lié par ses propres engagements de protection des données :</p>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Vercel (hébergement du site et de l'application) ;</li>
          <li>Supabase (base de données et authentification) ;</li>
          <li>Stripe (paiements et abonnements) ;</li>
          <li>Brevo (envoi d'emails transactionnels) ;</li>
          <li>Anthropic (fonctions d'assistance par intelligence artificielle, p. ex. extraction de devis).</li>
        </ul>
        <p className="mt-2">
          Certains prestataires sont situés hors de Suisse. Les transferts reposent sur des garanties appropriées
          (clauses contractuelles types ou niveau de protection adéquat).
        </p>
      </section>
      <section>
        <H2>Conservation</H2>
        <p className="mt-2">
          Les données sont conservées pendant la durée de la relation contractuelle, puis pendant les délais légaux
          de conservation applicables (notamment comptables). Vous pouvez demander la suppression de votre compte à
          tout moment.
        </p>
      </section>
      <section>
        <H2>Vos droits</H2>
        <p className="mt-2">
          Conformément à la nLPD, vous disposez d'un droit d'accès, de rectification, d'effacement et d'opposition
          concernant vos données. Pour l'exercer, écrivez à{' '}
          <a href={`mailto:${ENTREPRISE.email}`} className="underline hover:text-white">{ENTREPRISE.email}</a>.
        </p>
      </section>
      <section>
        <H2>Sécurité</H2>
        <p className="mt-2">
          Les données sont hébergées sur une infrastructure sécurisée, chiffrées en transit (HTTPS) et au repos. Les
          mots de passe ne sont jamais stockés en clair. L'accès aux données de chaque entreprise est cloisonné :
          un compte ne peut accéder qu'aux données de sa propre entreprise. Les accès administrateurs sont limités
          aux personnes qui en ont besoin pour exploiter le service.
        </p>
      </section>
      <section>
        <H2>Recours à l'intelligence artificielle</H2>
        <p className="mt-2">
          Certaines fonctions facultatives (dictée vocale, lecture de documents importés, génération de devis à
          partir de photos) transmettent le contenu concerné à notre prestataire d'intelligence artificielle pour
          être analysé. Ces contenus ne sont pas utilisés pour entraîner des modèles. Ces fonctions ne prennent
          aucune décision produisant des effets juridiques : leur résultat est une proposition que vous relisez et
          validez avant tout envoi.
        </p>
      </section>
      <section>
        <H2>Cookies et stockage local</H2>
        <p className="mt-2">
          Le site n'utilise pas de cookies publicitaires ni de traçage tiers. Un stockage local technique peut être
          utilisé pour le bon fonctionnement de l'application (session, préférences).
        </p>
      </section>
      <section>
        <H2>Droit de recours</H2>
        <p className="mt-2">
          Si vous estimez que le traitement de vos données n'est pas conforme, vous pouvez vous adresser au Préposé
          fédéral à la protection des données et à la transparence (PFPDT), Feldeggweg 1, 3003 Berne.
        </p>
      </section>
      <section>
        <H2>Modification de la présente politique</H2>
        <p className="mt-2">
          Cette politique peut être adaptée pour tenir compte d'évolutions légales ou techniques. La version en
          vigueur est celle publiée sur cette page ; sa date de mise à jour figure en haut du document. Toute
          modification substantielle vous sera signalée par email.
        </p>
      </section>
    </LegalLayout>
  )
}

export function CGV() {
  // Les tarifs viennent de la même source que la page Tarifs (admin).
  // Les recopier ici les ferait diverger : des CGV qui annoncent un autre prix
  // que celui facturé sont opposables au client.
  const { prix } = useSiteContent()
  return (
    <LegalLayout title="Conditions générales de vente" updated="28 juillet 2026">
      <section>
        <H2>1. Objet</H2>
        <p className="mt-2">
          Les présentes CGV régissent la souscription et l'utilisation du logiciel en ligne DevisTrack édité par{' '}
          {ENTREPRISE.nom} (gestion de devis, chantiers, heures et facturation pour PME et artisans). Toute commande
          implique l'acceptation des présentes conditions.
        </p>
      </section>
      <section>
        <H2>2. Offres et tarifs</H2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li><strong className="text-white">Pack Standard</strong> : {prix.standard_mensuel} CHF/mois ou {prix.standard_annuel} CHF/an (2 mois offerts) ;</li>
          <li><strong className="text-white">Pack Premium</strong> : {prix.premium_mensuel} CHF/mois ou {prix.premium_annuel} CHF/an (2 mois offerts) ;</li>
          <li>Chaque pack inclut jusqu'à 5 employés ; chaque employé supplémentaire est facturé {prix.employe_sup_mensuel} CHF/mois ({prix.employe_sup_annuel} CHF/an).</li>
          <li><strong className="text-white">Option Devis vocal</strong> : 15 CHF/mois, activable et désactivable à tout moment depuis les paramètres de l'application.</li>
        </ul>
        <p className="mt-2">Les prix s'entendent en francs suisses. {ENTREPRISE.nom} se réserve le droit de modifier ses tarifs ; les modifications s'appliquent au renouvellement suivant, après information préalable.</p>
      </section>
      <section>
        <H2>3. Commande et paiement</H2>
        <p className="mt-2">
          La souscription s'effectue en ligne via notre prestataire de paiement Stripe. Un essai gratuit de 30 jours
          peut être proposé ; aucun montant n'est prélevé avant son terme et l'essai peut être annulé à tout moment.
          À l'issue de la commande, l'accès au service et les identifiants sont transmis par email.
        </p>
      </section>
      <section>
        <H2>4. Essai gratuit</H2>
        <p className="mt-2">
          Un essai gratuit de 30 jours est proposé lors de la souscription, sans carte bancaire requise à
          l'inscription. Pendant l'essai, le service est accessible sans engagement et peut être interrompu à tout
          moment ; aucun montant n'est prélevé avant son terme. À défaut d'annulation avant la fin de l'essai,
          l'abonnement choisi démarre et le premier paiement est prélevé.
        </p>
      </section>
      <section>
        <H2>5. Durée, renouvellement et résiliation</H2>
        <p className="mt-2">
          L'abonnement est conclu pour la période choisie (mensuelle ou annuelle) et se renouvelle automatiquement.
          Il peut être résilié à tout moment depuis le portail client (accessible dans les paramètres de
          l'application) ; la résiliation prend effet à la fin de la période en cours, sans remboursement prorata.
        </p>
      </section>
      <section>
        <H2>6. Défaut de paiement</H2>
        <p className="mt-2">
          En cas d'échec de paiement, l'accès au service peut être suspendu après notification, jusqu'à
          régularisation. Les données du client sont conservées pendant une période raisonnable pour permettre la
          réactivation du compte.
        </p>
      </section>
      <section>
        <H2>7. Disponibilité et support</H2>
        <p className="mt-2">
          {ENTREPRISE.nom} met en œuvre les moyens raisonnables pour assurer une disponibilité continue du service,
          sans garantie de disponibilité absolue (maintenances, incidents des prestataires d'hébergement). Le support
          s'effectue par email à <a href={`mailto:${ENTREPRISE.email}`} className="underline hover:text-white">{ENTREPRISE.email}</a>.
        </p>
      </section>
      <section>
        <H2>8. Données du client</H2>
        <p className="mt-2">
          Les données saisies dans l'application (devis, clients, heures, factures) restent la propriété du client.
          Elles sont traitées conformément à notre <Link to="/confidentialite" className="underline hover:text-white">politique de confidentialité</Link>.
          En cas de résiliation, le client peut demander l'export de ses données avant la clôture du compte.
        </p>
      </section>
      <section>
        <H2>9. Responsabilité</H2>
        <p className="mt-2">
          La responsabilité de {ENTREPRISE.nom} est limitée aux dommages directs prouvés et ne peut excéder le
          montant des sommes versées par le client au cours des douze derniers mois. Le client reste seul responsable
          du contenu des documents qu'il établit avec le service (devis, factures) et de leur conformité légale.
        </p>
      </section>
      <section>
        <H2>10. Propriété intellectuelle</H2>
        <p className="mt-2">
          L'abonnement confère un droit d'utilisation personnel, non exclusif et non transférable du logiciel, pour
          la durée de l'abonnement. Il n'emporte aucune cession de droits. Le client s'interdit de copier,
          décompiler, revendre ou mettre le service à disposition de tiers en dehors de ses propres utilisateurs.
        </p>
      </section>
      <section>
        <H2>11. Réversibilité et fin de contrat</H2>
        <p className="mt-2">
          Le client peut exporter ses données à tout moment depuis l'application. Après la fin de l'abonnement,
          ses données restent récupérables sur demande pendant 30 jours, puis sont supprimées, sous réserve des
          durées de conservation légales.
        </p>
      </section>
      <section>
        <H2>12. Modification des CGV</H2>
        <p className="mt-2">
          Les présentes conditions peuvent être modifiées. Le client est informé par email au moins 30 jours avant
          l'entrée en vigueur des nouvelles conditions ; à défaut d'acceptation, il peut résilier son abonnement
          avant cette date, sans frais.
        </p>
      </section>
      <section>
        <H2>13. Droit applicable et for</H2>
        <p className="mt-2">
          Les présentes CGV sont soumises au droit suisse. Le for exclusif est au siège de {ENTREPRISE.nom}, sous
          réserve des fors impératifs prévus par la loi.
        </p>
      </section>
    </LegalLayout>
  )
}
