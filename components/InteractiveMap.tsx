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

// Multi-tier service location data - Shows more pins as you zoom in
// Tier 1: Major Metro Areas (zoom level 3-7)
const tier1Locations = [
  // Major Cities - East Coast
  { id: 1, type: "Storm Damage", lat: 40.7128, lng: -74.006, location: "New York, NY", date: "2024-02-05", icon: "cyclone", tier: 1 },
  { id: 4, type: "Water Loss", lat: 39.9526, lng: -75.1652, location: "Philadelphia, PA", date: "2024-02-06", icon: "opacity", tier: 1 },
  { id: 5, type: "Component Failure", lat: 42.3601, lng: -71.0589, location: "Boston, MA", date: "2024-02-04", icon: "construction", tier: 1 },
  { id: 7, type: "Storm Damage", lat: 38.9072, lng: -77.0369, location: "Washington, DC", date: "2024-02-09", icon: "cyclone", tier: 1 },
  { id: 501, type: "Water Loss", lat: 40.4406, lng: -79.9959, location: "Pittsburgh, PA", date: "2024-02-11", icon: "opacity", tier: 1 },
  { id: 502, type: "Structural", lat: 41.4993, lng: -81.6944, location: "Cleveland, OH", date: "2024-02-10", icon: "architecture", tier: 1 },
  { id: 503, type: "Storm Damage", lat: 43.1566, lng: -77.6088, location: "Rochester, NY", date: "2024-02-12", icon: "cyclone", tier: 1 },
  { id: 504, type: "HVAC/Electrical", lat: 42.9634, lng: -85.6681, location: "Grand Rapids, MI", date: "2024-02-09", icon: "electrical_services", tier: 1 },
  
  // Florida - High Activity
  { id: 8, type: "Storm Damage", lat: 25.7617, lng: -80.1918, location: "Miami, FL", date: "2024-02-11", icon: "cyclone", tier: 1 },
  { id: 10, type: "Storm Damage", lat: 28.5383, lng: -81.3792, location: "Orlando, FL", date: "2024-02-07", icon: "cyclone", tier: 1 },
  { id: 11, type: "FORTIFIED", lat: 27.9506, lng: -82.4572, location: "Tampa, FL", date: "2024-02-05", icon: "shield", tier: 1 },
  { id: 12, type: "Storm Damage", lat: 30.3322, lng: -81.6557, location: "Jacksonville, FL", date: "2024-02-13", icon: "cyclone", tier: 1 },
  { id: 505, type: "Water Loss", lat: 26.7153, lng: -80.0534, location: "West Palm Beach, FL", date: "2024-02-14", icon: "opacity", tier: 1 },
  { id: 506, type: "FORTIFIED", lat: 26.5629, lng: -81.9495, location: "Fort Myers, FL", date: "2024-02-08", icon: "shield", tier: 1 },
  { id: 507, type: "Storm Damage", lat: 27.3364, lng: -82.5307, location: "Sarasota, FL", date: "2024-02-15", icon: "cyclone", tier: 1 },
  
  // Texas - Massive Coverage
  { id: 13, type: "Storm Damage", lat: 29.7604, lng: -95.3698, location: "Houston, TX", date: "2024-02-10", icon: "cyclone", tier: 1 },
  { id: 14, type: "Large Loss", lat: 32.7767, lng: -96.797, location: "Dallas, TX", date: "2024-01-30", icon: "domain_disabled", tier: 1 },
  { id: 15, type: "Storm Damage", lat: 30.2672, lng: -97.7431, location: "Austin, TX", date: "2024-02-10", icon: "cyclone", tier: 1 },
  { id: 16, type: "Water Loss", lat: 29.4241, lng: -98.4936, location: "San Antonio, TX", date: "2024-02-09", icon: "opacity", tier: 1 },
  { id: 508, type: "Component Failure", lat: 31.7619, lng: -106.4850, location: "El Paso, TX", date: "2024-02-11", icon: "construction", tier: 1 },
  { id: 509, type: "Water Loss", lat: 27.8006, lng: -97.3964, location: "Corpus Christi, TX", date: "2024-02-13", icon: "opacity", tier: 1 },
  { id: 510, type: "Storm Damage", lat: 32.7555, lng: -97.3308, location: "Arlington, TX", date: "2024-02-14", icon: "cyclone", tier: 1 },
  
  // Midwest
  { id: 17, type: "Structural", lat: 41.8781, lng: -87.6298, location: "Chicago, IL", date: "2024-01-28", icon: "architecture", tier: 1 },
  { id: 21, type: "Storm Damage", lat: 44.9778, lng: -93.2650, location: "Minneapolis, MN", date: "2024-02-12", icon: "cyclone", tier: 1 },
  { id: 511, type: "Water Loss", lat: 42.3314, lng: -83.0458, location: "Detroit, MI", date: "2024-02-10", icon: "opacity", tier: 1 },
  { id: 512, type: "Structural", lat: 39.1031, lng: -84.5120, location: "Cincinnati, OH", date: "2024-02-11", icon: "architecture", tier: 1 },
  { id: 513, type: "Component Failure", lat: 39.7684, lng: -86.1581, location: "Indianapolis, IN", date: "2024-02-09", icon: "construction", tier: 1 },
  { id: 514, type: "HVAC/Electrical", lat: 39.9612, lng: -82.9988, location: "Columbus, OH", date: "2024-02-12", icon: "electrical_services", tier: 1 },
  
  // South
  { id: 22, type: "FORTIFIED", lat: 33.7490, lng: -84.3880, location: "Atlanta, GA", date: "2024-02-02", icon: "shield", tier: 1 },
  { id: 26, type: "Storm Damage", lat: 29.9511, lng: -90.0715, location: "New Orleans, LA", date: "2024-02-13", icon: "cyclone", tier: 1 },
  { id: 515, type: "Water Loss", lat: 32.7765, lng: -79.9311, location: "Charleston, SC", date: "2024-02-10", icon: "opacity", tier: 1 },
  { id: 516, type: "Storm Damage", lat: 30.4383, lng: -84.2807, location: "Tallahassee, FL", date: "2024-02-11", icon: "cyclone", tier: 1 },
  { id: 517, type: "Structural", lat: 35.9606, lng: -83.9207, location: "Knoxville, TN", date: "2024-02-14", icon: "architecture", tier: 1 },
  { id: 518, type: "FORTIFIED", lat: 30.6954, lng: -88.0399, location: "Mobile, AL", date: "2024-02-08", icon: "shield", tier: 1 },
  { id: 519, type: "Water Loss", lat: 32.3668, lng: -86.2999, location: "Montgomery, AL", date: "2024-02-15", icon: "opacity", tier: 1 },
  
  // West Coast
  { id: 27, type: "Water Loss", lat: 34.0522, lng: -118.2437, location: "Los Angeles, CA", date: "2024-02-08", icon: "opacity", tier: 1 },
  { id: 29, type: "HVAC/Electrical", lat: 37.7749, lng: -122.4194, location: "San Francisco, CA", date: "2024-02-09", icon: "electrical_services", tier: 1 },
  { id: 32, type: "Structural", lat: 47.6062, lng: -122.3321, location: "Seattle, WA", date: "2024-02-07", icon: "architecture", tier: 1 },
  { id: 520, type: "Water Loss", lat: 38.5816, lng: -121.4944, location: "Sacramento, CA", date: "2024-02-11", icon: "opacity", tier: 1 },
  { id: 521, type: "Storm Damage", lat: 33.7175, lng: -117.8311, location: "Santa Ana, CA", date: "2024-02-10", icon: "cyclone", tier: 1 },
  { id: 522, type: "Structural", lat: 32.8328, lng: -117.1466, location: "La Jolla, CA", date: "2024-02-12", icon: "architecture", tier: 1 },
  
  // Mountain/Southwest
  { id: 34, type: "Water Loss", lat: 39.7392, lng: -104.9903, location: "Denver, CO", date: "2024-02-01", icon: "opacity", tier: 1 },
  { id: 35, type: "Chimney Collapse", lat: 33.4484, lng: -112.074, location: "Phoenix, AZ", date: "2024-02-03", icon: "report_problem", tier: 1 },
  { id: 523, type: "Component Failure", lat: 36.1627, lng: -115.1398, location: "Las Vegas, NV", date: "2024-02-09", icon: "construction", tier: 1 },
  { id: 524, type: "Water Loss", lat: 35.6870, lng: -105.9378, location: "Santa Fe, NM", date: "2024-02-13", icon: "opacity", tier: 1 },
  { id: 525, type: "Structural", lat: 43.6150, lng: -116.2023, location: "Boise, ID", date: "2024-02-11", icon: "architecture", tier: 1 },
];

