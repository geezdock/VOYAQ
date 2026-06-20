"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface AccordionItemProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function AccordionItem({ title, isOpen, onToggle, children }: AccordionItemProps) {
  return (
    <div className="border-[2px] border-ink rounded-[12px] overflow-hidden bg-white">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-surface-alt/50 transition-colors"
      >
        <span className="font-display text-base sm:text-lg font-extrabold text-ink uppercase tracking-tight">
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 ml-3"
        >
          <ChevronDown className="w-5 h-5 text-ink-muted" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-ink/10">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Accordion({ children }: { children: React.ReactNode }) {
  const [openIndex, setOpenIndex] = useState(0);

  const items = Array.isArray(children) ? children : [children];

  return (
    <div className="space-y-3">
      {items.map((child, i) => {
        if (!child || typeof child !== "object" || !("props" in child)) return null;
        const item = child as React.ReactElement<{ title?: string }>;
        const title = item.props?.title || `Section ${i + 1}`;
        return (
          <AccordionItem
            key={i}
            title={title}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
          >
            {child}
          </AccordionItem>
        );
      })}
    </div>
  );
}
