const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { sendContactEmail } = require('../utils/email');

router.post('/contact', [
  body('nome').trim().notEmpty().withMessage('Il nome è obbligatorio'),
  body('email').isEmail().withMessage('Email non valida'),
  body('messaggio').trim().notEmpty().withMessage('Il messaggio è obbligatorio')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const result = await sendContactEmail(req.body);
    if (result.sent) {
      res.json({ message: 'Messaggio inviato con successo!' });
    } else {
      // SMTP not configured but message logged
      res.json({ message: 'Richiesta ricevuta. Ti ricontatteremo presto!' });
    }
  } catch (err) {
    console.error('[Email Error]', err);
    res.status(500).json({ message: 'Errore nell\'invio. Riprova più tardi.' });
  }
});

module.exports = router;
