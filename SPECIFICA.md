# R-net — Specifica del Sito

## Panoramica

R-net è un sito web per un'agenzia di sviluppo web italiana. Il sito mostra servizi, portfolio lavori, prezzi e un form di contatto. Include un pannello admin protetto per gestire i progetti.

---

## Stack Tecnologico

- **Backend:** Node.js + Express
- **Template engine:** EJS
- **Database:** JSON file (`data/projects.json`)
- **Autenticazione:** bcrypt + JWT (cookie httpOnly)
- **Upload immagini:** Multer
- **Email:** Nodemailer
- **Validazione:** express-validator

---

## Struttura File

```
R-net/
├── server.js                    # Entry point Express
├── package.json
├── .env                         # Configurazione (password, JWT, SMTP)
├── .gitignore
├── config/
│   └── auth.js                  # bcrypt + JWT helpers
├── middleware/
│   └── auth.js                  # Verifica JWT cookie
├── routes/
│   ├── index.js                 # Homepage + /lavori/:slug
│   ├── admin.js                 # CRUD progetti + login
│   └── api.js                   # POST /api/contact
├── data/
│   └── projects.json            # Dati progetti (JSON file)
├── utils/
│   ├── dataStore.js             # Read/write projects.json
│   ├── slugify.js               # Genera slug da titolo
│   └── email.js                 # Nodemailer per form contatti
├── public/
│   ├── style.css                # CSS principale
│   ├── admin.css                # Stili pannello admin
│   ├── js/
│   │   ├── main.js              # JS frontend (navbar, reveal, form)
│   │   ├── gallery.js           # Carousel per pagine dettaglio
│   │   ├── gallery.css          # Stili gallery
│   │   └── admin.js             # Widget tag chip
│   └── uploads/                 # Immagini caricate via admin
├── views/
│   ├── partials/
│   │   ├── head.ejs             # <head> condiviso
│   │   ├── navbar.ejs           # Barra navigazione
│   │   ├── footer.ejs           # Footer
│   │   └── project-card.ejs     # Card portfolio orizzontale
│   ├── index.ejs                # Homepage
│   ├── project.ejs              # Pagina dettaglio lavoro
│   ├── admin/
│   │   ├── login.ejs            # Login admin
│   │   ├── dashboard.ejs        # Lista progetti
│   │   └── project-form.ejs     # Form crea/modifica progetto
│   └── 404.ejs                  # Pagina non trovata
└── scripts/
    ├── seed-projects.js         # Popola i 4 progetti iniziali
    └── hash-password.js         # Genera hash password admin
```

---

## Sezioni Homepage

### 1. Hero
- Titolo, sottotitolo, CTA "Richiedi un preventivo" e "Vedi i lavori"
- Statistiche: clienti, tempo consegna, responsive, preventivo gratuito

### 2. Come lavoriamo
- 4 step card: Parliamoci, Preventivo chiaro, Sviluppo rapido, Consegna & online

### 3. Portfolio
- Card orizzontali: screenshot smartphone a sinistra, info a destra
- Ogni card cliccabile porta a `/lavori/:slug`
- Su mobile le card diventano verticali (immagine sopra, info sotto)

### 4. Prezzi
- 3 piani: **Starter** (€299), **Business** (€549), **E-commerce** (€999)
- Tutti con "IVA inclusa" tra prezzo e nota
- Business evidenziato come "Più richiesto"
- Nessun canone mensile

### 5. Contatti
- Info contatto: WhatsApp, Email, Instagram
- Form: nome, email, tipo sito, messaggio
- Submit via fetch a `/api/contact`
- Invio email con Nodemailer (o log in console se SMTP non configurato)

### 6. Footer
- Logo, copyright, link rapidi

---

## Pagina Dettaglio Progetto (`/lavori/:slug`)

- Header con titolo, settore, tags
- Box meta: tipo prodotto, tempo stimato, bottone "Visita il sito"
- Gallery immagini con carousel (o immagine singola se solo thumbnail)
- Descrizione lunga del progetto
- Sezione "Altri lavori" con fino a 3 card di altri progetti

---

## Pannello Admin (`/admin`)

### Autenticazione
- **Login:** campo password singolo
- **Metodo:** password verificata con bcrypt, JWT salvato in cookie httpOnly (8h)
- **Generare hash:** `npm run hash-password`

### Dashboard
- Lista progetti con thumbnail, titolo, settore, tipo, azioni (vedi/modifica/elimina)
- Bottone "Nuovo progetto"

### Form Progetto (crea/modifica)
- **Titolo** → slug auto-generato
- **Settore** (testo libero)
- **Tags** (widget chip: scrivi + Invio per aggiungere)
- **Descrizione breve** (per la card, max ~200 char)
- **Descrizione lunga** (per la pagina dettaglio)
- **URL sito live**
- **Tipo prodotto** (select: Starter / Business / E-commerce)
- **Tempo stimato** (es. "5 giorni")
- **Upload immagini multiple** (max 5MB/file)
- **Selezione thumbnail** tra immagini caricate o URL esterno

### Elimina progetto
- Conferma JavaScript, elimina anche le immagini dal server

---

## API

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/` | Homepage con lista progetti |
| GET | `/lavori/:slug` | Pagina dettaglio progetto |
| GET | `/admin` | Dashboard (richiede auth) |
| GET | `/admin/login` | Pagina login |
| POST | `/admin/login` | Autenticazione |
| GET | `/admin/logout` | Logout |
| GET | `/admin/projects/new` | Form nuovo progetto |
| POST | `/admin/projects/new` | Crea progetto |
| GET | `/admin/projects/:id/edit` | Form modifica progetto |
| POST | `/admin/projects/:id/edit` | Aggiorna progetto |
| POST | `/admin/projects/:id/delete` | Elimina progetto |
| POST | `/api/contact` | Invia messaggio contatto |

---

## Configurazione (.env)

```env
ADMIN_PASSWORD_HASH=           # Genera con: npm run hash-password
JWT_SECRET=cambia-questo-segreto-in-produzione
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@r-net.it
CONTACT_TO=info@r-net.it
PORT=3000
```

---

## Comandi

| Comando | Descrizione |
|---------|-------------|
| `npm start` | Avvia il server |
| `npm run dev` | Avvia con nodemon (auto-reload) |
| `npm run seed` | Popola i 4 progetti iniziali |
| `npm run hash-password` | Genera hash password admin |

---

## Setup iniziale

1. `npm install`
2. `npm run seed` — crea i 4 progetti di esempio
3. `npm run hash-password` — scegli una password e copia l'hash in `.env`
4. Configura `JWT_SECRET` in `.env`
5. (Opzionale) Configura SMTP in `.env` per le email del form contatti
6. `npm run dev` — il sito è su http://localhost:3000

---

## Design

- **Tema:** Dark mode (sfondo #080c1a)
- **Font:** Syne (headings), Inter (body)
- **Colore accent:** #4361ee (blu)
- **Stile:** Moderno, minimal, bordi arrotondati, animazioni reveal on scroll
- **Responsive:** Mobile-first, hamburger menu su schermi < 768px
