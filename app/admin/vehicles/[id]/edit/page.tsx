import { notFound } from "next/navigation";

import { VehicleForm } from "@/components/vehicle-form";
import { createClient } from "@/lib/supabase/server";

interface EditVehiclePageProps {
  params: {
    id: string;
  };
}

export default async function EditVehiclePage({ params }: EditVehiclePageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: vehicle, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !vehicle) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
      <VehicleForm
        initialData={{
          id: vehicle.id,
          name: vehicle.name,
          type: vehicle.type,
          capacity:
            vehicle.capacity !== null && vehicle.capacity !== undefined
              ? Number(vehicle.capacity)
              : null,
          fuel_type: vehicle.fuel_type ?? "",
          price_per_day:
            vehicle.price_per_day !== null && vehicle.price_per_day !== undefined
              ? Number(vehicle.price_per_day)
              : null,
          features: vehicle.features ?? [],
          suitable_for: vehicle.suitable_for ?? "",
          image_url: vehicle.image_url ?? "",
          is_available: vehicle.is_available ?? true,
        }}
      />
    </div>
  );
}


