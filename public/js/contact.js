document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const subject = document.getElementById('contactSubject').value.trim();
  const message = document.getElementById('contactMessage').value.trim();

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message }),
    });
    const data = await res.json();
    if (res.ok) {
      alert('✅ Message sent successfully!');
      document.getElementById('contactForm').reset();
    } else {
      alert(`❌ Error: ${data.error || 'Failed to send message'}`);
    }
  } catch (err) {
    alert('❌ Network error');
  }
});