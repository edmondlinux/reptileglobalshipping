"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CreateShipment } from "@/components/admin/CreateShipment";
import { EditShipment } from "@/components/admin/EditShipment";
import { AllShipments } from "@/components/admin/AllShipments";
import { Analytics } from "@/components/admin/Analytics";
import { DraftShipments } from "@/components/admin/DraftShipments";
import { Package, Edit, List, BarChart3, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


function generateTrackingNumber(): string {
  const prefix = "RW";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

type TabType = "create" | "edit" | "all" | "analytics" | "drafts";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("create");
  const [editTrackingNumber, setEditTrackingNumber] = useState<string | undefined>(undefined);

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

  const handleEditShipment = (trackingNum: string) => {
    setEditTrackingNumber(trackingNum);
    setActiveTab("edit");
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

  const navItems = [
    { id: "create" as TabType, label: "Create Shipment", icon: Package },
    { id: "drafts" as TabType, label: "Drafts", icon: FileText },
    { id: "edit" as TabType, label: "Edit Shipment", icon: Edit },
    { id: "all" as TabType, label: "All Shipments", icon: List },
    { id: "analytics" as TabType, label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Shipment Management Dashboard</p>
        </div>

        {/* 2x2 Grid Navigation */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="grid grid-cols-2 gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex items-center gap-3 px-6 py-4 rounded-lg border-2 transition-all",
                    activeTab === item.id
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-card hover:bg-muted border-border hover:border-primary/50"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-base font-semibold">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {activeTab === "create" && (
            <CreateShipment
              trackingNumber={trackingNumber}
              onRegenerateTracking={regenerateTracking}
            />
          )}
          {activeTab === "edit" && <EditShipment initialTrackingNumber={editTrackingNumber} />}
          {activeTab === "all" && <AllShipments onEditShipment={handleEditShipment} />}
          {activeTab === "analytics" && <Analytics />}
          {activeTab === "drafts" && <DraftShipments />}
        </div>
      </div>
    </div>
  );
}