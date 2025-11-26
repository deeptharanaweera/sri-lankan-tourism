"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { deleteImage, uploadImage } from "@/lib/supabase/storage";
import { ArrowLeft, Plus, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface GalleryImage {
    id: string;
    image_url: string;
}

interface GalleryFormProps {
    initialData?: {
        id: string;
        title: string;
        category: string;
        location: string;
        image_url: string;
        description: string;
        date_taken: string;
        is_featured: boolean;
    };
    initialImages?: GalleryImage[];
    mode?: "create" | "edit";
}

export function GalleryForm({ initialData, initialImages = [], mode = "edit" }: GalleryFormProps) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Main image state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image_url || null);
    const [originalImageUrl] = useState<string>(initialData?.image_url || "");

    // Additional images state
    const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
    const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<GalleryImage[]>(initialImages);
    const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        category: initialData?.category || "",
        location: initialData?.location || "",
        image_url: initialData?.image_url || "",
        description: initialData?.description || "",
        date_taken: initialData?.date_taken || "",
        is_featured: initialData?.is_featured || false,
    });

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

    const handleAdditionalFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validFiles: File[] = [];
        const newPreviews: string[] = [];

        files.forEach(file => {
            if (!file.type.startsWith("image/")) {
                alert(`Skipping ${file.name}: Not an image`);
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                alert(`Skipping ${file.name}: File size > 10MB`);
                return;
            }
            validFiles.push(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setAdditionalPreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });

        setAdditionalFiles(prev => [...prev, ...validFiles]);
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setPreviewUrl(originalImageUrl || null);
        setFormData({ ...formData, image_url: originalImageUrl });
    };

    const handleRemoveAdditionalFile = (index: number) => {
        setAdditionalFiles(prev => prev.filter((_, i) => i !== index));
        setAdditionalPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleDeleteExistingImage = (id: string) => {
        setExistingImages(prev => prev.filter(img => img.id !== id));
        setDeletedImageIds(prev => [...prev, id]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.image_url && !selectedFile && mode === "edit") {
            alert("Please upload a main image or provide an image URL");
            return;
        }

        if (!selectedFile && !formData.image_url && mode === "create") {
            alert("Please upload a main image");
            return;
        }

        setSaving(true);
        setUploading(true);

        try {
            const supabase = createClient();
            let mainImageUrl = formData.image_url;
            let shouldDeleteOriginal = false;

            // 1. Upload main image if changed
            if (selectedFile) {
                try {
                    mainImageUrl = await uploadImage(selectedFile, "gallery");
                    if (originalImageUrl && originalImageUrl.includes("supabase.co/storage")) {
                        shouldDeleteOriginal = true;
                    }
                } catch (uploadError) {
                    throw new Error("Error uploading main image: " + (uploadError instanceof Error ? uploadError.message : "Unknown error"));
                }
            }

            let galleryId = initialData?.id;

            // 2. Create or Update Gallery Item
            if (mode === "create") {
                const { data, error } = await supabase.from("gallery").insert([
                    {
                        title: formData.title,
                        category: formData.category || null,
                        location: formData.location || null,
                        image_url: mainImageUrl,
                        description: formData.description || null,
                        date_taken: formData.date_taken || null,
                        is_featured: formData.is_featured || false,
                    },
                ]).select().single();

                if (error) throw error;
                galleryId = data.id;
            } else {
                const { error } = await supabase
                    .from("gallery")
                    .update({
                        title: formData.title,
                        category: formData.category || null,
                        location: formData.location || null,
                        image_url: mainImageUrl,
                        description: formData.description || null,
                        date_taken: formData.date_taken || null,
                        is_featured: formData.is_featured || false,
                    })
                    .eq("id", galleryId);

                if (error) throw error;
            }

            // 3. Delete old main image if replaced
            if (shouldDeleteOriginal) {
                try {
                    await deleteImage(originalImageUrl, "gallery");
                } catch (deleteError) {
                    console.error("Error deleting old image:", deleteError);
                }
            }

            // 4. Upload Additional Images
            if (additionalFiles.length > 0 && galleryId) {
                const uploadPromises = additionalFiles.map(async (file) => {
                    try {
                        const imageUrl = await uploadImage(file, "gallery");
                        const { error: insertError } = await supabase.from("gallery_images").insert({
                            gallery_id: galleryId,
                            image_url: imageUrl,
                        });

                        if (insertError) {
                            throw new Error(`Database error: ${insertError.message}`);
                        }
                        return { status: 'success', file: file.name };
                    } catch (error) {
                        console.error(`Failed to upload ${file.name}:`, error);
                        return { status: 'error', file: file.name, error: error instanceof Error ? error.message : 'Unknown error' };
                    }
                });

                const results = await Promise.all(uploadPromises);
                const failed = results.filter(r => r.status === 'error');

                if (failed.length > 0) {
                    const errorMessages = failed.map(f => `${f.file}: ${(f as any).error}`).join("\n");
                    alert(`Some images failed to upload:\n${errorMessages}`);
                }
            }

            // 5. Delete removed existing images
            if (deletedImageIds.length > 0) {
                // First get the URLs to delete from storage
                const { data: imagesToDelete } = await supabase
                    .from("gallery_images")
                    .select("image_url")
                    .in("id", deletedImageIds);

                // Delete from DB
                await supabase.from("gallery_images").delete().in("id", deletedImageIds);

                // Delete from storage
                if (imagesToDelete) {
                    const deletePromises = imagesToDelete.map(async (img) => {
                        if (img.image_url && img.image_url.includes("supabase.co/storage")) {
                            try {
                                await deleteImage(img.image_url, "gallery");
                            } catch (e) {
                                console.error("Failed to delete image from storage:", e);
                            }
                        }
                    });
                    await Promise.all(deletePromises);
                }
            }

            router.push("/admin/gallery");
            router.refresh();
        } catch (error) {
            console.error("Submit error:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";

            let displayMessage = "Error: " + errorMessage;
            if (errorMessage.includes("row-level security")) {
                displayMessage = "Permission denied. Please check your admin privileges.";
            }

            alert(displayMessage);
        } finally {
            setSaving(false);
            setUploading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/gallery">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-4xl font-bold">{mode === "create" ? "Add Gallery Item" : "Edit Gallery Item"}</h1>
                    <p className="text-muted-foreground mt-2">
                        {mode === "create" ? "Add a new item to the gallery" : "Update gallery item details"}
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Image Details</CardTitle>
                    <CardDescription>Main image and details</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
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

                        {/* Main Image Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="image">Main Image *</Label>
                            {!selectedFile && !previewUrl ? (
                                <div className="flex items-center justify-center w-full">
                                    <label
                                        htmlFor="image"
                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                            <p className="mb-2 text-sm text-muted-foreground">
                                                <span className="font-semibold">Click to upload</span> main image
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
                                <div className="relative w-full max-w-md">
                                    {previewUrl && (
                                        <div className="relative aspect-video rounded-lg overflow-hidden border">
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

                        {/* Additional Images Upload */}
                        <div className="space-y-4">
                            <Label>Additional Images</Label>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* Existing Additional Images */}
                                {existingImages.map((img) => (
                                    <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border group">
                                        <Image
                                            src={img.image_url}
                                            alt="Gallery image"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => handleDeleteExistingImage(img.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                {/* New Additional Images Previews */}
                                {additionalPreviews.map((preview, index) => (
                                    <div key={`new-${index}`} className="relative aspect-square rounded-lg overflow-hidden border group">
                                        <Image
                                            src={preview}
                                            alt="New upload"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => handleRemoveAdditionalFile(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                {/* Upload Button */}
                                <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                    <Plus className="w-8 h-8 mb-2 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">Add Images</span>
                                    <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleAdditionalFilesSelect}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image_url">Or Main Image URL</Label>
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
                                    <>{mode === "create" ? "Add Item" : "Update Item"}</>
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
    );
}
