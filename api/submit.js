const ZAPIER_WEBHOOK = 'https://hooks.zapier.com/hooks/catch/1070512/bd390qk/';

const ALLOWED_ORIGINS = [
  'https://korolov.lasertips.co.il',
  'https://lp.lasertips.co.il',
];

export default async function handler(req, res) {
  const origin = req.headers.origin || '';

  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const { recaptcha_token, ...formData } = req.body;

  const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: recaptcha_token || '',
    }),
  });
  const verifyData = await verifyRes.json();

  if (!verifyData.success || verifyData.score < 0.5) {
    return res.status(400).json({ ok: false, error: 'reCAPTCHA verification failed' });
  }

  await fetch(ZAPIER_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  return res.status(200).json({ ok: true });
}
