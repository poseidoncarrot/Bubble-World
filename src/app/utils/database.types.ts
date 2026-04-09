// Database record types (matching Supabase schema)
export interface DbUniverse {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  icon: string | null;
  settings: Record<string, unknown> | null;
  categories: string[] | null;
  created_at: string;
}

export interface DbPage {
  id: string;
  universe_id: string;
  title: string;
  description: string | null;
  cover_image: string | null;
  category: string | null;
  position: Record<string, unknown> | null;
  created_at: string;
}

export interface DbSubsection {
  id: string;
  page_id: string;
  title: string;
  content: string | null;
  position: Record<string, unknown> | null;
  created_at: string;
}

export interface DbConnection {
  id: string;
  universe_id: string;
  source_type: 'page' | 'subsection';
  source_id: string;
  target_type: 'page' | 'subsection';
  target_id: string;
}

export interface DbProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}
