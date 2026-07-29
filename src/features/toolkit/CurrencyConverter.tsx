"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { formatRupee } from "@/utils/currency";

interface Rates {
  [code: string]: number;
}

const CURRENCIES = [
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "GBP", label: "British Pound", symbol: "£" },
  { code: "AED", label: "UAE Dirham", symbol: "د.إ" },
  { code: "THB", label: "Thai Baht", symbol: "฿" },
  { code: "SGD", label: "Singapore Dollar", symbol: "S$" },
  { code: "MYR", label: "Malaysian Ringgit", symbol: "RM" },
  { code: "JPY", label: "Japanese Yen", symbol: "¥" },
  { code: "AUD", label: "Australian Dollar", symbol: "A$" },
  { code: "CAD", label: "Canadian Dollar", symbol: "C$" },
  { code: "CHF", label: "Swiss Franc", symbol: "Fr" },
  { code: "NPR", label: "Nepalese Rupee", symbol: "रु" },
  { code: "LKR", label: "Sri Lankan Rupee", symbol: "Rs" },
  { code: "IDR", label: "Indonesian Rupiah", symbol: "Rp" },
  { code: "VND", label: "Vietnamese Dong", symbol: "₫" },
];

const FALLBACK_RATES: Rates = {
  USD: 0.012, EUR: 0.011, GBP: 0.0095, AED: 0.044,
  THB: 0.43, SGD: 0.016, MYR: 0.056, JPY: 1.83,
  AUD: 0.018, CAD: 0.016, CHF: 0.011, NPR: 1.60,
  LKR: 3.60, IDR: 190, VND: 300,
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("1000");
  const [from, setFrom] = useState("INR");
  const [to, setTo] = useState("USD");
  const [rates, setRates] = useState<Rates>(FALLBACK_RATES);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.exchangerate-api.com/v4/latest/INR");
      if (res.ok) {
        const data = await res.json();
        setRates(data.rates);
        setLastUpdated(new Date().toLocaleTimeString("en-IN"));
      }
    } catch { /* keep fallback rates */ } finally {
      setLoading(false);
    }
  }, []);

  const rate = rates ? rates[to] : null;
  const baseRate = from === "INR" ? 1 : (rates ? rates[from] : null);
  const result = rate && baseRate && amount
    ? parseFloat(amount) * (rate / baseRate)
    : null;

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link
          href="/toolkit"
          className="flex h-10 w-10 items-center justify-center rounded-bruted border-2 border-ink/10 transition-colors hover:bg-ink/5"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Currency Converter</h1>
          <p className="text-ink-muted text-sm">
            {lastUpdated
              ? `Rates updated at ${lastUpdated}`
              : loading
                ? "Fetching live rates..."
                : "Using cached rates"}
          </p>
        </div>
        <button
          onClick={fetchRates}
          disabled={loading}
          className="ml-auto flex items-center gap-1 rounded-bruted border-2 border-ink/10 px-3 py-1.5 text-sm transition-colors hover:bg-ink/5 disabled:opacity-40"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="space-y-4 rounded-bruted border-2 border-ink/10 bg-surface-card p-6">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-muted">Amount</label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-bruted border-2 border-ink/10 bg-surface px-4 py-3 text-lg font-bold outline-none focus:border-accent"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">From</label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-bruted border-2 border-ink/10 bg-surface px-3 py-2.5 text-sm outline-none focus:border-accent"
            >
              <option value="INR">INR — Indian Rupee</option>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.code} — {c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">To</label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-bruted border-2 border-ink/10 bg-surface px-3 py-2.5 text-sm outline-none focus:border-accent"
            >
              <option value="INR">INR — Indian Rupee</option>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.code} — {c.label}</option>
              ))}
            </select>
          </div>
        </div>

        {result !== null && (
          <div className="rounded-bruted bg-accent/5 p-4 text-center">
            <div className="text-xs text-ink-muted">Converted amount</div>
            <div className="text-2xl font-bold">
              {formatRupee(Math.round(result * 100) / 100)}
            </div>
            <div className="text-xs text-ink-muted">
              {amount} {from} → {to}
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs text-ink-muted">
              <th className="pb-2 font-medium">Currency</th>
              <th className="pb-2 font-medium">Code</th>
              <th className="pb-2 text-right font-medium">1 INR →</th>
            </tr>
          </thead>
          <tbody>
            {CURRENCIES.slice(0, 8).map((c) => (
              <tr key={c.code} className="border-b border-ink/5">
                <td className="py-2">{c.symbol} {c.label}</td>
                <td className="py-2 text-ink-muted">{c.code}</td>
                <td className="py-2 text-right font-mono">
                  {(rates[c.code] || 0).toFixed(4)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
