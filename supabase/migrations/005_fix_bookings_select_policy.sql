-- Additional Fix for Bookings SELECT Policy
-- This ensures admins can view all bookings in the dashboard
-- Run this if bookings are still not loading after migration 004

-- Drop the existing admin policy
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;

-- Create a simpler, more reliable admin policy
-- This uses direct checks without function existence checks
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

-- If is_admin() function exists, also try using it
-- This will be added as an additional check
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin') THEN
    -- Drop and recreate with is_admin() included
    DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
    EXECUTE 'CREATE POLICY "Admins can view all bookings"
      ON bookings FOR SELECT
      USING (
        is_admin()
        OR
        EXISTS (
          SELECT 1 FROM profiles
          WHERE id = auth.uid() AND role = ''admin''
        )
        OR
        (auth.jwt() ->> ''role'') = ''admin''
        OR
        EXISTS (
          SELECT 1 FROM auth.users
          WHERE id = auth.uid() 
          AND (raw_user_meta_data->>''role'') = ''admin''
        )
      )';
  END IF;
END $$;

