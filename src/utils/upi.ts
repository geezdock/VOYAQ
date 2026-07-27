export function buildUPIUrl(pa: string, name?: string, amount?: number, note?: string): string {
  const params = new URLSearchParams({ pa });
  if (name) params.set("pn", name);
  if (amount) params.set("am", amount.toFixed(2));
  if (note) params.set("tn", note);
  params.set("cu", "INR");
  return `upi://pay?${params.toString()}`;
}
