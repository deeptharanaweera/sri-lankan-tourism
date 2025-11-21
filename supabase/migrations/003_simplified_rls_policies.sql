-- Simplified RLS Policies - Alternative Fix
-- If the complex policies don't work, try this simplified version
-- This creates a function that checks admin status more reliably

-- First, ensure the is_admin function exists
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Check profiles table first
  SELECT role INTO user_role
  FROM profiles
  WHERE id = auth.uid();
  
  IF user_role = 'admin' THEN
    RETURN TRUE;
  END IF;
  
  -- Check JWT token
  IF (auth.jwt() ->> 'role') = 'admin' THEN
    RETURN TRUE;
  END IF;
  
  -- Check user metadata
  SELECT raw_user_meta_data->>'role' INTO user_role
  FROM auth.users
  WHERE id = auth.uid();
  
  IF user_role = 'admin' THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Drop all existing gallery policies
DROP POLICY IF EXISTS "Gallery is viewable by everyone" ON gallery;
DROP POLICY IF EXISTS "Admins can insert gallery items" ON gallery;
DROP POLICY IF EXISTS "Admins can update gallery items" ON gallery;
DROP POLICY IF EXISTS "Admins can delete gallery items" ON gallery;
DROP POLICY IF EXISTS "Admins can manage gallery" ON gallery;

-- Create simplified gallery policies using the function
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

-- Do the same for tours
DROP POLICY IF EXISTS "Admins can insert tours" ON tours;
DROP POLICY IF EXISTS "Admins can update tours" ON tours;
DROP POLICY IF EXISTS "Admins can delete tours" ON tours;

CREATE POLICY "Admins can insert tours"
  ON tours FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update tours"
  ON tours FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete tours"
  ON tours FOR DELETE
  USING (is_admin());

-- Do the same for vehicles
DROP POLICY IF EXISTS "Admins can insert vehicles" ON vehicles;
DROP POLICY IF EXISTS "Admins can update vehicles" ON vehicles;
DROP POLICY IF EXISTS "Admins can delete vehicles" ON vehicles;
DROP POLICY IF EXISTS "Admins can manage vehicles" ON vehicles;

CREATE POLICY "Admins can insert vehicles"
  ON vehicles FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update vehicles"
  ON vehicles FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete vehicles"
  ON vehicles FOR DELETE
  USING (is_admin());

-- Do the same for reviews
DROP POLICY IF EXISTS "Admins can view all reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can insert reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can update reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can delete reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can manage reviews" ON reviews;

CREATE POLICY "Admins can view all reviews"
  ON reviews FOR SELECT
  USING (is_approved = true OR auth.uid() = user_id OR is_admin());

CREATE POLICY "Admins can insert reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id OR is_admin());

CREATE POLICY "Admins can update reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id OR is_admin())
  WITH CHECK (auth.uid() = user_id OR is_admin());

CREATE POLICY "Admins can delete reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id OR is_admin());

-- Do the same for bookings
DROP POLICY IF EXISTS "Admins can update bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can delete bookings" ON bookings;

CREATE POLICY "Admins can update bookings"
  ON bookings FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete bookings"
  ON bookings FOR DELETE
  USING (is_admin());

-- Do the same for contacts
DROP POLICY IF EXISTS "Admins can update contacts" ON contacts;
DROP POLICY IF EXISTS "Admins can delete contacts" ON contacts;

CREATE POLICY "Admins can update contacts"
  ON contacts FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete contacts"
  ON contacts FOR DELETE
  USING (is_admin());

