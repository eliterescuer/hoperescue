import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { Incident, IncidentSeverity, DisasterType } from '../types';
import { MOCK_INCIDENTS } from '../constants';
import { AlertCircle, Wind, Waves, Thermometer, Layers } from 'lucide-react';

export const TacticalMap: React.FC = () => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  // Helper: Get color code based on severity
  const getSeverityColorCode = (severity: IncidentSeverity) => {
    switch (severity) {
      case IncidentSeverity.CRITICAL: return '#ef4444'; // alert-red
      case IncidentSeverity.HIGH: return '#f97316'; // alert-orange
      case IncidentSeverity.MEDIUM: return '#eab308'; // yellow-500
      default: return '#10b981'; // safe-green
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      zoomControl: false, // We will add custom controls
      attributionControl: false
    }).setView([34.0522, -118.2437], 10); // Default to LA area based on mock data

    // Add Dark Matter Tiles (High tech look)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    mapInstanceRef.current = map;

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when Incidents change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => (marker as L.Marker).remove());
    markersRef.current = {};

    MOCK_INCIDENTS.forEach(incident => {
      const color = getSeverityColorCode(incident.severity);
      
      // Custom HTML Icon with Pulse Effect
      const customIcon = L.divIcon({
        className: 'incident-marker',
        html: `
          <div class="relative flex items-center justify-center w-6 h-6">
            <div class="pulse-ring" style="border-color: ${color}"></div>
            <div class="w-3 h-3 rounded-full" style="background-color: ${color}; box-shadow: 0 0 10px ${color}"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([incident.location.lat, incident.location.lng], { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          setSelectedIncident(incident);
          map.flyTo([incident.location.lat, incident.location.lng], 13, {
            animate: true,
            duration: 1.5
          });
        });
      
      markersRef.current[incident.id] = marker;
    });

  }, []);

  return (
    <div className="relative w-full h-[600px] bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-2xl group">
      
      {/* The Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Grid Overlay (Decoration) */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px] z-10"></div>

      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <button className="bg-slate-800/90 p-2 text-white rounded hover:bg-slate-700 backdrop-blur border border-slate-600" title="Wind Layer">
          <Wind className="w-5 h-5 text-slate-300" />
        </button>
        <button className="bg-slate-800/90 p-2 text-white rounded hover:bg-slate-700 backdrop-blur border border-slate-600" title="Precipitation Layer">
          <Waves className="w-5 h-5 text-slate-300" />
        </button>
        <button className="bg-slate-800/90 p-2 text-white rounded hover:bg-slate-700 backdrop-blur border border-slate-600" title="Thermal Layer">
          <Thermometer className="w-5 h-5 text-slate-300" />
        </button>
        <div className="h-px w-full bg-slate-600 my-1"></div>
        <button 
           className="bg-slate-800/90 p-2 text-white rounded hover:bg-slate-700 backdrop-blur border border-slate-600"
           onClick={() => mapInstanceRef.current?.setView([34.0522, -118.2437], 10)}
           title="Reset View"
        >
          <Layers className="w-5 h-5 text-tech-blue" />
        </button>
      </div>

      {/* Map Status Indicator */}
      <div className="absolute top-4 left-16 bg-slate-900/80 backdrop-blur border border-slate-600 px-3 py-1 rounded text-xs font-mono text-white z-20">
        LIVE SATELLITE FEED: CONNECTED
      </div>

      {/* Selected Incident Popover */}
      {selectedIncident && (
        <div className="absolute bottom-4 left-4 bg-slate-900/95 border border-slate-600 p-4 rounded-lg w-80 text-white shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 z-30">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-alert-red flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {selectedIncident.type}
            </h3>
            <button 
              onClick={() => setSelectedIncident(null)} 
              className="text-slate-400 hover:text-white"
            >
              ×
            </button>
          </div>
          <p className="font-semibold text-sm mb-1">{selectedIncident.title}</p>
          <p className="text-xs text-slate-400 mb-2">{selectedIncident.locationName} • {selectedIncident.location.lat.toFixed(4)}, {selectedIncident.location.lng.toFixed(4)}</p>
          <p className="text-sm text-slate-300 leading-relaxed mb-3">
            {selectedIncident.description}
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
             <div className="bg-slate-800 p-2 rounded">
               <span className="block text-slate-400">Severity</span>
               <span className="font-mono" style={{ color: getSeverityColorCode(selectedIncident.severity) }}>
                 {selectedIncident.severity}
               </span>
             </div>
             <div className="bg-slate-800 p-2 rounded">
               <span className="block text-slate-400">Affected</span>
               <span className="font-mono text-white">{selectedIncident.affectedPopulation}</span>
             </div>
          </div>
          <div className="mt-3 flex gap-2">
             <button className="flex-1 bg-tech-blue hover:bg-blue-600 py-1.5 rounded text-sm font-medium transition-colors">
               Dispatch Units
             </button>
             <button className="flex-1 border border-slate-500 hover:bg-slate-800 py-1.5 rounded text-sm font-medium transition-colors">
               Drone View
             </button>
          </div>
        </div>
      )}
    </div>
  );
};