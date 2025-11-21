import { VehicleRentalList } from "@/components/vehicle-rental-list";
import { createClient } from "@/lib/supabase/server";

export default async function VehicleRentalPage() {
  const supabase = await createClient();
  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("id, name, type, capacity, fuel_type, price_per_day, features, suitable_for, image_url, is_available")
    .order("created_at", { ascending: false });

  return <VehicleRentalList vehicles={vehicles ?? []} />;
}

