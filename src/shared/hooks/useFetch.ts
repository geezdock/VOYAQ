import { useState, useEffect, useCallback, useRef } from "react";

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
  const fetcherRef = useRef(fetcher);
  const cancelledRef = useRef(false);

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const run = useCallback(() => {
    cancelledRef.current = false;
    setLoading(true);
    setError(null);
    fetcherRef
      .current()
      .then((result) => {
        if (cancelledRef.current) return;
        if (result === null) {
          setError("Failed to load data");
        } else {
          setData(result);
          setError(null);
        }
      })
      .catch(() => {
        if (cancelledRef.current) return;
        setError("Failed to load data");
      })
      .finally(() => {
        if (!cancelledRef.current) setLoading(false);
      });
  }, []);

  useEffect(() => {
    Promise.resolve().then(run);
    return () => { cancelledRef.current = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, retry: run };
}
