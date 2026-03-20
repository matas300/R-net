const express = require('express');
const router = express.Router();
const dataStore = require('../utils/dataStore');

// Homepage
router.get('/', (req, res) => {
  const projects = dataStore.getAll();
  res.render('index', { projects });
});

// Sitemap
router.get('/sitemap.xml', (req, res) => {
  const baseUrl = 'https://sitelya.it';
  const projects = dataStore.getAll();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Static pages
  xml += `  <url><loc>${baseUrl}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>\n`;
  xml += `  <url><loc>${baseUrl}/privacy</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>\n`;

  // Project pages
  projects.forEach(p => {
    xml += `  <url><loc>${baseUrl}/lavori/${p.slug}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`;
  });

  xml += '</urlset>';

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// Robots.txt
router.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nAllow: /\nSitemap: https://sitelya.it/sitemap.xml\n');
});

// Privacy policy
router.get('/privacy', (req, res) => {
  res.render('privacy');
});

// Project detail
router.get('/lavori/:slug', (req, res) => {
  const project = dataStore.getBySlug(req.params.slug);
  if (!project) return res.status(404).render('404');

  const allProjects = dataStore.getAll();
  const otherProjects = allProjects.filter(p => p.slug !== project.slug).slice(0, 3);

  res.render('project', { project, otherProjects });
});

module.exports = router;
