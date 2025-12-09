"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  onOriginChange?: (lat: number, lng: number) => void;
}

export function GoogleMap({
  latitude,
  longitude,
  onLocationChange,
  recipientLat,
  recipientLng,
  senderLat,
  senderLng,
  onOriginChange,
}: MapboxMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const currentLocationMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const originMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const recipientMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [showOriginChangeModal, setShowOriginChangeModal] = useState(false);
  const [pendingOriginLocation, setPendingOriginLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [originalOriginLocation, setOriginalOriginLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [longitude || -74.0060, latitude || 40.7128],
      zoom: 12,
    });

    // Current shipment location marker (pulsing dot - draggable)
    const el = document.createElement('div');
    el.className = 'current-location-pulse-draggable';
    el.innerHTML = `
      <style>
        .current-location-pulse-draggable {
          width: 48px;
          height: 48px;
          position: relative;
          cursor: grab;
        }
        .current-location-pulse-draggable:active {
          cursor: grabbing;
        }
        .current-location-pulse-draggable::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(20, 184, 166, 0.25);
          animation: pulse-ring-draggable 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .current-location-pulse-draggable::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #14B8A6;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        @keyframes pulse-ring-draggable {
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
    
    const currentMarker = new mapboxgl.Marker({
      element: el,
      draggable: true,
    })
      .setLngLat([longitude || -74.0060, latitude || 40.7128])
      .addTo(map);

    currentMarker.on("dragend", () => {
      const lngLat = currentMarker.getLngLat();
      requestAnimationFrame(() => {
        onLocationChange(lngLat.lat, lngLat.lng);
      });
    });

    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
      currentMarker.setLngLat([lng, lat]);
      requestAnimationFrame(() => {
        onLocationChange(lat, lng);
      });
    };

    map.on("click", handleMapClick);

    mapRef.current = map;
    currentLocationMarkerRef.current = currentMarker;

    return () => {
      map.remove();
    };
  }, []);

  // Update current location marker
  useEffect(() => {
    if (currentLocationMarkerRef.current && latitude && longitude) {
      currentLocationMarkerRef.current.setLngLat([longitude, latitude]);
    }
  }, [latitude, longitude]);

  // Add origin marker when sender address is provided (blue - draggable)
  useEffect(() => {
    if (senderLat && senderLng && mapRef.current) {
      // Remove existing origin marker if any
      if (originMarkerRef.current) {
        originMarkerRef.current.remove();
      }

      // Create new origin marker (navy, draggable)
      originMarkerRef.current = new mapboxgl.Marker({
        draggable: true,
        color: "#1E3A5F", // Navy color
      })
        .setLngLat([senderLng, senderLat])
        .addTo(mapRef.current);

      // Store original origin location
      setOriginalOriginLocation({ lat: senderLat, lng: senderLng });

      // Handle origin marker drag start
      originMarkerRef.current.on("dragstart", () => {
        const lngLat = originMarkerRef.current!.getLngLat();
        setOriginalOriginLocation({ lat: lngLat.lat, lng: lngLat.lng });
      });

      // Handle origin marker drag end
      originMarkerRef.current.on("dragend", () => {
        const lngLat = originMarkerRef.current!.getLngLat();
        setPendingOriginLocation({ lat: lngLat.lat, lng: lngLat.lng });
        setShowOriginChangeModal(true);
      });

      // Initially set current location to sender location if not already set
      if (!latitude || !longitude || (latitude === 40.7128 && longitude === -74.0060)) {
        if (currentLocationMarkerRef.current) {
          currentLocationMarkerRef.current.setLngLat([senderLng, senderLat]);
        }
        onLocationChange(senderLat, senderLng);
      }

      // Fit map to show both markers
      if (currentLocationMarkerRef.current) {
        const currentLngLat = currentLocationMarkerRef.current.getLngLat();
        const bounds = new mapboxgl.LngLatBounds()
          .extend([senderLng, senderLat])
          .extend([currentLngLat.lng, currentLngLat.lat]);
        
        if (recipientLat && recipientLng) {
          bounds.extend([recipientLng, recipientLat]);
        }

        mapRef.current.fitBounds(bounds, {
          padding: 100,
        });
      }
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

  const handleConfirmOriginChange = () => {
    if (pendingOriginLocation && onOriginChange) {
      onOriginChange(pendingOriginLocation.lat, pendingOriginLocation.lng);
    }
    setShowOriginChangeModal(false);
    setPendingOriginLocation(null);
  };

  const handleCancelOriginChange = () => {
    // Revert marker to original position
    if (originalOriginLocation && originMarkerRef.current) {
      originMarkerRef.current.setLngLat([originalOriginLocation.lng, originalOriginLocation.lat]);
    }
    setShowOriginChangeModal(false);
    setPendingOriginLocation(null);
  };

  return (
    <>
      <div className="space-y-2">
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden border">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Origin (Sender) - Draggable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
            <span>Current Location - Draggable</span>
          </div>
          {recipientLat && recipientLng && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Destination</span>
            </div>
          )}
        </div>
      </div>

      {/* Origin Change Confirmation Modal */}
      <Dialog open={showOriginChangeModal} onOpenChange={setShowOriginChangeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Origin Location?</DialogTitle>
            <DialogDescription>
              You are about to change the origin (sender) location. This will update the starting point of the shipment.
              Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelOriginChange}>
              Cancel
            </Button>
            <Button onClick={handleConfirmOriginChange}>
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}