const express = require('express');
const router = express.Router();
const dataStore = require('../utils/dataStore');

// Homepage
router.get('/', (req, res) => {
  const projects = dataStore.getAll();
  res.render('index', { projects });
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
