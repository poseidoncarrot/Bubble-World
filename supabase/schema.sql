-- Supabase Database Schema for Bubble World
-- 
-- This schema defines the database structure for the application:
-- - User profiles with additional metadata
-- - Universes (worlds) owned by users
-- - Pages within universes
-- - Subsections within pages
-- - Connections between pages and subsections
-- 
-- Security:
-- - Row Level Security (RLS) enabled on all tables
-- - Users can only access their own data
-- - Cascade deletes for data integrity
-- 
-- Extensions:
-- - uuid-ossp: UUID generation for primary keys

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table to store additional user information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add foreign key constraint only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_id_fkey'
    AND connamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    ALTER TABLE profiles
      ADD CONSTRAINT profiles_id_fkey
      FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create universes table
CREATE TABLE IF NOT EXISTS universes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  settings JSONB DEFAULT '{}',
  categories TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add universes foreign key constraint only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'universes_user_id_fkey'
    AND connamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    ALTER TABLE universes
      ADD CONSTRAINT universes_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  universe_id UUID REFERENCES universes(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  category TEXT,
  position JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add pages foreign key constraint only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'pages_universe_id_fkey'
    AND connamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    ALTER TABLE pages
      ADD CONSTRAINT pages_universe_id_fkey
      FOREIGN KEY (universe_id) REFERENCES universes(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Ensure cascade constraint exists by dropping and recreating if needed
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'pages_universe_id_fkey'
    AND connamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    ALTER TABLE pages DROP CONSTRAINT pages_universe_id_fkey;
    ALTER TABLE pages
      ADD CONSTRAINT pages_universe_id_fkey
      FOREIGN KEY (universe_id) REFERENCES universes(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create subsections table
CREATE TABLE IF NOT EXISTS subsections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_id UUID REFERENCES pages(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  position JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add subsections foreign key constraint only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'subsections_page_id_fkey'
    AND connamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    ALTER TABLE subsections
      ADD CONSTRAINT subsections_page_id_fkey
      FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Ensure cascade constraint exists by dropping and recreating if needed
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'subsections_page_id_fkey'
    AND connamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    ALTER TABLE subsections DROP CONSTRAINT subsections_page_id_fkey;
    ALTER TABLE subsections
      ADD CONSTRAINT subsections_page_id_fkey
      FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create connections table
CREATE TABLE IF NOT EXISTS connections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  universe_id UUID REFERENCES universes(id) NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('page', 'subsection')),
  source_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('page', 'subsection')),
  target_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add connections foreign key constraint only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'connections_universe_id_fkey'
    AND connamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    ALTER TABLE connections
      ADD CONSTRAINT connections_universe_id_fkey
      FOREIGN KEY (universe_id) REFERENCES universes(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add unique constraint only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'unique_connection'
    AND connamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    ALTER TABLE connections
      ADD CONSTRAINT unique_connection UNIQUE (source_type, source_id, target_type, target_id);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS universes_user_id_idx ON universes(user_id);
CREATE INDEX IF NOT EXISTS pages_universe_id_idx ON pages(universe_id);
CREATE INDEX IF NOT EXISTS subsections_page_id_idx ON subsections(page_id);
CREATE INDEX IF NOT EXISTS connections_universe_id_idx ON connections(universe_id);

-- Enable Row Level Security (RLS) only if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE tablename = 'profiles'
    AND rowsecurity = true
  ) THEN
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE tablename = 'universes'
    AND rowsecurity = true
  ) THEN
    ALTER TABLE universes ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE tablename = 'pages'
    AND rowsecurity = true
  ) THEN
    ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE tablename = 'subsections'
    AND rowsecurity = true
  ) THEN
    ALTER TABLE subsections ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE tablename = 'connections'
    AND rowsecurity = true
  ) THEN
    ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create RLS policies only if they don't exist
