export type CityId = 'pune' | 'mumbai' | 'bengaluru' | 'singapore' | 'tokyo';

export interface CityProfile {
  id: CityId;
  name: string;
  country: string;
  tagline: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
  aqi: number;
  noiseDb: number;
  mobilityScore: number;
  greenCoverPct: number;
  activeSensors: number;
  weather: {
    tempC: number;
    condition: string;
    humidity: number;
  };
}

export type PlaceCategory = 
  | 'stays'
  | 'shopping'
  | 'food'
  | 'heritage'
  | 'greenery'
  | 'entertainment'
  | 'photography'
  | 'education'
  | 'health'
  | 'transit'
  | 'accessibility'
  | 'issue'
  | 'sensor';

export type PriceLevel = 'budget' | 'moderate' | 'premium' | 'luxury';

export interface CityPlace {
  id: string;
  cityId: CityId;
  name: string;
  category: PlaceCategory;
  subcategory: string;
  coordinates: [number, number];
  address: string;
  area: string;
  rating: number;
  reviewCount: number;
  priceLevel: PriceLevel;
  priceRange: string;
  openingHours: string;
  photoUrl: string;
  description: string;
  insiderTip?: string;
  amenities: string[];
  contactPhone?: string;
  distanceKm?: number;
  accessibilityFeatures?: string[];
  crowdLevel?: 'Low' | 'Moderate' | 'High';
  verifiedSource?: string;
}

// Retain compatibility with existing CityMarker
export type CityMarker = CityPlace & {
  aqiLocal?: number;
  issueStatus?: 'Open' | 'Dispatched' | 'Resolved';
  reportedAt?: string;
};

export interface CopilotStop {
  time: string;
  placeName: string;
  category: string;
  description: string;
  estimatedCost: string;
  coordinates: [number, number];
  highlight: string;
}

export interface CopilotItinerary {
  id: string;
  title: string;
  overview: string;
  estimatedBudget: string;
  vibes: string[];
  stops: CopilotStop[];
  localTips: string[];
  createdAt: string;
  city: string;
}

export interface CivicReport {
  id: string;
  ticketId: string;
  category: string;
  severity: 'High' | 'Medium' | 'Low';
  confidenceScore: number;
  summary: string;
  department: string;
  turnaround: string;
  location: string;
  imageUrl: string;
  status: 'Received' | 'AI Triaged' | 'Crew Dispatched' | 'Resolved';
  timestamp: string;
  upvotes: number;
}
