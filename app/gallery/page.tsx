import { GalleryList } from "@/components/gallery-list";
import { createClient } from "@/lib/supabase/server";

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: galleryItems } = await supabase
    .from("gallery")
    .select("id, title, category, location, image_url, description, date_taken, is_featured, created_at, gallery_images(id, image_url)")
    .order("created_at", { ascending: false });

  return <GalleryList items={galleryItems ?? []} />;
}


