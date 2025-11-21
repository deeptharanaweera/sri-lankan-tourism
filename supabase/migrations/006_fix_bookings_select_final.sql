-- Final Fix for Bookings SELECT Policy
-- This creates a comprehensive policy that allows admins to view all bookings
-- Run this to fix bookings not loading in dashboard
-- This version avoids infinite recursion by not querying profiles table directly

-- First, ensure is_admin() function exists and is safe (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Check JWT token first (no database query)
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
  
  -- Last resort: Check profiles table (SECURITY DEFINER should bypass RLS)
  -- But we'll use a direct query that should work
  SELECT role INTO user_role
  FROM profiles
  WHERE id = auth.uid();
  
  IF user_role = 'admin' THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Drop ALL existing SELECT policies on bookings
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Bookings are viewable by everyone" ON bookings;
DROP POLICY IF EXISTS "View bookings with null user_id" ON bookings;

-- Create a policy that allows admins to view ALL bookings
-- This policy uses is_admin() function which is SECURITY DEFINER and bypasses RLS
-- This prevents infinite recursion that happens when querying profiles table directly
CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  USING (is_admin());

-- Allow users to view their own bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Allow viewing bookings where user_id is NULL (for unauthenticated bookings)
-- This is needed so admins can see bookings created by unauthenticated users
CREATE POLICY "View bookings with null user_id"
  ON bookings FOR SELECT
  USING (user_id IS NULL);

-- IMPORTANT: Make sure your admin user has role = 'admin' in the profiles table
-- Run this to check and set admin role:
-- SELECT id, email, role FROM profiles WHERE role = 'admin';
-- If no results, set your user as admin:
-- UPDATE profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');

