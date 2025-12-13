import { notFound } from "next/navigation";

import { GalleryForm } from "@/components/gallery-form";
import { createClient } from "@/lib/supabase/server";

interface EditGalleryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditGalleryPage({ params }: EditGalleryPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch gallery item
  const { data: galleryItem, error: itemError } = await supabase
    .from("gallery")
    .select("*")
    .eq("id", id)
    .single();

  if (itemError || !galleryItem) {
    notFound();
  }

  // Fetch additional images
  const { data: additionalImages } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("gallery_id", id);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
      <GalleryForm
        initialData={{
          id: galleryItem.id,
          title: galleryItem.title,
          category: galleryItem.category ?? "",
          location: galleryItem.location ?? "",
          image_url: galleryItem.image_url ?? "",
          description: galleryItem.description ?? "",
          date_taken: galleryItem.date_taken ?? "",
          is_featured: galleryItem.is_featured ?? false,
        }}
        initialImages={additionalImages ?? []}
      />
    </div>
  );
}
