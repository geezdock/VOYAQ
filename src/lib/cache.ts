const store = new Map<string, { data: unknown; expires: number }>();

export async function memo<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const cached = store.get(key);
  if (cached && Date.now() < cached.expires) {
    return cached.data as T;
  }
  const data = await fetcher();
  store.set(key, { data, expires: Date.now() + ttlMs });
  return data;
}