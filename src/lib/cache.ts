const store = new Map<string, { data: unknown; expires: number }>();

export function memo<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const cached = store.get(key);
  if (cached && Date.now() < cached.expires) {
    return Promise.resolve(cached.data as T);
  }
  return fetcher().then((data) => {
    store.set(key, { data, expires: Date.now() + ttlMs });
    return data;
  });
}

export function clearCache() {
  store.clear();
}