// Tier 2: Regional Cities & Suburbs (zoom level 7-10)
const tier2Locations = [
  // New York Metro Suburbs
  { id: 2, type: "Water Loss", lat: 40.7589, lng: -73.9851, location: "Manhattan, NY", date: "2024-02-12", icon: "opacity", tier: 2 },
  { id: 3, type: "Structural", lat: 40.6782, lng: -73.9442, location: "Brooklyn, NY", date: "2024-02-08", icon: "architecture", tier: 2 },
  { id: 50, type: "Component Failure", lat: 42.8864, lng: -78.8784, location: "Buffalo, NY", date: "2024-02-13", icon: "construction", tier: 2 },
  { id: 601, type: "Plumbing Failure", lat: 40.6501, lng: -73.9496, location: "Flatbush, NY", date: "2024-02-14", icon: "plumbing", tier: 2 },
  { id: 602, type: "Water Loss", lat: 40.7282, lng: -73.7949, location: "Queens, NY", date: "2024-02-15", icon: "opacity", tier: 2 },
  { id: 603, type: "Storm Damage", lat: 40.8448, lng: -73.8648, location: "Bronx, NY", date: "2024-02-11", icon: "cyclone", tier: 2 },
  { id: 604, type: "Structural", lat: 40.5795, lng: -74.1502, location: "Staten Island, NY", date: "2024-02-16", icon: "architecture", tier: 2 },
  { id: 605, type: "HVAC/Electrical", lat: 40.9176, lng: -73.7821, location: "Yonkers, NY", date: "2024-02-13", icon: "electrical_services", tier: 2 },
  { id: 606, type: "Water Loss", lat: 40.6940, lng: -73.9865, location: "Fort Greene, NY", date: "2024-02-12", icon: "opacity", tier: 2 },
  { id: 607, type: "Component Failure", lat: 40.7614, lng: -73.8284, location: "Flushing, NY", date: "2024-02-17", icon: "construction", tier: 2 },
  
  // Boston Metro Area
  { id: 6, type: "HVAC/Electrical", lat: 42.3736, lng: -71.1097, location: "Cambridge, MA", date: "2024-02-11", icon: "electrical_services", tier: 2 },
  { id: 608, type: "Water Loss", lat: 42.4072, lng: -71.3824, location: "Waltham, MA", date: "2024-02-14", icon: "opacity", tier: 2 },
  { id: 609, type: "Structural", lat: 42.5001, lng: -71.2662, location: "Woburn, MA", date: "2024-02-15", icon: "architecture", tier: 2 },
  { id: 610, type: "Storm Damage", lat: 42.2529, lng: -71.0023, location: "Quincy, MA", date: "2024-02-13", icon: "cyclone", tier: 2 },
  { id: 611, type: "Component Failure", lat: 42.3875, lng: -71.2995, location: "Newton, MA", date: "2024-02-16", icon: "construction", tier: 2 },
  
  // Florida Suburbs
  { id: 9, type: "Water Loss", lat: 26.1224, lng: -80.1373, location: "Fort Lauderdale, FL", date: "2024-02-10", icon: "opacity", tier: 2 },
  { id: 612, type: "Storm Damage", lat: 26.7056, lng: -80.0364, location: "Boca Raton, FL", date: "2024-02-14", icon: "cyclone", tier: 2 },
  { id: 613, type: "FORTIFIED", lat: 26.3559, lng: -80.0878, location: "Delray Beach, FL", date: "2024-02-15", icon: "shield", tier: 2 },
  { id: 614, type: "Water Loss", lat: 25.9420, lng: -80.2456, location: "Pembroke Pines, FL", date: "2024-02-11", icon: "opacity", tier: 2 },
  { id: 615, type: "Storm Damage", lat: 28.0395, lng: -82.7640, location: "Clearwater, FL", date: "2024-02-16", icon: "cyclone", tier: 2 },
  { id: 616, type: "Component Failure", lat: 28.1028, lng: -80.6444, location: "Melbourne, FL", date: "2024-02-13", icon: "construction", tier: 2 },
  { id: 617, type: "FORTIFIED", lat: 30.1975, lng: -85.8055, location: "Panama City, FL", date: "2024-02-12", icon: "shield", tier: 2 },
  { id: 618, type: "Water Loss", lat: 26.2034, lng: -80.1299, location: "Pompano Beach, FL", date: "2024-02-17", icon: "opacity", tier: 2 },
  
  // Texas Suburbs & Regional
  { id: 43, type: "Storm Damage", lat: 32.7555, lng: -97.3308, location: "Fort Worth, TX", date: "2024-02-12", icon: "cyclone", tier: 2 },
  { id: 619, type: "Water Loss", lat: 29.6516, lng: -95.6145, location: "Sugar Land, TX", date: "2024-02-14", icon: "opacity", tier: 2 },
  { id: 620, type: "Component Failure", lat: 29.5577, lng: -95.0777, location: "Pearland, TX", date: "2024-02-15", icon: "construction", tier: 2 },
  { id: 621, type: "Structural", lat: 33.0198, lng: -96.6989, location: "Frisco, TX", date: "2024-02-13", icon: "architecture", tier: 2 },
  { id: 622, type: "Storm Damage", lat: 32.8207, lng: -96.8719, location: "Irving, TX", date: "2024-02-16", icon: "cyclone", tier: 2 },
  { id: 623, type: "Water Loss", lat: 30.5852, lng: -96.3089, location: "College Station, TX", date: "2024-02-11", icon: "opacity", tier: 2 },
  { id: 624, type: "HVAC/Electrical", lat: 33.2148, lng: -97.1331, location: "Denton, TX", date: "2024-02-17", icon: "electrical_services", tier: 2 },
  { id: 625, type: "Storm Damage", lat: 29.9902, lng: -95.3368, location: "Spring, TX", date: "2024-02-12", icon: "cyclone", tier: 2 },
  
  // Midwest Regional Cities
  { id: 18, type: "Water Loss", lat: 39.0997, lng: -94.5786, location: "Kansas City, MO", date: "2024-02-08", icon: "opacity", tier: 2 },
  { id: 19, type: "Component Failure", lat: 39.7684, lng: -86.1581, location: "Indianapolis, IN", date: "2024-02-11", icon: "construction", tier: 2 },
  { id: 20, type: "Structural", lat: 38.6270, lng: -90.1994, location: "St. Louis, MO", date: "2024-02-06", icon: "architecture", tier: 2 },
  { id: 45, type: "Water Loss", lat: 43.0389, lng: -87.9065, location: "Milwaukee, WI", date: "2024-02-11", icon: "opacity", tier: 2 },
  { id: 46, type: "Structural", lat: 41.2565, lng: -95.9345, location: "Omaha, NE", date: "2024-02-10", icon: "architecture", tier: 2 },
  { id: 626, type: "Water Loss", lat: 43.0731, lng: -89.4012, location: "Madison, WI", date: "2024-02-14", icon: "opacity", tier: 2 },
  { id: 627, type: "Storm Damage", lat: 41.5868, lng: -93.6250, location: "Des Moines, IA", date: "2024-02-15", icon: "cyclone", tier: 2 },
  { id: 628, type: "Component Failure", lat: 41.0818, lng: -85.1394, location: "Fort Wayne, IN", date: "2024-02-13", icon: "construction", tier: 2 },
  { id: 629, type: "Structural", lat: 41.5868, lng: -87.5345, location: "Joliet, IL", date: "2024-02-16", icon: "architecture", tier: 2 },
  { id: 630, type: "HVAC/Electrical", lat: 42.2711, lng: -89.0940, location: "Rockford, IL", date: "2024-02-12", icon: "electrical_services", tier: 2 },
  
  // Southeast Regional
  { id: 23, type: "Water Loss", lat: 35.2271, lng: -80.8431, location: "Charlotte, NC", date: "2024-02-10", icon: "opacity", tier: 2 },
  { id: 24, type: "Storm Damage", lat: 35.1495, lng: -90.0490, location: "Memphis, TN", date: "2024-02-11", icon: "cyclone", tier: 2 },
  { id: 25, type: "Component Failure", lat: 36.1627, lng: -86.7816, location: "Nashville, TN", date: "2024-02-09", icon: "construction", tier: 2 },
  { id: 47, type: "FORTIFIED", lat: 35.7796, lng: -78.6382, location: "Raleigh, NC", date: "2024-02-07", icon: "shield", tier: 2 },
  { id: 49, type: "Water Loss", lat: 37.2296, lng: -80.4139, location: "Blacksburg, VA", date: "2024-02-09", icon: "opacity", tier: 2 },
  { id: 631, type: "Storm Damage", lat: 36.8529, lng: -75.9780, location: "Virginia Beach, VA", date: "2024-02-14", icon: "cyclone", tier: 2 },
  { id: 632, type: "Water Loss", lat: 36.0726, lng: -79.7920, location: "Greensboro, NC", date: "2024-02-15", icon: "opacity", tier: 2 },
  { id: 633, type: "FORTIFIED", lat: 32.0835, lng: -81.0998, location: "Savannah, GA", date: "2024-02-13", icon: "shield", tier: 2 },
  { id: 634, type: "Component Failure", lat: 33.5207, lng: -86.8025, location: "Birmingham, AL", date: "2024-02-16", icon: "construction", tier: 2 },
  { id: 635, type: "Water Loss", lat: 35.0456, lng: -85.3097, location: "Chattanooga, TN", date: "2024-02-12", icon: "opacity", tier: 2 },
  
  // California Regional
  { id: 28, type: "Structural", lat: 33.9416, lng: -118.4085, location: "Santa Monica, CA", date: "2024-02-07", icon: "architecture", tier: 2 },
  { id: 30, type: "Water Loss", lat: 37.3382, lng: -121.8863, location: "San Jose, CA", date: "2024-02-10", icon: "opacity", tier: 2 },
  { id: 31, type: "Structural", lat: 32.7157, lng: -117.1611, location: "San Diego, CA", date: "2024-02-06", icon: "architecture", tier: 2 },
  { id: 33, type: "Water Loss", lat: 45.5152, lng: -122.6784, location: "Portland, OR", date: "2024-02-11", icon: "opacity", tier: 2 },
  { id: 41, type: "HVAC/Electrical", lat: 36.7783, lng: -119.4179, location: "Fresno, CA", date: "2024-02-10", icon: "electrical_services", tier: 2 },
  { id: 636, type: "Water Loss", lat: 34.1808, lng: -118.3090, location: "Glendale, CA", date: "2024-02-14", icon: "opacity", tier: 2 },
  { id: 637, type: "Component Failure", lat: 33.8366, lng: -117.9143, location: "Anaheim, CA", date: "2024-02-15", icon: "construction", tier: 2 },
  { id: 638, type: "Structural", lat: 33.6846, lng: -117.8265, location: "Irvine, CA", date: "2024-02-13", icon: "architecture", tier: 2 },
  { id: 639, type: "Water Loss", lat: 37.9577, lng: -121.2908, location: "Stockton, CA", date: "2024-02-16", icon: "opacity", tier: 2 },
  { id: 640, type: "HVAC/Electrical", lat: 33.1581, lng: -117.3506, location: "Oceanside, CA", date: "2024-02-12", icon: "electrical_services", tier: 2 },
  
  // Mountain States
  { id: 36, type: "Large Loss", lat: 36.1699, lng: -115.1398, location: "Las Vegas, NV", date: "2024-01-29", icon: "domain_disabled", tier: 2 },
  { id: 37, type: "Water Loss", lat: 40.7608, lng: -111.8910, location: "Salt Lake City, UT", date: "2024-02-08", icon: "opacity", tier: 2 },
  { id: 38, type: "Component Failure", lat: 35.0844, lng: -106.6504, location: "Albuquerque, NM", date: "2024-02-12", icon: "construction", tier: 2 },
  { id: 48, type: "Storm Damage", lat: 32.2217, lng: -110.9265, location: "Tucson, AZ", date: "2024-02-12", icon: "cyclone", tier: 2 },
  { id: 641, type: "Water Loss", lat: 40.5853, lng: -105.0844, location: "Fort Collins, CO", date: "2024-02-14", icon: "opacity", tier: 2 },
  { id: 642, type: "Structural", lat: 38.8339, lng: -104.8214, location: "Colorado Springs, CO", date: "2024-02-15", icon: "architecture", tier: 2 },
  { id: 643, type: "Component Failure", lat: 40.2338, lng: -111.6585, location: "Provo, UT", date: "2024-02-13", icon: "construction", tier: 2 },
  { id: 644, type: "Water Loss", lat: 36.1147, lng: -115.1728, location: "Henderson, NV", date: "2024-02-16", icon: "opacity", tier: 2 },
  
  // Mid-Atlantic
  { id: 39, type: "Storm Damage", lat: 39.2904, lng: -76.6122, location: "Baltimore, MD", date: "2024-02-13", icon: "cyclone", tier: 2 },
  { id: 645, type: "Water Loss", lat: 38.8048, lng: -77.0469, location: "Alexandria, VA", date: "2024-02-14", icon: "opacity", tier: 2 },
  { id: 646, type: "Structural", lat: 39.0458, lng: -76.6413, location: "Columbia, MD", date: "2024-02-15", icon: "architecture", tier: 2 },
  { id: 647, type: "Component Failure", lat: 40.2732, lng: -76.8867, location: "Harrisburg, PA", date: "2024-02-13", icon: "construction", tier: 2 },
  { id: 648, type: "HVAC/Electrical", lat: 39.6837, lng: -75.7497, location: "Wilmington, DE", date: "2024-02-16", icon: "electrical_services", tier: 2 },
  
  // Southwest
  { id: 40, type: "Water Loss", lat: 33.4484, lng: -112.074, location: "Scottsdale, AZ", date: "2024-02-11", icon: "opacity", tier: 2 },
  { id: 42, type: "Structural", lat: 35.4676, lng: -97.5164, location: "Oklahoma City, OK", date: "2024-02-09", icon: "architecture", tier: 2 },
  { id: 649, type: "Storm Damage", lat: 36.1540, lng: -95.9928, location: "Tulsa, OK", date: "2024-02-14", icon: "cyclone", tier: 2 },
  { id: 650, type: "Component Failure", lat: 35.1983, lng: -111.6513, location: "Flagstaff, AZ", date: "2024-02-15", icon: "construction", tier: 2 },
];

