export function formatRupee(n: number | null | undefined) {
  if (n == null || isNaN(n)) return "—";
  return `₹${n.toLocaleString("en-IN")}`;
}
