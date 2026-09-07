const BACKEND = 'https://skillhub-backend-b5iy.onrender.com';

module.exports = async function handler(req, res) {
  try {
    const rawPath = Array.isArray(req.query.path) ? req.query.path.join('/') : String(req.query.path || '');
    const target = `${BACKEND}/api/${rawPath}`;

    const headers = {};
    if (req.headers.authorization) headers.authorization = req.headers.authorization;
    if (req.headers['content-type']) headers['content-type'] = req.headers['content-type'];
    if (req.headers.accept) headers.accept = req.headers.accept;

    const init = {
      method: req.method,
      headers,
      redirect: 'manual'
    };

    if (!['GET', 'HEAD'].includes(req.method)) {
      if (typeof req.body === 'string' || Buffer.isBuffer(req.body)) init.body = req.body;
      else if (req.body !== undefined) init.body = JSON.stringify(req.body);
    }

    const upstream = await fetch(target, init);
    const body = Buffer.from(await upstream.arrayBuffer());

    const contentType = upstream.headers.get('content-type');
    if (contentType) res.setHeader('content-type', contentType);
    const retryAfter = upstream.headers.get('retry-after');
    if (retryAfter) res.setHeader('retry-after', retryAfter);

    res.status(upstream.status).send(body);
  } catch (error) {
    console.error('Zeqviro preview API proxy failed:', error);
    res.status(502).json({ error: 'No se pudo conectar con el servidor de Zeqviro.' });
  }
};
