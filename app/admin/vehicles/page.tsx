import Link from "next/link";
import { Plus } from "lucide-react";

import { VehicleManager } from "@/components/vehicle-manager";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function VehiclesManagementPage() {
  const supabase = await createClient();

  // Fetch vehicles
  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">Manage Vehicles</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Add, edit, and manage vehicle rentals
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/vehicles/add">
              <Plus className="h-4 w-4 mr-2" />
              Add New Vehicle
            </Link>
          </Button>
        </div>

        {/* Vehicles List */}
        {vehicles && vehicles.length > 0 ? (
          <VehicleManager initialVehicles={vehicles} />
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg font-semibold mb-2">No vehicles yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Start by adding your first vehicle
              </p>
              <Button asChild>
                <Link href="/admin/vehicles/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vehicle
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

