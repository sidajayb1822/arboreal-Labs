// Copies each contact form lead into the Batcave CRM (Supabase). Runs on the server only, so the
// secret never reaches the browser. The email still goes out from the contact page as before;
// nothing here can stop it, and the visitor never sees a CRM error.

const CRM_URL = 'https://zzvqhgvbcbtbmmqxbqla.supabase.co/rest/v1/rpc/submit_website_lead';
const CRM_KEY = 'sb_publishable_SAr0-xAssGDCbkwLuMbTyg_vL7IZXL4'; // publishable key, safe to ship
const TIMEOUT_MS = 5000;
const INTERESTS = ['Custom Solutions', 'Something from our work', 'Web Development', 'General Consultation'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }

  // Every outcome below answers the same way: the visitor's page never depends on the CRM
  const done = () => res.status(202).json({ ok: true });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  if (!body || typeof body !== 'object') return done();

  // Honeypot: people never see this field, so anything in it means a bot
  if (clean(body.website, 200)) return done();

  const name = clean(body.name, 100);
  const email = clean(body.email, 254);
  if (!name || !EMAIL_RE.test(email)) return done();

  const secret = process.env.BATCAVE_LEAD_SECRET;
  if (!secret) {
    console.warn('[lead] BATCAVE_LEAD_SECRET is not set; skipping CRM');
    return done();
  }

  // The form's option values differ in capitalisation; send the CRM its exact list values
  const rawInterest = clean(body.interest, 60).toLowerCase();
  const interest = INTERESTS.find(i => i.toLowerCase() === rawInterest) || null;
  const message = clean(body.message, 2000) || null;
  const ip = clean(String(req.headers['x-forwarded-for'] || '').split(',')[0], 64) || null;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(CRM_URL, {
      method: 'POST',
      headers: { apikey: CRM_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        p_secret: secret,
        p_name: name,
        p_company: clean(body.company, 150),
        p_email: email,
        p_phone: clean(body.phone, 25),
        p_interest: interest,
        p_message: message,
        p_client_ip: ip,
      }),
      signal: ctrl.signal,
    });
    const out = await r.json().catch(() => null);
    if (!r.ok || !out || out.ok !== true) {
      // log only the status and error code, never the lead's details or the secret
      console.error('[lead] CRM rejected lead:', r.status, (out && out.error) || 'no_error_code');
    }
  } catch (err) {
    console.error('[lead] CRM request failed:', err.name === 'AbortError' ? 'timeout' : err.message);
  } finally {
    clearTimeout(timer);
  }
  return done();
};
