// Mock content shaped like the future Supabase tables (site_content, news_posts).
// Phase 3 replaces these exports with live queries; keys stay identical.
//
// Translated marketing copy lives in src/i18n/*. This file holds facts and
// figures that do not change with language, plus news article content.
// All figures come from the AVR pitch deck. [CONFIRM] marks unverified copy.

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

/** Contact details, confirmed by AVR. */
export const contact = {
  phone: '0792 437 462',
  /** E.164 for the WhatsApp deep link — same number as above. */
  phoneE164: '250792437462',
  whatsapp: '0792 437 462',
  email: 'amperevisionrwanda@gmail.com',
  address: 'Nyarugenge District, Kigali, Rwanda',
}

/** Stat values. Labels are translated in src/i18n/*, in this same order. */
export const stats = [
  { value: 50, suffix: '%' },
  { value: 350000, suffix: ' RWF' },
  { value: 120, suffix: '+' },
  { value: 107, suffix: ' ha' },
  { value: 350, suffix: '' },
  { value: 3, suffix: '' },
]

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
