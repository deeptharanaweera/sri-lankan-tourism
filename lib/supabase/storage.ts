import { createClient } from "@/lib/supabase/client";

/**
 * Upload an image file to Supabase Storage
 * @param file - The file to upload
 * @param folder - The folder path in storage (e.g., "gallery", "tours")
 * @returns The public URL of the uploaded file
 */
export async function uploadImage(
  file: File,
  folder: string = "gallery"
): Promise<string> {
  const supabase = createClient();

  // Generate a unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  // Upload the file
  const { error: uploadError } = await supabase.storage
    .from("images") // Bucket name - make sure this exists in Supabase Storage
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload image: ${uploadError.message}`);
  }

  // Get the public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("images").getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Delete an image from Supabase Storage
 * @param imageUrl - The public URL of the image
 * @param folder - The folder path in storage (e.g., "gallery", "tours")
 */
export async function deleteImage(
  imageUrl: string,
  folder: string = "gallery"
): Promise<void> {
  const supabase = createClient();

  try {
    // Extract the file path from the Supabase Storage URL
    // URL format: https://[project].supabase.co/storage/v1/object/public/images/[folder]/[filename]
    const urlParts = imageUrl.split("/");
    const imagesIndex = urlParts.findIndex(part => part === "images");
    
    let filePath: string;
    
    if (imagesIndex !== -1 && imagesIndex < urlParts.length - 1) {
      // Extract path after "images/" 
      filePath = urlParts.slice(imagesIndex + 1).join("/");
    } else {
      // Fallback: use folder and filename from URL
      const fileName = urlParts[urlParts.length - 1];
      filePath = `${folder}/${fileName}`;
    }

    const { error } = await supabase.storage
      .from("images")
      .remove([filePath]);

    if (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to delete image: ${message}`);
  }
}

