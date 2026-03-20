require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Load settings (whatsappNumber etc.)
const settingsPath = path.join(__dirname, 'data', 'settings.json');
function loadSettings() {
  try { return JSON.parse(fs.readFileSync(settingsPath, 'utf8')); }
  catch { return { whatsappNumber: '' }; }
}
app.use((req, res, next) => {
  const settings = loadSettings();
  res.locals.whatsappNumber = settings.whatsappNumber || '';
  // Helper to resolve media paths: full URLs pass through, bare filenames get /uploads/ prefix
  res.locals.mediaUrl = function(val) {
    if (!val) return '';
    if (val.startsWith('http') || val.startsWith('/')) return val;
    return '/uploads/' + val;
  };
  next();
});

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/admin', require('./routes/admin'));
app.use('/api', require('./routes/api'));

// 404
app.use((req, res) => {
  res.status(404).render('404');
});

const dataStore = require('./utils/dataStore');
dataStore.init().then(() => {
  app.listen(PORT, () => {
    console.log(`Sitelya server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to init data store:', err);
  process.exit(1);
});
