# RLS Policy Fix Guide

## Problem
You're getting "new row violates row-level security policy" errors when trying to save gallery items or use other admin functions.

## Solution

### Step 1: Run the RLS Policy Fix SQL

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/migrations/002_fix_rls_policies.sql`
4. Click **Run** to execute the SQL

This will:
- Fix gallery INSERT/UPDATE/DELETE policies
- Fix tours, vehicles, bookings, reviews, and contacts policies
- Add missing DELETE policies for admins
- Add multiple ways to check admin status (profiles table, JWT, user metadata)

### Step 2: Verify Your Admin Role

Make sure your user has admin role set correctly:

1. Go to **Supabase Dashboard** → **Table Editor** → **profiles**
2. Find your user (search by email)
3. Make sure the `role` field is set to `admin`
4. If it's not, update it to `admin`

### Step 3: Alternative Admin Setup Methods

The fixed policies check for admin in multiple ways:
1. **Profiles table** - `profiles.role = 'admin'` (recommended)
2. **JWT token** - `auth.jwt() ->> 'role' = 'admin'`
3. **User metadata** - `raw_user_meta_data->>'role' = 'admin'`

#### Option A: Set via Profiles Table (Recommended)
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

#### Option B: Set via User Metadata
1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Find your user
3. Click **Edit**
4. In **User Metadata**, add:
```json
{
  "role": "admin"
}
```

#### Option C: Use Environment Variable
The code also checks `ADMIN_EMAIL` environment variable, but this only works in the application code, not RLS policies.

### Step 4: Test Admin Functions

After running the SQL fix:

1. **Test Gallery Upload**:
   - Go to `/admin/gallery/add`
   - Try uploading an image
   - Should work without RLS errors

2. **Test Other Functions**:
   - Try adding/editing tours
   - Try managing vehicles
   - Try approving reviews
   - Try viewing bookings

### Step 5: If Still Not Working

If you still get RLS errors:

1. **Check if you're logged in**:
   - Make sure you're authenticated in the app
   - Check browser console for auth errors

2. **Verify your user ID**:
   - Go to Supabase Dashboard → Authentication → Users
   - Copy your user ID
   - Go to Table Editor → profiles
   - Verify there's a row with that ID and `role = 'admin'`

3. **Check RLS is enabled**:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' 
   AND tablename IN ('gallery', 'tours', 'vehicles', 'bookings', 'reviews', 'contacts');
   ```
   All should show `rowsecurity = true`

4. **Check existing policies**:
   ```sql
   SELECT schemaname, tablename, policyname, cmd, qual, with_check
   FROM pg_policies
   WHERE tablename IN ('gallery', 'tours', 'vehicles', 'bookings', 'reviews', 'contacts')
   ORDER BY tablename, policyname;
   ```

5. **Manual admin check**:
   ```sql
   -- Check if you're recognized as admin
   SELECT 
     id,
     email,
     role,
     auth.uid() as current_user_id,
     (SELECT role FROM profiles WHERE id = auth.uid()) as profile_role
   FROM auth.users
   WHERE email = 'your-email@example.com';
   ```

### Common Issues

#### Issue: "Policy check failed"
- **Cause**: User doesn't have admin role in profiles table
- **Fix**: Update profiles table: `UPDATE profiles SET role = 'admin' WHERE id = auth.uid();`

#### Issue: "JWT expired"
- **Cause**: Session expired
- **Fix**: Log out and log back in

#### Issue: "Profile doesn't exist"
- **Cause**: Profile wasn't created during signup
- **Fix**: Create profile manually:
  ```sql
  INSERT INTO profiles (id, email, role)
  VALUES (auth.uid(), 'your-email@example.com', 'admin');
  ```

## Quick Fix Script

### Option 1: Fix RLS Policies (Recommended)

Run this in SQL Editor to fix all RLS policies:

```sql
-- Run the simplified RLS policies fix
-- Copy and paste the entire contents of: supabase/migrations/003_simplified_rls_policies.sql
```

### Option 2: Set Your User as Admin

Run this in SQL Editor (replace with your email):

```sql
-- Create profile if doesn't exist and set as admin
INSERT INTO profiles (id, email, role)
SELECT 
  id,
  email,
  'admin'
FROM auth.users
WHERE email = 'your-email@example.com'
ON CONFLICT (id) 
DO UPDATE SET role = 'admin';
```

This will:
- Create a profile for your user if it doesn't exist
- Set the role to admin
- Update existing profile to admin if it exists

### Option 3: Complete Setup Script

Run this complete setup script to do everything at once:

```sql
-- Step 1: Create profile and set as admin (replace with your email)
INSERT INTO profiles (id, email, role)
SELECT 
  id,
  email,
  'admin'
FROM auth.users
WHERE email = 'your-email@example.com'
ON CONFLICT (id) 
DO UPDATE SET role = 'admin';

-- Step 2: Run the simplified RLS policies
-- (Copy contents of supabase/migrations/003_simplified_rls_policies.sql here)
```

## After Fixing

Once the policies are fixed, all admin functions should work:
- ✅ Add/Edit/Delete gallery items
- ✅ Add/Edit/Delete tours
- ✅ Add/Edit/Delete vehicles
- ✅ View/Update/Delete bookings
- ✅ Approve/Delete reviews
- ✅ View/Update/Delete contact messages

