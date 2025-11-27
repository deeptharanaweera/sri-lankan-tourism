-- Fix Gallery Permissions and RLS Policies
-- This migration fixes the "permission denied for table users" error by using the is_admin() function
-- and ensuring all gallery-related tables have correct policies.

-- 1. Ensure is_admin() function exists and is secure
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Check JWT token first (fastest, no DB query)
  IF (auth.jwt() ->> 'role') = 'admin' THEN
    RETURN TRUE;
  END IF;
  
  -- Check user metadata in auth.users (no RLS on auth schema)
  SELECT raw_user_meta_data->>'role' INTO user_role
  FROM auth.users
  WHERE id = auth.uid();
  
  IF user_role = 'admin' THEN
    RETURN TRUE;
  END IF;
  
  -- Last resort: Check profiles table
  SELECT role INTO user_role
  FROM profiles
  WHERE id = auth.uid();
  
  IF user_role = 'admin' THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 2. Fix Gallery Table Policies
DROP POLICY IF EXISTS "Gallery is viewable by everyone" ON gallery;
DROP POLICY IF EXISTS "Admins can insert gallery" ON gallery;
DROP POLICY IF EXISTS "Admins can update gallery" ON gallery;
DROP POLICY IF EXISTS "Admins can delete gallery" ON gallery;
DROP POLICY IF EXISTS "Admins can manage gallery" ON gallery;
DROP POLICY IF EXISTS "Admins can insert gallery items" ON gallery;
DROP POLICY IF EXISTS "Admins can update gallery items" ON gallery;
DROP POLICY IF EXISTS "Admins can delete gallery items" ON gallery;

CREATE POLICY "Gallery is viewable by everyone"
  ON gallery FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert gallery"
  ON gallery FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update gallery"
  ON gallery FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete gallery"
  ON gallery FOR DELETE
  USING (is_admin());

-- 3. Fix Gallery Images Table Policies
-- Drop existing policies (old names)
DROP POLICY IF EXISTS "Enable read access for all users" ON gallery_images;
DROP POLICY IF EXISTS "Enable insert for admins" ON gallery_images;
DROP POLICY IF EXISTS "Enable delete for admins" ON gallery_images;

-- Drop policies we are about to create (new names) - ensures idempotency
DROP POLICY IF EXISTS "Gallery images are viewable by everyone" ON gallery_images;
DROP POLICY IF EXISTS "Admins can insert gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Admins can update gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Admins can delete gallery images" ON gallery_images;

-- Recreate policies using is_admin() to avoid recursion/permission issues
CREATE POLICY "Gallery images are viewable by everyone"
  ON gallery_images FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert gallery images"
  ON gallery_images FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update gallery images"
  ON gallery_images FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete gallery images"
  ON gallery_images FOR DELETE
  USING (is_admin());

-- 4. Grant necessary permissions just in case
GRANT ALL ON public.gallery TO postgres, service_role;
GRANT ALL ON public.gallery_images TO postgres, service_role;

GRANT SELECT ON public.gallery TO anon, authenticated;
GRANT SELECT ON public.gallery_images TO anon, authenticated;

-- Allow authenticated users to insert/update/delete if they pass RLS
GRANT INSERT, UPDATE, DELETE ON public.gallery TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery_images TO authenticated;
