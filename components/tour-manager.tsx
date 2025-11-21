"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { deleteImage } from "@/lib/supabase/storage";
import { Edit, MapPin, Trash2 } from "lucide-react";

interface TourManagerProps {
  initialTours: TourItem[];
}

interface TourItem {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  price: number | string | null;
  location: string | null;
  max_group_size: number | null;
  highlights: string[] | null;
  image_url: string | null;
  is_active: boolean;
}

export function TourManager({ initialTours }: TourManagerProps) {
  const router = useRouter();
  const [tours, setTours] = useState<TourItem[]>(initialTours);
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (id: string, imageUrl: string | null) => {
    if (!confirm("Are you sure you want to delete this tour?")) {
      return;
    }

    setLoading(id);
    const supabase = createClient();
    const { error } = await supabase.from("tours").delete().eq("id", id);

    if (error) {
      let message = error.message;
      if (message.includes("row-level security")) {
        message =
          "Permission denied. Please ensure you are logged in as an admin with correct RLS policies.";
      }
      alert("Error deleting tour: " + message);
      setLoading(null);
      return;
    }

    if (imageUrl && imageUrl.includes("supabase.co/storage")) {
      try {
        await deleteImage(imageUrl, "tours");
      } catch (storageError) {
        console.error("Failed to delete tour image", storageError);
      }
    }

    setTours((previous) => previous.filter((tour) => tour.id !== id));
    setLoading(null);
    router.refresh();
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    setLoading(id);
    const supabase = createClient();
    const { error } = await supabase
      .from("tours")
      .update({ is_active: !current })
      .eq("id", id);

    if (error) {
      let message = error.message;
      if (message.includes("row-level security")) {
        message =
          "Permission denied. Please ensure you are logged in as an admin with correct RLS policies.";
      }
      alert("Error updating tour: " + message);
      setLoading(null);
      return;
    }

    setTours((previous) =>
      previous.map((tour) =>
        tour.id === id
          ? {
              ...tour,
              is_active: !current,
            }
          : tour,
      ),
    );

    setLoading(null);
    router.refresh();
  };

  if (tours.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-semibold mb-2">No tours yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Start by adding your first tour package
          </p>
          <Button asChild>
            <Link href="/admin/tours/add">Add Tour</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map((tour) => {
        const parsedPrice =
          tour.price !== null && tour.price !== undefined
            ? Number(tour.price)
            : null;

        return (
          <Card key={tour.id} className="flex flex-col overflow-hidden">
            <div className="relative h-40 w-full bg-muted">
              {tour.image_url ? (
                <Image
                  src={tour.image_url}
                  alt={tour.title}
                  fill
                  className="object-cover"
                />
              ) : null}
              <div className="absolute top-2 left-2 flex gap-2">
                <Badge variant={tour.is_active ? "default" : "secondary"}>
                  {tour.is_active ? "Active" : "Hidden"}
                </Badge>
              </div>
            </div>
            <CardContent className="flex flex-1 flex-col p-4 space-y-3">
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold">{tour.title}</h3>
                  {parsedPrice !== null ? (
                    <span className="text-base font-semibold">
                      ${parsedPrice.toFixed(2)}
                    </span>
                  ) : null}
                </div>
                {tour.location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {tour.location}
                  </div>
                )}
                {tour.duration && (
                  <p className="text-sm text-muted-foreground">{tour.duration}</p>
                )}
              </div>

              {tour.highlights && tour.highlights.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tour.highlights.map((highlight) => (
                    <Badge key={highlight} variant="outline">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              ) : null}

              {tour.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {tour.description}
                </p>
              )}

              <div className="mt-auto flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/admin/tours/${tour.id}/edit`}>
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(tour.id, tour.is_active)}
                  disabled={loading === tour.id}
                >
                  {tour.is_active ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(tour.id, tour.image_url)}
                  disabled={loading === tour.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}


