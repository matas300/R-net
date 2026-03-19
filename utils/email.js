const nodemailer = require('nodemailer');

function createTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: parseInt(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

async function sendContactEmail({ nome, email, tipo, messaggio }) {
  const transporter = createTransporter();

  if (!transporter) {
    console.log('[Email] SMTP non configurato. Messaggio ricevuto:');
    console.log(`  Da: ${nome} <${email}>`);
    console.log(`  Tipo: ${tipo}`);
    console.log(`  Messaggio: ${messaggio}`);
    return { sent: false, reason: 'SMTP non configurato' };
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@sitelya.it',
    to: process.env.CONTACT_TO || 'info@sitelya.it',
    replyTo: email,
    subject: `[Sitelya] Nuova richiesta da ${nome}`,
    html: `
      <h2>Nuova richiesta di contatto</h2>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Tipo di sito:</strong> ${tipo || 'Non specificato'}</p>
      <p><strong>Messaggio:</strong></p>
      <p>${messaggio}</p>
    `
  });

  return { sent: true };
}

module.exports = { sendContactEmail };
