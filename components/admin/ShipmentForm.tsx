"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleMap } from "./GoogleMap";
import { Package, User, Users, Box, Truck, MapPin } from "lucide-react";

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
  isEditMode?: boolean;
}

interface AddressSuggestion {
  place_name: string;
  center: [number, number];
  context?: Array<{ id: string; text: string }>;
}

export function ShipmentForm({ formData, setFormData, isEditMode }: ShipmentFormProps) {
  const [recipientSuggestions, setRecipientSuggestions] = useState<AddressSuggestion[]>([]);
  const [showRecipientSuggestions, setShowRecipientSuggestions] = useState(false);
  const [recipientLat, setRecipientLat] = useState<number | undefined>();
  const [recipientLng, setRecipientLng] = useState<number | undefined>();
  const [senderSuggestions, setSenderSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSenderSuggestions, setShowSenderSuggestions] = useState(false);
  const [senderLat, setSenderLat] = useState<number | undefined>();
  const [senderLng, setSenderLng] = useState<number | undefined>();

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

  // Parse address from clipboard paste
  const parseAddress = (addressText: string) => {
    const parts = addressText.split(',').map(p => p.trim());

    if (parts.length >= 3) {
      const street = parts[0];
      const city = parts[1];
      const stateZipCountry = parts.slice(2).join(', ');

      // Extract ZIP code (5 digits)
      const zipMatch = stateZipCountry.match(/\b\d{5}\b/);
      const zip = zipMatch ? zipMatch[0] : '';

      // Extract state (2 letter code)
      const stateMatch = stateZipCountry.match(/\b[A-Z]{2}\b/);
      const state = stateMatch ? stateMatch[0] : '';

      // Extract country (remaining text after state and zip)
      let country = stateZipCountry
        .replace(zip, '')
        .replace(state, '')
        .replace(/,/g, '')
        .trim();

      if (!country) country = 'United States';

      return { street, city, state, zip, country };
    }

    return null;
  };

  // Handle address paste with auto-parsing
  const handleRecipientAddressPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    const parsed = parseAddress(pastedText);

    if (parsed) {
      e.preventDefault();
      setFormData({
        ...formData,
        recipientAddress: parsed.street,
        recipientCity: parsed.city,
        recipientState: parsed.state,
        recipientZip: parsed.zip,
        recipientCountry: parsed.country
      });

      // Geocode the full address
      geocodeAddress(pastedText, 'recipient');
    }
  };

  // Handle sender address paste with auto-parsing
  const handleSenderAddressPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    const parsed = parseAddress(pastedText);

    if (parsed) {
      e.preventDefault();
      setFormData({
        ...formData,
        senderAddress: parsed.street,
        senderCity: parsed.city,
        senderState: parsed.state,
        senderZip: parsed.zip,
        senderCountry: parsed.country
      });
    }
  };

  // Autocomplete for recipient address
  const handleRecipientAddressChange = async (value: string) => {
    handleInputChange("recipientAddress", value);

    if (value.length > 2) {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&autocomplete=true&limit=5`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.features) {
          setRecipientSuggestions(data.features);
          setShowRecipientSuggestions(true);
        }
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
      }
    } else {
      setShowRecipientSuggestions(false);
    }
  };

  // Autocomplete for sender address
  const handleSenderAddressChange = async (value: string) => {
    handleInputChange("senderAddress", value);

    if (value.length > 2) {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&autocomplete=true&limit=5`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.features) {
          setSenderSuggestions(data.features);
          setShowSenderSuggestions(true);
        }
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
      }
    } else {
      setShowSenderSuggestions(false);
    }
  };

  // Select address from suggestions
  const selectRecipientSuggestion = (suggestion: AddressSuggestion) => {
    const [lng, lat] = suggestion.center;

    // Extract address components from the suggestion
    let street = suggestion.place_name.split(',')[0];
    let city = '';
    let state = '';
    let zip = '';
    let country = '';

    if (suggestion.context) {
      suggestion.context.forEach(ctx => {
        if (ctx.id.startsWith('place')) city = ctx.text;
        if (ctx.id.startsWith('region')) state = ctx.text;
        if (ctx.id.startsWith('postcode')) zip = ctx.text;
        if (ctx.id.startsWith('country')) country = ctx.text;
      });
    }

    setFormData({
      ...formData,
      recipientAddress: street,
      recipientCity: city,
      recipientState: state,
      recipientZip: zip,
      recipientCountry: country
    });

    setRecipientLat(lat);
    setRecipientLng(lng);
    setShowRecipientSuggestions(false);
  };

  // Select sender address from suggestions
  const selectSenderSuggestion = (suggestion: AddressSuggestion) => {
    const [lng, lat] = suggestion.center;

    // Extract address components from the suggestion
    let street = suggestion.place_name.split(',')[0];
    let city = '';
    let state = '';
    let zip = '';
    let country = '';

    if (suggestion.context) {
      suggestion.context.forEach(ctx => {
        if (ctx.id.startsWith('place')) city = ctx.text;
        if (ctx.id.startsWith('region')) state = ctx.text;
        if (ctx.id.startsWith('postcode')) zip = ctx.text;
        if (ctx.id.startsWith('country')) country = ctx.text;
      });
    }

    setFormData({
      ...formData,
      senderAddress: street,
      senderCity: city,
      senderState: state,
      senderZip: zip,
      senderCountry: country
    });

    setSenderLat(lat);
    setSenderLng(lng);
    setShowSenderSuggestions(false);
  };

  // Geocode address to coordinates
  const geocodeAddress = async (addressString: string, type: 'sender' | 'recipient') => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(addressString)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;

        if (type === 'recipient') {
          setRecipientLat(lat);
          setRecipientLng(lng);
        } else {
          setSenderLat(lat);
          setSenderLng(lng);
        }

        return { lat, lng };
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
    }
    return null;
  };

  // Auto-geocode recipient address when all fields are filled
  useEffect(() => {
    const { recipientAddress, recipientCity, recipientState, recipientCountry } = formData;

    if (recipientAddress && recipientCity && recipientState && recipientCountry) {
      const fullAddress = `${recipientAddress}, ${recipientCity}, ${recipientState}, ${recipientCountry}`;
      geocodeAddress(fullAddress, 'recipient');
    }
  }, [formData.recipientAddress, formData.recipientCity, formData.recipientState, formData.recipientCountry]);

  // Auto-geocode sender address when all fields are filled
  useEffect(() => {
    const { senderAddress, senderCity, senderState, senderCountry } = formData;

    if (senderAddress && senderCity && senderState && senderCountry) {
      const fullAddress = `${senderAddress}, ${senderCity}, ${senderState}, ${senderCountry}`;
      geocodeAddress(fullAddress, 'sender').then(coords => {
        if (coords) {
          setSenderLat(coords.lat);
          setSenderLng(coords.lng);
        }
      });
    }
  }, [formData.senderAddress, formData.senderCity, formData.senderState, formData.senderCountry]);

  return (
    <div className="space-y-6">
      {/* Sender Information Card */}
      <Card>
        <CardHeader className="bg-muted/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Sender Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="senderName">Full Name *</Label>
              <Input
                id="senderName"
                value={formData.senderName}
                onChange={(e) => handleInputChange("senderName", e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderEmail">Email *</Label>
              <Input
                id="senderEmail"
                type="email"
                value={formData.senderEmail}
                onChange={(e) => handleInputChange("senderEmail", e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderPhone">Phone *</Label>
              <Input
                id="senderPhone"
                value={formData.senderPhone}
                onChange={(e) => handleInputChange("senderPhone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="senderAddress">Address *</Label>
              <Input
                id="senderAddress"
                value={formData.senderAddress}
                onChange={(e) => handleSenderAddressChange(e.target.value)}
                onPaste={handleSenderAddressPaste}
                placeholder="123 Main St (paste full address to auto-fill)"
              />
              {showSenderSuggestions && senderSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                  {senderSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-muted cursor-pointer text-sm"
                      onClick={() => selectSenderSuggestion(suggestion)}
                    >
                      {suggestion.place_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderCity">City *</Label>
              <Input
                id="senderCity"
                value={formData.senderCity}
                onChange={(e) => handleInputChange("senderCity", e.target.value)}
                placeholder="New York"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderState">State/Province *</Label>
              <Input
                id="senderState"
                value={formData.senderState}
                onChange={(e) => handleInputChange("senderState", e.target.value)}
                placeholder="NY"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderZip">ZIP/Postal Code *</Label>
              <Input
                id="senderZip"
                value={formData.senderZip}
                onChange={(e) => handleInputChange("senderZip", e.target.value)}
                placeholder="10001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderCountry">Country *</Label>
              <Input
                id="senderCountry"
                value={formData.senderCountry}
                onChange={(e) => handleInputChange("senderCountry", e.target.value)}
                placeholder="United States"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipient Information Card */}
      <Card>
        <CardHeader className="bg-muted/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            Recipient Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Full Name *</Label>
              <Input
                id="recipientName"
                value={formData.recipientName}
                onChange={(e) => handleInputChange("recipientName", e.target.value)}
                placeholder="Jane Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientEmail">Email *</Label>
              <Input
                id="recipientEmail"
                type="email"
                value={formData.recipientEmail}
                onChange={(e) => handleInputChange("recipientEmail", e.target.value)}
                placeholder="jane@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientPhone">Phone *</Label>
              <Input
                id="recipientPhone"
                value={formData.recipientPhone}
                onChange={(e) => handleInputChange("recipientPhone", e.target.value)}
                placeholder="+1 (555) 987-6543"
              />
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="recipientAddress">Address *</Label>
              <Input
                id="recipientAddress"
                value={formData.recipientAddress}
                onChange={(e) => handleRecipientAddressChange(e.target.value)}
                onPaste={handleRecipientAddressPaste}
                placeholder="456 Oak Ave (paste full address to auto-fill)"
              />
              {showRecipientSuggestions && recipientSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                  {recipientSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-muted cursor-pointer text-sm"
                      onClick={() => selectRecipientSuggestion(suggestion)}
                    >
                      {suggestion.place_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientCity">City *</Label>
              <Input
                id="recipientCity"
                value={formData.recipientCity}
                onChange={(e) => handleInputChange("recipientCity", e.target.value)}
                placeholder="Los Angeles"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientState">State/Province *</Label>
              <Input
                id="recipientState"
                value={formData.recipientState}
                onChange={(e) => handleInputChange("recipientState", e.target.value)}
                placeholder="CA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientZip">ZIP/Postal Code *</Label>
              <Input
                id="recipientZip"
                value={formData.recipientZip}
                onChange={(e) => handleInputChange("recipientZip", e.target.value)}
                placeholder="90001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientCountry">Country *</Label>
              <Input
                id="recipientCountry"
                value={formData.recipientCountry}
                onChange={(e) => handleInputChange("recipientCountry", e.target.value)}
                placeholder="United States"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Package Details Card */}
      <Card>
        <CardHeader className="bg-muted/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Box className="h-5 w-5" />
            Package Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="packageType">Package Type *</Label>
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
              <Label htmlFor="weight">Weight (kg) *</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                placeholder="5.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">Length (cm) *</Label>
              <Input
                id="length"
                type="number"
                value={formData.dimensions.length}
                onChange={(e) => handleDimensionChange("length", e.target.value)}
                placeholder="30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="width">Width (cm) *</Label>
              <Input
                id="width"
                type="number"
                value={formData.dimensions.width}
                onChange={(e) => handleDimensionChange("width", e.target.value)}
                placeholder="20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm) *</Label>
              <Input
                id="height"
                type="number"
                value={formData.dimensions.height}
                onChange={(e) => handleDimensionChange("height", e.target.value)}
                placeholder="15"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Declared Value ($) *</Label>
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
        </CardContent>
      </Card>

      {/* Shipping Options Card */}
      <Card>
        <CardHeader className="bg-muted/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Truck className="h-5 w-5" />
            Shipping Options
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type *</Label>
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
              <Label htmlFor="priority">Priority *</Label>
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
              <Label htmlFor="shippingDate">Shipping Date *</Label>
              <Input
                id="shippingDate"
                type="date"
                value={formData.shippingDate}
                onChange={(e) => handleInputChange("shippingDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedDeliveryDate">Estimated Delivery Date *</Label>
              <Input
                id="estimatedDeliveryDate"
                type="date"
                value={formData.estimatedDeliveryDate}
                onChange={(e) => handleInputChange("estimatedDeliveryDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shippingCost">Shipping Cost ($) *</Label>
              <Input
                id="shippingCost"
                type="number"
                value={formData.shippingCost}
                onChange={(e) => handleInputChange("shippingCost", e.target.value)}
                placeholder="25.00"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Map Card */}
      <Card>
        <CardHeader className="bg-muted/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            Shipment Location & Route
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <GoogleMap
            latitude={formData.latitude}
            longitude={formData.longitude}
            onLocationChange={handleLocationChange}
            showRoute={recipientLat !== undefined && recipientLng !== undefined}
            recipientLat={recipientLat}
            recipientLng={recipientLng}
            senderLat={senderLat}
            senderLng={senderLng}
            isEditMode={isEditMode}
          />
          <p className="text-sm text-muted-foreground mt-4">
            Click on the map or drag the blue marker to set the current shipment location.
            {recipientLat && recipientLng
              ? " The route to the destination is displayed above."
              : " Enter the recipient address to see the route."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}