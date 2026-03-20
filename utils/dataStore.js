const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

const LOCAL_FILE = path.join(__dirname, '..', 'data', 'projects.json');
const R2_KEY = 'data/projects.json';

let s3, BUCKET;

function getS3() {
  if (!s3 && process.env.R2_ACCOUNT_ID) {
    s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.eu.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
      }
    });
    BUCKET = process.env.R2_BUCKET_NAME || 'sitelya';
  }
  return s3;
}

// In-memory cache to avoid reading R2 on every request
let cache = null;
let cacheReady = false;

async function readFromR2() {
  try {
    const res = await getS3().send(new GetObjectCommand({ Bucket: BUCKET, Key: R2_KEY }));
    const body = await res.Body.transformToString();
    return JSON.parse(body);
  } catch (err) {
    if (err.name === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404) return null;
    console.error('R2 read error:', err.message);
    return null;
  }
}

async function writeToR2(projects) {
  await getS3().send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: R2_KEY,
    Body: JSON.stringify(projects, null, 2),
    ContentType: 'application/json'
  }));
}

function readLocal() {
  if (!fs.existsSync(LOCAL_FILE)) return [];
  return JSON.parse(fs.readFileSync(LOCAL_FILE, 'utf-8'));
}

function writeLocal(projects) {
  fs.writeFileSync(LOCAL_FILE, JSON.stringify(projects, null, 2), 'utf-8');
}

// Initialize: load from R2 if available, otherwise from local file
async function init() {
  if (cacheReady) return;
  if (getS3()) {
    const r2Data = await readFromR2();
    if (r2Data) {
      cache = r2Data;
    } else {
      // First run: push local data to R2
      cache = readLocal();
      await writeToR2(cache);
    }
  } else {
    cache = readLocal();
  }
  cacheReady = true;
}

function readProjects() {
  if (!cacheReady) return readLocal(); // fallback before init
  return cache;
}

async function writeProjects(projects) {
  cache = projects;
  writeLocal(projects); // always keep local copy
  if (getS3()) {
    await writeToR2(projects);
  }
}

function getAll() {
  return readProjects();
}

function getBySlug(slug) {
  return readProjects().find(p => p.slug === slug) || null;
}

function getById(id) {
  return readProjects().find(p => p.id === id) || null;
}

async function create(project) {
  const projects = readProjects();
  project.id = Date.now().toString();
  project.createdAt = new Date().toISOString();
  projects.push(project);
  await writeProjects(projects);
  return project;
}

async function update(id, data) {
  const projects = readProjects();
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return null;
  projects[idx] = { ...projects[idx], ...data, updatedAt: new Date().toISOString() };
  await writeProjects(projects);
  return projects[idx];
}

async function remove(id) {
  const projects = readProjects();
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return false;
  projects.splice(idx, 1);
  await writeProjects(projects);
  return true;
}

module.exports = { init, getAll, getBySlug, getById, create, update, remove };
