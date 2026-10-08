const express = require('express'), path = require('path'), crypto = require('crypto');
const bcrypt = require('bcryptjs'), jwt = require('jsonwebtoken'), { MongoClient } = require('mongodb');
const SECRET = process.env.JWT_SECRET || 'change-this-secret';
const RZP_ID = process.env.RAZORPAY_KEY_ID, RZP_SECRET = process.env.RAZORPAY_KEY_SECRET;
// Edit plan names, prices (INR) and access days here
const PLANS = {
  starter: { name: 'Starter', price: 6999, days: 90 },
  pro: { name: 'Pro', price: 13999, days: 180 },
  elite: { name: 'Elite', price: 24999, days: 365 }
};
const now = () => new Date().toISOString(), NO_ID = { projection: { _id: 0 } };
const okMail = e => /^\S+@\S+\.\S+$/.test(e || '');
let db; const C = n => db.collection(n);
const sign = u => jwt.sign({ id: u.id }, SECRET, { expiresIn: '7d' });
const pub = u => ({ id: u.id, name: u.name, email: u.email, role: u.role, plan: u.plan || null, planUntil: u.planUntil || null, verified: !!u.verified, first: u.first || '', last: u.last || '', created: u.created || null });
const active = u => u.role === 'admin' || (u.planUntil && new Date(u.planUntil) > new Date());
const h = f => (q, s, n) => f(q, s, n).catch(e => { console.error(e); s.status(500).json({ error: 'Server error. Please try again.' }); });
const auth = h(async (req, res, next) => {
  try {
    const p = jwt.verify((req.headers.authorization || '').slice(7), SECRET);
    req.user = await C('users').findOne({ id: p.id }, NO_ID);
    if (!req.user) throw 0;
  } catch { return res.status(401).json({ error: 'Please log in again.' }); }
  next();
});
const admin = (req, res, next) => req.user.role === 'admin' ? next() : res.status(403).json({ error: 'Admins only.' });

// ---- Email (sign-in codes and confirmations). Uses an HTTPS API, because free hosts block SMTP ports.
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const FROM = process.env.MAIL_FROM, SITE = process.env.SITE_URL;
async function sendMail(to, subject, html, text) {
  if (process.env.BREVO_API_KEY && FROM) {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', { method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: { name: 'tradewithalix', email: FROM }, to: [{ email: to }], subject, htmlContent: html, textContent: text }) });
    if (!r.ok) throw new Error('Brevo ' + r.status + ' ' + await r.text());
    return 'sent';
  }
  if (process.env.RESEND_API_KEY && FROM) {
    const r = await fetch('https://api.resend.com/emails', { method: 'POST',
      headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'tradewithalix <' + FROM + '>', to: [to], subject, html, text }) });
    if (!r.ok) throw new Error('Resend ' + r.status + ' ' + await r.text());
    return 'sent';
  }
  if (process.env.NODE_ENV === 'production') throw new Error('Email is not set up (add BREVO_API_KEY or RESEND_API_KEY and MAIL_FROM)');
  console.log('\n[DEV EMAIL] to: ' + to + '\n' + subject + '\n' + text + '\n');
  return 'dev';
}
const sha = s => crypto.createHash('sha256').update(s + SECRET).digest('hex');
const shell = (title, body) => '<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;color:#0B1F3A"><h2 style="margin:0 0 12px">' + title + '</h2>' + body + '<p style="color:#6b7a8c;font-size:12px;margin-top:24px">tradewithalix. Trading carries a high level of risk. Content here is education, not advice.</p></div>';
const hits = new Map();
const ipOf = req => req.headers['x-nf-client-connection-ip'] || req.ip;  // real visitor IP when Netlify proxies /api
const limit = (key, max, ms) => { const n = Date.now(), a = (hits.get(key) || []).filter(t => n - t < ms); a.push(n); hits.set(key, a); return a.length > max; };

