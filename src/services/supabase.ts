import { createClient } from '@supabase/supabase-js';
import { World, Page, PageConnection, UserSession } from '@/types';

// Note: In production, these should be environment variables
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication services
export const authService = {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// World services
export const worldService = {
  async createWorld(world: Omit<World, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('worlds')
      .insert([world])
      .select()
      .single();
    return { data, error };
  },

  async getWorlds(userId: string) {
    const { data, error } = await supabase
      .from('worlds')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    return { data, error };
  },

  async getWorld(id: string) {
    const { data, error } = await supabase
      .from('worlds')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async updateWorld(id: string, updates: Partial<World>) {
    const { data, error } = await supabase
      .from('worlds')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deleteWorld(id: string) {
    const { error } = await supabase
      .from('worlds')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Page services
export const pageService = {
  async createPage(page: Omit<Page, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('pages')
      .insert([page])
      .select()
      .single();
    return { data, error };
  },

  async getPages(worldId: string) {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('world_id', worldId)
      .order('created_at', { ascending: true });
    return { data, error };
  },

  async getPage(id: string) {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async updatePage(id: string, updates: Partial<Page>) {
    const { data, error } = await supabase
      .from('pages')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deletePage(id: string) {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Connection services
export const connectionService = {
  async createConnection(connection: Omit<PageConnection, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('page_connections')
      .insert([connection])
      .select()
      .single();
    return { data, error };
  },

  async getConnections(worldId: string) {
    const { data, error } = await supabase
      .from('page_connections')
      .select(`
        *,
        source_page:pages!source_page_id(id, title),
        target_page:pages!target_page_id(id, title)
      `)
      .eq('source_page.world_id', worldId);
    return { data, error };
  },

  async deleteConnection(id: string) {
    const { error } = await supabase
      .from('page_connections')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Session services
export const sessionService = {
  async createSession(session: Omit<UserSession, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('user_sessions')
      .insert([session])
      .select()
      .single();
    return { data, error };
  },

  async getSession(sessionId: string) {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();
    return { data, error };
  },

  async updateSession(id: string, updates: Partial<UserSession>) {
    const { data, error } = await supabase
      .from('user_sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  }
};
