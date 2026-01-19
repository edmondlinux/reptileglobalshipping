"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FooterSection } from "@/components/layout/sections/footer";
import { ErrorMessage } from "@/components/ui/error-message";
import {
  Package,
  Loader2,
  MapPin,
  Calendar,
  DollarSign,
  Box,
  Weight,
  Ruler,
  User,
  Mail,
  Phone,
  Home,
  Shield,
  FileText,
  Download,
} from "lucide-react";
import { RouteMap } from "@/components/admin/RouteMap";
import { ShipmentTimeline } from "@/components/admin/ShipmentTimeline";
import toast from "react-hot-toast";
import { generateShippingLabelPDF } from "@/lib/pdf/shipment-label";
import { useTranslations } from "next-intl";

interface ShipmentData {
  trackingNumber: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderAddress: string;
  senderCity: string;
  senderState: string;
  senderZip: string;
  senderCountry: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientCity: string;
  recipientState: string;
  recipientZip: string;
  recipientCountry: string;
  packageType: string;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  value: string;
  description: string;
  specialInstructions: string;
  serviceType: string;
  priority: string;
  insurance: boolean;
  signatureRequired: boolean;
  shippingDate: string;
  estimatedDeliveryDate: string;
  shippingCost: string;
  latitude: number;
  longitude: number;
  recipientLatitude?: number;
  recipientLongitude?: number;
  status: string;
  history?: Array<{
    status: string;
    location: string;
    description: string;
    timestamp: Date | string;
    icon: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export function TrackClient() {
  const t = useTranslations("Track");
  const searchParams = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shipment, setShipment] = useState<ShipmentData | null>(null);

  useEffect(() => {
    const tn = searchParams.get("tn");
    if (tn) {
      setTrackingNumber(tn);
      handleTrackWithNumber(tn);
    }
  }, [searchParams]);

  const handleTrackWithNumber = async (tn: string) => {
    if (!tn.trim()) {
      toast.error("Please enter a tracking number");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/shipments/${tn.trim()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("notFound"));
      }

      setShipment(data.shipment);
      toast.success(t("found"));
    } catch (err: any) {
      toast.error(err.message || "Failed to find shipment");
      setShipment(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrack = async () => {
    const inputElement = document.querySelector(
      'input[type="text"]',
    ) as HTMLInputElement;
    const currentValue = inputElement?.value.trim() || trackingNumber.trim();
    if (!currentValue) {
      toast.error("Please enter a tracking number");
      return;
    }
    setTrackingNumber(currentValue);
    await handleTrackWithNumber(currentValue);
  };

  const downloadShipmentLabel = async () => {
    if (!shipment) return;

    try {
      await generateShippingLabelPDF(shipment);
      toast.success("Shipping label PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500",
      "in-transit": "bg-blue-500",
      delivered: "bg-green-500",
      cancelled: "bg-red-500",
      processing: "bg-orange-500",
      "out-for-delivery": "bg-purple-500",
      "on-hold": "bg-amber-600",
    };
    return colors[status] || "bg-gray-500";
  };

  return (
    <>
      <section className="container py-24 sm:py-32 overflow-x-hidden">
        <div className="mx-auto max-w-6xl w-full">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Package className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("title")}
            </h1>
            <p className="text-xl text-muted-foreground">{t("subtitle")}</p>
          </div>

          <div className="space-y-4 mb-8 w-full">
            <Input
              type="text"
              placeholder={t("placeholder")}
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              onPaste={(e) => {
                e.preventDefault();
                const pastedText = e.clipboardData.getData("text");
                setTrackingNumber(pastedText);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleTrack();
                }
              }}
              className="text-base sm:text-lg h-12 sm:h-14 w-full"
            />
            <Button
              onClick={handleTrack}
              size="lg"
              className="w-full opacity-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("tracking")}
                </>
              ) : (
                t("button")
              )}
            </Button>
            {!isLoading && !shipment && trackingNumber && (
              <ErrorMessage
                errorKey="shipmentNotFound"
                className="justify-center mt-2"
              />
            )}
          </div>

          {shipment && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-xl sm:text-2xl break-all">
                        {t("status")} {shipment.trackingNumber}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {t("created")}{" "}
                        {new Date(shipment.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                      <Button
                        onClick={downloadShipmentLabel}
                        variant="outline"
                        className="gap-2 flex-1 sm:flex-initial"
                      >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          {t("downloadLabel")}
                        </span>
                        <span className="sm:hidden">{t("label")}</span>
                      </Button>
                      <Badge
                        className={`${getStatusColor(shipment.status)} text-white text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2 whitespace-nowrap`}
                      >
                        {shipment.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {shipment.latitude && shipment.longitude && (
                <Card>
                  <CardHeader className="bg-muted/50">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {t("routeTitle")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <RouteMap
                      currentLat={shipment.latitude}
                      currentLng={shipment.longitude}
                      destinationAddress={shipment.recipientAddress}
                      destinationCity={shipment.recipientCity}
                      destinationState={shipment.recipientState}
                      destinationCountry={shipment.recipientCountry}
                      senderAddress={shipment.senderAddress}
                      senderCity={shipment.senderCity}
                      senderState={shipment.senderState}
                      senderCountry={shipment.senderCountry}
                    />
                  </CardContent>
                </Card>
              )}

              <ShipmentTimeline history={shipment.history || []} />

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="bg-muted/50">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {t("senderInfo")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{shipment.senderName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="text-sm">{shipment.senderEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="text-sm">{shipment.senderPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Home className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="text-sm">{shipment.senderAddress}</p>
                        <p className="text-sm">
                          {shipment.senderCity}, {shipment.senderState}{" "}
                          {shipment.senderZip}
                        </p>
                        <p className="text-sm">{shipment.senderCountry}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-muted/50">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {t("recipientInfo")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{shipment.recipientName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="text-sm">{shipment.recipientEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="text-sm">{shipment.recipientPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Home className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="text-sm">{shipment.recipientAddress}</p>
                        <p className="text-sm">
                          {shipment.recipientCity}, {shipment.recipientState}{" "}
                          {shipment.recipientZip}
                        </p>
                        <p className="text-sm">{shipment.recipientCountry}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="bg-muted/50">
                  <CardTitle className="flex items-center gap-2">
                    <Box className="h-5 w-5" />
                    {t("packageDetails")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      {t("type")}
                    </p>
                    <p className="font-medium">{shipment.packageType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Weight className="h-4 w-4" />
                      {t("weight")}
                    </p>
                    <p className="font-medium">{shipment.weight}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Ruler className="h-4 w-4" />
                      {t("dimensions")}
                    </p>
                    <p className="font-medium">
                      {shipment.dimensions.length}x{shipment.dimensions.width}x
                      {shipment.dimensions.height}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      {t("value")}
                    </p>
                    <p className="font-medium">${shipment.value}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {t("shippingDate")}
                    </p>
                    <p className="font-medium">
                      {new Date(shipment.shippingDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {t("estDelivery")}
                    </p>
                    <p className="font-medium">
                      {new Date(
                        shipment.estimatedDeliveryDate,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-muted/50">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {t("serviceDetails")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {t("service")}
                    </p>
                    <p className="font-medium">{shipment.serviceType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {t("priority")}
                    </p>
                    <Badge variant="outline" className="capitalize">
                      {shipment.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={shipment.insurance ? "default" : "secondary"}
                    >
                      {shipment.insurance ? t("insured") : t("noInsurance")}
                    </Badge>
                    <Badge
                      variant={
                        shipment.signatureRequired ? "default" : "secondary"
                      }
                    >
                      {shipment.signatureRequired
                        ? t("sigRequired")
                        : t("noSigRequired")}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {(shipment.description || shipment.specialInstructions) && (
                <Card>
                  <CardHeader className="bg-muted/50">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {t("additionalInfo")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    {shipment.description && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {t("description")}
                        </p>
                        <p className="text-sm">{shipment.description}</p>
                      </div>
                    )}
                    {shipment.specialInstructions && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {t("specialInstructions")}
                        </p>
                        <p className="text-sm">
                          {shipment.specialInstructions}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </section>
      <FooterSection />
    </>
  );
}
