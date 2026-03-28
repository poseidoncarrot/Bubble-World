-- Bubble World Initial Database Schema
-- This file creates all the necessary tables for the Bubble World MVP

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Worlds table for worldbuilding projects
CREATE TABLE IF NOT EXISTS public.worlds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pages table for hierarchical content
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  world_id UUID REFERENCES public.worlds(id) ON DELETE CASCADE,
  parent_page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{"type": "doc", "content": []}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page connections for bubble map relationships
CREATE TABLE IF NOT EXISTS public.page_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
  target_page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
  connection_type TEXT DEFAULT 'related' CHECK (connection_type IN ('related', 'sub-section', 'reference')),
  strength INTEGER DEFAULT 1 CHECK (strength >= 1 AND strength <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions for trial tracking
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL,
  trial_started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  trial_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '5 minutes'),
  is_premium BOOLEAN DEFAULT false,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_worlds_user_id ON public.worlds(user_id);
CREATE INDEX IF NOT EXISTS idx_worlds_updated_at ON public.worlds(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_pages_world_id ON public.pages(world_id);
CREATE INDEX IF NOT EXISTS idx_pages_parent_id ON public.pages(parent_page_id);
CREATE INDEX IF NOT EXISTS idx_pages_updated_at ON public.pages(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_connections_source ON public.page_connections(source_page_id);
CREATE INDEX IF NOT EXISTS idx_connections_target ON public.page_connections(target_page_id);
CREATE INDEX IF NOT EXISTS idx_connections_world ON public.page_connections(
  source_page_id
) WHERE source_page_id IN (SELECT id FROM public.pages);

CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON public.user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON public.user_sessions(trial_expires_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_worlds_updated_at
  BEFORE UPDATE ON public.worlds
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worlds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Worlds policies
CREATE POLICY "Users can view own worlds" ON public.worlds
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own worlds" ON public.worlds
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own worlds" ON public.worlds
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own worlds" ON public.worlds
  FOR DELETE USING (auth.uid() = user_id);

-- Pages policies
CREATE POLICY "Users can view pages in own worlds" ON public.pages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.worlds 
      WHERE id = world_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create pages in own worlds" ON public.pages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.worlds 
      WHERE id = world_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update pages in own worlds" ON public.pages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.worlds 
      WHERE id = world_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete pages in own worlds" ON public.pages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.worlds 
      WHERE id = world_id AND user_id = auth.uid()
    )
  );

-- Page connections policies
CREATE POLICY "Users can view connections for own worlds" ON public.page_connections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.pages p
      JOIN public.worlds w ON w.id = p.world_id
      WHERE (p.id = source_page_id OR p.id = target_page_id) 
        AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create connections for own worlds" ON public.page_connections
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pages p
      JOIN public.worlds w ON w.id = p.world_id
      WHERE (p.id = source_page_id OR p.id = target_page_id) 
        AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete connections for own worlds" ON public.page_connections
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.pages p
      JOIN public.worlds w ON w.id = p.world_id
      WHERE (p.id = source_page_id OR p.id = target_page_id) 
        AND w.user_id = auth.uid()
    )
  );

-- User sessions policies (more permissive for trial users)
CREATE POLICY "Users can view own sessions" ON public.user_sessions
  FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can create sessions" ON public.user_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can update own sessions" ON public.user_sessions
  FOR UPDATE USING (user_id = auth.uid() OR user_id IS NULL);

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.user_sessions 
  WHERE trial_expires_at < NOW() - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql;

-- Create a sample world for testing (optional)
INSERT INTO public.worlds (id, user_id, title, description, settings) VALUES
  ('00000000-0000-0000-0000-000000000001', null, 'Sample World', 'A sample world for testing', '{}')
ON CONFLICT (id) DO NOTHING;

-- Create sample pages
INSERT INTO public.pages (id, world_id, parent_page_id, title, content, metadata) VALUES
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', null, 'Geography', '{"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "The physical landscape of your world..."}]}]}', '{}'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', null, 'History', '{"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "The timeline of events that shaped your world..."}]}]}', '{}'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', null, 'Characters', '{"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "The inhabitants of your world..."}]}]}', '{}'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Continents', '{"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Major landmasses and their features..."}]}]}', '{}'),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Climate', '{"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Weather patterns and climate zones..."}]}]}', '{}')
ON CONFLICT DO NOTHING;

-- Create sample connections
INSERT INTO public.page_connections (source_page_id, target_page_id, connection_type, strength) VALUES
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'related', 5),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'related', 3),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'related', 4),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000006', 'related', 2)
ON CONFLICT DO NOTHING;
