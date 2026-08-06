export function wmoToCondition(code: number): string {
  if (code === 0 || code === 1) return "Sunny";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Cloudy";
  if (code >= 45 && code <= 48) return "Foggy";
  if ((code >= 51 && code <= 55) || code === 56 || code === 57) return "Light Rain";
  if ((code >= 61 && code <= 65) || code === 66 || code === 67) return "Showers";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Showers";
  if (code >= 85 && code <= 86) return "Snow";
  if (code >= 95 && code <= 99) return "Thunderstorms";
  return "Sunny";
}