# Fix Bookings INSERT Permission Issue

## Problem
Users are getting this error when trying to submit bookings:
```
Permission denied. Please ensure bookings table RLS policies allow public inserts.
```

## Solution

### Step 1: Run the Migration SQL

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/migrations/004_fix_bookings_insert_policy.sql`
4. Click **Run** to execute the SQL

This migration will:
- Recreate the INSERT policy to allow public inserts (unauthenticated users can create bookings)
- Ensure admins can view all bookings
- Ensure users can view their own bookings

### Step 2: Verify the Policy

After running the migration, verify the policy exists:

1. Go to **Supabase Dashboard** → **Table Editor** → **bookings**
2. Click on **Policies** tab
3. You should see a policy named "Public can create bookings" with:
   - Operation: `INSERT`
   - Definition: `true` (allows all inserts)

### Alternative: Manual SQL Fix

If you prefer to run the SQL directly, here's what you need:

```sql
-- Drop ALL existing INSERT policies to avoid conflicts
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Public can create bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;

-- Create a simple policy that allows anyone to insert bookings
CREATE POLICY "Public can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);
```

## What This Does

The policy `WITH CHECK (true)` allows:
- **Anyone** (authenticated or unauthenticated) to create bookings
- This is necessary because the booking forms allow users to submit bookings without being logged in, using the `contact_email` field instead of requiring authentication
- The `user_id` field can be NULL for unauthenticated users, which is perfectly fine

**Note:** This is a permissive policy that allows public inserts. If you need more security later, you can restrict it, but for now this ensures bookings work for all users.

## Testing

After applying the fix:
1. Try submitting a booking from the tours page (without being logged in)
2. Try submitting a vehicle booking (without being logged in)
3. Both should work without permission errors

## If Bookings Don't Load in Dashboard

If bookings are not showing in the admin dashboard after running migration 004, run the additional migration:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy and paste the contents of `supabase/migrations/005_fix_bookings_select_policy.sql`
3. Click **Run**

This migration creates a simpler SELECT policy that should work more reliably for admins viewing bookings.

