import { DisasterType, Incident, IncidentSeverity, SensorData, VictimStatus } from "./types";

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'INC-2023-001',
    title: 'River Bank Overflow - Sector 4',
    type: DisasterType.FLOOD,
    severity: IncidentSeverity.CRITICAL,
    location: { lat: 34.0522, lng: -118.2437 },
    locationName: 'North River Delta',
    timestamp: new Date().toISOString(),
    description: 'Rapid water level rise detected by EO Sentinel-1 analysis. Evacuation ordered.',
    affectedPopulation: 1200,
    status: 'ACTIVE'
  },
  {
    id: 'INC-2023-002',
    title: 'Hillside Instability Warning',
    type: DisasterType.LANDSLIDE,
    severity: IncidentSeverity.HIGH,
    location: { lat: 34.1, lng: -118.3 },
    locationName: 'Eastern Highlands',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    description: 'Soil moisture saturation > 90%. High probability of slope failure.',
    affectedPopulation: 350,
    status: 'ACTIVE'
  },
  {
    id: 'INC-2023-003',
    title: 'Wildfire - Dry Brush',
    type: DisasterType.FIRE,
    severity: IncidentSeverity.MEDIUM,
    location: { lat: 34.0, lng: -118.4 },
    locationName: 'West Canyon',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    description: 'Detected via MODIS thermal anomalies. Crews dispatched.',
    affectedPopulation: 50,
    status: 'CONTAINED'
  }
];

export const MOCK_SENSORS: SensorData[] = [
  {
    id: 'SENS-W-01',
    type: 'WATER_LEVEL',
    value: 8.5,
    unit: 'm',
    location: { lat: 34.0522, lng: -118.2437 },
    status: 'DANGER',
    timestamp: new Date().toISOString(),
    trend: [4.2, 4.5, 5.1, 6.8, 7.9, 8.2, 8.5]
  },
  {
    id: 'SENS-R-01',
    type: 'RAINFALL',
    value: 120,
    unit: 'mm/h',
    location: { lat: 34.1, lng: -118.3 },
    status: 'WARNING',
    timestamp: new Date().toISOString(),
    trend: [10, 15, 45, 80, 100, 115, 120]
  }
];

// Placeholder for map image background
export const MAP_PLACEHOLDER_URL = "https://picsum.photos/1200/800"; 
