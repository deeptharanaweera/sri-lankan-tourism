import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, Plus, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { GalleryManager } from "@/components/gallery-manager";

export default async function GalleryManagementPage() {
  const supabase = await createClient();

  // Fetch gallery items
  const { data: galleryItems, error } = await supabase
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

