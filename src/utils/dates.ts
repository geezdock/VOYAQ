export function getCountdown(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, expired: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    expired: false,
  };
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getDays(start: string, end: string) {
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)) + 1;
}
