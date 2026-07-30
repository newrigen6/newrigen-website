// Contenu par défaut du site — sert de valeur de repli si Supabase est
// injoignable, et de socle sur lequel le contenu géré depuis l'admin est fusionné.
//
// Prix et coordonnées sont communs à toutes les langues. Services et témoignages
// sont traduits : ce sont des textes de vente, pas des données.
// L'admin peut les surcharger langue par langue (ligne site_content « main »
// pour le français, « main-de » / « main-en » / « main-pt » pour les autres).

const PRIX = {
  standard_mensuel: 49,
  standard_annuel: 490,
  premium_mensuel: 79,
  premium_annuel: 790,
  employe_sup_mensuel: 5,
  employe_sup_annuel: 60,
}

const CONTACT = {
  telephone1: '079 324 65 93',
  telephone2: '079 873 37 91',
  email: 'newrigen6@gmail.com',
}

// Habillage des cartes, identique quelle que soit la langue.
const ICONES_SERVICE = ['📋', '🤖', '🎯']
const STYLE_SERVICE = [
  { color: 'from-[#F97316]/20 to-[#1F0A00]/5', border: 'border-[#F97316]/20', iconBg: 'bg-[#F97316]/10' },
  { color: 'from-[#F97316]/15 to-[#1F0A00]/5', border: 'border-[#F97316]/20', iconBg: 'bg-[#F97316]/10' },
  { color: 'from-[#EA6C0A]/15 to-[#1F0A00]/5', border: 'border-[#EA6C0A]/20', iconBg: 'bg-[#EA6C0A]/10' },
]

// Aucun témoignage livré par défaut : publier un avis client inventé sur un
// site commercial est de la publicité trompeuse. Ils se saisissent depuis
// l'admin, langue par langue, quand ils sont réels.
const TRADUCTIONS = {
  fr: {
    services: [
      { title: 'Création de devis', description: 'Créez vos devis manuellement ou par dictée vocale, et importez vos devis existants. Une fois validé, le devis est envoyé automatiquement par e-mail à votre client.', features: ['Saisie manuelle & vocale', 'Import de devis existants', 'Envoi automatique par e-mail'] },
      { title: 'Intelligence artificielle', description: "L'IA analyse votre dictée vocale pour construire un devis, trie votre catalogue de produits intelligemment, et lit vos documents importés comme des factures ou devis existants.", features: ['Devis par dictée vocale', 'Triage intelligent du catalogue', 'Lecture de documents (PDF, Excel)'] },
      { title: 'Audit & personnalisation', description: "En plus de notre application, nous sommes prêts à personnaliser l'expérience selon les besoins propres à votre entreprise. Contactez-nous pour voir dans quelle mesure c'est possible.", features: ['Analyse de vos besoins', 'Personnalisation sur mesure', 'Flexibilité selon votre métier'] },
    ],
  },
  de: {
    services: [
      { title: 'Offerten erstellen', description: 'Erstellen Sie Offerten von Hand oder per Spracheingabe und importieren Sie bestehende Offerten. Nach der Freigabe geht die Offerte automatisch per E-Mail an Ihren Kunden.', features: ['Erfassung von Hand & per Sprache', 'Import bestehender Offerten', 'Automatischer Versand per E-Mail'] },
      { title: 'Künstliche Intelligenz', description: 'Die KI wertet Ihre Spracheingabe aus und baut daraus eine Offerte, sortiert Ihren Produktkatalog sinnvoll und liest importierte Dokumente wie Rechnungen oder bestehende Offerten.', features: ['Offerte per Spracheingabe', 'Intelligente Katalogsortierung', 'Dokumente lesen (PDF, Excel)'] },
      { title: 'Audit & Anpassung', description: 'Über unsere Anwendung hinaus passen wir die Lösung gerne an die Bedürfnisse Ihres Betriebs an. Melden Sie sich — wir schauen gemeinsam, was möglich ist.', features: ['Analyse Ihres Bedarfs', 'Massgeschneiderte Anpassung', 'Flexibel für Ihre Branche'] },
    ],
  },
  en: {
    services: [
      { title: 'Quote creation', description: 'Write your quotes by hand or by voice, and import the ones you already have. Once approved, the quote is emailed to your client automatically.', features: ['Manual & voice entry', 'Import existing quotes', 'Automatic email sending'] },
      { title: 'Artificial intelligence', description: 'The AI turns your dictation into a quote, sorts your product catalogue intelligently, and reads the documents you import, such as invoices or existing quotes.', features: ['Quotes by voice', 'Smart catalogue sorting', 'Document reading (PDF, Excel)'] },
      { title: 'Audit & customisation', description: 'Beyond the app itself, we are happy to tailor the experience to how your business actually works. Get in touch and we will look at what is possible.', features: ['Analysis of your needs', 'Tailor-made customisation', 'Flexible for your trade'] },
    ],
  },
  pt: {
    services: [
      { title: 'Criação de orçamentos', description: 'Crie os seus orçamentos manualmente ou por ditado de voz e importe os que já tem. Depois de validado, o orçamento é enviado automaticamente por e-mail ao seu cliente.', features: ['Introdução manual e por voz', 'Importação de orçamentos existentes', 'Envio automático por e-mail'] },
      { title: 'Inteligência artificial', description: 'A IA analisa o seu ditado para construir um orçamento, organiza o catálogo de produtos de forma inteligente e lê os documentos que importa, como facturas ou orçamentos existentes.', features: ['Orçamento por ditado de voz', 'Organização inteligente do catálogo', 'Leitura de documentos (PDF, Excel)'] },
      { title: 'Auditoria e personalização', description: 'Para além da aplicação, adaptamos a experiência às necessidades próprias da sua empresa. Contacte-nos para vermos em que medida é possível.', features: ['Análise das suas necessidades', 'Personalização à medida', 'Flexibilidade conforme a sua actividade'] },
    ],
  },
  it: {
    services: [
      { title: 'Creazione di preventivi', description: 'Create i vostri preventivi manualmente o tramite dettatura vocale, e importate quelli esistenti. Una volta convalidato, il preventivo viene inviato automaticamente via e-mail al vostro cliente.', features: ['Inserimento manuale e vocale', 'Importazione di preventivi esistenti', 'Invio automatico via e-mail'] },
      { title: 'Intelligenza artificiale', description: "L'IA analizza la vostra dettatura vocale per costruire un preventivo, ordina in modo intelligente il vostro catalogo prodotti e legge i documenti importati come fatture o preventivi esistenti.", features: ['Preventivo per dettatura vocale', 'Smistamento intelligente del catalogo', 'Lettura di documenti (PDF, Excel)'] },
      { title: 'Audit e personalizzazione', description: "Oltre alla nostra applicazione, siamo pronti a personalizzare l'esperienza secondo le esigenze specifiche della vostra azienda. Contattateci per vedere cosa è possibile fare.", features: ['Analisi delle vostre esigenze', 'Personalizzazione su misura', 'Flessibilità secondo il vostro mestiere'] },
    ],
  },
}

export function defaultsPourLangue(langue = 'fr') {
  const tr = TRADUCTIONS[langue] ?? TRADUCTIONS.fr
  return {
    texts: {}, // surcharges de textes par id (sinon le composant garde son texte JSX)
    prix: PRIX,
    contact: CONTACT,
    services: tr.services.map((s, i) => ({ ...s, icon: ICONES_SERVICE[i], ...STYLE_SERVICE[i] })),
    temoignages: [], // saisis depuis l'admin, jamais inventés ici
  }
}

// Conservé pour la compatibilité : le contenu français.
export const DEFAULT_CONTENT = defaultsPourLangue('fr')
