import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '../i18n'
import SelecteurLangue from '../components/SelecteurLangue'

const TEAL = '#4DD9D9'

// À compléter par Newrigen : raison sociale exacte, adresse du siège et numéro IDE.
const ENTREPRISE = {
  nom: 'Newrigen',
  adresse: '[Adresse du siège à compléter], Suisse',
  email: 'newrigen6@gmail.com',
  ide: 'CHE-XXX.XXX.XXX [à compléter]',
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
    <LegalLayout title="Mentions légales" updated="8 juillet 2026">
      <section>
        <H2>Éditeur du site</H2>
        <p className="mt-2">
          {ENTREPRISE.nom}<br />
          {ENTREPRISE.adresse}<br />
          Email : <a href={`mailto:${ENTREPRISE.email}`} className="underline hover:text-white">{ENTREPRISE.email}</a><br />
          IDE / TVA : {ENTREPRISE.ide}
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
    <LegalLayout title="Politique de confidentialité" updated="8 juillet 2026">
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
        <H2>Cookies et stockage local</H2>
        <p className="mt-2">
          Le site n'utilise pas de cookies publicitaires ni de traçage tiers. Un stockage local technique peut être
          utilisé pour le bon fonctionnement de l'application (session, préférences).
        </p>
      </section>
    </LegalLayout>
  )
}

export function CGV() {
  return (
    <LegalLayout title="Conditions générales de vente" updated="8 juillet 2026">
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
          <li><strong className="text-white">Pack Standard</strong> : 79 CHF/mois ou 790 CHF/an (2 mois offerts) ;</li>
          <li><strong className="text-white">Pack Premium</strong> : 99 CHF/mois ou 990 CHF/an (2 mois offerts) ;</li>
          <li>Chaque pack inclut jusqu'à 5 employés ; chaque employé supplémentaire est facturé 5 CHF/mois (60 CHF/an).</li>
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
        <H2>4. Durée, renouvellement et résiliation</H2>
        <p className="mt-2">
          L'abonnement est conclu pour la période choisie (mensuelle ou annuelle) et se renouvelle automatiquement.
          Il peut être résilié à tout moment depuis le portail client (accessible dans les paramètres de
          l'application) ; la résiliation prend effet à la fin de la période en cours, sans remboursement prorata.
        </p>
      </section>
      <section>
        <H2>5. Défaut de paiement</H2>
        <p className="mt-2">
          En cas d'échec de paiement, l'accès au service peut être suspendu après notification, jusqu'à
          régularisation. Les données du client sont conservées pendant une période raisonnable pour permettre la
          réactivation du compte.
        </p>
      </section>
      <section>
        <H2>6. Disponibilité et support</H2>
        <p className="mt-2">
          {ENTREPRISE.nom} met en œuvre les moyens raisonnables pour assurer une disponibilité continue du service,
          sans garantie de disponibilité absolue (maintenances, incidents des prestataires d'hébergement). Le support
          s'effectue par email à <a href={`mailto:${ENTREPRISE.email}`} className="underline hover:text-white">{ENTREPRISE.email}</a>.
        </p>
      </section>
      <section>
        <H2>7. Données du client</H2>
        <p className="mt-2">
          Les données saisies dans l'application (devis, clients, heures, factures) restent la propriété du client.
          Elles sont traitées conformément à notre <Link to="/confidentialite" className="underline hover:text-white">politique de confidentialité</Link>.
          En cas de résiliation, le client peut demander l'export de ses données avant la clôture du compte.
        </p>
      </section>
      <section>
        <H2>8. Responsabilité</H2>
        <p className="mt-2">
          La responsabilité de {ENTREPRISE.nom} est limitée aux dommages directs prouvés et ne peut excéder le
          montant des sommes versées par le client au cours des douze derniers mois. Le client reste seul responsable
          du contenu des documents qu'il établit avec le service (devis, factures) et de leur conformité légale.
        </p>
      </section>
      <section>
        <H2>9. Droit applicable et for</H2>
        <p className="mt-2">
          Les présentes CGV sont soumises au droit suisse. Le for exclusif est au siège de {ENTREPRISE.nom}, sous
          réserve des fors impératifs prévus par la loi.
        </p>
      </section>
    </LegalLayout>
  )
}
