const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'projects.json');

const projects = [
  {
    id: '1',
    slug: 'jolly-system',
    title: 'Jolly System — Parrucchieri',
    sector: 'Bellezza & Benessere',
    shortDesc: 'Sito vetrina elegante per un salone di parrucchieri nel cuore di Bologna. SEO locale, schema markup, prenota via telefono.',
    longDesc: 'Jolly System è un salone di parrucchieri situato nel cuore di Bologna. Il sito è stato progettato per riflettere l\'eleganza del brand, con un design moderno e raffinato. Include ottimizzazione SEO locale con schema markup per apparire nelle ricerche di zona, integrazione diretta per prenotazioni telefoniche e una gallery dei lavori del salone. Il sito è completamente responsive e ottimizzato per velocità di caricamento.',
    tags: ['HTML/CSS', 'SEO locale', 'Schema.org', 'Mobile first'],
    url: 'https://jollysystem.netlify.app/',
    productType: 'Starter',
    estimatedTime: '5 giorni',
    images: [],
    thumbnail: 'https://image.thum.io/get/width/600/crop/400/noanimate/https://jollysystem.netlify.app/',
    createdAt: '2025-01-15T00:00:00.000Z'
  },
  {
    id: '2',
    slug: 'mfdepur',
    title: 'MFDEPUR — Trattamento Acque',
    sector: 'Industria B2B',
    shortDesc: 'Sito corporate per azienda specializzata in chimica industriale. Include catalogo prodotti, shop online e consulenza tecnica.',
    longDesc: 'MFDEPUR è un\'azienda leader nel settore del trattamento acque e chimica industriale. Il progetto ha incluso lo sviluppo di un sito corporate completo con catalogo prodotti interattivo, sistema e-commerce integrato con Stripe per pagamenti sicuri, e una sezione dedicata alla consulenza tecnica. L\'area admin permette la gestione autonoma di prodotti, ordini e contenuti.',
    tags: ['Node.js', 'E-commerce', 'Stripe', 'B2B'],
    url: 'https://www.mfdepur.com/',
    productType: 'E-commerce',
    estimatedTime: '20 giorni',
    images: [],
    thumbnail: 'https://image.thum.io/get/width/600/crop/400/noanimate/https://www.mfdepur.com/',
    createdAt: '2025-02-10T00:00:00.000Z'
  },
  {
    id: '3',
    slug: 'o-gato-do-mar',
    title: 'O Gato do Mar — Guest House',
    sector: 'Hospitality & Turismo',
    shortDesc: 'Sito multilingue per una guest house eco in Portogallo. Gallery fotografica, integrazione Airbnb/Booking, supporto EN/PT/IT.',
    longDesc: 'O Gato do Mar è una guest house ecologica situata sulla costa portoghese. Il sito è stato sviluppato con supporto multilingue completo (Inglese, Portoghese e Italiano), una gallery fotografica immersiva delle camere e degli spazi comuni, e integrazione diretta con le piattaforme di prenotazione Airbnb e Booking.com. Il design riflette l\'atmosfera rilassata e naturale della struttura.',
    tags: ['Multilingue', 'Gallery', 'HTML/CSS/JS', 'Hospitality'],
    url: 'https://ogatodomar.netlify.app/',
    productType: 'Business',
    estimatedTime: '10 giorni',
    images: [],
    thumbnail: 'https://image.thum.io/get/width/600/crop/400/noanimate/https://ogatodomar.netlify.app/',
    createdAt: '2025-03-05T00:00:00.000Z'
  },
  {
    id: '4',
    slug: 'edil-trentini',
    title: 'Edil Trentini — Impresa Edile',
    sector: 'Edilizia & Costruzioni',
    shortDesc: 'Sito vetrina per impresa edile a Loiano (BO). SEO locale, schema markup, admin panel per gestione lavori e form contatti.',
    longDesc: 'Edil Trentini è un\'impresa edile con sede a Loiano, Bologna. Il sito include un pannello di amministrazione personalizzato per la gestione dei lavori realizzati, ottimizzazione SEO locale con schema markup per le ricerche nella zona di Bologna e provincia, e un form di contatto integrato per richieste di preventivo. Il design è professionale e trasmette affidabilità.',
    tags: ['Node.js', 'Admin Panel', 'SEO locale', 'Schema.org'],
    url: 'https://ediltrentini.it/',
    productType: 'Business',
    estimatedTime: '10 giorni',
    images: [],
    thumbnail: 'https://image.thum.io/get/width/600/crop/400/noanimate/https://ediltrentini.it/',
    createdAt: '2025-04-20T00:00:00.000Z'
  }
];

fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2), 'utf-8');
console.log(`Seed completato: ${projects.length} progetti creati in ${DATA_FILE}`);
