"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

interface PackingItem {
  id: string;
  label: string;
  checked: boolean;
}

interface PackingCategory {
  name: string;
  items: PackingItem[];
}

const DEFAULT_CATEGORIES: PackingCategory[] = [
  {
    name: "Clothing",
    items: [
      { id: "c1", label: "T-shirts / tops (3-5)", checked: false },
      { id: "c2", label: "Jeans / shorts", checked: false },
      { id: "c3", label: "Jacket / sweater", checked: false },
      { id: "c4", label: "Undergarments (5-7)", checked: false },
      { id: "c5", label: "Sleepwear", checked: false },
      { id: "c6", label: "Comfortable walking shoes", checked: false },
      { id: "c7", label: "Flip-flops / sandals", checked: false },
    ],
  },
  {
    name: "Toiletries",
    items: [
      { id: "t1", label: "Toothbrush & toothpaste", checked: false },
      { id: "t2", label: "Shampoo & soap", checked: false },
      { id: "t3", label: "Deodorant", checked: false },
      { id: "t4", label: "Sunscreen", checked: false },
      { id: "t5", label: "Insect repellent", checked: false },
      { id: "t6", label: "Tissues / wet wipes", checked: false },
      { id: "t7", label: "Hand sanitizer", checked: false },
    ],
  },
  {
    name: "Electronics",
    items: [
      { id: "e1", label: "Phone & charger", checked: false },
      { id: "e2", label: "Power bank", checked: false },
      { id: "e3", label: "Earphones / headphones", checked: false },
      { id: "e4", label: "Camera (optional)", checked: false },
    ],
  },
  {
    name: "Documents",
    items: [
      { id: "d1", label: "ID card (Aadhaar / PAN / college ID)", checked: false },
      { id: "d2", label: "Train / flight tickets (soft copy)", checked: false },
      { id: "d3", label: "Hotel bookings (soft copy)", checked: false },
      { id: "d4", label: "Travel insurance (if any)", checked: false },
    ],
  },
  {
    name: "Health",
    items: [
      { id: "h1", label: "Basic first-aid kit", checked: false },
      { id: "h2", label: "Personal medications", checked: false },
      { id: "h3", label: "Pain relievers", checked: false },
      { id: "h4", label: "Motion sickness pills", checked: false },
    ],
  },
  {
    name: "Miscellaneous",
    items: [
      { id: "m1", label: "Water bottle", checked: false },
      { id: "m2", label: "Snacks for the journey", checked: false },
      { id: "m3", label: "Small lock", checked: false },
      { id: "m4", label: "Plastic bags (wet / dirty clothes)", checked: false },
      { id: "m5", label: "Notebook & pen", checked: false },
    ],
  },
];

function loadList(): PackingCategory[] {
  try {
    const saved = localStorage.getItem("voyaq:packing");
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return DEFAULT_CATEGORIES.map((c) => ({
    ...c,
    items: c.items.map((i) => ({ ...i })),
  }));
}

export default function PackingList() {
  const [categories, setCategories] = useState<PackingCategory[]>(loadList);

  const save = useCallback((next: PackingCategory[]) => {
    setCategories(next);
    try { localStorage.setItem("voyaq:packing", JSON.stringify(next)); } catch { /* ignore */ }
  }, []);

  function toggle(catIdx: number, itemIdx: number) {
    const next = categories.map((c, ci) =>
      ci !== catIdx
        ? c
        : { ...c, items: c.items.map((i, ii) => (ii !== itemIdx ? i : { ...i, checked: !i.checked })) },
    );
    save(next);
  }

  function resetAll() {
    const reset = categories.map((c) => ({
      ...c,
      items: c.items.map((i) => ({ ...i, checked: false })),
    }));
    save(reset);
  }

  function addCustom(catIdx: number) {
    const label = prompt("Item name:");
    if (!label || !label.trim()) return;
    const next = categories.map((c, ci) =>
      ci !== catIdx
        ? c
        : { ...c, items: [...c.items, { id: `x${Date.now()}`, label: label.trim(), checked: false }] },
    );
    save(next);
  }

  function removeItem(catIdx: number, itemIdx: number) {
    const next = categories.map((c, ci) =>
      ci !== catIdx ? c : { ...c, items: c.items.filter((_, ii) => ii !== itemIdx) },
    );
    save(next);
  }

  const total = categories.reduce((s, c) => s + c.items.length, 0);
  const checked = categories.reduce((s, c) => s + c.items.filter((i) => i.checked).length, 0);
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;

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
          <h1 className="text-2xl font-bold">Packing Checklist</h1>
          <p className="text-ink-muted text-sm">
            {checked} of {total} packed
          </p>
        </div>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="space-y-6">
        {categories.map((cat, ci) => (
          <section key={cat.name}>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-bold">{cat.name}</h2>
              <button
                onClick={() => addCustom(ci)}
                className="flex items-center gap-1 text-xs text-ink-muted hover:text-ink"
              >
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>
            <div className="space-y-1">
              {cat.items.map((item, ii) => (
                <label
                  key={item.id}
                  className="flex cursor-pointer items-center gap-3 rounded-bruted px-3 py-2 transition-colors hover:bg-ink/5"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggle(ci, ii)}
                    className="h-4 w-4 accent-accent"
                  />
                  <span
                    className={`flex-1 text-sm ${item.checked ? "text-ink-muted line-through" : ""}`}
                  >
                    {item.label}
                  </span>
                  <button
                    onClick={(e) => { e.preventDefault(); removeItem(ci, ii); }}
                    className="text-ink-muted hover:text-error"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>

      <button
        onClick={resetAll}
        className="w-full rounded-bruted border-2 border-ink/10 px-4 py-3 text-sm font-medium transition-colors hover:bg-ink/5"
      >
        Reset all
      </button>
    </main>
  );
}
