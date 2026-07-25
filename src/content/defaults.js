// Contenu par défaut du site — sert de valeur de repli si Supabase est
// injoignable, et de socle sur lequel le contenu géré depuis l'admin est fusionné.
// (Miroir de la ligne site_content.data en base.)
export const DEFAULT_CONTENT = {
  texts: {}, // surcharges de textes par id (sinon le composant garde son texte JSX)
  prix: {
    standard_mensuel: 49,
    standard_annuel: 490,
    premium_mensuel: 79,
    premium_annuel: 790,
    employe_sup_mensuel: 5,
    employe_sup_annuel: 60,
  },
  contact: {
    telephone1: '079 324 65 93',
    telephone2: '079 873 37 91',
    email: 'newrigen6@gmail.com',
  },
  temoignages: [
    { name: 'Sophie Müller', role: 'Directrice, Müller Sanitaire SA', location: 'Genève', avatar: 'SM', stars: 5, text: "Newrigen a automatisé notre processus de devis en totalité. Ce qui prenait 2 jours se fait maintenant en 5 minutes. Un investissement qui s'est amorti en 3 semaines !", color: 'from-[#F97316] to-[#EA6C0A]' },
    { name: 'Pierre Favre', role: 'Fondateur, Favre Construction', location: 'Lausanne', avatar: 'PF', stars: 5, text: "Les workflows n8n qu'ils ont mis en place ont éliminé 90% de nos tâches administratives répétitives. Mon équipe peut enfin se concentrer sur les chantiers.", color: 'from-orange-500 to-purple-500' },
    { name: 'Anna Keller', role: 'CEO, Keller Traiteur', location: 'Zurich', avatar: 'AK', stars: 5, text: 'Service irréprochable, équipe réactive et solutions qui fonctionnent vraiment. Notre intégration CRM est maintenant entièrement automatisée. Je recommande vivement.', color: 'from-blue-500 to-orange-500' },
  ],
  services: [
    { icon: '📋', title: 'Création de devis', description: 'Créez vos devis manuellement ou par dictée vocale, et importez vos devis existants. Une fois validé, le devis est envoyé automatiquement par e-mail à votre client.', features: ['Saisie manuelle & vocale', 'Import de devis existants', 'Envoi automatique par e-mail'], color: 'from-[#F97316]/20 to-[#1F0A00]/5', border: 'border-[#F97316]/20', iconBg: 'bg-[#F97316]/10' },
    { icon: '🤖', title: 'Intelligence artificielle', description: "L'IA analyse votre dictée vocale pour construire un devis, trie votre catalogue de produits intelligemment, et lit vos documents importés comme des factures ou devis existants.", features: ['Devis par dictée vocale', 'Triage intelligent du catalogue', 'Lecture de documents (PDF, Excel)'], color: 'from-[#F97316]/15 to-[#1F0A00]/5', border: 'border-[#F97316]/20', iconBg: 'bg-[#F97316]/10' },
    { icon: '🎯', title: 'Audit & personnalisation', description: "En plus de notre application, nous sommes prêts à personnaliser l'expérience selon les besoins propres à votre entreprise. Contactez-nous pour voir dans quelle mesure c'est possible.", features: ['Analyse de vos besoins', 'Personnalisation sur mesure', 'Flexibilité selon votre métier'], color: 'from-[#EA6C0A]/15 to-[#1F0A00]/5', border: 'border-[#EA6C0A]/20', iconBg: 'bg-[#EA6C0A]/10' },
  ],
}
