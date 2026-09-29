export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://updatedparthprinttech.onrender.com/api';

export async function fetchHomeData() {
  const tryFetch = async (timeoutMs) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(`${API_BASE}/home`, {
        signal: controller.signal,
        next: { revalidate: 0 },
        headers: { 'Accept': 'application/json' }
      });
      clearTimeout(timeoutId);

      if (!res.ok) return null;
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      return null;
    }
  };

  // First attempt with 45s timeout to handle Render cold-starts
  let data = await tryFetch(45000);
  if (!data) {
    // Quick retry attempt
    data = await tryFetch(10000);
  }
  return data;
}

