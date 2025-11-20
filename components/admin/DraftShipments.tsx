
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShipmentForm } from "./ShipmentForm";
import toast from "react-hot-toast";
import { FileText, Loader2, Trash2, Search, Save } from "lucide-react";
import { shipmentValidationSchema } from "@/lib/validations/shipment";
import { ZodError } from "zod";

interface Draft {
  _id: string;
  trackingNumber: string;
  senderName?: string;
  recipientName?: string;
  createdAt: string;
  [key: string]: any;
}

export function DraftShipments() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
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

  const fetchDrafts = async () => {
    try {
      const response = await fetch("/api/drafts");
      const data = await response.json();

      if (response.ok) {
        setDrafts(data.drafts);
      } else {
        toast.error("Failed to fetch drafts");
      }
    } catch (error) {
      toast.error("Error fetching drafts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const loadDraft = (draft: Draft) => {
    setSelectedDraft(draft);
    setFormData({
      senderName: draft.senderName || "",
      senderEmail: draft.senderEmail || "",
      senderPhone: draft.senderPhone || "",
      senderAddress: draft.senderAddress || "",
      senderCity: draft.senderCity || "",
      senderState: draft.senderState || "",
      senderZip: draft.senderZip || "",
      senderCountry: draft.senderCountry || "",
      recipientName: draft.recipientName || "",
      recipientEmail: draft.recipientEmail || "",
      recipientPhone: draft.recipientPhone || "",
      recipientAddress: draft.recipientAddress || "",
      recipientCity: draft.recipientCity || "",
      recipientState: draft.recipientState || "",
      recipientZip: draft.recipientZip || "",
      recipientCountry: draft.recipientCountry || "",
      packageType: draft.packageType || "box",
      weight: draft.weight || "",
      dimensions: {
        length: draft.dimensions?.length || "",
        width: draft.dimensions?.width || "",
        height: draft.dimensions?.height || "",
      },
      value: draft.value || "",
      description: draft.description || "",
      specialInstructions: draft.specialInstructions || "",
      serviceType: draft.serviceType || "standard",
      priority: draft.priority || "normal",
      insurance: draft.insurance || false,
      signatureRequired: draft.signatureRequired || false,
      shippingDate: draft.shippingDate || "",
      estimatedDeliveryDate: draft.estimatedDeliveryDate || "",
      shippingCost: draft.shippingCost || "",
      latitude: draft.latitude || 40.7128,
      longitude: draft.longitude || -74.0060,
    });
  };

  const updateDraft = async () => {
    if (!selectedDraft) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/drafts/${selectedDraft.trackingNumber}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update draft");
      }

      toast.success("Draft updated successfully!");
      await fetchDrafts();
    } catch (err: any) {
      toast.error(err.message || "Failed to update draft");
    } finally {
      setIsProcessing(false);
    }
  };

  const completeDraft = async () => {
    if (!selectedDraft) return;

    setIsProcessing(true);
    try {
      const dataToValidate = {
        ...formData,
        trackingNumber: selectedDraft.trackingNumber,
      };

      try {
        shipmentValidationSchema.parse(dataToValidate);
      } catch (error) {
        if (error instanceof ZodError) {
          const firstError = error.errors[0];
          toast.error(`${firstError.path.join('.')}: ${firstError.message}`);
          setIsProcessing(false);
          return;
        }
      }

      const response = await fetch("/api/shipments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToValidate),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          data.details.forEach((detail: { field: string; message: string }) => {
            toast.error(`${detail.field}: ${detail.message}`);
          });
        } else {
          throw new Error(data.error || "Failed to create shipment");
        }
        setIsProcessing(false);
        return;
      }

      // Delete the draft after successful shipment creation
      await fetch(`/api/drafts/${selectedDraft.trackingNumber}`, {
        method: "DELETE",
      });

      toast.success("Shipment created successfully from draft!");
      setSelectedDraft(null);
      await fetchDrafts();
    } catch (err: any) {
      toast.error(err.message || "Failed to complete draft");
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteDraft = async (trackingNumber: string) => {
    if (!confirm("Are you sure you want to delete this draft?")) return;

    try {
      const response = await fetch(`/api/drafts/${trackingNumber}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete draft");
      }

      toast.success("Draft deleted successfully!");
      if (selectedDraft?.trackingNumber === trackingNumber) {
        setSelectedDraft(null);
      }
      await fetchDrafts();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete draft");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Draft Shipments</CardTitle>
          <CardDescription>
            {drafts.length} draft{drafts.length !== 1 ? "s" : ""} saved
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {drafts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No drafts saved</p>
              </div>
            ) : (
              drafts.map((draft) => (
                <div
                  key={draft._id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedDraft?.trackingNumber === draft.trackingNumber
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => loadDraft(draft)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-mono text-sm font-semibold">
                        {draft.trackingNumber}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {draft.senderName || "No sender"} → {draft.recipientName || "No recipient"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(draft.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDraft(draft.trackingNumber);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>
            {selectedDraft ? `Edit Draft: ${selectedDraft.trackingNumber}` : "Select a Draft"}
          </CardTitle>
          <CardDescription>
            {selectedDraft
              ? "Complete the form and create the shipment"
              : "Choose a draft from the list to continue"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedDraft ? (
            <div className="space-y-6">
              <ShipmentForm formData={formData} setFormData={setFormData} isEditMode={false} />
              <div className="flex gap-3">
                <Button onClick={completeDraft} className="flex-1" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Shipment...
                    </>
                  ) : (
                    "Complete & Create Shipment"
                  )}
                </Button>
                <Button onClick={updateDraft} variant="outline" className="flex-1" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Draft
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a draft from the list to view and edit</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
