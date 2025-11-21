"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { uploadImage, deleteImage } from "@/lib/supabase/storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EditGalleryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    image_url: "",
    description: "",
    date_taken: "",
    is_featured: false,
  });
  const [originalImageUrl, setOriginalImageUrl] = useState<string>("");

  useEffect(() => {
    const fetchGalleryItem = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("Error loading gallery item: " + error.message);
        router.push("/admin/gallery");
        return;
      }

      if (data) {
        setFormData({
          title: data.title || "",
          category: data.category || "",
          location: data.location || "",
          image_url: data.image_url || "",
          description: data.description || "",
          date_taken: data.date_taken || "",
          is_featured: data.is_featured || false,
        });
        setOriginalImageUrl(data.image_url || "");
        setPreviewUrl(data.image_url || null);
      }
      setLoading(false);
    };

    if (id) {
      fetchGalleryItem();
    }
  }, [id, router]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
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
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(originalImageUrl);
    setFormData({ ...formData, image_url: originalImageUrl });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image_url && !selectedFile) {
      alert("Please upload an image or provide an image URL");
      return;
    }

    setSaving(true);
    setUploading(true);

    try {
      let imageUrl = formData.image_url;
      let shouldDeleteOriginal = false;

      // Upload new file if selected
      if (selectedFile) {
        try {
          imageUrl = await uploadImage(selectedFile, "gallery");
          // Mark original for deletion if it was from our storage
          if (originalImageUrl && originalImageUrl.includes("supabase.co/storage")) {
            shouldDeleteOriginal = true;
          }
        } catch (uploadError) {
          const errorMessage = uploadError instanceof Error ? uploadError.message : "Unknown error";
          alert("Error uploading image: " + errorMessage);
          setSaving(false);
          setUploading(false);
          return;
        }
      }

      // Delete old image from storage if replaced
      if (shouldDeleteOriginal) {
        try {
          await deleteImage(originalImageUrl, "gallery");
        } catch (deleteError) {
          // Log but don't block the update
          console.error("Error deleting old image:", deleteError);
        }
      }

      // Update database
      const supabase = createClient();
      const { error } = await supabase
        .from("gallery")
        .update({
          title: formData.title,
          category: formData.category || null,
          location: formData.location || null,
          image_url: imageUrl,
          description: formData.description || null,
          date_taken: formData.date_taken || null,
          is_featured: formData.is_featured || false,
        })
        .eq("id", id);

      if (error) {
        console.error("Update error:", error);
        let errorMessage = "Error updating image: " + error.message;
        
        if (error.message.includes("row-level security")) {
          errorMessage = "Permission denied. Please make sure:\n" +
            "1. You are logged in as an admin\n" +
            "2. Your user has 'admin' role in the profiles table\n" +
            "3. RLS policies are configured correctly\n\n" +
            "See RLS_POLICY_FIX.md for setup instructions.";
        }
        
        alert(errorMessage);
        setSaving(false);
        setUploading(false);
        return;
      }

      router.push("/admin/gallery");
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert("Error: " + errorMessage);
      setSaving(false);
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/gallery">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-4xl font-bold">Edit Gallery Image</h1>
            <p className="text-muted-foreground mt-2">
              Update gallery image details
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Image Details</CardTitle>
            <CardDescription>Update the details for the gallery image</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Upload New Image (Optional)</Label>
                {!selectedFile ? (
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> new image
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, WEBP up to 10MB
                        </p>
                      </div>
                      <input
                        id="image"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    {previewUrl && (
                      <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={handleRemoveFile}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {previewUrl && !selectedFile && (
                <div className="space-y-2">
                  <Label>Current Image</Label>
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                    <Image
                      src={previewUrl}
                      alt={formData.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="image_url">Or Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  disabled={!!selectedFile}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g., beaches, mountains"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g., Galle, Kandy"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Image description..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_taken">Date Taken</Label>
                <Input
                  id="date_taken"
                  type="date"
                  value={formData.date_taken}
                  onChange={(e) =>
                    setFormData({ ...formData, date_taken: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) =>
                    setFormData({ ...formData, is_featured: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="is_featured" className="font-normal">
                  Mark as featured
                </Label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={saving || uploading}>
                  {uploading ? (
                    <>Uploading...</>
                  ) : saving ? (
                    <>Saving...</>
                  ) : (
                    <>Update Image</>
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/gallery">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

