import { Navigation } from "@/components/navigation";
import { TourDetailsView } from "@/components/tour-details-view";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface TourPageProps {
    params: Promise<{ id: string }>;
}

export default async function TourPage({ params }: TourPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: tour } = await supabase
        .from("tours")
        .select("id, title, description, duration, price, location, max_group_size, rating, reviews_count, highlights, image_url, overview, itinerary, includes, excludes, gallery_urls")
        .eq("id", id)
        .single();

    if (!tour) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <TourDetailsView tour={tour} />
        </div>
    );
}
