-- Fix RLS Policies for Admin Access
-- Run this in your Supabase SQL Editor to fix admin access issues

-- Drop existing gallery policies if they exist
DROP POLICY IF EXISTS "Admins can manage gallery" ON gallery;

-- Recreate gallery policies with proper admin check
-- Allow authenticated users with admin role to do everything
CREATE POLICY "Gallery is viewable by everyone"
  ON gallery FOR SELECT
  USING (true);

-- Separate policies for INSERT, UPDATE, DELETE to handle WITH CHECK properly
CREATE POLICY "Admins can insert gallery items"
  ON gallery FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) OR
    auth.jwt() ->> 'role' = 'admin' OR
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can update gallery items"
  ON gallery FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) OR
    auth.jwt() ->> 'role' = 'admin' OR
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can delete gallery items"
  ON gallery FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) OR
    auth.jwt() ->> 'role' = 'admin' OR
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Fix tours policies (add WITH CHECK for INSERT)
DROP POLICY IF EXISTS "Admins can insert tours" ON tours;
CREATE POLICY "Admins can insert tours"
  ON tours FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) OR
    auth.jwt() ->> 'role' = 'admin' OR
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Fix vehicles policies
DROP POLICY IF EXISTS "Admins can manage vehicles" ON vehicles;
CREATE POLICY "Vehicles are viewable by everyone"
  ON vehicles FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert vehicles"
  ON vehicles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) OR
    auth.jwt() ->> 'role' = 'admin' OR
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can update vehicles"
  ON vehicles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) OR
    auth.jwt() ->> 'role' = 'admin' OR
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can delete vehicles"
  ON vehicles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) OR
    auth.jwt() ->> 'role' = 'admin' OR
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Fix bookings policies - add DELETE for admins
DROP POLICY IF EXISTS "Admins can update bookings" ON bookings;
CREATE POLICY "Admins can update bookings"
  ON bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) OR
    auth.jwt() ->> 'role' = 'admin' OR
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can delete bookings"
  ON bookings FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) OR
    auth.jwt() ->> 'role' = 'admin' OR
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Fix reviews policies
DROP POLICY IF EXISTS "Admins can manage reviews" ON reviews;
CREATE POLICY "Admins can view all reviews"
  ON reviews FOR SELECT
  USING (
    is_approved = true OR 
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) OR
    auth.jwt() ->> 'role' = 'admin' OR
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can insert reviews"
  ON reviews FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) OR
    auth.jwt() ->> 'role' = 'admin' OR
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can update reviews"
  ON reviews FOR UPDATE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) OR
    auth.jwt() ->> 'role' = 'admin' OR
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can delete reviews"
  ON reviews FOR DELETE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) OR
    auth.jwt() ->> 'role' = 'admin' OR
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Fix contacts policies - add UPDATE and DELETE for admins
CREATE POLICY "Admins can update contacts"
  ON contacts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) OR
    auth.jwt() ->> 'role' = 'admin' OR
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can delete contacts"
  ON contacts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) OR
    auth.jwt() ->> 'role' = 'admin' OR
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Ensure profiles table allows admins to be created/updated
CREATE POLICY IF NOT EXISTS "Admins can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- Create a function to help with admin checks (more efficient)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) OR
    auth.jwt() ->> 'role' = 'admin' OR
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

