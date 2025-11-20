
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
  senderAddress?: string;
  senderCity?: string;
  senderState?: string;
  senderCountry?: string;
}

export function RouteMap({ 
  currentLat, 
  currentLng,
  destinationAddress,
  destinationCity,
  destinationState,
  destinationCountry,
  senderAddress,
  senderCity,
  senderState,
  senderCountry
}: RouteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const currentMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const destinationMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const originMarkerRef = useRef<mapboxgl.Marker | null>(null);

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
      // Clean up markers
      if (currentMarkerRef.current) {
        currentMarkerRef.current.remove();
      }
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.remove();
      }
      if (originMarkerRef.current) {
        originMarkerRef.current.remove();
      }
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !currentLat || !currentLng) return;

    const map = mapRef.current;

    // Geocode addresses and add markers
    const geocodeAndAddMarkers = async () => {
      try {
        // Remove old markers if they exist
        if (currentMarkerRef.current) {
          currentMarkerRef.current.remove();
        }
        if (destinationMarkerRef.current) {
          destinationMarkerRef.current.remove();
        }
        if (originMarkerRef.current) {
          originMarkerRef.current.remove();
        }

        const bounds = new mapboxgl.LngLatBounds();

        // Add current location marker (pulsing dot)
        const el = document.createElement('div');
        el.className = 'current-location-pulse';
        el.innerHTML = `
          <style>
            .current-location-pulse {
              width: 48px;
              height: 48px;
              position: relative;
            }
            .current-location-pulse::before {
              content: '';
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 48px;
              height: 48px;
              border-radius: 50%;
              background: rgba(66, 133, 244, 0.25);
              animation: pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            .current-location-pulse::after {
              content: '';
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #4285f4;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            }
            @keyframes pulse-ring {
              0% {
                transform: translate(-50%, -50%) scale(0.8);
                opacity: 1;
              }
              50% {
                transform: translate(-50%, -50%) scale(1.2);
                opacity: 0.6;
              }
              100% {
                transform: translate(-50%, -50%) scale(0.8);
                opacity: 1;
              }
            }
          </style>
        `;
        
        currentMarkerRef.current = new mapboxgl.Marker({ element: el })
          .setLngLat([currentLng, currentLat])
          .setPopup(new mapboxgl.Popup().setHTML("<h3>Current Location</h3>"))
          .addTo(map);
        bounds.extend([currentLng, currentLat]);

        // Geocode and add origin marker (blue - sender address) if provided
        if (senderAddress && senderCity && senderState && senderCountry) {
          const originQuery = `${senderAddress}, ${senderCity}, ${senderState}, ${senderCountry}`;
          const originGeocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(originQuery)}.json?access_token=${mapboxgl.accessToken}`;
          
          const originResponse = await fetch(originGeocodeUrl);
          const originData = await originResponse.json();

          if (originData.features && originData.features.length > 0) {
            const [originLng, originLat] = originData.features[0].center;
            
            originMarkerRef.current = new mapboxgl.Marker({ 
              color: "#3b82f6",
              draggable: true 
            })
              .setLngLat([originLng, originLat])
              .setPopup(new mapboxgl.Popup().setHTML("<h3>Origin (Sender)</h3>"))
              .addTo(map);

            // Handle origin marker drag
            originMarkerRef.current.on("dragend", () => {
              const lngLat = originMarkerRef.current!.getLngLat();
              console.log("Origin marker moved to:", lngLat);
            });

            bounds.extend([originLng, originLat]);
          }
        }

        // Geocode and add destination marker (green)
        const destQuery = `${destinationAddress}, ${destinationCity}, ${destinationState}, ${destinationCountry}`;
        const destGeocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destQuery)}.json?access_token=${mapboxgl.accessToken}`;

        const destResponse = await fetch(destGeocodeUrl);
        const destData = await destResponse.json();

        if (destData.features && destData.features.length > 0) {
          const [destLng, destLat] = destData.features[0].center;

          destinationMarkerRef.current = new mapboxgl.Marker({ color: "#10b981" })
            .setLngLat([destLng, destLat])
            .setPopup(new mapboxgl.Popup().setHTML("<h3>Destination</h3>"))
            .addTo(map);
          bounds.extend([destLng, destLat]);
        }

        // Fit map to show all markers
        map.fitBounds(bounds, { padding: 100 });
      } catch (error) {
        console.error('Error geocoding addresses:', error);
      }
    };

    if (map.loaded()) {
      geocodeAndAddMarkers();
    } else {
      map.on('load', geocodeAndAddMarkers);
    }

  }, [currentLat, currentLng, destinationAddress, destinationCity, destinationState, destinationCountry, senderAddress, senderCity, senderState, senderCountry]);

  return (
    <div className="space-y-3">
      <div className="w-full h-[500px] rounded-lg overflow-hidden border">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
      <div className="flex items-center gap-6 p-4 bg-muted rounded-lg flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span className="text-sm font-medium">Origin (Sender) - Draggable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-sm font-medium">Current Location - Draggable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span className="text-sm font-medium">Destination</span>
        </div>
      </div>
    </div>
  );
}
