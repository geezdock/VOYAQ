"use client";

import { useSquad } from "@/shared/providers/SquadContext";
import { Toast } from "./Toast";

export function GlobalToast() {
  const { toast, dismissToast } = useSquad();
  return <Toast message={toast} onDismiss={dismissToast} />;
}
