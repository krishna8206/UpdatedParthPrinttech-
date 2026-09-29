const BACKEND_BASE = (
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/api\/?$/, '') ||
  'https://updatedparthprinttech.onrender.com'
).replace(/\/$/, '');

/**
 * Normalizes an image or video URL:
 * - Rewrites any legacy 'http://localhost:5000' URLs
 * - Leaves Cloudinary & external URLs intact (https://...)
 * - Serves bundled '/uploads/...' directly from frontend public assets for instant loading
 * - Leaves local static assets ('/videos/...', '/images/...', '/logo/...') intact
 */
export function getMediaUrl(src, fallback = '') {
  if (!src || typeof src !== 'string' || !src.trim()) return fallback;
  const clean = src.trim();

  // 1. Cloudinary or absolute external URLs: return as-is
  if (clean.startsWith('https://') || (clean.startsWith('http://') && !clean.includes('localhost:5000'))) {
    return clean;
  }

  // 2. Normalize any legacy localhost:5000 paths to relative paths
  if (clean.includes('localhost:5000/uploads/')) {
    return clean.replace(/https?:\/\/localhost:5000/gi, '');
  }

  // 3. Relative uploads: served directly from public/uploads with zero latency
  if (clean.startsWith('/uploads/')) {
    return clean;
  }

  return clean;
}

export function getBackendBase() {
  return BACKEND_BASE;
}

