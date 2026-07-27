import type { DestinationEntry } from "@/types/destination";

export interface DestinationCoords {
  lat: number;
  lon: number;
  state: string;
}

export const DESTINATION_CATALOG: DestinationEntry[] = [
  // ─── Himachal Pradesh ───
  { id: "manali", name: "Manali", slug: "manali", country: "India", state: "Himachal Pradesh", city: "Manali", lat: 32.2396, lon: 77.1887, type: "hill", tags: ["snow", "adventure", "honeymoon"] },
  { id: "kasol", name: "Kasol", slug: "kasol", country: "India", state: "Himachal Pradesh", city: "Kasol", lat: 32.0105, lon: 77.3148, type: "hill", tags: ["trekking", "backpacker", "parvati-valley"] },
  { id: "shimla", name: "Shimla", slug: "shimla", country: "India", state: "Himachal Pradesh", city: "Shimla", lat: 31.1048, lon: 77.1734, type: "hill", tags: ["heritage", "family", "colonial"] },
  { id: "dharamshala", name: "Dharamshala", slug: "dharamshala", country: "India", state: "Himachal Pradesh", city: "Dharamshala", lat: 32.219, lon: 76.3234, type: "hill", tags: ["buddhist", "dalai-lama", "trekking"] },
  { id: "mcleodganj", name: "McLeodGanj", slug: "mcleodganj", country: "India", state: "Himachal Pradesh", city: "McLeodGanj", lat: 32.2428, lon: 76.3246, type: "hill", tags: ["buddhist", "cafe", "trekking"] },
  { id: "bir", name: "Bir Billing", slug: "bir", country: "India", state: "Himachal Pradesh", city: "Bir", lat: 32.0444, lon: 76.7187, type: "adventure", tags: ["paragliding", "camping"] },
  { id: "kasauli", name: "Kasauli", slug: "kasauli", country: "India", state: "Himachal Pradesh", city: "Kasauli", lat: 30.8986, lon: 76.9645, type: "hill", tags: ["weekend", "peaceful", "colonial"] },
  { id: "dalhousie", name: "Dalhousie", slug: "dalhousie", country: "India", state: "Himachal Pradesh", city: "Dalhousie", lat: 32.5345, lon: 75.9792, type: "hill", tags: ["colonial", "nature", "peaceful"] },
  { id: "khajjiar", name: "Khajjiar", slug: "khajjiar", country: "India", state: "Himachal Pradesh", city: "Khajjiar", lat: 32.5629, lon: 76.1261, type: "hill", tags: ["meadow", "mini-switzerland", "nature"] },
  { id: "spiti", name: "Spiti Valley", slug: "spiti", country: "India", state: "Himachal Pradesh", city: "Spiti", lat: 32.3462, lon: 77.684, type: "adventure", tags: ["cold-desert", "trekking", "monastery"] },

  // ─── Uttarakhand ───
  { id: "rishikesh", name: "Rishikesh", slug: "rishikesh", country: "India", state: "Uttarakhand", city: "Rishikesh", lat: 30.0869, lon: 78.2676, type: "adventure", tags: ["rafting", "yoga", "camping"] },
  { id: "haridwar", name: "Haridwar", slug: "haridwar", country: "India", state: "Uttarakhand", city: "Haridwar", lat: 29.9457, lon: 78.1642, type: "pilgrimage", tags: ["ganga-aarti", "temple", "spiritual"] },
  { id: "nainital", name: "Nainital", slug: "nainital", country: "India", state: "Uttarakhand", city: "Nainital", lat: 29.3819, lon: 79.4631, type: "hill", tags: ["lake", "family", "boat"] },
  { id: "dehradun", name: "Dehradun", slug: "dehradun", country: "India", state: "Uttarakhand", city: "Dehradun", lat: 30.3165, lon: 78.0322, type: "city", tags: ["gateway", "education", "cafe"] },
  { id: "auli", name: "Auli", slug: "auli", country: "India", state: "Uttarakhand", city: "Auli", lat: 30.5333, lon: 79.5667, type: "adventure", tags: ["skiing", "snow", "cable-car"] },
  { id: "mussoorie", name: "Mussoorie", slug: "mussoorie", country: "India", state: "Uttarakhand", city: "Mussoorie", lat: 30.4598, lon: 78.0642, type: "hill", tags: ["weekend", "colonial", "sunset"] },
  { id: "jim-corbett", name: "Jim Corbett", slug: "jim-corbett", country: "India", state: "Uttarakhand", city: "Jim Corbett", lat: 29.5301, lon: 78.774, type: "adventure", tags: ["safari", "wildlife", "national-park"] },
  { id: "valley-of-flowers", name: "Valley of Flowers", slug: "valley-of-flowers", country: "India", state: "Uttarakhand", city: "Valley of Flowers", lat: 30.7275, lon: 79.6075, type: "adventure", tags: ["trekking", "unesco", "flowers"] },
  { id: "kedarnath", name: "Kedarnath", slug: "kedarnath", country: "India", state: "Uttarakhand", city: "Kedarnath", lat: 30.7346, lon: 79.0668, type: "pilgrimage", tags: ["temple", "trek", "char-dham"] },
  { id: "badrinath", name: "Badrinath", slug: "badrinath", country: "India", state: "Uttarakhand", city: "Badrinath", lat: 30.7433, lon: 79.4938, type: "pilgrimage", tags: ["temple", "char-dham", "spiritual"] },

  // ─── Goa ───
  { id: "goa", name: "Goa", slug: "goa", country: "India", state: "Goa", city: "Goa", lat: 15.4909, lon: 73.8278, type: "beach", tags: ["party", "beach", "portuguese"] },
  { id: "north-goa", name: "North Goa", slug: "north-goa", country: "India", state: "Goa", city: "North Goa", lat: 15.6, lon: 73.75, type: "beach", tags: ["party", "clubs", "crowded"] },
  { id: "south-goa", name: "South Goa", slug: "south-goa", country: "India", state: "Goa", city: "South Goa", lat: 15.15, lon: 74.0, type: "beach", tags: ["peaceful", "luxury", "secluded"] },
  { id: "panjim", name: "Panjim", slug: "panjim", country: "India", state: "Goa", city: "Panjim", lat: 15.4909, lon: 73.8278, type: "city", tags: ["portuguese", "cafe", "heritage"] },
  { id: "anjuna", name: "Anjuna", slug: "anjuna", country: "India", state: "Goa", city: "Anjuna", lat: 15.5195, lon: 73.7489, type: "beach", tags: ["flea-market", "party", "hippie"] },
  { id: "vagator", name: "Vagator", slug: "vagator", country: "India", state: "Goa", city: "Vagator", lat: 15.5442, lon: 73.7489, type: "beach", tags: ["cliffs", "sunset", "party"] },
  { id: "palolem", name: "Palolem", slug: "palolem", country: "India", state: "Goa", city: "Palolem", lat: 15.009, lon: 74.0237, type: "beach", tags: ["peaceful", "cafes", "kayaking"] },
  { id: "baga", name: "Baga", slug: "baga", country: "India", state: "Goa", city: "Baga", lat: 15.5516, lon: 73.7515, type: "beach", tags: ["water-sports", "party", "shacks"] },

  // ─── Ladakh & J&K ───
  { id: "leh", name: "Leh-Ladakh", slug: "leh", country: "India", state: "Ladakh", city: "Leh", lat: 34.1526, lon: 77.5771, type: "adventure", tags: ["desert", "monastery", "biking"] },
  { id: "nubra-valley", name: "Nubra Valley", slug: "nubra-valley", country: "India", state: "Ladakh", city: "Nubra", lat: 34.618, lon: 77.704, type: "adventure", tags: ["double-humped-camel", "sand-dunes", "monastery"] },
  { id: "pangong", name: "Pangong Tso", slug: "pangong", country: "India", state: "Ladakh", city: "Pangong", lat: 33.7182, lon: 78.7027, type: "adventure", tags: ["lake", "camping", "3-idiot"] },
  { id: "srinagar", name: "Srinagar", slug: "srinagar", country: "India", state: "Jammu & Kashmir", city: "Srinagar", lat: 34.0837, lon: 74.7973, type: "city", tags: ["houseboat", "dal-lake", "garden"] },
  { id: "gulmarg", name: "Gulmarg", slug: "gulmarg", country: "India", state: "Jammu & Kashmir", city: "Gulmarg", lat: 34.0509, lon: 74.3801, type: "adventure", tags: ["skiing", "gondola", "snow"] },
  { id: "pahalgam", name: "Pahalgam", slug: "pahalgam", country: "India", state: "Jammu & Kashmir", city: "Pahalgam", lat: 34.0146, lon: 75.3119, type: "hill", tags: ["trekking", "betaab-valley", "river"] },
  { id: "sonamarg", name: "Sonamarg", slug: "sonamarg", country: "India", state: "Jammu & Kashmir", city: "Sonamarg", lat: 34.3027, lon: 75.295, type: "hill", tags: ["meadow", "trek", "camping"] },
  { id: "jammu", name: "Jammu", slug: "jammu", country: "India", state: "Jammu & Kashmir", city: "Jammu", lat: 32.7266, lon: 74.857, type: "pilgrimage", tags: ["temple", "vaishno-devi", "historical"] },

  // ─── Rajasthan ───
  { id: "jaipur", name: "Jaipur", slug: "jaipur", country: "India", state: "Rajasthan", city: "Jaipur", lat: 26.9124, lon: 75.7873, type: "city", tags: ["pink-city", "heritage", "fort"] },
  { id: "jodhpur", name: "Jodhpur", slug: "jodhpur", country: "India", state: "Rajasthan", city: "Jodhpur", lat: 26.2389, lon: 73.0243, type: "city", tags: ["blue-city", "fort", "heritage"] },
  { id: "udaipur", name: "Udaipur", slug: "udaipur", country: "India", state: "Rajasthan", city: "Udaipur", lat: 24.5854, lon: 73.7125, type: "city", tags: ["lake-city", "romantic", "palace"] },
  { id: "jaisalmer", name: "Jaisalmer", slug: "jaisalmer", country: "India", state: "Rajasthan", city: "Jaisalmer", lat: 26.9116, lon: 70.9228, type: "desert", tags: ["golden-city", "desert-safari", "fort"] },
  { id: "pushkar", name: "Pushkar", slug: "pushkar", country: "India", state: "Rajasthan", city: "Pushkar", lat: 26.4907, lon: 74.551, type: "pilgrimage", tags: ["lake", "temple", "camel-fair"] },
  { id: "bikaner", name: "Bikaner", slug: "bikaner", country: "India", state: "Rajasthan", city: "Bikaner", lat: 28.0229, lon: 73.3119, type: "desert", tags: ["fort", "camel", "karniji-mata"] },
  { id: "ranthambore", name: "Ranthambore", slug: "ranthambore", country: "India", state: "Rajasthan", city: "Ranthambore", lat: 26.0173, lon: 76.5026, type: "adventure", tags: ["safari", "tiger", "national-park"] },
  { id: "mount-abu", name: "Mount Abu", slug: "mount-abu", country: "India", state: "Rajasthan", city: "Mount Abu", lat: 24.5916, lon: 72.7093, type: "hill", tags: ["hill-station", "temple", "lake"] },
  { id: "chittorgarh", name: "Chittorgarh", slug: "chittorgarh", country: "India", state: "Rajasthan", city: "Chittorgarh", lat: 24.8887, lon: 74.6269, type: "city", tags: ["fort", "heritage", "history"] },

  // ─── Uttar Pradesh ───
  { id: "agra", name: "Agra", slug: "agra", country: "India", state: "Uttar Pradesh", city: "Agra", lat: 27.1767, lon: 78.0081, type: "city", tags: ["taj-mahal", "heritage", "unesco"] },
  { id: "varanasi", name: "Varanasi", slug: "varanasi", country: "India", state: "Uttar Pradesh", city: "Varanasi", lat: 25.3176, lon: 82.9739, type: "pilgrimage", tags: ["ganga-aarti", "temple", "spiritual"] },
  { id: "lucknow", name: "Lucknow", slug: "lucknow", country: "India", state: "Uttar Pradesh", city: "Lucknow", lat: 26.8467, lon: 80.9462, type: "city", tags: ["nawabi", "food", "heritage"] },
  { id: "mathura", name: "Mathura", slug: "mathura", country: "India", state: "Uttar Pradesh", city: "Mathura", lat: 27.4924, lon: 77.6737, type: "pilgrimage", tags: ["krishna", "temple", "holy"] },
  { id: "vrindavan", name: "Vrindavan", slug: "vrindavan", country: "India", state: "Uttar Pradesh", city: "Vrindavan", lat: 27.581, lon: 77.6962, type: "pilgrimage", tags: ["krishna", "temple", "iskcon"] },
  { id: "allahabad", name: "Prayagraj", slug: "prayagraj", country: "India", state: "Uttar Pradesh", city: "Prayagraj", lat: 25.4358, lon: 81.8463, type: "pilgrimage", tags: ["kumbh", "sangam", "holy"] },

  // ─── Delhi NCR ───
  { id: "delhi", name: "Delhi", slug: "delhi", country: "India", state: "Delhi", city: "Delhi", lat: 28.7041, lon: 77.1025, type: "city", tags: ["capital", "heritage", "food"] },

  // ─── Maharashtra ───
  { id: "mumbai", name: "Mumbai", slug: "mumbai", country: "India", state: "Maharashtra", city: "Mumbai", lat: 19.076, lon: 72.8777, type: "city", tags: ["city", "bollywood", "nightlife"] },
  { id: "pune", name: "Pune", slug: "pune", country: "India", state: "Maharashtra", city: "Pune", lat: 18.5204, lon: 73.8567, type: "city", tags: ["education", "culture", "hills"] },
  { id: "lonavala", name: "Lonavala", slug: "lonavala", country: "India", state: "Maharashtra", city: "Lonavala", lat: 18.748, lon: 73.4033, type: "hill", tags: ["weekend", "monsoon", "chikki"] },
  { id: "mahabaleshwar", name: "Mahabaleshwar", slug: "mahabaleshwar", country: "India", state: "Maharashtra", city: "Mahabaleshwar", lat: 17.9316, lon: 73.6499, type: "hill", tags: ["strawberry", "viewpoint", "weekend"] },
  { id: "ajanta-ellora", name: "Ajanta & Ellora", slug: "ajanta-ellora", country: "India", state: "Maharashtra", city: "Ajanta", lat: 20.5356, lon: 75.7516, type: "city", tags: ["caves", "unesco", "heritage"] },
  { id: "matheran", name: "Matheran", slug: "matheran", country: "India", state: "Maharashtra", city: "Matheran", lat: 18.9871, lon: 73.2855, type: "hill", tags: ["toy-train", "no-vehicles", "weekend"] },
  { id: "alibaug", name: "Alibaug", slug: "alibaug", country: "India", state: "Maharashtra", city: "Alibaug", lat: 18.6414, lon: 72.8729, type: "beach", tags: ["weekend", "beach", "fort"] },
  { id: "khandala", name: "Khandala", slug: "khandala", country: "India", state: "Maharashtra", city: "Khandala", lat: 18.7593, lon: 73.3758, type: "hill", tags: ["weekend", "trekking", "monsoon"] },
  { id: "nashik", name: "Nashik", slug: "nashik", country: "India", state: "Maharashtra", city: "Nashik", lat: 19.9975, lon: 73.7898, type: "city", tags: ["wine", "temple", "kumbh"] },

  // ─── Karnataka ───
  { id: "bangalore", name: "Bangalore", slug: "bangalore", country: "India", state: "Karnataka", city: "Bangalore", lat: 12.9716, lon: 77.5946, type: "city", tags: ["tech", "cafe", "nightlife"] },
  { id: "mysore", name: "Mysore", slug: "mysore", country: "India", state: "Karnataka", city: "Mysore", lat: 12.2958, lon: 76.6394, type: "city", tags: ["palace", "heritage", "yoga"] },
  { id: "coorg", name: "Coorg", slug: "coorg", country: "India", state: "Karnataka", city: "Coorg", lat: 12.3375, lon: 75.8069, type: "hill", tags: ["coffee", "nature", "homestay"] },
  { id: "gokarna", name: "Gokarna", slug: "gokarna", country: "India", state: "Karnataka", city: "Gokarna", lat: 14.5471, lon: 74.3196, type: "beach", tags: ["temple", "beach", "trek"] },
  { id: "hampi", name: "Hampi", slug: "hampi", country: "India", state: "Karnataka", city: "Hampi", lat: 15.335, lon: 76.4603, type: "city", tags: ["ruins", "unesco", "bouldering"] },
  { id: "chikmagalur", name: "Chikmagalur", slug: "chikmagalur", country: "India", state: "Karnataka", city: "Chikmagalur", lat: 13.3394, lon: 75.7728, type: "hill", tags: ["coffee", "trek", "homestay"] },
  { id: "udupi", name: "Udupi", slug: "udupi", country: "India", state: "Karnataka", city: "Udupi", lat: 13.3409, lon: 74.7421, type: "beach", tags: ["temple", "food", "beach"] },
  { id: "murudeshwar", name: "Murudeshwar", slug: "murudeshwar", country: "India", state: "Karnataka", city: "Murudeshwar", lat: 14.0942, lon: 74.4845, type: "beach", tags: ["temple", "statue", "beach"] },

  // ─── Tamil Nadu ───
  { id: "chennai", name: "Chennai", slug: "chennai", country: "India", state: "Tamil Nadu", city: "Chennai", lat: 13.0827, lon: 80.2707, type: "city", tags: ["beach", "temple", "culture"] },
  { id: "ooty", name: "Ooty", slug: "ooty", country: "India", state: "Tamil Nadu", city: "Ooty", lat: 11.4102, lon: 76.695, type: "hill", tags: ["toy-train", "tea", "lake"] },
  { id: "kodaikanal", name: "Kodaikanal", slug: "kodaikanal", country: "India", state: "Tamil Nadu", city: "Kodaikanal", lat: 10.2381, lon: 77.4892, type: "hill", tags: ["lake", "star", "pine-forest"] },
  { id: "madurai", name: "Madurai", slug: "madurai", country: "India", state: "Tamil Nadu", city: "Madurai", lat: 9.9252, lon: 78.1198, type: "city", tags: ["temple", "heritage", "culture"] },
  { id: "rameswaram", name: "Rameswaram", slug: "rameswaram", country: "India", state: "Tamil Nadu", city: "Rameswaram", lat: 9.2876, lon: 79.3129, type: "pilgrimage", tags: ["temple", "bridge", "spiritual"] },
  { id: "kanchipuram", name: "Kanchipuram", slug: "kanchipuram", country: "India", state: "Tamil Nadu", city: "Kanchipuram", lat: 12.8342, lon: 79.7036, type: "pilgrimage", tags: ["temple", "silk", "heritage"] },
  { id: "mahabalipuram", name: "Mahabalipuram", slug: "mahabalipuram", country: "India", state: "Tamil Nadu", city: "Mahabalipuram", lat: 12.6269, lon: 80.1719, type: "beach", tags: ["shore-temple", "unesco", "sculpture"] },
  { id: "coimbatore", name: "Coimbatore", slug: "coimbatore", country: "India", state: "Tamil Nadu", city: "Coimbatore", lat: 11.0168, lon: 76.9558, type: "city", tags: ["Gateway", "temple", "textile"] },

  // ─── Puducherry ───
  { id: "pondicherry", name: "Pondicherry", slug: "pondicherry", country: "India", state: "Puducherry", city: "Pondicherry", lat: 11.9416, lon: 79.8083, type: "city", tags: ["french", "cafe", "ashram"] },

  // ─── Kerala ───
  { id: "kerala", name: "Kerala", slug: "kerala", country: "India", state: "Kerala", city: "Kerala", lat: 10.8505, lon: 76.2711, type: "city", tags: ["backwaters", "houseboat", "ayurveda"] },
  { id: "munnar", name: "Munnar", slug: "munnar", country: "India", state: "Kerala", city: "Munnar", lat: 10.0889, lon: 77.0595, type: "hill", tags: ["tea", "plantation", "honeymoon"] },
  { id: "alleppey", name: "Alleppey", slug: "alleppey", country: "India", state: "Kerala", city: "Alleppey", lat: 9.4981, lon: 76.3388, type: "beach", tags: ["backwaters", "houseboat", "honeymoon"] },
  { id: "kochi", name: "Kochi", slug: "kochi", country: "India", state: "Kerala", city: "Kochi", lat: 9.9312, lon: 76.2673, type: "city", tags: ["port", "china-net", "jewish"] },
  { id: "wayanad", name: "Wayanad", slug: "wayanad", country: "India", state: "Kerala", city: "Wayanad", lat: 11.6854, lon: 76.132, type: "hill", tags: ["wildlife", "cave", "plantation"] },
  { id: "kovalam", name: "Kovalam", slug: "kovalam", country: "India", state: "Kerala", city: "Kovalam", lat: 8.4004, lon: 76.9785, type: "beach", tags: ["lighthouse", "beach", "ayurveda"] },
  { id: "varkala", name: "Varkala", slug: "varkala", country: "India", state: "Kerala", city: "Varkala", lat: 8.7379, lon: 76.7188, type: "beach", tags: ["cliff", "sunset", "cafe"] },
  { id: "thekkady", name: "Thekkady", slug: "thekkady", country: "India", state: "Kerala", city: "Thekkady", lat: 9.5864, lon: 77.2161, type: "adventure", tags: ["wildlife", "spice", "boating"] },

  // ─── West Bengal & Northeast ───
  { id: "kolkata", name: "Kolkata", slug: "kolkata", country: "India", state: "West Bengal", city: "Kolkata", lat: 22.5726, lon: 88.3639, type: "city", tags: ["cultural", "food", "heritage"] },
  { id: "darjeeling", name: "Darjeeling", slug: "darjeeling", country: "India", state: "West Bengal", city: "Darjeeling", lat: 27.041, lon: 88.2663, type: "hill", tags: ["tea", "toy-train", "kanchenjunga"] },
  { id: "digha", name: "Digha", slug: "digha", country: "India", state: "West Bengal", city: "Digha", lat: 21.6263, lon: 87.5207, type: "beach", tags: ["beach", "weekend", "family"] },
  { id: "sunderbans", name: "Sunderbans", slug: "sunderbans", country: "India", state: "West Bengal", city: "Sunderbans", lat: 21.9497, lon: 88.9364, type: "adventure", tags: ["mangrove", "tiger", "unesco"] },
  { id: "gangtok", name: "Gangtok", slug: "gangtok", country: "India", state: "Sikkim", city: "Gangtok", lat: 27.3314, lon: 88.6138, type: "hill", tags: ["buddhist", "ropeway", "nature"] },
  { id: "nathula", name: "Nathula Pass", slug: "nathula", country: "India", state: "Sikkim", city: "Nathula", lat: 27.3833, lon: 88.8333, type: "adventure", tags: ["border", "pass", "snow"] },
  { id: "shillong", name: "Shillong", slug: "shillong", country: "India", state: "Meghalaya", city: "Shillong", lat: 25.5788, lon: 91.8933, type: "hill", tags: ["scotland", "waterfall", "music"] },
  { id: "cherrapunji", name: "Cherrapunji", slug: "cherrapunji", country: "India", state: "Meghalaya", city: "Cherrapunji", lat: 25.3009, lon: 91.6918, type: "adventure", tags: ["rainiest", "waterfall", "living-bridge"] },
  { id: "guwahati", name: "Guwahati", slug: "guwahati", country: "India", state: "Assam", city: "Guwahati", lat: 26.1445, lon: 91.7362, type: "city", tags: ["temple", "brahmaputra", "gateway"] },
  { id: "majuli", name: "Majuli Island", slug: "majuli", country: "India", state: "Assam", city: "Majuli", lat: 26.9537, lon: 94.1493, type: "adventure", tags: ["river-island", "culture", "satras"] },
  { id: "kaziranga", name: "Kaziranga", slug: "kaziranga", country: "India", state: "Assam", city: "Kaziranga", lat: 26.5744, lon: 93.5309, type: "adventure", tags: ["rhino", "safari", "unesco"] },
  { id: "tawang", name: "Tawang", slug: "tawang", country: "India", state: "Arunachal Pradesh", city: "Tawang", lat: 27.5883, lon: 91.86, type: "hill", tags: ["monastery", "buddhist", "border"] },

  // ─── Telangana & Andhra ───
  { id: "hyderabad", name: "Hyderabad", slug: "hyderabad", country: "India", state: "Telangana", city: "Hyderabad", lat: 17.385, lon: 78.4867, type: "city", tags: ["biryani", "pearls", "heritage"] },
  { id: "vizag", name: "Visakhapatnam", slug: "vizag", country: "India", state: "Andhra Pradesh", city: "Visakhapatnam", lat: 17.6868, lon: 83.2185, type: "beach", tags: ["beach", "submarine", "hill"] },
  { id: "araku", name: "Araku Valley", slug: "araku", country: "India", state: "Andhra Pradesh", city: "Araku", lat: 18.3278, lon: 82.877, type: "hill", tags: ["coffee", "tribal", "valley"] },
  { id: "tirupati", name: "Tirupati", slug: "tirupati", country: "India", state: "Andhra Pradesh", city: "Tirupati", lat: 13.6288, lon: 79.4192, type: "pilgrimage", tags: ["temple", "tirumala", "spiritual"] },

  // ─── Andaman ───
  { id: "andaman", name: "Andaman Islands", slug: "andaman", country: "India", state: "Andaman & Nicobar", city: "Andaman", lat: 11.7401, lon: 92.6586, type: "beach", tags: ["island", "scuba", "beach"] },
  { id: "port-blair", name: "Port Blair", slug: "port-blair", country: "India", state: "Andaman & Nicobar", city: "Port Blair", lat: 11.6234, lon: 92.7265, type: "city", tags: ["cellular-jail", "beach", "capital"] },
  { id: "havelock", name: "Havelock Island", slug: "havelock", country: "India", state: "Andaman & Nicobar", city: "Havelock", lat: 11.9739, lon: 93.0469, type: "beach", tags: ["scuba", "beach", "snorkeling"] },
  { id: "neil-island", name: "Neil Island", slug: "neil-island", country: "India", state: "Andaman & Nicobar", city: "Neil Island", lat: 11.8382, lon: 93.0446, type: "beach", tags: ["peaceful", "beach", "snorkeling"] },

  // ─── Madhya Pradesh ───
  { id: "khajuraho", name: "Khajuraho", slug: "khajuraho", country: "India", state: "Madhya Pradesh", city: "Khajuraho", lat: 24.8318, lon: 79.9199, type: "city", tags: ["temple", "unesco", "heritage"] },
  { id: "sanchi", name: "Sanchi", slug: "sanchi", country: "India", state: "Madhya Pradesh", city: "Sanchi", lat: 23.4798, lon: 77.7393, type: "pilgrimage", tags: ["stupa", "buddhist", "unesco"] },
  { id: "bandhavgarh", name: "Bandhavgarh", slug: "bandhavgarh", country: "India", state: "Madhya Pradesh", city: "Bandhavgarh", lat: 23.6968, lon: 80.9892, type: "adventure", tags: ["tiger", "safari", "national-park"] },
  { id: "kanha", name: "Kanha National Park", slug: "kanha", country: "India", state: "Madhya Pradesh", city: "Kanha", lat: 22.3106, lon: 80.6316, type: "adventure", tags: ["tiger", "safari", "jungle-book"] },
  { id: "indore", name: "Indore", slug: "indore", country: "India", state: "Madhya Pradesh", city: "Indore", lat: 22.7196, lon: 75.8577, type: "city", tags: ["food", "palace", "clean-city"] },
  { id: "bhopal", name: "Bhopal", slug: "bhopal", country: "India", state: "Madhya Pradesh", city: "Bhopal", lat: 23.2599, lon: 77.4126, type: "city", tags: ["lake", "heritage", "museum"] },

  // ─── Gujarat ───
  { id: "ahmedabad", name: "Ahmedabad", slug: "ahmedabad", country: "India", state: "Gujarat", city: "Ahmedabad", lat: 23.0225, lon: 72.5714, type: "city", tags: ["heritage", "food", "modhera"] },
  { id: "kutch", name: "Kutch (Rann)", slug: "kutch", country: "India", state: "Gujarat", city: "Kutch", lat: 23.7337, lon: 69.8597, type: "desert", tags: ["white-desert", "festival", "handicraft"] },
  { id: "somnath", name: "Somnath", slug: "somnath", country: "India", state: "Gujarat", city: "Somnath", lat: 20.8988, lon: 70.4011, type: "pilgrimage", tags: ["temple", "jyotirlinga", "beach"] },
  { id: "dwarka", name: "Dwarka", slug: "dwarka", country: "India", state: "Gujarat", city: "Dwarka", lat: 22.2442, lon: 68.9685, type: "pilgrimage", tags: ["temple", "krishna", "underwater"] },
  { id: "vadodara", name: "Vadodara", slug: "vadodara", country: "India", state: "Gujarat", city: "Vadodara", lat: 22.3072, lon: 73.1812, type: "city", tags: ["palace", "culture", "museum"] },
  { id: "saputara", name: "Saputara", slug: "saputara", country: "India", state: "Gujarat", city: "Saputara", lat: 20.5798, lon: 73.7453, type: "hill", tags: ["hill-station", "lake", "weekend"] },

  // ─── Odisha ───
  { id: "bhubaneswar", name: "Bhubaneswar", slug: "bhubaneswar", country: "India", state: "Odisha", city: "Bhubaneswar", lat: 20.2961, lon: 85.8245, type: "city", tags: ["temple", "heritage", "culture"] },
  { id: "puri", name: "Puri", slug: "puri", country: "India", state: "Odisha", city: "Puri", lat: 19.8135, lon: 85.8312, type: "pilgrimage", tags: ["jagannath", "beach", "temple"] },
  { id: "konark", name: "Konark", slug: "konark", country: "India", state: "Odisha", city: "Konark", lat: 19.89, lon: 86.1003, type: "beach", tags: ["sun-temple", "unesco", "beach"] },
  { id: "chilika", name: "Chilika Lake", slug: "chilika", country: "India", state: "Odisha", city: "Chilika", lat: 19.7167, lon: 85.3167, type: "adventure", tags: ["lake", "dolphin", "bird"] },

  // ─── Chandigarh ───
  { id: "chandigarh", name: "Chandigarh", slug: "chandigarh", country: "India", state: "Chandigarh", city: "Chandigarh", lat: 30.7333, lon: 76.7794, type: "city", tags: ["modern", "le-corbusier", "rock-garden"] },

  // ─── Bihar ───
  { id: "bodh-gaya", name: "Bodh Gaya", slug: "bodh-gaya", country: "India", state: "Bihar", city: "Bodh Gaya", lat: 24.6951, lon: 84.9914, type: "pilgrimage", tags: ["buddhist", "mahabodhi", "unesco"] },
  { id: "nalanda", name: "Nalanda", slug: "nalanda", country: "India", state: "Bihar", city: "Nalanda", lat: 25.137, lon: 85.4434, type: "pilgrimage", tags: ["university", "ruins", "buddhist"] },
  { id: "rajgir", name: "Rajgir", slug: "rajgir", country: "India", state: "Bihar", city: "Rajgir", lat: 25.0181, lon: 85.4163, type: "pilgrimage", tags: ["ropeway", "buddhist", "hot-spring"] },
];

