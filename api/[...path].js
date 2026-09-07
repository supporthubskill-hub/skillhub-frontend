const BACKEND = 'https://skillhub-backend-b5iy.onrender.com';

module.exports = async function handler(req, res) {
  try {
    // Vercel may expose the catch-all parameter as `path`, or only through
    // req.url depending on the runtime/routing layer. Support both so
    // /api/auth/login always reaches the matching backend endpoint.
    let rawPath = Array.isArray(req.query?.path)
      ? req.query.path.join('/')
      : String(req.query?.path || '').replace(/^\/+/, '');

    if (!rawPath) {
      const pathname = String(req.url || '').split('?')[0];
      rawPath = pathname.replace(/^\/api\//, '').replace(/^\/+/, '');
    }

    if (!rawPath) {
      return res.status(400).json({ error: 'Ruta de API no válida.' });
    }

    const target = `${BACKEND}/api/${rawPath}`;
    const headers = { accept: 'application/json' };
    if (req.headers.authorization) headers.authorization = req.headers.authorization;
    if (req.headers['content-type']) headers['content-type'] = req.headers['content-type'];

    const init = { method: req.method, headers, redirect: 'manual' };
    if (!['GET', 'HEAD'].includes(req.method)) {
      if (typeof req.body === 'string' || Buffer.isBuffer(req.body)) init.body = req.body;
      else if (req.body !== undefined) init.body = JSON.stringify(req.body);
    }

    const upstream = await fetch(target, init);
    const contentType = upstream.headers.get('content-type') || 'application/json; charset=utf-8';
    const text = await upstream.text();

    res.setHeader('content-type', contentType);
    const retryAfter = upstream.headers.get('retry-after');
    if (retryAfter) res.setHeader('retry-after', retryAfter);
    return res.status(upstream.status).send(text);
  } catch (error) {
    console.error('Zeqviro preview API proxy failed:', error);
    return res.status(502).json({ error: 'No se pudo conectar con el servidor de Zeqviro.' });
  }
};
