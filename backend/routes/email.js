const express = require('express');
const router = express.Router();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/send-email', async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    const { data, error } = await resend.emails.send({
      from: 'KiloLab <noreply@kilolab.fr>',
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) return res.status(400).json({ error });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
