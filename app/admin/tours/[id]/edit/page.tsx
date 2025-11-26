import { notFound } from "next/navigation";

import { TourForm } from "@/components/tour-form";
import { createClient } from "@/lib/supabase/server";

interface EditTourPageProps {
  params: {
    id: string;
  };
}

export default async function EditTourPage({ params }: EditTourPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: tour, error } = await supabase
    .from("tours")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !tour) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
      <TourForm
        initialData={{
          id: tour.id,
          title: tour.title,
          description: tour.description ?? "",
          duration: tour.duration ?? "",
          price:
            tour.price !== null && tour.price !== undefined
              ? Number(tour.price)
              : null,
          location: tour.location ?? "",
          max_group_size:
            tour.max_group_size !== null && tour.max_group_size !== undefined
              ? Number(tour.max_group_size)
              : null,
          highlights: tour.highlights ?? [],
          image_url: tour.image_url ?? "",
          is_active: tour.is_active ?? true,
        }}
      />
    </div>
  );
}