export const DESTINATION_COORDS: Record<string, DestinationCoords> = {};
for (const d of DESTINATION_CATALOG) {
  DESTINATION_COORDS[d.slug] = { lat: d.lat, lon: d.lon, state: d.state };
  DESTINATION_COORDS[d.name.toLowerCase()] = { lat: d.lat, lon: d.lon, state: d.state };
}

export function getDestinationCoords(name: string): DestinationCoords | null {
  const key = name?.toLowerCase().trim();
  return DESTINATION_COORDS[key] ?? null;
}

export function getDestinationEntry(slugOrName: string): DestinationEntry | null {
  const key = slugOrName?.toLowerCase().trim();
  return DESTINATION_CATALOG.find((d) => d.slug === key || d.name.toLowerCase() === key) ?? null;
}

export function getDestinationsByType(type: string): DestinationEntry[] {
  return DESTINATION_CATALOG.filter((d) => d.type === type);
}

export function getDestinationsByState(state: string): DestinationEntry[] {
  return DESTINATION_CATALOG.filter((d) => d.state.toLowerCase() === state.toLowerCase());
}

export function searchDestinations(query: string): DestinationEntry[] {
  const q = query?.toLowerCase().trim() ?? "";
  if (!q) return DESTINATION_CATALOG;
  return DESTINATION_CATALOG.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.state.toLowerCase().includes(q) ||
      d.city.toLowerCase().includes(q) ||
      d.tags.some((t) => t.includes(q)) ||
      d.type.includes(q),
  );
}
