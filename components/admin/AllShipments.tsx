"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Trash2, Edit, Link2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { KYCModal } from "./KYCModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface Shipment {
  trackingNumber: string;
  senderName: string;
  recipientName: string;
  status: string;
  serviceType: string;
  shippingDate: string;
  estimatedDeliveryDate: string;
  currentLocation?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
}

interface AllShipmentsProps {
  onEditShipment?: (trackingNumber: string) => void;
}

export function AllShipments({ onEditShipment }: AllShipmentsProps) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRouteDialog, setShowRouteDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [generatedKycLink, setGeneratedKycLink] = useState("");

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const response = await fetch("/api/shipments");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch shipments");
      }

      setShipments(data.shipments);
    } catch (err: any) {
      toast.error(err.message || "Failed to load shipments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedShipment) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/shipments/${selectedShipment.trackingNumber}/delete`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete shipment");
      }

      toast.success("Shipment deleted successfully!");

      // Remove shipment from local state
      setShipments(shipments.filter(
        (s) => s.trackingNumber !== selectedShipment.trackingNumber
      ));

      setShowDeleteDialog(false);
      setSelectedShipment(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete shipment");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500",
      "in-transit": "bg-blue-500",
      delivered: "bg-green-500",
      cancelled: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Shipments</CardTitle>
        <CardDescription>
          View and manage all shipments in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {shipments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No shipments found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Tracking #</th>
                    <th className="text-left py-3 px-4">Sender</th>
                    <th className="text-left py-3 px-4">Recipient</th>
                    <th className="text-left py-3 px-4">Service</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Ship Date</th>
                    <th className="text-left py-3 px-4">Est. Delivery</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map((shipment) => (
                    <tr key={shipment.trackingNumber} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono text-sm">{shipment.trackingNumber}</td>
                      <td className="py-3 px-4">{shipment.senderName}</td>
                      <td className="py-3 px-4">{shipment.recipientName}</td>
                      <td className="py-3 px-4 capitalize">{shipment.serviceType}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(shipment.status)}>
                          {shipment.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(shipment.shippingDate).toLocaleString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3 px-4">{new Date(shipment.estimatedDeliveryDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedShipment(shipment);
                              setShowRouteDialog(true);
                            }}
                          >
                            <MapPin className="h-4 w-4 mr-1" />
                            View Route
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              try {
                                const res = await fetch('/api/kyc/generate', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ shipmentId: shipment.trackingNumber }),
                                });
                                const data = await res.json();
                                if (data.magicLink) {
                                  setGeneratedKycLink(data.magicLink);
                                  setKycModalOpen(true);
                                } else {
                                  throw new Error(data.error || "Failed to generate link");
                                }
                              } catch (err: any) {
                                toast.error(err.message || "Failed to generate KYC link");
                              }
                            }}
                          >
                            <Link2 className="h-4 w-4 mr-1" />
                            KYC
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditShipment?.(shipment.trackingNumber)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(shipment)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>

      {/* Route View Dialog */}
      <Dialog open={showRouteDialog} onOpenChange={setShowRouteDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Shipment Route: {selectedShipment?.trackingNumber}</DialogTitle>
          </DialogHeader>
          {selectedShipment ? (
            <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
              <p className="text-muted-foreground">Map integration for route visualization goes here.</p>
              {selectedShipment.currentLocation && selectedShipment.destination && (
                <p className="mt-2 text-sm text-muted-foreground">
                  From: ({selectedShipment.currentLocation.lat}, {selectedShipment.currentLocation.lng}) to ({selectedShipment.destination.lat}, {selectedShipment.destination.lng})
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Shipment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this shipment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedShipment && (
            <div className="py-4">
              <p className="text-sm">
                <strong>Tracking Number:</strong> {selectedShipment.trackingNumber}
              </p>
              <p className="text-sm">
                <strong>Sender:</strong> {selectedShipment.senderName}
              </p>
              <p className="text-sm">
                <strong>Recipient:</strong> {selectedShipment.recipientName}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Shipment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <KYCModal 
        isOpen={kycModalOpen} 
        onClose={() => setKycModalOpen(false)} 
        magicLink={generatedKycLink} 
      />
    </Card>
  );
}