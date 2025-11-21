-- Fix Bookings INSERT Policy to Allow Public Inserts
-- This ensures that unauthenticated users can create bookings

-- Drop ALL existing INSERT policies on bookings to avoid conflicts
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Public can create bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;

-- Recreate the INSERT policy to allow public inserts
-- This allows anyone (authenticated or unauthenticated) to create bookings
-- For authenticated users: user_id can match auth.uid() or be NULL
-- For unauthenticated users: user_id will be NULL and auth.uid() is NULL
-- Using (true) is the simplest way to allow all inserts for public bookings
CREATE POLICY "Public can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

-- Fix SELECT policies for bookings
-- Drop all existing SELECT policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Bookings are viewable by everyone" ON bookings;
DROP POLICY IF EXISTS "View bookings with null user_id" ON bookings;

-- Create a policy that allows admins to view all bookings
-- This uses direct checks which are more reliable
CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  USING (
    -- Check profiles table (most reliable method)
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
    OR
    -- Check JWT token role
    (auth.jwt() ->> 'role') = 'admin'
    OR
    -- Check user metadata role
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() 
      AND (raw_user_meta_data->>'role') = 'admin'
    )
  );

-- Ensure users can view their own bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

-- Also allow viewing bookings if user_id is NULL (for unauthenticated bookings)
-- This helps admins view all bookings including those without user_id
CREATE POLICY "View bookings with null user_id"
  ON bookings FOR SELECT
  USING (user_id IS NULL);

