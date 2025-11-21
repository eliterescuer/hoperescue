export enum DisasterType {
  FLOOD = 'FLOOD',
  LANDSLIDE = 'LANDSLIDE',
  FIRE = 'FIRE',
  TYPHOON = 'TYPHOON',
  EARTHQUAKE = 'EARTHQUAKE'
}

export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum VictimStatus {
  SAFE = 'SAFE',
  INJURED = 'INJURED',
  MISSING = 'MISSING',
  DECEASED = 'DECEASED'
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Incident {
  id: string;
  title: string;
  type: DisasterType;
  severity: IncidentSeverity;
  location: GeoPoint;
  locationName: string;
  timestamp: string;
  description: string;
  affectedPopulation: number;
  status: 'ACTIVE' | 'CONTAINED' | 'RESOLVED';
}

export interface SensorData {
  id: string;
  type: 'WATER_LEVEL' | 'RAINFALL' | 'WIND_SPEED' | 'AIR_QUALITY';
  value: number;
  unit: string;
  location: GeoPoint;
  status: 'NORMAL' | 'WARNING' | 'DANGER';
  timestamp: string;
  trend: number[]; // Historical data for chart
}

export interface Victim {
  id: string;
  fullName: string;
  nationalId: string;
  address: string;
  age?: number;
  gender?: string;
  status: VictimStatus;
  registeredAt: string;
  registeredBy: string; // Rescuer ID
  disasterId: string;
  notes?: string;
}

export interface WeatherAlert {
  id: string;
  headline: string;
  severity: IncidentSeverity;
  instruction: string;
}