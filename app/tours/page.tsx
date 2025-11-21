import { ToursList } from "@/components/tours-list";
import { createClient } from "@/lib/supabase/server";

export default async function ToursPage() {
  const supabase = await createClient();
  const { data: tours } = await supabase
    .from("tours")
    .select("id, title, description, duration, price, location, max_group_size, rating, reviews_count, highlights, image_url, is_active")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return <ToursList tours={tours ?? []} />;
}


