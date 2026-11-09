export type Language = 'ar' | 'fr';

export type RouteCharacter = 'cultural' | 'historical' | 'natural' | 'desert' | 'mixed';
export type RouteLengthType = 'short' | 'medium' | 'long';
export type SiteCategoryType = 'historical' | 'natural' | 'cultural' | 'religious' | 'archaeological';

export interface RouteStop {
  id: string;
  routeId: string;
  name: string;
  nameFr?: string;
  description: string;
  descriptionFr?: string;
  order: number;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  isPublished?: boolean;
}

export interface TourismRoute {
  id: string;
  name: string;
  nameFr?: string;
  coverImage: string;
  description: string;
  descriptionFr?: string;
  character: RouteCharacter;
  startPoint: string;
  startPointFr?: string;
  endPoint: string;
  endPointFr?: string;
  distanceKm: number;
  duration: string;
  durationFr?: string;
  stagesCount: number;
  type: RouteLengthType;
  suitableSeason: string;
  suitableSeasonFr?: string;
  transportMode: string;
  transportModeFr?: string;
  gallery: string[];
  sitesPassed: string[];
  stops?: RouteStop[];
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Hotel {
  id: string;
  name: string;
  nameFr?: string;
  managerName: string;
  address: string;
  addressFr?: string;
  phone: string;
  secondaryPhone?: string;
  email: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  gallery?: string[];
  description: string;
  descriptionFr?: string;
  amenities?: string[];
  stars?: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TravelAgency {
  id: string;
  name: string;
  nameFr?: string;
  managerName: string;
  address: string;
  addressFr?: string;
  phone: string;
  secondaryPhone?: string;
  email: string;
  latitude: number;
  longitude: number;
  logoUrl: string;
  servicesDescription: string;
  servicesDescriptionFr?: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Artisan {
  id: string;
  fullName: string;
  fullNameFr?: string;
  craftType: string;
  craftTypeFr?: string;
  craftCategory: string;
  craftDescription: string;
  craftDescriptionFr?: string;
  address: string;
  addressFr?: string;
  phone: string;
  email?: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  productImages?: string[];
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TouristSite {
  id: string;
  name: string;
  nameFr?: string;
  category: SiteCategoryType;
  description: string;
  descriptionFr?: string;
  address: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  gallery?: string[];
  isFeatured?: boolean;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DirectorateInfo {
  id: string;
  officialNameAr: string;
  officialNameFr: string;
  ministryAr: string;
  ministryFr: string;
  stateAr: string;
  stateFr: string;
  address: string;
  phone: string;
  fax: string;
  email: string;
  facebook: string;
  instagram: string;
  twitter: string;
  logoUrl?: string;
  headquartersImageUrl?: string;
  latitude: number;
  longitude: number;
}

export interface HomepageSettings {
  id: string;
  heroTitleAr: string;
  heroTitleFr: string;
  heroSubtitleAr: string;
  heroSubtitleFr: string;
  heroImageUrl: string;
  showRoutesSection: boolean;
  showHotelsSection: boolean;
  showAgenciesSection: boolean;
  showArtisansSection: boolean;
  showSitesSection: boolean;
  showMapSection: boolean;
}

export type EntityItem = 
  | { type: 'route'; data: TourismRoute }
  | { type: 'hotel'; data: Hotel }
  | { type: 'agency'; data: TravelAgency }
  | { type: 'artisan'; data: Artisan }
  | { type: 'site'; data: TouristSite };
