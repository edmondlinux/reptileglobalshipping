
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShipmentForm } from "./ShipmentForm";
import toast from "react-hot-toast";
import { Copy, Loader2 } from "lucide-react";

interface CreateShipmentProps {
  trackingNumber: string;
  onRegenerateTracking: () => void;
}

export function CreateShipment({ trackingNumber, onRegenerateTracking }: CreateShipmentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    senderPhone: "",
    senderAddress: "",
    senderCity: "",
    senderState: "",
    senderZip: "",
    senderCountry: "",
    recipientName: "",
    recipientEmail: "",
    recipientPhone: "",
    recipientAddress: "",
    recipientCity: "",
    recipientState: "",
    recipientZip: "",
    recipientCountry: "",
    packageType: "box",
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
    value: "",
    description: "",
    specialInstructions: "",
    serviceType: "standard",
    priority: "normal",
    insurance: false,
    signatureRequired: false,
    shippingDate: "",
    estimatedDeliveryDate: "",
    shippingCost: "",
    latitude: 40.7128,
    longitude: -74.0060,
  });

  const copyTrackingNumber = () => {
    navigator.clipboard.writeText(trackingNumber);
    toast.success("Tracking number copied to clipboard!");
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/shipments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackingNumber,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create shipment");
      }

      toast.success("Shipment created successfully!");
      onRegenerateTracking();
      // Reset form
      setFormData({
        senderName: "",
        senderEmail: "",
        senderPhone: "",
        senderAddress: "",
        senderCity: "",
        senderState: "",
        senderZip: "",
        senderCountry: "",
        recipientName: "",
        recipientEmail: "",
        recipientPhone: "",
        recipientAddress: "",
        recipientCity: "",
        recipientState: "",
        recipientZip: "",
        recipientCountry: "",
        packageType: "box",
        weight: "",
        dimensions: {
          length: "",
          width: "",
          height: "",
        },
        value: "",
        description: "",
        specialInstructions: "",
        serviceType: "standard",
        priority: "normal",
        insurance: false,
        signatureRequired: false,
        shippingDate: "",
        estimatedDeliveryDate: "",
        shippingCost: "",
        latitude: 40.7128,
        longitude: -74.0060,
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to create shipment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Shipment</CardTitle>
        <CardDescription>
          Fill in the details below to create a new shipment
        </CardDescription>
        <div className="flex items-center gap-2 mt-4">
          <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm">
            {trackingNumber}
          </div>
          <Button onClick={copyTrackingNumber} variant="outline" size="icon">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ShipmentForm formData={formData} setFormData={setFormData} />
        <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Shipment...
            </>
          ) : (
            "Create Shipment"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
