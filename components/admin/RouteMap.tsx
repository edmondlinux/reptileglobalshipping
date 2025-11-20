
"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface RouteMapProps {
  currentLat: number;
  currentLng: number;
  destinationAddress: string;
  destinationCity: string;
  destinationState: string;
  destinationCountry: string;
}

export function RouteMap({ 
  currentLat, 
  currentLng,
  destinationAddress,
  destinationCity,
  destinationState,
  destinationCountry
}: RouteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [currentLng, currentLat],
      zoom: 8,
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !currentLat || !currentLng) return;

    const map = mapRef.current;

    // Geocode destination address and add markers
    const geocodeAndAddMarkers = async () => {
      const query = `${destinationAddress}, ${destinationCity}, ${destinationState}, ${destinationCountry}`;
      const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}`;

      try {
        const geocodeResponse = await fetch(geocodeUrl);
        const geocodeData = await geocodeResponse.json();

        if (geocodeData.features && geocodeData.features.length > 0) {
          const [destLng, destLat] = geocodeData.features[0].center;

          // Add current location marker (blue)
          new mapboxgl.Marker({ color: "#3b82f6" })
            .setLngLat([currentLng, currentLat])
            .setPopup(new mapboxgl.Popup().setHTML("<h3>Current Location</h3>"))
            .addTo(map);

          // Add destination marker (green)
          new mapboxgl.Marker({ color: "#10b981" })
            .setLngLat([destLng, destLat])
            .setPopup(new mapboxgl.Popup().setHTML("<h3>Destination</h3>"))
            .addTo(map);

          // Fit map to show both markers
          const bounds = new mapboxgl.LngLatBounds()
            .extend([currentLng, currentLat])
            .extend([destLng, destLat]);

          map.fitBounds(bounds, { padding: 100 });
        }
      } catch (error) {
        console.error('Error geocoding address:', error);
      }
    };

    if (map.loaded()) {
      geocodeAndAddMarkers();
    } else {
      map.on('load', geocodeAndAddMarkers);
    }

  }, [currentLat, currentLng, destinationAddress, destinationCity, destinationState, destinationCountry]);

  return (
    <div className="space-y-3">
      <div className="w-full h-[500px] rounded-lg overflow-hidden border">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
      <div className="flex items-center gap-6 p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span className="text-sm font-medium">Current Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span className="text-sm font-medium">Destination</span>
        </div>
      </div>
    </div>
  );
}
