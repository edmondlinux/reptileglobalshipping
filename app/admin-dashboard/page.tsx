
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateShipment } from "@/components/admin/CreateShipment";
import { EditShipment } from "@/components/admin/EditShipment";
import { AllShipments } from "@/components/admin/AllShipments";
import { Analytics } from "@/components/admin/Analytics";

function generateTrackingNumber(): string {
  const prefix = "RW";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    setTrackingNumber(generateTrackingNumber());
  }, []);

  const regenerateTracking = () => {
    setTrackingNumber(generateTrackingNumber());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage shipments and view analytics</p>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="create">Create Shipment</TabsTrigger>
          <TabsTrigger value="edit">Edit Shipment</TabsTrigger>
          <TabsTrigger value="all">All Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <CreateShipment
            trackingNumber={trackingNumber}
            onRegenerateTracking={regenerateTracking}
          />
        </TabsContent>

        <TabsContent value="edit">
          <EditShipment />
        </TabsContent>

        <TabsContent value="all">
          <AllShipments />
        </TabsContent>

        <TabsContent value="analytics">
          <Analytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
