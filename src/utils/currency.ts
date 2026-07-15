export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatRupee(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
