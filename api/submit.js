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

  await fetch(ZAPIER_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
  });

  return res.status(200).json({ ok: true });
}
