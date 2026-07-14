"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function useAuthSteps() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") ?? "get-started";

  function handleComplete(username: string) {
    if (mode === "login") {
      router.push("/dashboard");
    } else {
      router.push("/dashboard");
    }
  }

  return { mode, handleComplete };
}
