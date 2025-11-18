
"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapboxMapProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  showRoute?: boolean;
  recipientLat?: number;
  recipientLng?: number;
}

const { recipientLat, recipientLng } = { recipientLat: undefined, recipientLng: undefined };

export function GoogleMap({ 
  latitude, 
  longitude, 
  onLocationChange,
  showRoute = false,
  recipientLat,
  recipientLng
}: MapboxMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const recipientMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const routeUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const originalPositionRef = useRef<{ lng: number; lat: number } | null>(null);
  const [routeDistance, setRouteDistance] = useState<string>("");
  const [coveredDistance, setCoveredDistance] = useState<string>("");

  // Function to draw the covered distance line (from original position to current marker position)
  const drawCoveredDistanceLine = async (map: mapboxgl.Map, fromLng: number, fromLat: number, toLng: number, toLat: number, recipientLng?: number, recipientLat?: number) => {
    // Remove existing covered distance layer if it exists
    if (map.getLayer('covered-distance')) {
      map.removeLayer('covered-distance');
    }
    if (map.getSource('covered-distance')) {
      map.removeSource('covered-distance');
    }

    try {
      // Fetch the actual route from original position to current position
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${fromLng},${fromLat};${toLng},${toLat}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const coveredRoute = data.routes[0];
        const distance = (coveredRoute.distance / 1000).toFixed(2);
        setCoveredDistance(`${distance} km`);

        // If we have the full route available and recipient coordinates, try to match the covered route with it
        let routeGeometry = coveredRoute.geometry;
        
        // If recipient coordinates are available, check if we should adjust the route
        if (recipientLng && recipientLat) {
          // Fetch the full route from original to recipient
          const fullRouteUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${fromLng},${fromLat};${recipientLng},${recipientLat}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
          const fullRouteResponse = await fetch(fullRouteUrl);
          const fullRouteData = await fullRouteResponse.json();
          
          if (fullRouteData.routes && fullRouteData.routes.length > 0) {
            const fullRoute = fullRouteData.routes[0];
            const fullCoordinates = fullRoute.geometry.coordinates;
            
            // Find the closest point on the full route to the current position
            let closestIndex = 0;
            let minDistance = Infinity;
            
            fullCoordinates.forEach((coord: [number, number], index: number) => {
              const dist = Math.sqrt(
                Math.pow(coord[0] - toLng, 2) + Math.pow(coord[1] - toLat, 2)
              );
              if (dist < minDistance) {
                minDistance = dist;
                closestIndex = index;
              }
            });
            
            // If the current position is close enough to the route (threshold: 0.01 degrees ~ 1km)
            if (minDistance < 0.01) {
              // Use the portion of the full route from start to closest point
              const coveredCoordinates = fullCoordinates.slice(0, closestIndex + 1);
              routeGeometry = {
                type: 'LineString',
                coordinates: coveredCoordinates
              };
              
              // Recalculate distance based on the route portion
              let totalDistance = 0;
              for (let i = 0; i < coveredCoordinates.length - 1; i++) {
                const [lng1, lat1] = coveredCoordinates[i];
                const [lng2, lat2] = coveredCoordinates[i + 1];
                const R = 6371;
                const dLat = (lat2 - lat1) * Math.PI / 180;
                const dLng = (lng2 - lng1) * Math.PI / 180;
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                          Math.sin(dLng / 2) * Math.sin(dLng / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                totalDistance += R * c;
              }
              setCoveredDistance(`${totalDistance.toFixed(2)} km`);
            }
          }
        }

        // Add covered distance route
        map.addSource('covered-distance', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: routeGeometry,
          },
        });

        map.addLayer({
          id: 'covered-distance',
          type: 'line',
          source: 'covered-distance',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#ef4444', // Red color for covered distance
            'line-width': 4,
            'line-opacity': 0.85,
          },
        });
      }
    } catch (error) {
      console.error('Error drawing covered distance route:', error);
      // Fallback to straight line if route fetch fails
      setCoveredDistance('N/A');
    }
  };

  // Function to fetch and draw route
  const fetchAndDrawRoute = async (map: mapboxgl.Map, fromLng: number, fromLat: number, toLng: number, toLat: number) => {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${fromLng},${fromLat};${toLng},${toLat}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distance = (route.distance / 1000).toFixed(2); // Convert to km
        setRouteDistance(`${distance} km`);

        // Remove existing route layer if it exists
        if (map.getLayer('route')) {
          map.removeLayer('route');
        }
        if (map.getSource('route')) {
          map.removeSource('route');
        }

        // Add route layer
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: route.geometry,
          },
        });

        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 4,
            'line-opacity': 0.75,
          },
        });

        // Fit map to show entire route
        const coordinates = route.geometry.coordinates;
        const bounds = coordinates.reduce(
          (bounds: mapboxgl.LngLatBounds, coord: [number, number]) => {
            return bounds.extend(coord as [number, number]);
          },
          new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
        );

        map.fitBounds(bounds, {
          padding: 50,
        });
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [longitude || -74.0060, latitude || 40.7128],
      zoom: 12,
    });

    // Current shipment location marker (blue)
    const marker = new mapboxgl.Marker({
      draggable: true,
      color: "#3b82f6",
    })
      .setLngLat([longitude || -74.0060, latitude || 40.7128])
      .addTo(map);

    // Debounced route update on marker drag
    marker.on("dragend", () => {
      const lngLat = marker.getLngLat();
      onLocationChange(lngLat.lat, lngLat.lng);
      
      // Draw covered distance line from original position
      if (originalPositionRef.current && map.loaded()) {
        drawCoveredDistanceLine(
          map,
          originalPositionRef.current.lng,
          originalPositionRef.current.lat,
          lngLat.lng,
          lngLat.lat,
          recipientLng,
          recipientLat
        );
      }
      
      // Clear previous timeout
      if (routeUpdateTimeoutRef.current) {
        clearTimeout(routeUpdateTimeoutRef.current);
      }
      
      // Update route after 1 second delay
      if (showRoute && recipientLat && recipientLng && map.loaded()) {
        routeUpdateTimeoutRef.current = setTimeout(() => {
          fetchAndDrawRoute(map, lngLat.lng, lngLat.lat, recipientLng, recipientLat);
        }, 1000);
      }
    });

    map.on("click", (e) => {
      marker.setLngLat(e.lngLat);
      onLocationChange(e.lngLat.lat, e.lngLat.lng);
      
      // Draw covered distance line from original position
      if (originalPositionRef.current && map.loaded()) {
        drawCoveredDistanceLine(
          map,
          originalPositionRef.current.lng,
          originalPositionRef.current.lat,
          e.lngLat.lng,
          e.lngLat.lat,
          recipientLng,
          recipientLat
        );
      }
      
      // Clear previous timeout
      if (routeUpdateTimeoutRef.current) {
        clearTimeout(routeUpdateTimeoutRef.current);
      }
      
      // Update route after 1 second delay
      if (showRoute && recipientLat && recipientLng && map.loaded()) {
        routeUpdateTimeoutRef.current = setTimeout(() => {
          fetchAndDrawRoute(map, e.lngLat.lng, e.lngLat.lat, recipientLng, recipientLat);
        }, 1000);
      }
    });

    mapRef.current = map;
    markerRef.current = marker;
    
    // Store the original position
    originalPositionRef.current = { lng: longitude || -74.0060, lat: latitude || 40.7128 };

    return () => {
      if (routeUpdateTimeoutRef.current) {
        clearTimeout(routeUpdateTimeoutRef.current);
      }
      map.remove();
    };
  }, []);

  // Update current location marker
  useEffect(() => {
    if (markerRef.current && latitude && longitude) {
      markerRef.current.setLngLat([longitude, latitude]);
      mapRef.current?.setCenter([longitude, latitude]);
    }
  }, [latitude, longitude]);

  // Draw route when both locations are available
  useEffect(() => {
    if (!showRoute || !recipientLat || !recipientLng || !mapRef.current || !latitude || !longitude) {
      return;
    }

    const map = mapRef.current;

    // Add recipient marker (green)
    if (recipientMarkerRef.current) {
      recipientMarkerRef.current.remove();
    }

    recipientMarkerRef.current = new mapboxgl.Marker({
      color: "#10b981",
    })
      .setLngLat([recipientLng, recipientLat])
      .addTo(map);

    // Wait for map to load before adding route
    if (map.loaded()) {
      fetchAndDrawRoute(map, longitude, latitude, recipientLng, recipientLat);
    } else {
      map.on('load', () => {
        fetchAndDrawRoute(map, longitude, latitude, recipientLng, recipientLat);
      });
    }

  }, [showRoute, recipientLat, recipientLng, latitude, longitude]);

  return (
    <div className="space-y-2">
      <div className="w-full h-[400px] rounded-lg overflow-hidden border">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
      {showRoute && routeDistance && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Current Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Destination</span>
          </div>
          {coveredDistance && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Covered: {coveredDistance}</span>
            </div>
          )}
          <div className="ml-auto font-semibold">
            Total Distance: {routeDistance}
          </div>
        </div>
      )}
    </div>
  );
}
