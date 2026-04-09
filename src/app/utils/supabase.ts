/**
 * supabase.ts - Supabase client initialization
 * 
 * This module initializes and exports the Supabase client:
 * - Creates Supabase client using environment variables
 * - Provides utility function for server URL generation
 * - Validates required environment variables on startup
 * 
 * Environment Variables:
 * - VITE_SUPABASE_URL: Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: Supabase anonymous/public key
 * 
 * getServerUrl:
 * - Extracts project ID from Supabase URL
 * - Constructs Edge Function URL for image upload
 * - Used by uploadImage function in UniverseOperationsContext
 * 
 * TODO: Add environment variable validation at build time
 * TODO: Add support for custom server URL
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getServerUrl = () => {
  const projectId = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
  return `https://${projectId}.supabase.co/functions/v1/make-server-e5956044`;
};
