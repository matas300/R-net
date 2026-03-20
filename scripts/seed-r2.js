require('dotenv').config();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.eu.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
  }
});

const projects = [
  {
    "id": "1",
    "slug": "jolly-system-parrucchieri",
    "title": "Jolly System — Parrucchieri",
    "sector": "Bellezza & Benessere",
    "shortDesc": "Sito vetrina elegante per un salone di parrucchieri nel cuore di Bologna. SEO locale, schema markup, prenota via telefono.",
    "longDesc": "Jolly System è un salone di parrucchieri situato nel cuore di Bologna. Il sito è stato progettato per riflettere l'eleganza del brand, con un design moderno e raffinato. Include ottimizzazione SEO locale con schema markup per apparire nelle ricerche di zona, integrazione diretta per prenotazioni telefoniche e una gallery dei lavori del salone. Il sito è completamente responsive e ottimizzato per velocità di caricamento.",
    "tags": ["HTML/CSS", "SEO locale", "Schema.org", "Mobile first"],
    "url": "https://jollysystem.netlify.app/",
    "productType": "Starter",
    "estimatedTime": "5 giorni",
    "images": [
      "https://pub-2ead906322f3461ba3c1899af1189647.r2.dev/uploads/1773955505858-32210.png",
      "https://pub-2ead906322f3461ba3c1899af1189647.r2.dev/uploads/1773955506081-894089.png",
      "https://pub-2ead906322f3461ba3c1899af1189647.r2.dev/uploads/1773955506306-364823.png",
      "https://pub-2ead906322f3461ba3c1899af1189647.r2.dev/uploads/1773955506470-72329.png"
    ],
    "thumbnail": "https://pub-2ead906322f3461ba3c1899af1189647.r2.dev/uploads/1773955505858-32210.png",
    "media": {
      "coverPhone": "https://pub-2ead906322f3461ba3c1899af1189647.r2.dev/uploads/1773955505858-32210.png",
      "previewPhone": "https://pub-2ead906322f3461ba3c1899af1189647.r2.dev/uploads/1773955506623-543642.png",
      "previewWeb1": "https://pub-2ead906322f3461ba3c1899af1189647.r2.dev/uploads/1773955506773-841322.png",
      "previewWeb2": "https://pub-2ead906322f3461ba3c1899af1189647.r2.dev/uploads/1773955506944-124577.png"
    },
    "createdAt": "2025-01-15T00:00:00.000Z",
    "updatedAt": "2026-03-11T15:44:43.648Z"
  },
  {
    "id": "2",
    "slug": "mfdepur",
    "title": "MFDEPUR — Trattamento Acque",
    "sector": "Industria B2B",
    "shortDesc": "Sito corporate per azienda specializzata in chimica industriale. Include catalogo prodotti, shop online e consulenza tecnica.",
    "longDesc": "MFDEPUR è un'azienda leader nel settore del trattamento acque e chimica industriale. Il progetto ha incluso lo sviluppo di un sito corporate completo con catalogo prodotti interattivo, sistema e-commerce integrato con Stripe per pagamenti sicuri, e una sezione dedicata alla consulenza tecnica. L'area admin permette la gestione autonoma di prodotti, ordini e contenuti.",
    "tags": ["Node.js", "E-commerce", "Stripe", "B2B"],
    "url": "https://www.mfdepur.com/",
    "productType": "E-commerce",
    "estimatedTime": "20 giorni",
    "images": [],
    "thumbnail": "https://image.thum.io/get/width/600/crop/400/noanimate/https://www.mfdepur.com/",
    "media": {},
    "createdAt": "2025-02-10T00:00:00.000Z"
  },
  {
    "id": "3",
    "slug": "o-gato-do-mar",
    "title": "O Gato do Mar — Guest House",
    "sector": "Hospitality & Turismo",
    "shortDesc": "Sito multilingue per una guest house eco in Portogallo. Gallery fotografica, integrazione Airbnb/Booking, supporto EN/PT/IT.",
    "longDesc": "O Gato do Mar è una guest house ecologica situata sulla costa portoghese. Il sito è stato sviluppato con supporto multilingue completo (Inglese, Portoghese e Italiano), una gallery fotografica immersiva delle camere e degli spazi comuni, e integrazione diretta con le piattaforme di prenotazione Airbnb e Booking.com. Il design riflette l'atmosfera rilassata e naturale della struttura.",
    "tags": ["Multilingue", "Gallery", "HTML/CSS/JS", "Hospitality"],
    "url": "https://ogatodomar.netlify.app/",
    "productType": "Business",
    "estimatedTime": "10 giorni",
    "images": [],
    "thumbnail": "https://image.thum.io/get/width/600/crop/400/noanimate/https://ogatodomar.netlify.app/",
    "media": {},
    "createdAt": "2025-03-05T00:00:00.000Z"
  },
  {
    "id": "4",
    "slug": "edil-trentini",
    "title": "Edil Trentini — Impresa Edile",
    "sector": "Edilizia & Costruzioni",
    "shortDesc": "Sito vetrina per impresa edile a Loiano (BO). SEO locale, schema markup, admin panel per gestione lavori e form contatti.",
    "longDesc": "Edil Trentini è un'impresa edile con sede a Loiano, Bologna. Il sito include un pannello di amministrazione personalizzato per la gestione dei lavori realizzati, ottimizzazione SEO locale con schema markup per le ricerche nella zona di Bologna e provincia, e un form di contatto integrato per richieste di preventivo. Il design è professionale e trasmette affidabilità.",
    "tags": ["Node.js", "Admin Panel", "SEO locale", "Schema.org"],
    "url": "https://ediltrentini.it/",
    "productType": "Business",
    "estimatedTime": "10 giorni",
    "images": [],
    "thumbnail": "https://image.thum.io/get/width/600/crop/400/noanimate/https://ediltrentini.it/",
    "media": {},
    "createdAt": "2025-04-20T00:00:00.000Z"
  },
  {
    "id": "5",
    "slug": "dr-januskeviciute-cv",
    "title": "Dr. B. Januskeviciute — CV Medico",
    "sector": "Sanità & Medicina",
    "shortDesc": "CV online multilingue per medico specialista in medicina marittima. Supporto EN/IT/PT, timeline interattiva, ottimizzato per stampa.",
    "longDesc": "Sito web professionale single-page per una dottoressa con oltre 25 anni di esperienza internazionale in medicina d'emergenza e marittima. Il design elegante include una timeline interattiva delle esperienze lavorative, sezione certificazioni, barra competenze linguistiche con indicatori visivi e supporto trilingue completo (Inglese, Italiano, Portoghese). Layout responsive e stylesheet dedicato per la stampa come CV cartaceo.",
    "tags": ["HTML/CSS", "JavaScript", "Multilingue", "Responsive"],
    "url": "",
    "productType": "Starter",
    "estimatedTime": "3 giorni",
    "images": [],
    "thumbnail": "",
    "media": {},
    "createdAt": "2026-01-15T00:00:00.000Z"
  },
  {
    "id": "6",
    "slug": "calcoli-piva",
    "title": "Calcoli P.IVA — Gestionale Fiscale",
    "sector": "Finanza & Fiscalità",
    "shortDesc": "Web app per freelancer italiani con regime forfettario e ordinario. Calcolo tasse, INPS, scadenziario fiscale, budget e fatturazione con sync cloud.",
    "longDesc": "Applicazione web completa per la gestione fiscale dei titolari di Partita IVA in Italia. Supporta sia il regime forfettario che ordinario, con calcolo automatico di imposta sostitutiva, contributi INPS (Artigiani/Commercianti e Gestione Separata), scadenziario fiscale con metodo storico e previsionale, calendario lavorativo, gestione fatture con pagamenti cross-anno e budget mensile. Include sincronizzazione cloud via Firebase, supporto multi-profilo con autenticazione, importazione dati da Fiscozen e esportazione JSON. Interfaccia dark theme responsive con grafici interattivi.",
    "tags": ["HTML/CSS", "JavaScript", "Firebase", "SPA"],
    "url": "",
    "productType": "Business",
    "estimatedTime": "15 giorni",
    "images": [],
    "thumbnail": "",
    "media": {},
    "createdAt": "2026-02-10T00:00:00.000Z"
  },
  {
    "id": "7",
    "slug": "swing-trading-ai",
    "title": "Swing Trading AI — Dashboard Analisi",
    "sector": "Finanza & Trading",
    "shortDesc": "Dashboard AI per swing trading con analisi tecnica multi-fattore, contesto macro, gestione rischio e segnali operativi su titoli azionari.",
    "longDesc": "Piattaforma web di analisi swing trading che combina intelligenza artificiale e analisi tecnica avanzata. Scansiona simultaneamente più titoli azionari calcolando oltre 14 indicatori tecnici (RSI, ADX, ATR, EMA, MACD, supporti/resistenze), analizza il contesto macroeconomico (SPY, QQQ, VIX), valuta l'impatto di notizie geopolitiche e aziendali, e genera segnali operativi (LONG/SHORT/NO TRADE) con punteggio di confidenza. Include position sizing automatico basato sul risk/reward, calendario earnings e storico scansioni. Backend Python con FastAPI, frontend responsive con interfaccia in italiano.",
    "tags": ["Python", "FastAPI", "AI", "JavaScript"],
    "url": "",
    "productType": "E-commerce",
    "estimatedTime": "20 giorni",
    "images": [],
    "thumbnail": "",
    "media": {},
    "createdAt": "2026-03-05T00:00:00.000Z"
  }
];

async function seed() {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: 'data/projects.json',
    Body: JSON.stringify(projects, null, 2),
    ContentType: 'application/json'
  }));
  console.log(`Caricati ${projects.length} progetti su R2`);
}

seed().catch(console.error);
