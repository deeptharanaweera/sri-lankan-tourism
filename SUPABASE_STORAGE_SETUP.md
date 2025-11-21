# Supabase Storage Setup Guide

## Overview
This guide will help you set up Supabase Storage for image uploads in the admin dashboard.

## Step 1: Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New Bucket**
4. Create a bucket named `images` (this is the bucket name used in the code)
5. Make it **Public** so images can be accessed via public URLs
6. Click **Create bucket**

## Step 2: Set Up Storage Policies

You need to configure Row Level Security (RLS) policies for the storage bucket.

### Policy 1: Allow Authenticated Users to Upload
1. Go to **Storage** → **Policies** → Select `images` bucket
2. Click **New Policy**
3. Use the following SQL:

```sql
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');
```

### Policy 2: Allow Public Access to Read Images
```sql
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');
```

### Policy 3: Allow Authenticated Users to Delete Their Own Images
```sql
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');
```

### Policy 4: Allow Authenticated Users to Update Images
```sql
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'images');
```

## Step 3: Folder Structure

The storage utility automatically organizes images in folders:
- `gallery/` - Gallery images
- `tours/` - Tour images (if you add tour image uploads)
- `vehicles/` - Vehicle images (if you add vehicle image uploads)

Images are automatically saved to these folders based on the context.

## Step 4: Verify Setup

1. Try uploading an image through the admin gallery page
2. Check the Storage → `images` bucket to see if the image was uploaded
3. Verify the image URL is accessible publicly

## Troubleshooting

### Error: "new row violates row-level security policy"
- Make sure you've created all the storage policies above
- Verify you're logged in as an admin user
- Check that the bucket is set to public

### Error: "Bucket not found"
- Make sure the bucket name is exactly `images` (case-sensitive)
- Verify the bucket exists in your Supabase project

### Images not displaying
- Check that the bucket is set to **Public**
- Verify the storage policies allow public SELECT access
- Check the image URL in the browser to see the actual error

## File Size Limits

- Maximum file size: 10MB (configurable in the code)
- Supported formats: PNG, JPG, WEBP, and other image formats
- Validation happens on the client side before upload

## Notes

- Images are automatically assigned unique filenames to prevent conflicts
- Old images are automatically deleted from storage when replaced during edits
- When deleting a gallery item, the image is also removed from storage
- External URLs (not from Supabase storage) are not deleted when items are removed

