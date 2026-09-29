const BACKEND_BASE = (
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/api\/?$/, '') ||
  'https://updatedparthprinttech.onrender.com'
).replace(/\/$/, '');

export function getMediaUrl(src, fallback = '') {
  if (!src || typeof src !== 'string' || !src.trim()) return fallback;
  const clean = src.trim();

  // 1. Cloudinary or absolute external URLs
  if (clean.startsWith('https://') || (clean.startsWith('http://') && !clean.includes('localhost:5000'))) {
    return clean;
  }

  // 2. Normalize localhost:5000 to backend base
  if (clean.includes('localhost:5000')) {
    return clean.replace(/https?:\/\/localhost:5000/gi, BACKEND_BASE);
  }

  // 3. Relative uploads: prefix with backend base
  if (clean.startsWith('/uploads/')) {
    return `${BACKEND_BASE}${clean}`;
  }

  return clean;
}

export function getBackendBase() {
  return BACKEND_BASE;
}

