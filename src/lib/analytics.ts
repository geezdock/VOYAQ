/**
 * VOYAQ Analytics — central event constants and safe tracking helper.
 * All posthog calls should go through trackEvent() so event names stay consistent
 * and the function is a safe no-op when PostHog is not initialised (CI / no key).
 */

export const VOYAQ_EVENTS = {
  // Squad lifecycle
  SQUAD_CREATED: "squad_created",
  INVITE_SENT: "invite_sent",
  INVITE_ACCEPTED: "invite_accepted",

  // Planning funnel
  DESTINATION_LOCKED: "destination_locked",
  BUDGET_LOCKED: "budget_locked",
  DATES_LOCKED: "dates_locked",
  TRIP_READY: "trip_ready",

  // AI & features
  AI_ITINERARY_GENERATED: "ai_itinerary_generated",
  BUDGET_ALLOCATION_VIEWED: "budget_allocation_viewed",

  // Toolkit actions
  TOOLKIT_BOOKING_CLICKED: "toolkit_booking_clicked",
  TOOLKIT_PDF_DOWNLOADED: "toolkit_pdf_downloaded",
  TOOLKIT_QR_OPENED: "toolkit_qr_opened",
  TOOLKIT_EXPENSE_LOGGED: "toolkit_expense_logged",
} as const;

export type VoyaqEvent = (typeof VOYAQ_EVENTS)[keyof typeof VOYAQ_EVENTS];

/**
 * Safe wrapper around posthog.capture.
 * No-ops if PostHog is not loaded (e.g. key missing, SSR, test env).
 */
export function trackEvent(
  event: VoyaqEvent | string,
  properties?: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ph = (window as any).posthog;
    if (ph && typeof ph.capture === "function" && ph.__loaded) {
      ph.capture(event, properties);
    }
  } catch {
    // Never let analytics break the app
  }
}
