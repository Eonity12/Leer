// Leer relay: a tiny Cloudflare Worker.
//
// MangaDex does not allow web pages on other domains to call its API directly
// (no CORS) and serves wrong images to hot-linked requests. Its rules say
// third-party apps should send requests through their own server instead.
// This Worker is that server: it forwards GET requests to MangaDex with an
// honest User-Agent and adds the CORS headers your browser needs.
//
// It only accepts requests that come from your Leer site, and only forwards
// them to MangaDex hosts.

// Change this if your Leer site is hosted at a different address.
const ALLOWED_ORIGINS = ['https://eonity12.github.io'];

const USER_AGENT = 'LeerReader/1.0 (personal reading app; https://github.com/Eonity12/Leer)';

const hostOk = (h) =>
  h === 'api.mangadex.org' ||
  h === 'uploads.mangadex.org' ||
  h === 'mangadex.network' ||
  h.endsWith('.mangadex.network');

const cors = (origin, extra = {}) => ({
  'Access-Control-Allow-Origin': origin,
  Vary: 'Origin',
  ...extra,
});

export default {
  async fetch(request) {
    // Browsers send Origin on fetch() and Referer on <img> requests.
    let from = request.headers.get('Origin');
    if (!from) {
      const ref = request.headers.get('Referer');
      if (ref) {
        try { from = new URL(ref).origin; } catch (e) { /* ignore */ }
      }
    }
    if (!from || !ALLOWED_ORIGINS.includes(from)) {
      return new Response('Forbidden', { status: 403 });
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: cors(from, {
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Max-Age': '86400',
        }),
      });
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405, headers: cors(from) });
    }

    let target;
    try {
      target = new URL(new URL(request.url).searchParams.get('url'));
    } catch (e) {
      return new Response('Bad url', { status: 400, headers: cors(from) });
    }
    if (target.protocol !== 'https:' || !hostOk(target.hostname)) {
      return new Response('Host not allowed', { status: 403, headers: cors(from) });
    }

    const isApi = target.hostname === 'api.mangadex.org';
    const upstream = await fetch(target.toString(), {
      method: request.method,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: request.headers.get('Accept') || '*/*',
      },
      cf: isApi ? {} : { cacheEverything: true, cacheTtl: 86400 },
    });

    const headers = new Headers(upstream.headers);
    headers.delete('set-cookie');
    for (const [k, v] of Object.entries(cors(from, { 'Access-Control-Expose-Headers': '*' }))) {
      headers.set(k, v);
    }
    if (!isApi) headers.set('Cache-Control', 'public, max-age=86400');

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers,
    });
  },
};
