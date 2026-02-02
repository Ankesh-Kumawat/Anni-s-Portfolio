/**
 * 🔥 Central API Client - NO CACHE, ALWAYS FRESH
 * Use this instead of direct fetch() calls
 */
export async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(`${url}?_ts=${Date.now()}`, {
    credentials: "include",
    cache: "no-store",
    headers: {
      "Cache-Control": "no-store",
      "Pragma": "no-cache",
    },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
