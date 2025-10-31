const express = require('express');
const router = express.Router();
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const { sendEmail } = require('../config/sendgrid');

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already subscribed' });
    }

    const subscriber = new NewsletterSubscriber({ email });
    await subscriber.save();

    // Send confirmation email
    await sendEmail(
      email,
      'Subscription Confirmed - Clockly',
      'Thank you for subscribing to Clockly newsletter. You will receive productivity tips and updates!',
      '<p>Thank you for subscribing to <strong>Clockly</strong> newsletter. You will receive productivity tips and updates!</p>'
    );

    res.json({ success: true, message: 'Subscribed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;