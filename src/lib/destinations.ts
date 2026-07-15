export interface DestinationCoords {
  lat: number;
  lon: number;
  state: string;
}

export const DESTINATION_COORDS: Record<string, DestinationCoords> = {
  goa: { lat: 15.4909, lon: 73.8278, state: "Goa" },
  "north goa": { lat: 15.6, lon: 73.75, state: "Goa" },
  "south goa": { lat: 15.15, lon: 74.0, state: "Goa" },
  manali: { lat: 32.2396, lon: 77.1887, state: "Himachal Pradesh" },
  kasol: { lat: 32.0105, lon: 77.3148, state: "Himachal Pradesh" },
  tosh: { lat: 32.0, lon: 77.35, state: "Himachal Pradesh" },
  shimla: { lat: 31.1048, lon: 77.1734, state: "Himachal Pradesh" },
  dharamshala: { lat: 32.219, lon: 76.3234, state: "Himachal Pradesh" },
  mcleodganj: { lat: 32.2428, lon: 76.3246, state: "Himachal Pradesh" },
  bir: { lat: 32.0444, lon: 76.7187, state: "Himachal Pradesh" },
  leh: { lat: 34.1526, lon: 77.5771, state: "Ladakh" },
  "srinagar": { lat: 34.0837, lon: 74.7973, state: "Jammu & Kashmir" },
  "gulmarg": { lat: 34.0509, lon: 74.3801, state: "Jammu & Kashmir" },
  rishikesh: { lat: 30.0869, lon: 78.2676, state: "Uttarakhand" },
  "haridwar": { lat: 29.9457, lon: 78.1642, state: "Uttarakhand" },
  "nainital": { lat: 29.3819, lon: 79.4631, state: "Uttarakhand" },
  dehradun: { lat: 30.3165, lon: 78.0322, state: "Uttarakhand" },
  "auli": { lat: 30.5333, lon: 79.5667, state: "Uttarakhand" },
  jaipur: { lat: 26.9124, lon: 75.7873, state: "Rajasthan" },
  jodhpur: { lat: 26.2389, lon: 73.0243, state: "Rajasthan" },
  udaipur: { lat: 24.5854, lon: 73.7125, state: "Rajasthan" },
  jaisalmer: { lat: 26.9116, lon: 70.9228, state: "Rajasthan" },
  "pushkar": { lat: 26.4907, lon: 74.551, state: "Rajasthan" },
  agra: { lat: 27.1767, lon: 78.0081, state: "Uttar Pradesh" },
  varanasi: { lat: 25.3176, lon: 82.9739, state: "Uttar Pradesh" },
  delhi: { lat: 28.7041, lon: 77.1025, state: "Delhi" },
  mumbai: { lat: 19.076, lon: 72.8777, state: "Maharashtra" },
  pune: { lat: 18.5204, lon: 73.8567, state: "Maharashtra" },
  lonavala: { lat: 18.748, lon: 73.4033, state: "Maharashtra" },
  "mahabaleshwar": { lat: 17.9316, lon: 73.6499, state: "Maharashtra" },
  bangalore: { lat: 12.9716, lon: 77.5946, state: "Karnataka" },
  mysore: { lat: 12.2958, lon: 76.6394, state: "Karnataka" },
  coorg: { lat: 12.3375, lon: 75.8069, state: "Karnataka" },
  "gokarna": { lat: 14.5471, lon: 74.3196, state: "Karnataka" },
  "hampi": { lat: 15.335, lon: 76.4603, state: "Karnataka" },
  chennai: { lat: 13.0827, lon: 80.2707, state: "Tamil Nadu" },
  "ooty": { lat: 11.4102, lon: 76.695, state: "Tamil Nadu" },
  "kodaikanal": { lat: 10.2381, lon: 77.4892, state: "Tamil Nadu" },
  "pondicherry": { lat: 11.9416, lon: 79.8083, state: "Puducherry" },
  kerala: { lat: 10.8505, lon: 76.2711, state: "Kerala" },
  munnar: { lat: 10.0889, lon: 77.0595, state: "Kerala" },
  alleppey: { lat: 9.4981, lon: 76.3388, state: "Kerala" },
  "kochi": { lat: 9.9312, lon: 76.2673, state: "Kerala" },
  wayanad: { lat: 11.6854, lon: 76.132, state: "Kerala" },
  kolkata: { lat: 22.5726, lon: 88.3639, state: "West Bengal" },
  "darjeeling": { lat: 27.041, lon: 88.2663, state: "West Bengal" },
  gangtok: { lat: 27.3314, lon: 88.6138, state: "Sikkim" },
  "shillong": { lat: 25.5788, lon: 91.8933, state: "Meghalaya" },
  guwahati: { lat: 26.1445, lon: 91.7362, state: "Assam" },
  hyderabad: { lat: 17.385, lon: 78.4867, state: "Telangana" },
  vizag: { lat: 17.6868, lon: 83.2185, state: "Andhra Pradesh" },
  andaman: { lat: 11.7401, lon: 92.6586, state: "Andaman & Nicobar" },
  "port blair": { lat: 11.6234, lon: 92.7265, state: "Andaman & Nicobar" },
};

export function getDestinationCoords(name: string): DestinationCoords | null {
  const key = name?.toLowerCase().trim();
  return DESTINATION_COORDS[key] ?? null;
}
