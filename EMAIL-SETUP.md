# Email confirmation setup (Brevo, free)

1. Create a free account at brevo.com.
2. Senders, Domains: add the email you want mails to come from (best: an address on your own domain, then authenticate the domain so mails do not go to spam).
3. SMTP & API, API Keys: create a key.
4. In Render, Environment, add:
   - BREVO_API_KEY = the key
   - MAIL_FROM = the verified sender email
   - SITE_URL = your site address, for example https://tradewithalix.onrender.com
   - NOTIFY_EMAIL = where you want new-lead alerts
5. Redeploy, sign up with a real email and check the code arrives (also look in Spam).

Locally, with no key set, codes are printed in the terminal instead of being emailed.
Render's free plan blocks SMTP ports, which is why this uses an HTTPS email API.
