import { Redis } from "@upstash/redis";

const store = new Map<string, { data: unknown; expires: number }>();

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis !== null) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    try {
      redis = new Redis({ url, token });
    } catch {
      redis = null;
    }
  }
  return redis;
}

export async function memo<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const client = getRedis();
  if (client) {
    const cached = await client.get<T>(key);
    if (cached !== null) return cached;
    const data = await fetcher();
    await client.set(key, data, { ex: Math.ceil(ttlMs / 1000) });
    return data;
  }

  const cached = store.get(key);
  if (cached && Date.now() < cached.expires) {
    return cached.data as T;
  }
  const data = await fetcher();
  store.set(key, { data, expires: Date.now() + ttlMs });
  return data;
}
