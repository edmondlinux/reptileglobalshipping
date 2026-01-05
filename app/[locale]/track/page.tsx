
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FooterSection } from "@/components/layout/sections/footer";
import { ErrorMessage } from "@/components/ui/error-message";
import { Package, Loader2, MapPin, Calendar, DollarSign, Box, Weight, Ruler, User, Mail, Phone, Home, Shield, FileText, Download } from "lucide-react";
import { RouteMap } from "@/components/admin/RouteMap";
import { ShipmentTimeline } from "@/components/admin/ShipmentTimeline";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
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

export default function TrackPage() {
  const t = useTranslations("Track");
  const searchParams = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shipment, setShipment] = useState<ShipmentData | null>(null);

  useEffect(() => {
    const tn = searchParams.get('tn');
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
    // Get the current value directly from the input element to handle paste scenarios
    const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
    const currentValue = inputElement?.value.trim() || trackingNumber.trim();
    if (!currentValue) {
      toast.error("Please enter a tracking number");
      return;
    }
    // Update state to match the current input value
    setTrackingNumber(currentValue);
    await handleTrackWithNumber(currentValue);
  };

  const downloadShipmentLabel = () => {
    if (!shipment) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const primaryColor = [20, 184, 166]; // #14B8A6 - Teal
    const darkGray = [51, 51, 51];
    const lightGray = [128, 128, 128];
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 15;

    // Header with border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, 40);

    // Logo and company name
    doc.setFontSize(24);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('Reptile Global', pageWidth / 2, yPos + 5, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setFont('helvetica', 'normal');
    doc.text('Global Shipping Solutions', pageWidth / 2, yPos + 12, { align: 'center' });

    // Tracking number
    doc.setFontSize(16);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`TRACKING: ${shipment.trackingNumber}`, pageWidth / 2, yPos + 20, { align: 'center' });

    // Barcode representation
    yPos = 55;
    doc.setFillColor(245, 245, 245);
    doc.rect(15, yPos, pageWidth - 30, 30, 'F');
    
    // Generate a realistic barcode pattern based on tracking number
    const barcodeStartX = 30;
    const barcodeWidth = pageWidth - 60;
    const barHeight = 18;
    const barcodeY = yPos + 3;
    
    // Create alternating bars based on tracking number characters
    doc.setFillColor(0, 0, 0);
    let currentX = barcodeStartX;
    const trackingChars = shipment.trackingNumber.split('');
    
    // Start and end guards (thin-thick-thin pattern)
    doc.rect(currentX, barcodeY, 1, barHeight, 'F');
    currentX += 2;
    doc.rect(currentX, barcodeY, 2, barHeight, 'F');
    currentX += 3;
    doc.rect(currentX, barcodeY, 1, barHeight, 'F');
    currentX += 3;
    
    // Generate bars based on tracking number
    trackingChars.forEach((char, index) => {
      const charCode = char.charCodeAt(0);
      const pattern = charCode % 4; // Create 4 different patterns
      
      if (pattern === 0) {
        // Thin-thick pattern
        doc.rect(currentX, barcodeY, 1, barHeight, 'F');
        currentX += 2;
        doc.rect(currentX, barcodeY, 2.5, barHeight, 'F');
        currentX += 3.5;
      } else if (pattern === 1) {
        // Thick-thin pattern
        doc.rect(currentX, barcodeY, 2.5, barHeight, 'F');
        currentX += 3.5;
        doc.rect(currentX, barcodeY, 1, barHeight, 'F');
        currentX += 2;
      } else if (pattern === 2) {
        // Thin-thin-thick pattern
        doc.rect(currentX, barcodeY, 1, barHeight, 'F');
        currentX += 2;
        doc.rect(currentX, barcodeY, 1, barHeight, 'F');
        currentX += 2;
        doc.rect(currentX, barcodeY, 2.5, barHeight, 'F');
        currentX += 3.5;
      } else {
        // Thick-thin-thin pattern
        doc.rect(currentX, barcodeY, 2.5, barHeight, 'F');
        currentX += 3.5;
        doc.rect(currentX, barcodeY, 1, barHeight, 'F');
        currentX += 2;
        doc.rect(currentX, barcodeY, 1, barHeight, 'F');
        currentX += 2;
      }
      
      if (currentX > barcodeStartX + barcodeWidth - 20) return;
    });
    
    // End guards
    currentX = barcodeStartX + barcodeWidth - 10;
    doc.rect(currentX, barcodeY, 1, barHeight, 'F');
    currentX += 2;
    doc.rect(currentX, barcodeY, 2, barHeight, 'F');
    currentX += 3;
    doc.rect(currentX, barcodeY, 1, barHeight, 'F');
    
    // Tracking number below barcode
    doc.setFontSize(10);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFont('courier', 'bold');
    doc.text(shipment.trackingNumber, pageWidth / 2, yPos + 26, { align: 'center' });

    // Sender and Recipient sections side by side
    yPos = 85;
    const colWidth = (pageWidth - 25) / 2;
    
    // Sender section
    doc.setFillColor(124, 58, 237);
    doc.rect(10, yPos, colWidth, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('FROM', 15, yPos + 5.5);

    yPos += 12;
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(shipment.senderName, 15, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(shipment.senderEmail, 15, yPos);
    yPos += 5;
    doc.text(shipment.senderPhone, 15, yPos);
    yPos += 5;
    doc.text(shipment.senderAddress, 15, yPos);
    yPos += 5;
    doc.text(`${shipment.senderCity}, ${shipment.senderState} ${shipment.senderZip}`, 15, yPos);
    yPos += 5;
    doc.text(shipment.senderCountry, 15, yPos);

    // Recipient section
    yPos = 85;
    doc.setFillColor(124, 58, 237);
    doc.rect(10 + colWidth + 5, yPos, colWidth, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('TO', 15 + colWidth + 5, yPos + 5.5);

    yPos += 12;
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(shipment.recipientName, 15 + colWidth + 5, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(shipment.recipientEmail, 15 + colWidth + 5, yPos);
    yPos += 5;
    doc.text(shipment.recipientPhone, 15 + colWidth + 5, yPos);
    yPos += 5;
    doc.text(shipment.recipientAddress, 15 + colWidth + 5, yPos);
    yPos += 5;
    doc.text(`${shipment.recipientCity}, ${shipment.recipientState} ${shipment.recipientZip}`, 15 + colWidth + 5, yPos);
    yPos += 5;
    doc.text(shipment.recipientCountry, 15 + colWidth + 5, yPos);

    // Package Details section
    yPos = 140;
    doc.setFillColor(124, 58, 237);
    doc.rect(10, yPos, pageWidth - 20, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PACKAGE DETAILS', 15, yPos + 5.5);

    yPos += 12;
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    
    // Package details in grid
    const detailsLeft = 15;
    const detailsRight = pageWidth / 2 + 5;
    
    doc.text('Type:', detailsLeft, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(shipment.packageType.toUpperCase(), detailsLeft + 25, yPos);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Service:', detailsRight, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(shipment.serviceType.toUpperCase(), detailsRight + 25, yPos);
    
    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Weight:', detailsLeft, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(shipment.weight, detailsLeft + 25, yPos);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Priority:', detailsRight, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]); 
    doc.setFont('helvetica', 'bold');
    doc.text(shipment.priority.toUpperCase(), detailsRight + 25, yPos);

    
    yPos += 6;
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('Dimensions:', detailsLeft, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(`${shipment.dimensions.length} × ${shipment.dimensions.width} × ${shipment.dimensions.height}`, detailsLeft + 25, yPos);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Ship Date:', detailsRight, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(shipment.shippingDate, detailsRight + 25, yPos);
    
    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Value:', detailsLeft, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(`$${shipment.value}`, detailsLeft + 25, yPos);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Est. Delivery:', detailsRight, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(shipment.estimatedDeliveryDate, detailsRight + 25, yPos);

    if (shipment.description) {
      yPos += 8;
      doc.setFont('helvetica', 'bold');
      doc.text('Description:', detailsLeft, yPos);
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(shipment.description, pageWidth - 50);
      doc.text(descLines, detailsLeft + 25, yPos);
      yPos += descLines.length * 5;
    }

    if (shipment.specialInstructions) {
      yPos += 5;
      doc.setFont('helvetica', 'bold');
      doc.text('Special Instructions:', detailsLeft, yPos);
      doc.setFont('helvetica', 'normal');
      const instrLines = doc.splitTextToSize(shipment.specialInstructions, pageWidth - 50);
      doc.text(instrLines, detailsLeft + 25, yPos);
      yPos += instrLines.length * 5;
    }

    // Additional Services
    yPos += 8;
    doc.setFillColor(124, 58, 237);
    doc.rect(10, yPos, pageWidth - 20, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('ADDITIONAL SERVICES', 15, yPos + 5.5);

    yPos += 12;
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const services = [];
    if (shipment.insurance) services.push('✓ Insurance Coverage');
    if (shipment.signatureRequired) services.push('✓ Signature Required');
    if (services.length > 0) {
      doc.text(services.join('  |  '), 15, yPos);
    } else {
      doc.text('No additional services', 15, yPos);
    }

    // Footer
    yPos = doc.internal.pageSize.getHeight() - 25;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(10, yPos, pageWidth - 10, yPos);
    
    yPos += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text('Reptile Global', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 5;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text('For support, contact us at support@reptileglobal.com', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 4;
    doc.text('This is an official shipping label. Please keep for your records.', pageWidth / 2, yPos, { align: 'center' });

    // Save the PDF
    doc.save(`shipping-label-${shipment.trackingNumber}.pdf`);
    toast.success("Shipping label PDF downloaded successfully!");
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
            <p className="text-xl text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>

          <div className="space-y-4 mb-8 w-full">
            <Input
              type="text"
              placeholder={t("placeholder")}
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              onPaste={(e) => {
                e.preventDefault();
                const pastedText = e.clipboardData.getData('text');
                setTrackingNumber(pastedText);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
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
              <ErrorMessage errorKey="shipmentNotFound" className="justify-center mt-2" />
            )}
          </div>

          {shipment && (
            <div className="space-y-6">
              {/* Status Card */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-xl sm:text-2xl break-all">{t("status")} {shipment.trackingNumber}</CardTitle>
                      <CardDescription className="mt-2">
                        {t("created")} {new Date(shipment.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                      <Button 
                        onClick={downloadShipmentLabel}
                        variant="outline"
                        className="gap-2 flex-1 sm:flex-initial"
                      >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">{t("downloadLabel")}</span>
                        <span className="sm:hidden">{t("label")}</span>
                      </Button>
                      <Badge className={`${getStatusColor(shipment.status)} text-white text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2 whitespace-nowrap`}>
                        {shipment.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Map Card */}
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

              {/* Timeline */}
              <ShipmentTimeline history={shipment.history || []} />

              {/* Shipment Details */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Sender Information */}
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
                        <p className="text-sm">{shipment.senderCity}, {shipment.senderState} {shipment.senderZip}</p>
                        <p className="text-sm">{shipment.senderCountry}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recipient Information */}
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
                        <p className="text-sm">{shipment.recipientCity}, {shipment.recipientState} {shipment.recipientZip}</p>
                        <p className="text-sm">{shipment.recipientCountry}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Package Details */}
              <Card>
                <CardHeader className="bg-muted/50">
                  <CardTitle className="flex items-center gap-2">
                    <Box className="h-5 w-5" />
                    Package Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Package Type</p>
                      <p className="font-medium capitalize">{shipment.packageType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Weight</p>
                      <p className="font-medium">{shipment.weight}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Dimensions (L×W×H)</p>
                      <p className="font-medium">
                        {shipment.dimensions.length} × {shipment.dimensions.width} × {shipment.dimensions.height}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Value</p>
                      <p className="font-medium">${shipment.value}</p>
                    </div>
                  </div>
                  {shipment.description && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-1">Description</p>
                      <p className="text-sm">{shipment.description}</p>
                    </div>
                  )}
                  {shipment.specialInstructions && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-1">Special Instructions</p>
                      <p className="text-sm">{shipment.specialInstructions}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Shipping Details */}
              <Card>
                <CardHeader className="bg-muted/50">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Shipping Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Service Type</p>
                      <p className="font-medium capitalize">{shipment.serviceType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Priority</p>
                      <p className="font-medium capitalize">{shipment.priority}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Shipping Cost</p>
                      <p className="font-medium">${shipment.shippingCost}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Shipping Date</p>
                      <p className="font-medium">{shipment.shippingDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Est. Delivery</p>
                      <p className="font-medium">{shipment.estimatedDeliveryDate}</p>
                    </div>
                    <div className="flex gap-4">
                      {shipment.insurance && (
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">Insured</span>
                        </div>
                      )}
                      {shipment.signatureRequired && (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">Signature Required</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {!shipment && !isLoading && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Enter a tracking number above to view shipment details
            </p>
          )}
        </div>
      </section>
      <FooterSection />
    </>
  );
}
