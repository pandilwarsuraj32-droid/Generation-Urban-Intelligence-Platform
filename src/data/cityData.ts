import { CityProfile, CityMarker, CivicReport, CityPlace } from '../types';
import { ASSET_IMAGES } from './assets';
import { EXPANDED_PLACES } from './expandedPlacesData';

export { ASSET_IMAGES, EXPANDED_PLACES };

export const CITIES: CityProfile[] = [
  {
    id: 'pune',
    name: 'Pune',
    country: 'India',
    tagline: 'The Cultural & Cyber Citadel of the Deccan',
    center: [18.5204, 73.8567],
    zoom: 13,
    aqi: 64,
    noiseDb: 52,
    mobilityScore: 89,
    greenCoverPct: 38,
    activeSensors: 1420,
    weather: {
      tempC: 27,
      condition: 'Clear Evening Sky',
      humidity: 46
    }
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    tagline: 'Coastal Megacity of Neon & Sea Breezes',
    center: [18.9220, 72.8347],
    zoom: 13,
    aqi: 92,
    noiseDb: 68,
    mobilityScore: 94,
    greenCoverPct: 22,
    activeSensors: 2840,
    weather: {
      tempC: 30,
      condition: 'Breezy Maritime Mist',
      humidity: 78
    }
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    country: 'India',
    tagline: 'Silicon Garden Metropolis',
    center: [12.9716, 77.5946],
    zoom: 13,
    aqi: 58,
    noiseDb: 49,
    mobilityScore: 86,
    greenCoverPct: 41,
    activeSensors: 1980,
    weather: {
      tempC: 24,
      condition: 'Cool Gentle Breeze',
      humidity: 62
    }
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    tagline: 'The Global Biophilic Smart Island',
    center: [1.3521, 103.8198],
    zoom: 13,
    aqi: 32,
    noiseDb: 42,
    mobilityScore: 98,
    greenCoverPct: 56,
    activeSensors: 4320,
    weather: {
      tempC: 29,
      condition: 'Warm Tropical Calm',
      humidity: 80
    }
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    tagline: 'Cybernetic Hyper-City & Ancient Shrines',
    center: [35.6762, 139.6503],
    zoom: 13,
    aqi: 28,
    noiseDb: 44,
    mobilityScore: 99,
    greenCoverPct: 35,
    activeSensors: 5890,
    weather: {
      tempC: 18,
      condition: 'Clear Night Stars',
      humidity: 50
    }
  }
];

const EXTRA_MARKERS: CityMarker[] = [
  {
    id: 'pn-issue-1',
    cityId: 'pune',
    name: 'Civic Report: Asphalt Gap at JM Road',
    category: 'issue',
    subcategory: 'Civic Road Hazard',
    coordinates: [18.5230, 73.8488],
    address: 'Jangali Maharaj Road, Near Sambhaji Park',
    area: 'JM Road',
    rating: 0,
    reviewCount: 0,
    priceLevel: 'budget',
    priceRange: 'N/A',
    openingHours: '24 Hours',
    photoUrl: ASSET_IMAGES.hero,
    description: 'Pothole patch and cracked pedestrian kerb reported by community commuter mesh.',
    amenities: ['Citizen Report'],
    issueStatus: 'Dispatched',
    reportedAt: 'Today, 2 hours ago'
  },
  {
    id: 'pn-sensor-1',
    cityId: 'pune',
    name: 'Deccan Grid Environmental Telemetry Station',
    category: 'sensor',
    subcategory: 'IoT Environmental Node',
    coordinates: [18.5165, 73.8415],
    address: 'Deccan Gymkhana Sensor Tower 12',
    area: 'Deccan Gymkhana',
    rating: 5.0,
    reviewCount: 1,
    priceLevel: 'budget',
    priceRange: 'Public Sensor',
    openingHours: '24 Hours Open',
    photoUrl: ASSET_IMAGES.hero,
    description: 'Hyperlocal acoustic, PM2.5, UV index and pedestrian density monitoring node.',
    amenities: ['Continuous IoT Mesh'],
    aqiLocal: 54,
    crowdLevel: 'Moderate'
  }
];

export const CITY_MARKERS: CityMarker[] = [
  ...EXPANDED_PLACES,
  ...EXTRA_MARKERS
];

export const INITIAL_CIVIC_REPORTS: CivicReport[] = [
  {
    id: 'rep-1',
    ticketId: 'CV-PN-8821',
    category: 'Pothole & Asphalt Hazard',
    severity: 'High',
    confidenceScore: 96,
    summary: 'Sub-surface subsidence and asphalt fracture detected at JM Road bus transit lane.',
    department: 'Smart Road & Transit Maintenance Corp',
    turnaround: '24 Hours',
    location: 'JM Road, Near Sambhaji Garden (Pune)',
    imageUrl: ASSET_IMAGES.hero,
    status: 'Crew Dispatched',
    timestamp: 'Today, 14:15 IST',
    upvotes: 42
  },
  {
    id: 'rep-2',
    ticketId: 'CV-PN-8819',
    category: 'Garbage & Bio-Waste Overflow',
    severity: 'Medium',
    confidenceScore: 93,
    summary: 'Recyclables container capacity breached; automated sensor triggered dispatch request.',
    department: 'Solid Waste & Sanitation Department',
    turnaround: '12 Hours',
    location: 'FC Road, Lane 4 Intersection (Pune)',
    imageUrl: ASSET_IMAGES.lanewayFood,
    status: 'Resolved',
    timestamp: 'Today, 11:30 IST',
    upvotes: 28
  },
  {
    id: 'rep-3',
    ticketId: 'CV-PN-8814',
    category: 'Streetlight Luminaire Malfunction',
    severity: 'Low',
    confidenceScore: 91,
    summary: 'Solar-hybrid LED pole array blinking intermittently along pedestrian walkway.',
    department: 'Public Energy & Smart Grid Wing',
    turnaround: '36 Hours',
    location: 'Vetal Tekdi Footpath Approach (Pune)',
    imageUrl: ASSET_IMAGES.skyDeck,
    status: 'AI Triaged',
    timestamp: 'Yesterday, 19:40 IST',
    upvotes: 19
  }
];

export const PROMPT_CHIPS = [
  'Find peaceful places near me',
  'Plan a ₹500 city adventure',
  "Explore Pune's hidden gems",
  'Discover accessible routes',
];

export const PRESET_SNAP_EXAMPLES = [
  {
    title: 'Pothole on Main Arterial Road',
    category: 'Pothole & Road Hazard',
    severity: 'High' as const,
    description: 'Deep road cavity near bus stop causing two-wheelers to swerve abruptly.',
    location: 'FC Road, Shivajinagar Junction',
    previewUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    fallbackLocalImage: ASSET_IMAGES.hero
  },
  {
    title: 'Overflowing Waste Bins at Food Street',
    category: 'Garbage & Waste Accumulation',
    severity: 'Medium' as const,
    description: 'Commercial food lane bins overflowing onto pedestrian walkway.',
    location: 'JM Road Food Alley, Gate 2',
    previewUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    fallbackLocalImage: ASSET_IMAGES.lanewayFood
  },
  {
    title: 'Flickering Dark Streetlight',
    category: 'Lighting & Electrical Grid',
    severity: 'Medium' as const,
    description: 'Pedestrian corner streetlight completely blacked out after 8 PM.',
    location: 'Prabhat Road, Lane 7',
    previewUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    fallbackLocalImage: ASSET_IMAGES.skyDeck
  }
];
