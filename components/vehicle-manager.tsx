"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { deleteImage } from "@/lib/supabase/storage";
import { CheckCircle, Edit, Users, XCircle, Trash2 } from "lucide-react";

interface VehicleManagerProps {
  initialVehicles: VehicleItem[];
}

interface VehicleItem {
  id: string;
  name: string;
  type: string;
  capacity: number | null;
  fuel_type: string | null;
  price_per_day: number | string | null;
  features: string[] | null;
  suitable_for: string | null;
  image_url: string | null;
  is_available: boolean;
}

export function VehicleManager({ initialVehicles }: VehicleManagerProps) {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<VehicleItem[]>(initialVehicles);
  const [loading, setLoading] = useState<string | null>(null);

  const supabase = createClient();

  const handleDelete = async (id: string, imageUrl: string | null) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) {
      return;
    }

    setLoading(id);
    const { error } = await supabase.from("vehicles").delete().eq("id", id);

    if (error) {
      let message = error.message;
      if (message.includes("row-level security")) {
        message =
          "Permission denied. Please ensure you are logged in as an admin with correct RLS policies.";
      }
      alert("Error deleting vehicle: " + message);
      setLoading(null);
      return;
    }

    if (imageUrl && imageUrl.includes("supabase.co/storage")) {
      try {
        await deleteImage(imageUrl, "vehicles");
      } catch (storageError) {
        console.error("Failed to delete vehicle image", storageError);
      }
    }

    setVehicles((previous) => previous.filter((vehicle) => vehicle.id !== id));
    setLoading(null);
    router.refresh();
  };

  const handleToggleAvailability = async (id: string, current: boolean) => {
    setLoading(id);
    const { error } = await supabase
      .from("vehicles")
      .update({ is_available: !current })
      .eq("id", id);

    if (error) {
      let message = error.message;
      if (message.includes("row-level security")) {
        message =
          "Permission denied. Please ensure you are logged in as an admin with correct RLS policies.";
      }
      alert("Error updating vehicle: " + message);
      setLoading(null);
      return;
    }

    setVehicles((previous) =>
      previous.map((vehicle) =>
        vehicle.id === id
          ? {
              ...vehicle,
              is_available: !current,
            }
          : vehicle,
      ),
    );

    setLoading(null);
    router.refresh();
  };

  if (vehicles.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-semibold mb-2">No vehicles yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Start by adding your first vehicle option
          </p>
          <Button asChild>
            <Link href="/admin/vehicles/add">Add Vehicle</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => {
        const price =
          vehicle.price_per_day !== null && vehicle.price_per_day !== undefined
            ? Number(vehicle.price_per_day)
            : null;

        return (
          <Card key={vehicle.id} className="flex flex-col overflow-hidden">
            <div className="relative h-40 w-full bg-muted">
              {vehicle.image_url ? (
                <Image
                  src={vehicle.image_url}
                  alt={vehicle.name}
                  fill
                  className="object-cover"
                />
              ) : null}
              <div className="absolute top-2 left-2">
                <Badge variant={vehicle.is_available ? "default" : "secondary"}>
                  {vehicle.is_available ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </div>
            <CardContent className="flex flex-1 flex-col p-4 space-y-3">
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                  {price !== null ? (
                    <span className="text-base font-semibold">
                      ${price.toFixed(2)}/day
                    </span>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">{vehicle.type}</p>
                {vehicle.capacity ? (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    Seats {vehicle.capacity}
                  </div>
                ) : null}
                {vehicle.fuel_type ? (
                  <p className="text-sm text-muted-foreground">Fuel: {vehicle.fuel_type}</p>
                ) : null}
              </div>

              {vehicle.features && vehicle.features.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((feature) => (
                    <Badge key={feature} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              ) : null}

              {vehicle.suitable_for ? (
                <p className="text-sm text-muted-foreground">
                  Suitable for: {vehicle.suitable_for}
                </p>
              ) : null}

              <div className="mt-auto flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/admin/vehicles/${vehicle.id}/edit`}>
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleAvailability(vehicle.id, vehicle.is_available)}
                  disabled={loading === vehicle.id}
                >
                  {vehicle.is_available ? (
                    <span className="flex items-center gap-1">
                      <XCircle className="h-4 w-4" />
                      Disable
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Enable
                    </span>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(vehicle.id, vehicle.image_url)}
                  disabled={loading === vehicle.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}


