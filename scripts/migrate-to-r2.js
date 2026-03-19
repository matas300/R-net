/**
 * Migration script: uploads local media files to Cloudflare R2
 * and updates data/projects.json with full R2 URLs.
 *
 * Usage:  node scripts/migrate-to-r2.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const fs = require('fs');
const path = require('path');
const { uploadToR2, isR2Url } = require('../utils/r2');

const DATA_FILE = path.join(__dirname, '..', 'data', 'projects.json');
const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');

// Map common extensions to MIME types
const MIME_MAP = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf'
};

function getMime(filename) {
  const ext = path.extname(filename).toLowerCase();
  return MIME_MAP[ext] || 'application/octet-stream';
}

/**
 * If value is a local filename (not a URL and not empty), upload to R2
 * and return the new URL. Otherwise return the value unchanged.
 * Uses a cache so the same file is only uploaded once.
 */
async function migrateValue(value, cache) {
  if (!value || typeof value !== 'string' || isR2Url(value)) {
    return value; // already a URL or empty — skip
  }

  // Check cache first
  if (cache[value]) {
    console.log(`  [cache] ${value} -> already uploaded`);
    return cache[value];
  }

  const filePath = path.join(UPLOADS_DIR, value);
  if (!fs.existsSync(filePath)) {
    console.warn(`  [WARN] File not found, skipping: ${filePath}`);
    return value; // leave as-is if file missing
  }

  const buffer = fs.readFileSync(filePath);
  const mime = getMime(value);
  const url = await uploadToR2(buffer, value, mime);
  console.log(`  [OK]   ${value} -> ${url}`);

  cache[value] = url;
  return url;
}

async function main() {
  console.log('=== R2 Migration Start ===\n');

  const projects = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  const cache = {}; // filename -> R2 URL (avoid duplicate uploads)
  let totalUploaded = 0;

  for (const project of projects) {
    console.log(`Project "${project.title}" (id=${project.id}):`);

    // 1. thumbnail (string)
    if (project.thumbnail) {
      const before = project.thumbnail;
      project.thumbnail = await migrateValue(project.thumbnail, cache);
      if (before !== project.thumbnail) totalUploaded++;
    }

    // 2. images (array of strings)
    if (Array.isArray(project.images)) {
      for (let i = 0; i < project.images.length; i++) {
        const before = project.images[i];
        project.images[i] = await migrateValue(project.images[i], cache);
        if (before !== project.images[i]) totalUploaded++;
      }
    }

    // 3. media (object with string values)
    if (project.media && typeof project.media === 'object') {
      for (const key of Object.keys(project.media)) {
        const before = project.media[key];
        project.media[key] = await migrateValue(project.media[key], cache);
        if (before !== project.media[key]) totalUploaded++;
      }
    }

    console.log('');
  }

  // Save updated projects.json
  fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2), 'utf-8');
  console.log(`=== Migration Complete ===`);
  console.log(`Total media references migrated: ${totalUploaded}`);
  console.log(`Updated file: ${DATA_FILE}`);
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
