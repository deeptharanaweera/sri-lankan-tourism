"use client";

import { ArrowLeft, Upload, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/ui/tag-input";
import { createClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/supabase/storage";
import { TourItem } from "@/types/tour";

interface TourFormProps {
  initialData?: Partial<TourItem>;
}

interface TourFormState {
  id?: string;
  title: string;
  description: string;
  overview: string;
  itinerary: string;
  includes: string[];
  excludes: string[];
  gallery_urls: string[];
  duration: string;
  price: number | null;
  location: string;
  max_group_size: number | null;
  highlights: string[];
  image_url: string;
  is_active: boolean;
}

const DEFAULT_STATE: TourFormState = {
  title: "",
  description: "",
  overview: "",
  itinerary: "",
  includes: [],
  excludes: [],
  gallery_urls: [],
  duration: "",
  price: null,
  location: "",
  max_group_size: null,
  highlights: [],
  image_url: "",
  is_active: true,
};

export function TourForm({ initialData }: TourFormProps) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image_url ?? null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TourFormState>({
    ...DEFAULT_STATE,
    ...initialData,
    description: initialData?.description ?? DEFAULT_STATE.description,
    overview: initialData?.overview ?? DEFAULT_STATE.overview,
    itinerary: initialData?.itinerary ?? DEFAULT_STATE.itinerary,
    includes: initialData?.includes ?? DEFAULT_STATE.includes,
    excludes: initialData?.excludes ?? DEFAULT_STATE.excludes,
    gallery_urls: initialData?.gallery_urls ?? DEFAULT_STATE.gallery_urls,
    duration: initialData?.duration ?? DEFAULT_STATE.duration,
    location: initialData?.location ?? DEFAULT_STATE.location,
    highlights: initialData?.highlights ?? DEFAULT_STATE.highlights,
    image_url: initialData?.image_url ?? DEFAULT_STATE.image_url,
    price: initialData?.price !== undefined ? Number(initialData.price) : DEFAULT_STATE.price,
    max_group_size: initialData?.max_group_size ?? DEFAULT_STATE.max_group_size,
    is_active: initialData?.is_active ?? DEFAULT_STATE.is_active,
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(initialData?.image_url ?? null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = formData.image_url;

      if (selectedFile) {
        try {
          imageUrl = await uploadImage(selectedFile, "tours");
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          alert("Error uploading image: " + message);
          setIsSubmitting(false);
          return;
        }
      }

      const supabase = createClient();
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        overview: formData.overview.trim() || null,
        itinerary: formData.itinerary.trim() || null,
        includes: formData.includes.length > 0 ? formData.includes : null,
        excludes: formData.excludes.length > 0 ? formData.excludes : null,
        gallery_urls: formData.gallery_urls.length > 0 ? formData.gallery_urls : null,
        duration: formData.duration.trim() || null,
        price: formData.price !== null ? Number(formData.price) : null,
        location: formData.location.trim() || null,
        max_group_size: formData.max_group_size !== null ? Number(formData.max_group_size) : null,
        highlights:
          formData.highlights.length > 0
            ? formData.highlights.map((highlight) => highlight.trim()).filter(Boolean)
            : null,
        image_url: imageUrl || null,
        is_active: formData.is_active,
      };

      let errorMessage: string | null = null;

      if (initialData?.id) {
        const { error } = await supabase
          .from("tours")
          .update(payload)
          .eq("id", initialData.id);

        if (error) {
          errorMessage = error.message;
        }
      } else {
        const { error } = await supabase.from("tours").insert([payload]);

        if (error) {
          errorMessage = error.message;
        }
      }

      if (errorMessage) {
        if (errorMessage.includes("row-level security")) {
          alert(
            "Permission denied. Please ensure you are logged in as an admin and RLS policies are configured correctly."
          );
        } else {
          alert("Error saving tour: " + errorMessage);
        }
        setIsSubmitting(false);
        return;
      }

      router.push("/admin/tours");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      alert("Error: " + message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/tours">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-4xl font-bold">
            {initialData?.id ? "Edit Tour" : "Add Tour"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {initialData?.id
              ? "Update the tour details below"
              : "Create a new tour package"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tour Details</CardTitle>
          <CardDescription>
            {initialData?.id
              ? "Modify the information for this tour"
              : "Fill in the details for the new tour"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      title: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      duration: event.target.value,
                    }))
                  }
                  placeholder="e.g., 5 Days / 4 Nights"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price ?? ""}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      price: event.target.value ? Number(event.target.value) : null,
                    }))
                  }
                  placeholder="e.g., 450"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      location: event.target.value,
                    }))
                  }
                  placeholder="e.g., Sigiriya, Kandy"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max_group_size">Max Group Size</Label>
                <Input
                  id="max_group_size"
                  type="number"
                  min="1"
                  value={formData.max_group_size ?? ""}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      max_group_size: event.target.value ? Number(event.target.value) : null,
                    }))
                  }
                  placeholder="e.g., 12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="highlights">Highlights</Label>
                <TagInput
                  id="highlights"
                  value={formData.highlights}
                  onValueChange={(tags) =>
                    setFormData((previous) => ({
                      ...previous,
                      highlights: tags,
                    }))
                  }
                  placeholder="Type literal and press Enter to add..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <textarea
                id="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.description}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    description: event.target.value,
                  }))
                }
                placeholder="Brief summary for the card view"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="overview">Full Overview</Label>
              <textarea
                id="overview"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.overview}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    overview: event.target.value,
                  }))
                }
                placeholder="Detailed overview of the tour..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="itinerary">Itinerary (JSON format preferred)</Label>
              <textarea
                id="itinerary"
                className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
                value={formData.itinerary}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    itinerary: event.target.value,
                  }))
                }
                placeholder='[{"day": 1, "title": "Arrival", "description": "..."}]'
              />
              <p className="text-xs text-muted-foreground">
                Enter a valid JSON array for structured itinerary.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="includes">Includes</Label>
                <TagInput
                  id="includes"
                  value={formData.includes}
                  onValueChange={(tags) =>
                    setFormData((previous) => ({
                      ...previous,
                      includes: tags,
                    }))
                  }
                  placeholder="Type and press Enter to add..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excludes">Excludes</Label>
                <TagInput
                  id="excludes"
                  value={formData.excludes}
                  onValueChange={(tags) =>
                    setFormData((previous) => ({
                      ...previous,
                      excludes: tags,
                    }))
                  }
                  placeholder="Type and press Enter to add..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gallery_urls">Gallery Image URLs</Label>
              <TagInput
                id="gallery_urls"
                value={formData.gallery_urls}
                onValueChange={(tags) =>
                  setFormData((previous) => ({
                    ...previous,
                    gallery_urls: tags,
                  }))
                }
                placeholder="Type URL and press Enter..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="image">Upload Main Image</Label>
                <label
                  htmlFor="image"
                  className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:bg-muted/50"
                >
                  <div className="flex flex-col items-center justify-center px-4 text-center">
                    <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Or Main Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      image_url: event.target.value,
                    }))
                  }
                  placeholder="https://example.com/image.jpg"
                  disabled={Boolean(selectedFile)}
                />
                <p className="text-xs text-muted-foreground">
                  Provide a URL if you prefer not to upload an image
                </p>
              </div>
            </div>

            {(previewUrl || formData.image_url) && (
              <div className="relative h-48 w-full overflow-hidden rounded-lg border">
                <Image
                  src={previewUrl || formData.image_url}
                  alt={formData.title || "Tour image"}
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                id="is_active"
                type="checkbox"
                checked={formData.is_active}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    is_active: event.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="is_active" className="font-normal">
                Mark as active
              </Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : initialData?.id ? "Save Changes" : "Create Tour"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/tours">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
