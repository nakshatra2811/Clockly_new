README.md:
- Documentation on prerequisites (Node.js, MongoDB)
- Setup instructions (install dependencies, environment variables, run backend)
- Feature descriptions: Home with Premium section, Contact Us form, Newsletter subscription, Payment flows
- API endpoints summary and usage
- Troubleshooting tips

package.json:
- Node.js dependencies: express, mongoose, dotenv, @sendgrid/mail, body-parser, cors, paypal-rest-sdk, qrcode
- Scripts for start and dev with nodemon

.env.example:
- PORT
- MONGODB_URI
- SENDGRID_API_KEY
- SENDGRID_SENDER_EMAIL
- PAYPAL_CLIENT_ID
- PAYPAL_CLIENT_SECRET
- PAYPAL_MODE (sandbox/live)
- UPI_MERCHANT_VPA (e.g., merchant@upi)

src/server.js:
- Express app setup with JSON parsing, CORS
- Connects MongoDB
- Mounts /api/contact, /api/newsletter, /api/payment routes
- Error handling middleware
- Starts server on PORT

src/config/db.js:
- Mongoose connection setup using MONGODB_URI

src/config/sendgrid.js:
- Configures @sendgrid/mail with API key
- Exports sendEmail(to, subject, text, html) function

src/config/paypal.js:
- Configures PayPal SDK with client ID, secret, mode
- Exports initialized paypal object

src/models/ContactMessage.js:
- Mongoose schema: name, email, message, createdAt

src/models/NewsletterSubscriber.js:
- Mongoose schema: email (unique), subscribedAt

src/routes/contactRoutes.js:
- POST /contact
- Validates inputs, saves message to DB
- Sends notification email to admin via SendGrid

src/routes/newsletterRoutes.js:
- POST /newsletter
- Validates email, prevents duplicates
- Saves subscriber, sends confirmation email

src/routes/paymentRoutes.js:
- POST /payment/paypal
  - Creates PayPal payment, returns approval URL
- POST /payment/upi
  - Generates UPI deep link and QR code image URL, returns both

public/index.html:
- Contains Premium section with Early Bird pricing and Get Early Access button triggering payment flow
- Contact Us form with name, email, message fields
- Newsletter subscription forms in sidebar and footer
- Sticky sidebar ad and footer ad placeholders
- Privacy Policy link

public/privacy.html:
- Privacy policy content with structured sections

public/styles.css:
- Layout for sticky sidebar ad, footer ad
- Styling for forms, premium section, general UI

public/main.js:
- Handles Contact Us form submission via fetch POST /api/contact
- Handles newsletter subscription forms via fetch POST /api/newsletter
- Handles Premium Get Early Access click:
  - Initiates PayPal payment via /api/payment/paypal then redirects to approval URL
  - Provides UPI payment option by fetching QR code and link from /api/payment/upi
- Shows success/error messages accordingly

tests/contact.test.js, newsletter.test.js, payment.test.js:
- Backend integration tests for respective APIs

docs/API.md:
- Detailed API endpoint documentation with request/response examples

docs/ARCHITECTURE.md:
- Overall architecture overview diagrams and explanations

---

This setup connects frontend forms to backend APIs, stores data in MongoDB, sends emails using SendGrid, and integrates payments through PayPal and UPI.

If you want, I can generate specific code files or snippets next. Let me know your preference.