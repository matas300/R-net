const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyPassword, generateToken } = require('../config/auth');
const requireAuth = require('../middleware/auth');
const dataStore = require('../utils/dataStore');
const slugify = require('../utils/slugify');
const { uploadToR2, deleteFromR2, isR2Url } = require('../utils/r2');

// Multer config — memoryStorage (buffer), then upload to R2
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg|mp4|webm/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = /^(image|video)\//.test(file.mimetype);
    cb(null, ext && mimeOk);
  }
});

const mediaUpload = upload.fields([
  { name: 'coverPhone', maxCount: 1 },
  { name: 'previewPhone', maxCount: 1 },
  { name: 'previewWeb1', maxCount: 1 },
  { name: 'previewWeb2', maxCount: 1 }
]);

// Wrap multer to catch errors (Express 5 doesn't forward them automatically)
function mediaFields(req, res, next) {
  mediaUpload(req, res, function(err) {
    if (err) {
      console.error('Multer error:', err);
      return next(err);
    }
    next();
  });
}

const MEDIA_KEYS = ['coverPhone', 'previewPhone', 'previewWeb1', 'previewWeb2'];

/**
 * Delete a media file — handles both R2 URLs and legacy local filenames.
 */
function deleteMedia(filenameOrUrl) {
  if (!filenameOrUrl) return;

  if (isR2Url(filenameOrUrl)) {
    // Delete from R2 (async, fire-and-forget)
    deleteFromR2(filenameOrUrl).catch(err => console.error('R2 delete failed:', err.message));
  } else {
    // Legacy: local file in /public/uploads/
    const filePath = path.join(__dirname, '..', 'public', 'uploads', filenameOrUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}

// Login page
router.get('/login', (req, res) => {
  res.render('admin/login', { error: null });
});

// Login POST
router.post('/login', async (req, res) => {
  const { password } = req.body;
  const valid = await verifyPassword(password);
  if (!valid) {
    return res.render('admin/login', { error: 'Password errata.' });
  }
  const token = generateToken();
  res.cookie('admin_token', token, {
    httpOnly: true,
    maxAge: 8 * 60 * 60 * 1000,
    sameSite: 'lax'
  });
  res.redirect('/admin');
});

// Logout
router.get('/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.redirect('/admin/login');
});

// Dashboard
router.get('/', requireAuth, (req, res) => {
  const projects = dataStore.getAll();
  res.render('admin/dashboard', { projects, message: req.query.msg || null });
});

// New project form
router.get('/projects/new', requireAuth, (req, res) => {
  res.render('admin/project-form', { isEdit: false, project: {}, errors: null });
});

// Create project
router.post('/projects/new', requireAuth, mediaFields, async (req, res) => {
  const { title, sector, tags, shortDesc, longDesc, url, productType, estimatedTime } = req.body;

  if (!title || !sector || !shortDesc || !longDesc) {
    return res.render('admin/project-form', {
      isEdit: false,
      project: req.body,
      errors: [{ msg: 'Compila tutti i campi obbligatori.' }]
    });
  }

  const media = {};
  for (const key of MEDIA_KEYS) {
    if (req.files && req.files[key] && req.files[key][0]) {
      const file = req.files[key][0];
      try {
        media[key] = await uploadToR2(file.buffer, file.originalname, file.mimetype);
      } catch (err) {
        console.error(`R2 upload error for ${key}:`, err.message);
      }
    }
  }

  const project = {
    slug: slugify(title),
    title,
    sector,
    tags: tags ? tags.split(',').filter(Boolean) : [],
    shortDesc,
    longDesc,
    url: url || '',
    productType: productType || 'Starter',
    estimatedTime: estimatedTime || '',
    media
  };

  await dataStore.create(project);
  res.redirect('/admin?msg=Progetto creato con successo');
});

// Edit project form
router.get('/projects/:id/edit', requireAuth, (req, res) => {
  const project = dataStore.getById(req.params.id);
  if (!project) return res.redirect('/admin');
  res.render('admin/project-form', { isEdit: true, project, errors: null });
});

// Update project
router.post('/projects/:id/edit', requireAuth, mediaFields, async (req, res) => {
  const existing = dataStore.getById(req.params.id);
  if (!existing) return res.redirect('/admin');

  const { title, sector, tags, shortDesc, longDesc, url, productType, estimatedTime } = req.body;

  console.log('Files received:', req.files ? Object.keys(req.files).map(k => k + ': ' + req.files[k][0].originalname) : 'none');

  const media = existing.media ? { ...existing.media } : {};

  for (const key of MEDIA_KEYS) {
    const removeFlag = req.body['remove_' + key];
    const newFile = req.files && req.files[key] && req.files[key][0];

    if (newFile) {
      // Replace: delete old, upload new to R2
      deleteMedia(media[key]);
      try {
        media[key] = await uploadToR2(newFile.buffer, newFile.originalname, newFile.mimetype);
      } catch (err) {
        console.error(`R2 upload error for ${key}:`, err.message);
      }
    } else if (removeFlag === '1') {
      // Remove only
      deleteMedia(media[key]);
      delete media[key];
    }
  }

  const data = {
    slug: slugify(title),
    title,
    sector,
    tags: tags ? tags.split(',').filter(Boolean) : [],
    shortDesc,
    longDesc,
    url: url || '',
    productType: productType || 'Starter',
    estimatedTime: estimatedTime || '',
    media
  };

  await dataStore.update(req.params.id, data);
  res.redirect('/admin?msg=Progetto aggiornato');
});

// Settings
router.post('/settings', requireAuth, (req, res) => {
  const settingsPath = path.join(__dirname, '..', 'data', 'settings.json');
  let settings = {};
  try { settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8')); } catch {}
  settings.whatsappNumber = (req.body.whatsappNumber || '').replace(/[^0-9]/g, '');
  settings.instagramHandle = (req.body.instagramHandle || '').trim();
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  res.redirect('/admin?msg=Impostazioni salvate');
});

// Delete project
router.post('/projects/:id/delete', requireAuth, async (req, res) => {
  const project = dataStore.getById(req.params.id);
  if (project && project.media) {
    MEDIA_KEYS.forEach(key => deleteMedia(project.media[key]));
  }
  // Legacy: also clean up old images array if present
  if (project && project.images) {
    project.images.forEach(img => deleteMedia(img));
  }
  await dataStore.remove(req.params.id);
  res.redirect('/admin?msg=Progetto eliminato');
});

module.exports = router;
