async function handleNewsletterFormSubmission(formId) {
  const form = document.getElementById(formId);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput.value.trim();

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('✅ Subscribed successfully!');
        emailInput.value = '';
        if (formId === 'popupNewsletterForm') {
          document.getElementById('newsletterPopup').classList.remove('active');
        }
      } else {
        alert(`❌ Error: ${data.error || 'Subscription failed'}`);
      }
    } catch (err) {
      alert('❌ Network error');
    }
  });
}

handleNewsletterFormSubmission('popupNewsletterForm');
handleNewsletterFormSubmission('sidebarNewsletterForm');
handleNewsletterFormSubmission('footerNewsletterForm');

document.getElementById('closeNewsletter').addEventListener('click', () => {
  document.getElementById('newsletterPopup').classList.remove('active');
});