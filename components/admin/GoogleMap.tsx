"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapboxMapProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  showRoute?: boolean;
  recipientLat?: number;
  recipientLng?: number;
  senderLat?: number;
  senderLng?: number;
  isEditMode?: boolean;
}

export function GoogleMap({
  latitude,
  longitude,
  onLocationChange,
  recipientLat,
  recipientLng,
  senderLat,
  senderLng,
}: MapboxMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const recipientMarkerRef = useRef<mapboxgl.Marker | null>(null);

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

    marker.on("dragend", () => {
      const lngLat = marker.getLngLat();
      requestAnimationFrame(() => {
        onLocationChange(lngLat.lat, lngLat.lng);
      });
    });

    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
      requestAnimationFrame(() => {
        onLocationChange(lat, lng);
      });
    };

    map.on("click", handleMapClick);

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
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

  // Move marker to sender address when it's provided
  useEffect(() => {
    if (senderLat && senderLng && markerRef.current && mapRef.current) {
      markerRef.current.setLngLat([senderLng, senderLat]);
      mapRef.current.setCenter([senderLng, senderLat]);
      onLocationChange(senderLat, senderLng);
    }
  }, [senderLat, senderLng]);

  // Add recipient marker when both locations are available
  useEffect(() => {
    if (!recipientLat || !recipientLng || !mapRef.current) {
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

    // Fit map to show both markers
    if (latitude && longitude) {
      const bounds = new mapboxgl.LngLatBounds()
        .extend([longitude, latitude])
        .extend([recipientLng, recipientLat]);

      map.fitBounds(bounds, {
        padding: 100,
      });
    }
  }, [recipientLat, recipientLng, latitude, longitude]);

  return (
    <div className="space-y-2">
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden border">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Origin</span>
        </div>
        {recipientLat && recipientLng && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Destination</span>
          </div>
        )}
      </div>
    </div>
  );
}