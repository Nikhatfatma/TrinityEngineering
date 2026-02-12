"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useTheme } from "@/contexts/ThemeContext";
import "maplibre-gl/dist/maplibre-gl.css";

// Dynamically import Map components to avoid SSR issues
const Map = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.default), { ssr: false });
const Marker = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.Popup), { ssr: false });
const NavigationControl = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.NavigationControl), { ssr: false });

// Sample service request data - Multiple pins across US cities
const serviceRequests = [
  // Major Cities - East Coast
  { id: 1, type: "Storm Damage", lat: 40.7128, lng: -74.006, location: "New York, NY", date: "2024-02-05", icon: "cyclone" },
  { id: 2, type: "Water Loss", lat: 40.7589, lng: -73.9851, location: "Manhattan, NY", date: "2024-02-12", icon: "opacity" },
  { id: 3, type: "Structural", lat: 40.6782, lng: -73.9442, location: "Brooklyn, NY", date: "2024-02-08", icon: "architecture" },
  { id: 4, type: "Water Loss", lat: 39.9526, lng: -75.1652, location: "Philadelphia, PA", date: "2024-02-06", icon: "opacity" },
  { id: 5, type: "Component Failure", lat: 42.3601, lng: -71.0589, location: "Boston, MA", date: "2024-02-04", icon: "construction" },
  { id: 6, type: "HVAC/Electrical", lat: 42.3736, lng: -71.1097, location: "Cambridge, MA", date: "2024-02-11", icon: "electrical_services" },
  { id: 7, type: "Storm Damage", lat: 38.9072, lng: -77.0369, location: "Washington, DC", date: "2024-02-09", icon: "cyclone" },
  
  // Florida - High Activity
  { id: 8, type: "Storm Damage", lat: 25.7617, lng: -80.1918, location: "Miami, FL", date: "2024-02-11", icon: "cyclone" },
  { id: 9, type: "Water Loss", lat: 26.1224, lng: -80.1373, location: "Fort Lauderdale, FL", date: "2024-02-10", icon: "opacity" },
  { id: 10, type: "Storm Damage", lat: 28.5383, lng: -81.3792, location: "Orlando, FL", date: "2024-02-07", icon: "cyclone" },
  { id: 11, type: "FORTIFIED", lat: 27.9506, lng: -82.4572, location: "Tampa, FL", date: "2024-02-05", icon: "shield" },
  { id: 12, type: "Storm Damage", lat: 30.3322, lng: -81.6557, location: "Jacksonville, FL", date: "2024-02-13", icon: "cyclone" },
  
  // Texas
  { id: 13, type: "Storm Damage", lat: 29.7604, lng: -95.3698, location: "Houston, TX", date: "2024-02-10", icon: "cyclone" },
  { id: 14, type: "Large Loss", lat: 32.7767, lng: -96.797, location: "Dallas, TX", date: "2024-01-30", icon: "domain_disabled" },
  { id: 15, type: "Storm Damage", lat: 30.2672, lng: -97.7431, location: "Austin, TX", date: "2024-02-10", icon: "cyclone" },
  { id: 16, type: "Water Loss", lat: 29.4241, lng: -98.4936, location: "San Antonio, TX", date: "2024-02-09", icon: "opacity" },
  
  // Midwest
  { id: 17, type: "Structural", lat: 41.8781, lng: -87.6298, location: "Chicago, IL", date: "2024-01-28", icon: "architecture" },
  { id: 18, type: "Water Loss", lat: 39.0997, lng: -94.5786, location: "Kansas City, MO", date: "2024-02-08", icon: "opacity" },
  { id: 19, type: "Component Failure", lat: 39.7684, lng: -86.1581, location: "Indianapolis, IN", date: "2024-02-11", icon: "construction" },
  { id: 20, type: "Structural", lat: 38.6270, lng: -90.1994, location: "St. Louis, MO", date: "2024-02-06", icon: "architecture" },
  { id: 21, type: "Storm Damage", lat: 44.9778, lng: -93.2650, location: "Minneapolis, MN", date: "2024-02-12", icon: "cyclone" },
  
  // South
  { id: 22, type: "FORTIFIED", lat: 33.7490, lng: -84.3880, location: "Atlanta, GA", date: "2024-02-02", icon: "shield" },
  { id: 23, type: "Water Loss", lat: 35.2271, lng: -80.8431, location: "Charlotte, NC", date: "2024-02-10", icon: "opacity" },
  { id: 24, type: "Storm Damage", lat: 35.1495, lng: -90.0490, location: "Memphis, TN", date: "2024-02-11", icon: "cyclone" },
  { id: 25, type: "Component Failure", lat: 36.1627, lng: -86.7816, location: "Nashville, TN", date: "2024-02-09", icon: "construction" },
  { id: 26, type: "Storm Damage", lat: 29.9511, lng: -90.0715, location: "New Orleans, LA", date: "2024-02-13", icon: "cyclone" },
  
  // West Coast
  { id: 27, type: "Water Loss", lat: 34.0522, lng: -118.2437, location: "Los Angeles, CA", date: "2024-02-08", icon: "opacity" },
  { id: 28, type: "Structural", lat: 33.9416, lng: -118.4085, location: "Santa Monica, CA", date: "2024-02-07", icon: "architecture" },
  { id: 29, type: "HVAC/Electrical", lat: 37.7749, lng: -122.4194, location: "San Francisco, CA", date: "2024-02-09", icon: "electrical_services" },
  { id: 30, type: "Water Loss", lat: 37.3382, lng: -121.8863, location: "San Jose, CA", date: "2024-02-10", icon: "opacity" },
  { id: 31, type: "Structural", lat: 32.7157, lng: -117.1611, location: "San Diego, CA", date: "2024-02-06", icon: "architecture" },
  { id: 32, type: "Structural", lat: 47.6062, lng: -122.3321, location: "Seattle, WA", date: "2024-02-07", icon: "architecture" },
  { id: 33, type: "Water Loss", lat: 45.5152, lng: -122.6784, location: "Portland, OR", date: "2024-02-11", icon: "opacity" },
  
  // Mountain/Southwest
  { id: 34, type: "Water Loss", lat: 39.7392, lng: -104.9903, location: "Denver, CO", date: "2024-02-01", icon: "opacity" },
  { id: 35, type: "Chimney Collapse", lat: 33.4484, lng: -112.074, location: "Phoenix, AZ", date: "2024-02-03", icon: "report_problem" },
  { id: 36, type: "Large Loss", lat: 36.1699, lng: -115.1398, location: "Las Vegas, NV", date: "2024-01-29", icon: "domain_disabled" },
  { id: 37, type: "Water Loss", lat: 40.7608, lng: -111.8910, location: "Salt Lake City, UT", date: "2024-02-08", icon: "opacity" },
  { id: 38, type: "Component Failure", lat: 35.0844, lng: -106.6504, location: "Albuquerque, NM", date: "2024-02-12", icon: "construction" },
  
  // Additional Cities
  { id: 39, type: "Storm Damage", lat: 39.2904, lng: -76.6122, location: "Baltimore, MD", date: "2024-02-13", icon: "cyclone" },
  { id: 40, type: "Water Loss", lat: 33.4484, lng: -112.074, location: "Scottsdale, AZ", date: "2024-02-11", icon: "opacity" },
  { id: 41, type: "HVAC/Electrical", lat: 36.7783, lng: -119.4179, location: "Fresno, CA", date: "2024-02-10", icon: "electrical_services" },
  { id: 42, type: "Structural", lat: 35.4676, lng: -97.5164, location: "Oklahoma City, OK", date: "2024-02-09", icon: "architecture" },
  { id: 43, type: "Storm Damage", lat: 32.7555, lng: -97.3308, location: "Fort Worth, TX", date: "2024-02-12", icon: "cyclone" },
  { id: 44, type: "Component Failure", lat: 39.7294, lng: -121.8375, location: "Chico, CA", date: "2024-02-08", icon: "construction" },
  { id: 45, type: "Water Loss", lat: 43.0389, lng: -87.9065, location: "Milwaukee, WI", date: "2024-02-11", icon: "opacity" },
  { id: 46, type: "Structural", lat: 41.2565, lng: -95.9345, location: "Omaha, NE", date: "2024-02-10", icon: "architecture" },
  { id: 47, type: "FORTIFIED", lat: 35.7796, lng: -78.6382, location: "Raleigh, NC", date: "2024-02-07", icon: "shield" },
  { id: 48, type: "Storm Damage", lat: 32.2217, lng: -110.9265, location: "Tucson, AZ", date: "2024-02-12", icon: "cyclone" },
  { id: 49, type: "Water Loss", lat: 37.2296, lng: -80.4139, location: "Blacksburg, VA", date: "2024-02-09", icon: "opacity" },
  { id: 50, type: "Component Failure", lat: 42.8864, lng: -78.8784, location: "Buffalo, NY", date: "2024-02-13", icon: "construction" },
];

