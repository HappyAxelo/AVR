import type { Dict } from './types'

const en: Dict = {
  nav: {
    services: 'Services',
    how: 'How it works',
    work: 'Our work',
    impact: 'Impact',
    coverage: 'Coverage',
    news: 'News',
    book: 'Book a spray',
    home: 'AVR — Ampere Vision Rwanda, home',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'Language',
  },
  hero: {
    eyebrow: 'Ampere Vision Rwanda',
    headline: "Precision spraying, flown for Rwanda's fields.",
    subline:
      'Half the input. Same protection. Licensed pilots apply crop protection by drone — less chemical, less water, less time.',
    cta: 'Book a spray',
    secondary: 'How it works',
  },
  services: {
    eyebrow: 'Services',
    title: 'What we fly for you.',
    intro:
      'One team, one booking. We bring the drone, the pilots and the maintenance. You bring the land.',
    items: [
      {
        title: 'Crop protection spraying',
        line: 'Targeted pesticide application that cuts spray cost per hectare by about half.',
      },
      {
        title: 'Fertiliser & biopesticide application',
        line: 'Even coverage on terraced and flat land, calibrated to your crop.',
      },
      {
        title: 'Larviciding',
        line: 'Precise treatment of breeding sites to control mosquito larvae.',
      },
      {
        title: 'Mapping & scouting [CONFIRM]',
        line: 'GPS plot maps and crop health checks before and after spraying.',
      },
    ],
  },
  how: {
    eyebrow: 'How it works',
    title: 'From booking to spraying in four steps.',
    steps: [
      { title: 'Book', line: 'Cooperatives and farms schedule by phone or SMS.' },
      { title: 'Map', line: 'We GPS-map your plot and plan the flight path.' },
      { title: 'Calibrate', line: 'The drone is set up for your chosen product and target pest.' },
      { title: 'Spray', line: 'Licensed pilots apply with precision under RCAA authority.' },
    ],
  },
  impact: {
    eyebrow: 'Why AVR',
    title: 'Half the input. Same protection.',
    intro:
      'Knapsack sprayers lose up to 50% of pesticide to drift. Drones put it on the crop.',
    statLabels: [
      'lower spray cost per hectare',
      'saved per 5 ha per season',
      'flight hours logged in the field',
      'sprayed on real farms',
      'early-adopter farmers',
      'cooperative partners',
    ],
    credentials: [
      'RCAA-licensed pilots',
      'Beyond Visual Line of Sight (BVLOS) cleared',
      'MINAGRI-recognised',
      'IEEE peer-reviewed research',
      'AYuTe Africa Challenge Rwanda 2025 — 2nd runner-up',
      'ACEIoT incubation — Startups Capital grant winner',
    ],
  },
  work: {
    eyebrow: 'Selected work',
    title: 'Fields we have flown.',
    intro: 'A closer look at the work behind the numbers.',
    seeAll: 'See all work',
    view: 'View project',
    overview: 'Overview',
    task: 'The task',
    client: 'Client',
    year: 'Year',
    gallery: 'From the field',
    back: '← All work',
    notFound: 'Project not found',
    allTitle: 'Our work',
  },
  coverage: {
    eyebrow: 'Coverage',
    title: 'Rwandan terrain, flown by a Rwandan team.',
    p1: 'Based in Nyarugenge District, Kigali. Flying with cooperative partners across Rwanda. [CONFIRM regions served]',
    p2: 'Drones are calibrated, repaired and supported in-country. We work directly with cooperatives across districts.',
    mapLabel: 'Illustrative map of Rwanda showing the AVR base in Kigali',
  },
  news: {
    eyebrow: 'News',
    title: 'From the field.',
    seeAll: 'See all news',
    read: 'Read article',
    back: '← All news',
    notFound: 'Article not found',
  },
  contact: {
    eyebrow: 'Book a spray',
    title: 'Tell us about your fields.',
    intro:
      'Send your details and we will call you back to plan the spray. Cooperatives and single farms both welcome.',
    phone: 'Phone',
    whatsapp: 'WhatsApp',
    email: 'Email',
    base: 'Base',
    name: 'Name',
    location: 'Location',
    locationHint: 'District / sector',
    crop: 'Crop',
    cropHint: 'e.g. maize, potatoes',
    hectares: 'Hectares',
    message: 'Message',
    optional: '(optional)',
    submit: 'Send enquiry',
    sending: 'Sending…',
    successTitle: 'Thank you.',
    successBody: 'We have your details and will be in touch shortly to plan your spray.',
    errorBody: 'Sorry, that did not send. Please try again, or call us directly.',
  },
  newsletter: {
    title: 'Notes from the field, straight to you.',
    intro: 'Field notes, spray-season reminders and company news. A few emails a season, no more.',
    placeholder: 'you@example.com',
    submit: 'Subscribe',
    sending: 'Subscribing…',
    success: 'Check your inbox — confirm your email to finish subscribing.',
    error: 'Sorry, that did not work. Please try again.',
  },
  footer: {
    tagline: "Ampere Vision Rwanda Ltd. Precision drone spraying for Rwanda's fields.",
    licence:
      'Operating under Rwanda Civil Aviation Authority licence. [CONFIRM licence number and wording]',
    rights: 'All rights reserved.',
    socials: '[CONFIRM social links]',
  },
  tokenPage: {
    invalidTitle: 'Link not recognised',
    invalidBody: 'That link is not valid. It may have already been used, or been copied incompletely.',
    errorTitle: 'Something went wrong',
    errorBody: 'Please try the link again in a moment.',
    confirm: {
      doneTitle: 'Subscription confirmed',
      doneBody: 'Thank you. You will hear from us at the start of each spray season.',
    },
    unsubscribe: {
      doneTitle: 'Unsubscribed',
      doneBody: 'You will not receive any more newsletters from AVR.',
    },
  },
  common: {
    loading: 'Loading…',
    pageNotFound: 'Page not found',
    backHome: 'Back to home',
  },
}

export default en