-- Profiles policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view own profile') THEN
    CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
    CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile') THEN
    CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Universes policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'universes' AND policyname = 'Users can view own universes') THEN
    CREATE POLICY "Users can view own universes" ON universes FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'universes' AND policyname = 'Users can create own universes') THEN
    CREATE POLICY "Users can create own universes" ON universes FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'universes' AND policyname = 'Users can update own universes') THEN
    CREATE POLICY "Users can update own universes" ON universes FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'universes' AND policyname = 'Users can delete own universes') THEN
    CREATE POLICY "Users can delete own universes" ON universes FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Pages policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pages' AND policyname = 'Users can view pages of own universes') THEN
    CREATE POLICY "Users can view pages of own universes" ON pages FOR SELECT USING (
      EXISTS (SELECT 1 FROM universes WHERE universes.id = pages.universe_id AND universes.user_id = auth.uid())
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pages' AND policyname = 'Users can create pages in own universes') THEN
    CREATE POLICY "Users can create pages in own universes" ON pages FOR INSERT WITH CHECK (
      EXISTS (SELECT 1 FROM universes WHERE universes.id = pages.universe_id AND universes.user_id = auth.uid())
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pages' AND policyname = 'Users can update pages of own universes') THEN
    CREATE POLICY "Users can update pages of own universes" ON pages FOR UPDATE USING (
      EXISTS (SELECT 1 FROM universes WHERE universes.id = pages.universe_id AND universes.user_id = auth.uid())
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pages' AND policyname = 'Users can delete pages of own universes') THEN
    CREATE POLICY "Users can delete pages of own universes" ON pages FOR DELETE USING (
      EXISTS (SELECT 1 FROM universes WHERE universes.id = pages.universe_id AND universes.user_id = auth.uid())
    );
  END IF;
END $$;

-- Subsections policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subsections' AND policyname = 'Users can view subsections of own universes') THEN
    CREATE POLICY "Users can view subsections of own universes" ON subsections FOR SELECT USING (
      EXISTS (
        SELECT 1
        FROM pages
        JOIN universes ON universes.id = pages.universe_id
        WHERE pages.id = subsections.page_id
        AND universes.user_id = auth.uid()
      )
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subsections' AND policyname = 'Users can create subsections in own universes') THEN
    CREATE POLICY "Users can create subsections in own universes" ON subsections FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1
        FROM pages
        JOIN universes ON universes.id = pages.universe_id
        WHERE pages.id = subsections.page_id
        AND universes.user_id = auth.uid()
      )
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subsections' AND policyname = 'Users can update subsections of own universes') THEN
    CREATE POLICY "Users can update subsections of own universes" ON subsections FOR UPDATE USING (
      EXISTS (
        SELECT 1
        FROM pages
        JOIN universes ON universes.id = pages.universe_id
        WHERE pages.id = subsections.page_id
        AND universes.user_id = auth.uid()
      )
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subsections' AND policyname = 'Users can delete subsections of own universes') THEN
    CREATE POLICY "Users can delete subsections of own universes" ON subsections FOR DELETE USING (
      EXISTS (
        SELECT 1
        FROM pages
        JOIN universes ON universes.id = pages.universe_id
        WHERE pages.id = subsections.page_id
        AND universes.user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- Connections policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'connections' AND policyname = 'Users can view connections of own universes') THEN
    CREATE POLICY "Users can view connections of own universes" ON connections FOR SELECT USING (
      EXISTS (SELECT 1 FROM universes WHERE universes.id = connections.universe_id AND universes.user_id = auth.uid())
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'connections' AND policyname = 'Users can create connections in own universes') THEN
    CREATE POLICY "Users can create connections in own universes" ON connections FOR INSERT WITH CHECK (
      EXISTS (SELECT 1 FROM universes WHERE universes.id = connections.universe_id AND universes.user_id = auth.uid())
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'connections' AND policyname = 'Users can delete connections of own universes') THEN
    CREATE POLICY "Users can delete connections of own universes" ON connections FOR DELETE USING (
      EXISTS (SELECT 1 FROM universes WHERE universes.id = connections.universe_id AND universes.user_id = auth.uid())
    );
  END IF;
END $$;

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS set_profiles_updated_at ON profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_universes_updated_at ON universes;
CREATE TRIGGER set_universes_updated_at BEFORE UPDATE ON universes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_pages_updated_at ON pages;
CREATE TRIGGER set_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_subsections_updated_at ON subsections;
CREATE TRIGGER set_subsections_updated_at BEFORE UPDATE ON subsections FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
