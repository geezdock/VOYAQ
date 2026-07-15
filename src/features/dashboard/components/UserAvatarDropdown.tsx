"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut } from "lucide-react";

export function UserAvatarDropdown() {
  const [open, setOpen] = useState(false);
  const [username] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("voyaq_username") || "";
    }
    return "";
  });
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const initial = username ? username[0].toUpperCase() : "U";

  const items = [
    {
      label: "Profile",
      icon: User,
      action: () => router.push("/profile"),
    },
    {
      label: "Settings",
      icon: Settings,
      action: () => router.push("/settings"),
    },
    {
      label: "Sign Out",
      icon: LogOut,
      action: () => {
        sessionStorage.removeItem("voyaq_username");
        router.push("/");
      },
    },
  ];

  return (
    <div ref={ref} className="relative flex items-center gap-2">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-11 h-11 rounded-bruted border-2 border-ink bg-peach flex items-center justify-center font-display font-bold text-ink text-lg hover:shadow-bruted-sm transition-shadow"
        aria-label="User menu"
      >
        {initial}
      </button>
      {username && (
        <span className="font-heading text-sm font-semibold text-ink hidden sm:block">
          @{username}
        </span>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-12 w-48 brut-card !p-1 !shadow-bruted-sm z-50"
          >
            {items.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setOpen(false);
                  item.action();
                }}
                className="w-full flex items-center gap-3 px-3 py-3 min-h-[44px] rounded-bruted font-heading text-sm text-ink hover:bg-surface-alt transition-colors text-left"
              >
                <item.icon className="w-4 h-4 text-ink-muted shrink-0" />
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
