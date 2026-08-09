import type { Dict } from './types'

// Kinyarwanda translation. IMPORTANT: this needs review by a native speaker
// before launch — agricultural and aviation terms especially.
const rw: Dict = {
  nav: {
    services: 'Serivisi',
    how: 'Uko bikorwa',
    work: 'Ibikorwa byacu',
    impact: 'Icyo bigeraho',
    coverage: 'Aho dukorera',
    news: 'Amakuru',
    book: 'Saba serivisi',
    home: 'AVR — Ampere Vision Rwanda, ahabanza',
    openMenu: 'Fungura menu',
    closeMenu: 'Funga menu',
    language: 'Ururimi',
  },
  hero: {
    eyebrow: 'Ampere Vision Rwanda',
    headline: "Gutera umuti neza, ku mirima y'u Rwanda.",
    subline:
      "Kimwe cya kabiri cy'umuti. Kurinda kumwe. Abaderevu b'indege bafite uruhushya batera umuti ku bihingwa — umuti muke, amazi make, igihe gito.",
    cta: 'Saba gutera umuti',
    secondary: 'Uko bikorwa',
  },
  services: {
    eyebrow: 'Serivisi',
    title: 'Ibyo tugukorera.',
    intro:
      "Ikipe imwe, gusaba rimwe. Tuzana indege, abayitwara n'ubuvuzi bwayo. Wowe uzana ubutaka.",
    items: [
      {
        title: 'Gutera umuti ku bihingwa',
        line: "Gutera umuti aho ukenewe, bikagabanya ikiguzi kuri hegitari ku gice kimwe cya kabiri.",
      },
      {
        title: "Gutera ifumbire n'imiti gakondo",
        line: "Gutera ku buryo bungana ku materasi no ku butaka buringaniye, hakurikijwe igihingwa cyawe.",
      },
      {
        title: 'Kurwanya udukoko tw’imibu',
        line: 'Gutera neza aho imibu yororokera kugira ngo hicwe utuyoka twayo.',
      },
      {
        title: 'Gukora amakarita no gusuzuma [CONFIRM]',
        line: "Amakarita ya GPS y'imirima no gusuzuma ubuzima bw'ibihingwa mbere na nyuma yo gutera.",
      },
    ],
  },
  how: {
    eyebrow: 'Uko bikorwa',
    title: 'Kuva gusaba kugeza gutera, intambwe enye.',
    steps: [
      { title: 'Gusaba', line: "Amakoperative n'abahinzi basaba kuri telefone cyangwa SMS." },
      { title: 'Gupima', line: "Dupima umurima wawe tukoresheje GPS, tugategura inzira y'indege." },
      { title: 'Gutunganya', line: "Indege itunganywa hakurikijwe umuti wahisemo n'udukoko ugamije." },
      { title: 'Gutera', line: "Abaderevu bafite uruhushya batera neza bakurikije amabwiriza ya RCAA." },
    ],
  },
  impact: {
    eyebrow: 'Impamvu AVR',
    title: "Kimwe cya kabiri cy'umuti. Kurinda kumwe.",
    intro:
      "Ipompo yikoreza ku mugongo itakaza kugeza kuri 50% by'umuti umuyaga utwaye. Indege iwushyira ku gihingwa.",
    statLabels: [
      "ikiguzi gike cyo gutera kuri hegitari",
      "yazigamwe kuri hegitari 5 mu gihembwe",
      "amasaha yo guhaguruka yanditswe mu murima",
      "zateweho umuti mu mirima nyayo",
      "abahinzi ba mbere batangiye",
      "amakoperative dufatanya",
    ],
    credentials: [
      'Abaderevu bemewe na RCAA',
      "Uruhushya rwo guhaguruka utabona indege (BVLOS)",
      'Byemewe na MINAGRI',
      'Ubushakashatsi bwasuzumwe na IEEE',
      'AYuTe Africa Challenge Rwanda 2025 — umwanya wa gatatu',
      'ACEIoT — watsindiye inkunga ya Startups Capital',
    ],
  },
  work: {
    eyebrow: 'Ibikorwa byatoranyijwe',
    title: 'Imirima twateyeho umuti.',
    intro: "Reba hafi akazi kari inyuma y'imibare.",
    seeAll: 'Reba ibikorwa byose',
    view: 'Reba umushinga',
    overview: 'Incamake',
    task: 'Icyo twasabwe',
    client: 'Umukiriya',
    year: 'Umwaka',
    gallery: 'Mu murima',
    back: '← Ibikorwa byose',
    notFound: 'Umushinga ntabonetse',
    allTitle: 'Ibikorwa byacu',
  },
  coverage: {
    eyebrow: 'Aho dukorera',
    title: "Ubutaka bw'u Rwanda, bukorerwa n'ikipe y'Abanyarwanda.",
    p1: "Dukorera mu Karere ka Nyarugenge, i Kigali. Dukorana n'amakoperative mu Rwanda hose. [CONFIRM regions served]",
    p2: "Indege zitunganyirizwa, zisanwa kandi zifashwe hano mu gihugu. Dukorana n'amakoperative mu turere.",
    mapLabel: "Ikarita yerekana u Rwanda n'aho AVR ikorera i Kigali",
  },
  news: {
    eyebrow: 'Amakuru',
    title: 'Kuva mu murima.',
    seeAll: 'Reba amakuru yose',
    read: 'Soma inkuru',
    back: '← Amakuru yose',
    notFound: 'Inkuru ntabonetse',
  },
  contact: {
    eyebrow: 'Saba serivisi',
    title: 'Tubwire ibyerekeye imirima yawe.',
    intro:
      "Ohereza amakuru yawe, tuzaguhamagara kugira ngo dutegure gutera. Amakoperative n'abahinzi ku giti cyabo bose barakirwa.",
    phone: 'Telefone',
    whatsapp: 'WhatsApp',
    email: 'Imeyili',
    base: 'Aho dukorera',
    name: 'Amazina',
    location: 'Aho uherereye',
    locationHint: 'Akarere / Umurenge',
    crop: 'Igihingwa',
    cropHint: "urugero: ibigori, ibirayi",
    hectares: 'Hegitari',
    message: 'Ubutumwa',
    optional: '(si ngombwa)',
    submit: 'Ohereza icyifuzo',
    successTitle: 'Murakoze.',
    successBody: 'Twakiriye amakuru yawe, tuzaguhamagara vuba kugira ngo dutegure gutera.',
  },
  newsletter: {
    title: 'Amakuru yo mu murima, akugereho.',
    intro:
      "Amakuru y'umurima, kwibutsa igihe cyo gutera n'amakuru y'ikigo. Imeyili nkeya mu gihembwe, ntabwo ari nyinshi.",
    placeholder: 'wowe@urugero.com',
    submit: 'Iyandikishe',
    success: 'Reba imeyili yawe — emeza aderesi yawe kugira ngo urangize kwiyandikisha.',
  },
  footer: {
    tagline: "Ampere Vision Rwanda Ltd. Gutera umuti neza ku mirima y'u Rwanda.",
    licence:
      "Dukorera ku ruhushya rwa Rwanda Civil Aviation Authority. [CONFIRM licence number and wording]",
    rights: 'Uburenganzira bwose bwitabwaho.',
    socials: '[CONFIRM social links]',
  },
  common: {
    loading: 'Birimo gupakirwa…',
    pageNotFound: 'Urupapuro ntirwabonetse',
    backHome: 'Subira ahabanza',
  },
}

export default rw