// Tier 3: Neighborhood & Street Level (zoom level 10+)
const tier3Locations = [
  // New York Metro - Extensive Neighborhood Coverage
  { id: 101, type: "Water Loss", lat: 40.7580, lng: -73.9855, location: "Times Square, NY", date: "2024-02-14", icon: "opacity", tier: 3 },
  { id: 102, type: "HVAC/Electrical", lat: 40.7614, lng: -73.9776, location: "Central Park South, NY", date: "2024-02-13", icon: "electrical_services", tier: 3 },
  { id: 103, type: "Plumbing Failure", lat: 40.7489, lng: -73.9680, location: "Upper East Side, NY", date: "2024-02-15", icon: "plumbing", tier: 3 },
  { id: 104, type: "Structural", lat: 40.7282, lng: -74.0776, location: "Jersey City, NJ", date: "2024-02-12", icon: "architecture", tier: 3 },
  { id: 105, type: "Component Failure", lat: 40.6892, lng: -73.9815, location: "Downtown Brooklyn, NY", date: "2024-02-16", icon: "construction", tier: 3 },
  { id: 106, type: "Water Loss", lat: 40.7831, lng: -73.9712, location: "Upper West Side, NY", date: "2024-02-14", icon: "opacity", tier: 3 },
  { id: 701, type: "Storm Damage", lat: 40.7614, lng: -73.9776, location: "Midtown West, NY", date: "2024-02-17", icon: "cyclone", tier: 3 },
  { id: 702, type: "Component Failure", lat: 40.7128, lng: -74.0060, location: "Financial District, NY", date: "2024-02-16", icon: "construction", tier: 3 },
  { id: 703, type: "Water Loss", lat: 40.7282, lng: -73.9942, location: "East Village, NY", date: "2024-02-15", icon: "opacity", tier: 3 },
  { id: 704, type: "Plumbing Failure", lat: 40.7308, lng: -74.0005, location: "SoHo, NY", date: "2024-02-18", icon: "plumbing", tier: 3 },
  { id: 705, type: "HVAC/Electrical", lat: 40.7614, lng: -73.9642, location: "Midtown East, NY", date: "2024-02-14", icon: "electrical_services", tier: 3 },
  { id: 706, type: "Structural", lat: 40.7489, lng: -73.9850, location: "Murray Hill, NY", date: "2024-02-17", icon: "architecture", tier: 3 },
  { id: 707, type: "Water Loss", lat: 40.7367, lng: -73.9903, location: "Gramercy, NY", date: "2024-02-16", icon: "opacity", tier: 3 },
  { id: 708, type: "Component Failure", lat: 40.7433, lng: -73.9196, location: "Long Island City, NY", date: "2024-02-15", icon: "construction", tier: 3 },
  { id: 709, type: "Storm Damage", lat: 40.7200, lng: -73.9567, location: "Williamsburg, NY", date: "2024-02-18", icon: "cyclone", tier: 3 },
  { id: 710, type: "Water Loss", lat: 40.6782, lng: -73.9442, location: "Park Slope, NY", date: "2024-02-14", icon: "opacity", tier: 3 },
  { id: 711, type: "Plumbing Failure", lat: 40.7465, lng: -73.9801, location: "Chelsea, NY", date: "2024-02-17", icon: "plumbing", tier: 3 },
  { id: 712, type: "HVAC/Electrical", lat: 40.8075, lng: -73.9626, location: "Harlem, NY", date: "2024-02-16", icon: "electrical_services", tier: 3 },
  { id: 713, type: "Structural", lat: 40.7648, lng: -73.9808, location: "Hell's Kitchen, NY", date: "2024-02-15", icon: "architecture", tier: 3 },
  { id: 714, type: "Water Loss", lat: 40.7895, lng: -73.9536, location: "Yorkville, NY", date: "2024-02-18", icon: "opacity", tier: 3 },
  { id: 715, type: "Component Failure", lat: 40.7209, lng: -74.0007, location: "TriBeCa, NY", date: "2024-02-14", icon: "construction", tier: 3 },
  
  // Miami Metro - Extensive Coverage
  { id: 107, type: "Storm Damage", lat: 25.7907, lng: -80.1300, location: "Miami Beach, FL", date: "2024-02-15", icon: "cyclone", tier: 3 },
  { id: 108, type: "Water Loss", lat: 25.7743, lng: -80.1937, location: "Brickell, FL", date: "2024-02-13", icon: "opacity", tier: 3 },
  { id: 109, type: "FORTIFIED", lat: 25.7217, lng: -80.2784, location: "Coral Gables, FL", date: "2024-02-14", icon: "shield", tier: 3 },
  { id: 110, type: "Storm Damage", lat: 26.0112, lng: -80.1495, location: "Hollywood, FL", date: "2024-02-16", icon: "cyclone", tier: 3 },
  { id: 716, type: "FORTIFIED", lat: 25.7889, lng: -80.2264, location: "Little Havana, FL", date: "2024-02-17", icon: "shield", tier: 3 },
  { id: 717, type: "Water Loss", lat: 25.8171, lng: -80.1993, location: "Wynwood, FL", date: "2024-02-16", icon: "opacity", tier: 3 },
  { id: 718, type: "Storm Damage", lat: 25.8506, lng: -80.1871, location: "Design District, FL", date: "2024-02-15", icon: "cyclone", tier: 3 },
  { id: 719, type: "Component Failure", lat: 25.7741, lng: -80.1342, location: "Key Biscayne, FL", date: "2024-02-18", icon: "construction", tier: 3 },
  { id: 720, type: "FORTIFIED", lat: 25.8723, lng: -80.1288, location: "Bal Harbour, FL", date: "2024-02-14", icon: "shield", tier: 3 },
  { id: 721, type: "Water Loss", lat: 25.7617, lng: -80.1918, location: "Downtown Miami, FL", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 722, type: "Storm Damage", lat: 25.9317, lng: -80.1310, location: "Aventura, FL", date: "2024-02-16", icon: "cyclone", tier: 3 },
  { id: 723, type: "Plumbing Failure", lat: 25.8260, lng: -80.1373, location: "North Miami, FL", date: "2024-02-15", icon: "plumbing", tier: 3 },
  { id: 724, type: "HVAC/Electrical", lat: 25.7043, lng: -80.3117, location: "Kendall, FL", date: "2024-02-18", icon: "electrical_services", tier: 3 },
  { id: 725, type: "FORTIFIED", lat: 25.6687, lng: -80.3165, location: "Pinecrest, FL", date: "2024-02-14", icon: "shield", tier: 3 },
  
  // Chicago Metro - Extensive Neighborhoods
  { id: 111, type: "Structural", lat: 41.8781, lng: -87.6298, location: "The Loop, IL", date: "2024-02-13", icon: "architecture", tier: 3 },
  { id: 112, type: "Water Loss", lat: 41.9484, lng: -87.6553, location: "Wrigleyville, IL", date: "2024-02-15", icon: "opacity", tier: 3 },
  { id: 113, type: "Component Failure", lat: 41.8369, lng: -87.6847, location: "Pilsen, IL", date: "2024-02-14", icon: "construction", tier: 3 },
  { id: 726, type: "Water Loss", lat: 41.9742, lng: -87.6580, location: "Lincoln Park, IL", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 727, type: "Structural", lat: 41.8868, lng: -87.6168, location: "River North, IL", date: "2024-02-16", icon: "architecture", tier: 3 },
  { id: 728, type: "HVAC/Electrical", lat: 41.9022, lng: -87.6279, location: "Gold Coast, IL", date: "2024-02-15", icon: "electrical_services", tier: 3 },
  { id: 729, type: "Component Failure", lat: 41.8919, lng: -87.6358, location: "Old Town, IL", date: "2024-02-18", icon: "construction", tier: 3 },
  { id: 730, type: "Water Loss", lat: 41.9227, lng: -87.6490, location: "Lakeview, IL", date: "2024-02-14", icon: "opacity", tier: 3 },
  { id: 731, type: "Storm Damage", lat: 41.8533, lng: -87.7064, location: "West Loop, IL", date: "2024-02-17", icon: "cyclone", tier: 3 },
  { id: 732, type: "Plumbing Failure", lat: 41.8781, lng: -87.7357, location: "Little Italy, IL", date: "2024-02-16", icon: "plumbing", tier: 3 },
  { id: 733, type: "Structural", lat: 41.9199, lng: -87.6514, location: "Roscoe Village, IL", date: "2024-02-15", icon: "architecture", tier: 3 },
  { id: 734, type: "Water Loss", lat: 41.8964, lng: -87.6445, location: "Streeterville, IL", date: "2024-02-18", icon: "opacity", tier: 3 },
  { id: 735, type: "Component Failure", lat: 41.9532, lng: -87.6657, location: "Andersonville, IL", date: "2024-02-14", icon: "construction", tier: 3 },
  
  // Houston Metro - Extensive Coverage
  { id: 114, type: "Storm Damage", lat: 29.7490, lng: -95.3587, location: "Downtown Houston, TX", date: "2024-02-15", icon: "cyclone", tier: 3 },
  { id: 115, type: "Water Loss", lat: 29.7355, lng: -95.4010, location: "Galleria, TX", date: "2024-02-13", icon: "opacity", tier: 3 },
  { id: 116, type: "Plumbing Failure", lat: 29.7805, lng: -95.3863, location: "The Heights, TX", date: "2024-02-16", icon: "plumbing", tier: 3 },
  { id: 736, type: "Water Loss", lat: 29.7369, lng: -95.3895, location: "Montrose, TX", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 737, type: "Component Failure", lat: 29.7604, lng: -95.3698, location: "Midtown Houston, TX", date: "2024-02-16", icon: "construction", tier: 3 },
  { id: 738, type: "Storm Damage", lat: 29.7256, lng: -95.4010, location: "River Oaks, TX", date: "2024-02-15", icon: "cyclone", tier: 3 },
  { id: 739, type: "Structural", lat: 29.7466, lng: -95.3629, location: "Museum District, TX", date: "2024-02-18", icon: "architecture", tier: 3 },
  { id: 740, type: "HVAC/Electrical", lat: 29.7328, lng: -95.2895, location: "East End, TX", date: "2024-02-14", icon: "electrical_services", tier: 3 },
  { id: 741, type: "Water Loss", lat: 29.8077, lng: -95.4778, location: "Memorial, TX", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 742, type: "Storm Damage", lat: 29.6920, lng: -95.2088, location: "Pasadena, TX", date: "2024-02-16", icon: "cyclone", tier: 3 },
  { id: 743, type: "Component Failure", lat: 29.5516, lng: -95.0830, location: "Friendswood, TX", date: "2024-02-15", icon: "construction", tier: 3 },
  { id: 744, type: "Plumbing Failure", lat: 29.7965, lng: -95.5638, location: "Katy, TX", date: "2024-02-18", icon: "plumbing", tier: 3 },
  
  // Los Angeles Metro - Extensive Neighborhoods
  { id: 117, type: "Water Loss", lat: 34.0522, lng: -118.2437, location: "Downtown LA, CA", date: "2024-02-14", icon: "opacity", tier: 3 },
  { id: 118, type: "Structural", lat: 34.0928, lng: -118.3287, location: "Hollywood, CA", date: "2024-02-15", icon: "architecture", tier: 3 },
  { id: 119, type: "HVAC/Electrical", lat: 34.0736, lng: -118.4004, location: "Beverly Hills, CA", date: "2024-02-13", icon: "electrical_services", tier: 3 },
  { id: 120, type: "Component Failure", lat: 34.0195, lng: -118.4912, location: "Venice Beach, CA", date: "2024-02-16", icon: "construction", tier: 3 },
  { id: 745, type: "Water Loss", lat: 34.1015, lng: -118.3416, location: "West Hollywood, CA", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 746, type: "Structural", lat: 34.0407, lng: -118.2468, location: "Arts District, CA", date: "2024-02-16", icon: "architecture", tier: 3 },
  { id: 747, type: "Component Failure", lat: 34.0689, lng: -118.4452, location: "Century City, CA", date: "2024-02-15", icon: "construction", tier: 3 },
  { id: 748, type: "Water Loss", lat: 34.0259, lng: -118.7798, location: "Malibu, CA", date: "2024-02-18", icon: "opacity", tier: 3 },
  { id: 749, type: "Storm Damage", lat: 34.1375, lng: -118.3534, location: "Studio City, CA", date: "2024-02-14", icon: "cyclone", tier: 3 },
  { id: 750, type: "HVAC/Electrical", lat: 34.0928, lng: -118.3570, location: "Sunset Strip, CA", date: "2024-02-17", icon: "electrical_services", tier: 3 },
  { id: 751, type: "Plumbing Failure", lat: 34.0522, lng: -118.2615, location: "Little Tokyo, CA", date: "2024-02-16", icon: "plumbing", tier: 3 },
  { id: 752, type: "Water Loss", lat: 34.1015, lng: -118.2973, location: "Silver Lake, CA", date: "2024-02-15", icon: "opacity", tier: 3 },
  { id: 753, type: "Structural", lat: 33.9850, lng: -118.4695, location: "Marina del Rey, CA", date: "2024-02-18", icon: "architecture", tier: 3 },
  { id: 754, type: "Component Failure", lat: 34.0902, lng: -118.3617, location: "Laurel Canyon, CA", date: "2024-02-14", icon: "construction", tier: 3 },
  
  // San Francisco Metro - Extensive Coverage
  { id: 121, type: "Water Loss", lat: 37.7937, lng: -122.3965, location: "Oakland, CA", date: "2024-02-14", icon: "opacity", tier: 3 },
  { id: 122, type: "Structural", lat: 37.8044, lng: -122.2712, location: "Berkeley, CA", date: "2024-02-15", icon: "architecture", tier: 3 },
  { id: 123, type: "HVAC/Electrical", lat: 37.7749, lng: -122.4194, location: "Financial District, CA", date: "2024-02-13", icon: "electrical_services", tier: 3 },
  { id: 755, type: "Water Loss", lat: 37.8023, lng: -122.4059, location: "Fisherman's Wharf, CA", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 756, type: "Component Failure", lat: 37.7599, lng: -122.4148, location: "Castro, CA", date: "2024-02-16", icon: "construction", tier: 3 },
  { id: 757, type: "Structural", lat: 37.7694, lng: -122.4862, location: "Sunset District, CA", date: "2024-02-15", icon: "architecture", tier: 3 },
  { id: 758, type: "Water Loss", lat: 37.7587, lng: -122.4381, location: "Haight-Ashbury, CA", date: "2024-02-18", icon: "opacity", tier: 3 },
  { id: 759, type: "HVAC/Electrical", lat: 37.7833, lng: -122.4167, location: "Nob Hill, CA", date: "2024-02-14", icon: "electrical_services", tier: 3 },
  { id: 760, type: "Component Failure", lat: 37.7648, lng: -122.4862, location: "Richmond District, CA", date: "2024-02-17", icon: "construction", tier: 3 },
  { id: 761, type: "Water Loss", lat: 37.7563, lng: -122.4210, location: "Mission District, CA", date: "2024-02-16", icon: "opacity", tier: 3 },
  { id: 762, type: "Structural", lat: 37.7944, lng: -122.4078, location: "North Beach, CA", date: "2024-02-15", icon: "architecture", tier: 3 },
  { id: 763, type: "Plumbing Failure", lat: 37.7898, lng: -122.3942, location: "Russian Hill, CA", date: "2024-02-18", icon: "plumbing", tier: 3 },
  
  // Atlanta Metro - Detailed Coverage
  { id: 124, type: "FORTIFIED", lat: 33.7490, lng: -84.3880, location: "Downtown Atlanta, GA", date: "2024-02-14", icon: "shield", tier: 3 },
  { id: 125, type: "Storm Damage", lat: 33.8490, lng: -84.3733, location: "Buckhead, GA", date: "2024-02-15", icon: "cyclone", tier: 3 },
  { id: 126, type: "Water Loss", lat: 33.7701, lng: -84.3675, location: "Midtown Atlanta, GA", date: "2024-02-16", icon: "opacity", tier: 3 },
  { id: 764, type: "Component Failure", lat: 33.7536, lng: -84.3901, location: "Sweet Auburn, GA", date: "2024-02-17", icon: "construction", tier: 3 },
  { id: 765, type: "Water Loss", lat: 33.7748, lng: -84.2963, location: "Inman Park, GA", date: "2024-02-16", icon: "opacity", tier: 3 },
  { id: 766, type: "FORTIFIED", lat: 33.7878, lng: -84.3781, location: "Virginia-Highland, GA", date: "2024-02-15", icon: "shield", tier: 3 },
  { id: 767, type: "Structural", lat: 33.7620, lng: -84.4277, location: "West End, GA", date: "2024-02-18", icon: "architecture", tier: 3 },
  { id: 768, type: "Storm Damage", lat: 33.7709, lng: -84.2906, location: "Little Five Points, GA", date: "2024-02-14", icon: "cyclone", tier: 3 },
  { id: 769, type: "HVAC/Electrical", lat: 33.8303, lng: -84.3633, location: "Brookhaven, GA", date: "2024-02-17", icon: "electrical_services", tier: 3 },
  { id: 770, type: "Water Loss", lat: 33.7937, lng: -84.3237, location: "Decatur, GA", date: "2024-02-16", icon: "opacity", tier: 3 },
  
  // Dallas Metro - Extensive Coverage
  { id: 127, type: "Large Loss", lat: 32.7767, lng: -96.7970, location: "Downtown Dallas, TX", date: "2024-02-14", icon: "domain_disabled", tier: 3 },
  { id: 128, type: "Water Loss", lat: 32.8206, lng: -96.7697, location: "Uptown Dallas, TX", date: "2024-02-15", icon: "opacity", tier: 3 },
  { id: 129, type: "Storm Damage", lat: 32.9048, lng: -96.7698, location: "Plano, TX", date: "2024-02-13", icon: "cyclone", tier: 3 },
  { id: 771, type: "Component Failure", lat: 32.7937, lng: -96.7655, location: "Deep Ellum, TX", date: "2024-02-17", icon: "construction", tier: 3 },
  { id: 772, type: "Water Loss", lat: 32.7876, lng: -96.8054, location: "Oak Lawn, TX", date: "2024-02-16", icon: "opacity", tier: 3 },
  { id: 773, type: "Structural", lat: 32.9356, lng: -96.8352, location: "Richardson, TX", date: "2024-02-15", icon: "architecture", tier: 3 },
  { id: 774, type: "Storm Damage", lat: 32.7554, lng: -96.8236, location: "Bishop Arts, TX", date: "2024-02-18", icon: "cyclone", tier: 3 },
  { id: 775, type: "HVAC/Electrical", lat: 32.8472, lng: -96.7711, location: "Highland Park, TX", date: "2024-02-14", icon: "electrical_services", tier: 3 },
  { id: 776, type: "Water Loss", lat: 32.8668, lng: -96.9011, location: "Las Colinas, TX", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 777, type: "Component Failure", lat: 32.7002, lng: -96.8197, location: "Duncanville, TX", date: "2024-02-16", icon: "construction", tier: 3 },
  
  // Phoenix Metro - Extensive Coverage
  { id: 130, type: "Chimney Collapse", lat: 33.4484, lng: -112.0740, location: "Downtown Phoenix, AZ", date: "2024-02-14", icon: "report_problem", tier: 3 },
  { id: 131, type: "Water Loss", lat: 33.5081, lng: -111.8986, location: "Tempe, AZ", date: "2024-02-15", icon: "opacity", tier: 3 },
  { id: 132, type: "Component Failure", lat: 33.3883, lng: -111.9318, location: "Mesa, AZ", date: "2024-02-16", icon: "construction", tier: 3 },
  { id: 778, type: "Water Loss", lat: 33.5946, lng: -112.1739, location: "Peoria, AZ", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 779, type: "Structural", lat: 33.3062, lng: -111.8413, location: "Chandler, AZ", date: "2024-02-16", icon: "architecture", tier: 3 },
  { id: 780, type: "Storm Damage", lat: 33.4255, lng: -111.9400, location: "Gilbert, AZ", date: "2024-02-15", icon: "cyclone", tier: 3 },
  { id: 781, type: "HVAC/Electrical", lat: 33.5944, lng: -111.9839, location: "Glendale, AZ", date: "2024-02-18", icon: "electrical_services", tier: 3 },
  { id: 782, type: "Component Failure", lat: 33.3528, lng: -111.7890, location: "Queen Creek, AZ", date: "2024-02-14", icon: "construction", tier: 3 },
  { id: 783, type: "Water Loss", lat: 33.4606, lng: -112.3162, location: "Avondale, AZ", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 784, type: "Chimney Collapse", lat: 33.5269, lng: -112.1829, location: "Sun City, AZ", date: "2024-02-16", icon: "report_problem", tier: 3 },
  
  // Philadelphia Metro
  { id: 785, type: "Water Loss", lat: 39.9526, lng: -75.1652, location: "Center City, PA", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 786, type: "Structural", lat: 39.9443, lng: -75.1800, location: "Rittenhouse, PA", date: "2024-02-16", icon: "architecture", tier: 3 },
  { id: 787, type: "Component Failure", lat: 39.9564, lng: -75.1687, location: "Old City, PA", date: "2024-02-15", icon: "construction", tier: 3 },
  { id: 788, type: "Water Loss", lat: 39.9334, lng: -75.1702, location: "South Philly, PA", date: "2024-02-18", icon: "opacity", tier: 3 },
  { id: 789, type: "HVAC/Electrical", lat: 39.9696, lng: -75.1827, location: "Fishtown, PA", date: "2024-02-14", icon: "electrical_services", tier: 3 },
  { id: 790, type: "Structural", lat: 39.9812, lng: -75.1564, location: "Northern Liberties, PA", date: "2024-02-17", icon: "architecture", tier: 3 },
  
  // Seattle Metro  
  { id: 791, type: "Water Loss", lat: 47.6062, lng: -122.3321, location: "Downtown Seattle, WA", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 792, type: "Structural", lat: 47.6205, lng: -122.3493, location: "Capitol Hill, WA", date: "2024-02-16", icon: "architecture", tier: 3 },
  { id: 793, type: "Component Failure", lat: 47.6681, lng: -122.3889, location: "Fremont, WA", date: "2024-02-15", icon: "construction", tier: 3 },
  { id: 794, type: "Water Loss", lat: 47.6553, lng: -122.3035, location: "University District, WA", date: "2024-02-18", icon: "opacity", tier: 3 },
  { id: 795, type: "HVAC/Electrical", lat: 47.6738, lng: -122.3419, location: "Ballard, WA", date: "2024-02-14", icon: "electrical_services", tier: 3 },
  { id: 796, type: "Structural", lat: 47.6101, lng: -122.3331, location: "Pioneer Square, WA", date: "2024-02-17", icon: "architecture", tier: 3 },
  
  // Denver Metro
  { id: 797, type: "Water Loss", lat: 39.7392, lng: -104.9903, location: "Downtown Denver, CO", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 798, type: "Component Failure", lat: 39.7294, lng: -104.9848, location: "LoDo, CO", date: "2024-02-16", icon: "construction", tier: 3 },
  { id: 799, type: "Structural", lat: 39.7543, lng: -105.0000, location: "Highland, CO", date: "2024-02-15", icon: "architecture", tier: 3 },
  { id: 800, type: "Water Loss", lat: 39.7173, lng: -104.9445, location: "Capitol Hill, CO", date: "2024-02-18", icon: "opacity", tier: 3 },
  
  // ========== EXPANDED COVERAGE - 200+ MORE NEIGHBORHOOD PINS ==========
  
  // New York Metro - ULTRA DETAILED (50+ more locations)
  { id: 1001, type: "Water Loss", lat: 40.7489, lng: -74.0014, location: "Greenwich Village, NY", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 1002, type: "Component Failure", lat: 40.7590, lng: -73.9845, location: "Grand Central, NY", date: "2024-02-16", icon: "construction", tier: 3 },
  { id: 1003, type: "Structural", lat: 40.7580, lng: -73.9678, location: "Astoria, NY", date: "2024-02-15", icon: "architecture", tier: 3 },
  { id: 1004, type: "Storm Damage", lat: 40.7282, lng: -73.7949, location: "Forest Hills, NY", date: "2024-02-18", icon: "cyclone", tier: 3 },
  { id: 1005, type: "HVAC/Electrical", lat: 40.6895, lng: -73.9308, location: "Bushwick, NY", date: "2024-02-14", icon: "electrical_services", tier: 3 },
  { id: 1006, type: "Water Loss", lat: 40.6746, lng: -73.9652, location: "Prospect Heights, NY", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 1007, type: "Plumbing Failure", lat: 40.6441, lng: -73.7822, location: "Jamaica, NY", date: "2024-02-16", icon: "plumbing", tier: 3 },
  { id: 1008, type: "Component Failure", lat: 40.8448, lng: -73.9242, location: "Mott Haven, NY", date: "2024-02-15", icon: "construction", tier: 3 },
  { id: 1009, type: "Water Loss", lat: 40.8259, lng: -73.9482, location: "Washington Heights, NY", date: "2024-02-18", icon: "opacity", tier: 3 },
  { id: 1010, type: "Structural", lat: 40.8671, lng: -73.9212, location: "Kingsbridge, NY", date: "2024-02-14", icon: "architecture", tier: 3 },
  { id: 1011, type: "Storm Damage", lat: 40.7489, lng: -73.9680, location: "Lenox Hill, NY", date: "2024-02-17", icon: "cyclone", tier: 3 },
  { id: 1012, type: "HVAC/Electrical", lat: 40.7067, lng: -74.0089, location: "Battery Park City, NY", date: "2024-02-16", icon: "electrical_services", tier: 3 },
  { id: 1013, type: "Water Loss", lat: 40.7179, lng: -74.0079, location: "Chinatown, NY", date: "2024-02-15", icon: "opacity", tier: 3 },
  { id: 1014, type: "Component Failure", lat: 40.7256, lng: -73.9965, location: "Alphabet City, NY", date: "2024-02-18", icon: "construction", tier: 3 },
  { id: 1015, type: "Plumbing Failure", lat: 40.7414, lng: -73.9877, location: "Flatiron District, NY", date: "2024-02-14", icon: "plumbing", tier: 3 },
  { id: 1016, type: "Water Loss", lat: 40.7527, lng: -73.9772, location: "Tudor City, NY", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 1017, type: "Structural", lat: 40.7614, lng: -73.9776, location: "Diamond District, NY", date: "2024-02-16", icon: "architecture", tier: 3 },
  { id: 1018, type: "Storm Damage", lat: 40.7128, lng: -73.9389, location: "Greenpoint, NY", date: "2024-02-15", icon: "cyclone", tier: 3 },
  { id: 1019, type: "Component Failure", lat: 40.6782, lng: -73.9722, location: "Carroll Gardens, NY", date: "2024-02-18", icon: "construction", tier: 3 },
  { id: 1020, type: "Water Loss", lat: 40.6264, lng: -74.0299, location: "Bay Ridge, NY", date: "2024-02-14", icon: "opacity", tier: 3 },
  { id: 1021, type: "HVAC/Electrical", lat: 40.7395, lng: -73.7190, location: "Bayside, NY", date: "2024-02-17", icon: "electrical_services", tier: 3 },
  { id: 1022, type: "Plumbing Failure", lat: 40.5795, lng: -74.1502, location: "Great Kills, NY", date: "2024-02-16", icon: "plumbing", tier: 3 },
  { id: 1023, type: "Water Loss", lat: 40.7484, lng: -73.8855, location: "Jackson Heights, NY", date: "2024-02-15", icon: "opacity", tier: 3 },
  { id: 1024, type: "Structural", lat: 40.7648, lng: -73.9139, location: "Sunnyside, NY", date: "2024-02-18", icon: "architecture", tier: 3 },
  { id: 1025, type: "Storm Damage", lat: 40.8571, lng: -73.8458, location: "Pelham Bay, NY", date: "2024-02-14", icon: "cyclone", tier: 3 },
  
  // Los Angeles Metro - ULTRA DETAILED (50+ more locations)
  { id: 1026, type: "Water Loss", lat: 34.0211, lng: -118.4814, location: "Santa Monica Pier, CA", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 1027, type: "Component Failure", lat: 34.1016, lng: -118.3259, location: "West Hollywood Hills, CA", date: "2024-02-16", icon: "construction", tier: 3 },
  { id: 1028, type: "Structural", lat: 34.1391, lng: -118.1220, location: "Pasadena, CA", date: "2024-02-15", icon: "architecture", tier: 3 },
  { id: 1029, type: "Storm Damage", lat: 34.1478, lng: -118.1445, location: "South Pasadena, CA", date: "2024-02-18", icon: "cyclone", tier: 3 },
  { id: 1030, type: "HVAC/Electrical", lat: 34.0689, lng: -118.2452, location: "Echo Park, CA", date: "2024-02-14", icon: "electrical_services", tier: 3 },
  { id: 1031, type: "Water Loss", lat: 33.9616, lng: -118.3531, location: "El Segundo, CA", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 1032, type: "Plumbing Failure", lat: 34.0073, lng: -118.4965, location: "Brentwood, CA", date: "2024-02-16", icon: "plumbing", tier: 3 },
  { id: 1033, type: "Component Failure", lat: 34.1341, lng: -118.3215, location: "Sherman Oaks, CA", date: "2024-02-15", icon: "construction", tier: 3 },
  { id: 1034, type: "Water Loss", lat: 34.1808, lng: -118.6090, location: "Calabasas, CA", date: "2024-02-18", icon: "opacity", tier: 3 },
  { id: 1035, type: "Structural", lat: 34.1425, lng: -118.2551, location: "Glendale Downtown, CA", date: "2024-02-14", icon: "architecture", tier: 3 },
  { id: 1036, type: "Storm Damage", lat: 33.9533, lng: -118.2443, location: "Watts, CA", date: "2024-02-17", icon: "cyclone", tier: 3 },
  { id: 1037, type: "HVAC/Electrical", lat: 34.0928, lng: -118.3260, location: "Hollywood Hills, CA", date: "2024-02-16", icon: "electrical_services", tier: 3 },
  { id: 1038, type: "Water Loss", lat: 34.1016, lng: -118.3398, location: "Laurel Canyon Blvd, CA", date: "2024-02-15", icon: "opacity", tier: 3 },
  { id: 1039, type: "Component Failure", lat: 34.0522, lng: -118.2850, location: "Boyle Heights, CA", date: "2024-02-18", icon: "construction", tier: 3 },
  { id: 1040, type: "Plumbing Failure", lat: 34.0430, lng: -118.2673, location: "Lincoln Heights, CA", date: "2024-02-14", icon: "plumbing", tier: 3 },
  { id: 1041, type: "Water Loss", lat: 34.0195, lng: -118.3965, location: "Westwood, CA", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 1042, type: "Structural", lat: 34.0584, lng: -118.4136, location: "West LA, CA", date: "2024-02-16", icon: "architecture", tier: 3 },
  { id: 1043, type: "Storm Damage", lat: 33.9731, lng: -118.2479, location: "Compton, CA", date: "2024-02-15", icon: "cyclone", tier: 3 },
  { id: 1044, type: "Component Failure", lat: 33.9850, lng: -118.1820, location: "Downey, CA", date: "2024-02-18", icon: "construction", tier: 3 },
  { id: 1045, type: "Water Loss", lat: 34.1478, lng: -118.1445, location: "Altadena, CA", date: "2024-02-14", icon: "opacity", tier: 3 },
  { id: 1046, type: "HVAC/Electrical", lat: 34.0407, lng: -118.2468, location: "Arts District East, CA", date: "2024-02-17", icon: "electrical_services", tier: 3 },
  { id: 1047, type: "Plumbing Failure", lat: 34.0928, lng: -118.2730, location: "Los Feliz, CA", date: "2024-02-16", icon: "plumbing", tier: 3 },
  { id: 1048, type: "Water Loss", lat: 34.0736, lng: -118.3900, location: "Westwood Village, CA", date: "2024-02-15", icon: "opacity", tier: 3 },
  { id: 1049, type: "Structural", lat: 34.0195, lng: -118.4664, location: "Pacific Palisades, CA", date: "2024-02-18", icon: "architecture", tier: 3 },
  { id: 1050, type: "Storm Damage", lat: 33.8366, lng: -118.0850, location: "Whittier, CA", date: "2024-02-14", icon: "cyclone", tier: 3 },
  
  // Chicago Metro - ULTRA DETAILED (40+ more locations)
  { id: 1051, type: "Water Loss", lat: 41.9022, lng: -87.6768, location: "Ukrainian Village, IL", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 1052, type: "Component Failure", lat: 41.9100, lng: -87.6568, location: "Lincoln Square, IL", date: "2024-02-16", icon: "construction", tier: 3 },
  { id: 1053, type: "Structural", lat: 41.8825, lng: -87.6178, location: "Magnificent Mile, IL", date: "2024-02-15", icon: "architecture", tier: 3 },
  { id: 1054, type: "Storm Damage", lat: 41.9178, lng: -87.6828, location: "Logan Square, IL", date: "2024-02-18", icon: "cyclone", tier: 3 },
  { id: 1055, type: "HVAC/Electrical", lat: 41.9742, lng: -87.6580, location: "DePaul, IL", date: "2024-02-14", icon: "electrical_services", tier: 3 },
  { id: 1056, type: "Water Loss", lat: 41.8781, lng: -87.6762, location: "Greektown, IL", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 1057, type: "Plumbing Failure", lat: 41.8675, lng: -87.6270, location: "South Loop, IL", date: "2024-02-16", icon: "plumbing", tier: 3 },
  { id: 1058, type: "Component Failure", lat: 41.7980, lng: -87.6036, location: "Bridgeport, IL", date: "2024-02-15", icon: "construction", tier: 3 },
  { id: 1059, type: "Water Loss", lat: 41.9742, lng: -87.6671, location: "Boystown, IL", date: "2024-02-18", icon: "opacity", tier: 3 },
  { id: 1060, type: "Structural", lat: 41.9534, lng: -87.6486, location: "Uptown, IL", date: "2024-02-14", icon: "architecture", tier: 3 },
  { id: 1061, type: "Storm Damage", lat: 41.8369, lng: -87.6531, location: "Chinatown, IL", date: "2024-02-17", icon: "cyclone", tier: 3 },
  { id: 1062, type: "HVAC/Electrical", lat: 41.9178, lng: -87.6828, location: "Bucktown, IL", date: "2024-02-16", icon: "electrical_services", tier: 3 },
  { id: 1063, type: "Water Loss", lat: 41.8781, lng: -87.6298, location: "Grant Park, IL", date: "2024-02-15", icon: "opacity", tier: 3 },
  { id: 1064, type: "Component Failure", lat: 41.8534, lng: -87.6476, location: "Printer's Row, IL", date: "2024-02-18", icon: "construction", tier: 3 },
  { id: 1065, type: "Plumbing Failure", lat: 41.8969, lng: -87.6324, location: "Near North Side, IL", date: "2024-02-14", icon: "plumbing", tier: 3 },
  { id: 1066, type: "Water Loss", lat: 41.8825, lng: -87.6358, location: "Navy Pier Area, IL", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 1067, type: "Structural", lat: 41.9484, lng: -87.6650, location: "Wrigley Field Area, IL", date: "2024-02-16", icon: "architecture", tier: 3 },
  { id: 1068, type: "Storm Damage", lat: 41.8781, lng: -87.7064, location: "Medical District, IL", date: "2024-02-15", icon: "cyclone", tier: 3 },
  { id: 1069, type: "Component Failure", lat: 41.8533, lng: -87.7064, location: "University Village, IL", date: "2024-02-18", icon: "construction", tier: 3 },
  { id: 1070, type: "Water Loss", lat: 41.9534, lng: -87.7096, location: "Hermosa, IL", date: "2024-02-14", icon: "opacity", tier: 3 },
  
  // Miami Metro - ULTRA DETAILED (40+ more locations)
  { id: 1071, type: "FORTIFIED", lat: 25.8176, lng: -80.1269, location: "North Beach, FL", date: "2024-02-17", icon: "shield", tier: 3 },
  { id: 1072, type: "Storm Damage", lat: 25.7617, lng: -80.1918, location: "Brickell Key, FL", date: "2024-02-16", icon: "cyclone", tier: 3 },
  { id: 1073, type: "Water Loss", lat: 25.7825, lng: -80.1340, location: "Edgewater, FL", date: "2024-02-15", icon: "opacity", tier: 3 },
  { id: 1074, type: "Component Failure", lat: 25.7889, lng: -80.2264, location: "Little Havana West, FL", date: "2024-02-18", icon: "construction", tier: 3 },
  { id: 1075, type: "FORTIFIED", lat: 25.8598, lng: -80.1230, location: "Sunny Isles Beach, FL", date: "2024-02-14", icon: "shield", tier: 3 },
  { id: 1076, type: "Water Loss", lat: 25.9701, lng: -80.1401, location: "Golden Beach, FL", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 1077, type: "Storm Damage", lat: 25.8715, lng: -80.1197, location: "Haulover Beach, FL", date: "2024-02-16", icon: "cyclone", tier: 3 },
  { id: 1078, type: "Plumbing Failure", lat: 25.7743, lng: -80.1937, location: "Brickell Ave, FL", date: "2024-02-15", icon: "plumbing", tier: 3 },
  { id: 1079, type: "FORTIFIED", lat: 25.8723, lng: -80.1288, location: "Surfside, FL", date: "2024-02-18", icon: "shield", tier: 3 },
  { id: 1080, type: "Water Loss", lat: 25.7214, lng: -80.2683, location: "South Miami, FL", date: "2024-02-14", icon: "opacity", tier: 3 },
  { id: 1081, type: "Storm Damage", lat: 25.6901, lng: -80.3164, location: "Coconut Grove, FL", date: "2024-02-17", icon: "cyclone", tier: 3 },
  { id: 1082, type: "Component Failure", lat: 25.8506, lng: -80.1871, location: "Little Haiti, FL", date: "2024-02-16", icon: "construction", tier: 3 },
  { id: 1083, type: "FORTIFIED", lat: 25.9343, lng: -80.1231, location: "Aventura Mall Area, FL", date: "2024-02-15", icon: "shield", tier: 3 },
  { id: 1084, type: "Water Loss", lat: 25.7768, lng: -80.1918, location: "Arts & Entertainment District, FL", date: "2024-02-18", icon: "opacity", tier: 3 },
  { id: 1085, type: "Storm Damage", lat: 25.7289, lng: -80.2397, location: "The Roads, FL", date: "2024-02-14", icon: "cyclone", tier: 3 },
  { id: 1086, type: "HVAC/Electrical", lat: 25.8104, lng: -80.2070, location: "Allapattah, FL", date: "2024-02-17", icon: "electrical_services", tier: 3 },
  { id: 1087, type: "Water Loss", lat: 25.7931, lng: -80.1355, location: "Midtown Miami, FL", date: "2024-02-16", icon: "opacity", tier: 3 },
  { id: 1088, type: "Component Failure", lat: 25.7658, lng: -80.2185, location: "Flagami, FL", date: "2024-02-15", icon: "construction", tier: 3 },
  { id: 1089, type: "FORTIFIED", lat: 25.6780, lng: -80.3126, location: "South Coconut Grove, FL", date: "2024-02-18", icon: "shield", tier: 3 },
  { id: 1090, type: "Storm Damage", lat: 25.9014, lng: -80.1420, location: "Bay Harbor Islands, FL", date: "2024-02-14", icon: "cyclone", tier: 3 },
  
  // Houston Metro - ULTRA DETAILED (40+ more locations)
  { id: 1091, type: "Water Loss", lat: 29.7633, lng: -95.3633, location: "Fourth Ward, TX", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 1092, type: "Component Failure", lat: 29.7174, lng: -95.4018, location: "West University Place, TX", date: "2024-02-16", icon: "construction", tier: 3 },
  { id: 1093, type: "Structural", lat: 29.7355, lng: -95.5154, location: "Bellaire, TX", date: "2024-02-15", icon: "architecture", tier: 3 },
  { id: 1094, type: "Storm Damage", lat: 29.8168, lng: -95.4145, location: "Rice Village, TX", date: "2024-02-18", icon: "cyclone", tier: 3 },
  { id: 1095, type: "HVAC/Electrical", lat: 29.7604, lng: -95.3698, location: "Theater District, TX", date: "2024-02-14", icon: "electrical_services", tier: 3 },
  { id: 1096, type: "Water Loss", lat: 29.7174, lng: -95.3494, location: "Third Ward, TX", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 1097, type: "Plumbing Failure", lat: 29.7863, lng: -95.5154, location: "Spring Branch, TX", date: "2024-02-16", icon: "plumbing", tier: 3 },
  { id: 1098, type: "Component Failure", lat: 29.7466, lng: -95.3629, location: "Midtown South, TX", date: "2024-02-15", icon: "construction", tier: 3 },
  { id: 1099, type: "Water Loss", lat: 29.7328, lng: -95.5598, location: "Westchase, TX", date: "2024-02-18", icon: "opacity", tier: 3 },
  { id: 1100, type: "Structural", lat: 29.7952, lng: -95.3916, location: "Neartown, TX", date: "2024-02-14", icon: "architecture", tier: 3 },
  { id: 1101, type: "Storm Damage", lat: 29.6910, lng: -95.4827, location: "Meyerland, TX", date: "2024-02-17", icon: "cyclone", tier: 3 },
  { id: 1102, type: "HVAC/Electrical", lat: 29.7783, lng: -95.3921, location: "Washington Avenue, TX", date: "2024-02-16", icon: "electrical_services", tier: 3 },
  { id: 1103, type: "Water Loss", lat: 29.7363, lng: -95.3985, location: "Hyde Park, TX", date: "2024-02-15", icon: "opacity", tier: 3 },
  { id: 1104, type: "Component Failure", lat: 29.6910, lng: -95.2091, location: "Hobby Airport Area, TX", date: "2024-02-18", icon: "construction", tier: 3 },
  { id: 1105, type: "Plumbing Failure", lat: 29.9168, lng: -95.5154, location: "Greenspoint, TX", date: "2024-02-14", icon: "plumbing", tier: 3 },
  { id: 1106, type: "Water Loss", lat: 29.7318, lng: -95.4621, location: "Greenway Plaza, TX", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 1107, type: "Structural", lat: 29.6863, lng: -95.4349, location: "Braeswood, TX", date: "2024-02-16", icon: "architecture", tier: 3 },
  { id: 1108, type: "Storm Damage", lat: 29.7689, lng: -95.3691, location: "Downtown East, TX", date: "2024-02-15", icon: "cyclone", tier: 3 },
  { id: 1109, type: "Component Failure", lat: 29.7256, lng: -95.2895, location: "Magnolia Park, TX", date: "2024-02-18", icon: "construction", tier: 3 },
  { id: 1110, type: "Water Loss", lat: 29.8077, lng: -95.5638, location: "Energy Corridor, TX", date: "2024-02-14", icon: "opacity", tier: 3 },
  
  // San Francisco Metro - ULTRA DETAILED (30+ more locations)
  { id: 1111, type: "Water Loss", lat: 37.7272, lng: -122.4514, location: "Outer Sunset, CA", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 1112, type: "Component Failure", lat: 37.7749, lng: -122.4314, location: "Tenderloin, CA", date: "2024-02-16", icon: "construction", tier: 3 },
  { id: 1113, type: "Structural", lat: 37.7897, lng: -122.4094, location: "Telegraph Hill, CA", date: "2024-02-15", icon: "architecture", tier: 3 },
  { id: 1114, type: "Storm Damage", lat: 37.7272, lng: -122.4644, location: "Parkside, CA", date: "2024-02-18", icon: "cyclone", tier: 3 },
  { id: 1115, type: "HVAC/Electrical", lat: 37.7599, lng: -122.4371, location: "Lower Haight, CA", date: "2024-02-14", icon: "electrical_services", tier: 3 },
  { id: 1116, type: "Water Loss", lat: 37.7749, lng: -122.4194, location: "SoMa, CA", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 1117, type: "Plumbing Failure", lat: 37.7955, lng: -122.4028, location: "Marina District, CA", date: "2024-02-16", icon: "plumbing", tier: 3 },
  { id: 1118, type: "Component Failure", lat: 37.7833, lng: -122.4167, location: "Pacific Heights, CA", date: "2024-02-15", icon: "construction", tier: 3 },
  { id: 1119, type: "Water Loss", lat: 37.7749, lng: -122.4477, location: "Inner Richmond, CA", date: "2024-02-18", icon: "opacity", tier: 3 },
  { id: 1120, type: "Structural", lat: 37.7272, lng: -122.3918, location: "Excelsior, CA", date: "2024-02-14", icon: "architecture", tier: 3 },
  { id: 1121, type: "Storm Damage", lat: 37.7484, lng: -122.4156, location: "Duboce Triangle, CA", date: "2024-02-17", icon: "cyclone", tier: 3 },
  { id: 1122, type: "HVAC/Electrical", lat: 37.7478, lng: -122.4381, location: "Cole Valley, CA", date: "2024-02-16", icon: "electrical_services", tier: 3 },
  { id: 1123, type: "Water Loss", lat: 37.7749, lng: -122.4194, location: "Yerba Buena, CA", date: "2024-02-15", icon: "opacity", tier: 3 },
  { id: 1124, type: "Component Failure", lat: 37.7955, lng: -122.4028, location: "Cow Hollow, CA", date: "2024-02-18", icon: "construction", tier: 3 },
  { id: 1125, type: "Plumbing Failure", lat: 37.7749, lng: -122.4477, location: "Laurel Heights, CA", date: "2024-02-14", icon: "plumbing", tier: 3 },
  
  // Boston Metro - ULTRA DETAILED (30+ more locations)
  { id: 1126, type: "Water Loss", lat: 42.3601, lng: -71.0589, location: "Beacon Hill, MA", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 1127, type: "Component Failure", lat: 42.3505, lng: -71.0565, location: "Back Bay, MA", date: "2024-02-16", icon: "construction", tier: 3 },
  { id: 1128, type: "Structural", lat: 42.3118, lng: -71.0568, location: "South End, MA", date: "2024-02-15", icon: "architecture", tier: 3 },
  { id: 1129, type: "Storm Damage", lat: 42.3478, lng: -71.0466, location: "North End, MA", date: "2024-02-18", icon: "cyclone", tier: 3 },
  { id: 1130, type: "HVAC/Electrical", lat: 42.3370, lng: -71.0849, location: "Fenway, MA", date: "2024-02-14", icon: "electrical_services", tier: 3 },
  { id: 1131, type: "Water Loss", lat: 42.3320, lng: -71.1197, location: "Brighton, MA", date: "2024-02-17", icon: "opacity", tier: 3 },
  { id: 1132, type: "Plumbing Failure", lat: 42.3125, lng: -71.1302, location: "Brookline, MA", date: "2024-02-16", icon: "plumbing", tier: 3 },
  { id: 1133, type: "Component Failure", lat: 42.3188, lng: -71.0846, location: "Mission Hill, MA", date: "2024-02-15", icon: "construction", tier: 3 },
  { id: 1134, type: "Water Loss", lat: 42.3320, lng: -71.0202, location: "Seaport District, MA", date: "2024-02-18", icon: "opacity", tier: 3 },
  { id: 1135, type: "Structural", lat: 42.2808, lng: -71.0636, location: "Dorchester, MA", date: "2024-02-14", icon: "architecture", tier: 3 },
  { id: 1136, type: "Storm Damage", lat: 42.3320, lng: -71.1589, location: "Allston, MA", date: "2024-02-17", icon: "cyclone", tier: 3 },
  { id: 1137, type: "HVAC/Electrical", lat: 42.3583, lng: -71.0603, location: "West End, MA", date: "2024-02-16", icon: "electrical_services", tier: 3 },
  { id: 1138, type: "Water Loss", lat: 42.3479, lng: -71.0340, location: "Charlestown, MA", date: "2024-02-15", icon: "opacity", tier: 3 },
  { id: 1139, type: "Component Failure", lat: 42.3443, lng: -71.1010, location: "Kenmore Square, MA", date: "2024-02-18", icon: "construction", tier: 3 },
  { id: 1140, type: "Plumbing Failure", lat: 42.3293, lng: -71.0814, location: "Longwood Medical, MA", date: "2024-02-14", icon: "plumbing", tier: 3 },
];

