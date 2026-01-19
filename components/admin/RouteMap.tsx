
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
  onOriginChange?: (lat: number, lng: number) => void;
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
  senderCountry,
  onOriginChange,
}: RouteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const currentMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const destinationMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const originMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [showOriginChangeModal, setShowOriginChangeModal] = useState(false);
  const [pendingOriginLocation, setPendingOriginLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [originalOriginLocation, setOriginalOriginLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [currentLng, currentLat],
      zoom: 8,
      preserveDrawingBuffer: true
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
        el.className = 'current-location-marker';
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = '#14B8A6';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
        
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
              color: "#1E3A5F",
              draggable: false 
            })
              .setLngLat([originLng, originLat])
              .setPopup(new mapboxgl.Popup().setHTML("<h3>Origin (Sender)</h3>"))
              .addTo(map);

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
      <div className="space-y-3">
        <div className="w-full h-[500px] rounded-lg overflow-hidden border">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>
        <div className="flex items-center gap-6 p-4 bg-muted rounded-lg flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-sm font-medium">Origin (Sender)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-sm font-medium">Current Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium">Destination</span>
          </div>
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
