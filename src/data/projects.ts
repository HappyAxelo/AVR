// Mock portfolio, shaped like the future Supabase `projects` table.
// Phase 3 swaps these exports for live queries; the shape does not change.
//
// IMPORTANT: AVR has not supplied real project records yet. Every client name,
// year and description below is a [CONFIRM] placeholder built only from figures
// that do appear in the pitch deck (107 ha, 3 cooperatives, 350 farmers,
// 120+ flight hours). Replace them from the admin panel before launch.

export interface ProjectImage {
  url: string | null
  caption: string
}

export interface Project {
  id: string
  title: string
  slug: string
  client: string
  year: string
  /** Short line used on the card. */
  summary: string
  overview: string
  task: string
  cover_image_url: string | null
  gallery: ProjectImage[]
  status: 'draft' | 'published'
  sort_order: number
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'Cooperative maize spraying programme [CONFIRM]',
    slug: 'cooperative-maize-spraying',
    client: '[CONFIRM cooperative name]',
    year: '[CONFIRM year]',
    summary: 'Season-long crop protection flown for a maize cooperative.',
    overview:
      'A cooperative asked us to cover its members’ maize plots for a full season. We mapped each plot, planned flight paths around the terracing, and returned on a fixed schedule so treatment matched the pest cycle rather than the weather.',
    task: 'Map every member plot, calibrate for the cooperative’s chosen product, and spray on a repeatable schedule with a written record for each flight.',
    cover_image_url: null,
    gallery: [
      { url: null, caption: '[CONFIRM] Drone on the launch pad before the morning run.' },
      { url: null, caption: '[CONFIRM] Spray pass across a terraced maize plot.' },
      { url: null, caption: '[CONFIRM] Cooperative members watching the flight.' },
    ],
    status: 'published',
    sort_order: 1,
  },
  {
    id: '2',
    title: 'Larviciding for mosquito control [CONFIRM]',
    slug: 'larviciding-mosquito-control',
    client: '[CONFIRM client name]',
    year: '[CONFIRM year]',
    summary: 'Targeted treatment of standing-water breeding sites.',
    overview:
      'Standing water near settlements is hard to treat on foot and easy to miss. We flew the wet areas directly, holding a low, even pass over each site so the treatment landed where larvae actually develop.',
    task: 'Identify and treat breeding sites across the area, keeping application off open water used by people and livestock.',
    cover_image_url: null,
    gallery: [
      { url: null, caption: '[CONFIRM] Marking breeding sites before the flight.' },
      { url: null, caption: '[CONFIRM] Low pass over a wet area.' },
    ],
    status: 'published',
    sort_order: 2,
  },
  {
    id: '3',
    title: 'Potato blight response on terraced land [CONFIRM]',
    slug: 'potato-blight-terraced-land',
    client: '[CONFIRM client name]',
    year: '[CONFIRM year]',
    summary: 'Fast turnaround on steep ground a knapsack team could not cover in time.',
    overview:
      'Blight moves quickly, and steep terraces slow a knapsack team down. Flying the slope let us treat the whole area inside a single day, while the window for a useful response was still open.',
    task: 'Cover steep terraced plots quickly, with even application on ground that is difficult and slow to walk.',
    cover_image_url: null,
    gallery: [
      { url: null, caption: '[CONFIRM] Take-off from the valley floor.' },
      { url: null, caption: '[CONFIRM] Following the contour of the terraces.' },
      { url: null, caption: '[CONFIRM] Checking coverage after the run.' },
    ],
    status: 'published',
    sort_order: 3,
  },
]
