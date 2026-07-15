import { AuthFlow } from "@/features/auth/components/AuthFlow";

import { Suspense } from "react";

export default function AuthPage() {
  return (
    <Suspense>
      <AuthFlow />
    </Suspense>
  );
}
