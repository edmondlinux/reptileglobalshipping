
"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export function GoogleMap({ latitude, longitude, onLocationChange }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");
      const { Marker } = await loader.importLibrary("marker");

      const defaultCenter = { lat: latitude || 40.7128, lng: longitude || -74.0060 };

      const mapInstance = new Map(mapRef.current!, {
        center: defaultCenter,
        zoom: 12,
        mapId: "SHIPMENT_MAP",
      });

      const markerInstance = new Marker({
        map: mapInstance,
        position: defaultCenter,
        draggable: true,
      });

      markerInstance.addListener("dragend", () => {
        const position = markerInstance.getPosition();
        if (position) {
          onLocationChange(position.lat(), position.lng());
        }
      });

      mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          markerInstance.setPosition(e.latLng);
          onLocationChange(e.latLng.lat(), e.latLng.lng());
        }
      });

      setMap(mapInstance);
      setMarker(markerInstance);
    };

    initMap();
  }, []);

  useEffect(() => {
    if (marker && latitude && longitude) {
      const newPosition = { lat: latitude, lng: longitude };
      marker.setPosition(newPosition);
      map?.setCenter(newPosition);
    }
  }, [latitude, longitude, marker, map]);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
