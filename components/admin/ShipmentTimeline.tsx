
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, MapPin, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineEntry {
  status: string;
  location: string;
  description: string;
  timestamp: Date | string;
  icon: string;
}

interface ShipmentTimelineProps {
  history: TimelineEntry[];
}

export function ShipmentTimeline({ history }: ShipmentTimelineProps) {
  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      package: Package,
      truck: Truck,
      mappin: MapPin,
      check: CheckCircle,
      clock: Clock,
      x: XCircle,
      alert: AlertCircle,
    };
    return icons[iconName.toLowerCase()] || Clock;
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
    return colors[status.toLowerCase()] || "bg-gray-500";
  };

  const formatTimestamp = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!history || history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Shipment Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No tracking history available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Shipment Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

          {/* Timeline entries */}
          <div className="space-y-6">
            {history.map((entry, index) => {
              const IconComponent = getIcon(entry.icon);
              const isLast = index === history.length - 1;

              return (
                <div key={index} className="relative flex gap-4 pb-2">
                  {/* Icon container */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-lg shadow-sm",
                        getStatusColor(entry.status)
                      )}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-semibold capitalize">
                          {entry.status.replace(/-/g, " ")}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {entry.location}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTimestamp(entry.timestamp)}
                        </p>
                      </div>
                    </div>
                    {entry.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {entry.description}
                      </p>
                    )}
                    {isLast && (
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                          Latest Update
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