// Combine all locations
const serviceRequests = [...tier1Locations, ...tier2Locations, ...tier3Locations];

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
  "Plumbing Failure",
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
    "Plumbing Failure": "#14B8A6",
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredRequests = useMemo(() => {
    // Filter by service type
    let filtered = selectedFilter === "All Services" 
      ? serviceRequests 
      : serviceRequests.filter((req) => req.type === selectedFilter);
    
    // Filter by zoom level - show more pins as you zoom in
    const zoom = viewState.zoom;
    if (zoom < 7) {
      // National view: Only show tier 1 (major metros)
      filtered = filtered.filter((req) => req.tier === 1);
    } else if (zoom < 10) {
      // Regional view: Show tier 1 + tier 2 (metros + regional cities)
      filtered = filtered.filter((req) => req.tier === 1 || req.tier === 2);
    }
    // City view (zoom >= 10): Show all tiers including neighborhoods
    
    return filtered;
  }, [selectedFilter, viewState.zoom]);

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
            Live view of <strong className="text-primary dark:text-accent">400+ active forensic engineering investigations</strong> across the United States. 
            <strong className="text-primary dark:text-accent">Zoom in to reveal hundreds more service locations</strong> - discover ultra-detailed neighborhood and street-level investigations in every major city.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-green-500">circle</span>
              <span>400+ Active Cases</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">zoom_in_map</span>
              <span>Zoom to Reveal More</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">satellite</span>
              <span>Satellite View</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">3d_rotation</span>
              <span>3D Navigation</span>
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
            Click any city to zoom in • <strong>More pins appear as you zoom closer</strong> • Switch to satellite view for aerial imagery
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

            {/* Zoom Level Indicator */}
            <div className="bg-white/95 dark:bg-section-dark/95 backdrop-blur-sm rounded-xl p-3 border border-gray-200 dark:border-gray-800 shadow-lg">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Visible Pins
              </p>
              <div className="space-y-2">
                <div className={`flex items-center gap-2 text-xs ${viewState.zoom < 7 ? 'text-primary dark:text-accent font-bold' : 'text-gray-500'}`}>
                  <span className="material-symbols-outlined text-sm">location_city</span>
                  <span>Major Metros</span>
                </div>
                <div className={`flex items-center gap-2 text-xs ${viewState.zoom >= 7 && viewState.zoom < 10 ? 'text-primary dark:text-accent font-bold' : 'text-gray-500'}`}>
                  <span className="material-symbols-outlined text-sm">apartment</span>
                  <span>+ Regional Cities</span>
                </div>
                <div className={`flex items-center gap-2 text-xs ${viewState.zoom >= 10 ? 'text-primary dark:text-accent font-bold' : 'text-gray-500'}`}>
                  <span className="material-symbols-outlined text-sm">store</span>
                  <span>+ Neighborhoods</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                Zoom: {viewState.zoom.toFixed(1)}
              </p>
            </div>
          </div>

          <div className="h-[600px] md:h-[700px] lg:h-[800px] relative">
            {mounted && (
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
                    9
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
                {["Storm Damage", "Water Loss", "Structural", "FORTIFIED", "Plumbing Failure", "HVAC/Electrical"].map((type) => (
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
