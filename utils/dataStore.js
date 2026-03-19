const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'projects.json');

function readProjects() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeProjects(projects) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2), 'utf-8');
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

function create(project) {
  const projects = readProjects();
  project.id = Date.now().toString();
  project.createdAt = new Date().toISOString();
  projects.push(project);
  writeProjects(projects);
  return project;
}

function update(id, data) {
  const projects = readProjects();
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return null;
  projects[idx] = { ...projects[idx], ...data, updatedAt: new Date().toISOString() };
  writeProjects(projects);
  return projects[idx];
}

function remove(id) {
  const projects = readProjects();
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return false;
  projects.splice(idx, 1);
  writeProjects(projects);
  return true;
}

module.exports = { getAll, getBySlug, getById, create, update, remove };
