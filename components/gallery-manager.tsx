"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { deleteImage } from "@/lib/supabase/storage";
import { Edit, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface GalleryItem {
  id: string;
  title: string;
  category: string | null;
  location: string | null;
  image_url: string;
  description: string | null;
  date_taken: string | null;
  is_featured: boolean;
  created_at: string;
}

interface GalleryManagerProps {
  initialItems: GalleryItem[];
}

export function GalleryManager({ initialItems }: GalleryManagerProps) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    setLoading(id);
    const supabase = createClient();

    // Delete from database
    const { error } = await supabase.from("gallery").delete().eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      let errorMessage = "Error deleting image: " + error.message;

      if (error.message.includes("row-level security")) {
        errorMessage = "Permission denied. Please check:\n" +
          "1. You are logged in as an admin\n" +
          "2. Your user has 'admin' role in profiles table\n" +
          "3. RLS policies are configured correctly";
      }

      alert(errorMessage);
      setLoading(null);
      return;
    }

    // Delete from storage if it's from our storage
    if (imageUrl && imageUrl.includes("supabase.co/storage")) {
      try {
        await deleteImage(imageUrl, "gallery");
      } catch (deleteError) {
        // Log but don't block - image might already be deleted
        console.error("Error deleting image from storage:", deleteError);
      }
    }

    setItems(items.filter((item) => item.id !== id));
    setLoading(null);
    router.refresh();
  };

  const handleToggleFeatured = async (id: string, currentValue: boolean) => {
    setLoading(id);
    const supabase = createClient();
    const { error } = await supabase
      .from("gallery")
      .update({ is_featured: !currentValue })
      .eq("id", id);

    if (error) {
      console.error("Update error:", error);
      let errorMessage = "Error updating image: " + error.message;

      if (error.message.includes("row-level security")) {
        errorMessage = "Permission denied. Please check:\n" +
          "1. You are logged in as an admin\n" +
          "2. Your user has 'admin' role in profiles table\n" +
          "3. RLS policies are configured correctly";
      }

      alert(errorMessage);
      setLoading(null);
      return;
    }

    setItems(
      items.map((item) =>
        item.id === id ? { ...item, is_featured: !currentValue } : item
      )
    );
    setLoading(null);
    router.refresh();
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold mb-2">No gallery items yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Start by adding your first gallery image
          </p>
          <Button asChild>
            <Link href="/admin/gallery/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <div className="relative aspect-video w-full bg-muted">
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            {item.is_featured && (
              <Badge className="absolute top-2 right-2">Featured</Badge>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-1">{item.title}</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {item.category && (
                <Badge variant="secondary">{item.category}</Badge>
              )}
              {item.location && (
                <Badge variant="outline">{item.location}</Badge>
              )}
            </div>
            {item.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {item.description}
              </p>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="flex-1"
              >
                <Link href={`/admin/gallery/${item.id}/edit`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleFeatured(item.id, item.is_featured)}
                disabled={loading === item.id}
              >
                {item.is_featured ? "Unfeature" : "Feature"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(item.id, item.image_url)}
                disabled={loading === item.id}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

