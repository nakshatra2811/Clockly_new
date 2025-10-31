// PayPal payment
document.getElementById('paypalPaymentBtn').addEventListener('click', async () => {
  try {
    const amount = 4.99;
    const res = await fetch('/api/payment/paypal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    const data = await res.json();
    if (res.ok && data.approvalUrl) {
      window.location.href = data.approvalUrl;
    } else {
      alert('❌ Payment initiation failed');
    }
  } catch (err) {
    alert('❌ Network error during payment');
  }
});

// UPI payment
document.getElementById('upiPaymentBtn').addEventListener('click', async () => {
  const container = document.getElementById('upiPaymentContainer');
  container.innerHTML = 'Loading UPI payment info...';
  try {
    const amount = 4.99;
    const res = await fetch('/api/payment/upi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    const data = await res.json();
    if (res.ok) {
      container.innerHTML = `
        <h3>Pay via UPI</h3>
        <img src="${data.qrDataUrl}" alt="UPI QR Code" style="max-width: 200px; margin-bottom: 15px;">
        <p><a href="${data.upiLink}" target="_blank" rel="noopener noreferrer">Click here to pay using UPI</a></p>
        <p>Scan QR code or click the link above with your UPI app</p>
      `;
    } else {
      container.innerHTML = `<p style="color: red;">❌ UPI payment initiation failed: ${data.error || ''}</p>`;
    }
  } catch (err) {
    container.innerHTML = '<p style="color: red;">❌ Network error during UPI payment</p>';
  }
});