const serviceTypes = [
  "All Services",
  "Storm Damage",
  "Water Loss",
  "Structural",
  "FORTIFIED",
  "Chimney Collapse",
  "Large Loss",
  "Component Failure",
  "HVAC/Electrical",
];

const getMarkerColor = (type: string) => {
  const colors: { [key: string]: string } = {
    "Storm Damage": "#3B82F6",
    "Water Loss": "#0EA5E9",
    "Structural": "#EF4444",
    "FORTIFIED": "#10B981",
    "Chimney Collapse": "#F59E0B",
    "Large Loss": "#8B5CF6",
    "Component Failure": "#EC4899",
    "HVAC/Electrical": "#F97316",
  };
  return colors[type] || "#3B82F6";
};

export default function InteractiveMap() {
  const { theme } = useTheme();
  const mapRef = useRef<any>(null);
  const [selectedFilter, setSelectedFilter] = useState("All Services");
  const [selectedMarker, setSelectedMarker] = useState<typeof serviceRequests[0] | null>(null);
  const [mapViewType, setMapViewType] = useState<"streets" | "satellite">("satellite");
  const [viewState, setViewState] = useState({
    longitude: -95.7129,
    latitude: 37.0902,
    zoom: 4,
    pitch: 60,
    bearing: 0,
  });

  const filteredRequests = useMemo(() => {
    if (selectedFilter === "All Services") return serviceRequests;
    return serviceRequests.filter((req) => req.type === selectedFilter);
  }, [selectedFilter]);

  const handleFlyTo = useCallback((latitude: number, longitude: number, zoom: number = 14) => {
    mapRef.current?.flyTo({ 
      center: [longitude, latitude], 
      zoom, 
      duration: 2000, 
      pitch: 60,
      bearing: 45 
    });
  }, []);

  // Map styles - Street and Satellite views
  const getMapStyle = (): any => {
    if (mapViewType === "satellite") {
      // Satellite imagery with labels
      return {
        version: 8 as const,
        sources: {
          'satellite': {
            type: 'raster' as const,
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256,
            attribution: '© Esri, DigitalGlobe, GeoEye, Earthstar Geographics'
          },
          'hybrid-labels': {
            type: 'raster' as const,
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256
          }
        },
        layers: [
          {
            id: 'satellite-layer',
            type: 'raster' as const,
            source: 'satellite',
            minzoom: 0,
            maxzoom: 19
          },
          {
            id: 'hybrid-labels-layer',
            type: 'raster' as const,
            source: 'hybrid-labels',
            minzoom: 0,
            maxzoom: 19
          }
        ],
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf'
      };
    }
    
    // Street view with detail
    return theme === 'dark'
      ? {
          version: 8 as const,
          sources: {
            'osm-tiles': {
              type: 'raster' as const,
              tiles: [
                'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
              ],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors'
            }
          },
          layers: [
            {
              id: 'osm-tiles-layer',
              type: 'raster' as const,
              source: 'osm-tiles',
              minzoom: 0,
              maxzoom: 19
            }
          ],
          glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf'
        }
      : {
          version: 8 as const,
          sources: {
            'osm-tiles': {
              type: 'raster' as const,
              tiles: [
                'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
              ],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors'
            }
          },
          layers: [
            {
              id: 'osm-tiles-layer',
              type: 'raster' as const,
              source: 'osm-tiles',
              minzoom: 0,
              maxzoom: 19
            }
          ],
          glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf'
        };
  };

  const mapStyle = getMapStyle();

  return (
    <section className="py-24 bg-section-light dark:bg-section-dark" id="map">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent px-4 py-2 rounded-full mb-6">
            <span className="material-symbols-outlined text-sm">public</span>
            <span className="font-bold text-xs uppercase tracking-wider">
              Nationwide Coverage
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
            Active Investigation Network
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-4">
            Live view of 50+ active forensic engineering investigations across the United States. 
            Interactive 3D map with street-level detail, satellite imagery, and GPS-style navigation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-green-500">circle</span>
              <span>50+ Active Cases</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">satellite</span>
              <span>Satellite View</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">3d_rotation</span>
              <span>3D Controls</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">zoom_in</span>
              <span>Street-Level</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          {serviceTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedFilter(type)}
              className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all border-2 ${
                selectedFilter === type
                  ? "bg-primary dark:bg-accent text-white border-primary dark:border-accent shadow-lg"
                  : "bg-white dark:bg-background-dark text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-accent"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Quick City Navigation */}
        <div className="mb-8 bg-white dark:bg-section-dark rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-800 shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary dark:text-accent">flight_takeoff</span>
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Quick City View - Fly to Street-Level Detail
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              serviceRequests[0], // New York
              serviceRequests[7], // Miami
              serviceRequests[12], // Houston
              serviceRequests[13], // Dallas
              serviceRequests[16], // Chicago
              serviceRequests[21], // Atlanta
              serviceRequests[26], // Los Angeles
              serviceRequests[28], // San Francisco
              serviceRequests[31], // Seattle
              serviceRequests[33], // Denver
              serviceRequests[4], // Boston
              serviceRequests[3], // Philadelphia
            ].map((city) => (
              <button
                key={city.id}
                onClick={() => handleFlyTo(city.lat, city.lng, 15)}
                className="inline-flex items-center gap-2 bg-gray-50 dark:bg-background-dark hover:bg-primary/10 dark:hover:bg-accent/10 px-4 py-2 rounded-lg font-semibold text-sm text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-all border border-gray-200 dark:border-gray-700"
              >
                <span className="material-symbols-outlined text-base" style={{ color: getMarkerColor(city.type) }}>
                  {city.icon}
                </span>
                {city.location.split(',')[0]}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
            Click any city to zoom in and see streets, buildings, and neighborhoods • Switch to satellite view for aerial imagery
          </p>
        </div>

        {/* Map Container */}
        <div className="relative bg-white dark:bg-background-dark rounded-lg shadow-xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Map Controls Overlay */}
          <div className="absolute top-6 left-6 z-10 space-y-3">
            {/* Map View Type Toggle */}
            <div className="bg-white/95 dark:bg-section-dark/95 backdrop-blur-sm rounded-xl p-3 border border-gray-200 dark:border-gray-800 shadow-lg">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Map View
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setMapViewType("streets")}
                  className={`flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg font-semibold text-xs transition-all ${
                    mapViewType === "streets"
                      ? "bg-primary dark:bg-accent text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">map</span>
                  Streets
                </button>
                <button
                  onClick={() => setMapViewType("satellite")}
                  className={`flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg font-semibold text-xs transition-all ${
                    mapViewType === "satellite"
                      ? "bg-primary dark:bg-accent text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">satellite</span>
                  Satellite
                </button>
              </div>
            </div>

            {/* Reset View Button */}
            <div className="bg-white/95 dark:bg-section-dark/95 backdrop-blur-sm rounded-xl p-3 border border-gray-200 dark:border-gray-800 shadow-lg">
              <button
                onClick={() => {
                  mapRef.current?.flyTo({
                    center: [-95.7129, 37.0902],
                    zoom: 4,
                    pitch: 60,
                    bearing: 0,
                    duration: 2000
                  });
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary dark:bg-accent/10 dark:hover:bg-accent text-primary dark:text-accent hover:text-white px-4 py-2 rounded-lg font-semibold text-xs transition-all"
              >
                <span className="material-symbols-outlined text-base">home</span>
                Reset View
              </button>
            </div>
          </div>

          <div className="h-[600px] md:h-[700px] lg:h-[800px] relative">
            {typeof window !== 'undefined' && (
              <Map
                ref={mapRef}
                {...viewState}
                onMove={(evt) => setViewState(evt.viewState)}
                style={{ width: "100%", height: "100%" }}
                mapStyle={mapStyle}
                minZoom={3}
                maxZoom={19}
                maxPitch={85}
              >
                <NavigationControl position="top-right" showCompass={true} showZoom={true} visualizePitch={true} />

                {filteredRequests.map((marker) => (
                  <Marker
                    key={marker.id}
                    longitude={marker.lng}
                    latitude={marker.lat}
                    anchor="bottom"
                    onClick={(e) => {
                      e.originalEvent.stopPropagation();
                      setSelectedMarker(marker);
                      handleFlyTo(marker.lat, marker.lng);
                    }}
                  >
                    <div className="relative cursor-pointer group">
                      {/* Pulsing Ring */}
                      <div
                        className="absolute inset-0 w-12 h-12 rounded-full animate-ping opacity-40"
                        style={{
                          backgroundColor: getMarkerColor(marker.type),
                        }}
                      ></div>
                      
                      {/* Pin Shadow */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/30 rounded-full blur-sm"></div>
                      
                      {/* Main Pin */}
                      <div className="relative flex flex-col items-center">
                        {/* Pin Head */}
                        <div
                          className="relative w-10 h-10 rounded-full border-4 border-white shadow-2xl flex items-center justify-center group-hover:scale-125 transition-transform z-10"
                          style={{
                            backgroundColor: getMarkerColor(marker.type),
                          }}
                        >
                          <span className="material-symbols-outlined text-white text-lg">
                            {marker.icon}
                          </span>
                        </div>
                        
                        {/* Pin Stem */}
                        <div 
                          className="w-1 h-6 -mt-1"
                          style={{ backgroundColor: getMarkerColor(marker.type) }}
                        ></div>
                        
                        {/* Pin Point */}
                        <div 
                          className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[8px] border-l-transparent border-r-transparent -mt-1"
                          style={{ borderTopColor: getMarkerColor(marker.type) }}
                        ></div>
                      </div>
                    </div>
                  </Marker>
                ))}

                {selectedMarker && (
                  <Popup
                    anchor="top"
                    longitude={selectedMarker.lng}
                    latitude={selectedMarker.lat}
                    onClose={() => setSelectedMarker(null)}
                    closeButton={false}
                    className="map-popup"
                  >
                    <div className="bg-white dark:bg-section-dark rounded-lg shadow-xl border-2 border-gray-200 dark:border-gray-800 p-4 min-w-[250px]">
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: getMarkerColor(selectedMarker.type),
                          }}
                        >
                          <span className="material-symbols-outlined text-white text-xl">
                            {selectedMarker.icon}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                            {selectedMarker.type}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedMarker.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mb-3">
                        <span className="material-icons text-sm">calendar_today</span>
                        <span>{selectedMarker.date}</span>
                      </div>
                      <button
                        onClick={() => setSelectedMarker(null)}
                        className="w-full bg-primary dark:bg-accent text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-dark dark:hover:bg-accent-light transition-all"
                      >
                        Close
                      </button>
                    </div>
                  </Popup>
                )}
              </Map>
            )}
          </div>

          {/* Stats Bar */}
          <div className="bg-white/95 dark:bg-background-dark/95 backdrop-blur-md p-6 border-t-2 border-gray-200 dark:border-gray-800">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-2xl font-black text-primary dark:text-accent">
                    {filteredRequests.length}
                  </div>
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Active Cases
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-primary dark:text-accent">
                    {serviceTypes.length - 1}
                  </div>
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Service Types
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-primary dark:text-accent">
                    50
                  </div>
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    States Covered
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4">
                {["Storm Damage", "Water Loss", "Structural", "FORTIFIED"].map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getMarkerColor(type) }}
                    ></div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            href="/submit-inspection"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-light text-white px-8 py-4 rounded-lg font-bold text-base transition-all shadow-lg hover:shadow-xl"
          >
            <span className="material-symbols-outlined">send</span>
            Submit Inspection
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white dark:bg-section-dark hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-lg font-bold text-base transition-all border-2 border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-accent"
          >
            <span className="material-symbols-outlined">location_searching</span>
            Request New Coverage Areas
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white dark:bg-section-dark hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-lg font-bold text-base transition-all border-2 border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-accent"
          >
            <span className="material-symbols-outlined">request_quote</span>
            Request Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
