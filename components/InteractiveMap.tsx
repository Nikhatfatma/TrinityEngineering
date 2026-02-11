"use client";

import { useState, useMemo } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

// Sample service request data
const serviceRequests = [
  { id: 1, type: "Storm Damage", lat: 40.7128, lng: -74.006, location: "New York, NY", date: "2024-02-05", icon: "cyclone" },
  { id: 2, type: "Water Loss", lat: 34.0522, lng: -118.2437, location: "Los Angeles, CA", date: "2024-02-08", icon: "opacity" },
  { id: 3, type: "Structural", lat: 41.8781, lng: -87.6298, location: "Chicago, IL", date: "2024-01-28", icon: "architecture" },
  { id: 4, type: "Storm Damage", lat: 29.7604, lng: -95.3698, location: "Houston, TX", date: "2024-02-10", icon: "cyclone" },
  { id: 5, type: "Chimney Collapse", lat: 33.4484, lng: -112.074, location: "Phoenix, AZ", date: "2024-02-03", icon: "report_problem" },
  { id: 6, type: "Water Loss", lat: 39.9526, lng: -75.1652, location: "Philadelphia, PA", date: "2024-02-06", icon: "opacity" },
  { id: 7, type: "Large Loss", lat: 32.7767, lng: -96.797, location: "Dallas, TX", date: "2024-01-30", icon: "domain_disabled" },
  { id: 8, type: "HVAC/Electrical", lat: 37.7749, lng: -122.4194, location: "San Francisco, CA", date: "2024-02-09", icon: "electrical_services" },
  { id: 9, type: "Storm Damage", lat: 25.7617, lng: -80.1918, location: "Miami, FL", date: "2024-02-11", icon: "cyclone" },
  { id: 10, type: "Component Failure", lat: 42.3601, lng: -71.0589, location: "Boston, MA", date: "2024-02-04", icon: "construction" },
  { id: 11, type: "Structural", lat: 47.6062, lng: -122.3321, location: "Seattle, WA", date: "2024-02-07", icon: "architecture" },
  { id: 12, type: "Fortified", lat: 33.7490, lng: -84.3880, location: "Atlanta, GA", date: "2024-02-02", icon: "shield" },
  { id: 13, type: "Water Loss", lat: 39.7392, lng: -104.9903, location: "Denver, CO", date: "2024-02-01", icon: "opacity" },
  { id: 14, type: "Storm Damage", lat: 30.2672, lng: -97.7431, location: "Austin, TX", date: "2024-02-10", icon: "cyclone" },
  { id: 15, type: "Large Loss", lat: 36.1699, lng: -115.1398, location: "Las Vegas, NV", date: "2024-01-29", icon: "domain_disabled" },
];

const serviceTypes = [
  "All Services",
  "Storm Damage",
  "Water Loss",
  "Structural",
  "Fortified",
  "Chimney Collapse",
  "Large Loss",
  "Component Failure",
  "HVAC/Electrical",
];

const getMarkerColor = (type: string) => {
  const colors: { [key: string]: string } = {
    "Storm Damage": "#00f2ff",
    "Water Loss": "#3b82f6",
    "Structural": "#ef4444",
    "Fortified": "#10b981",
    "Chimney Collapse": "#f59e0b",
    "Large Loss": "#8b5cf6",
    "Component Failure": "#ec4899",
    "HVAC/Electrical": "#f97316",
  };
  return colors[type] || "#00f2ff";
};

