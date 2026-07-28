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
const STYLE_TEMOIGNAGE = [
  'from-[#F97316] to-[#EA6C0A]',
  'from-orange-500 to-purple-500',
  'from-blue-500 to-orange-500',
]

// Identité des personnes citées : ne se traduit pas.
const PERSONNES = [
  { name: 'Sophie Müller', location: 'Genève',   avatar: 'SM', stars: 5 },
  { name: 'Pierre Favre',  location: 'Lausanne', avatar: 'PF', stars: 5 },
  { name: 'Anna Keller',   location: 'Zurich',   avatar: 'AK', stars: 5 },
]

const TRADUCTIONS = {
  fr: {
    services: [
      { title: 'Création de devis', description: 'Créez vos devis manuellement ou par dictée vocale, et importez vos devis existants. Une fois validé, le devis est envoyé automatiquement par e-mail à votre client.', features: ['Saisie manuelle & vocale', 'Import de devis existants', 'Envoi automatique par e-mail'] },
      { title: 'Intelligence artificielle', description: "L'IA analyse votre dictée vocale pour construire un devis, trie votre catalogue de produits intelligemment, et lit vos documents importés comme des factures ou devis existants.", features: ['Devis par dictée vocale', 'Triage intelligent du catalogue', 'Lecture de documents (PDF, Excel)'] },
      { title: 'Audit & personnalisation', description: "En plus de notre application, nous sommes prêts à personnaliser l'expérience selon les besoins propres à votre entreprise. Contactez-nous pour voir dans quelle mesure c'est possible.", features: ['Analyse de vos besoins', 'Personnalisation sur mesure', 'Flexibilité selon votre métier'] },
    ],
    roles: ['Directrice, Müller Sanitaire SA', 'Fondateur, Favre Construction', 'CEO, Keller Traiteur'],
    textes: [
      "Newrigen a automatisé notre processus de devis en totalité. Ce qui prenait 2 jours se fait maintenant en 5 minutes. Un investissement qui s'est amorti en 3 semaines !",
      "Les workflows n8n qu'ils ont mis en place ont éliminé 90% de nos tâches administratives répétitives. Mon équipe peut enfin se concentrer sur les chantiers.",
      'Service irréprochable, équipe réactive et solutions qui fonctionnent vraiment. Notre intégration CRM est maintenant entièrement automatisée. Je recommande vivement.',
    ],
  },
  de: {
    services: [
      { title: 'Offerten erstellen', description: 'Erstellen Sie Offerten von Hand oder per Spracheingabe und importieren Sie bestehende Offerten. Nach der Freigabe geht die Offerte automatisch per E-Mail an Ihren Kunden.', features: ['Erfassung von Hand & per Sprache', 'Import bestehender Offerten', 'Automatischer Versand per E-Mail'] },
      { title: 'Künstliche Intelligenz', description: 'Die KI wertet Ihre Spracheingabe aus und baut daraus eine Offerte, sortiert Ihren Produktkatalog sinnvoll und liest importierte Dokumente wie Rechnungen oder bestehende Offerten.', features: ['Offerte per Spracheingabe', 'Intelligente Katalogsortierung', 'Dokumente lesen (PDF, Excel)'] },
      { title: 'Audit & Anpassung', description: 'Über unsere Anwendung hinaus passen wir die Lösung gerne an die Bedürfnisse Ihres Betriebs an. Melden Sie sich — wir schauen gemeinsam, was möglich ist.', features: ['Analyse Ihres Bedarfs', 'Massgeschneiderte Anpassung', 'Flexibel für Ihre Branche'] },
    ],
    roles: ['Geschäftsführerin, Müller Sanitär AG', 'Gründer, Favre Construction', 'CEO, Keller Traiteur'],
    textes: [
      'Newrigen hat unseren Offertprozess vollständig automatisiert. Was zwei Tage dauerte, geht heute in fünf Minuten. Die Investition war nach drei Wochen wieder drin!',
      'Die eingerichteten n8n-Workflows haben 90 % unserer wiederkehrenden Büroarbeit beseitigt. Mein Team kann sich endlich auf die Baustellen konzentrieren.',
      'Tadelloser Service, ein Team, das schnell reagiert, und Lösungen, die wirklich funktionieren. Unsere CRM-Anbindung läuft nun vollautomatisch. Klare Empfehlung.',
    ],
  },
  en: {
    services: [
      { title: 'Quote creation', description: 'Write your quotes by hand or by voice, and import the ones you already have. Once approved, the quote is emailed to your client automatically.', features: ['Manual & voice entry', 'Import existing quotes', 'Automatic email sending'] },
      { title: 'Artificial intelligence', description: 'The AI turns your dictation into a quote, sorts your product catalogue intelligently, and reads the documents you import, such as invoices or existing quotes.', features: ['Quotes by voice', 'Smart catalogue sorting', 'Document reading (PDF, Excel)'] },
      { title: 'Audit & customisation', description: 'Beyond the app itself, we are happy to tailor the experience to how your business actually works. Get in touch and we will look at what is possible.', features: ['Analysis of your needs', 'Tailor-made customisation', 'Flexible for your trade'] },
    ],
    roles: ['Director, Müller Sanitaire SA', 'Founder, Favre Construction', 'CEO, Keller Traiteur'],
    textes: [
      'Newrigen automated our quoting process from end to end. What took two days now takes five minutes. It paid for itself in three weeks!',
      'The n8n workflows they set up removed 90% of our repetitive admin. My team can finally focus on the job sites.',
      'Faultless service, a responsive team and solutions that genuinely work. Our CRM integration is now fully automated. I recommend them without hesitation.',
    ],
  },
  pt: {
    services: [
      { title: 'Criação de orçamentos', description: 'Crie os seus orçamentos manualmente ou por ditado de voz e importe os que já tem. Depois de validado, o orçamento é enviado automaticamente por e-mail ao seu cliente.', features: ['Introdução manual e por voz', 'Importação de orçamentos existentes', 'Envio automático por e-mail'] },
      { title: 'Inteligência artificial', description: 'A IA analisa o seu ditado para construir um orçamento, organiza o catálogo de produtos de forma inteligente e lê os documentos que importa, como facturas ou orçamentos existentes.', features: ['Orçamento por ditado de voz', 'Organização inteligente do catálogo', 'Leitura de documentos (PDF, Excel)'] },
      { title: 'Auditoria e personalização', description: 'Para além da aplicação, adaptamos a experiência às necessidades próprias da sua empresa. Contacte-nos para vermos em que medida é possível.', features: ['Análise das suas necessidades', 'Personalização à medida', 'Flexibilidade conforme a sua actividade'] },
    ],
    roles: ['Directora, Müller Sanitaire SA', 'Fundador, Favre Construction', 'CEO, Keller Traiteur'],
    textes: [
      'A Newrigen automatizou por completo o nosso processo de orçamentos. O que demorava dois dias faz-se agora em cinco minutos. Um investimento amortizado em três semanas!',
      'Os fluxos n8n que implementaram eliminaram 90% das nossas tarefas administrativas repetitivas. A minha equipa pode finalmente concentrar-se nas obras.',
      'Serviço irrepreensível, equipa atenta e soluções que funcionam mesmo. A nossa integração com o CRM está agora totalmente automatizada. Recomendo vivamente.',
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
    temoignages: PERSONNES.map((p, i) => ({ ...p, role: tr.roles[i], text: tr.textes[i], color: STYLE_TEMOIGNAGE[i] })),
  }
}

// Conservé pour la compatibilité : le contenu français.
export const DEFAULT_CONTENT = defaultsPourLangue('fr')
