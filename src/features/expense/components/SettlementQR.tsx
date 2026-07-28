"use client";

import { useEffect, useRef, useState } from "react";
import { Smartphone, X } from "lucide-react";
import { motion } from "framer-motion";
import { buildUPIUrl } from "@/utils/upi";
import { formatRupee } from "@/utils/currency";
import { trackEvent, VOYAQ_EVENTS } from "@/lib/analytics";
import type { SquadMember } from "@/types/squad";
import type { Settlement } from "@/types/expense";

interface SettlementQRProps {
  settlement: Settlement;
  fromMember: SquadMember;
  toMember: SquadMember;
}

export function SettlementQR({ settlement, fromMember, toMember }: SettlementQRProps) {
  const [showQR, setShowQR] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const upiUrl = toMember.upiId
    ? buildUPIUrl(toMember.upiId, toMember.name, settlement.amount, `Settlement from ${fromMember.name}`)
    : null;

  const [qrError, setQrError] = useState(false);

  useEffect(() => {
    if (!showQR || !canvasRef.current || !upiUrl) return;
    setQrError(false);
    let cancelled = false;
    async function render() {
      try {
        const QRCode = (await import("qrcode")).default;
        if (cancelled || !canvasRef.current) return;
        await QRCode.toCanvas(canvasRef.current, upiUrl!, {
          width: 200,
          margin: 2,
          color: { dark: "#2D2A24", light: "#FFFFFF" },
        });
      } catch {
        if (!cancelled) setQrError(true);
      }
    }
    render();
    return () => { cancelled = true; };
  }, [showQR, upiUrl]);

  if (!upiUrl) return null;

  return (
    <>
      <button
        onClick={() => {
          setShowQR(true);
          trackEvent(VOYAQ_EVENTS.TOOLKIT_QR_OPENED, {
            to: toMember.name,
            amount: settlement.amount,
          });
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-bruted border-2 border-accent/30 text-accent font-mono text-[10px] font-bold hover:bg-accent/5 transition-colors min-h-[44px]"
        title={`Pay ${toMember.name} via UPI`}
      >
        <Smartphone className="w-3.5 h-3.5" />
        Pay
      </button>

      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="brut-card w-full max-w-xs text-center"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-sm font-bold text-ink uppercase tracking-wider">
                Pay {toMember.name}
              </h3>
              <button
                onClick={() => setShowQR(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-bruted text-ink-muted hover:text-ink hover:bg-ink/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {qrError ? (
              <div className="w-[200px] h-[200px] mx-auto rounded-[8px] bg-ink/5 flex items-center justify-center">
                <p className="font-mono text-xs text-ink-muted">Failed to generate QR code</p>
              </div>
            ) : (
              <canvas ref={canvasRef} className="mx-auto rounded-[8px]" />
            )}

            <p className="font-heading text-lg font-bold text-ink mt-3">
              {formatRupee(settlement.amount)}
            </p>
            <p className="font-mono text-xs text-ink-muted mt-0.5">
              {fromMember.name} → {toMember.name}
            </p>

            <a
              href={upiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="brut-btn text-xs px-4 py-2 mt-4 inline-flex items-center gap-1.5 min-h-[44px]"
            >
              <Smartphone className="w-3.5 h-3.5" />
              Open UPI App
            </a>
          </motion.div>
        </div>
      )}
    </>
  );
}
