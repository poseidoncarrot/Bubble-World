-- Supabase Storage Setup for Universe Icons
-- 
-- This script sets up a storage bucket for user-uploaded universe icons:
-- - Creates a public storage bucket for icons
-- - Configures file size limit (5MB)
-- - Restricts to image types (JPEG, PNG, WebP)
-- - Sets up Row Level Security (RLS) policies
-- - Organizes files by user ID in folder structure
-- 
-- File Organization:
-- - Files stored as: {user_id}/{filename}
-- - Each user has their own folder
-- - Public read access for displaying icons
-- - Authenticated write access for uploads
-- 
-- Security:
-- - Users can only access their own icons
-- - Public can read icons (for display)
-- - File size limit prevents abuse
-- - MIME type restriction ensures valid images
--
-- Usage:
-- - Run this script in Supabase SQL Editor
-- - Must be run after schema.sql
-- - Only needs to be run once per project

-- Create universe-icons storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'universe-icons',
  'universe-icons',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- storage.objects already has RLS enabled in Supabase by default
-- so we do NOT ALTER it here.

DO $$
BEGIN
  -- 1) Users can view their own universe icons
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Users can view own universe icons'
  ) THEN
    CREATE POLICY "Users can view own universe icons"
      ON storage.objects FOR SELECT
      TO authenticated
      USING (
        bucket_id = 'universe-icons'
        AND auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;

  -- 2) Users can upload icons to their own folders
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Users can upload own universe icons'
  ) THEN
    CREATE POLICY "Users can upload own universe icons"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'universe-icons'
        AND auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;

  -- 3) Users can update their own universe icons
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Users can update own universe icons'
  ) THEN
    CREATE POLICY "Users can update own universe icons"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (
        bucket_id = 'universe-icons'
        AND auth.uid()::text = (storage.foldername(name))[1]
      )
      WITH CHECK (
        bucket_id = 'universe-icons'
        AND auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;

  -- 4) Users can delete their own universe icons
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Users can delete own universe icons'
  ) THEN
    CREATE POLICY "Users can delete own universe icons"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'universe-icons'
        AND auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;

  -- 5) Public read access for icons in this bucket
  -- IMPORTANT: This makes files readable without auth.
  -- If you want strictly authenticated-only, remove this policy.
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public read access for universe icons'
  ) THEN
    CREATE POLICY "Public read access for universe icons"
      ON storage.objects FOR SELECT
      TO anon, authenticated
      USING (bucket_id = 'universe-icons');
  END IF;
END $$;