const BACKEND_BASE = (
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/api\/?$/, '') ||
  'https://updatedparthprinttech.onrender.com'
).replace(/\/$/, '');

/**
 * Normalizes an image or video URL:
 * - Rewrites any legacy 'http://localhost:5000' URLs to the live backend URL
 * - Prefixes relative '/uploads/...' paths with the live backend base
 * - Leaves local static assets ('/videos/...', '/images/...', '/logo/...') intact
 * - Leaves absolute external URLs (https://...) intact
 */
export function getMediaUrl(src, fallback = '') {
  if (!src || typeof src !== 'string' || !src.trim()) return fallback;
  const clean = src.trim();

  if (clean.includes('localhost:5000')) {
    return clean.replace(/https?:\/\/localhost:5000/gi, BACKEND_BASE);
  }

  if (clean.startsWith('/uploads/')) {
    return `${BACKEND_BASE}${clean}`;
  }

  return clean;
}

export function getBackendBase() {
  return BACKEND_BASE;
}
