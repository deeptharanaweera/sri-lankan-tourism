import { ReviewsList } from "@/components/reviews-list";
import { createClient } from "@/lib/supabase/server";

export default async function ReviewsPage() {
  const supabase = await createClient();
  const [{ data: reviews }, { data: tours }] = await Promise.all([
    supabase
      .from("reviews")
      .select("id, user_name, rating, comment, tour_name, created_at")
      .eq("is_approved", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("tours")
      .select("id, title")
      .order("title", { ascending: true }),
  ]);

  return (
    <ReviewsList
      reviews={reviews ?? []}
      tours={tours ?? []}
    />
  );
}

