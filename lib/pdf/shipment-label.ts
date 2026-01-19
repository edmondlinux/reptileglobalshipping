
import { jsPDF } from "jspdf";
import QRCode from 'qrcode';

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
  createdAt: string;
}

export const generateShippingLabelPDF = async (shipment: ShipmentData) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const primaryColor = [255, 126, 0]; // Orange
  const darkGray = [51, 51, 51];
  const lightGray = [128, 128, 128];
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 15;

  // Background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  const addLogo = () => {
    try {
      const logoUrl = "/logo.png";
      doc.addImage(logoUrl, "PNG", 12, 12, 15, 15);
    } catch (error) {
      console.error("Could not add logo to PDF", error);
    }
  };

  addLogo();

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(10, 10, pageWidth - 20, 40);

  doc.setFontSize(24);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text("Reptile Global", pageWidth / 2, yPos + 5, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setFont("helvetica", "normal");
  doc.text("Global Shipping Solutions", pageWidth / 2, yPos + 12, {
    align: "center",
  });

  doc.setFontSize(16);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFont("helvetica", "bold");
  doc.text(`TRACKING: ${shipment.trackingNumber}`, pageWidth / 2, yPos + 20, {
    align: "center",
  });

  // QR Code Generation
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const trackUrl = `${baseUrl}/track?tn=${shipment.trackingNumber}`;
  const qrDataUrl = await QRCode.toDataURL(trackUrl, {
    margin: 1,
    width: 100,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });

  const qrSize = 30;
  doc.addImage(qrDataUrl, "PNG", 15, pageHeight - 45, qrSize, qrSize);
  doc.setFontSize(8);
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.text("SCAN TO TRACK", 15 + qrSize / 2, pageHeight - 12, {
    align: "center",
  });

  yPos = 55;
  doc.setFillColor(245, 245, 245);
  doc.rect(15, yPos, pageWidth - 30, 30, "F");

  const barcodeStartX = 30;
  const barcodeWidth = pageWidth - 60;
  const barHeight = 18;
  const barcodeY = yPos + 3;

  doc.setFillColor(0, 0, 0);
  let currentX = barcodeStartX;
  const trackingChars = shipment.trackingNumber.split("");

  doc.rect(currentX, barcodeY, 1, barHeight, "F");
  currentX += 2;
  doc.rect(currentX, barcodeY, 2, barHeight, "F");
  currentX += 3;
  doc.rect(currentX, barcodeY, 1, barHeight, "F");
  currentX += 3;

  trackingChars.forEach((char) => {
    const charCode = char.charCodeAt(0);
    const pattern = charCode % 4;

    if (pattern === 0) {
      doc.rect(currentX, barcodeY, 1, barHeight, "F");
      currentX += 2;
      doc.rect(currentX, barcodeY, 2.5, barHeight, "F");
      currentX += 3.5;
    } else if (pattern === 1) {
      doc.rect(currentX, barcodeY, 2.5, barHeight, "F");
      currentX += 3.5;
      doc.rect(currentX, barcodeY, 1, barHeight, "F");
      currentX += 2;
    } else if (pattern === 2) {
      doc.rect(currentX, barcodeY, 1, barHeight, "F");
      currentX += 2;
      doc.rect(currentX, barcodeY, 1, barHeight, "F");
      currentX += 2;
      doc.rect(currentX, barcodeY, 2.5, barHeight, "F");
      currentX += 3.5;
    } else {
      doc.rect(currentX, barcodeY, 2.5, barHeight, "F");
      currentX += 3.5;
      doc.rect(currentX, barcodeY, 1, barHeight, "F");
      currentX += 2;
      doc.rect(currentX, barcodeY, 1, barHeight, "F");
      currentX += 2;
    }

    if (currentX > barcodeStartX + barcodeWidth - 20) return;
  });

  currentX = barcodeStartX + barcodeWidth - 10;
  doc.rect(currentX, barcodeY, 1, barHeight, "F");
  currentX += 2;
  doc.rect(currentX, barcodeY, 2, barHeight, "F");
  currentX += 3;
  doc.rect(currentX, barcodeY, 1, barHeight, "F");

  doc.setFontSize(10);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFont("courier", "bold");
  doc.text(shipment.trackingNumber, pageWidth / 2, yPos + 26, {
    align: "center",
  });

  yPos = 85;
  const colWidth = (pageWidth - 25) / 2;

  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(10, yPos, colWidth, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("FROM", 15, yPos + 5.5);

  yPos += 12;
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(shipment.senderName, 15, yPos);
  yPos += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(shipment.senderEmail, 15, yPos);
  yPos += 5;
  doc.text(shipment.senderPhone, 15, yPos);
  yPos += 5;
  doc.text(shipment.senderAddress, 15, yPos);
  yPos += 5;
  doc.text(
    `${shipment.senderCity}, ${shipment.senderState} ${shipment.senderZip}`,
    15,
    yPos,
  );
  yPos += 5;
  doc.text(shipment.senderCountry, 15, yPos);

  yPos = 85;
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(10 + colWidth + 5, yPos, colWidth, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("TO", 15 + colWidth + 5, yPos + 5.5);

  yPos += 12;
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(shipment.recipientName, 15 + colWidth + 5, yPos);
  yPos += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(shipment.recipientEmail, 15 + colWidth + 5, yPos);
  yPos += 5;
  doc.text(shipment.recipientPhone, 15 + colWidth + 5, yPos);
  yPos += 5;
  doc.text(shipment.recipientAddress, 15 + colWidth + 5, yPos);
  yPos += 5;
  doc.text(
    `${shipment.recipientCity}, ${shipment.recipientState} ${shipment.recipientZip}`,
    15 + colWidth + 5,
    yPos,
  );
  yPos += 5;
  doc.text(shipment.recipientCountry, 15 + colWidth + 5, yPos);

  yPos = 140;
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(10, yPos, pageWidth - 20, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("PACKAGE DETAILS", 15, yPos + 5.5);

  yPos += 12;
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");

  const detailsLeft = 15;
  const detailsRight = pageWidth / 2 + 5;

  doc.text("Type:", detailsLeft, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(shipment.packageType.toUpperCase(), detailsLeft + 25, yPos);

  doc.setFont("helvetica", "bold");
  doc.text("Service:", detailsRight, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(shipment.serviceType.toUpperCase(), detailsRight + 25, yPos);

  yPos += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Weight:", detailsLeft, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(shipment.weight, detailsLeft + 25, yPos);

  doc.setFont("helvetica", "bold");
  doc.text("Priority:", detailsRight, yPos);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text(shipment.priority.toUpperCase(), detailsRight + 25, yPos);

  yPos += 6;
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFont("helvetica", "bold");
  doc.text("Dimensions:", detailsLeft, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(
    `${shipment.dimensions.length} × ${shipment.dimensions.width} × ${shipment.dimensions.height}`,
    detailsLeft + 25,
    yPos,
  );

  doc.setFont("helvetica", "bold");
  doc.text("Ship Date:", detailsRight, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(shipment.shippingDate, detailsRight + 25, yPos);

  yPos += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Value:", detailsLeft, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`$${shipment.value}`, detailsLeft + 25, yPos);

  doc.setFont("helvetica", "bold");
  doc.text("Est. Delivery:", detailsRight, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(shipment.estimatedDeliveryDate, detailsRight + 25, yPos);

  if (shipment.description) {
    yPos += 8;
    doc.setFont("helvetica", "bold");
    doc.text("Description:", detailsLeft, yPos);
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(
      shipment.description,
      pageHeight - 50,
    );
    doc.text(descLines, detailsLeft + 25, yPos);
    yPos += descLines.length * 5;
  }

  if (shipment.specialInstructions) {
    yPos += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Special Instructions:", detailsLeft, yPos);
    doc.setFont("helvetica", "normal");
    const instrLines = doc.splitTextToSize(
      shipment.specialInstructions,
      pageWidth - 50,
    );
    doc.text(instrLines, detailsLeft + 25, yPos);
    yPos += instrLines.length * 5;
  }

  yPos += 8;
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(10, yPos, pageWidth - 20, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("ADDITIONAL SERVICES", 15, yPos + 5.5);

  yPos += 12;
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const services = [];
  if (shipment.insurance) services.push("✓ Insurance Coverage");
  if (shipment.signatureRequired) services.push("✓ Signature Required");
  if (services.length > 0) {
    doc.text(services.join("  |  "), 15, yPos);
  } else {
    doc.text("No additional services", 15, yPos);
  }

  yPos = doc.internal.pageSize.getHeight() - 25;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(10, yPos, pageWidth - 10, yPos);

  yPos += 5;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text("Reptile Global", pageWidth / 2, yPos, { align: "center" });

  yPos += 5;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.text(
    "For support, contact us at support@reptileglobal.site",
    pageWidth / 2,
    yPos,
    { align: "center" },
  );

  yPos += 4;
  doc.text(
    "This is an official shipping label. Please keep for your records.",
    pageWidth / 2,
    yPos,
    { align: "center" },
  );

  doc.save(`shipping-label-${shipment.trackingNumber}.pdf`);
};
