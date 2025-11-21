# Admin Dashboard Setup Guide

## Overview
This guide will help you set up the admin dashboard and configure Supabase tables for the Sri Lanka Tourism website.

## 1. Setting Up Supabase Tables

### Step 1: Run the Migration SQL
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and execute it in the SQL Editor

This will create all necessary tables:
- `profiles` - User profiles with roles
- `tours` - Tour packages
- `vehicles` - Vehicle rental options
- `bookings` - Tour and vehicle bookings
- `reviews` - Tourist reviews
- `gallery` - Photo gallery
- `contacts` - Contact form submissions

### Step 2: Create Your First Admin User

You have two options:

#### Option A: Set Admin via Email Pattern
Add this to your `.env.local`:
```env
ADMIN_EMAIL=your-admin@email.com
```

Or use an email ending with `@admin.srilankatourism.com`

#### Option B: Set Admin Role in Database
1. Sign up normally through the website
2. Go to Supabase Dashboard → Table Editor → `profiles`
3. Find your user's profile
4. Update the `role` field to `admin`

#### Option C: Set Admin via User Metadata
When creating a user, set the user metadata:
```json
{
  "role": "admin"
}
```

## 2. Accessing the Admin Dashboard

1. Log in with an admin account
2. Click the "Admin" button in the navigation (visible only to admins)
3. Or navigate directly to `/admin`

## 3. Admin Dashboard Features

The admin dashboard provides:
- **Statistics**: Overview of tours, bookings, vehicles, and reviews
- **Quick Actions**: Links to manage tours, bookings, vehicles, and reviews
- **Recent Bookings**: View latest bookings with status

## 4. Row Level Security (RLS)

All tables have RLS enabled with the following policies:
- **Public tables** (tours, vehicles, gallery): Anyone can read, only admins can write
- **User-specific** (bookings, reviews): Users can view their own, admins can view all
- **Admin-only** (contacts): Only admins can view

## 5. Environment Variables

Make sure your `.env.local` includes:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Admin (optional)
ADMIN_EMAIL=admin@yourdomain.com
```

## 6. Public Access

All pages are now publicly accessible except:
- `/admin/*` - Admin dashboard (requires admin login)

Users can browse tours, book vehicles, view gallery, etc. without logging in.

## 7. Next Steps

After setting up the tables:
1. Add tour packages in the `tours` table
2. Add vehicles in the `vehicles` table
3. Upload gallery images
4. Manage bookings and reviews through the admin dashboard

## Troubleshooting

### Admin button not showing?
- Check that your user has `role = 'admin'` in the profiles table
- Or set `ADMIN_EMAIL` in environment variables
- Or use an email ending with `@admin.srilankatourism.com`

### Cannot access admin dashboard?
- Make sure you're logged in
- Check that your user has admin role
- Verify RLS policies are set correctly

### Tables not found?
- Make sure you ran the migration SQL
- Check Supabase Dashboard → Table Editor to verify tables exist

