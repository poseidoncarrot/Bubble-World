import { supabase } from './supabase';
import { Universe, Page, Subsection, Connection } from '../types';

// Profile operations
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, updates: Partial<{ full_name: string; avatar_url: string }>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Universe operations
export const getUniverses = async (userId: string): Promise<Universe[]> => {
  const { data, error } = await supabase
    .from('universes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Transform database records to Universe type
  return data.map(transformUniverse);
};

export const createUniverse = async (universe: Omit<Universe, 'id'> & { user_id: string }): Promise<Universe> => {
  const { data, error } = await supabase
    .from('universes')
    .insert({
      user_id: universe.user_id,
      name: universe.name,
      description: universe.description,
      icon: universe.icon,
      settings: universe.settings || {},
      categories: universe.categories || []
    })
    .select()
    .single();
  
  if (error) throw error;
  return transformUniverse(data);
};

export const updateUniverse = async (id: string, updates: Partial<Universe>): Promise<Universe> => {
  const { data, error } = await supabase
    .from('universes')
    .update({
      name: updates.name,
      description: updates.description,
      icon: updates.icon,
      settings: updates.settings || {},
      categories: updates.categories || []
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return transformUniverse(data);
};

export const deleteUniverse = async (id: string): Promise<void> => {
  try {
    // First, get all pages for this universe
    const { data: pages, error: pagesError } = await supabase
      .from('pages')
      .select('id')
      .eq('universe_id', id);
    
    if (pagesError) throw pagesError;
    
    // Delete all subsections for all pages in this universe
    if (pages && pages.length > 0) {
      const pageIds = pages.map(page => page.id);
      const { error: subsectionsError } = await supabase
        .from('subsections')
        .delete()
        .in('page_id', pageIds);
      
      if (subsectionsError) throw subsectionsError;
    }
    
    // Delete all pages for this universe
    const { error: deletePagesError } = await supabase
      .from('pages')
      .delete()
      .eq('universe_id', id);
    
    if (deletePagesError) throw deletePagesError;
    
    // Finally, delete the universe
    const { error } = await supabase
      .from('universes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    throw error;
  }
};

// Page operations
export const getPages = async (universeId: string): Promise<Page[]> => {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('universe_id', universeId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  
  // Get subsections for each page
  const pagesWithSubsections = await Promise.all(
    data.map(async (page) => {
      const subsections = await getSubsections(page.id);
      return transformPage({ ...page, subsections });
    })
  );
  
  return pagesWithSubsections;
};

export const createPage = async (page: Omit<Page, 'id'> & { universe_id: string }): Promise<Page> => {
  const { data, error } = await supabase
    .from('pages')
    .insert({
      universe_id: page.universe_id,
      title: page.title,
      description: page.description,
      cover_image: page.coverImage,
      category: page.category,
      position: page.position || {}
    })
    .select()
    .single();
  
  if (error) throw error;
  return transformPage(data);
};

export const updatePage = async (id: string, updates: Partial<Page>): Promise<Page> => {
  const { data, error } = await supabase
    .from('pages')
    .update({
      title: updates.title,
      description: updates.description,
      cover_image: updates.coverImage,
      category: updates.category,
      position: updates.position || {}
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return transformPage(data);
};

export const deletePage = async (id: string): Promise<void> => {
  try {
    // First, delete all subsections for this page
    const { error: subsectionsError } = await supabase
      .from('subsections')
      .delete()
      .eq('page_id', id);
    
    if (subsectionsError) throw subsectionsError;
    
    // Then delete the page
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    throw error;
  }
};

// Subsection operations
export const getSubsections = async (pageId: string): Promise<Subsection[]> => {
  const { data, error } = await supabase
    .from('subsections')
    .select('*')
    .eq('page_id', pageId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  
  return data.map(transformSubsection);
};

export const createSubsection = async (subsection: Omit<Subsection, 'id'> & { page_id: string }): Promise<Subsection> => {
  const { data, error } = await supabase
    .from('subsections')
    .insert({
      page_id: subsection.page_id,
      title: subsection.title,
      content: subsection.content,
      position: subsection.position || {}
    })
    .select()
    .single();
  
  if (error) throw error;
  return transformSubsection(data);
};

export const updateSubsection = async (id: string, updates: Partial<Subsection>): Promise<Subsection> => {
  const { data, error } = await supabase
    .from('subsections')
    .update({
      title: updates.title,
      content: updates.content,
      position: updates.position || {}
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return transformSubsection(data);
};

export const deleteSubsection = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('subsections')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Connection operations
export const getConnections = async (universeId: string): Promise<Connection[]> => {
  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .eq('universe_id', universeId);
  
  if (error) throw error;
  
  return data.map(transformConnection);
};

export const createConnection = async (connection: Omit<Connection, 'id'> & { universe_id: string }): Promise<Connection> => {
  const { data, error } = await supabase
    .from('connections')
    .insert({
      universe_id: connection.universe_id,
      source_type: connection.sourceType,
      source_id: connection.sourceId,
      target_type: connection.targetType,
      target_id: connection.targetId
    })
    .select()
    .single();
  
  if (error) throw error;
  return transformConnection(data);
};

export const deleteConnection = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('connections')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Helper functions to transform database records to app types
const transformUniverse = (data: any): Universe => ({
  id: data.id,
  name: data.name,
  description: data.description || '',
  icon: data.icon,
  pages: [], // Will be loaded separately
  settings: data.settings || {},
  categories: data.categories || []
});

const transformPage = (data: any): Page => ({
  id: data.id,
  title: data.title,
  description: data.description || '',
  coverImage: data.cover_image,
  subsections: data.subsections || [],
  connections: [], // Will be loaded separately
  category: data.category
});

const transformSubsection = (data: any): Subsection => ({
  id: data.id,
  title: data.title,
  content: data.content || '',
  connections: [] // Will be loaded separately
});

const transformConnection = (data: any): Connection => ({
  id: data.id,
  sourceType: data.source_type,
  sourceId: data.source_id,
  targetType: data.target_type,
  targetId: data.target_id
});
