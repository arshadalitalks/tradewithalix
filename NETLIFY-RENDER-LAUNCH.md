# Launch: frontend on Netlify, backend on Render

1. MongoDB Atlas (free): create a cluster, a database user, allow access from anywhere (0.0.0.0/0), copy the connection string.
2. Put this whole folder on GitHub (new repo).
3. Render: New > Web Service > pick the repo. Build: npm install. Start: npm start.
   Add the environment variables from .env.example (see EMAIL-SETUP.md for email).
   SITE_URL must be your Netlify address (or your own domain).
4. Test the backend: open https://YOUR-SERVICE.onrender.com/api/plans in the browser. You should see the plans as text.
5. Open public/_redirects and replace tradewithalix-api.onrender.com with your real Render address.
6. Netlify: open your site > Deploys > drag the "public" folder onto the deploy box.
   (If the site is connected to Git, push the public folder contents or set Publish directory to "public".)
7. Test on your Netlify address: sign up, check the email code, add a note from /admin.html.

Updating later
- Text, photos, pages (anything in public/): edit, then drag the public folder to Netlify again.
- Plans and prices (server.js PLANS), email, payments: push to GitHub, Render redeploys by itself.
- Notes for members: admin panel at /admin.html, no redeploy needed.
Netlify keeps old deploys, so you can roll back from the Deploys page.

Render free sleeps after 15 minutes. Netlify gives a proxied request about 26 seconds, so the first visit after a sleep can fail.
Fix: ping https://YOUR-SERVICE.onrender.com/api/plans every 5 minutes with UptimeRobot (free), or use a paid Render instance.
