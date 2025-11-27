-- Fix Recursive Policies on Profiles Table
-- This migration fixes potential infinite recursion in RLS policies for the profiles table
-- which can cause "permission denied" errors or timeouts.

-- 1. Drop existing policies on profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;

-- 2. Create non-recursive policies using is_admin()
-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admins can view all profiles (uses SECURITY DEFINER function to avoid recursion)
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- Admins can insert/update/delete profiles
CREATE POLICY "Admins can manage profiles"
  ON profiles FOR ALL
  USING (is_admin());

-- 3. Ensure gallery policies are correct (just in case)
DROP POLICY IF EXISTS "Admins can insert gallery" ON gallery;
CREATE POLICY "Admins can insert gallery"
  ON gallery FOR INSERT
  WITH CHECK (is_admin());

-- 4. Ensure gallery_images policies are correct
DROP POLICY IF EXISTS "Admins can insert gallery images" ON gallery_images;
CREATE POLICY "Admins can insert gallery images"
  ON gallery_images FOR INSERT
  WITH CHECK (is_admin());
