-- Add new fields to tours table for detailed view
-- Run this in your Supabase SQL Editor

ALTER TABLE tours ADD COLUMN IF NOT EXISTS overview TEXT;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS itinerary TEXT; -- Storing JSON as text for flexibility
ALTER TABLE tours ADD COLUMN IF NOT EXISTS includes TEXT[];
ALTER TABLE tours ADD COLUMN IF NOT EXISTS excludes TEXT[];
ALTER TABLE tours ADD COLUMN IF NOT EXISTS gallery_urls TEXT[];

-- Update RLS to ensure these new columns are covered (Standard RLS on table usually covers all columns, but good to check)
-- "Tours are viewable by everyone" policy covers SELECT on * so it should include new columns automatically.
-- "Admins can insert tours" and "Admins can update tours" also cover * usually.

-- Comment on columns
COMMENT ON COLUMN tours.overview IS 'Detailed overview of the tour';
COMMENT ON COLUMN tours.itinerary IS 'JSON string or text describing the daily itinerary';
COMMENT ON COLUMN tours.includes IS 'Array of items included in the tour package';
COMMENT ON COLUMN tours.excludes IS 'Array of items excluded from the tour package';
COMMENT ON COLUMN tours.gallery_urls IS 'Array of additional image URLs for the gallery';
