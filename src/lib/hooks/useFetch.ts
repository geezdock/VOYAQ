import { useState, useEffect } from "react";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useFetch<T>(
  fetcher: () => Promise<T | null>,
  deps: unknown[],
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetcher().then((result) => {
      if (cancelled) return;
      setLoading(false);
      if (result === null) {
        setError("Failed to load data");
      } else {
        setData(result);
        setError(null);
      }
    });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  function retry() {
    setLoading(true);
    setError(null);
    fetcher().then((result) => {
      if (result === null) {
        setError("Failed to load data");
      } else {
        setData(result);
        setError(null);
      }
      setLoading(false);
    });
  }

  return { data, loading, error, retry };
}