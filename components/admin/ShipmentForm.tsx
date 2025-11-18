
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GoogleMap } from "./GoogleMap";
import { Package, MapPin } from "lucide-react";

interface ShipmentFormData {
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
}

interface ShipmentFormProps {
  formData: ShipmentFormData;
  setFormData: (data: ShipmentFormData) => void;
}

export function ShipmentForm({ formData, setFormData }: ShipmentFormProps) {
  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDimensionChange = (dimension: string, value: string) => {
    setFormData({
      ...formData,
      dimensions: { ...formData.dimensions, [dimension]: value }
    });
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData({ ...formData, latitude: lat, longitude: lng });
  };

  return (
    <div className="space-y-8">
      {/* Sender Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Package className="h-5 w-5" />
          Sender Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="senderName">Full Name</Label>
            <Input
              id="senderName"
              value={formData.senderName}
              onChange={(e) => handleInputChange("senderName", e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senderEmail">Email</Label>
            <Input
              id="senderEmail"
              type="email"
              value={formData.senderEmail}
              onChange={(e) => handleInputChange("senderEmail", e.target.value)}
              placeholder="john@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senderPhone">Phone</Label>
            <Input
              id="senderPhone"
              value={formData.senderPhone}
              onChange={(e) => handleInputChange("senderPhone", e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senderAddress">Address</Label>
            <Input
              id="senderAddress"
              value={formData.senderAddress}
              onChange={(e) => handleInputChange("senderAddress", e.target.value)}
              placeholder="123 Main St"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senderCity">City</Label>
            <Input
              id="senderCity"
              value={formData.senderCity}
              onChange={(e) => handleInputChange("senderCity", e.target.value)}
              placeholder="New York"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senderState">State/Province</Label>
            <Input
              id="senderState"
              value={formData.senderState}
              onChange={(e) => handleInputChange("senderState", e.target.value)}
              placeholder="NY"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senderZip">ZIP/Postal Code</Label>
            <Input
              id="senderZip"
              value={formData.senderZip}
              onChange={(e) => handleInputChange("senderZip", e.target.value)}
              placeholder="10001"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senderCountry">Country</Label>
            <Input
              id="senderCountry"
              value={formData.senderCountry}
              onChange={(e) => handleInputChange("senderCountry", e.target.value)}
              placeholder="United States"
            />
          </div>
        </div>
      </div>

      {/* Recipient Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recipient Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="recipientName">Full Name</Label>
            <Input
              id="recipientName"
              value={formData.recipientName}
              onChange={(e) => handleInputChange("recipientName", e.target.value)}
              placeholder="Jane Smith"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipientEmail">Email</Label>
            <Input
              id="recipientEmail"
              type="email"
              value={formData.recipientEmail}
              onChange={(e) => handleInputChange("recipientEmail", e.target.value)}
              placeholder="jane@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipientPhone">Phone</Label>
            <Input
              id="recipientPhone"
              value={formData.recipientPhone}
              onChange={(e) => handleInputChange("recipientPhone", e.target.value)}
              placeholder="+1 (555) 987-6543"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipientAddress">Address</Label>
            <Input
              id="recipientAddress"
              value={formData.recipientAddress}
              onChange={(e) => handleInputChange("recipientAddress", e.target.value)}
              placeholder="456 Oak Ave"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipientCity">City</Label>
            <Input
              id="recipientCity"
              value={formData.recipientCity}
              onChange={(e) => handleInputChange("recipientCity", e.target.value)}
              placeholder="Los Angeles"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipientState">State/Province</Label>
            <Input
              id="recipientState"
              value={formData.recipientState}
              onChange={(e) => handleInputChange("recipientState", e.target.value)}
              placeholder="CA"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipientZip">ZIP/Postal Code</Label>
            <Input
              id="recipientZip"
              value={formData.recipientZip}
              onChange={(e) => handleInputChange("recipientZip", e.target.value)}
              placeholder="90001"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipientCountry">Country</Label>
            <Input
              id="recipientCountry"
              value={formData.recipientCountry}
              onChange={(e) => handleInputChange("recipientCountry", e.target.value)}
              placeholder="United States"
            />
          </div>
        </div>
      </div>

      {/* Shipment Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Shipment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="packageType">Package Type</Label>
            <Select value={formData.packageType} onValueChange={(value) => handleInputChange("packageType", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="box">Box</SelectItem>
                <SelectItem value="envelope">Envelope</SelectItem>
                <SelectItem value="pallet">Pallet</SelectItem>
                <SelectItem value="crate">Crate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={formData.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              placeholder="5.5"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="length">Length (cm)</Label>
            <Input
              id="length"
              type="number"
              value={formData.dimensions.length}
              onChange={(e) => handleDimensionChange("length", e.target.value)}
              placeholder="30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="width">Width (cm)</Label>
            <Input
              id="width"
              type="number"
              value={formData.dimensions.width}
              onChange={(e) => handleDimensionChange("width", e.target.value)}
              placeholder="20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              value={formData.dimensions.height}
              onChange={(e) => handleDimensionChange("height", e.target.value)}
              placeholder="15"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Declared Value ($)</Label>
            <Input
              id="value"
              type="number"
              value={formData.value}
              onChange={(e) => handleInputChange("value", e.target.value)}
              placeholder="100"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Electronics, clothing, etc."
              rows={3}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="specialInstructions">Special Instructions</Label>
            <Textarea
              id="specialInstructions"
              value={formData.specialInstructions}
              onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
              placeholder="Handle with care, fragile items"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Shipping Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Shipping Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="serviceType">Service Type</Label>
            <Select value={formData.serviceType} onValueChange={(value) => handleInputChange("serviceType", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="express">Express</SelectItem>
                <SelectItem value="overnight">Overnight</SelectItem>
                <SelectItem value="economy">Economy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="shippingDate">Shipping Date</Label>
            <Input
              id="shippingDate"
              type="date"
              value={formData.shippingDate}
              onChange={(e) => handleInputChange("shippingDate", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estimatedDeliveryDate">Estimated Delivery Date</Label>
            <Input
              id="estimatedDeliveryDate"
              type="date"
              value={formData.estimatedDeliveryDate}
              onChange={(e) => handleInputChange("estimatedDeliveryDate", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shippingCost">Shipping Cost ($)</Label>
            <Input
              id="shippingCost"
              type="number"
              value={formData.shippingCost}
              onChange={(e) => handleInputChange("shippingCost", e.target.value)}
              placeholder="25.00"
            />
          </div>
        </div>
      </div>

      {/* Location Map */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Shipment Location
        </h3>
        <GoogleMap
          latitude={formData.latitude}
          longitude={formData.longitude}
          onLocationChange={handleLocationChange}
        />
      </div>
    </div>
  );
}
