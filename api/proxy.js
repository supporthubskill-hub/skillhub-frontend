const PRODUCTION_BACKEND = 'https://skillhub-backend-b5iy.onrender.com';
const BLOCK8_BACKEND = 'https://zeqviro-block8-backend.onrender.com';

module.exports = async function handler(req, res) {
  try {
    const rawPath = String(req.query?.path || '').replace(/^\/+/, '');
    if (!rawPath) return res.status(400).json({ error: 'Ruta de API no válida.' });

    // Block 8 branch previews must use the isolated sandbox backend so payment
    // routes, Stripe test configuration and the staging database stay separate
    // from production. Production deployments continue using the production API.
    const isPreview = process.env.VERCEL_ENV === 'preview';
    const BACKEND = isPreview ? BLOCK8_BACKEND : PRODUCTION_BACKEND;

    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(req.query || {})) {
      if (key === 'path') continue;
      if (Array.isArray(value)) value.forEach(v => query.append(key, String(v)));
      else if (value !== undefined) query.set(key, String(value));
    }

    const target = `${BACKEND}/api/${rawPath}${query.toString() ? `?${query}` : ''}`;
    const headers = { accept: req.headers.accept || 'application/json' };
    if (req.headers.authorization) headers.authorization = req.headers.authorization;
    if (req.headers['content-type']) headers['content-type'] = req.headers['content-type'];

    const init = { method: req.method, headers, redirect: 'manual' };
    if (!['GET', 'HEAD'].includes(req.method)) {
      if (Buffer.isBuffer(req.body) || typeof req.body === 'string') init.body = req.body;
      else if (req.body !== undefined) init.body = JSON.stringify(req.body);
    }

    const upstream = await fetch(target, init);
    const text = await upstream.text();
    const contentType = upstream.headers.get('content-type') || 'application/json; charset=utf-8';
    res.setHeader('content-type', contentType);
    res.setHeader('x-zeqviro-backend', isPreview ? 'block8-staging' : 'production');
    const retryAfter = upstream.headers.get('retry-after');
    if (retryAfter) res.setHeader('retry-after', retryAfter);
    return res.status(upstream.status).send(text);
  } catch (error) {
    console.error('Zeqviro API proxy failed:', error);
    return res.status(502).json({ error: 'No se pudo conectar con el servidor de Zeqviro.' });
  }
};
