
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShipmentForm } from "./ShipmentForm";
import toast from "react-hot-toast";
import { Search, Loader2 } from "lucide-react";
import { shipmentValidationSchema } from "@/lib/validations/shipment";
import { ZodError } from "zod";

interface EditShipmentProps {
  initialTrackingNumber?: string;
}

export function EditShipment({ initialTrackingNumber }: EditShipmentProps) {
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [shipmentFound, setShipmentFound] = useState(false);
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

  const searchShipment = async () => {
    if (!trackingNumber.trim()) {
      toast.error("Please enter a tracking number");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/shipments/${trackingNumber}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Shipment not found");
      }

      setFormData(data.shipment);
      setShipmentFound(true);
      toast.success("Shipment found!");
    } catch (err: any) {
      toast.error(err.message || "Failed to find shipment");
      setShipmentFound(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-search when initialTrackingNumber is provided
  useEffect(() => {
    if (initialTrackingNumber && initialTrackingNumber.trim()) {
      searchShipment();
    }
  }, [initialTrackingNumber]);

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      // Frontend validation
      const dataToValidate = {
        ...formData,
        trackingNumber,
      };
      
      try {
        shipmentValidationSchema.parse(dataToValidate);
      } catch (error) {
        if (error instanceof ZodError) {
          const firstError = error.errors[0];
          toast.error(`${firstError.path.join('.')}: ${firstError.message}`);
          setIsSaving(false);
          return;
        }
      }

      const response = await fetch(`/api/shipments/${trackingNumber}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          // Show validation errors from backend
          data.details.forEach((detail: { field: string; message: string }) => {
            toast.error(`${detail.field}: ${detail.message}`);
          });
        } else {
          throw new Error(data.error || "Failed to update shipment");
        }
        setIsSaving(false);
        return;
      }

      toast.success("Shipment updated successfully!");
    } catch (err: any) {
      // Don't reset form on error - keep user's data
      toast.error(err.message || "Failed to update shipment");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Shipment</CardTitle>
        <CardDescription>
          Search for a shipment by tracking number and update its details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="searchTracking">Tracking Number</Label>
            <Input
              id="searchTracking"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              onKeyDown={(e) => e.key === "Enter" && searchShipment()}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={searchShipment} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>
        </div>

        {shipmentFound && (
          <>
            <ShipmentForm formData={formData} setFormData={setFormData} isEditMode={true} />
            <Button onClick={handleUpdate} className="w-full" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Shipment...
                </>
              ) : (
                "Update Shipment"
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
