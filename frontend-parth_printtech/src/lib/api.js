export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://updatedparthprinttech.onrender.com/api';

export async function fetchHomeData() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${API_BASE}/home`, {
      signal: controller.signal,
      next: { revalidate: 0 } // Always fresh or fallback
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    // Graceful fallback to static defaults if backend offline
    return null;
  }
}