export default function InteractiveMap() {
  const [selectedFilter, setSelectedFilter] = useState("All Services");
  const [selectedMarker, setSelectedMarker] = useState<typeof serviceRequests[0] | null>(null);
  const [viewState, setViewState] = useState({
    longitude: -95.7129,
    latitude: 37.0902,
    zoom: 3.5,
    pitch: 45,
    bearing: 0,
  });

  const filteredRequests = useMemo(() => {
    if (selectedFilter === "All Services") return serviceRequests;
    return serviceRequests.filter((req) => req.type === selectedFilter);
  }, [selectedFilter]);

  return (
    <section className="py-32 bg-section-dark relative overflow-hidden" id="map">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[150px]"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-primary uppercase tracking-[0.4em] mb-6">
            Live Investigation Network
          </h2>
          <h3 className="text-5xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">
            Real-Time Service <br />
            <span className="text-primary">Intelligence Map</span>
          </h3>
          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto font-light">
            Interactive 3D visualization of our nationwide forensic engineering operations.
            Filter by investigation type to explore our active case portfolio.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          {serviceTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedFilter(type)}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all border ${
                selectedFilter === type
                  ? "bg-primary text-background-dark border-primary shadow-[0_0_20px_rgba(0,242,255,0.3)]"
                  : "bg-white/5 text-gray-400 border-white/10 hover:border-primary/50 hover:text-primary"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-4xl font-black text-primary mb-2">
              {filteredRequests.length}
            </div>
            <div className="text-xs uppercase tracking-wider text-gray-400 font-bold">
              Active Cases
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-4xl font-black text-primary mb-2">24h</div>
            <div className="text-xs uppercase tracking-wider text-gray-400 font-bold">
              Response Time
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-4xl font-black text-primary mb-2">50+</div>
            <div className="text-xs uppercase tracking-wider text-gray-400 font-bold">
              States Covered
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-4xl font-black text-primary mb-2">98%</div>
            <div className="text-xs uppercase tracking-wider text-gray-400 font-bold">
              Client Satisfaction
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-[600px] bg-background-dark">
          <Map
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
            style={{ width: "100%", height: "100%" }}
            attributionControl={false}
          >
            <NavigationControl position="top-right" />

            {filteredRequests.map((request) => (
              <Marker
                key={request.id}
                longitude={request.lng}
                latitude={request.lat}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelectedMarker(request);
                }}
              >
                <div className="cursor-pointer group relative">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-125 border-2 border-white/20"
                    style={{
                      backgroundColor: getMarkerColor(request.type),
                      boxShadow: `0 0 20px ${getMarkerColor(request.type)}80`,
                    }}
                  >
                    <span className="material-symbols-outlined text-white text-xl">
                      {request.icon}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/50"></div>
                </div>
              </Marker>
            ))}

            {selectedMarker && (
              <Popup
                longitude={selectedMarker.lng}
                latitude={selectedMarker.lat}
                anchor="top"
                onClose={() => setSelectedMarker(null)}
                closeButton={false}
                className="custom-popup"
              >
                <div className="bg-section-dark border border-white/10 rounded-xl p-4 min-w-[250px]">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: getMarkerColor(selectedMarker.type),
                      }}
                    >
                      <span className="material-symbols-outlined text-white text-xl">
                        {selectedMarker.icon}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedMarker(null)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <span className="material-icons text-sm">close</span>
                    </button>
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2">
                    {selectedMarker.type}
                  </h4>
                  <p className="text-gray-400 text-sm mb-2">
                    <span className="material-icons text-xs inline-block align-middle mr-1">
                      location_on
                    </span>
                    {selectedMarker.location}
                  </p>
                  <p className="text-gray-500 text-xs">
                    <span className="material-icons text-xs inline-block align-middle mr-1">
                      schedule
                    </span>
                    Submitted: {selectedMarker.date}
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <span className="text-primary text-xs font-bold uppercase tracking-wider">
                      Investigation Active
                    </span>
                  </div>
                </div>
              </Popup>
            )}
          </Map>

          {/* Map Overlay Info */}
          <div className="absolute bottom-6 left-6 bg-section-dark/90 backdrop-blur-md border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-white font-bold text-sm uppercase tracking-wider">
                Live Network
              </span>
            </div>
            <p className="text-gray-400 text-xs">
              3D visualization • Click markers for details
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
            Investigation Type Legend
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {serviceTypes.slice(1).map((type) => (
              <div key={type} className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getMarkerColor(type) }}
                ></div>
                <span className="text-gray-400 text-sm">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
