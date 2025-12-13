import { GalleryManager } from "@/components/gallery-manager";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function GalleryManagementPage() {
  const supabase = await createClient();

  // Fetch gallery items
  const { data: galleryItems } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">Manage Gallery</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Add, edit, and manage gallery images
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/gallery/add">
              <Plus className="h-4 w-4 mr-2" />
              Add New Image
            </Link>
          </Button>
        </div>

        {/* Gallery Manager */}
        <GalleryManager initialItems={galleryItems || []} />
      </div>
    </div>
  );
}

