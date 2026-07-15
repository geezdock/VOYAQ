import { describe, it, expect, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useFetch } from "../useFetch";

describe("useFetch", () => {
  it("starts in loading state", () => {
    const fetcher = vi.fn(() => Promise.resolve(["item"]));
    const { result } = renderHook(() => useFetch(fetcher, []));
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("sets data on successful fetch", async () => {
    const fetcher = vi.fn(() => Promise.resolve(["item1", "item2"]));
    const { result } = renderHook(() => useFetch<string[]>(fetcher, []));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(["item1", "item2"]);
    expect(result.current.error).toBeNull();
  });

  it("sets error when fetcher returns null", async () => {
    const fetcher = vi.fn(() => Promise.resolve(null));
    const { result } = renderHook(() => useFetch(fetcher, []));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Failed to load data");
  });

  it("retry re-fetches data", async () => {
    let callCount = 0;
    const fetcher = vi.fn(() => {
      callCount++;
      return Promise.resolve(callCount === 1 ? null : ["data"]);
    });
    const { result } = renderHook(() => useFetch<string[]>(fetcher, []));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("Failed to load data");
    act(() => { result.current.retry(); });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(["data"]);
    expect(result.current.error).toBeNull();
  });
});