const app = express();
app.set('trust proxy', 1);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Public
app.get('/api/plans', (req, res) => res.json(PLANS));
app.get('/api/posts', h(async (req, res) => res.json(await C('posts').find({ public: true }, NO_ID).sort({ id: -1 }).toArray())));
app.post('/api/leads', h(async (req, res) => {
  if (limit('lead:' + ipOf(req), 5, 3600000)) return res.status(429).json({ error: 'Too many messages. Please try again later.' });
  const { name, email, message } = req.body;
  if (!name || !okMail(email)) return res.status(400).json({ error: 'Enter your name and a valid email.' });
  await C('leads').insertOne({ id: Date.now(), name: String(name).slice(0, 80), email, message: String(message || '').slice(0, 1200), created: now() });
  const quiet = e => console.error('lead mail:', e.message);
  sendMail(email, 'We got your message', shell('Thanks, ' + esc(name), '<p>We received your message and Alix will get back to you soon.</p><p style="color:#6b7a8c">Your message: ' + esc(message || '(none)') + '</p>'), 'Thanks, ' + name + '. We received your message and Alix will get back to you soon.').catch(quiet);
  const notify = process.env.NOTIFY_EMAIL || process.env.ADMIN_EMAIL;
  if (notify) sendMail(notify, 'New lead: ' + name, shell('New lead', '<p><b>' + esc(name) + '</b> (' + esc(email) + ')</p><p>' + esc(message || '(no message)') + '</p>'), 'New lead: ' + name + ' <' + email + '>\n' + (message || '')).catch(quiet);
  res.json({ ok: true });
}));
// Passwordless sign-up and sign-in: first name, last name, email, then a one-time code (or link) sent by email
app.post('/api/auth/start', h(async (req, res) => {
  if (limit('auth:' + ipOf(req), 10, 3600000)) return res.status(429).json({ error: 'Too many tries. Please try again later.' });
  const { mode, first, last } = req.body, email = (req.body.email || '').trim().toLowerCase();
  if (!okMail(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
  let u = await C('users').findOne({ email }, NO_ID);
  if (mode === 'signup' && !u) {
    if (!(first || '').trim() || !(last || '').trim()) return res.status(400).json({ error: 'Enter your first and last name.' });
    u = { id: Date.now(), first: first.trim(), last: last.trim(), name: first.trim() + ' ' + last.trim(), email, role: 'user', verified: false, created: now() };
    await C('users').insertOne({ ...u });
  }
  if (!u) return res.json({ ok: true });  // never reveal whether an account exists
  const old = await C('codes').findOne({ email });
  if (old && Date.now() - old.sent < 60000) return res.status(429).json({ error: 'Please wait a minute before asking for another code.' });
  const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0'), link = crypto.randomBytes(24).toString('hex');
  await C('codes').replaceOne({ email }, { email, codeHash: sha(code + email), linkHash: sha(link), expires: Date.now() + 15 * 60000, tries: 0, sent: Date.now() }, { upsert: true });
  const url = (SITE || req.protocol + '://' + req.get('host')) + '/verify.html?token=' + link;
  const html = shell('Confirm your email', '<p>Hi ' + esc(u.first || u.name) + ',</p><p>Use this code to confirm your email and sign in:</p><p style="font-size:32px;letter-spacing:8px;font-weight:bold;margin:16px 0">' + code + '</p><p>It works for 15 minutes. Or tap the button:</p><p><a href="' + url + '" style="background:#2563EB;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Confirm and sign in</a></p><p style="color:#6b7a8c">If you did not ask for this, ignore this email. Nobody can sign in without the code.</p>');
  const text = 'Hi ' + (u.first || u.name) + ',\n\nYour tradewithalix code is ' + code + ' (valid for 15 minutes).\nOr open this link: ' + url + '\n\nIf you did not ask for this, ignore this email.';
  let st;
  try { st = await sendMail(email, 'Your tradewithalix code: ' + code, html, text); }
  catch (e) { console.error('mail failed:', e.message); return res.status(502).json({ error: 'We could not send the email. Please try again in a moment.' }); }
  res.json({ ok: true, ...(st === 'dev' ? { devCode: code } : {}) });
}));
const finish = async (email, res) => {
  await C('users').updateOne({ email }, { $set: { verified: true, verifiedAt: now() } });
  await C('codes').deleteOne({ email });
  const u = await C('users').findOne({ email }, NO_ID);
  res.json({ token: sign(u), user: pub(u) });
};
app.post('/api/auth/verify', h(async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase(), code = String(req.body.code || '').replace(/\s/g, '');
  const d = await C('codes').findOne({ email });
  if (!d || d.expires < Date.now()) return res.status(400).json({ error: 'This code has expired. Ask for a new one.' });
  if (d.tries >= 5) return res.status(429).json({ error: 'Too many wrong tries. Ask for a new code.' });
  if (sha(code + email) !== d.codeHash) { await C('codes').updateOne({ email }, { $inc: { tries: 1 } }); return res.status(400).json({ error: 'That code is not right. Check it and try again.' }); }
  await finish(email, res);
}));
app.post('/api/auth/link', h(async (req, res) => {
  const d = await C('codes').findOne({ linkHash: sha(String(req.body.token || '')) });
  if (!d || d.expires < Date.now()) return res.status(400).json({ error: 'This link has expired or was already used.' });
  await finish(d.email, res);
}));
app.post('/api/login', h(async (req, res) => {
  const u = await C('users').findOne({ email: (req.body.email || '').toLowerCase() }, NO_ID);
  if (!u || !u.hash || !bcrypt.compareSync(req.body.password || '', u.hash)) return res.status(401).json({ error: 'Wrong email or password.' });
  res.json({ token: sign(u), user: pub(u) });
}));

// Logged-in members
app.get('/api/me', auth, (req, res) => res.json(pub(req.user)));
app.get('/api/member/posts', auth, h(async (req, res) => {
  const a = active(req.user);
  res.json({ active: a, posts: await C('posts').find(a ? {} : { public: true }, NO_ID).sort({ id: -1 }).toArray() });
}));

// Client area: trading journal, payment history, profile
const num = (v, d = null) => (v === '' || v == null || !isFinite(+v)) ? d : +v;
app.get('/api/journal', auth, h(async (req, res) => res.json(await C('journal').find({ uid: req.user.id }, NO_ID).sort({ date: -1, id: -1 }).limit(2000).toArray())));
app.post('/api/journal', auth, h(async (req, res) => {
  const b = req.body, pnl = num(b.pnl);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(b.date || '') ? b.date : null;
  const symbol = String(b.symbol || '').toUpperCase().replace(/[^A-Z0-9._]/g, '').slice(0, 12);
  if (!date || !symbol || !['buy', 'sell'].includes(b.type) || pnl === null) return res.status(400).json({ error: 'Add a date, a symbol, buy or sell, and the result (P&L).' });
  if (await C('journal').countDocuments({ uid: req.user.id }) >= 2000) return res.status(400).json({ error: 'Your journal is full (2000 trades).' });
  await C('journal').insertOne({ id: Date.now(), uid: req.user.id, date, symbol, type: b.type, lots: num(b.lots), entry: num(b.entry), exit: num(b.exit), pnl, notes: String(b.notes || '').slice(0, 300), created: now() });
  res.json({ ok: true });
}));
app.delete('/api/journal/:id', auth, h(async (req, res) => { await C('journal').deleteOne({ id: +req.params.id, uid: req.user.id }); res.json({ ok: true }); }));
app.get('/api/payments/me', auth, h(async (req, res) => res.json(await C('payments').find({ uid: req.user.id, status: 'paid' }, NO_ID).sort({ id: -1 }).toArray())));
app.put('/api/me', auth, h(async (req, res) => {
  const first = String(req.body.first || '').trim().slice(0, 40), last = String(req.body.last || '').trim().slice(0, 40);
  if (!first || !last) return res.status(400).json({ error: 'Enter your first and last name.' });
  const name = first + ' ' + last;
  await C('users').updateOne({ id: req.user.id }, { $set: { first, last, name } });
  res.json(pub({ ...req.user, first, last, name }));
}));

// Trading account link requests (reviewed by Alix in the admin panel)
app.get('/api/accounts', auth, h(async (req, res) => res.json(await C('accounts').find({ uid: req.user.id }, NO_ID).sort({ id: -1 }).toArray())));
app.post('/api/accounts', auth, h(async (req, res) => {
  const broker = String(req.body.broker || '').trim().slice(0, 40), number = String(req.body.number || '').replace(/\s/g, ''), server = String(req.body.server || '').trim().slice(0, 60);
  if (!broker || !/^\d{4,12}$/.test(number)) return res.status(400).json({ error: 'Enter your broker and your account number (digits only).' });
  if (await C('accounts').countDocuments({ uid: req.user.id }) >= 3) return res.status(400).json({ error: 'You can link up to 3 accounts. Remove one first.' });
  await C('accounts').insertOne({ id: Date.now(), uid: req.user.id, name: req.user.name, email: req.user.email, broker, number, server, status: 'pending', created: now() });
  const notify = process.env.NOTIFY_EMAIL || process.env.ADMIN_EMAIL;
  if (notify) sendMail(notify, 'Account link request: ' + req.user.name, shell('Account link request', '<p><b>' + esc(req.user.name) + '</b> (' + esc(req.user.email) + ')</p><p>' + esc(broker) + ', account ' + esc(number) + '</p>'), 'Account link request from ' + req.user.name + ': ' + broker + ' ' + number).catch(e => console.error('account mail:', e.message));
  res.json({ ok: true });
}));
app.delete('/api/accounts/:id', auth, h(async (req, res) => { await C('accounts').deleteOne({ id: +req.params.id, uid: req.user.id }); res.json({ ok: true }); }));
app.put('/api/admin/accounts/:id', auth, admin, h(async (req, res) => {
  if (!['pending', 'approved', 'rejected'].includes(req.body.status)) return res.status(400).json({ error: 'Bad status.' });
  await C('accounts').updateOne({ id: +req.params.id }, { $set: { status: req.body.status } });
  res.json({ ok: true });
}));

// Payments (Razorpay)
app.post('/api/pay/order', auth, h(async (req, res) => {
  const plan = PLANS[req.body.plan];
  if (!plan) return res.status(400).json({ error: 'Choose a valid plan.' });
  if (!RZP_ID || !RZP_SECRET) return res.status(503).json({ error: 'Payments are not set up yet.' });
  const r = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Basic ' + Buffer.from(RZP_ID + ':' + RZP_SECRET).toString('base64') },
    body: JSON.stringify({ amount: plan.price * 100, currency: 'INR', receipt: 'twa_' + Date.now() })
  });
  const o = await r.json();
  if (!r.ok) return res.status(502).json({ error: 'Could not start the payment. Try again.' });
  await C('payments').insertOne({ id: Date.now(), orderId: o.id, uid: req.user.id, name: req.user.name, plan: req.body.plan, amount: plan.price, status: 'created', created: now() });
  res.json({ orderId: o.id, amount: o.amount, key: RZP_ID, name: plan.name });
}));
app.post('/api/pay/verify', auth, h(async (req, res) => {
  const { razorpay_order_id: oid, razorpay_payment_id: pid, razorpay_signature: sig } = req.body;
  const expect = crypto.createHmac('sha256', RZP_SECRET || '').update(oid + '|' + pid).digest('hex');
  const pay = await C('payments').findOne({ orderId: oid, uid: req.user.id });
  if (!pay || expect !== sig) return res.status(400).json({ error: 'Payment could not be verified. Contact Alix if money was deducted.' });
  if (pay.status !== 'paid') {
    const base = Math.max(Date.now(), req.user.planUntil ? new Date(req.user.planUntil).getTime() : 0);
    const until = new Date(base + PLANS[pay.plan].days * 864e5).toISOString();
    await C('payments').updateOne({ orderId: oid }, { $set: { status: 'paid', paymentId: pid } });
    await C('users').updateOne({ id: req.user.id }, { $set: { plan: pay.plan, planUntil: until } });
  }
  res.json({ ok: true });
}));

