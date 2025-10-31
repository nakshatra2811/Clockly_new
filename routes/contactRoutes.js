const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const { sendEmail } = require('../config/sendgrid');

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const contactMessage = new ContactMessage({ name, email, subject, message });
    await contactMessage.save();

    // Send notification email to admin
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    await sendEmail(
      adminEmail,
      `New Contact Message from ${name}`,
      `You have received a new message:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage:\n${message}`,
      `<p>You have received a new message:</p><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong><br/>${message}</p>`
    );

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Invalid input' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;