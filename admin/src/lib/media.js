export function getMediaUrl(src) {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  if (src.startsWith('/uploads/')) return `http://localhost:5000${src}`;
  return src;
}