// Admin
app.get('/api/admin/data', auth, admin, h(async (req, res) => {
  const list = n => C(n).find({}, NO_ID).sort({ id: -1 }).toArray();
  res.json({ leads: await list('leads'), posts: await list('posts'), payments: await list('payments'), accounts: await list('accounts'),
    users: (await list('users')).map(pub) });
}));
app.post('/api/admin/posts', auth, admin, h(async (req, res) => {
  const { title, body, public: isPublic } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'Add a title and some text.' });
  await C('posts').insertOne({ id: Date.now(), title, body, public: !!isPublic, created: now() });
  res.json({ ok: true });
}));
app.delete('/api/admin/posts/:id', auth, admin, h(async (req, res) => { await C('posts').deleteOne({ id: +req.params.id }); res.json({ ok: true }); }));
app.delete('/api/admin/leads/:id', auth, admin, h(async (req, res) => { await C('leads').deleteOne({ id: +req.params.id }); res.json({ ok: true }); }));

MongoClient.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017').then(async c => {
  db = c.db(process.env.DB_NAME || 'tradewithalix');
  if (!await C('users').findOne({ role: 'admin' }))
    await C('users').insertOne({ id: Date.now(), name: 'Alix', role: 'admin', created: now(),
      email: (process.env.ADMIN_EMAIL || 'admin@tradewithalix.com').toLowerCase(),
      hash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin12345', 10) });
  const port = process.env.PORT || 3000;
app.use(express.static(__dirname));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
  app.listen(port, () => console.log('tradewithalix running on port ' + port));
}).catch(e => { console.error('Database connection failed:', e.message); process.exit(1); });