const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.eu.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
  }
});

const BUCKET = process.env.R2_BUCKET_NAME || 'sitelya';
const PUBLIC_URL = (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, '');

/**
 * Upload a buffer to R2 and return the public URL.
 * @param {Buffer} buffer  – file contents
 * @param {string} originalName – original filename (used for extension)
 * @param {string} mimetype – e.g. image/png
 * @returns {Promise<string>} public URL of the uploaded file
 */
async function uploadToR2(buffer, originalName, mimetype) {
  const ext = path.extname(originalName).toLowerCase();
  const key = `uploads/${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: mimetype
  }));

  return `${PUBLIC_URL}/${key}`;
}

/**
 * Delete a file from R2 by its public URL or key.
 * @param {string} urlOrKey – full public URL or just the key
 */
async function deleteFromR2(urlOrKey) {
  if (!urlOrKey) return;

  let key = urlOrKey;
  // If it's a full URL, extract the key part
  if (urlOrKey.startsWith('http')) {
    try {
      const url = new URL(urlOrKey);
      key = url.pathname.replace(/^\/+/, '');
    } catch {
      return;
    }
  }

  try {
    await s3.send(new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key
    }));
  } catch (err) {
    console.error('R2 delete error:', err.message);
  }
}

/**
 * Check if a media value is an R2 URL (full http URL) vs local filename.
 */
function isR2Url(value) {
  return value && value.startsWith('http');
}

module.exports = { uploadToR2, deleteFromR2, isR2Url };
