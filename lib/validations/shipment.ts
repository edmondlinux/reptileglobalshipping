
import { z } from "zod";

export const shipmentValidationSchema = z.object({
  trackingNumber: z.string().min(1, "Tracking number is required"),
  
  // Sender Information
  senderName: z.string().min(2, "Sender name must be at least 2 characters"),
  senderEmail: z.string().email("Invalid sender email address"),
  senderPhone: z.string().optional(),
  senderAddress: z.string().min(5, "Sender address must be at least 5 characters"),
  senderCity: z.string().optional(),
  senderState: z.string().optional(),
  senderZip: z.string().optional(),
  senderCountry: z.string().min(2, "Sender country must be at least 2 characters"),
  
  // Recipient Information
  recipientName: z.string().min(2, "Recipient name must be at least 2 characters"),
  recipientEmail: z.string().email("Invalid recipient email address"),
  recipientPhone: z.string().optional(),
  recipientAddress: z.string().min(5, "Recipient address must be at least 5 characters"),
  recipientCity: z.string().optional(),
  recipientState: z.string().optional(),
  recipientZip: z.string().optional(),
  recipientCountry: z.string().optional(),
  
  // Package Details
  packageType: z.enum(["box", "envelope", "pallet", "crate"], {
    errorMap: () => ({ message: "Invalid package type" })
  }),
  weight: z.string().optional(),
  dimensions: z.object({
    length: z.string().optional(),
    width: z.string().optional(),
    height: z.string().optional(),
  }),
  value: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Declared value must be a positive number"
  }),
  description: z.string().optional(),
  specialInstructions: z.string().optional(),
  
  // Shipping Options
  serviceType: z.enum(["standard", "express", "overnight", "economy"], {
    errorMap: () => ({ message: "Invalid service type" })
  }),
  priority: z.enum(["low", "normal", "high", "urgent"], {
    errorMap: () => ({ message: "Invalid priority level" })
  }),
  status: z.enum(["pending", "processing", "in-transit", "out-for-delivery", "delivered", "on-hold", "cancelled"], {
    errorMap: () => ({ message: "Invalid status" })
  }).optional(),
  insurance: z.boolean().optional(),
  signatureRequired: z.boolean().optional(),
  shippingDate: z.string().min(1, "Shipping date is required"),
  estimatedDeliveryDate: z.string().min(1, "Estimated delivery date is required"),
  shippingCost: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: "Shipping cost must be a non-negative number"
  }),
  
  // Location
  latitude: z.number().min(-90).max(90, "Latitude must be between -90 and 90"),
  longitude: z.number().min(-180).max(180, "Longitude must be between -180 and 180"),
  recipientLatitude: z.number().min(-90).max(90).optional(),
  recipientLongitude: z.number().min(-180).max(180).optional(),
});

export type ShipmentValidation = z.infer<typeof shipmentValidationSchema>;
