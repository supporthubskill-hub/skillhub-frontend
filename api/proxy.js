const BACKEND = 'https://skillhub-backend-b5iy.onrender.com';

module.exports = async function handler(req, res) {
  try {
    const rawPath = String(req.query?.path || '').replace(/^\/+/, '');
    if (!rawPath) return res.status(400).json({ error: 'Ruta de API no válida.' });

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
    const retryAfter = upstream.headers.get('retry-after');
    if (retryAfter) res.setHeader('retry-after', retryAfter);
    return res.status(upstream.status).send(text);
  } catch (error) {
    console.error('Zeqviro preview API proxy failed:', error);
    return res.status(502).json({ error: 'No se pudo conectar con el servidor de Zeqviro.' });
  }
};
