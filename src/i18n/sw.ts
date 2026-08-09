import type { Dict } from './types'

// Kiswahili translation. Please have a native speaker confirm the
// agricultural terms before launch.
const sw: Dict = {
  nav: {
    services: 'Huduma',
    how: 'Jinsi inavyofanya kazi',
    work: 'Kazi zetu',
    impact: 'Matokeo',
    coverage: 'Maeneo tunayohudumia',
    news: 'Habari',
    book: 'Weka nafasi',
    home: 'AVR — Ampere Vision Rwanda, mwanzo',
    openMenu: 'Fungua menyu',
    closeMenu: 'Funga menyu',
    language: 'Lugha',
  },
  hero: {
    eyebrow: 'Ampere Vision Rwanda',
    headline: 'Unyunyiziaji sahihi, kwa mashamba ya Rwanda.',
    subline:
      'Nusu ya pembejeo. Ulinzi ule ule. Marubani wenye leseni hunyunyizia dawa kwa ndege zisizo na rubani — dawa kidogo, maji kidogo, muda mfupi.',
    cta: 'Weka nafasi ya kunyunyizia',
    secondary: 'Jinsi inavyofanya kazi',
  },
  services: {
    eyebrow: 'Huduma',
    title: 'Tunachokufanyia.',
    intro:
      'Timu moja, nafasi moja. Tunaleta ndege, marubani na matengenezo. Wewe unaleta ardhi.',
    items: [
      {
        title: 'Unyunyiziaji wa dawa za mimea',
        line: 'Unyunyiziaji lengwa unaopunguza gharama kwa hekta kwa takriban nusu.',
      },
      {
        title: 'Mbolea na dawa asilia',
        line: 'Ufunikaji sawa kwenye matuta na ardhi tambarare, ukilingana na zao lako.',
      },
      {
        title: 'Kuua viluwiluwi',
        line: 'Matibabu sahihi ya mazalia ili kudhibiti viluwiluwi vya mbu.',
      },
      {
        title: 'Uchoraji ramani na ukaguzi [CONFIRM]',
        line: 'Ramani za GPS za mashamba na ukaguzi wa afya ya mazao kabla na baada ya kunyunyizia.',
      },
    ],
  },
  how: {
    eyebrow: 'Jinsi inavyofanya kazi',
    title: 'Kutoka kuweka nafasi hadi kunyunyizia, hatua nne.',
    steps: [
      { title: 'Weka nafasi', line: 'Vyama vya ushirika na mashamba huweka nafasi kwa simu au SMS.' },
      { title: 'Chora ramani', line: 'Tunachora ramani ya shamba lako kwa GPS na kupanga njia ya ndege.' },
      { title: 'Rekebisha', line: 'Ndege huandaliwa kulingana na dawa uliyochagua na mdudu lengwa.' },
      { title: 'Nyunyizia', line: 'Marubani wenye leseni hunyunyizia kwa usahihi chini ya mamlaka ya RCAA.' },
    ],
  },
  impact: {
    eyebrow: 'Kwa nini AVR',
    title: 'Nusu ya pembejeo. Ulinzi ule ule.',
    intro:
      'Vinyunyizio vya mgongoni hupoteza hadi asilimia 50 ya dawa kwa upepo. Ndege huiweka kwenye zao.',
    statLabels: [
      'gharama ndogo ya kunyunyizia kwa hekta',
      'zilizookolewa kwa hekta 5 kwa msimu',
      'saa za kuruka zilizorekodiwa shambani',
      'zilizonyunyiziwa kwenye mashamba halisi',
      'wakulima wa mwanzo',
      'vyama vya ushirika washirika',
    ],
    credentials: [
      'Marubani wenye leseni ya RCAA',
      'Idhini ya kuruka nje ya uoni (BVLOS)',
      'Inatambuliwa na MINAGRI',
      'Utafiti uliokaguliwa na wenzao (IEEE)',
      'AYuTe Africa Challenge Rwanda 2025 — nafasi ya tatu',
      'ACEIoT — mshindi wa ruzuku ya Startups Capital',
    ],
  },
  work: {
    eyebrow: 'Kazi teule',
    title: 'Mashamba tuliyoruka.',
    intro: 'Angalia kwa karibu kazi iliyo nyuma ya takwimu.',
    seeAll: 'Ona kazi zote',
    view: 'Ona mradi',
    overview: 'Muhtasari',
    task: 'Jukumu',
    client: 'Mteja',
    year: 'Mwaka',
    gallery: 'Kutoka shambani',
    back: '← Kazi zote',
    notFound: 'Mradi haukupatikana',
    allTitle: 'Kazi zetu',
  },
  coverage: {
    eyebrow: 'Maeneo tunayohudumia',
    title: 'Ardhi ya Rwanda, inayorukwa na timu ya Kinyarwanda.',
    p1: 'Tuko Wilaya ya Nyarugenge, Kigali. Tunaruka na vyama vya ushirika kote Rwanda. [CONFIRM regions served]',
    p2: 'Ndege hurekebishwa, kutengenezwa na kuhudumiwa hapa nchini. Tunafanya kazi moja kwa moja na vyama vya ushirika katika wilaya.',
    mapLabel: 'Ramani ya mfano ya Rwanda ikionyesha kituo cha AVR Kigali',
  },
  news: {
    eyebrow: 'Habari',
    title: 'Kutoka shambani.',
    seeAll: 'Ona habari zote',
    read: 'Soma makala',
    back: '← Habari zote',
    notFound: 'Makala haikupatikana',
  },
  contact: {
    eyebrow: 'Weka nafasi',
    title: 'Tuambie kuhusu mashamba yako.',
    intro:
      'Tuma maelezo yako na tutakupigia simu kupanga unyunyiziaji. Vyama vya ushirika na mashamba binafsi wote wanakaribishwa.',
    phone: 'Simu',
    whatsapp: 'WhatsApp',
    email: 'Barua pepe',
    base: 'Kituo',
    name: 'Jina',
    location: 'Mahali',
    locationHint: 'Wilaya / sekta',
    crop: 'Zao',
    cropHint: 'mf. mahindi, viazi',
    hectares: 'Hekta',
    message: 'Ujumbe',
    optional: '(si lazima)',
    submit: 'Tuma ombi',
    successTitle: 'Asante.',
    successBody: 'Tumepokea maelezo yako na tutawasiliana nawe hivi karibuni kupanga unyunyiziaji.',
  },
  newsletter: {
    title: 'Habari za shambani, moja kwa moja kwako.',
    intro:
      'Maelezo ya shambani, vikumbusho vya msimu wa kunyunyizia na habari za kampuni. Barua pepe chache kwa msimu, si zaidi.',
    placeholder: 'wewe@mfano.com',
    submit: 'Jiandikishe',
    success: 'Angalia kikasha chako — thibitisha barua pepe yako ili kukamilisha.',
  },
  footer: {
    tagline: 'Ampere Vision Rwanda Ltd. Unyunyiziaji sahihi kwa ndege kwa mashamba ya Rwanda.',
    licence:
      'Tunafanya kazi chini ya leseni ya Mamlaka ya Usafiri wa Anga ya Rwanda. [CONFIRM licence number and wording]',
    rights: 'Haki zote zimehifadhiwa.',
    socials: '[CONFIRM social links]',
  },
  common: {
    loading: 'Inapakia…',
    pageNotFound: 'Ukurasa haukupatikana',
    backHome: 'Rudi mwanzo',
  },
}

export default sw
