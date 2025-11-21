"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/supabase/storage";

interface VehicleFormProps {
  initialData?: VehicleFormState;
}

interface VehicleFormState {
  id?: string;
  name: string;
  type: string;
  capacity: number | null;
  fuel_type: string;
  price_per_day: number | null;
  features: string[];
  suitable_for: string;
  image_url: string;
  is_available: boolean;
}

const DEFAULT_STATE: VehicleFormState = {
  name: "",
  type: "",
  capacity: null,
  fuel_type: "",
  price_per_day: null,
  features: [],
  suitable_for: "",
  image_url: "",
  is_available: true,
};

export function VehicleForm({ initialData }: VehicleFormProps) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image_url ?? null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<VehicleFormState>({
    ...DEFAULT_STATE,
    ...initialData,
    name: initialData?.name ?? DEFAULT_STATE.name,
    type: initialData?.type ?? DEFAULT_STATE.type,
    capacity: initialData?.capacity ?? DEFAULT_STATE.capacity,
    fuel_type: initialData?.fuel_type ?? DEFAULT_STATE.fuel_type,
    price_per_day: initialData?.price_per_day ?? DEFAULT_STATE.price_per_day,
    features: initialData?.features ?? DEFAULT_STATE.features,
    suitable_for: initialData?.suitable_for ?? DEFAULT_STATE.suitable_for,
    image_url: initialData?.image_url ?? DEFAULT_STATE.image_url,
    is_available: initialData?.is_available ?? DEFAULT_STATE.is_available,
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

    if (!formData.name.trim()) {
      alert("Vehicle name is required");
      return;
    }

    if (!formData.type.trim()) {
      alert("Vehicle type is required");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = formData.image_url;

      if (selectedFile) {
        try {
          imageUrl = await uploadImage(selectedFile, "vehicles");
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          alert("Error uploading image: " + message);
          setIsSubmitting(false);
          return;
        }
      }

      const supabase = createClient();
      const payload = {
        name: formData.name.trim(),
        type: formData.type.trim(),
        capacity: formData.capacity !== null ? Number(formData.capacity) : null,
        fuel_type: formData.fuel_type.trim() || null,
        price_per_day: formData.price_per_day !== null ? Number(formData.price_per_day) : null,
        features:
          formData.features.length > 0
            ? formData.features.map((feature) => feature.trim()).filter(Boolean)
            : null,
        suitable_for: formData.suitable_for.trim() || null,
        image_url: imageUrl || null,
        is_available: formData.is_available,
      };

      let errorMessage: string | null = null;

      if (initialData?.id) {
        const { error } = await supabase
          .from("vehicles")
          .update(payload)
          .eq("id", initialData.id);

        if (error) {
          errorMessage = error.message;
        }
      } else {
        const { error } = await supabase.from("vehicles").insert([payload]);

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
          alert("Error saving vehicle: " + errorMessage);
        }
        setIsSubmitting(false);
        return;
      }

      router.push("/admin/vehicles");
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
          <Link href="/admin/vehicles">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-4xl font-bold">
            {initialData?.id ? "Edit Vehicle" : "Add Vehicle"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {initialData?.id
              ? "Update the vehicle details below"
              : "Create a new vehicle option"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Details</CardTitle>
          <CardDescription>
            {initialData?.id
              ? "Modify the information for this vehicle"
              : "Fill in the details for the new vehicle"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      type: event.target.value,
                    }))
                  }
                  placeholder="e.g., Sedan, SUV, Van"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity ?? ""}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      capacity: event.target.value ? Number(event.target.value) : null,
                    }))
                  }
                  placeholder="Number of passengers"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuel_type">Fuel Type</Label>
                <Input
                  id="fuel_type"
                  value={formData.fuel_type}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      fuel_type: event.target.value,
                    }))
                  }
                  placeholder="e.g., Petrol, Diesel"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_per_day">Price per Day (USD)</Label>
                <Input
                  id="price_per_day"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price_per_day ?? ""}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      price_per_day: event.target.value ? Number(event.target.value) : null,
                    }))
                  }
                  placeholder="e.g., 65"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Features (comma separated)</Label>
                <Input
                  id="features"
                  value={formData.features.join(", ")}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      features: event.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    }))
                  }
                  placeholder="e.g., AC, GPS, Music System"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="suitable_for">Suitable For</Label>
              <Input
                id="suitable_for"
                value={formData.suitable_for}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    suitable_for: event.target.value,
                  }))
                }
                placeholder="e.g., Family trips, City tours"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="image">Upload Image</Label>
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
                <Label htmlFor="image_url">Or Image URL</Label>
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
                  alt={formData.name || "Vehicle image"}
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
                id="is_available"
                type="checkbox"
                checked={formData.is_available}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    is_available: event.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="is_available" className="font-normal">
                Available for rental
              </Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : initialData?.id ? "Save Changes" : "Create Vehicle"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/vehicles">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


