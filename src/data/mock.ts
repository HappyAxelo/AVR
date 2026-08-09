// Mock content shaped like the future Supabase tables (site_content, news_posts).
// Phase 3 replaces these exports with live queries; keys stay identical.
// All facts come from the AVR pitch deck. [CONFIRM] marks unverified copy.

export interface NewsPost {
  id: string
  title: string
  slug: string
  excerpt: string
  body: string
  cover_image_url: string | null
  status: 'draft' | 'published'
  published_at: string
}

export const siteContent = {
  hero_headline: "Precision spraying, flown for Rwanda's fields.",
  hero_subline:
    'Half the input. Same protection. Licensed pilots apply crop protection by drone — less chemical, less water, less time.',
  hero_cta: 'Book a spray',

  services_intro:
    'One team, one booking. We bring the drone, the pilots and the maintenance. You bring the land.',
  services: [
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

  how_intro: 'From booking to spraying in four steps.',
  how_steps: [
    {
      title: 'Book',
      line: 'Cooperatives and farms schedule by phone or SMS.',
    },
    {
      title: 'Map',
      line: 'We GPS-map your plot and plan the flight path.',
    },
    {
      title: 'Calibrate',
      line: 'The drone is set up for your chosen product and target pest.',
    },
    {
      title: 'Spray',
      line: 'Licensed pilots apply with precision under RCAA authority.',
    },
  ],

  impact_intro:
    'Knapsack sprayers lose up to 50% of pesticide to drift. Drones put it on the crop.',
  stats: [
    { value: 50, suffix: '%', label: 'lower spray cost per hectare' },
    { value: 350000, suffix: ' RWF', label: 'saved per 5 ha per season' },
    { value: 120, suffix: '+', label: 'flight hours logged in the field' },
    { value: 107, suffix: ' ha', label: 'sprayed on real farms' },
    { value: 350, suffix: '', label: 'early-adopter farmers' },
    { value: 3, suffix: '', label: 'cooperative partners' },
  ],
  credentials: [
    'RCAA-licensed pilots',
    'BVLOS-cleared [CONFIRM exact wording]',
    'MINAGRI-recognised',
    'IEEE peer-reviewed research',
    'AYuTe Africa Challenge Rwanda 2025 — 2nd runner-up',
    'ACEIoT incubation — Startups Capital grant winner',
  ],

  coverage_intro:
    'Based in Kigali. Flying with cooperative partners across Rwanda. [CONFIRM regions served]',

  contact_phone: '[CONFIRM phone]',
  contact_whatsapp: '[CONFIRM WhatsApp number]',
  contact_email: '[CONFIRM email]',
  contact_address: 'Kigali, Rwanda [CONFIRM address]',

  newsletter_line:
    'Field notes, spray-season reminders and company news. A few emails a season, no more.',

  footer_licence:
    'Operating under Rwanda Civil Aviation Authority licence. [CONFIRM licence number and wording]',
}

export const newsPosts: NewsPost[] = [
  {
    id: '1',
    title: 'AVR takes 2nd runner-up at AYuTe Africa Challenge Rwanda 2025',
    slug: 'ayute-africa-challenge-2025',
    excerpt:
      'Ampere Vision Rwanda placed 2nd runner-up in the AYuTe Africa Challenge Rwanda 2025, winning 15,000,000 RWF to grow precision spraying for smallholders.',
    body: `Ampere Vision Rwanda placed 2nd runner-up in the AYuTe Africa Challenge Rwanda 2025.\n\nThe award comes with 15,000,000 RWF of funding. It will go towards growing our fleet and reaching more cooperatives.\n\nAYuTe Africa recognises young companies using technology to change agriculture. We are proud to represent Rwandan drone agri-tech on that stage.`,
    cover_image_url: null,
    status: 'published',
    published_at: '2025-11-10T09:00:00Z',
  },
  {
    id: '2',
    title: 'Our targeted spraying research is published by IEEE',
    slug: 'ieee-published-research',
    excerpt:
      'Real-time deep learning for targeted pesticide spraying, irrigation and crop disease detection — peer-reviewed and published at an IEEE international conference.',
    body: `Our research paper, "Real-Time Deep Learning-Based Aerial System for Targeted Pesticide Spraying, Irrigation and Crop Disease Detection", has been published by IEEE.\n\nThe work was presented at a 2025 IEEE international conference and is available on IEEE Xplore (document 11387712).\n\nThe paper underpins how our drones decide where to spray and where not to. Less chemical in the air, more on the crop.`,
    cover_image_url: null,
    status: 'published',
    published_at: '2025-09-20T09:00:00Z',
  },
  {
    id: '3',
    title: '107 hectares sprayed in year one',
    slug: '107-hectares-year-one',
    excerpt:
      'One drone, two operators, 120+ flight hours. Real fields, real flights, and about 350,000 RWF saved per five hectares each season.',
    body: `In our first year we sprayed 107 hectares across varied Rwandan terrain.\n\nThat is one drone, two operators and more than 120 logged flight hours, working with three cooperative partners and about 350 early-adopter farmers.\n\nFor a farmer with five hectares, switching from knapsack to drone spraying saves roughly 350,000 RWF a season. Half the chemical input, the same protection.`,
    cover_image_url: null,
    status: 'published',
    published_at: '2025-08-01T09:00:00Z',
  },
]
