import type { Dict } from './types'

// French translation. Reviewed for tone, but please have a native speaker
// confirm the agronomy terms before launch.
const fr: Dict = {
  nav: {
    services: 'Services',
    how: 'Comment ça marche',
    work: 'Nos réalisations',
    impact: 'Impact',
    coverage: 'Zones desservies',
    news: 'Actualités',
    book: 'Réserver',
    home: 'AVR — Ampere Vision Rwanda, accueil',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    language: 'Langue',
  },
  hero: {
    eyebrow: 'Ampere Vision Rwanda',
    headline: 'Pulvérisation de précision, au service des champs du Rwanda.',
    subline:
      "Moitié moins d'intrants. La même protection. Des pilotes agréés traitent vos cultures par drone — moins de produit, moins d'eau, moins de temps.",
    cta: 'Réserver une pulvérisation',
    secondary: 'Comment ça marche',
  },
  services: {
    eyebrow: 'Services',
    title: 'Ce que nous faisons pour vous.',
    intro:
      "Une équipe, une réservation. Nous apportons le drone, les pilotes et l'entretien. Vous apportez la terre.",
    items: [
      {
        title: 'Pulvérisation phytosanitaire',
        line: "Application ciblée qui réduit d'environ la moitié le coût de traitement par hectare.",
      },
      {
        title: 'Engrais et biopesticides',
        line: 'Couverture régulière sur terrasses et terrain plat, calibrée pour votre culture.',
      },
      {
        title: 'Lutte anti-larvaire',
        line: 'Traitement précis des gîtes larvaires pour contrôler les larves de moustiques.',
      },
      {
        title: 'Cartographie et suivi [CONFIRM]',
        line: 'Cartes GPS des parcelles et contrôle de santé des cultures, avant et après traitement.',
      },
    ],
  },
  how: {
    eyebrow: 'Comment ça marche',
    title: 'De la réservation à la pulvérisation en quatre étapes.',
    steps: [
      { title: 'Réserver', line: 'Les coopératives et les fermes réservent par téléphone ou SMS.' },
      { title: 'Cartographier', line: 'Nous cartographions la parcelle au GPS et planifions le vol.' },
      { title: 'Calibrer', line: 'Le drone est réglé selon le produit choisi et le ravageur visé.' },
      { title: 'Pulvériser', line: 'Des pilotes agréés traitent avec précision sous autorité RCAA.' },
    ],
  },
  impact: {
    eyebrow: 'Pourquoi AVR',
    title: "Moitié moins d'intrants. La même protection.",
    intro:
      "Les pulvérisateurs à dos perdent jusqu'à 50 % du produit par dérive. Le drone le dépose sur la culture.",
    statLabels: [
      'de coût de traitement en moins par hectare',
      'économisés par 5 ha et par saison',
      'heures de vol enregistrées sur le terrain',
      'traités sur des exploitations réelles',
      'agriculteurs pionniers',
      'coopératives partenaires',
    ],
    credentials: [
      'Pilotes agréés RCAA',
      'Autorisation hors vue directe (BVLOS)',
      'Reconnu par le MINAGRI',
      'Recherche évaluée par les pairs (IEEE)',
      'AYuTe Africa Challenge Rwanda 2025 — 3e place',
      'Incubation ACEIoT — lauréat de la bourse Startups Capital',
    ],
  },
  work: {
    eyebrow: 'Réalisations',
    title: 'Les champs que nous avons survolés.',
    intro: 'Un regard de plus près sur le travail derrière les chiffres.',
    seeAll: 'Voir toutes les réalisations',
    view: 'Voir le projet',
    overview: 'Aperçu',
    task: 'La mission',
    client: 'Client',
    year: 'Année',
    gallery: 'Sur le terrain',
    back: '← Toutes les réalisations',
    notFound: 'Projet introuvable',
    allTitle: 'Nos réalisations',
  },
  coverage: {
    eyebrow: 'Zones desservies',
    title: 'Le terrain rwandais, survolé par une équipe rwandaise.',
    p1: 'Basés dans le district de Nyarugenge, à Kigali. Nous volons avec des coopératives partenaires partout au Rwanda. [CONFIRM regions served]',
    p2: "Les drones sont calibrés, réparés et entretenus sur place. Nous travaillons directement avec les coopératives des districts.",
    mapLabel: 'Carte illustrative du Rwanda indiquant la base AVR à Kigali',
  },
  news: {
    eyebrow: 'Actualités',
    title: 'Depuis le terrain.',
    seeAll: 'Toutes les actualités',
    read: "Lire l'article",
    back: '← Toutes les actualités',
    notFound: 'Article introuvable',
  },
  contact: {
    eyebrow: 'Réserver',
    title: 'Parlez-nous de vos champs.',
    intro:
      'Envoyez vos coordonnées et nous vous rappellerons pour planifier le traitement. Coopératives et exploitations individuelles bienvenues.',
    phone: 'Téléphone',
    whatsapp: 'WhatsApp',
    email: 'E-mail',
    base: 'Base',
    name: 'Nom',
    location: 'Localisation',
    locationHint: 'District / secteur',
    crop: 'Culture',
    cropHint: 'ex. maïs, pommes de terre',
    hectares: 'Hectares',
    message: 'Message',
    optional: '(facultatif)',
    submit: 'Envoyer la demande',
    sending: 'Envoi…',
    successTitle: 'Merci.',
    successBody:
      'Nous avons vos coordonnées et vous contacterons sous peu pour planifier le traitement.',
    errorBody: "L'envoi a échoué. Réessayez, ou appelez-nous directement.",
  },
  newsletter: {
    title: 'Les nouvelles du terrain, directement chez vous.',
    intro:
      "Notes de terrain, rappels de saison et actualités de l'entreprise. Quelques e-mails par saison, pas plus.",
    placeholder: 'vous@exemple.com',
    submit: "S'abonner",
    sending: 'Inscription…',
    success: 'Vérifiez votre boîte de réception et confirmez votre adresse pour terminer.',
    error: "Cela n'a pas fonctionné. Veuillez réessayer.",
  },
  footer: {
    tagline: 'Ampere Vision Rwanda Ltd. Pulvérisation de précision par drone pour les champs du Rwanda.',
    licence:
      "Exploitation sous licence de l'Autorité de l'aviation civile du Rwanda. [CONFIRM licence number and wording]",
    rights: 'Tous droits réservés.',
    socials: '[CONFIRM social links]',
  },
  common: {
    loading: 'Chargement…',
    pageNotFound: 'Page introuvable',
    backHome: "Retour à l'accueil",
  },
}

export default fr
