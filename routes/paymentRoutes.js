const express = require('express');
const router = express.Router();
const paypal = require('../config/paypal');
const QRCode = require('qrcode');

router.post('/paypal', (req, res) => {
  const { amount, currency = 'USD' } = req.body;
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Valid amount is required' });
  }

  const create_payment_json = {
    intent: 'sale',
    payer: { payment_method: 'paypal' },
    redirect_urls: {
      return_url: 'http://localhost:5000/api/payment/paypal/success',
      cancel_url: 'http://localhost:5000/api/payment/paypal/cancel',
    },
    transactions: [{
      amount: { currency, total: amount.toFixed(2) },
      description: 'Clockly Premium Subscription',
    }],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Payment creation failed' });
    }
    for (let link of payment.links) {
      if (link.rel === 'approval_url') {
        return res.json({ approvalUrl: link.href });
      }
    }
    res.status(500).json({ error: 'No approval URL found' });
  });
});

router.get('/paypal/success', (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
      console.error(error);
      return res.redirect('/?payment=failed');
    }
    return res.redirect('/?payment=success');
  });
});

router.get('/paypal/cancel', (req, res) => {
  res.redirect('/?payment=cancelled');
});

// UPI payment: generate deep link and QR code
router.post('/upi', async (req, res) => {
  const { amount } = req.body;
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Valid amount is required' });
  }

  const upiVpa = process.env.UPI_MERCHANT_VPA;
  if (!upiVpa) {
    return res.status(500).json({ error: 'UPI merchant VPA not configured' });
  }

  const upiLink = `upi://pay?pa=${encodeURIComponent(upiVpa)}&pn=Global%20Time%20Hub&am=${amount.toFixed(2)}&cu=INR&tn=Premium%20Subscription`;

  try {
    const qrDataUrl = await QRCode.toDataURL(upiLink);
    res.json({ upiLink, qrDataUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'QR code generation failed' });
  }
});

module.exports = router;